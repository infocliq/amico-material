// src/types/auth.ts

export type Role = 'superadmin' | 'admin' | 'manager' | 'editor' | 'viewer'

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'users:assign_roles'
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'content:publish'
  | 'reports:read'
  | 'reports:export'
  | 'settings:read'
  | 'settings:write'
  | 'audit:read'
  | 'checklists:read'
  | 'checklists:write'
  | 'checklists:delete'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  superadmin: [
    'users:read',
    'users:write',
    'users:delete',
    'users:assign_roles',
    'content:read',
    'content:write',
    'content:delete',
    'content:publish',
    'reports:read',
    'reports:export',
    'settings:read',
    'settings:write',
    'audit:read',
    'checklists:read',
    'checklists:write',
    'checklists:delete',
  ],
  admin: [
    'users:read',
    'users:write',
    'users:delete',
    'users:assign_roles',
    'content:read',
    'content:write',
    'content:delete',
    'content:publish',
    'reports:read',
    'reports:export',
    'settings:read',
    'audit:read',
    'checklists:read',
    'checklists:write',
    'checklists:delete',
  ],
  manager: [
    'users:read',
    'users:write',
    'content:read',
    'content:write',
    'content:publish',
    'reports:read',
    'reports:export',
    'settings:read',
    'checklists:read',
    'checklists:write',
  ],
  editor: ['content:read', 'content:write', 'content:delete', 'reports:read'],
  viewer: ['content:read', 'reports:read'],
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  phoneNumber?: string
  role: Role
  permissions: Permission[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  metadata?: Record<string, unknown>
}

export interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
}

export interface SessionClaims {
  uid: string
  email: string
  role: Role
  permissions: Permission[]
}
