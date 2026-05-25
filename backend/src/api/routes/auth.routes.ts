import { Router } from 'express'
import { z } from 'zod'
import { 
  loginWithUsername, 
  forgotPassword, 
  changePassword, 
  validatePasswordComplexity,
  AuthError, 
  AccountLockedError,
  verifyToken 
} from '../../db'

export const authRouter = Router()

// POST /api/v1/admin/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(1, 'Username is required'),
      password: z.string().min(1, 'Password is required'),
    })

    const { username, password } = schema.parse(req.body)
    const result = await loginWithUsername(username, password)

    res.status(200).json(result)
  } catch (error) {
    if (error instanceof AccountLockedError) {
      res.status(423).json({ 
        error: 'Account locked due to too many failed attempts. Try again in 15 minutes.',
        lockedUntil: error.lockedUntil.toISOString()
      })
      return
    }
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /auth/login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/v1/admin/auth/forgot-password
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const schema = z.object({
      usernameOrEmail: z.string().min(1, 'Username or email is required'),
    })

    const { usernameOrEmail } = schema.parse(req.body)
    const result = await forgotPassword(usernameOrEmail)

    res.status(200).json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /auth/forgot-password error:', error)
    res.status(500).json({ error: 'Failed to process password reset' })
  }
})

// POST /api/v1/admin/auth/change-password
authRouter.post('/change-password', async (req, res) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    })

    const { currentPassword, newPassword } = schema.parse(req.body)

    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    // Validate complexity
    const complexityError = validatePasswordComplexity(newPassword)
    if (complexityError) {
      res.status(400).json({ error: complexityError })
      return
    }

    const result = await changePassword(decoded.id, currentPassword, newPassword)
    res.status(200).json(result)
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /auth/change-password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
})