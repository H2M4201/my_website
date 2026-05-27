import type { Express } from 'express'
import { Router } from 'express'
import { contactsRouter } from './routes/contacts.routes'
import { sectionsRouter } from './routes/sections.routes'
import { blogsRouter } from './routes/blogs.routes'
import { tripsRouter } from './routes/trips.routes'
import { recipesRouter } from './routes/recipes.routes'
import { resumeRouter } from './routes/resume.routes'
import { authRouter } from './routes/auth.routes'
import { adminRouter, ADMIN_API_PREFIX } from './adminRoutes'
import {
  getAllExperiences,
  getExperienceById,
  getAllExpertiseCategories,
  getExpertiseCategoryById,
  getAllJobDescriptions,
  ExperienceNotFoundError,
  ExpertiseCategoryNotFoundError,
  JobDescriptionNotFoundError,
} from '../db'
import {
  experienceIdParamSchema,
  experiencesListResponseSchema,
  experienceResponseSchema,
  expertiseCategoryIdParamSchema,
  expertiseCategoriesListResponseSchema,
  expertiseCategoryResponseSchema,
  jobDescriptionIdParamSchema,
  jobDescriptionsListResponseSchema,
  jobDescriptionResponseSchema,
} from './schemas'

/** Public read-only router for adminPage CrudTemplate compatibility */
const adminReadRouter = Router()

// GET all experiences (including inactive for admin)
adminReadRouter.get('/', async (_req, res) => {
  try {
    const experiences = await getAllExperiences(true)
    const validated = experiencesListResponseSchema.parse(experiences)
    res.status(200).json(validated)
  } catch (error) {
    console.error('GET /api/v1/experiences error:', error)
    res.status(500).json({ error: 'Failed to fetch experiences' })
  }
})

// GET experience by ID
adminReadRouter.get('/:id', async (req, res) => {
  try {
    const id = experienceIdParamSchema.parse(req.params.id)
    const experience = await getExperienceById(id)
    const validated = experienceResponseSchema.parse(experience)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof ExperienceNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Failed to fetch experience' })
  }
})

// GET all expertise categories (for admin read)
const expertiseReadRouter = Router()
expertiseReadRouter.get('/', async (_req, res) => {
  try {
    const categories = await getAllExpertiseCategories()
    const validated = expertiseCategoriesListResponseSchema.parse(categories)
    res.status(200).json(validated)
  } catch (error) {
    console.error('GET /api/v1/expertises error:', error)
    res.status(500).json({ error: 'Failed to fetch expertise categories' })
  }
})

expertiseReadRouter.get('/:id', async (req, res) => {
  try {
    const id = expertiseCategoryIdParamSchema.parse(req.params.id)
    const category = await getExpertiseCategoryById(id)
    const validated = expertiseCategoryResponseSchema.parse(category)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof ExpertiseCategoryNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Failed to fetch expertise category' })
  }
})

// GET all job descriptions (for admin read)
const jobDescriptionReadRouter = Router()
jobDescriptionReadRouter.get('/', async (_req, res) => {
  try {
    const items = await getAllJobDescriptions()
    const validated = jobDescriptionsListResponseSchema.parse(items)
    res.status(200).json(validated)
  } catch (error) {
    console.error('GET /api/v1/job-descriptions error:', error)
    res.status(500).json({ error: 'Failed to fetch job descriptions' })
  }
})

jobDescriptionReadRouter.get('/:id', async (req, res) => {
  try {
    const id = jobDescriptionIdParamSchema.parse(req.params.id)
    const item = await getAllJobDescriptions() // Use getAll and filter since there's no standalone get
    const found = item.find(j => j.id === id)
    if (!found) {
      throw new JobDescriptionNotFoundError(id)
    }
    const validated = jobDescriptionResponseSchema.parse(found)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof JobDescriptionNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Failed to fetch job description' })
  }
})

/** Registers all HTTP API routes under `/api/v1/*` for homepage and `/api/v1/admin/*` for admin. */
export function registerApiRoutes(app: Express): void {
  // Homepage public API endpoints (prefix: /api/v1)
  app.use('/api/v1/sections', sectionsRouter)
  app.use('/api/v1/contacts', contactsRouter)
  app.use('/api/v1/blogs', blogsRouter)
  app.use('/api/v1/trips', tripsRouter)
  app.use('/api/v1/recipes', recipesRouter)
  app.use('/api/v1/resume', resumeRouter)

  // Public read endpoints for admin page CrudTemplate compatibility
  app.use('/api/v1/experiences', adminReadRouter)
  app.use('/api/v1/expertises', expertiseReadRouter)
  app.use('/api/v1/job-descriptions', jobDescriptionReadRouter)

  // Admin API endpoints (prefix: /api/v1/admin)
  app.use('/api/v1/admin/auth', authRouter)
  app.use(ADMIN_API_PREFIX, adminRouter)
}
