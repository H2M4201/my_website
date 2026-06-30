import { prisma } from '../prisma'
import {
  ExperienceDTO,
  CreateExperienceDTO,
  UpdateExperienceDTO,
  ExpertiseCategoryDTO,
  CreateExpertiseCategoryDTO,
  UpdateExpertiseCategoryDTO,
  JobDescriptionDTO,
  CreateJobDescriptionDTO,
  ExperienceNotFoundError,
  ExpertiseCategoryNotFoundError,
  JobDescriptionNotFoundError,
} from '../dtos'

// ============================================================
// Experience Service
// ============================================================

function mapExperience(exp: any): ExperienceDTO {
  return {
    id: exp.id,
    title: exp.Title,
    company: exp.Company,
    period: exp.Period,
    achievement: exp.Achievement,
    isActive: exp.IsActive,
    sortOrder: exp.SortOrder,
    jobDescriptions: (exp.jobDescriptions || []).map((jd: any) => ({
      id: jd.id,
      description: jd.Description,
      sortOrder: jd.SortOrder,
      experienceId: jd.experienceId,
    })),
    skills: (exp.skills || []).map((s: any) => ({
      id: s.id,
      skill: s.Skill,
      sortOrder: s.SortOrder,
      experienceId: s.experienceId,
    })),
  }
}

