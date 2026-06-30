import { NotFoundError } from './notFoundError'

export interface SectionDTO {
  id: number
  title: string
  description: string | null
  href: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateSectionDTO {
  title: string
  description?: string | null
  href?: string | null
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UpdateSectionDTO {
  title?: string
  description?: string | null
  href?: string | null
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class SectionNotFoundError extends NotFoundError {
  constructor(id: number) {
    super('Section', id)
    this.name = 'SectionNotFoundError'
  }
}
