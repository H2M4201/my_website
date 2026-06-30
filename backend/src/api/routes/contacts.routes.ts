import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
} from '../../db'
import {
  contactIdParamSchema,
  contactsListResponseSchema,
  createContactRequestSchema,
  updateContactRequestSchema,
  contactResponseSchema,
} from '../schemas'
import { createCrudRouter } from './crudRoutes'

export const contactsRouter = createCrudRouter('contact', {
  getAll: getAllContacts,
  getById: getContactById,
  create: createContact,
  update: updateContact,
  delete: deleteContact,
  deleteAll: deleteAllContacts,
}, {
  idSchema: contactIdParamSchema,
  createSchema: createContactRequestSchema,
  updateSchema: updateContactRequestSchema,
  responseSchema: contactResponseSchema,
  listResponseSchema: contactsListResponseSchema,
})
