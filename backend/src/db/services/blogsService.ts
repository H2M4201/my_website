import { prisma } from '../prisma'
import {
  BlogDTO,
  CreateBlogDTO,
  UpdateBlogDTO,
  BlogNotFoundError,
} from '../dtos'
import { createCrudService } from './crudService'

const service = createCrudService<BlogDTO, CreateBlogDTO, UpdateBlogDTO>({
  model: prisma.blog,
  entityName: 'blog',
  NotFoundError: BlogNotFoundError,
  mapToDTO: (b) => ({
    id: b.id,
    title: b.Title,
    description: b.Description,
    content: b.Content,
    isActive: b.IsActive,
  }),
  mapCreateData: (data) => ({
    Title: data.title,
    Description: data.description || null,
    Content: data.content || null,
    IsActive: data.isActive ?? true,
  }),
  mergeUpdateData: (existing, data) => ({
    Title: data.title !== undefined ? data.title : existing.Title,
    Description: data.description !== undefined ? data.description : existing.Description,
    Content: data.content !== undefined ? data.content : existing.Content,
    IsActive: data.isActive !== undefined ? data.isActive : existing.IsActive,
  }),
})

export const getAllBlogs = service.getAll
export const getAllBlogsIncludingInactive = service.getAllIncludingInactive
export const getBlogById = service.getById
export const createBlog = service.create
export const updateBlog = service.update
export const deleteBlog = service.delete
export const deleteAllBlogs = service.deleteAll

export { BlogNotFoundError } from '../dtos'
