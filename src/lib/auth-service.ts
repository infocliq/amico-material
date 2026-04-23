// src/lib/auth-service.ts
import { initializeApp, FirebaseApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  AuthError,
  getAuth,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { ROLE_PERMISSIONS, Role, UserProfile, Permission } from '@/types/auth'

// ─── Registration (By Admin) ──────────────────────────────────────────────────

/**
 * Creates a new user without signing them in (bypasses current session auto-login).
 * Uses a secondary temporary Firebase app instance.
 */
export async function registerUserByAdmin(
  email: string,
  password: string,
  displayName: string,
  phoneNumber: string,
  role: Role = 'viewer'
): Promise<UserProfile> {
  let tempApp: FirebaseApp | undefined
  try {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }

    // Create a temporary app to handle creation without affecting main auth state
    const appName = `temp-app-${Date.now()}`
    tempApp = initializeApp(config, appName)
    const tempAuth = getAuth(tempApp)

    const { user } = await createUserWithEmailAndPassword(tempAuth, email, password)

    const permissions = ROLE_PERMISSIONS[role]
    const now = new Date().toISOString()

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      phoneNumber,
      role,
      permissions,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }

    // Save to Firestore using MAIN db instance
    await setDoc(doc(db, 'users', user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    await signOut(tempAuth)
    return profile
  } catch (err) {
    throw new Error(parseAuthError(err as AuthError))
  } finally {
    // We can't easily "delete" a Firebase app instance in client SDK,
    // but we can just let it be.
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseAuthError(error: AuthError): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/requires-recent-login': 'Please re-login to perform this action.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[error.code] ?? 'An unexpected error occurred.'
}

// ─── Registration ────────────────────────────────────────────────────────────

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  phoneNumber: string,
  role: Role = 'viewer'
): Promise<UserProfile> {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await sendEmailVerification(user)

    const permissions = ROLE_PERMISSIONS[role]
    const now = new Date().toISOString()

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      phoneNumber,
      role,
      permissions,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(doc(db, 'users', user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return profile
  } catch (err) {
    throw new Error(parseAuthError(err as AuthError))
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string
): Promise<UserProfile> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)

    // Auto-provision a Firestore profile if this is a manually-created account
    // (e.g. created directly in Firebase Console without going through registerUser)
    let profile: UserProfile
    try {
      profile = await getUserProfile(user)
    } catch {
      // Profile doesn't exist yet — create a default one
      const defaultRole: Role = 'viewer'
      const permissions = ROLE_PERMISSIONS[defaultRole]
      const now = new Date().toISOString()
      profile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName ?? null,
        role: defaultRole,
        permissions,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    if (!profile.isActive) {
      await signOut(auth)
      throw new Error('Your account has been deactivated.')
    }

    // Update last login timestamp
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { ...profile, lastLoginAt: new Date().toISOString() }
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error(parseAuthError(err as AuthError))
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getUserProfile(user: User): Promise<UserProfile> {
  const snap = await getDoc(doc(db, 'users', user.uid))

  if (!snap.exists()) {
    throw new Error('User profile not found.')
  }

  const data = snap.data()

  return {
    uid: user.uid,
    email: data.email,
    displayName: data.displayName ?? null,
    phoneNumber: data.phoneNumber ?? '',
    role: data.role,
    permissions: data.permissions ?? ROLE_PERMISSIONS[data.role as Role],
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
    lastLoginAt:
      data.lastLoginAt?.toDate?.()?.toISOString() ?? data.lastLoginAt,
    metadata: data.metadata,
  }
}

// ─── Password ────────────────────────────────────────────────────────────────

export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('No user logged in.')

  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

// ─── User Management (Admin) ────────────────────────────────────────────────

import { collection, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore'

export async function getUsers(): Promise<UserProfile[]> {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  
  return snap.docs.map(doc => {
    const data = doc.data()
    return {
      uid: doc.id,
      email: data.email,
      displayName: data.displayName ?? null,
      phoneNumber: data.phoneNumber ?? '',
      role: data.role,
      permissions: data.permissions ?? ROLE_PERMISSIONS[data.role as Role],
      isActive: data.isActive ?? true,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
      lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() ?? data.lastLoginAt,
      metadata: data.metadata,
    }
  })
}

/**
 * Interface representing a Role configuration in the database.
 */
export interface SystemRole {
  id: string
  title: string
  description?: string
  permissions: Permission[]
}

export async function getRoles(): Promise<SystemRole[]> {
  const q = query(collection(db, 'roles'))
  const snap = await getDocs(q)
  
  if (snap.empty) {
    // Fallback to defaults defined in types/auth.ts if database collection is empty
    return Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
      id: role,
      title: role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1),
      permissions: permissions as Permission[]
    }))
  }

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SystemRole))
}

export async function createRole(data: Omit<SystemRole, 'id'>): Promise<void> {
  const id = data.title.toLowerCase().replace(/\s+/g, '-')
  await setDoc(doc(db, 'roles', id), {
    ...data,
    permissions: data.permissions || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteRole(id: string): Promise<void> {
  await deleteDoc(doc(db, 'roles', id))
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteUserProfile(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await deleteDoc(userRef)
}

import { writeBatch } from 'firebase/firestore'

export async function bulkUpdateUsers(
  uids: string[],
  data: Partial<UserProfile>
): Promise<void> {
  const batch = writeBatch(db)
  const now = serverTimestamp()

  uids.forEach((uid) => {
    const userRef = doc(db, 'users', uid)
    batch.update(userRef, {
      ...data,
      updatedAt: now,
    })
  })

  await batch.commit()
}

export async function bulkDeleteUsers(uids: string[]): Promise<void> {
  const batch = writeBatch(db)

  uids.forEach((uid) => {
    const userRef = doc(db, 'users', uid)
    batch.delete(userRef)
  })

  await batch.commit()
}
