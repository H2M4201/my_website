/** Shapes returned by the portfolio backend API (see `backend/`). */

export interface SectionDTO {
  id: number
  title: string
  description: string | null
  href: string | null
}

export interface ContactDTO {
  id: number
  type: string
  info: string
  icon: string | null
}

export interface BlogDTO {
  id: number
  title: string
  description: string | null
  content: string | null
  isActive: boolean
}

export interface TripDTO {
  id: number
  title: string
  description: string | null
  time: string | null
  location: string | null
  content: string | null
  isActive: boolean
}

// ===== Resume DTOs =====

export interface JobDescriptionDTO {
  id: number
  description: string
  sortOrder: number
  experienceId: number
}

export interface ExperienceSkillDTO {
  id: number
  skill: string
  sortOrder: number
  experienceId: number
}

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

export interface ExpertiseSkillDTO {
  id: number
  skill: string
  sortOrder: number
  expertiseCategoryId: number
}

export interface ExpertiseCategoryDTO {
  id: number
  category: string
  sortOrder: number
  skills: ExpertiseSkillDTO[]
}
