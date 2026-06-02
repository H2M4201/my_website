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

export class IngredientNotFoundError extends Error {
  constructor(id: number) {
    super(`Ingredient with id ${id} not found`)
    this.name = 'IngredientNotFoundError'
  }
}