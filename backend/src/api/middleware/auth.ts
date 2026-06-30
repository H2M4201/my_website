import { Request, Response, NextFunction } from 'express'
import { verifyToken, AuthError } from '../../db'

export interface AuthenticatedRequest extends Request {
  user?: { id: number; username: string; roleId: number | null }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || extractBearerToken(req)
  if (!token) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  try {
    req.user = verifyToken(token)
    next()
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message })
    } else {
      res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token || extractBearerToken(req)
  if (token) {
    try {
      req.user = verifyToken(token)
    } catch {
      // Token invalid, continue without auth
    }
  }
  next()
}

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]
  }
  return null
}
