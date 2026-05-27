'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { FormField, Input } from '@/components'

type LoginView = 'login' | 'forgot-password' | 'change-password'

export default function LoginPage() {
  const router = useRouter()
  const { 
    login, forgotPassword, changePassword, 
    isAuthenticated, passwordExpired, accountLocked, lockedUntil 
  } = useAuth()

  const [view, setView] = useState<LoginView>('login')

  // ----- Login fields -----
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ----- Forgot password fields -----
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [tempPassword, setTempPassword] = useState('')

  // ----- Change password fields -----
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [changeError, setChangeError] = useState('')
  const [changeSuccess, setChangeSuccess] = useState('')
  const [changeLoading, setChangeLoading] = useState(false)

  // If already authenticated and password is not expired, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !passwordExpired) {
      router.push('/dashboard')
    }
    if (passwordExpired) {
      setView('change-password')
    }
  }, [isAuthenticated, passwordExpired, router])

  // ----- Login handler -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(username, password)
      // If password expired, the store sets passwordExpired and the useEffect above handles view change
      if (!passwordExpired) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  // ----- Forgot password handler -----
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    setResetMessage('')
    setTempPassword('')
    setResetLoading(true)

    try {
      const result = await forgotPassword(resetEmail)
      setResetMessage(result.message)
      if (result.tempPassword) {
        setTempPassword(result.tempPassword)
      }
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setResetLoading(false)
    }
  }

  // ----- Change password handler -----
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangeError('')
    setChangeSuccess('')

    if (newPw !== confirmPw) {
      setChangeError('New passwords do not match')
      return
    }

    // Client-side complexity check
    const complexity = validatePasswordOnClient(newPw)
    if (complexity) {
      setChangeError(complexity)
      return
    }

    setChangeLoading(true)

    try {
      await changePassword(currentPw, newPw)
      setChangeSuccess('Password changed successfully!')
      setTimeout(() => {
        setView('login')
        setCurrentPw('')
        setNewPw('')
        setConfirmPw('')
      }, 2000)
    } catch (err) {
      setChangeError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setChangeLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full border border-gray-700">

        {view === 'login' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">Admin Login</h1>

            {accountLocked && (
              <div className="alert-error mb-4">
                <p className="font-semibold">Account Locked</p>
                <p>Too many failed login attempts. Your account has been locked for 15 minutes.</p>
                {lockedUntil && (
                  <p className="mt-1 text-xs text-red-400">
                    Locked until: {new Date(lockedUntil).toLocaleTimeString()}
                  </p>
                )}
                <p className="mt-1 text-xs text-red-400">
                  Please try again later or use the "Forgot Password" option below to reset your password.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Username" name="username" required>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </FormField>

              <FormField label="Password" name="password" required>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </FormField>

              {error && (
                <div className="alert-error">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || accountLocked}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setView('forgot-password')
                  setResetEmail('')
                  setResetMessage('')
                  setResetError('')
                  setTempPassword('')
                }}
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Forgot Password?
              </button>
            </div>

            <p className="text-sm text-gray-400 text-center mt-4">
              Demo: Use username "admin" to login
            </p>
          </>
        )}

        {view === 'forgot-password' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-100">Reset Password</h1>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter your username or registered email address and we will send you a new password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <FormField label="Username or Email" name="usernameOrEmail" required>
                <Input
                  type="text"
                  name="usernameOrEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin or admin@example.com"
                  required
                />
              </FormField>

              {resetError && (
                <div className="alert-error">{resetError}</div>
              )}

              {resetMessage && (
                <div className="alert-success">
                  <p>{resetMessage}</p>
                  {tempPassword && (
                    <div className="mt-2 p-2 alert-info">
                      <p className="font-semibold text-xs">Development Mode — Temporary Password:</p>
                      <p className="font-mono text-lg font-bold tracking-wider select-all">{tempPassword}</p>
                      <p className="text-xs mt-1">Please copy this password and use it to login.</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {resetLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Back to Login
              </button>
            </div>
          </>
        )}

        {view === 'change-password' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-100">Change Password</h1>
            {passwordExpired && (
              <div className="alert-info mb-4 text-center">
                Your password has expired (over 60 days). Please set a new password.
              </div>
            )}
            <p className="text-sm text-gray-400 text-center mb-6">
              Password must contain at least 8 characters, including uppercase, lowercase, a digit, and a special character.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <FormField label="Current Password" name="currentPassword" required>
                <Input
                  type="password"
                  name="currentPassword"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </FormField>

              <FormField label="New Password" name="newPassword" required>
                <Input
                  type="password"
                  name="newPassword"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Min 8 chars, upper + lower + digit + special"
                  required
                />
              </FormField>

              <FormField label="Confirm New Password" name="confirmPassword" required>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </FormField>

              {changeError && (
                <div className="alert-error">{changeError}</div>
              )}

              {changeSuccess && (
                <div className="alert-success">{changeSuccess}</div>
              )}

              <button
                type="submit"
                disabled={changeLoading}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {changeLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>

            {!passwordExpired && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Back to Login
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

/** Client-side password complexity validation (mirrors server-side rules) */
function validatePasswordOnClient(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one digit'
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]]/.test(password)) return 'Password must contain at least one special character'
  return null
}