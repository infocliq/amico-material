import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { ChecklistItem } from '@/features/checklist/data/schema'

export async function getChecklists(): Promise<ChecklistItem[]> {
  const q = query(collection(db, 'checklists'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  
  return snap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as ChecklistItem
  })
}

export async function getChecklist(id: string): Promise<ChecklistItem | null> {
  const docRef = doc(db, 'checklists', id)
  const snap = await getDoc(docRef)
  
  if (!snap.exists()) return null
  
  const data = snap.data()
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as ChecklistItem
}

export async function createChecklist(data: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'checklists'))
  const id = ref.id
  
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return id
}

export async function updateChecklist(id: string, data: Partial<ChecklistItem>): Promise<void> {
  const ref = doc(db, 'checklists', id)
  const updateData: any = { ...data }
  
  updateData.updatedAt = serverTimestamp()
  
  await updateDoc(ref, updateData)
}

export async function deleteChecklist(id: string): Promise<void> {
  await deleteDoc(doc(db, 'checklists', id))
}

export async function bulkDeleteChecklists(ids: string[]): Promise<void> {
  const batch = writeBatch(db)
  ids.forEach(id => {
    batch.delete(doc(db, 'checklists', id))
  })
  await batch.commit()
}
