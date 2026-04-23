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

export interface Project {
  id: string
  salesOrder: string
  workOrder: string
  shipDate: string
  name: string
  quantity: number
  productionStart: string
  supportStart: string
  drawing: string
  productType: string
  status: 'none' | 'next' | 'preparing' | 'staged' | 'done'
  assignee: string
  tasks: string[]
  createdAt: string
  updatedAt: string
}

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  
  return snap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      shipDate: data.shipDate instanceof Timestamp ? data.shipDate.toDate().toISOString() : data.shipDate,
      productionStart: data.productionStart instanceof Timestamp ? data.productionStart.toDate().toISOString() : data.productionStart,
      supportStart: data.supportStart instanceof Timestamp ? data.supportStart.toDate().toISOString() : data.supportStart,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as Project
  })
}

export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, 'projects', id)
  const snap = await getDoc(docRef)
  
  if (!snap.exists()) return null
  
  const data = snap.data()
  return {
    id: snap.id,
    ...data,
    shipDate: data.shipDate instanceof Timestamp ? data.shipDate.toDate().toISOString() : data.shipDate,
    productionStart: data.productionStart instanceof Timestamp ? data.productionStart.toDate().toISOString() : data.productionStart,
    supportStart: data.supportStart instanceof Timestamp ? data.supportStart.toDate().toISOString() : data.supportStart,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as Project
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const projectRef = doc(collection(db, 'projects'))
  const id = projectRef.id
  
  const formattedData: any = { ...data }
  if (data.shipDate) formattedData.shipDate = Timestamp.fromDate(new Date(data.shipDate))
  if (data.productionStart) formattedData.productionStart = Timestamp.fromDate(new Date(data.productionStart))
  if (data.supportStart) formattedData.supportStart = Timestamp.fromDate(new Date(data.supportStart))

  await setDoc(projectRef, {
    ...formattedData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return id
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  const projectRef = doc(db, 'projects', id)
  const updateData: any = { ...data }
  
  if (data.shipDate) updateData.shipDate = Timestamp.fromDate(new Date(data.shipDate))
  if (data.productionStart) updateData.productionStart = Timestamp.fromDate(new Date(data.productionStart))
  if (data.supportStart) updateData.supportStart = Timestamp.fromDate(new Date(data.supportStart))
  
  updateData.updatedAt = serverTimestamp()
  
  await updateDoc(projectRef, updateData)
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id))
}

export async function bulkDeleteProjects(ids: string[]): Promise<void> {
  const batch = writeBatch(db)
  ids.forEach(id => {
    batch.delete(doc(db, 'projects', id))
  })
  await batch.commit()
}
