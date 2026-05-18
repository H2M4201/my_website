export interface SectionDTO {
  id: number
  title: string
  description: string | null
  href: string | null
}

export interface CreateSectionDTO {
  title: string
  description?: string | null
  href?: string | null
}

export interface UpdateSectionDTO {
  title?: string
  description?: string | null
  href?: string | null
}

export class SectionNotFoundError extends Error {
  constructor(id: number) {
    super(`Section with id ${id} not found`)
    this.name = 'SectionNotFoundError'
  }
}
