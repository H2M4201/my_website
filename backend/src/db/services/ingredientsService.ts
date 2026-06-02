import { prisma } from '../prisma'
import {
  IngredientDTO,
  CreateIngredientDTO,
  UpdateIngredientDTO,
  IngredientNotFoundError,
} from '../dtos'

function mapIngredientToDTO(ingredient: {
  id: number
  IngredientName: string
  IsActive: boolean
  createdAt: Date
  updatedAt: Date
}): IngredientDTO {
  return {
    id: ingredient.id,
    ingredientName: ingredient.IngredientName,
    isActive: ingredient.IsActive,
    createdAt: ingredient.createdAt.toISOString(),
    updatedAt: ingredient.updatedAt.toISOString(),
  }
}

export async function getAllIngredients(): Promise<IngredientDTO[]> {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { id: 'asc' },
    })
    return ingredients.map((i) => mapIngredientToDTO(i as any))
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    throw new Error('Failed to fetch ingredients from database')
  }
}

export async function getIngredientById(id: number): Promise<IngredientDTO> {
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!ingredient) {
      throw new IngredientNotFoundError(id)
    }

    return mapIngredientToDTO(ingredient as any)
  } catch (error) {
    if (error instanceof IngredientNotFoundError) throw error
    console.error('Error fetching ingredient:', error)
    throw new Error('Failed to fetch ingredient from database')
  }
}

export async function createIngredient(data: CreateIngredientDTO): Promise<IngredientDTO> {
  try {
    const ingredient = await prisma.ingredient.create({
      data: {
        IngredientName: data.ingredientName,
        IsActive: data.isActive ?? true,
      },
    })
    return mapIngredientToDTO(ingredient as any)
  } catch (error) {
    console.error('Error creating ingredient:', error)
    throw new Error('Failed to create ingredient in database')
  }
}

export async function updateIngredient(
  id: number,
  data: UpdateIngredientDTO
): Promise<IngredientDTO> {
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!ingredient) {
      throw new IngredientNotFoundError(id)
    }

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        IngredientName:
          data.ingredientName !== undefined
            ? data.ingredientName
            : (ingredient as any).IngredientName,
        IsActive:
          data.isActive !== undefined
            ? data.isActive
            : (ingredient as any).IsActive,
      },
    })

    return mapIngredientToDTO(updated as any)
  } catch (error) {
    if (error instanceof IngredientNotFoundError) throw error
    console.error('Error updating ingredient:', error)
    throw new Error('Failed to update ingredient in database')
  }
}

export async function deleteIngredient(id: number): Promise<void> {
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!ingredient) {
      throw new IngredientNotFoundError(id)
    }

    await prisma.ingredient.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof IngredientNotFoundError) throw error
    console.error('Error deleting ingredient:', error)
    throw new Error('Failed to delete ingredient from database')
  }
}

export async function deleteAllIngredients(): Promise<void> {
  try {
    await prisma.ingredient.deleteMany()
  } catch (error) {
    console.error('Error deleting all ingredients:', error)
    throw new Error('Failed to delete all ingredients from database')
  }
}