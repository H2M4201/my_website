import type { Express } from 'express'
import { contactsRouter } from './routes/contacts.routes'
import { sectionsRouter } from './routes/sections.routes'
import { blogsRouter } from './routes/blogs.routes'
import { tripsRouter } from './routes/trips.routes'
import { recipesRouter } from './routes/recipes.routes'
import { authRouter } from './routes/auth.routes'
import { adminRouter, ADMIN_API_PREFIX } from './adminRoutes'

/** Registers all HTTP API routes under `/api/v1/*` for homepage and `/api/v1/admin/*` for admin. */
export function registerApiRoutes(app: Express): void {
  // Homepage public API endpoints (prefix: /api/v1)
  app.use('/api/v1/sections', sectionsRouter)
  app.use('/api/v1/contacts', contactsRouter)
  app.use('/api/v1/blogs', blogsRouter)
  app.use('/api/v1/trips', tripsRouter)
  app.use('/api/v1/recipes', recipesRouter)

  // Admin API endpoints (prefix: /api/v1/admin)
  app.use('/api/v1/admin/auth', authRouter)
  app.use(ADMIN_API_PREFIX, adminRouter)
}
