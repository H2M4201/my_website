import { NotFoundError } from './notFoundError'

export interface ContactDTO {
  id: number
  type: string
  info: string
  icon: string | null
  isActive: boolean
}

export interface CreateContactDTO {
  type: string
  info: string
  icon?: string | null
  isActive?: boolean
}

export interface UpdateContactDTO {
  type?: string
  info?: string
  icon?: string | null
  isActive?: boolean
}

export class ContactNotFoundError extends NotFoundError {
  constructor(id: number) {
    super('Contact', id)
    this.name = 'ContactNotFoundError'
  }
}
