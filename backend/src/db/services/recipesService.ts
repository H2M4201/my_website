import { prisma } from '../prisma'
import {
  RecipeDTO,
  CreateRecipeDTO,
  UpdateRecipeDTO,
  RecipeNotFoundError,
} from '../dtos'

function mapRecipeToDTO(recipe: {
  id: number
  Name: string
  Description: string | null
}): RecipeDTO {
  return {
    id: recipe.id,
    name: recipe.Name,
    description: recipe.Description,
  }
}

export async function getAllRecipes(): Promise<RecipeDTO[]> {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { id: 'asc' },
    })
    return recipes.map(mapRecipeToDTO)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    throw new Error('Failed to fetch recipes from database')
  }
}

export async function getRecipeById(id: number): Promise<RecipeDTO> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      throw new RecipeNotFoundError(id)
    }

    return mapRecipeToDTO(recipe)
  } catch (error) {
    if (error instanceof RecipeNotFoundError) throw error
    console.error('Error fetching recipe:', error)
    throw new Error('Failed to fetch recipe from database')
  }
}

export async function createRecipe(data: CreateRecipeDTO): Promise<RecipeDTO> {
  try {
    const recipe = await prisma.recipe.create({
      data: {
        Name: data.name,
        Description: data.description || null,
      },
    })
    return mapRecipeToDTO(recipe)
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw new Error('Failed to create recipe in database')
  }
}

export async function updateRecipe(
  id: number,
  data: UpdateRecipeDTO
): Promise<RecipeDTO> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      throw new RecipeNotFoundError(id)
    }

    const updated = await prisma.recipe.update({
      where: { id },
      data: {
        Name: data.name !== undefined ? data.name : recipe.Name,
        Description:
          data.description !== undefined
            ? data.description
            : recipe.Description,
      },
    })

    return mapRecipeToDTO(updated)
  } catch (error) {
    if (error instanceof RecipeNotFoundError) throw error
    console.error('Error updating recipe:', error)
    throw new Error('Failed to update recipe in database')
  }
}

export async function deleteRecipe(id: number): Promise<void> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      throw new RecipeNotFoundError(id)
    }

    await prisma.recipe.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof RecipeNotFoundError) throw error
    console.error('Error deleting recipe:', error)
    throw new Error('Failed to delete recipe from database')
  }
}

export async function deleteAllRecipes(): Promise<void> {
  try {
    await prisma.recipe.deleteMany()
  } catch (error) {
    console.error('Error deleting all recipes:', error)
    throw new Error('Failed to delete all recipes from database')
  }
}
