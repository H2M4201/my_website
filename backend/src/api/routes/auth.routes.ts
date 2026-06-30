import { Router } from 'express'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import {
  loginWithUsername,
  forgotPassword,
  resetPasswordWithToken,
  changePassword,
  getUserById,
  validatePasswordComplexity,
  blacklistToken,
  AuthError,
  AccountLockedError,
  PasswordExpiredError,
  verifyToken,
} from '../../db'
import { requireAuth } from '../middleware/auth'
import type { AuthenticatedRequest } from '../middleware/auth'
import { csrfProtection } from '../middleware/csrf'
import { requireJsonContentType } from '../middleware/contentType'
import { sanitizeInput } from '../middleware/sanitize'
import { getAllowedOrigins } from '../../app'

export const authRouter = Router()

const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000
const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: TOKEN_MAX_AGE_MS,
  path: '/',
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
})

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset attempts. Please try again later.' },
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

function setTokenCookie(res: any, token: string): void {
  res.cookie('token', token, TOKEN_COOKIE_OPTIONS)
}

function clearTokenCookie(res: any): void {
  res.clearCookie('token', { path: '/', sameSite: TOKEN_COOKIE_OPTIONS.sameSite })
}

// POST /api/v1/admin/auth/login
authRouter.post('/login', csrfProtection(getAllowedOrigins()), requireJsonContentType, sanitizeInput, loginLimiter, async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(1, 'Username is required').max(255),
      password: z.string().min(1, 'Password is required').max(128),
    })

    const { username, password } = schema.parse(req.body)
    const result = await loginWithUsername(username, password)

    setTokenCookie(res, result.token)

    res.status(200).json({
      user: result.user,
    })
  } catch (error) {
    if (error instanceof AccountLockedError) {
      res.status(423).json({
        error: 'Account locked due to too many failed attempts. Try again in 15 minutes.',
        lockedUntil: error.lockedUntil.toISOString(),
      })
      return
    }
    if (error instanceof PasswordExpiredError) {
      res.status(401).json({
        error: error.message,
        passwordExpired: true,
      })
      return
    }
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error('POST /auth/login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/v1/admin/auth/logout
authRouter.post('/logout', csrfProtection(getAllowedOrigins()), generalLimiter, async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const decoded = verifyToken(token)
      const remainingMs = (decoded as any).exp
        ? (decoded as any).exp * 1000 - Date.now()
        : TOKEN_MAX_AGE_MS
      if (remainingMs > 0) {
        blacklistToken(token, remainingMs)
      }
    } catch {
      // Token already invalid, nothing to blacklist
    }
  }

  clearTokenCookie(res)
  res.status(200).json({ message: 'Logged out successfully' })
})

// GET /api/v1/admin/auth/me
authRouter.get('/me', generalLimiter, requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await getUserById(req.user!.id)
    res.status(200).json({ user })
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
      return
    }
    console.error('GET /auth/me error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// POST /api/v1/admin/auth/forgot-password
authRouter.post('/forgot-password', csrfProtection(getAllowedOrigins()), requireJsonContentType, sanitizeInput, forgotPasswordLimiter, async (req, res) => {
  try {
    const schema = z.object({
      usernameOrEmail: z.string().min(1, 'Username or email is required').max(255),
    })

    const { usernameOrEmail } = schema.parse(req.body)
    const result = await forgotPassword(usernameOrEmail)

    res.status(200).json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error('POST /auth/forgot-password error:', error)
    res.status(500).json({ error: 'Failed to process password reset' })
  }
})

// POST /api/v1/admin/auth/reset-password
authRouter.post('/reset-password', csrfProtection(getAllowedOrigins()), requireJsonContentType, sanitizeInput, generalLimiter, async (req, res) => {
  try {
    const schema = z.object({
      token: z.string().min(1, 'Reset token is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    })

    const { token, newPassword } = schema.parse(req.body)

    const complexityError = validatePasswordComplexity(newPassword)
    if (complexityError) {
      res.status(400).json({ error: complexityError })
      return
    }

    const result = await resetPasswordWithToken(token, newPassword)
    res.status(200).json(result)
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error('POST /auth/reset-password error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

// POST /api/v1/admin/auth/change-password
authRouter.post('/change-password', csrfProtection(getAllowedOrigins()), requireJsonContentType, sanitizeInput, generalLimiter, requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1, 'Current password is required').max(128),
      newPassword: z.string().min(8, 'New password must be at least 8 characters').max(128),
    })

    const { currentPassword, newPassword } = schema.parse(req.body)

    const complexityError = validatePasswordComplexity(newPassword)
    if (complexityError) {
      res.status(400).json({ error: complexityError })
      return
    }

    const result = await changePassword(req.user!.id, currentPassword, newPassword)
    res.status(200).json(result)
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error('POST /auth/change-password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
})
