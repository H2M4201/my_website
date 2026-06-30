import { Router } from 'express'
import { z } from 'zod'
import {
  getAllSectionsIncludingInactive, getSectionById, createSection, updateSection, deleteSection,
} from '../db'
import {
  getAllContactsIncludingInactive, getContactById, createContact, updateContact, deleteContact,
} from '../db'
import {
  getAllBlogsIncludingInactive, getBlogById, createBlog, updateBlog, deleteBlog,
} from '../db'
import {
  getAllTripsIncludingInactive, getTripById, createTrip, updateTrip, deleteTrip,
} from '../db'
import {
  getAllRecipesIncludingInactive, getRecipeById, createRecipe, updateRecipe, deleteRecipe,
} from '../db'
import {
  getAllIngredientsIncludingInactive, getIngredientById, createIngredient, updateIngredient, deleteIngredient,
} from '../db'
import {
  getAllExperiences, getExperienceById, createExperience, updateExperience, deleteExperience,
} from '../db'
import {
  getAllExpertiseCategoriesIncludingInactive, getExpertiseCategoryById, createExpertiseCategory, updateExpertiseCategory, deleteExpertiseCategory,
} from '../db'
import {
  getAllJobDescriptionsIncludingInactive, getJobDescriptionById, createJobDescription, updateJobDescription, deleteJobDescription,
} from '../db'
import { NotFoundError } from '../db'
import {
  sectionIdParamSchema, createSectionRequestSchema, updateSectionRequestSchema, sectionResponseSchema,
  contactIdParamSchema, createContactRequestSchema, updateContactRequestSchema, contactResponseSchema,
  blogIdParamSchema, createBlogRequestSchema, updateBlogRequestSchema, blogResponseSchema,
  tripIdParamSchema, createTripRequestSchema, updateTripRequestSchema, tripResponseSchema,
  recipeIdParamSchema, createRecipeRequestSchema, updateRecipeRequestSchema, recipeResponseSchema,
  ingredientIdParamSchema, createIngredientRequestSchema, updateIngredientRequestSchema, ingredientResponseSchema,
  experienceIdParamSchema, createExperienceRequestSchema, updateExperienceRequestSchema, experienceResponseSchema,
  expertiseCategoryIdParamSchema, createExpertiseCategoryRequestSchema, updateExpertiseCategoryRequestSchema, expertiseCategoryResponseSchema,
  jobDescriptionIdParamSchema, createJobDescriptionRequestSchema, updateJobDescriptionRequestSchema, jobDescriptionResponseSchema,
} from './schemas'
import { requireAuth } from './middleware/auth'
import type { AuthenticatedRequest } from './middleware/auth'
import { csrfProtection } from './middleware/csrf'
import { requireJsonContentType } from './middleware/contentType'
import { sanitizeInput } from './middleware/sanitize'
import { getAllowedOrigins } from '../app'

const REVALIDATION_SECRET = (() => {
  const secret = process.env.REVALIDATION_SECRET
  if (!secret) {
    throw new Error('FATAL: REVALIDATION_SECRET environment variable is required')
  }
  return secret
})()

const FRONTEND_URLS = (process.env.FRONTEND_URLS || 'https://localhost:3000,https://localhost:5000')
  .split(',')
  .flatMap(url => {
    const trimmed = url.trim().replace(/\/$/, '')
    const base = trimmed.replace(/^https?:\/\//, '')
    return [
      `http://${base}/api/revalidate`,
      `http://${base}/api/revalidate`,
    ]
  })

async function revalidateFrontendCaches(resource: string): Promise<void> {
  const tag = RESOURCE_TAG_MAP[resource] || resource

  const results = await Promise.allSettled(
    FRONTEND_URLS.map(async (url) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          tag,
        }),
        signal: AbortSignal.timeout(5000),
      })
      if (response.ok) {
        console.log(`[Revalidate] ${url} revalidated for "${tag}" (resource: ${resource})`)
      } else {
        console.warn(`[Revalidate] ${url} returned ${response.status} for "${tag}"`)
      }
      return response
    })
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(
        `[Revalidate] Failed to notify ${FRONTEND_URLS[index]} for "${tag}":`,
        result.reason?.message || result.reason
      )
    }
  })
}

