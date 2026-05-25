import { create } from 'zustand'
import { AuthState, User } from '@/types'
import { ADMIN_WRITE_PREFIX } from '@/hooks/useApi'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:4000').replace(/\/$/, '')

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  restoreSession: () => void
  forgotPassword: (usernameOrEmail: string) => Promise<{ message: string; tempPassword?: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  passwordExpired: boolean
  accountLocked: boolean
  lockedUntil: string | null
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  passwordExpired: false,
  accountLocked: false,
  lockedUntil: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, accountLocked: false, lockedUntil: null, passwordExpired: false })
    try {
      const response = await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.status === 423) {
        const errorData = await response.json().catch(() => null)
        set({ accountLocked: true, lockedUntil: errorData?.lockedUntil || null })
        throw new Error(errorData?.error || 'Account locked')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Login failed')
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        passwordExpired: data.passwordExpired || false,
      })
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  forgotPassword: async (usernameOrEmail: string) => {
    const response = await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Failed to reset password')
    }

    return response.json()
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const token = get().token
    if (!token) throw new Error('Not authenticated')

    const response = await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Failed to change password')
    }

    set({ passwordExpired: false })
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      passwordExpired: false,
      accountLocked: false,
      lockedUntil: null,
    })
  },

  setUser: (user: User | null) => {
    set({ user })
  },

  setToken: (token: string | null) => {
    set({ token })
  },

  restoreSession: () => {
    try {
      const token = localStorage.getItem('authToken')
      const userStr = localStorage.getItem('user')

      if (token && userStr) {
        const user = JSON.parse(userStr)
        set({
          user,
          token,
          isAuthenticated: true,
        })
      }
    } catch (error) {
      console.error('Session restore error:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))