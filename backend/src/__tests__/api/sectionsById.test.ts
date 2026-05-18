import request from 'supertest'
import { createApp } from '@/app'
import * as sectionsService from '@/db/sectionsService'

jest.mock('@/db/sectionsService', () => {
  const actual = jest.requireActual<typeof import('@/db/sectionsService')>('@/db/sectionsService')
  return {
    ...actual,
    getSectionById: jest.fn(),
  }
})

const app = createApp()

describe('GET /api/sections/:id', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 with a single section', async () => {
    const mock = { id: 1, title: 'Resume', description: 'Experience', href: '/resume' }
    ;(sectionsService.getSectionById as jest.Mock).mockResolvedValue(mock)

    const response = await request(app).get('/api/sections/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mock)
    expect(sectionsService.getSectionById).toHaveBeenCalledWith(1)
  })

  it('should return 404 when section not found', async () => {
    ;(sectionsService.getSectionById as jest.Mock).mockRejectedValueOnce(
      new sectionsService.SectionNotFoundError(999)
    )

    const response = await request(app).get('/api/sections/999')

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({ error: expect.stringContaining('999') })
  })

  it('should return 400 for invalid id', async () => {
    const response = await request(app).get('/api/sections/not-a-number')

    expect(response.status).toBe(400)
  })
})
