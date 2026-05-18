import request from 'supertest'
import { createApp } from '@/app'
import * as sectionsService from '@/db/sectionsService'

jest.mock('@/db/sectionsService')

const app = createApp()

describe('GET /api/sections', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 with sections array', async () => {
    const mockSections = [
      { id: 1, title: 'Resume', description: 'Experience', href: '/resume' },
      { id: 2, title: 'Trips', description: 'Travel', href: '/trips' },
    ]

    ;(sectionsService.getAllSections as jest.Mock).mockResolvedValue(mockSections)

    const response = await request(app).get('/api/sections')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockSections)
    expect(response.headers['cache-control']).toBe('public, max-age=300')
  })

  it('should return 500 on service error', async () => {
    ;(sectionsService.getAllSections as jest.Mock).mockRejectedValueOnce(
      new Error('DB connection failed')
    )

    const response = await request(app).get('/api/sections')

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('error')
  })

  it('should handle empty sections array', async () => {
    ;(sectionsService.getAllSections as jest.Mock).mockResolvedValue([])

    const response = await request(app).get('/api/sections')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })
})
