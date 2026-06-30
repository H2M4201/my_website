import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/db/prisma'
import {
  loginWithUsername,
  forgotPassword,
  resetPasswordWithToken,
  changePassword,
  getUserById,
  verifyToken,
  validatePasswordComplexity,
  blacklistToken,
  isTokenBlacklisted,
  AuthError,
  AccountLockedError,
  PasswordExpiredError,
} from '@/db/services/authService'

jest.mock('@/db/prisma', () => ({
  prisma: {
    $queryRawUnsafe: jest.fn(),
    $executeRawUnsafe: jest.fn(),
  },
}))

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockJwt = jwt as jest.Mocked<typeof jwt>
const mockPrisma = prisma as unknown as {
  $queryRawUnsafe: jest.Mock
  $executeRawUnsafe: jest.Mock
}

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    username: 'admin',
    password: '$2a$12$hashedpassword',
    email: 'admin@example.com',
    name: 'Administrator',
    roleId: null,
    failedLoginAttempts: 0,
    lockedUntil: null as Date | null,
    passwordChangedAt: new Date(),
    ...overrides,
  }
}

function mockJwtSign(payload: object) {
  const token = `jwt.${JSON.stringify(payload)}.signature`
  mockJwt.sign.mockReturnValue(token as any)
  return token
}

function mockJwtVerify(decoded: object) {
  mockJwt.verify.mockReturnValue(decoded)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockPrisma.$queryRawUnsafe.mockResolvedValue([])
  mockPrisma.$executeRawUnsafe.mockResolvedValue(1)
  mockBcrypt.compare.mockResolvedValue(false as never)
  mockBcrypt.hash.mockResolvedValue('$2a$12$newhashedpassword' as never)
})

// ===== loginWithUsername =====
describe('loginWithUsername', () => {
  it('returns token and user on successful login', async () => {
    const user = makeUser()
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(true as never)
    const token = mockJwtSign({ id: 1, username: 'admin', roleId: null })

    const result = await loginWithUsername('admin', 'correct-password')

    expect(result.token).toBe(token)
    expect(result.user.username).toBe('admin')
    expect(result.user.email).toBe('admin@example.com')
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledTimes(1)
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
      expect.stringContaining('"failedLoginAttempts" = 0'),
      1
    )
    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: 1, username: 'admin', roleId: null },
      process.env.JWT_SECRET!,
      { algorithm: 'HS256', expiresIn: '24h' }
    )
  })

  it('throws AuthError when user not found', async () => {
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([])

    await expect(loginWithUsername('nonexistent', 'password'))
      .rejects.toThrow(AuthError)
    await expect(loginWithUsername('nonexistent', 'password'))
      .rejects.toThrow('Invalid username or password')
  })

  it('throws AuthError on invalid password and increments attempts', async () => {
    const user = makeUser({ failedLoginAttempts: 0 })
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(false as never)

    await expect(loginWithUsername('admin', 'wrong'))
      .rejects.toThrow(AuthError)
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
      expect.stringContaining('"failedLoginAttempts" = $1'),
      1, 1
    )
  })

  it('locks account after 5 failed attempts', async () => {
    const user = makeUser({ failedLoginAttempts: 4 })
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(false as never)

    await expect(loginWithUsername('admin', 'wrong'))
      .rejects.toThrow(AccountLockedError)
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
      expect.stringContaining('"lockedUntil"'),
      5, expect.any(Date), 1
    )
  })

  it('throws AccountLockedError when account is locked', async () => {
    const future = new Date(Date.now() + 10 * 60 * 1000)
    const user = makeUser({ lockedUntil: future })
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    await expect(loginWithUsername('admin', 'password'))
      .rejects.toThrow(AccountLockedError)
  })

  it('allows login when lockout has expired', async () => {
    const past = new Date(Date.now() - 10 * 60 * 1000)
    const user = makeUser({ lockedUntil: past })
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(true as never)
    mockJwtSign({ id: 1, username: 'admin', roleId: null })

    const result = await loginWithUsername('admin', 'password')

    expect(result.user.username).toBe('admin')
  })

  it('throws PasswordExpiredError when password is older than 60 days', async () => {
    const oldDate = new Date(Date.now() - 61 * 24 * 60 * 60 * 1000)
    const user = makeUser({ passwordChangedAt: oldDate })
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(true as never)

    await expect(loginWithUsername('admin', 'password'))
      .rejects.toThrow(PasswordExpiredError)
  })

  it('resets failed attempts on successful login', async () => {
    const user = makeUser({ failedLoginAttempts: 3 })
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(true as never)
    mockJwtSign({ id: 1, username: 'admin', roleId: null })

    await loginWithUsername('admin', 'password')

    expect(mockPrisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('"failedLoginAttempts" = 0'),
      1
    )
  })
})

