import { prisma } from '../prisma'
import {
  TripDTO,
  CreateTripDTO,
  UpdateTripDTO,
  TripNotFoundError,
} from '../dtos'
import { createCrudService } from './crudService'

const service = createCrudService<TripDTO, CreateTripDTO, UpdateTripDTO>({
  model: prisma.trip,
  entityName: 'trip',
  NotFoundError: TripNotFoundError,
  mapToDTO: (t) => ({
    id: t.id,
    title: t.Title,
    description: null,
    time: t.Time,
    location: t.Location,
    content: t.Content,
    isActive: t.IsActive,
  }),
  mapCreateData: (data) => ({
    Title: data.title,
    Description: data.description || null,
    Time: data.time || null,
    Location: data.location || null,
    Content: data.content || null,
    IsActive: data.isActive ?? true,
  }),
  mergeUpdateData: (existing, data) => ({
    Title: data.title !== undefined ? data.title : existing.Title,
    Description: data.description !== undefined ? data.description : existing.Description,
    Time: data.time !== undefined ? data.time : existing.Time,
    Location: data.location !== undefined ? data.location : existing.Location,
    Content: data.content !== undefined ? data.content : existing.Content,
    IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
  }),
})

export const getAllTrips = service.getAll
export const getAllTripsIncludingInactive = service.getAllIncludingInactive
export const getTripById = service.getById
export const createTrip = service.create
export const updateTrip = service.update
export const deleteTrip = service.delete
export const deleteAllTrips = service.deleteAll

export { TripNotFoundError } from '../dtos'
