import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteAllBlogs,
} from '../../db'
import {
  blogIdParamSchema,
  blogsListResponseSchema,
  createBlogRequestSchema,
  updateBlogRequestSchema,
  blogResponseSchema,
} from '../schemas'
import { createCrudRouter } from './crudRoutes'

export const blogsRouter = createCrudRouter('blog', {
  getAll: getAllBlogs,
  getById: getBlogById,
  create: createBlog,
  update: updateBlog,
  delete: deleteBlog,
  deleteAll: deleteAllBlogs,
}, {
  idSchema: blogIdParamSchema,
  createSchema: createBlogRequestSchema,
  updateSchema: updateBlogRequestSchema,
  responseSchema: blogResponseSchema,
  listResponseSchema: blogsListResponseSchema,
})
