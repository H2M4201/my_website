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

// ===== Experience Schemas =====

export const experienceIdParamSchema = z.coerce.number().positive()

const createJobDescriptionSchema = z.object({
  description: z.string().min(1).max(1000),
  sortOrder: z.number().int().optional(),
})

const createExperienceSkillSchema = z.object({
  skill: z.string().min(1).max(100),
  sortOrder: z.number().int().optional(),
})

export const createExperienceRequestSchema = z.object({
  title: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  period: z.string().min(1).max(100),
  achievement: z.string().max(1000).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  jobDescriptions: z.array(createJobDescriptionSchema).optional(),
  skills: z.array(createExperienceSkillSchema).optional(),
})

export const updateExperienceRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  company: z.string().min(1).max(255).optional(),
  period: z.string().min(1).max(100).optional(),
  achievement: z.string().max(1000).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  jobDescriptions: z.array(createJobDescriptionSchema).optional(),
  skills: z.array(createExperienceSkillSchema).optional(),
})

export const jobDescriptionResponseSchema = z.object({
  id: z.number(),
  description: z.string(),
  sortOrder: z.number(),
  experienceId: z.number(),
})

export const experienceSkillResponseSchema = z.object({
  id: z.number(),
  skill: z.string(),
  sortOrder: z.number(),
  experienceId: z.number(),
})

export const experienceResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  company: z.string(),
  period: z.string(),
  achievement: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  jobDescriptions: z.array(jobDescriptionResponseSchema),
  skills: z.array(experienceSkillResponseSchema),
})

export const experiencesListResponseSchema = z.array(experienceResponseSchema)

// ===== ExpertiseCategory Schemas =====

export const expertiseCategoryIdParamSchema = z.coerce.number().positive()

const createExpertiseSkillSchema = z.object({
  skill: z.string().min(1).max(100),
  sortOrder: z.number().int().optional(),
})

export const createExpertiseCategoryRequestSchema = z.object({
  category: z.string().min(1).max(100),
  sortOrder: z.number().int().optional(),
  skills: z.array(createExpertiseSkillSchema).optional(),
})

export const updateExpertiseCategoryRequestSchema = z.object({
  category: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().optional(),
  skills: z.array(createExpertiseSkillSchema).optional(),
})

export const expertiseSkillResponseSchema = z.object({
  id: z.number(),
  skill: z.string(),
  sortOrder: z.number(),
  expertiseCategoryId: z.number(),
})

export const expertiseCategoryResponseSchema = z.object({
  id: z.number(),
  category: z.string(),
  sortOrder: z.number(),
  skills: z.array(expertiseSkillResponseSchema),
})

export const expertiseCategoriesListResponseSchema = z.array(expertiseCategoryResponseSchema)

// ===== JobDescription Schemas (standalone admin CRUD) =====
export const jobDescriptionIdParamSchema = z.coerce.number().positive()

export const createJobDescriptionRequestSchema = z.object({
  description: z.string().min(1),
  sortOrder: z.number().int().optional(),
  experienceId: z.number().int().positive(),
})

export const updateJobDescriptionRequestSchema = z.object({
  description: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
  experienceId: z.number().int().positive().optional(),
})

export const jobDescriptionsListResponseSchema = z.array(jobDescriptionResponseSchema)
