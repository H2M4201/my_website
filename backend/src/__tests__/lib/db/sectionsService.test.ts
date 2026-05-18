import { getAllSections, getSectionById, SectionNotFoundError } from '@/db/sectionsService'
import { prisma } from '@/db/prisma'

jest.mock('@/db/prisma', () => ({
  prisma: {
    section: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

describe('SectionsService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllSections', () => {
    it('should return all sections with correct schema', async () => {
      const mockSections = [
        {
          id: 1,
          SectionName: 'Resume',
          Description: 'View my experience',
          Href: '/resume',
        },
        {
          id: 2,
          SectionName: 'Trips',
          Description: 'Travel experiences',
          Href: '/trips',
        },
      ]

      ;(prisma.section.findMany as jest.Mock).mockResolvedValue(mockSections)

      const result = await getAllSections()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 1,
        title: 'Resume',
        description: 'View my experience',
        href: '/resume',
      })
      expect(prisma.section.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      })
    })

    it('should throw error when database fails', async () => {
      ;(prisma.section.findMany as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'))

      await expect(getAllSections()).rejects.toThrow('Failed to fetch sections from database')
    })

    it('should return empty array when no sections exist', async () => {
      ;(prisma.section.findMany as jest.Mock).mockResolvedValue([])

      const result = await getAllSections()

      expect(result).toEqual([])
    })
  })

  describe('getSectionById', () => {
    it('should return section by id with correct schema', async () => {
      const mockSection = {
        id: 1,
        SectionName: 'Resume',
        Description: 'View my experience',
        Href: '/resume',
      }

      ;(prisma.section.findUnique as jest.Mock).mockResolvedValue(mockSection)

      const result = await getSectionById(1)

      expect(result).toEqual({
        id: 1,
        title: 'Resume',
        description: 'View my experience',
        href: '/resume',
      })
      expect(prisma.section.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })

    it('should throw SectionNotFoundError when not found', async () => {
      ;(prisma.section.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(getSectionById(999)).rejects.toThrow(SectionNotFoundError)
      await expect(getSectionById(999)).rejects.toThrow('Section with id 999 not found')
    })

    it('should throw error when database fails', async () => {
      ;(prisma.section.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'))

      await expect(getSectionById(1)).rejects.toThrow('Failed to fetch section from database')
    })
  })
})
