import { prisma } from '../prisma'
import {
  SectionDTO,
  CreateSectionDTO,
  UpdateSectionDTO,
  SectionNotFoundError,
} from '../dtos'

function mapSectionToDTO(section: {
  id: number
  SectionName: string
  Description: string | null
  Href: string | null
}): SectionDTO {
  return {
    id: section.id,
    title: section.SectionName,
    description: section.Description,
    href: section.Href,
  }
}

export async function getAllSections(): Promise<SectionDTO[]> {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { id: 'asc' },
    })
    return sections.map(mapSectionToDTO)
  } catch (error) {
    console.error('Error fetching sections:', error)
    throw new Error('Failed to fetch sections from database')
  }
}

export async function getSectionById(id: number): Promise<SectionDTO> {
  try {
    const section = await prisma.section.findUnique({
      where: { id },
    })

    if (!section) {
      throw new SectionNotFoundError(id)
    }

    return mapSectionToDTO(section)
  } catch (error) {
    if (error instanceof SectionNotFoundError) throw error
    console.error('Error fetching section:', error)
    throw new Error('Failed to fetch section from database')
  }
}

export async function createSection(
  data: CreateSectionDTO
): Promise<SectionDTO> {
  try {
    const section = await prisma.section.create({
      data: {
        SectionName: data.title,
        Description: data.description || null,
        Href: data.href || null,
      },
    })
    return mapSectionToDTO(section)
  } catch (error) {
    console.error('Error creating section:', error)
    throw new Error('Failed to create section in database')
  }
}

export async function updateSection(
  id: number,
  data: UpdateSectionDTO
): Promise<SectionDTO> {
  try {
    const section = await prisma.section.findUnique({
      where: { id },
    })

    if (!section) {
      throw new SectionNotFoundError(id)
    }

    const updated = await prisma.section.update({
      where: { id },
      data: {
        SectionName: data.title !== undefined ? data.title : section.SectionName,
        Description:
          data.description !== undefined ? data.description : section.Description,
        Href: data.href !== undefined ? data.href : section.Href,
      },
    })

    return mapSectionToDTO(updated)
  } catch (error) {
    if (error instanceof SectionNotFoundError) throw error
    console.error('Error updating section:', error)
    throw new Error('Failed to update section in database')
  }
}

export async function deleteSection(id: number): Promise<void> {
  try {
    const section = await prisma.section.findUnique({
      where: { id },
    })

    if (!section) {
      throw new SectionNotFoundError(id)
    }

    await prisma.section.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof SectionNotFoundError) throw error
    console.error('Error deleting section:', error)
    throw new Error('Failed to delete section from database')
  }
}

export async function deleteAllSections(): Promise<void> {
  try {
    await prisma.section.deleteMany()
  } catch (error) {
    console.error('Error deleting all sections:', error)
    throw new Error('Failed to delete all sections from database')
  }
}
