import {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  deleteAllSections,
} from '../../db'
import {
  sectionIdParamSchema,
  sectionsListResponseSchema,
  createSectionRequestSchema,
  updateSectionRequestSchema,
  sectionResponseSchema,
} from '../schemas'
import { createCrudRouter } from './crudRoutes'

export const sectionsRouter = createCrudRouter('section', {
  getAll: getAllSections,
  getById: getSectionById,
  create: createSection,
  update: updateSection,
  delete: deleteSection,
  deleteAll: deleteAllSections,
}, {
  idSchema: sectionIdParamSchema,
  createSchema: createSectionRequestSchema,
  updateSchema: updateSectionRequestSchema,
  responseSchema: sectionResponseSchema,
  listResponseSchema: sectionsListResponseSchema,
})
