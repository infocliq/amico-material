// src/context/auth-provider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserProfile, logoutUser } from '@/lib/auth-service'
import { AuthState, Permission, Role, UserProfile } from '@/types/auth'

interface AuthContextValue extends AuthState {
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: Role | Role[]) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const refreshProfile = useCallback(async () => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return

    try {
      const profile = await getUserProfile(firebaseUser)
      setState((prev) => ({ ...prev, user: profile }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: (error as Error).message,
      }))
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ user: null, loading: false, error: null })
        return
      }

      try {
        const profile = await getUserProfile(firebaseUser)
        setState({ user: profile, loading: false, error: null })
      } catch {
        // Profile may not exist yet (first login of a manually-created account).
        // Keep Firebase auth alive — loginUser will auto-provision the profile.
        setState({ user: null, loading: false, error: null })
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setState({ user: null, loading: false, error: null })
  }, [])

  // ── Permission helpers ──────────────────────────────────────────────────

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.user) return false
      return state.user.permissions.includes(permission)
    },
    [state.user]
  )

  const hasRole = useCallback(
    (role: Role | Role[]): boolean => {
      if (!state.user) return false
      const roles = Array.isArray(role) ? role : [role]
      return roles.includes(state.user.role)
    },
    [state.user]
  )

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!state.user) return false
      return permissions.some((p) => state.user!.permissions.includes(p))
    },
    [state.user]
  )

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      if (!state.user) return false
      return permissions.every((p) => state.user!.permissions.includes(p))
    },
    [state.user]
  )

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        refreshProfile,
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

// Convenience hooks
export function useRequirePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

export function useRequireRole(role: Role | Role[]): boolean {
  const { hasRole } = useAuth()
  return hasRole(role)
}

export type { UserProfile, Permission, Role }
