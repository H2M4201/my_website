import request from 'supertest'
import { createApp } from '@/app'
import * as contactsService from '@/db/services/contactsService'

jest.mock('@/db/services/contactsService')

const app = createApp()

describe('GET /api/v1/contacts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 with contacts array', async () => {
    const mockContacts = [
      { id: 1, type: 'Email', info: 'test@example.com', icon: 'mail', isActive: true },
      { id: 2, type: 'Phone', info: '+1 234 567 890', icon: 'phone', isActive: true },
    ]

    ;(contactsService.getAllContacts as jest.Mock).mockResolvedValue(mockContacts)

    const response = await request(app).get('/api/v1/contacts')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockContacts)
    expect(response.headers['cache-control']).toBe('public, max-age=300')
  })

  it('should return 500 on service error', async () => {
    ;(contactsService.getAllContacts as jest.Mock).mockRejectedValueOnce(
      new Error('DB connection failed')
    )

    const response = await request(app).get('/api/v1/contacts')

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('error')
  })

  it('should handle contacts with null icon', async () => {
    const mockContacts = [{ id: 1, type: 'Email', info: 'test@example.com', icon: null, isActive: true }]

    ;(contactsService.getAllContacts as jest.Mock).mockResolvedValue(mockContacts)

    const response = await request(app).get('/api/v1/contacts')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockContacts)
  })
})
