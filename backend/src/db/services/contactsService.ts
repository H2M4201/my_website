import { prisma } from '../prisma'
import {
  ContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
  ContactNotFoundError,
} from '../dtos'
import { createCrudService } from './crudService'

const service = createCrudService<ContactDTO, CreateContactDTO, UpdateContactDTO>({
  model: prisma.contact,
  entityName: 'contact',
  NotFoundError: ContactNotFoundError,
  mapToDTO: (c) => ({
    id: c.id,
    type: c.ContactType,
    info: c.ContactInfo,
    icon: c.Icon,
    isActive: c.IsActive,
  }),
  mapCreateData: (data) => ({
    ContactType: data.type,
    ContactInfo: data.info,
    Icon: data.icon || null,
    IsActive: data.isActive ?? true,
  }),
  mergeUpdateData: (existing, data) => ({
    ContactType: data.type !== undefined ? data.type : existing.ContactType,
    ContactInfo: data.info !== undefined ? data.info : existing.ContactInfo,
    Icon: data.icon !== undefined ? data.icon : existing.Icon,
    IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
  }),
})

export const getAllContacts = service.getAll
export const getAllContactsIncludingInactive = service.getAllIncludingInactive
export const getContactById = service.getById
export const createContact = service.create
export const updateContact = service.update
export const deleteContact = service.delete
export const deleteAllContacts = service.deleteAll

export { ContactNotFoundError } from '../dtos'
