import cors from 'cors'
import express, { type Express, type Request, type Response, type NextFunction } from 'express'
import { registerApiRoutes } from './api'

// Request logging middleware
function logRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  const method = req.method
  const path = req.path
  const ip = req.ip

  console.log(`[${new Date().toISOString()}] 🚀 INCOMING ${method} ${path} from ${ip}`)

  // Log request body for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(method) && req.body && Object.keys(req.body).length > 0) {
    console.log(`   📦 Body:`, JSON.stringify(req.body, null, 2))
  }

  // Capture response
  const originalSend = res.send
  res.send = function (data) {
    const duration = Date.now() - start
    const statusCode = res.statusCode
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅'
    console.log(`   ${statusEmoji} Response ${statusCode} in ${duration}ms`)

    return originalSend.call(this, data)
  }

  next()
}

export function createApp(): Express {
  const app = express()
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://127.0.0.1:3000',
        'https://127.0.0.1:3000',
        'http://localhost:5000',
        'https://localhost:5000',
        'http://127.0.0.1:5000',
        'https://127.0.0.1:5000',
        // Docker internal hostnames
        'http://homepage:3000',
        'http://adminPage:5000',
      ]
  app.use(cors({ origin: corsOrigins }))
  app.use(express.json())
  app.use(logRequest)
  registerApiRoutes(app)
  return app
}
