import { prisma } from '../prisma'
import {
  ContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
  ContactNotFoundError,
} from '../dtos'

function mapContactToDTO(contact: {
  id: number
  ContactType: string
  ContactInfo: string
  Icon: string | null
  IsActive: boolean
}): ContactDTO {
  return {
    id: contact.id,
    type: contact.ContactType,
    info: contact.ContactInfo,
    icon: contact.Icon,
    isActive: contact.IsActive,
  }
}

export async function getAllContacts(): Promise<ContactDTO[]> {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { id: 'asc' },
    })
    return contacts.map(mapContactToDTO)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    throw new Error('Failed to fetch contacts from database')
  }
}

export async function getContactById(id: number): Promise<ContactDTO> {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      throw new ContactNotFoundError(id)
    }

    return mapContactToDTO(contact)
  } catch (error) {
    if (error instanceof ContactNotFoundError) throw error
    console.error('Error fetching contact:', error)
    throw new Error('Failed to fetch contact from database')
  }
}

export async function createContact(
  data: CreateContactDTO
): Promise<ContactDTO> {
  try {
    const contact = await prisma.contact.create({
      data: {
        ContactType: data.type,
        ContactInfo: data.info,
        Icon: data.icon || null,
        IsActive: data.isActive ?? true,
      },
    })
    return mapContactToDTO(contact)
  } catch (error) {
    console.error('Error creating contact:', error)
    throw new Error('Failed to create contact in database')
  }
}

export async function updateContact(
  id: number,
  data: UpdateContactDTO
): Promise<ContactDTO> {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      throw new ContactNotFoundError(id)
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        ContactType:
          data.type !== undefined ? data.type : contact.ContactType,
        ContactInfo:
          data.info !== undefined ? data.info : contact.ContactInfo,
        Icon: data.icon !== undefined ? data.icon : contact.Icon,
        IsActive: data.isActive !== undefined ? data.isActive : contact.IsActive,
      },
    })

    return mapContactToDTO(updated)
  } catch (error) {
    if (error instanceof ContactNotFoundError) throw error
    console.error('Error updating contact:', error)
    throw new Error('Failed to update contact in database')
  }
}

export async function deleteContact(id: number): Promise<void> {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      throw new ContactNotFoundError(id)
    }

    await prisma.contact.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof ContactNotFoundError) throw error
    console.error('Error deleting contact:', error)
    throw new Error('Failed to delete contact from database')
  }
}

export async function deleteAllContacts(): Promise<void> {
  try {
    await prisma.contact.deleteMany()
  } catch (error) {
    console.error('Error deleting all contacts:', error)
    throw new Error('Failed to delete all contacts from database')
  }
}
