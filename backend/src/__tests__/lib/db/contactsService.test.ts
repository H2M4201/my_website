import { getAllContacts } from '@/db/services/contactsService'
import { prisma } from '@/db/prisma'

jest.mock('@/db/prisma', () => ({
  prisma: {
    contact: {
      findMany: jest.fn(),
    },
  },
}))

describe('ContactsService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllContacts', () => {
    it('should return all contacts with correct schema', async () => {
      const mockContacts = [
        {
          id: 1,
          ContactType: 'Email',
          ContactInfo: 'test@example.com',
          Icon: 'mail',
        },
        {
          id: 2,
          ContactType: 'Phone',
          ContactInfo: '+1 234 567 890',
          Icon: 'phone',
        },
      ]

      ;(prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts)

      const result = await getAllContacts()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 1,
        type: 'Email',
        info: 'test@example.com',
        icon: 'mail',
      })
      expect(result[1]).toEqual({
        id: 2,
        type: 'Phone',
        info: '+1 234 567 890',
        icon: 'phone',
      })
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      })
    })

    it('should handle contacts with null icon', async () => {
      const mockContacts = [
        {
          id: 1,
          ContactType: 'Email',
          ContactInfo: 'test@example.com',
          Icon: null,
        },
      ]

      ;(prisma.contact.findMany as jest.Mock).mockResolvedValue(mockContacts)

      const result = await getAllContacts()

      expect(result[0]).toEqual({
        id: 1,
        type: 'Email',
        info: 'test@example.com',
        icon: null,
      })
    })

    it('should throw error when database fails', async () => {
      ;(prisma.contact.findMany as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'))

      await expect(getAllContacts()).rejects.toThrow('Failed to fetch contacts from database')
    })

    it('should return empty array when no contacts exist', async () => {
      ;(prisma.contact.findMany as jest.Mock).mockResolvedValue([])

      const result = await getAllContacts()

      expect(result).toEqual([])
    })
  })
})
