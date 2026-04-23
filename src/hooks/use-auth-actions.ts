// src/hooks/use-auth-actions.ts
import { useState } from 'react'
import {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  changePassword,
} from '@/lib/auth-service'
import { Role, UserProfile } from '@/types/auth'

interface UseAuthActions {
  register: (
    email: string,
    password: string,
    displayName: string,
    phoneNumber: string,
    role?: Role
  ) => Promise<UserProfile | null>
  login: (email: string, password: string) => Promise<UserProfile | null>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  updatePassword: (current: string, next: string) => Promise<boolean>
  loading: boolean
  error: string | null
  clearError: () => void
}

export function useAuthActions(): UseAuthActions {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wrap = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      return result
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    register: (email, password, displayName, phoneNumber, role) =>
      wrap(() => registerUser(email, password, displayName, phoneNumber, role)),

    login: (email, password) => wrap(() => loginUser(email, password)),

    logout: async () => {
      await wrap(() => logoutUser())
    },

    resetPassword: async (email) => {
      const result = await wrap(async () => {
        await requestPasswordReset(email)
        return true
      })
      return result ?? false
    },

    updatePassword: async (current, next) => {
      const result = await wrap(async () => {
        await changePassword(current, next)
        return true
      })
      return result ?? false
    },

    loading,
    error,
    clearError: () => setError(null),
  }
}