// ===== forgotPassword =====
describe('forgotPassword', () => {
  it('returns tempPassword in development mode', async () => {
    const user = { id: 1, username: 'admin', email: 'admin@example.com' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.hash.mockResolvedValueOnce('$2a$12$hashednew' as never)

    const result = await forgotPassword('admin')

    expect(result.message).toContain('If the account exists')
    expect(result.tempPassword).toBeDefined()
    expect(result.tempPassword!.length).toBe(16)
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalled()
  })

  it('returns generic message for non-existent user', async () => {
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([])

    const result = await forgotPassword('nonexistent')

    expect(result.message).toContain('If the account exists')
    expect(result.tempPassword).toBeUndefined()
    expect(mockPrisma.$executeRawUnsafe).not.toHaveBeenCalled()
  })

  it('looks up by email', async () => {
    const user = { id: 1, username: 'admin', email: 'admin@example.com' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    await forgotPassword('admin@example.com')

    expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
      expect.stringContaining('username = $1 OR email = $1'),
      'admin@example.com'
    )
  })

  it('stores reset token and expiry in database', async () => {
    const user = { id: 1, username: 'admin', email: 'admin@example.com' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    await forgotPassword('admin')

    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
      expect.stringContaining('"passwordResetToken"'),
      expect.any(String), expect.any(Date), expect.any(String),
      expect.any(Date), 1
    )
  })
})

// ===== resetPasswordWithToken =====
describe('resetPasswordWithToken', () => {
  it('resets password with valid token', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000)
    const user = {
      id: 1, username: 'admin',
      passwordResetToken: 'valid-token',
      passwordResetTokenExpires: future,
    }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    const result = await resetPasswordWithToken('valid-token', 'NewPass1!')

    expect(result.message).toBe('Password has been reset successfully.')
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalled()
  })

  it('throws AuthError for invalid token', async () => {
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([])

    await expect(resetPasswordWithToken('invalid-token', 'NewPass1!'))
      .rejects.toThrow(AuthError)
  })

  it('throws AuthError for expired token', async () => {
    const past = new Date(Date.now() - 10 * 60 * 1000)
    const user = {
      id: 1, username: 'admin',
      passwordResetToken: 'expired-token',
      passwordResetTokenExpires: past,
    }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    await expect(resetPasswordWithToken('expired-token', 'NewPass1!'))
      .rejects.toThrow('Reset token has expired')
  })

  it('throws AuthError for weak new password', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000)
    const user = {
      id: 1, username: 'admin',
      passwordResetToken: 'valid-token',
      passwordResetTokenExpires: future,
    }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    await expect(resetPasswordWithToken('valid-token', 'short'))
      .rejects.toThrow('at least 8 characters')
  })
})

