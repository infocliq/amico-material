// scripts/seed-admin.ts
// Seeds the Firestore `users` collection with superadmin role for a given email.
// Run with: pnpm db:seed

import 'dotenv/config'
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// ─── Types (inlined to avoid importing from src/) ────────────────────────────

type Role = 'superadmin' | 'admin' | 'manager' | 'editor' | 'viewer'

type Permission =
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

const ALL_PERMISSIONS: Permission[] = [
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
]

// ─── Config ──────────────────────────────────────────────────────────────────

const TARGET_EMAIL = 'kevin@macbook.com'
const TARGET_ROLE: Role = 'superadmin'

// ─── Firebase Admin Init ─────────────────────────────────────────────────────

function getAdminApp() {
  if (getApps().length > 0) return getApp()

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  )

  if (
    !process.env.FIREBASE_ADMIN_PROJECT_ID ||
    !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    !privateKey
  ) {
    throw new Error(
      '❌  Missing Firebase Admin env vars. Check your .env.local file.'
    )
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  })
}

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Firebase Seed Script')
  console.log('━'.repeat(50))

  const app = getAdminApp()
  const adminAuth = getAuth(app)
  const db = getFirestore(app)

  // 1. Look up the Firebase Auth user by email
  console.log(`\n🔍  Looking up user: ${TARGET_EMAIL}`)
  let uid: string
  try {
    const userRecord = await adminAuth.getUserByEmail(TARGET_EMAIL)
    uid = userRecord.uid
    console.log(`✅  Found user — UID: ${uid}`)
  } catch {
    console.error(`❌  User not found in Firebase Auth: ${TARGET_EMAIL}`)
    console.error(
      '    Make sure the account exists in Firebase Console → Authentication.'
    )
    process.exit(1)
  }

  // 2. Build the profile document
  const now = new Date().toISOString()
  const profile = {
    uid,
    email: TARGET_EMAIL,
    displayName: 'Super Admin',
    role: TARGET_ROLE,
    permissions: ALL_PERMISSIONS,
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    lastLoginAt: null,
    metadata: {
      seededAt: now,
      seededBy: 'scripts/seed-admin.ts',
    },
  }

  // 3. Write to Firestore (merge: true = non-destructive upsert)
  console.log(`\n📝  Writing Firestore document: users/${uid}`)
  console.log(`    role       : ${TARGET_ROLE}`)
  console.log(`    permissions: ${ALL_PERMISSIONS.length} (all)`)

  await db.collection('users').doc(uid).set(profile, { merge: true })

  console.log(`✅  Document written successfully.`)

  // 4. Set Firebase Custom Claims for JWT-level enforcement (optional but recommended)
  console.log(`\n🔐  Setting custom claims on Firebase Auth token...`)
  await adminAuth.setCustomUserClaims(uid, {
    role: TARGET_ROLE,
    permissions: ALL_PERMISSIONS,
  })
  console.log(`✅  Custom claims set.`)

  // 5. Seed Roles Collection
  console.log(`\n📂  Seeding roles collection...`)
  const rolesCollection = db.collection('roles')
  const baseRoles = [
    { id: 'superadmin', title: 'Super Admin' },
    { id: 'admin', title: 'Admin' },
    { id: 'manager', title: 'Manager' },
    { id: 'editor', title: 'Editor' },
    { id: 'viewer', title: 'Viewer' },
  ]

  for (const role of baseRoles) {
    // Get default permissions for each role if you want to be precise, 
    // but for now we'll just seed the superadmin with all and others with basic subsets
    await rolesCollection.doc(role.id).set({
      title: role.title,
      description: `Default system role for ${role.title}`,
      permissions: role.id === 'superadmin' ? ALL_PERMISSIONS : ['content:read'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    console.log(`    - Seeded role: ${role.id}`)
  }

  // 6. Seed Permissions Collection
  console.log(`\n🔑  Seeding permissions collection...`)
  const permsCollection = db.collection('permissions')
  for (const permId of ALL_PERMISSIONS) {
    const [category, action] = permId.split(':')
    const label = action.charAt(0).toUpperCase() + action.slice(1) + ' ' + category.charAt(0).toUpperCase() + category.slice(1)

    await permsCollection.doc(permId).set({
      id: permId,
      label: label,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    console.log(`    - Seeded permission: ${permId}`)
  }

  console.log('\n' + '━'.repeat(50))
  console.log('🎉  Seed complete!')
  console.log(`    - ${TARGET_EMAIL} is now a superadmin.`)
  console.log(`    - 'roles' collection populated.`)
  console.log(`    - 'permissions' collection populated.`)
  console.log(
    '    NOTE: The user must sign out and back in for new claims to take effect.\n'
  )

  process.exit(0)
}

seed().catch((err) => {
  console.error('\n❌  Seed failed:', err.message)
  process.exit(1)
})
