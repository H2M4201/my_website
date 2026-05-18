import { Router } from 'express'
import { z } from 'zod'
import {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  deleteAllSections,
  SectionNotFoundError,
} from '../../db'
import {
  sectionIdParamSchema,
  sectionsListResponseSchema,
  createSectionRequestSchema,
  updateSectionRequestSchema,
  sectionResponseSchema,
} from '../schemas'

export const sectionsRouter = Router()

// GET all sections
sectionsRouter.get('/', async (_req, res) => {
  try {
    const sections = await getAllSections()
    const validated = sectionsListResponseSchema.parse(sections)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/sections error:', error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch sections' })
  }
})

// GET section by ID
sectionsRouter.get('/:id', async (req, res) => {
  try {
    const id = sectionIdParamSchema.parse(req.params.id)
    const section = await getSectionById(id)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(section)
  } catch (error) {
    if (error instanceof SectionNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid section ID' })
      return
    }
    console.error('GET /api/sections/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch section' })
  }
})

// POST create new section
sectionsRouter.post('/', async (req, res) => {
  try {
    const data = createSectionRequestSchema.parse(req.body)
    const section = await createSection(data)
    const validated = sectionResponseSchema.parse(section)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /api/sections error:', error)
    res.status(500).json({ error: 'Failed to create section' })
  }
})

// PATCH update section by ID
sectionsRouter.patch('/:id', async (req, res) => {
  try {
    const id = sectionIdParamSchema.parse(req.params.id)
    const data = updateSectionRequestSchema.parse(req.body)
    const section = await updateSection(id, data)
    const validated = sectionResponseSchema.parse(section)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof SectionNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('PATCH /api/sections/:id error:', error)
    res.status(500).json({ error: 'Failed to update section' })
  }
})

// DELETE section by ID
sectionsRouter.delete('/:id', async (req, res) => {
  try {
    const id = sectionIdParamSchema.parse(req.params.id)
    await deleteSection(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof SectionNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid section ID' })
      return
    }
    console.error('DELETE /api/sections/:id error:', error)
    res.status(500).json({ error: 'Failed to delete section' })
  }
})

// DELETE all sections
sectionsRouter.delete('/', async (_req, res) => {
  try {
    await deleteAllSections()
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /api/sections error:', error)
    res.status(500).json({ error: 'Failed to delete all sections' })
  }
})

