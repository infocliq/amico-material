// src/components/auth/permission-guard.tsx
import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-provider'
import { Permission, Role } from '@/types/auth'

interface PermissionGuardProps {
  children: React.ReactNode
  /** Require one or more specific roles */
  roles?: Role | Role[]
  /** Require at least one of these permissions (OR logic by default) */
  permissions?: Permission | Permission[]
  /** If true, user must have ALL listed permissions (AND logic) */
  requireAll?: boolean
  /** What to render when access is denied — defaults to null */
  fallback?: React.ReactNode
  /** If true, redirect to /errors/unauthorized instead of rendering fallback */
  redirect?: boolean
}

/**
 * Declarative permission guard for client components.
 *
 * Usage:
 *   <PermissionGuard permissions="users:write">
 *     <DeleteUserButton />
 *   </PermissionGuard>
 *
 *   <PermissionGuard roles={['admin', 'superadmin']} redirect>
 *     <AdminPanel />
 *   </PermissionGuard>
 */
export function PermissionGuard({
  children,
  roles,
  permissions,
  requireAll = false,
  fallback = null,
  redirect = false,
}: PermissionGuardProps) {
  const { user, loading, hasPermission, hasRole } = useAuth()
  const navigate = useNavigate()

  if (loading) return null

  if (!user) {
    if (redirect) {
      navigate({ to: '/sign-in' })
      return null
    }
    return <>{fallback}</>
  }

  // Role check
  if (roles) {
    const roleList = Array.isArray(roles) ? roles : [roles]
    if (!hasRole(roleList)) {
      if (redirect) {
        navigate({ to: '/errors/unauthorized' })
        return null
      }
      return <>{fallback}</>
    }
  }

  // Permission check
  if (permissions) {
    const permList = Array.isArray(permissions) ? permissions : [permissions]
    const allowed = requireAll
      ? permList.every((p) => hasPermission(p))
      : permList.some((p) => hasPermission(p))

    if (!allowed) {
      if (redirect) {
        navigate({ to: '/errors/forbidden' })
        return null
      }
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
