// src/lib/auth-guards.ts
// TanStack Router beforeLoad guards — replaces Next.js middleware.ts

import { redirect } from '@tanstack/react-router'
import { auth } from '@/lib/firebase'
import { getUserProfile } from '@/lib/auth-service'
import { Role, Permission } from '@/types/auth'

/**
 * Resolves the current Firebase user.
 * After loginUser() resolves, auth.currentUser is set synchronously.
 * We fall back to onAuthStateChanged for cold-load cases (page refresh).
 */
function resolveFirebaseUser(): Promise<typeof auth.currentUser> {
  // Already available — return immediately (e.g. right after login)
  if (auth.currentUser !== null) {
    return Promise.resolve(auth.currentUser)
  }

  // On first page load, wait for Firebase to restore the persisted session
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

/**
 * Use in `beforeLoad` of any authenticated route layout.
 * Redirects unauthenticated users to /sign-in.
 */
export async function requireAuth(redirectTo?: string) {
  const user = await resolveFirebaseUser()

  if (!user) {
    throw redirect({
      to: '/sign-in',
      search: redirectTo ? { redirect: redirectTo } : undefined,
    })
  }

  // Security Layer: Verify if account is still active in Firestore
  try {
    const profile = await getUserProfile(user)
    if (!profile.isActive) {
      await auth.signOut()
      throw redirect({
        to: '/sign-in',
        search: { redirect: redirectTo },
      })
    }
  } catch (err) {
    // If profile is missing but Auth exists, something is wrong
    await auth.signOut()
    throw redirect({ to: '/sign-in' })
  }

  return user
}


/**
 * Use in `beforeLoad` to enforce role + permission requirements.
 * Must be called after requireAuth (or call it internally via `withUser`).
 *
 * @example
 * export const Route = createFileRoute('/_authenticated/users')({
 *   beforeLoad: () =>
 *     requirePermission({ roles: ['superadmin', 'admin', 'manager'] }),
 * })
 */
export async function requirePermission(opts: {
  roles?: Role[]
  permissions?: Permission[]
  requireAll?: boolean
}) {
  const firebaseUser = await resolveFirebaseUser()

  if (!firebaseUser) {
    throw redirect({ to: '/sign-in' })
  }

  const profile = await getUserProfile(firebaseUser)

  if (!profile.isActive) {
    await auth.signOut()
    throw redirect({ to: '/sign-in' })
  }

  if (opts.roles && !opts.roles.includes(profile.role)) {
    throw redirect({ to: '/401' })
  }

  if (opts.permissions) {
    const userPerms = profile.permissions
    const allowed = opts.requireAll
      ? opts.permissions.every((p) => userPerms.includes(p))
      : opts.permissions.some((p) => userPerms.includes(p))

    if (!allowed) {
      throw redirect({ to: '/403' })
    }
  }

  return profile
}

/**
 * Use in `beforeLoad` of public routes (like /sign-in).
 * Redirects already authenticated users back to the dashboard.
 */
export async function redirectIfAuth() {
  const user = await resolveFirebaseUser()

  if (user) {
    throw redirect({ to: '/' })
  }
}

