import cors from 'cors'
import express, { type Express } from 'express'
import { registerApiRoutes } from './api'

export function createApp(): Express {
  const app = express()
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://127.0.0.1:3000',
        'https://127.0.0.1:3000',
      ]
  app.use(cors({ origin: corsOrigins }))
  app.use(express.json())
  registerApiRoutes(app)
  return app
}
