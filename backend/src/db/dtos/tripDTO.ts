export interface TripDTO {
  id: number
  title: string
  time: string | null
  location: string | null
  content: string | null
}

export interface CreateTripDTO {
  title: string
  time?: string | null
  location?: string | null
  content?: string | null
}

export interface UpdateTripDTO {
  title?: string
  time?: string | null
  location?: string | null
  content?: string | null
}

export class TripNotFoundError extends Error {
  constructor(id: number) {
    super(`Trip with id ${id} not found`)
    this.name = 'TripNotFoundError'
  }
}
