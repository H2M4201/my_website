import { prisma } from '../prisma'
import { BlogDTO, CreateBlogDTO, UpdateBlogDTO, BlogNotFoundError } from '../dtos'

function mapBlogToDTO(blog: {
  id: number
  Title: string
  Description: string | null
  Content: string | null
}): BlogDTO {
  return {
    id: blog.id,
    title: blog.Title,
    description: blog.Description,
    content: blog.Content,
  }
}

export async function getAllBlogs(): Promise<BlogDTO[]> {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { id: 'asc' },
    })
    return blogs.map(mapBlogToDTO)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw new Error('Failed to fetch blogs from database')
  }
}

export async function getBlogById(id: number): Promise<BlogDTO> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new BlogNotFoundError(id)
    }

    return mapBlogToDTO(blog)
  } catch (error) {
    if (error instanceof BlogNotFoundError) throw error
    console.error('Error fetching blog:', error)
    throw new Error('Failed to fetch blog from database')
  }
}

export async function createBlog(data: CreateBlogDTO): Promise<BlogDTO> {
  try {
    const blog = await prisma.blog.create({
      data: {
        Title: data.title,
        Description: data.description || null,
        Content: data.content || null,
      },
    })
    return mapBlogToDTO(blog)
  } catch (error) {
    console.error('Error creating blog:', error)
    throw new Error('Failed to create blog in database')
  }
}

export async function updateBlog(
  id: number,
  data: UpdateBlogDTO
): Promise<BlogDTO> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new BlogNotFoundError(id)
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        Title: data.title !== undefined ? data.title : blog.Title,
        Description:
          data.description !== undefined ? data.description : blog.Description,
        Content: data.content !== undefined ? data.content : blog.Content,
      },
    })

    return mapBlogToDTO(updated)
  } catch (error) {
    if (error instanceof BlogNotFoundError) throw error
    console.error('Error updating blog:', error)
    throw new Error('Failed to update blog in database')
  }
}

export async function deleteBlog(id: number): Promise<void> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new BlogNotFoundError(id)
    }

    await prisma.blog.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof BlogNotFoundError) throw error
    console.error('Error deleting blog:', error)
    throw new Error('Failed to delete blog from database')
  }
}

export async function deleteAllBlogs(): Promise<void> {
  try {
    await prisma.blog.deleteMany()
  } catch (error) {
    console.error('Error deleting all blogs:', error)
    throw new Error('Failed to delete all blogs from database')
  }
}
