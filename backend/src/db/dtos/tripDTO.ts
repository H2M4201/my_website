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

export class TripNotFoundError extends Error {
  constructor(id: number) {
    super(`Trip with id ${id} not found`)
    this.name = 'TripNotFoundError'
  }
}
