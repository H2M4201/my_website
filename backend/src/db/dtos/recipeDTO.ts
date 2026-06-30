import { NotFoundError } from './notFoundError'

export interface RecipeDTO {
  id: number
  name: string
  description: string | null
  ingredients: string | null
  steps: string | null
  isActive: boolean
}

export interface CreateRecipeDTO {
  name: string
  description?: string | null
  ingredients?: string | null
  steps?: string | null
  isActive?: boolean
}

export interface UpdateRecipeDTO {
  name?: string
  description?: string | null
  ingredients?: string | null
  steps?: string | null
  isActive?: boolean
}

export class RecipeNotFoundError extends NotFoundError {
  constructor(id: number) {
    super('Recipe', id)
    this.name = 'RecipeNotFoundError'
  }
}
