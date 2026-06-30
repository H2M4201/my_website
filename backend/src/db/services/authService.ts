import { prisma } from '../prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is required')
  }
  return secret
})()

const JWT_EXPIRES_IN = '24h'
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000
const PASSWORD_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000
const BCRYPT_ROUNDS = 12

export interface AdminUserDTO {
  id: number
  username: string
  email: string | null
  name: string | null
  roleId: number | null
}

export interface LoginResponse {
  token: string
  user: AdminUserDTO
}

export interface ForgotPasswordResponse {
  message: string
  tempPassword?: string
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class AccountLockedError extends Error {
  public lockedUntil: Date
  constructor(lockedUntil: Date) {
    super('Account is locked. Try again after ' + lockedUntil.toISOString())
    this.name = 'AccountLockedError'
    this.lockedUntil = lockedUntil
  }
}

export class PasswordExpiredError extends Error {
  constructor() {
    super('Password has expired. Please change your password.')
    this.name = 'PasswordExpiredError'
  }
}

const tokenBlacklist = new Map<string, number>()

setInterval(() => {
  const now = Date.now()
  for (const [token, expiresAt] of tokenBlacklist) {
    if (expiresAt <= now) tokenBlacklist.delete(token)
  }
}, 60_000).unref()

export function blacklistToken(token: string, expiresInMs: number = 24 * 60 * 60 * 1000): void {
  tokenBlacklist.set(token, Date.now() + expiresInMs)
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token)
}

export function validatePasswordComplexity(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one digit'
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]]/.test(password)) return 'Password must contain at least one special character'
  return null
}

