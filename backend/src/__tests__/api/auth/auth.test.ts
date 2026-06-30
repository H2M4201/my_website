import request from 'supertest'
import { createApp } from '@/app'
import * as authService from '@/db/services/authService'

jest.mock('@/db/services/authService', () => {
  const actual = jest.requireActual<typeof import('@/db/services/authService')>(
    '@/db/services/authService'
  )
  return {
    ...actual,
    loginWithUsername: jest.fn(),
    forgotPassword: jest.fn(),
    resetPasswordWithToken: jest.fn(),
    changePassword: jest.fn(),
    getUserById: jest.fn(),
    verifyToken: jest.fn(),
    blacklistToken: jest.fn(),
    validatePasswordComplexity: actual.validatePasswordComplexity,
    AuthError: actual.AuthError,
    AccountLockedError: actual.AccountLockedError,
    PasswordExpiredError: actual.PasswordExpiredError,
  }
})

const app = createApp()

const mockLogin = authService.loginWithUsername as jest.Mock
const mockForgotPassword = authService.forgotPassword as jest.Mock
const mockResetPassword = authService.resetPasswordWithToken as jest.Mock
const mockChangePassword = authService.changePassword as jest.Mock
const mockGetUserById = authService.getUserById as jest.Mock
const mockVerifyToken = authService.verifyToken as jest.Mock
const mockBlacklistToken = authService.blacklistToken as jest.Mock

function makeValidTokenPayload() {
  return { id: 1, username: 'admin', roleId: null }
}

function mockAuthAs(user: { id: number; username: string; roleId: number | null }) {
  mockVerifyToken.mockReturnValue(user)
}

const VALID_PASSWORD = 'ValidPass1!'
const NEW_PASSWORD = 'NewPass2@'

beforeEach(() => {
  jest.clearAllMocks()
  mockLogin.mockResolvedValue({
    token: 'mock-jwt-token',
    user: { id: 1, username: 'admin', email: 'admin@example.com', name: 'Administrator', roleId: null },
  })
  mockForgotPassword.mockResolvedValue({
    message: 'If the account exists, a password reset link has been sent.',
  })
  mockResetPassword.mockResolvedValue({ message: 'Password has been reset successfully.' })
  mockChangePassword.mockResolvedValue({ message: 'Password changed successfully' })
  mockGetUserById.mockResolvedValue({
    id: 1, username: 'admin', email: 'admin@example.com', name: 'Administrator', roleId: null,
  })
  mockVerifyToken.mockReturnValue(makeValidTokenPayload())
  mockBlacklistToken.mockImplementation(() => {})
})

// ===== POST /api/v1/admin/auth/login =====
describe('POST /api/v1/admin/auth/login', () => {
  it('returns 200 with user and sets httpOnly cookie on success', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ username: 'admin', password: VALID_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.user).toBeDefined()
    expect(res.body.user.username).toBe('admin')
    expect(res.body.token).toBeUndefined()
    const cookies = res.headers['set-cookie']
    expect(cookies).toBeDefined()
    const tokenCookie = (Array.isArray(cookies) ? cookies : [cookies]).find(
      (c: string) => c.startsWith('token=')
    )
    expect(tokenCookie).toBeDefined()
    expect(tokenCookie).toContain('HttpOnly')
  })

  it('returns 401 for invalid credentials', async () => {
    mockLogin.mockRejectedValueOnce(new authService.AuthError('Invalid username or password'))

    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ username: 'admin', password: 'wrong' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid username or password')
  })

  it('returns 423 when account is locked', async () => {
    const lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
    mockLogin.mockRejectedValueOnce(new authService.AccountLockedError(lockedUntil))

    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ username: 'admin', password: VALID_PASSWORD })

    expect(res.status).toBe(423)
    expect(res.body.error).toContain('Account locked')
    expect(res.body.lockedUntil).toBe(lockedUntil.toISOString())
  })

  it('returns 401 with passwordExpired when password is expired', async () => {
    mockLogin.mockRejectedValueOnce(new authService.PasswordExpiredError())

    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ username: 'admin', password: VALID_PASSWORD })

    expect(res.status).toBe(401)
    expect(res.body.passwordExpired).toBe(true)
  })

  it('returns 400 for missing username', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ password: VALID_PASSWORD })

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing password', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ username: 'admin' })

    expect(res.status).toBe(400)
  })

  it('returns 400 for empty request body', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({})

    expect(res.status).toBe(400)
  })
})

// ===== POST /api/v1/admin/auth/logout =====
describe('POST /api/v1/admin/auth/logout', () => {
  it('returns 200 and clears token cookie', async () => {
    mockVerifyToken.mockReturnValue({ id: 1, username: 'admin', roleId: null, exp: Math.floor(Date.now() / 1000) + 3600 })

    const res = await request(app)
      .post('/api/v1/admin/auth/logout')
      .set('Cookie', ['token=mock-jwt-token'])

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Logged out successfully')
    expect(mockBlacklistToken).toHaveBeenCalled()
  })

  it('returns 200 even without a token', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/logout')

    expect(res.status).toBe(200)
  })
})

