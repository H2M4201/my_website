import { Request, Response, NextFunction } from 'express'

const METHODS_THAT_NEED_BODY = new Set(['POST', 'PATCH', 'PUT'])

export function requireJsonContentType(req: Request, res: Response, next: NextFunction): void {
  if (!METHODS_THAT_NEED_BODY.has(req.method)) {
    next()
    return
  }

  const contentType = req.get('content-type') || ''
  if (!contentType.startsWith('application/json')) {
    res.status(415).json({ error: 'Content-Type must be application/json' })
    return
  }

  next()
}