export async function loginWithUsername(
  username: string,
  plaintextPassword: string
): Promise<LoginResponse> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    username: string
    password: string
    email: string | null
    name: string | null
    roleId: number | null
    failedLoginAttempts: number
    lockedUntil: Date | null
    passwordChangedAt: Date | null
  }>>(
    `SELECT id, username, password, email, name, "roleId",
            "failedLoginAttempts", "lockedUntil", "passwordChangedAt"
     FROM "AdminUser" WHERE username = $1`,
    username
  )

  const user = users[0]
  if (!user) {
    throw new AuthError('Invalid username or password')
  }

  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    throw new AccountLockedError(user.lockedUntil)
  }

  const isValid = await bcrypt.compare(plaintextPassword, user.password)

  if (!isValid) {
    const newAttempts = user.failedLoginAttempts + 1

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
      await prisma.$executeRawUnsafe(
        `UPDATE "AdminUser" SET "failedLoginAttempts" = $1, "lockedUntil" = $2 WHERE id = $3`,
        newAttempts, lockUntil, user.id
      )
      throw new AccountLockedError(lockUntil)
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "AdminUser" SET "failedLoginAttempts" = $1 WHERE id = $2`,
        newAttempts, user.id
      )
    }

    throw new AuthError('Invalid username or password')
  }

  await prisma.$executeRawUnsafe(
    `UPDATE "AdminUser" SET "failedLoginAttempts" = 0, "lockedUntil" = NULL WHERE id = $1`,
    user.id
  )

  if (user.passwordChangedAt) {
    const ageMs = Date.now() - new Date(user.passwordChangedAt).getTime()
    if (ageMs > PASSWORD_MAX_AGE_MS) {
      throw new PasswordExpiredError()
    }
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, roleId: user.roleId },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
    },
  }
}

export async function forgotPassword(
  usernameOrEmail: string
): Promise<ForgotPasswordResponse> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    username: string
    email: string | null
  }>>(
    `SELECT id, username, email FROM "AdminUser" WHERE username = $1 OR email = $1`,
    usernameOrEmail
  )

  const user = users[0]
  if (!user) {
    return { message: 'If the account exists, a password reset link has been sent.' }
  }

  const tempPassword = generateSecurePassword()
  const hashedPassword = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS)
  const now = new Date()

  const token = crypto.randomBytes(32).toString('hex')
  const tokenExpires = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.$executeRawUnsafe(
    `UPDATE "AdminUser" SET password = $1, "passwordChangedAt" = $2,
            "failedLoginAttempts" = 0, "lockedUntil" = NULL,
            "passwordResetToken" = $3, "passwordResetTokenExpires" = $4
     WHERE id = $5`,
    hashedPassword, now, token, tokenExpires, user.id
  )

  console.log(`Password reset for ${user.username}: token=${token}`)

  const isDev = process.env.NODE_ENV === 'development'
  return {
    message: 'If the account exists, a password reset link has been sent.',
    ...(isDev ? { tempPassword } : {}),
  }
}

export async function resetPasswordWithToken(
  resetToken: string,
  newPassword: string
): Promise<{ message: string }> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    username: string
    passwordResetToken: string | null
    passwordResetTokenExpires: Date | null
  }>>(
    `SELECT id, username, "passwordResetToken", "passwordResetTokenExpires"
     FROM "AdminUser" WHERE "passwordResetToken" = $1`,
    resetToken
  )

  const user = users[0]
  if (!user || !user.passwordResetTokenExpires) {
    throw new AuthError('Invalid or expired reset token')
  }

  if (new Date(user.passwordResetTokenExpires) < new Date()) {
    throw new AuthError('Reset token has expired')
  }

  const complexityError = validatePasswordComplexity(newPassword)
  if (complexityError) {
    throw new AuthError(complexityError)
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
  const now = new Date()

  await prisma.$executeRawUnsafe(
    `UPDATE "AdminUser" SET password = $1, "passwordChangedAt" = $2,
            "passwordResetToken" = NULL, "passwordResetTokenExpires" = NULL,
            "failedLoginAttempts" = 0, "lockedUntil" = NULL
     WHERE id = $3`,
    hashedPassword, now, user.id
  )

  return { message: 'Password has been reset successfully.' }
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    password: string
  }>>(
    `SELECT id, password FROM "AdminUser" WHERE id = $1`,
    userId
  )

  const user = users[0]
  if (!user) {
    throw new AuthError('User not found')
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    throw new AuthError('Current password is incorrect')
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password)
  if (isSamePassword) {
    throw new AuthError('New password must be different from current password')
  }

  const complexityError = validatePasswordComplexity(newPassword)
  if (complexityError) {
    throw new AuthError(complexityError)
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
  const now = new Date()

  await prisma.$executeRawUnsafe(
    `UPDATE "AdminUser" SET password = $1, "passwordChangedAt" = $2,
            "failedLoginAttempts" = 0, "lockedUntil" = NULL
     WHERE id = $3`,
    hashedPassword, now, user.id
  )

  return { message: 'Password changed successfully' }
}

export async function getUserById(userId: number): Promise<AdminUserDTO> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    username: string
    email: string | null
    name: string | null
    roleId: number | null
  }>>(
    `SELECT id, username, email, name, "roleId" FROM "AdminUser" WHERE id = $1`,
    userId
  )

  const user = users[0]
  if (!user) {
    throw new AuthError('User not found')
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
  }
}

function generateSecurePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const special = '!@#$%^&*()-_=+'
  const all = upper + lower + digits + special

  const required = [
    upper[crypto.randomInt(upper.length)],
    lower[crypto.randomInt(lower.length)],
    digits[crypto.randomInt(digits.length)],
    special[crypto.randomInt(special.length)],
  ]

  for (let i = 0; i < 12; i++) {
    required.push(all[crypto.randomInt(all.length)])
  }

  for (let i = required.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1)
    ;[required[i], required[j]] = [required[j], required[i]]
  }

  return required.join('')
}

export function verifyToken(token: string): { id: number; username: string; roleId: number | null } {
  if (isTokenBlacklisted(token)) {
    throw new AuthError('Token has been revoked')
  }

  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as { id: number; username: string; roleId: number | null }
  } catch (err) {
    if (err instanceof AuthError) throw err
    throw new AuthError('Invalid or expired token')
  }
}
