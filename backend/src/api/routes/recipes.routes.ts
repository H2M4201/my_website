import { Router } from 'express'
import { z } from 'zod'
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  deleteAllRecipes,
  RecipeNotFoundError,
} from '../../db'
import {
  recipeIdParamSchema,
  recipesListResponseSchema,
  createRecipeRequestSchema,
  updateRecipeRequestSchema,
  recipeResponseSchema,
} from '../schemas'

export const recipesRouter = Router()

// GET all recipes
recipesRouter.get('/', async (_req, res) => {
  try {
    const recipes = await getAllRecipes()
    const validated = recipesListResponseSchema.parse(recipes)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/recipes error:', error)
    console.error('Error details:', error instanceof Error ? error.stack : error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

// GET recipe by ID
recipesRouter.get('/:id', async (req, res) => {
  try {
    const id = recipeIdParamSchema.parse(req.params.id)
    const recipe = await getRecipeById(id)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(recipe)
  } catch (error) {
    if (error instanceof RecipeNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid recipe ID' })
      return
    }
    console.error('GET /api/recipes/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch recipe' })
  }
})

// POST create new recipe
recipesRouter.post('/', async (req, res) => {
  try {
    const data = createRecipeRequestSchema.parse(req.body)
    const recipe = await createRecipe(data)
    const validated = recipeResponseSchema.parse(recipe)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /api/recipes error:', error)
    res.status(500).json({ error: 'Failed to create recipe' })
  }
})

// PATCH update recipe by ID
recipesRouter.patch('/:id', async (req, res) => {
  try {
    const id = recipeIdParamSchema.parse(req.params.id)
    const data = updateRecipeRequestSchema.parse(req.body)
    const recipe = await updateRecipe(id, data)
    const validated = recipeResponseSchema.parse(recipe)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof RecipeNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('PATCH /api/recipes/:id error:', error)
    res.status(500).json({ error: 'Failed to update recipe' })
  }
})

// DELETE recipe by ID
recipesRouter.delete('/:id', async (req, res) => {
  try {
    const id = recipeIdParamSchema.parse(req.params.id)
    await deleteRecipe(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof RecipeNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid recipe ID' })
      return
    }
    console.error('DELETE /api/recipes/:id error:', error)
    res.status(500).json({ error: 'Failed to delete recipe' })
  }
})

// DELETE all recipes
recipesRouter.delete('/', async (_req, res) => {
  try {
    await deleteAllRecipes()
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /api/recipes error:', error)
    res.status(500).json({ error: 'Failed to delete all recipes' })
  }
})
