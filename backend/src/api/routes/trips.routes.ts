import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  deleteAllTrips,
} from '../../db'
import {
  tripIdParamSchema,
  tripsListResponseSchema,
  createTripRequestSchema,
  updateTripRequestSchema,
  tripResponseSchema,
} from '../schemas'
import { createCrudRouter } from './crudRoutes'

export const tripsRouter = createCrudRouter('trip', {
  getAll: getAllTrips,
  getById: getTripById,
  create: createTrip,
  update: updateTrip,
  delete: deleteTrip,
  deleteAll: deleteAllTrips,
}, {
  idSchema: tripIdParamSchema,
  createSchema: createTripRequestSchema,
  updateSchema: updateTripRequestSchema,
  responseSchema: tripResponseSchema,
  listResponseSchema: tripsListResponseSchema,
})
