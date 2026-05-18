export interface RecipeDTO {
  id: number
  name: string
  description: string | null
}

export interface CreateRecipeDTO {
  name: string
  description?: string | null
}

export interface UpdateRecipeDTO {
  name?: string
  description?: string | null
}

export class RecipeNotFoundError extends Error {
  constructor(id: number) {
    super(`Recipe with id ${id} not found`)
    this.name = 'RecipeNotFoundError'
  }
}
