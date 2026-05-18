export interface BlogDTO {
  id: number
  title: string
  description: string | null
  content: string | null
}

export interface CreateBlogDTO {
  title: string
  description?: string | null
  content?: string | null
}

export interface UpdateBlogDTO {
  title?: string
  description?: string | null
  content?: string | null
}

export class BlogNotFoundError extends Error {
  constructor(id: number) {
    super(`Blog with id ${id} not found`)
    this.name = 'BlogNotFoundError'
  }
}
