import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express, { type Express, type Request, type Response, type NextFunction } from 'express'
import { registerApiRoutes } from './api'

export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://127.0.0.1:3000',
  'https://127.0.0.1:3000',
  'http://localhost:5000',
  'https://localhost:5000',
  'http://127.0.0.1:5000',
  'https://127.0.0.1:5000',
  'http://homepage:3000',
  'http://adminPage:5000',
]

export function getAllowedOrigins(): string[] {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  }
  return ALLOWED_ORIGINS
}

const SENSITIVE_FIELDS = ['password', 'currentPassword', 'newPassword', 'confirmPassword', 'secret', 'token']

function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body)) {
    sanitized[key] = SENSITIVE_FIELDS.includes(key) ? '[REDACTED]' : value
  }
  return sanitized
}

function logRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  const method = req.method
  const path = req.path
  const ip = req.ip

  console.log(`[${new Date().toISOString()}] ${method} ${path} from ${ip}`)

  if (['POST', 'PATCH', 'PUT'].includes(method) && req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, JSON.stringify(sanitizeBody(req.body)))
  }

  const originalSend = res.send
  res.send = function (data) {
    const duration = Date.now() - start
    const statusCode = res.statusCode
    const statusEmoji = statusCode >= 400 ? '!' : statusCode >= 300 ? '?' : ''
    console.log(`   ${statusEmoji} ${statusCode} in ${duration}ms`)
    return originalSend.call(this, data)
  }

  next()
}

export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }))

  const corsOrigins = getAllowedOrigins()
  app.use(cors({ origin: corsOrigins, credentials: true }))

  app.use(express.json({ limit: '16mb' }))
  app.use(cookieParser())
  app.use(logRequest)

  registerApiRoutes(app)

  return app
}
