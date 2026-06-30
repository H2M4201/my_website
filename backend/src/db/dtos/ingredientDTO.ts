import { NotFoundError } from './notFoundError'

export interface IngredientDTO {
  id: number
  ingredientName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateIngredientDTO {
  ingredientName: string
  isActive?: boolean
}

export interface UpdateIngredientDTO {
  ingredientName?: string
  isActive?: boolean
}

export class IngredientNotFoundError extends NotFoundError {
  constructor(id: number) {
    super('Ingredient', id)
    this.name = 'IngredientNotFoundError'
  }
}