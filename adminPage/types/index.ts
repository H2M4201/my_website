export interface User {
  id: number
  username: string
  email: string | null
  name: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Section {
  id: number
  title: string
  description: string | null
  href: string | null
}

export interface Contact {
  id: number
  type: string
  info: string
  icon: string | null
}

export interface Blog {
  id: number
  title: string
  description: string | null
  content: string | null
}

export interface Trip {
  id: number
  title: string
  time: string | null
  location: string | null
  content: string | null
}

export interface Recipe {
  id: number
  name: string
  description: string | null
}

export interface Resume {
  id: number
  title: string
  content: string | null
}

export interface JobDescription {
  id: number
  description: string
  sortOrder: number
  experienceId: number
}

export interface ExperienceSkill {
  id: number
  skill: string
  sortOrder: number
  experienceId: number
}

export interface Experience {
  id: number
  title: string
  company: string
  period: string
  achievement: string | null
  isActive: boolean
  sortOrder: number
  jobDescriptions: JobDescription[]
  skills: ExperienceSkill[]
}

export interface ExpertiseSkill {
  id: number
  skill: string
  sortOrder: number
  expertiseCategoryId: number
}

export interface ExpertiseCategory {
  id: number
  category: string
  sortOrder: number
  skills: ExpertiseSkill[]
}

export interface Role {
  id: number
  name: string
  description: string | null
}

export interface Permission {
  id: number
  name: string
  description: string | null
}

export interface AdminUser {
  id: number
  username: string
  email: string | null
  name: string
  roleId: number | null
}

export type ResourceType =
  | 'section'
  | 'contact'
  | 'blog'
  | 'trip'
  | 'recipe'
  | 'resume'
  | 'experience'
  | 'expertise'
  | 'job-description'
  | 'user'
  | 'role'
  | 'permission'