export async function getAllExperiences(includeInactive = false): Promise<ExperienceDTO[]> {
  try {
    const where = includeInactive ? {} : { IsActive: true }
    const experiences = await prisma.experience.findMany({
      where,
      orderBy: { SortOrder: 'asc' },
      include: {
        jobDescriptions: { orderBy: { SortOrder: 'asc' } },
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return experiences.map(mapExperience)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    throw new Error('Failed to fetch experiences')
  }
}

export async function getExperienceById(id: number): Promise<ExperienceDTO> {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        jobDescriptions: { orderBy: { SortOrder: 'asc' } },
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    if (!experience) {
      throw new ExperienceNotFoundError(id)
    }
    return mapExperience(experience)
  } catch (error) {
    if (error instanceof ExperienceNotFoundError) throw error
    console.error('Error fetching experience:', error)
    throw new Error('Failed to fetch experience')
  }
}

export async function createExperience(data: CreateExperienceDTO): Promise<ExperienceDTO> {
  try {
    const experience = await prisma.experience.create({
      data: {
        Title: data.title,
        Company: data.company,
        Period: data.period,
        Achievement: data.achievement || null,
        IsActive: data.isActive ?? true,
        SortOrder: data.sortOrder ?? 0,
        jobDescriptions: data.jobDescriptions
          ? {
              create: data.jobDescriptions.map((jd, i) => ({
                Description: jd.description,
                SortOrder: jd.sortOrder ?? i,
              })),
            }
          : undefined,
        skills: data.skills
          ? {
              create: data.skills.map((s, i) => ({
                Skill: s.skill,
                SortOrder: s.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: {
        jobDescriptions: { orderBy: { SortOrder: 'asc' } },
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return mapExperience(experience)
  } catch (error) {
    console.error('Error creating experience:', error)
    throw new Error('Failed to create experience')
  }
}

export async function updateExperience(id: number, data: UpdateExperienceDTO): Promise<ExperienceDTO> {
  try {
    const existing = await prisma.experience.findUnique({ where: { id } })
    if (!existing) {
      throw new ExperienceNotFoundError(id)
    }

    // If jobDescriptions are provided, delete all existing and recreate
    if (data.jobDescriptions) {
      await prisma.jobDescription.deleteMany({ where: { experienceId: id } })
    }
    // If skills are provided, delete all existing and recreate
    if (data.skills) {
      await prisma.experienceSkill.deleteMany({ where: { experienceId: id } })
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        Title: data.title !== undefined ? data.title : existing.Title,
        Company: data.company !== undefined ? data.company : existing.Company,
        Period: data.period !== undefined ? data.period : existing.Period,
        Achievement: data.achievement !== undefined ? data.achievement : existing.Achievement,
        IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
        SortOrder: data.sortOrder !== undefined ? data.sortOrder : existing.SortOrder,
        jobDescriptions: data.jobDescriptions
          ? {
              create: data.jobDescriptions.map((jd, i) => ({
                Description: jd.description,
                SortOrder: jd.sortOrder ?? i,
              })),
            }
          : undefined,
        skills: data.skills
          ? {
              create: data.skills.map((s, i) => ({
                Skill: s.skill,
                SortOrder: s.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: {
        jobDescriptions: { orderBy: { SortOrder: 'asc' } },
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return mapExperience(experience)
  } catch (error) {
    if (error instanceof ExperienceNotFoundError) throw error
    console.error('Error updating experience:', error)
    throw new Error('Failed to update experience')
  }
}

export async function deleteExperience(id: number): Promise<void> {
  try {
    const existing = await prisma.experience.findUnique({ where: { id } })
    if (!existing) {
      throw new ExperienceNotFoundError(id)
    }
    await prisma.experience.delete({ where: { id } })
  } catch (error) {
    if (error instanceof ExperienceNotFoundError) throw error
    console.error('Error deleting experience:', error)
    throw new Error('Failed to delete experience')
  }
}

export async function deleteAllExperiences(): Promise<void> {
  try {
    await prisma.experience.deleteMany()
  } catch (error) {
    console.error('Error deleting all experiences:', error)
    throw new Error('Failed to delete all experiences')
  }
}

// ============================================================
// ExpertiseCategory Service
// ============================================================

function mapExpertiseCategory(cat: any): ExpertiseCategoryDTO {
  return {
    id: cat.id,
    category: cat.Category,
    sortOrder: cat.SortOrder,
    isActive: cat.IsActive,
    skills: (cat.skills || []).map((s: any) => ({
      id: s.id,
      skill: s.Skill,
      sortOrder: s.SortOrder,
      expertiseCategoryId: s.expertiseCategoryId,
      isActive: s.IsActive ?? true,
    })),
  }
}

export async function getAllExpertiseCategories(): Promise<ExpertiseCategoryDTO[]> {
  try {
    const categories = await prisma.expertiseCategory.findMany({
      where: { IsActive: true },
      orderBy: { SortOrder: 'asc' },
      include: {
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return categories.map(mapExpertiseCategory)
  } catch (error) {
    console.error('Error fetching expertise categories:', error)
    throw new Error('Failed to fetch expertise categories')
  }
}

export async function getAllExpertiseCategoriesIncludingInactive(): Promise<ExpertiseCategoryDTO[]> {
  try {
    const categories = await prisma.expertiseCategory.findMany({
      orderBy: { SortOrder: 'asc' },
      include: {
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return categories.map(mapExpertiseCategory)
  } catch (error) {
    console.error('Error fetching expertise categories:', error)
    throw new Error('Failed to fetch expertise categories')
  }
}

export async function getExpertiseCategoryById(id: number): Promise<ExpertiseCategoryDTO> {
  try {
    const category = await prisma.expertiseCategory.findUnique({
      where: { id },
      include: {
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    if (!category) {
      throw new ExpertiseCategoryNotFoundError(id)
    }
    return mapExpertiseCategory(category)
  } catch (error) {
    if (error instanceof ExpertiseCategoryNotFoundError) throw error
    console.error('Error fetching expertise category:', error)
    throw new Error('Failed to fetch expertise category')
  }
}

export async function createExpertiseCategory(data: CreateExpertiseCategoryDTO): Promise<ExpertiseCategoryDTO> {
  try {
    const category = await prisma.expertiseCategory.create({
      data: {
        Category: data.category,
        SortOrder: data.sortOrder ?? 0,
        IsActive: data.isActive ?? true,
        skills: data.skills
          ? {
              create: data.skills.map((s, i) => ({
                Skill: s.skill,
                SortOrder: s.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: {
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return mapExpertiseCategory(category)
  } catch (error) {
    console.error('Error creating expertise category:', error)
    throw new Error('Failed to create expertise category')
  }
}

export async function updateExpertiseCategory(id: number, data: UpdateExpertiseCategoryDTO): Promise<ExpertiseCategoryDTO> {
  try {
    const existing = await prisma.expertiseCategory.findUnique({ where: { id } })
    if (!existing) {
      throw new ExpertiseCategoryNotFoundError(id)
    }

    if (data.skills) {
      await prisma.expertiseSkill.deleteMany({ where: { expertiseCategoryId: id } })
    }

    const category = await prisma.expertiseCategory.update({
      where: { id },
      data: {
        Category: data.category !== undefined ? data.category : existing.Category,
        SortOrder: data.sortOrder !== undefined ? data.sortOrder : existing.SortOrder,
        IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
        skills: data.skills
          ? {
              create: data.skills.map((s, i) => ({
                Skill: s.skill,
                SortOrder: s.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: {
        skills: { orderBy: { SortOrder: 'asc' } },
      },
    })
    return mapExpertiseCategory(category)
  } catch (error) {
    if (error instanceof ExpertiseCategoryNotFoundError) throw error
    console.error('Error updating expertise category:', error)
    throw new Error('Failed to update expertise category')
  }
}

export async function deleteExpertiseCategory(id: number): Promise<void> {
  try {
    const existing = await prisma.expertiseCategory.findUnique({ where: { id } })
    if (!existing) {
      throw new ExpertiseCategoryNotFoundError(id)
    }
    await prisma.expertiseCategory.delete({ where: { id } })
  } catch (error) {
    if (error instanceof ExpertiseCategoryNotFoundError) throw error
    console.error('Error deleting expertise category:', error)
    throw new Error('Failed to delete expertise category')
  }
}

export async function deleteAllExpertiseCategories(): Promise<void> {
  try {
    await prisma.expertiseCategory.deleteMany()
  } catch (error) {
    console.error('Error deleting all expertise categories:', error)
    throw new Error('Failed to delete all expertise categories')
  }
}

// ============================================================
// JobDescription Service
// ============================================================

export async function getAllJobDescriptions(): Promise<JobDescriptionDTO[]> {
  try {
    const items = await prisma.jobDescription.findMany({
      where: { IsActive: true },
      orderBy: [{ experienceId: 'asc' }, { SortOrder: 'asc' }],
    })
    return items.map(jd => ({
      id: jd.id,
      description: jd.Description,
      sortOrder: jd.SortOrder,
      experienceId: jd.experienceId,
    }))
  } catch (error) {
    console.error('Error fetching job descriptions:', error)
    throw new Error('Failed to fetch job descriptions')
  }
}

export async function getAllJobDescriptionsIncludingInactive(): Promise<JobDescriptionDTO[]> {
  try {
    const items = await prisma.jobDescription.findMany({
      orderBy: [{ experienceId: 'asc' }, { SortOrder: 'asc' }],
    })
    return items.map(jd => ({
      id: jd.id,
      description: jd.Description,
      sortOrder: jd.SortOrder,
      experienceId: jd.experienceId,
    }))
  } catch (error) {
    console.error('Error fetching job descriptions:', error)
    throw new Error('Failed to fetch job descriptions')
  }
}

export async function getJobDescriptionById(id: number): Promise<JobDescriptionDTO> {
  try {
    const item = await prisma.jobDescription.findUnique({ where: { id } })
    if (!item) {
      throw new JobDescriptionNotFoundError(id)
    }
    return {
      id: item.id,
      description: item.Description,
      sortOrder: item.SortOrder,
      experienceId: item.experienceId,
    }
  } catch (error) {
    if (error instanceof JobDescriptionNotFoundError) throw error
    console.error('Error fetching job description:', error)
    throw new Error('Failed to fetch job description')
  }
}

export async function createJobDescription(data: CreateJobDescriptionDTO & { experienceId: number }): Promise<JobDescriptionDTO> {
  try {
    const item = await prisma.jobDescription.create({
      data: {
        Description: data.description,
        SortOrder: data.sortOrder ?? 0,
        experienceId: data.experienceId,
      },
    })
    return {
      id: item.id,
      description: item.Description,
      sortOrder: item.SortOrder,
      experienceId: item.experienceId,
    }
  } catch (error) {
    console.error('Error creating job description:', error)
    throw new Error('Failed to create job description')
  }
}

export async function updateJobDescription(id: number, data: Partial<CreateJobDescriptionDTO & { experienceId: number }>): Promise<JobDescriptionDTO> {
  try {
    const existing = await prisma.jobDescription.findUnique({ where: { id } })
    if (!existing) {
      throw new JobDescriptionNotFoundError(id)
    }
    const item = await prisma.jobDescription.update({
      where: { id },
      data: {
        Description: data.description !== undefined ? data.description : existing.Description,
        SortOrder: data.sortOrder !== undefined ? data.sortOrder : existing.SortOrder,
        experienceId: data.experienceId !== undefined ? data.experienceId : existing.experienceId,
      },
    })
    return {
      id: item.id,
      description: item.Description,
      sortOrder: item.SortOrder,
      experienceId: item.experienceId,
    }
  } catch (error) {
    if (error instanceof JobDescriptionNotFoundError) throw error
    console.error('Error updating job description:', error)
    throw new Error('Failed to update job description')
  }
}

export async function deleteJobDescription(id: number): Promise<void> {
  try {
    const existing = await prisma.jobDescription.findUnique({ where: { id } })
    if (!existing) {
      throw new JobDescriptionNotFoundError(id)
    }
    await prisma.jobDescription.delete({ where: { id } })
  } catch (error) {
    if (error instanceof JobDescriptionNotFoundError) throw error
    console.error('Error deleting job description:', error)
    throw new Error('Failed to delete job description')
  }
}
