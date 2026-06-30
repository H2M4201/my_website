import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  deleteAllRecipes,
} from '../../db'
import {
  recipeIdParamSchema,
  recipesListResponseSchema,
  createRecipeRequestSchema,
  updateRecipeRequestSchema,
  recipeResponseSchema,
} from '../schemas'
import { createCrudRouter } from './crudRoutes'

export const recipesRouter = createCrudRouter('recipe', {
  getAll: getAllRecipes,
  getById: getRecipeById,
  create: createRecipe,
  update: updateRecipe,
  delete: deleteRecipe,
  deleteAll: deleteAllRecipes,
}, {
  idSchema: recipeIdParamSchema,
  createSchema: createRecipeRequestSchema,
  updateSchema: updateRecipeRequestSchema,
  responseSchema: recipeResponseSchema,
  listResponseSchema: recipesListResponseSchema,
})
