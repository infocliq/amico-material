
import { doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import { ROLE_PERMISSIONS, Role } from '@/types/auth'

export async function seedRoles() {
  const batch = writeBatch(db)

  const rolesToSeed = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
    id: role,
    title: role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1),
    permissions: permissions
  }))

  for (const role of rolesToSeed) {
    const roleRef = doc(db, 'roles', role.id)
    batch.set(roleRef, {
      title: role.title,
      permissions: role.permissions,
      description: `Default system role for ${role.title}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  await batch.commit()
  
  // Seed Permissions
  const permissionsBatch = writeBatch(db)
  const allPermissions = [
    { id: 'users:read', label: 'View Users', category: 'Users' },
    { id: 'users:write', label: 'Create/Edit Users', category: 'Users' },
    { id: 'users:delete', label: 'Delete Users', category: 'Users' },
    { id: 'users:assign_roles', label: 'Assign Roles', category: 'Users' },
    { id: 'content:read', label: 'View Content', category: 'Content' },
    { id: 'content:write', label: 'Create/Edit Content', category: 'Content' },
    { id: 'content:delete', label: 'Delete Content', category: 'Content' },
    { id: 'content:publish', label: 'Publish Content', category: 'Content' },
    { id: 'reports:read', label: 'View Reports', category: 'Reports' },
    { id: 'reports:export', label: 'Export Data', category: 'Reports' },
    { id: 'settings:read', label: 'View Settings', category: 'Settings' },
    { id: 'settings:write', label: 'Edit Settings', category: 'Settings' },
    { id: 'audit:read', label: 'View Audit Logs', category: 'Settings' },
    { id: 'checklists:read', label: 'View Checklists', category: 'Manufacturing' },
    { id: 'checklists:write', label: 'Create/Edit Checklists', category: 'Manufacturing' },
    { id: 'checklists:delete', label: 'Delete Checklists', category: 'Manufacturing' },
  ]

  for (const perm of allPermissions) {
    const permRef = doc(db, 'permissions', perm.id)
    permissionsBatch.set(permRef, {
      ...perm,
      createdAt: serverTimestamp(),
    })
  }

  await permissionsBatch.commit()
  console.log('Roles and Permissions seeded successfully!')
}
