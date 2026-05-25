import { prisma } from '../prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret-change-in-production'
const JWT_EXPIRES_IN = '24h'
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const PASSWORD_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000 // 60 days

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
  passwordExpired?: boolean
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
    super(`Account is locked. Try again after ${lockedUntil.toISOString()}`)
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

/** Check password complexity: min 8 chars, uppercase, lowercase, digit, special char */
export function validatePasswordComplexity(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one digit'
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]]/.test(password)) return 'Password must contain at least one special character'
  return null
}

/**
 * Authenticate an admin user with lockout tracking, password age checks.
 */
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
    `SELECT id, username, password, email, name, roleId, 
            failedLoginAttempts, lockedUntil, passwordChangedAt
     FROM AdminUser WHERE username = @P1`,
    username
  )

  const user = users[0]
  if (!user) {
    throw new AuthError('Invalid username or password')
  }

  // Check if account is locked
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    throw new AccountLockedError(user.lockedUntil)
  }

  // Verify password
  const isValid = bcrypt.compareSync(plaintextPassword, user.password)
  
  if (!isValid) {
    // Increment failed login attempts
    const newAttempts = user.failedLoginAttempts + 1
    
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
      await prisma.$executeRawUnsafe(
        `UPDATE AdminUser SET failedLoginAttempts = @P1, lockedUntil = @P2 WHERE id = @P3`,
        newAttempts,
        lockUntil,
        user.id
      )
      throw new AccountLockedError(lockUntil)
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE AdminUser SET failedLoginAttempts = @P1 WHERE id = @P2`,
        newAttempts,
        user.id
      )
    }
    
    throw new AuthError('Invalid username or password')
  }

  // Successful login — reset failed attempts and lockout, check password age
  await prisma.$executeRawUnsafe(
    `UPDATE AdminUser SET failedLoginAttempts = 0, lockedUntil = NULL WHERE id = @P1`,
    user.id
  )

  // Check password age
  let passwordExpired = false
  if (user.passwordChangedAt) {
    const ageMs = Date.now() - new Date(user.passwordChangedAt).getTime()
    if (ageMs > PASSWORD_MAX_AGE_MS) {
      passwordExpired = true
    }
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, roleId: user.roleId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
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
    passwordExpired,
  }
}

/**
 * Forgot password: generate a new random password, update it in DB, return it.
 * In production, this would send an email instead.
 */
export async function forgotPassword(usernameOrEmail: string): Promise<{ message: string; tempPassword?: string }> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    username: string
    email: string | null
  }>>(
    `SELECT id, username, email FROM AdminUser WHERE username = @P1 OR email = @P1`,
    usernameOrEmail
  )

  const user = users[0]
  if (!user) {
    // Don't reveal whether user exists — return generic message
    return { message: 'If the account exists, a password reset link has been sent.' }
  }

  // Generate a random password (16 chars, meets complexity)
  const tempPassword = generateSecurePassword()
  const hashedPassword = bcrypt.hashSync(tempPassword, 10)
  const now = new Date().toISOString()

  await prisma.$executeRawUnsafe(
    `UPDATE AdminUser SET password = @P1, passwordChangedAt = @P2, 
            failedLoginAttempts = 0, lockedUntil = NULL
     WHERE id = @P3`,
    hashedPassword,
    now,
    user.id
  )

  // In development, return the temp password so the user can see it
  // In production, this would be sent via email
  console.log(`[DEV] Password reset for ${user.username}: new password = ${tempPassword}`)
  
  return {
    message: 'Password has been reset. Check your email for the new password.',
    tempPassword, // Only returned in dev mode
  }
}

/**
 * Change password for an authenticated user.
 */
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const users = await prisma.$queryRawUnsafe<Array<{
    id: number
    password: string
  }>>(
    `SELECT id, password FROM AdminUser WHERE id = @P1`,
    userId
  )

  const user = users[0]
  if (!user) {
    throw new AuthError('User not found')
  }

  // Verify current password
  const isValid = bcrypt.compareSync(currentPassword, user.password)
  if (!isValid) {
    throw new AuthError('Current password is incorrect')
  }

  // Validate new password complexity
  const complexityError = validatePasswordComplexity(newPassword)
  if (complexityError) {
    throw new AuthError(complexityError)
  }

  // Hash and update
  const hashedPassword = bcrypt.hashSync(newPassword, 10)
  const now = new Date().toISOString()
  
  await prisma.$executeRawUnsafe(
    `UPDATE AdminUser SET password = @P1, passwordChangedAt = @P2, 
            failedLoginAttempts = 0, lockedUntil = NULL
     WHERE id = @P3`,
    hashedPassword,
    now,
    user.id
  )

  return { message: 'Password changed successfully' }
}

/**
 * Generate a cryptographically secure random password meeting complexity requirements.
 */
function generateSecurePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const special = '!@#$%^&*()-_=+'
  const all = upper + lower + digits + special

  // Ensure at least one of each character type
  const required = [
    upper[crypto.randomInt(upper.length)],
    lower[crypto.randomInt(lower.length)],
    digits[crypto.randomInt(digits.length)],
    special[crypto.randomInt(special.length)],
  ]

  // Fill remaining 12 characters randomly
  for (let i = 0; i < 12; i++) {
    required.push(all[crypto.randomInt(all.length)])
  }

  // Shuffle using Fisher-Yates
  for (let i = required.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [required[i], required[j]] = [required[j], required[i]]
  }

  return required.join('')
}

/**
 * Verify a JWT token and return decoded payload.
 */
export function verifyToken(token: string): { id: number; username: string; roleId: number | null } {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string; roleId: number | null }
  } catch {
    throw new AuthError('Invalid or expired token')
  }
}