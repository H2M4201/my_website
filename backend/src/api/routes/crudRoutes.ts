import { Router } from 'express'
import { z } from 'zod'
import { NotFoundError } from '../../db'

export interface CrudRouteSchemas {
  idSchema: z.ZodSchema
  createSchema: z.ZodSchema
  updateSchema: z.ZodSchema
  responseSchema: z.ZodSchema
  listResponseSchema: z.ZodSchema
}

export interface CrudRouteService {
  getAll: () => Promise<any[]>
  getById: (id: number) => Promise<any>
  create: (data: any) => Promise<any>
  update: (id: number, data: any) => Promise<any>
  delete: (id: number) => Promise<void>
  deleteAll: () => Promise<void>
}

export function createCrudRouter(
  entityName: string,
  service: CrudRouteService,
  schemas: CrudRouteSchemas
): Router {
  const router = Router()

  // GET all
  router.get('/', async (_req, res) => {
    try {
      const items = await service.getAll()
      const validated = schemas.listResponseSchema.parse(items)
      res.status(200).set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      })
      res.json(validated)
    } catch (error) {
      console.error(`GET /api/v1/${entityName}s error:`, error)
      console.error('Error details:', error instanceof Error ? error.stack : error)
      if (error instanceof z.ZodError) {
        res.status(500).json({ error: 'Validation failed', details: error.errors })
        return
      }
      res.status(500).json({ error: `Failed to fetch ${entityName}s` })
    }
  })

  // GET by ID
  router.get('/:id', async (req, res) => {
    try {
      const id = schemas.idSchema.parse(req.params.id)
      const item = await service.getById(id)
      res.status(200).set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      })
      res.json(item)
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message })
        return
      }
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: `Invalid ${entityName} ID` })
        return
      }
      console.error(`GET /api/v1/${entityName}s/:id error:`, error)
      res.status(500).json({ error: `Failed to fetch ${entityName}` })
    }
  })

  // POST create
  router.post('/', async (req, res) => {
    try {
      const data = schemas.createSchema.parse(req.body)
      const item = await service.create(data)
      const validated = schemas.responseSchema.parse(item)
      res.status(201).json(validated)
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors })
        return
      }
      console.error(`POST /api/v1/${entityName}s error:`, error)
      res.status(500).json({ error: `Failed to create ${entityName}` })
    }
  })

  // PATCH update by ID
  router.patch('/:id', async (req, res) => {
    try {
      const id = schemas.idSchema.parse(req.params.id)
      const data = schemas.updateSchema.parse(req.body)
      const item = await service.update(id, data)
      const validated = schemas.responseSchema.parse(item)
      res.status(200).json(validated)
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message })
        return
      }
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors })
        return
      }
      console.error(`PATCH /api/v1/${entityName}s/:id error:`, error)
      res.status(500).json({ error: `Failed to update ${entityName}` })
    }
  })

  // DELETE by ID
  router.delete('/:id', async (req, res) => {
    try {
      const id = schemas.idSchema.parse(req.params.id)
      await service.delete(id)
      res.status(204).send()
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message })
        return
      }
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: `Invalid ${entityName} ID` })
        return
      }
      console.error(`DELETE /api/v1/${entityName}s/:id error:`, error)
      res.status(500).json({ error: `Failed to delete ${entityName}` })
    }
  })

  // DELETE all
  router.delete('/', async (_req, res) => {
    try {
      await service.deleteAll()
      res.status(204).send()
    } catch (error) {
      console.error(`DELETE /api/v1/${entityName}s error:`, error)
      res.status(500).json({ error: `Failed to delete all ${entityName}s` })
    }
  })

  return router
}
