import { Router } from 'express'
import { z } from 'zod'
import {
  getAllSections, getSectionById, createSection, updateSection, deleteSection, SectionNotFoundError,
} from '../db'
import {
  getAllContacts, getContactById, createContact, updateContact, deleteContact, ContactNotFoundError,
} from '../db'
import {
  getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, BlogNotFoundError,
} from '../db'
import {
  getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, TripNotFoundError,
} from '../db'
import {
  getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, RecipeNotFoundError,
} from '../db'
import {
  getAllIngredients, getIngredientById, createIngredient, updateIngredient, deleteIngredient, IngredientNotFoundError,
} from '../db'
import {
  getAllExperiences, getExperienceById, createExperience, updateExperience, deleteExperience, ExperienceNotFoundError,
} from '../db'
import {
  getAllExpertiseCategories, getExpertiseCategoryById, createExpertiseCategory, updateExpertiseCategory, deleteExpertiseCategory, ExpertiseCategoryNotFoundError,
} from '../db'
import {
  getAllJobDescriptions, getJobDescriptionById, createJobDescription, updateJobDescription, deleteJobDescription, JobDescriptionNotFoundError,
} from '../db'
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

// ===== Shared secret for frontend revalidation webhooks =====
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'dev-secret-change-in-production'

/** List of frontend URLs to notify after admin CRUD operations */
const FRONTEND_URLS = (process.env.FRONTEND_URLS || 'https://localhost:3000,https://localhost:5000')
  .split(',')
  .map(url => `${url.trim().replace(/\/$/, '')}/api/revalidate`)

/**
 * Sends a POST request to ALL frontend revalidation endpoints after any admin CRUD operation.
 * This ensures all frontends (homepage, adminPage) reflect changes in real time.
 * Uses a fire-and-forget pattern so it doesn't block the API response.
 */
async function revalidateFrontendCaches(resource: string): Promise<void> {
  const results = await Promise.allSettled(
    FRONTEND_URLS.map(async (url) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: REVALIDATION_SECRET,
          tag: resource,
        }),
      })
      if (response.ok) {
        console.log(`[Revalidate] ✅ ${url} revalidated for "${resource}"`)
      } else {
        console.warn(`[Revalidate] ⚠️ ${url} returned ${response.status}`)
      }
      return response
    })
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(
        `[Revalidate] ⚠️ Failed to notify ${FRONTEND_URLS[index]} for "${resource}":`,
        result.reason?.message || result.reason
      )
    }
  })
}

// ===== Centralized admin API prefix =====
export const ADMIN_API_PREFIX = '/api/v1/admin'

// ===== Resource router map =====
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
  notFoundError: new (id: number) => Error
}

const resourceHandlers: Record<string, ResourceHandlers> = {
  section: {
    getAll: getAllSections,
    getById: getSectionById,
    create: createSection,
    update: updateSection,
    delete: deleteSection,
    idSchema: sectionIdParamSchema,
    createSchema: createSectionRequestSchema,
    updateSchema: updateSectionRequestSchema,
    responseSchema: sectionResponseSchema,
    notFoundError: SectionNotFoundError,
  },
  contact: {
    getAll: getAllContacts,
    getById: getContactById,
    create: createContact,
    update: updateContact,
    delete: deleteContact,
    idSchema: contactIdParamSchema,
    createSchema: createContactRequestSchema,
    updateSchema: updateContactRequestSchema,
    responseSchema: contactResponseSchema,
    notFoundError: ContactNotFoundError,
  },
  blog: {
    getAll: getAllBlogs,
    getById: getBlogById,
    create: createBlog,
    update: updateBlog,
    delete: deleteBlog,
    idSchema: blogIdParamSchema,
    createSchema: createBlogRequestSchema,
    updateSchema: updateBlogRequestSchema,
    responseSchema: blogResponseSchema,
    notFoundError: BlogNotFoundError,
  },
  trip: {
    getAll: getAllTrips,
    getById: getTripById,
    create: createTrip,
    update: updateTrip,
    delete: deleteTrip,
    idSchema: tripIdParamSchema,
    createSchema: createTripRequestSchema,
    updateSchema: updateTripRequestSchema,
    responseSchema: tripResponseSchema,
    notFoundError: TripNotFoundError,
  },
  recipe: {
    getAll: getAllRecipes,
    getById: getRecipeById,
    create: createRecipe,
    update: updateRecipe,
    delete: deleteRecipe,
    idSchema: recipeIdParamSchema,
    createSchema: createRecipeRequestSchema,
    updateSchema: updateRecipeRequestSchema,
    responseSchema: recipeResponseSchema,
    notFoundError: RecipeNotFoundError,
  },
  ingredient: {
    getAll: getAllIngredients,
    getById: getIngredientById,
    create: createIngredient,
    update: updateIngredient,
    delete: deleteIngredient,
    idSchema: ingredientIdParamSchema,
    createSchema: createIngredientRequestSchema,
    updateSchema: updateIngredientRequestSchema,
    responseSchema: ingredientResponseSchema,
    notFoundError: IngredientNotFoundError,
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
    notFoundError: ExperienceNotFoundError,
  },
  expertise: {
    getAll: getAllExpertiseCategories,
    getById: getExpertiseCategoryById,
    create: createExpertiseCategory,
    update: updateExpertiseCategory,
    delete: deleteExpertiseCategory,
    idSchema: expertiseCategoryIdParamSchema,
    createSchema: createExpertiseCategoryRequestSchema,
    updateSchema: updateExpertiseCategoryRequestSchema,
    responseSchema: expertiseCategoryResponseSchema,
    notFoundError: ExpertiseCategoryNotFoundError,
  },
  'job-description': {
    getAll: getAllJobDescriptions,
    getById: getJobDescriptionById,
    create: createJobDescription,
    update: updateJobDescription,
    delete: deleteJobDescription,
    idSchema: jobDescriptionIdParamSchema,
    createSchema: createJobDescriptionRequestSchema,
    updateSchema: updateJobDescriptionRequestSchema,
    responseSchema: jobDescriptionResponseSchema,
    notFoundError: JobDescriptionNotFoundError,
  },
}

