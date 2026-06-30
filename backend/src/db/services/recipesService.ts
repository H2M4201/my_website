import { prisma } from '../prisma'
import {
  RecipeDTO,
  CreateRecipeDTO,
  UpdateRecipeDTO,
  RecipeNotFoundError,
} from '../dtos'
import { createCrudService } from './crudService'

const service = createCrudService<RecipeDTO, CreateRecipeDTO, UpdateRecipeDTO>({
  model: prisma.recipe,
  entityName: 'recipe',
  NotFoundError: RecipeNotFoundError,
  mapToDTO: (r) => ({
    id: r.id,
    name: r.Name,
    description: r.Description,
    ingredients: r.Ingredients,
    steps: r.Steps,
    isActive: r.IsActive,
  }),
  mapCreateData: (data) => ({
    Name: data.name,
    Description: data.description || null,
    Ingredients: data.ingredients || null,
    Steps: data.steps || null,
    IsActive: data.isActive ?? true,
  }),
  mergeUpdateData: (existing, data) => ({
    Name: data.name !== undefined ? data.name : existing.Name,
    Description: data.description !== undefined ? data.description : existing.Description,
    Ingredients: data.ingredients !== undefined ? data.ingredients : existing.Ingredients,
    Steps: data.steps !== undefined ? data.steps : existing.Steps,
    IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
  }),
})

export const getAllRecipes = service.getAll
export const getAllRecipesIncludingInactive = service.getAllIncludingInactive
export const getRecipeById = service.getById
export const createRecipe = service.create
export const updateRecipe = service.update
export const deleteRecipe = service.delete
export const deleteAllRecipes = service.deleteAll

export { RecipeNotFoundError } from '../dtos'