export const ADMIN_API_PREFIX = '/api/v1/admin'

type ResourceHandlers = {
  getAll: () => Promise<any[]>
  getById: (id: number) => Promise<any>
  create: (data: any) => Promise<any>
  update: (id: number, data: any) => Promise<any>
  delete: (id: number) => Promise<void>
  idSchema: z.ZodSchema
  createSchema: z.ZodSchema
  updateSchema: z.ZodSchema
  responseSchema: z.ZodSchema
}

const resourceHandlers: Record<string, ResourceHandlers> = {
  section: {
    getAll: getAllSectionsIncludingInactive,
    getById: getSectionById,
    create: createSection,
    update: updateSection,
    delete: deleteSection,
    idSchema: sectionIdParamSchema,
    createSchema: createSectionRequestSchema,
    updateSchema: updateSectionRequestSchema,
    responseSchema: sectionResponseSchema,
  },
  contact: {
    getAll: getAllContactsIncludingInactive,
    getById: getContactById,
    create: createContact,
    update: updateContact,
    delete: deleteContact,
    idSchema: contactIdParamSchema,
    createSchema: createContactRequestSchema,
    updateSchema: updateContactRequestSchema,
    responseSchema: contactResponseSchema,
  },
  blog: {
    getAll: getAllBlogsIncludingInactive,
    getById: getBlogById,
    create: createBlog,
    update: updateBlog,
    delete: deleteBlog,
    idSchema: blogIdParamSchema,
    createSchema: createBlogRequestSchema,
    updateSchema: updateBlogRequestSchema,
    responseSchema: blogResponseSchema,
  },
  trip: {
    getAll: getAllTripsIncludingInactive,
    getById: getTripById,
    create: createTrip,
    update: updateTrip,
    delete: deleteTrip,
    idSchema: tripIdParamSchema,
    createSchema: createTripRequestSchema,
    updateSchema: updateTripRequestSchema,
    responseSchema: tripResponseSchema,
  },
  recipe: {
    getAll: getAllRecipesIncludingInactive,
    getById: getRecipeById,
    create: createRecipe,
    update: updateRecipe,
    delete: deleteRecipe,
    idSchema: recipeIdParamSchema,
    createSchema: createRecipeRequestSchema,
    updateSchema: updateRecipeRequestSchema,
    responseSchema: recipeResponseSchema,
  },
  ingredient: {
    getAll: getAllIngredientsIncludingInactive,
    getById: getIngredientById,
    create: createIngredient,
    update: updateIngredient,
    delete: deleteIngredient,
    idSchema: ingredientIdParamSchema,
    createSchema: createIngredientRequestSchema,
    updateSchema: updateIngredientRequestSchema,
    responseSchema: ingredientResponseSchema,
  },
  experience: {
    getAll: () => getAllExperiences(true),
    getById: getExperienceById,
    create: createExperience,
    update: updateExperience,
    delete: deleteExperience,
    idSchema: experienceIdParamSchema,
    createSchema: createExperienceRequestSchema,
    updateSchema: updateExperienceRequestSchema,
    responseSchema: experienceResponseSchema,
  },
  expertise: {
    getAll: getAllExpertiseCategoriesIncludingInactive,
    getById: getExpertiseCategoryById,
    create: createExpertiseCategory,
    update: updateExpertiseCategory,
    delete: deleteExpertiseCategory,
    idSchema: expertiseCategoryIdParamSchema,
    createSchema: createExpertiseCategoryRequestSchema,
    updateSchema: updateExpertiseCategoryRequestSchema,
    responseSchema: expertiseCategoryResponseSchema,
  },
  'job-description': {
    getAll: getAllJobDescriptionsIncludingInactive,
    getById: getJobDescriptionById,
    create: createJobDescription,
    update: updateJobDescription,
    delete: deleteJobDescription,
    idSchema: jobDescriptionIdParamSchema,
    createSchema: createJobDescriptionRequestSchema,
    updateSchema: updateJobDescriptionRequestSchema,
    responseSchema: jobDescriptionResponseSchema,
  },
}