// ===== Admin CRUD Router =====
export const adminRouter = Router()

// GET /api/v1/admin/{resource} - List all
adminRouter.get('/:resource', async (req, res) => {
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
adminRouter.get('/:resource/:id', async (req, res) => {
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
    if (error instanceof SectionNotFoundError ||
        error instanceof ContactNotFoundError ||
        error instanceof BlogNotFoundError ||
        error instanceof TripNotFoundError ||
        error instanceof RecipeNotFoundError ||
        error instanceof IngredientNotFoundError ||
        error instanceof ExperienceNotFoundError ||
        error instanceof ExpertiseCategoryNotFoundError ||
        error instanceof JobDescriptionNotFoundError) {
      res.status(404).json({ error: (error as Error).message })
      return
    }
    console.error(`GET /admin/${resource}/${req.params.id} error:`, error)
    res.status(500).json({ error: `Failed to fetch ${resource}` })
  }
})

// POST /api/v1/admin/create/{resource} - Create
adminRouter.post('/create/:resource', async (req, res) => {
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
    // Fire revalidation webhooks to all frontends
    revalidateFrontendCaches(resource)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error(`POST /admin/create/${resource} error:`, error)
    res.status(500).json({ error: `Failed to create ${resource}` })
  }
})

// PATCH /api/v1/admin/update/{resource}/{id} - Update
adminRouter.patch('/update/:resource/:id', async (req, res) => {
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
    // Fire revalidation webhooks to all frontends
    revalidateFrontendCaches(resource)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    if (error instanceof SectionNotFoundError ||
        error instanceof ContactNotFoundError ||
        error instanceof BlogNotFoundError ||
        error instanceof TripNotFoundError ||
        error instanceof RecipeNotFoundError ||
        error instanceof IngredientNotFoundError ||
        error instanceof ExperienceNotFoundError ||
        error instanceof ExpertiseCategoryNotFoundError ||
        error instanceof JobDescriptionNotFoundError) {
      res.status(404).json({ error: (error as Error).message })
      return
    }
    console.error(`PATCH /admin/update/${resource}/${req.params.id} error:`, error)
    res.status(500).json({ error: `Failed to update ${resource}` })
  }
})

// DELETE /api/v1/admin/delete/{resource}/{id} - Delete
adminRouter.delete('/delete/:resource/:id', async (req, res) => {
  const { resource } = req.params
  const handlers = resourceHandlers[resource]
  if (!handlers) {
    res.status(404).json({ error: `Unknown resource: ${resource}` })
    return
  }
  try {
    const id = handlers.idSchema.parse(req.params.id)
    await handlers.delete(id)
    // Fire revalidation webhooks to all frontends
    revalidateFrontendCaches(resource)
    res.status(204).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }
    if (error instanceof SectionNotFoundError ||
        error instanceof ContactNotFoundError ||
        error instanceof BlogNotFoundError ||
        error instanceof TripNotFoundError ||
        error instanceof RecipeNotFoundError ||
        error instanceof IngredientNotFoundError ||
        error instanceof ExperienceNotFoundError ||
        error instanceof ExpertiseCategoryNotFoundError ||
        error instanceof JobDescriptionNotFoundError) {
      res.status(404).json({ error: (error as Error).message })
      return
    }
    console.error(`DELETE /admin/delete/${resource}/${req.params.id} error:`, error)
    res.status(500).json({ error: `Failed to delete ${resource}` })
  }
})