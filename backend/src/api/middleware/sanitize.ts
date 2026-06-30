import { Request, Response, NextFunction } from 'express'
import xss from 'xss'

const XSS_OPTIONS = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return xss(value, XSS_OPTIONS)
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeValue(val)
    }
    return sanitized
  }
  return value
}

const METHODS_THAT_ACCEPT_BODY = new Set(['POST', 'PATCH', 'PUT'])

export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (!METHODS_THAT_ACCEPT_BODY.has(req.method) || !req.body) {
    next()
    return
  }

  req.body = sanitizeValue(req.body)
  next()
}
