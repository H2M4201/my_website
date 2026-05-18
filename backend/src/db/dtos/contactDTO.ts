export interface ContactDTO {
  id: number
  type: string
  info: string
  icon: string | null
}

export interface CreateContactDTO {
  type: string
  info: string
  icon?: string | null
}

export interface UpdateContactDTO {
  type?: string
  info?: string
  icon?: string | null
}

export class ContactNotFoundError extends Error {
  constructor(id: number) {
    super(`Contact with id ${id} not found`)
    this.name = 'ContactNotFoundError'
  }
}
