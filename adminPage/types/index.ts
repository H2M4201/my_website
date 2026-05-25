export interface User {
  id: number
  username: string
  email: string | null
  name: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Section {
  id: number
  title: string
  description: string | null
  href: string | null
}

export interface Contact {
  id: number
  type: string
  info: string
  icon: string | null
}

export interface Blog {
  id: number
  title: string
  description: string | null
  content: string | null
}

export interface Trip {
  id: number
  title: string
  time: string | null
  location: string | null
  content: string | null
}

export interface Recipe {
  id: number
  name: string
  description: string | null
}

export interface Resume {
  id: number
  title: string
  content: string | null
}

export interface Role {
  id: number
  name: string
  description: string | null
}

export interface Permission {
  id: number
  name: string
  description: string | null
}

export interface AdminUser {
  id: number
  username: string
  email: string | null
  name: string
  roleId: number | null
}

export type ResourceType =
  | 'section'
  | 'contact'
  | 'blog'
  | 'trip'
  | 'recipe'
  | 'resume'
  | 'user'
  | 'role'
  | 'permission'
