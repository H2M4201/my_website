import { Request, Response, NextFunction } from 'express'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export function csrfProtection(allowedOrigins: string[]) {
  const originSet = new Set(allowedOrigins)

  return function (req: Request, res: Response, next: NextFunction): void {
    if (SAFE_METHODS.has(req.method)) {
      next()
      return
    }

    const origin = req.get('origin')

    if (!origin) {
      next()
      return
    }

    try {
      const { origin: parsedOrigin } = new URL(origin)
      if (!originSet.has(parsedOrigin)) {
        res.status(403).json({ error: 'CSRF check failed: untrusted origin' })
        return
      }
    } catch {
      res.status(403).json({ error: 'CSRF check failed: malformed origin' })
      return
    }

    next()
  }
}
