import { Router } from 'express'
import { z } from 'zod'
import {
  getAllExperiences,
  getExperienceById,
  getAllExpertiseCategories,
  getExpertiseCategoryById,
  ExperienceNotFoundError,
  ExpertiseCategoryNotFoundError,
} from '../../db'
import {
  experienceIdParamSchema,
  experiencesListResponseSchema,
  experienceResponseSchema,
  expertiseCategoryIdParamSchema,
  expertiseCategoriesListResponseSchema,
  expertiseCategoryResponseSchema,
} from '../schemas'

export const resumeRouter = Router()

// GET all active experiences (public)
resumeRouter.get('/experiences', async (_req, res) => {
  try {
    const experiences = await getAllExperiences(false)
    const validated = experiencesListResponseSchema.parse(experiences)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/resume/experiences error:', error)
    console.error('Error details:', error instanceof Error ? error.stack : error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch experiences' })
  }
})

// GET experience by ID (public)
resumeRouter.get('/experiences/:id', async (req, res) => {
  try {
    const id = experienceIdParamSchema.parse(req.params.id)
    const experience = await getExperienceById(id)
    const validated = experienceResponseSchema.parse(experience)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    })
    res.json(validated)
  } catch (error) {
    if (error instanceof ExperienceNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid experience ID' })
      return
    }
    console.error('GET /api/resume/experiences/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch experience' })
  }
})

// GET all expertise categories (public)
resumeRouter.get('/expertise', async (_req, res) => {
  try {
    const categories = await getAllExpertiseCategories()
    const validated = expertiseCategoriesListResponseSchema.parse(categories)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/resume/expertise error:', error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch expertise categories' })
  }
})

// GET expertise category by ID (public)
resumeRouter.get('/expertise/:id', async (req, res) => {
  try {
    const id = expertiseCategoryIdParamSchema.parse(req.params.id)
    const category = await getExpertiseCategoryById(id)
    const validated = expertiseCategoryResponseSchema.parse(category)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    })
    res.json(validated)
  } catch (error) {
    if (error instanceof ExpertiseCategoryNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid expertise category ID' })
      return
    }
    console.error('GET /api/resume/expertise/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch expertise category' })
  }
})