import { Router } from 'express'
import { z } from 'zod'
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
  ContactNotFoundError,
} from '../../db'
import {
  contactIdParamSchema,
  contactsListResponseSchema,
  createContactRequestSchema,
  updateContactRequestSchema,
  contactResponseSchema,
} from '../schemas'

export const contactsRouter = Router()

// GET all contacts
contactsRouter.get('/', async (_req, res) => {
  try {
    const contacts = await getAllContacts()
    const validated = contactsListResponseSchema.parse(contacts)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/contacts error:', error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// GET contact by ID
contactsRouter.get('/:id', async (req, res) => {
  try {
    const id = contactIdParamSchema.parse(req.params.id)
    const contact = await getContactById(id)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(contact)
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid contact ID' })
      return
    }
    console.error('GET /api/contacts/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch contact' })
  }
})

// POST create new contact
contactsRouter.post('/', async (req, res) => {
  try {
    const data = createContactRequestSchema.parse(req.body)
    const contact = await createContact(data)
    const validated = contactResponseSchema.parse(contact)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /api/contacts error:', error)
    res.status(500).json({ error: 'Failed to create contact' })
  }
})

// PATCH update contact by ID
contactsRouter.patch('/:id', async (req, res) => {
  try {
    const id = contactIdParamSchema.parse(req.params.id)
    const data = updateContactRequestSchema.parse(req.body)
    const contact = await updateContact(id, data)
    const validated = contactResponseSchema.parse(contact)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('PATCH /api/contacts/:id error:', error)
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

// DELETE contact by ID
contactsRouter.delete('/:id', async (req, res) => {
  try {
    const id = contactIdParamSchema.parse(req.params.id)
    await deleteContact(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid contact ID' })
      return
    }
    console.error('DELETE /api/contacts/:id error:', error)
    res.status(500).json({ error: 'Failed to delete contact' })
  }
})

// DELETE all contacts
contactsRouter.delete('/', async (_req, res) => {
  try {
    await deleteAllContacts()
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /api/contacts error:', error)
    res.status(500).json({ error: 'Failed to delete all contacts' })
  }
})

