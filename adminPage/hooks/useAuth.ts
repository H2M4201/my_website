import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const [mounted, setMounted] = useState(false)
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const passwordExpired = useAuthStore((s) => s.passwordExpired)
  const accountLocked = useAuthStore((s) => s.accountLocked)
  const lockedUntil = useAuthStore((s) => s.lockedUntil)
  const restoreSession = useAuthStore((s) => s.restoreSession)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const setUser = useAuthStore((s) => s.setUser)
  const forgotPassword = useAuthStore((s) => s.forgotPassword)
  const changePassword = useAuthStore((s) => s.changePassword)

  useEffect(() => {
    restoreSession()
    setMounted(true)
  }, [restoreSession])

  return { 
    user, token, isAuthenticated, isLoading, login, logout, setUser, mounted,
    passwordExpired, accountLocked, lockedUntil, forgotPassword, changePassword
  }
}
