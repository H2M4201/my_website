import { prisma } from '../prisma'
import {
  SectionDTO,
  CreateSectionDTO,
  UpdateSectionDTO,
  SectionNotFoundError,
} from '../dtos'
import { createCrudService } from './crudService'

const service = createCrudService<SectionDTO, CreateSectionDTO, UpdateSectionDTO>({
  model: prisma.section,
  entityName: 'section',
  NotFoundError: SectionNotFoundError,
  mapToDTO: (s) => ({
    id: s.id,
    title: s.SectionName,
    description: s.Description,
    href: s.Href,
    isActive: s.IsActive,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }),
  mapCreateData: (data) => ({
    SectionName: data.title,
    Description: data.description || null,
    Href: data.href || null,
    IsActive: data.isActive ?? true,
  }),
  mergeUpdateData: (existing, data) => ({
    SectionName: data.title !== undefined ? data.title : existing.SectionName,
    Description: data.description !== undefined ? data.description : existing.Description,
    Href: data.href !== undefined ? data.href : existing.Href,
    IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
  }),
})

export const getAllSections = service.getAll
export const getAllSectionsIncludingInactive = service.getAllIncludingInactive
export const getSectionById = service.getById
export const createSection = service.create
export const updateSection = service.update
export const deleteSection = service.delete
export const deleteAllSections = service.deleteAll

export { SectionNotFoundError } from '../dtos'