const RESOURCE_TAG_MAP: Record<string, string> = {
  section: 'sections',
  contact: 'contacts',
  blog: 'blogs',
  trip: 'trips',
  recipe: 'recipes',
  ingredient: 'ingredients',
  experience: 'resume',
  expertise: 'resume',
  'job-description': 'resume',
}

export const adminRouter = Router()

adminRouter.use(csrfProtection(getAllowedOrigins()))
adminRouter.use(requireJsonContentType)
adminRouter.use(requireAuth)
adminRouter.use(sanitizeInput)

// GET /api/v1/admin/{resource} - List all
adminRouter.get('/:resource', async (req: AuthenticatedRequest, res) => {
  const { resource } = req.params
  const handlers = resourceHandlers[resource]
  if (!handlers) {
    res.status(404).json({ error: `Unknown resource: ${resource}` })
    return
  }
  try {
    const items = await handlers.getAll()
    res.status(200).json(items)
  } catch (error) {
    console.error(`GET /admin/${resource} error:`, error)
    res.status(500).json({ error: `Failed to fetch ${resource}s` })
  }
})

// GET /api/v1/admin/{resource}/{id} - Get one
adminRouter.get('/:resource/:id', async (req: AuthenticatedRequest, res) => {
  const { resource } = req.params
  const handlers = resourceHandlers[resource]
  if (!handlers) {
    res.status(404).json({ error: `Unknown resource: ${resource}` })
    return
  }
  try {
    const id = handlers.idSchema.parse(req.params.id)
    const item = await handlers.getById(id)
    res.status(200).json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: (error as Error).message })
      return
    }
    console.error(`GET /admin/${resource}/${req.params.id} error:`, error)
    res.status(500).json({ error: `Failed to fetch ${resource}` })
  }
})

// POST /api/v1/admin/create/{resource} - Create
adminRouter.post('/create/:resource', async (req: AuthenticatedRequest, res) => {
  const { resource } = req.params
  const handlers = resourceHandlers[resource]
  if (!handlers) {
    res.status(404).json({ error: `Unknown resource: ${resource}` })
    return
  }
  try {
    const data = handlers.createSchema.parse(req.body)
    const item = await handlers.create(data)
    const validated = handlers.responseSchema.parse(item)
    revalidateFrontendCaches(resource).catch(err =>
      console.warn(`[Revalidate] Background revalidation failed for "${resource}":`, err?.message || err)
    )
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error(`POST /admin/create/${resource} error:`, error)
    res.status(500).json({ error: `Failed to create ${resource}` })
  }
})

// PATCH /api/v1/admin/update/{resource}/{id} - Update
adminRouter.patch('/update/:resource/:id', async (req: AuthenticatedRequest, res) => {
  const { resource } = req.params
  const handlers = resourceHandlers[resource]
  if (!handlers) {
    res.status(404).json({ error: `Unknown resource: ${resource}` })
    return
  }
  try {
    const id = handlers.idSchema.parse(req.params.id)
    const data = handlers.updateSchema.parse(req.body)
    const item = await handlers.update(id, data)
    const validated = handlers.responseSchema.parse(item)
    revalidateFrontendCaches(resource).catch(err =>
      console.warn(`[Revalidate] Background revalidation failed for "${resource}":`, err?.message || err)
    )
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: (error as Error).message })
      return
    }
    console.error(`PATCH /admin/update/${resource}/${req.params.id} error:`, error)
    res.status(500).json({ error: `Failed to update ${resource}` })
  }
})

// DELETE /api/v1/admin/delete/{resource}/{id} - Delete
adminRouter.delete('/delete/:resource/:id', async (req: AuthenticatedRequest, res) => {
  const { resource } = req.params
  const handlers = resourceHandlers[resource]
  if (!handlers) {
    res.status(404).json({ error: `Unknown resource: ${resource}` })
    return
  }
  try {
    const id = handlers.idSchema.parse(req.params.id)
    await handlers.delete(id)
    revalidateFrontendCaches(resource).catch(err =>
      console.warn(`[Revalidate] Background revalidation failed for "${resource}":`, err?.message || err)
    )
    res.status(204).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: (error as Error).message })
      return
    }
    console.error(`DELETE /admin/delete/${resource}/${req.params.id} error:`, error)
    res.status(500).json({ error: `Failed to delete ${resource}` })
  }
})
