import { NotFoundError } from './notFoundError'

export interface TripDTO {
  id: number
  title: string
  description: string | null
  time: string | null
  location: string | null
  content: string | null
  isActive: boolean
}

export interface CreateTripDTO {
  title: string
  description?: string | null
  time?: string | null
  location?: string | null
  content?: string | null
  isActive?: boolean
}

export interface UpdateTripDTO {
  title?: string
  description?: string | null
  time?: string | null
  location?: string | null
  content?: string | null
  isActive?: boolean
}

export class TripNotFoundError extends NotFoundError {
  constructor(id: number) {
    super('Trip', id)
    this.name = 'TripNotFoundError'
  }
}
