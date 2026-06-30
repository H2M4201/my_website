import { create } from 'zustand'
import { AuthState, User } from '@/types'
import { ADMIN_WRITE_PREFIX } from '@/hooks/useApi'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '')

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  restoreSession: () => Promise<void>
  forgotPassword: (usernameOrEmail: string) => Promise<{ message: string; tempPassword?: string }>
  completePasswordReset: (token: string, newPassword: string) => Promise<{ message: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  passwordExpired: boolean
  accountLocked: boolean
  lockedUntil: string | null
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
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
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (response.status === 423) {
        const errorData = await response.json().catch(() => null)
        set({ accountLocked: true, lockedUntil: errorData?.lockedUntil || null })
        throw new Error(errorData?.error || 'Account locked')
      }

      if (response.status === 401) {
        const errorData = await response.json().catch(() => null)
        if (errorData?.passwordExpired) {
          set({ passwordExpired: true })
          throw new Error('Password expired')
        }
        throw new Error(errorData?.error || 'Login failed')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Login failed')
      }

      const data = await response.json()

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      set({
        user: data.user || null,
        isAuthenticated: true,
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
      credentials: 'include',
      body: JSON.stringify({ usernameOrEmail }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Failed to reset password')
    }

    return response.json()
  },

  completePasswordReset: async (token: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, newPassword }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Failed to reset password')
    }

    return response.json()
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Failed to change password')
    }

    set({ passwordExpired: false })
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Best-effort logout
    }

    localStorage.removeItem('user')
    set({
      user: null,
      isAuthenticated: false,
      passwordExpired: false,
      accountLocked: false,
      lockedUntil: null,
    })
  },

  setUser: (user: User | null) => {
    set({ user })
  },

  restoreSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${ADMIN_WRITE_PREFIX}/auth/me`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        set({
          user: data.user || null,
          isAuthenticated: true,
        })
      } else {
        localStorage.removeItem('user')
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          set({ user, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } finally {
      set({ isLoading: false })
    }
  },
}))