// ===== changePassword =====
describe('changePassword', () => {
  it('changes password successfully', async () => {
    const user = { id: 1, password: '$2a$12$oldhash' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare
      .mockResolvedValueOnce(true as never)
      .mockResolvedValueOnce(false as never)

    const result = await changePassword(1, 'oldPass1!', 'NewPass2@')

    expect(result.message).toBe('Password changed successfully')
    expect(mockBcrypt.hash).toHaveBeenCalledWith('NewPass2@', 12)
  })

  it('throws AuthError for wrong current password', async () => {
    const user = { id: 1, password: '$2a$12$oldhash' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare.mockResolvedValueOnce(false as never)

    await expect(changePassword(1, 'wrong', 'NewPass2@'))
      .rejects.toThrow('Current password is incorrect')
  })

  it('throws AuthError when new password matches current', async () => {
    const user = { id: 1, password: '$2a$12$oldhash' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare
      .mockResolvedValueOnce(true as never)
      .mockResolvedValueOnce(true as never)

    await expect(changePassword(1, 'oldPass1!', 'SamePass1!'))
      .rejects.toThrow('must be different')
  })

  it('throws AuthError for weak new password', async () => {
    const user = { id: 1, password: '$2a$12$oldhash' }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])
    mockBcrypt.compare
      .mockResolvedValueOnce(true as never)
      .mockResolvedValueOnce(false as never)

    await expect(changePassword(1, 'oldPass1!', 'short'))
      .rejects.toThrow('at least 8 characters')
  })

  it('throws AuthError when user not found', async () => {
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([])

    await expect(changePassword(999, 'oldPass1!', 'NewPass2@'))
      .rejects.toThrow('User not found')
  })
})

// ===== getUserById =====
describe('getUserById', () => {
  it('returns user DTO', async () => {
    const user = { id: 1, username: 'admin', email: 'a@b.com', name: 'Admin', roleId: 1 }
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([user])

    const result = await getUserById(1)

    expect(result.id).toBe(1)
    expect(result.username).toBe('admin')
    expect(result.email).toBe('a@b.com')
  })

  it('throws AuthError when user not found', async () => {
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([])

    await expect(getUserById(999)).rejects.toThrow('User not found')
  })
})

// ===== validatePasswordComplexity =====
describe('validatePasswordComplexity', () => {
  it('returns null for valid passwords', () => {
    expect(validatePasswordComplexity('Abcdef1!')).toBeNull()
    expect(validatePasswordComplexity('Str0ng!Pass')).toBeNull()
    expect(validatePasswordComplexity('XyZ123!@#')).toBeNull()
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(validatePasswordComplexity('Ab1!')).toContain('8 characters')
  })

  it('rejects passwords without uppercase', () => {
    expect(validatePasswordComplexity('abcdef1!')).toContain('uppercase')
  })

  it('rejects passwords without lowercase', () => {
    expect(validatePasswordComplexity('ABCDEF1!')).toContain('lowercase')
  })

  it('rejects passwords without digit', () => {
    expect(validatePasswordComplexity('Abcdefgh!')).toContain('digit')
  })

  it('rejects passwords without special character', () => {
    expect(validatePasswordComplexity('Abcdefg1')).toContain('special character')
  })
})

// ===== verifyToken / blacklist =====
describe('verifyToken', () => {
  it('returns decoded payload for valid token', () => {
    const payload = { id: 1, username: 'admin', roleId: null }
    mockJwtVerify(payload)

    const result = verifyToken('valid-token')

    expect(result).toEqual(payload)
    expect(mockJwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    })
  })

  it('throws AuthError for invalid token', () => {
    mockJwt.verify.mockImplementation(() => { throw new Error('invalid') })

    expect(() => verifyToken('invalid-token')).toThrow('Invalid or expired token')
  })

  it('throws AuthError for blacklisted token', () => {
    blacklistToken('blacklisted-token', 60_000)

    expect(() => verifyToken('blacklisted-token')).toThrow('Token has been revoked')
  })

  it('blacklist removes tokens immediately', () => {
    blacklistToken('revoke-me', 60_000)
    expect(isTokenBlacklisted('revoke-me')).toBe(true)
  })

  it('returns false for non-blacklisted token', () => {
    expect(isTokenBlacklisted('never-added')).toBe(false)
  })

  it('throws AuthError for expired JWT', () => {
    const err = Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' })
    mockJwt.verify.mockImplementation(() => { throw err })

    expect(() => verifyToken('expired-jwt')).toThrow('Invalid or expired token')
  })
})

// ===== blacklistToken / isTokenBlacklisted =====
describe('token blacklist', () => {
  it('blacklists and detects tokens', () => {
    blacklistToken('token-1', 60_000)

    expect(isTokenBlacklisted('token-1')).toBe(true)
    expect(isTokenBlacklisted('token-2')).toBe(false)
  })
})
