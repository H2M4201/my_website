import { NotFoundError } from './notFoundError'

export interface BlogDTO {
  id: number
  title: string
  description: string | null
  content: string | null
  isActive: boolean
}

export interface CreateBlogDTO {
  title: string
  description?: string | null
  content?: string | null
  isActive?: boolean
}

export interface UpdateBlogDTO {
  title?: string
  description?: string | null
  content?: string | null
  isActive?: boolean
}

export class BlogNotFoundError extends NotFoundError {
  constructor(id: number) {
    super('Blog', id)
    this.name = 'BlogNotFoundError'
  }
}
