import { z } from 'zod'

// ===== Section Schemas =====

export const sectionIdParamSchema = z.coerce.number().positive()

export const createSectionRequestSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
})

export const updateSectionRequestSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
})

export const sectionResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  href: z.string().nullable(),
})

export const sectionsListResponseSchema = z.array(sectionResponseSchema)

// ===== Contact Schemas =====

export const contactIdParamSchema = z.coerce.number().positive()

export const createContactRequestSchema = z.object({
  type: z.string().min(1).max(50),
  info: z.string().min(1).max(255),
  icon: z.string().nullable().optional(),
})

export const updateContactRequestSchema = z.object({
  type: z.string().min(1).max(50).optional(),
  info: z.string().min(1).max(255).optional(),
  icon: z.string().nullable().optional(),
})

export const contactResponseSchema = z.object({
  id: z.number(),
  type: z.string(),
  info: z.string(),
  icon: z.string().nullable(),
})

export const contactsListResponseSchema = z.array(contactResponseSchema)

// ===== Blog Schemas =====

export const blogIdParamSchema = z.coerce.number().positive()

export const createBlogRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
})

export const updateBlogRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
})

export const blogResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string().nullable(),
})

export const blogsListResponseSchema = z.array(blogResponseSchema)

// ===== Trip Schemas =====

export const tripIdParamSchema = z.coerce.number().positive()

export const createTripRequestSchema = z.object({
  title: z.string().min(1).max(255),
  time: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
})

export const updateTripRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  time: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
})

export const tripResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  time: z.string().nullable(),
  location: z.string().nullable(),
  content: z.string().nullable(),
})

export const tripsListResponseSchema = z.array(tripResponseSchema)

// ===== Recipe Schemas =====

export const recipeIdParamSchema = z.coerce.number().positive()

export const createRecipeRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
})

export const updateRecipeRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
})

export const recipeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
})

export const recipesListResponseSchema = z.array(recipeResponseSchema)
