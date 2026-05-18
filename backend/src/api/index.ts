import type { Express } from 'express'
import { contactsRouter } from './routes/contacts.routes'
import { sectionsRouter } from './routes/sections.routes'
import { blogsRouter } from './routes/blogs.routes'
import { tripsRouter } from './routes/trips.routes'
import { recipesRouter } from './routes/recipes.routes'

/** Registers all HTTP API routes under `/api/*`. */
export function registerApiRoutes(app: Express): void {
  app.use('/api/sections', sectionsRouter)
  app.use('/api/contacts', contactsRouter)
  app.use('/api/blogs', blogsRouter)
  app.use('/api/trips', tripsRouter)
  app.use('/api/recipes', recipesRouter)
}
