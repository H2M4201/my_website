import { Router } from 'express'
import { z } from 'zod'
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  deleteAllIngredients,
  IngredientNotFoundError,
} from '../../db'
import {
  ingredientIdParamSchema,
  ingredientsListResponseSchema,
  createIngredientRequestSchema,
  updateIngredientRequestSchema,
  ingredientResponseSchema,
} from '../schemas'

export const ingredientsRouter = Router()

// GET all ingredients
ingredientsRouter.get('/', async (_req, res) => {
  try {
    const ingredients = await getAllIngredients()
    const validated = ingredientsListResponseSchema.parse(ingredients)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/ingredients error:', error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch ingredients' })
  }
})

// GET ingredient by ID
ingredientsRouter.get('/:id', async (req, res) => {
  try {
    const id = ingredientIdParamSchema.parse(req.params.id)
    const ingredient = await getIngredientById(id)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(ingredient)
  } catch (error) {
    if (error instanceof IngredientNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid ingredient ID' })
      return
    }
    console.error('GET /api/ingredients/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch ingredient' })
  }
})

// POST create new ingredient
ingredientsRouter.post('/', async (req, res) => {
  try {
    const data = createIngredientRequestSchema.parse(req.body)
    const ingredient = await createIngredient(data)
    const validated = ingredientResponseSchema.parse(ingredient)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /api/ingredients error:', error)
    res.status(500).json({ error: 'Failed to create ingredient' })
  }
})

// PATCH update ingredient by ID
ingredientsRouter.patch('/:id', async (req, res) => {
  try {
    const id = ingredientIdParamSchema.parse(req.params.id)
    const data = updateIngredientRequestSchema.parse(req.body)
    const ingredient = await updateIngredient(id, data)
    const validated = ingredientResponseSchema.parse(ingredient)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof IngredientNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('PATCH /api/ingredients/:id error:', error)
    res.status(500).json({ error: 'Failed to update ingredient' })
  }
})

// DELETE ingredient by ID
ingredientsRouter.delete('/:id', async (req, res) => {
  try {
    const id = ingredientIdParamSchema.parse(req.params.id)
    await deleteIngredient(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof IngredientNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid ingredient ID' })
      return
    }
    console.error('DELETE /api/ingredients/:id error:', error)
    res.status(500).json({ error: 'Failed to delete ingredient' })
  }
})

// DELETE all ingredients
ingredientsRouter.delete('/', async (_req, res) => {
  try {
    await deleteAllIngredients()
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /api/ingredients error:', error)
    res.status(500).json({ error: 'Failed to delete all ingredients' })
  }
})