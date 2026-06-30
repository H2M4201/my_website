import { prisma } from '../prisma'
import {
  IngredientDTO,
  CreateIngredientDTO,
  UpdateIngredientDTO,
  IngredientNotFoundError,
} from '../dtos'
import { createCrudService } from './crudService'

const service = createCrudService<IngredientDTO, CreateIngredientDTO, UpdateIngredientDTO>({
  model: prisma.ingredient,
  entityName: 'ingredient',
  NotFoundError: IngredientNotFoundError,
  mapToDTO: (i) => ({
    id: i.id,
    ingredientName: i.IngredientName,
    isActive: i.IsActive,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }),
  mapCreateData: (data) => ({
    IngredientName: data.ingredientName,
    IsActive: data.isActive ?? true,
  }),
  mergeUpdateData: (existing, data) => ({
    IngredientName: data.ingredientName !== undefined ? data.ingredientName : existing.IngredientName,
    IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
  }),
})

export const getAllIngredients = service.getAll
export const getAllIngredientsIncludingInactive = service.getAllIncludingInactive
export const getIngredientById = service.getById
export const createIngredient = service.create
export const updateIngredient = service.update
export const deleteIngredient = service.delete
export const deleteAllIngredients = service.deleteAll

export { IngredientNotFoundError } from '../dtos'