// ===== GET /api/v1/admin/auth/me =====
describe('GET /api/v1/admin/auth/me', () => {
  it('returns 200 with user when authenticated via cookie', async () => {
    mockAuthAs(makeValidTokenPayload())

    const res = await request(app)
      .get('/api/v1/admin/auth/me')
      .set('Cookie', ['token=mock-jwt-token'])

    expect(res.status).toBe(200)
    expect(res.body.user).toBeDefined()
    expect(res.body.user.username).toBe('admin')
  })

  it('returns 200 with user when authenticated via Bearer header', async () => {
    mockAuthAs(makeValidTokenPayload())

    const res = await request(app)
      .get('/api/v1/admin/auth/me')
      .set('Authorization', 'Bearer mock-jwt-token')

    expect(res.status).toBe(200)
    expect(res.body.user).toBeDefined()
  })

  it('returns 401 when not authenticated', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .get('/api/v1/admin/auth/me')

    expect(res.status).toBe(401)
  })

  it('returns 401 when token is invalid', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .get('/api/v1/admin/auth/me')
      .set('Cookie', ['token=bad-token'])

    expect(res.status).toBe(401)
  })
})

// ===== POST /api/v1/admin/auth/forgot-password =====
describe('POST /api/v1/admin/auth/forgot-password', () => {
  it('returns 200 with message', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/forgot-password')
      .send({ usernameOrEmail: 'admin' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBeDefined()
  })

  it('returns 200 even for non-existent user', async () => {
    mockForgotPassword.mockResolvedValueOnce({
      message: 'If the account exists, a password reset link has been sent.',
    })

    const res = await request(app)
      .post('/api/v1/admin/auth/forgot-password')
      .send({ usernameOrEmail: 'nonexistent' })

    expect(res.status).toBe(200)
    expect(res.body.message).toContain('If the account exists')
  })

  it('returns 400 for empty input', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/forgot-password')
      .send({})

    expect(res.status).toBe(400)
  })
})

// ===== POST /api/v1/admin/auth/reset-password =====
describe('POST /api/v1/admin/auth/reset-password', () => {
  it('returns 200 on success', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/reset-password')
      .send({ token: 'valid-reset-token', newPassword: NEW_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Password has been reset successfully.')
  })

  it('returns 400 for weak password', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/reset-password')
      .send({ token: 'valid-reset-token', newPassword: 'short' })

    expect(res.status).toBe(400)
  })

  it('returns 401 for invalid token', async () => {
    mockResetPassword.mockRejectedValueOnce(
      new authService.AuthError('Invalid or expired reset token')
    )

    const res = await request(app)
      .post('/api/v1/admin/auth/reset-password')
      .send({ token: 'bad-token', newPassword: NEW_PASSWORD })

    expect(res.status).toBe(401)
  })

  it('returns 400 for missing token', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/reset-password')
      .send({ newPassword: NEW_PASSWORD })

    expect(res.status).toBe(400)
  })
})

// ===== POST /api/v1/admin/auth/change-password =====
describe('POST /api/v1/admin/auth/change-password', () => {
  it('returns 200 on successful password change', async () => {
    mockAuthAs(makeValidTokenPayload())

    const res = await request(app)
      .post('/api/v1/admin/auth/change-password')
      .set('Cookie', ['token=mock-jwt-token'])
      .send({ currentPassword: VALID_PASSWORD, newPassword: NEW_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Password changed successfully')
  })

  it('returns 401 when not authenticated', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .post('/api/v1/admin/auth/change-password')
      .send({ currentPassword: VALID_PASSWORD, newPassword: NEW_PASSWORD })

    expect(res.status).toBe(401)
  })

  it('returns 401 when current password is wrong', async () => {
    mockAuthAs(makeValidTokenPayload())
    mockChangePassword.mockRejectedValueOnce(
      new authService.AuthError('Current password is incorrect')
    )

    const res = await request(app)
      .post('/api/v1/admin/auth/change-password')
      .set('Cookie', ['token=mock-jwt-token'])
      .send({ currentPassword: 'wrong', newPassword: NEW_PASSWORD })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Current password is incorrect')
  })

  it('returns 400 for weak new password', async () => {
    mockAuthAs(makeValidTokenPayload())

    const res = await request(app)
      .post('/api/v1/admin/auth/change-password')
      .set('Cookie', ['token=mock-jwt-token'])
      .send({ currentPassword: VALID_PASSWORD, newPassword: 'weak' })

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing fields', async () => {
    mockAuthAs(makeValidTokenPayload())

    const res = await request(app)
      .post('/api/v1/admin/auth/change-password')
      .set('Cookie', ['token=mock-jwt-token'])
      .send({})

    expect(res.status).toBe(400)
  })
})

// ===== Admin CRUD route auth protection =====
describe('Admin CRUD routes require authentication', () => {
  it('returns 401 for GET /api/v1/admin/section without auth', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .get('/api/v1/admin/section')

    expect(res.status).toBe(401)
  })

  it('returns 401 for POST /api/v1/admin/create/section without auth', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .post('/api/v1/admin/create/section')
      .send({ title: 'Test', isActive: true })

    expect(res.status).toBe(401)
  })

  it('returns 401 for PATCH /api/v1/admin/update/section/1 without auth', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .patch('/api/v1/admin/update/section/1')
      .send({ title: 'Test' })

    expect(res.status).toBe(401)
  })

  it('returns 401 for DELETE /api/v1/admin/delete/section/1 without auth', async () => {
    mockVerifyToken.mockImplementation(() => {
      throw new authService.AuthError('Invalid or expired token')
    })

    const res = await request(app)
      .delete('/api/v1/admin/delete/section/1')

    expect(res.status).toBe(401)
  })
})
