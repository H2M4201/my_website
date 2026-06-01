// ===== Experience DTOs =====
export interface ExperienceDTO {
  id: number
  title: string
  company: string
  period: string
  achievement: string | null
  isActive: boolean
  sortOrder: number
  jobDescriptions: JobDescriptionDTO[]
  skills: ExperienceSkillDTO[]
}

export interface CreateExperienceDTO {
  title: string
  company: string
  period: string
  achievement?: string | null
  isActive?: boolean
  sortOrder?: number
  jobDescriptions?: CreateJobDescriptionDTO[]
  skills?: CreateExperienceSkillDTO[]
}

export interface UpdateExperienceDTO {
  title?: string
  company?: string
  period?: string
  achievement?: string | null
  isActive?: boolean
  sortOrder?: number
  jobDescriptions?: CreateJobDescriptionDTO[]
  skills?: CreateExperienceSkillDTO[]
}

// ===== JobDescription DTOs =====
export interface JobDescriptionDTO {
  id: number
  description: string
  sortOrder: number
  experienceId: number
}

export interface CreateJobDescriptionDTO {
  description: string
  sortOrder?: number
}

// ===== ExperienceSkill DTOs =====
export interface ExperienceSkillDTO {
  id: number
  skill: string
  sortOrder: number
  experienceId: number
}

export interface CreateExperienceSkillDTO {
  skill: string
  sortOrder?: number
}

// ===== ExpertiseCategory DTOs =====
export interface ExpertiseCategoryDTO {
  id: number
  category: string
  sortOrder: number
  isActive: boolean
  skills: ExpertiseSkillDTO[]
}

export interface CreateExpertiseCategoryDTO {
  category: string
  sortOrder?: number
  isActive?: boolean
  skills?: CreateExpertiseSkillDTO[]
}

export interface UpdateExpertiseCategoryDTO {
  category?: string
  sortOrder?: number
  isActive?: boolean
  skills?: CreateExpertiseSkillDTO[]
}

// ===== ExpertiseSkill DTOs =====
export interface ExpertiseSkillDTO {
  id: number
  skill: string
  sortOrder: number
  expertiseCategoryId: number
  isActive: boolean
}

export interface CreateExpertiseSkillDTO {
  skill: string
  sortOrder?: number
}

// ===== Error Classes =====
export class ExperienceNotFoundError extends Error {
  constructor(id: number) {
    super(`Experience with id ${id} not found`)
    this.name = 'ExperienceNotFoundError'
  }
}

export class ExpertiseCategoryNotFoundError extends Error {
  constructor(id: number) {
    super(`ExpertiseCategory with id ${id} not found`)
    this.name = 'ExpertiseCategoryNotFoundError'
  }
}

export class JobDescriptionNotFoundError extends Error {
  constructor(id: number) {
    super(`JobDescription with id ${id} not found`)
    this.name = 'JobDescriptionNotFoundError'
  }
}
