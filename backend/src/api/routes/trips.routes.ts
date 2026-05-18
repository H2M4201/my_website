import { Router } from 'express'
import { z } from 'zod'
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  deleteAllTrips,
  TripNotFoundError,
} from '../../db'
import {
  tripIdParamSchema,
  tripsListResponseSchema,
  createTripRequestSchema,
  updateTripRequestSchema,
  tripResponseSchema,
} from '../schemas'

export const tripsRouter = Router()

// GET all trips
tripsRouter.get('/', async (_req, res) => {
  try {
    const trips = await getAllTrips()
    const validated = tripsListResponseSchema.parse(trips)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/trips error:', error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch trips' })
  }
})

// GET trip by ID
tripsRouter.get('/:id', async (req, res) => {
  try {
    const id = tripIdParamSchema.parse(req.params.id)
    const trip = await getTripById(id)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(trip)
  } catch (error) {
    if (error instanceof TripNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid trip ID' })
      return
    }
    console.error('GET /api/trips/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch trip' })
  }
})

// POST create new trip
tripsRouter.post('/', async (req, res) => {
  try {
    const data = createTripRequestSchema.parse(req.body)
    const trip = await createTrip(data)
    const validated = tripResponseSchema.parse(trip)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /api/trips error:', error)
    res.status(500).json({ error: 'Failed to create trip' })
  }
})

// PATCH update trip by ID
tripsRouter.patch('/:id', async (req, res) => {
  try {
    const id = tripIdParamSchema.parse(req.params.id)
    const data = updateTripRequestSchema.parse(req.body)
    const trip = await updateTrip(id, data)
    const validated = tripResponseSchema.parse(trip)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof TripNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('PATCH /api/trips/:id error:', error)
    res.status(500).json({ error: 'Failed to update trip' })
  }
})

// DELETE trip by ID
tripsRouter.delete('/:id', async (req, res) => {
  try {
    const id = tripIdParamSchema.parse(req.params.id)
    await deleteTrip(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof TripNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid trip ID' })
      return
    }
    console.error('DELETE /api/trips/:id error:', error)
    res.status(500).json({ error: 'Failed to delete trip' })
  }
})

// DELETE all trips
tripsRouter.delete('/', async (_req, res) => {
  try {
    await deleteAllTrips()
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /api/trips error:', error)
    res.status(500).json({ error: 'Failed to delete all trips' })
  }
})
