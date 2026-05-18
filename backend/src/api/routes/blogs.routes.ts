import { Router } from 'express'
import { z } from 'zod'
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteAllBlogs,
  BlogNotFoundError,
} from '../../db'
import {
  blogIdParamSchema,
  blogsListResponseSchema,
  createBlogRequestSchema,
  updateBlogRequestSchema,
  blogResponseSchema,
} from '../schemas'

export const blogsRouter = Router()

// GET all blogs
blogsRouter.get('/', async (_req, res) => {
  try {
    const blogs = await getAllBlogs()
    const validated = blogsListResponseSchema.parse(blogs)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(validated)
  } catch (error) {
    console.error('GET /api/blogs error:', error)
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: 'Validation failed', details: error.errors })
      return
    }
    res.status(500).json({ error: 'Failed to fetch blogs' })
  }
})

// GET blog by ID
blogsRouter.get('/:id', async (req, res) => {
  try {
    const id = blogIdParamSchema.parse(req.params.id)
    const blog = await getBlogById(id)
    res.status(200).set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    })
    res.json(blog)
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid blog ID' })
      return
    }
    console.error('GET /api/blogs/:id error:', error)
    res.status(500).json({ error: 'Failed to fetch blog' })
  }
})

// POST create new blog
blogsRouter.post('/', async (req, res) => {
  try {
    const data = createBlogRequestSchema.parse(req.body)
    const blog = await createBlog(data)
    const validated = blogResponseSchema.parse(blog)
    res.status(201).json(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('POST /api/blogs error:', error)
    res.status(500).json({ error: 'Failed to create blog' })
  }
})

// PATCH update blog by ID
blogsRouter.patch('/:id', async (req, res) => {
  try {
    const id = blogIdParamSchema.parse(req.params.id)
    const data = updateBlogRequestSchema.parse(req.body)
    const blog = await updateBlog(id, data)
    const validated = blogResponseSchema.parse(blog)
    res.status(200).json(validated)
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
      return
    }
    console.error('PATCH /api/blogs/:id error:', error)
    res.status(500).json({ error: 'Failed to update blog' })
  }
})

// DELETE blog by ID
blogsRouter.delete('/:id', async (req, res) => {
  try {
    const id = blogIdParamSchema.parse(req.params.id)
    await deleteBlog(id)
    res.status(204).send()
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      res.status(404).json({ error: error.message })
      return
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid blog ID' })
      return
    }
    console.error('DELETE /api/blogs/:id error:', error)
    res.status(500).json({ error: 'Failed to delete blog' })
  }
})

// DELETE all blogs
blogsRouter.delete('/', async (_req, res) => {
  try {
    await deleteAllBlogs()
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /api/blogs error:', error)
    res.status(500).json({ error: 'Failed to delete all blogs' })
  }
})
