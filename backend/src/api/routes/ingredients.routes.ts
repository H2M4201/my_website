import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  deleteAllIngredients,
} from '../../db'
import {
  ingredientIdParamSchema,
  ingredientsListResponseSchema,
  createIngredientRequestSchema,
  updateIngredientRequestSchema,
  ingredientResponseSchema,
} from '../schemas'
import { createCrudRouter } from './crudRoutes'

export const ingredientsRouter = createCrudRouter('ingredient', {
  getAll: getAllIngredients,
  getById: getIngredientById,
  create: createIngredient,
  update: updateIngredient,
  delete: deleteIngredient,
  deleteAll: deleteAllIngredients,
}, {
  idSchema: ingredientIdParamSchema,
  createSchema: createIngredientRequestSchema,
  updateSchema: updateIngredientRequestSchema,
  responseSchema: ingredientResponseSchema,
  listResponseSchema: ingredientsListResponseSchema,
})
