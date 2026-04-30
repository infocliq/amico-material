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
  productionOrder: string
  asBuiltDate?: string | Date
  shipDate: string | Date
  supervisors: string
  line: string
  plNumber: string
  name: string
  product: string
  productionStart: string | Date
  productionEnd?: string | Date
  phase: string
  drawing: string
  supportStart: string | Date
  panelMaterial: string
  hollyMaterial: string
  blueFolderFredG: string
  firstOffJay: string
  uvKitting: string
  woodshopPanel: string
  robertoSub: string
  alexSumelEmtPipe: string
  jaysonBox: string
  jaysonWire: string
  arnoldCut: string
  arnoldCnc: string
  kevinMaterialHandling: string
  status: 'none' | 'next' | 'preparing' | 'staged' | 'done'
  assignee: string
  tasks: string[]
  checklist?: any
  checklistId?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  
  return snap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      asBuiltDate: data.asBuiltDate instanceof Timestamp ? data.asBuiltDate.toDate().toISOString() : data.asBuiltDate,
      shipDate: data.shipDate instanceof Timestamp ? data.shipDate.toDate().toISOString() : data.shipDate,
      productionStart: data.productionStart instanceof Timestamp ? data.productionStart.toDate().toISOString() : data.productionStart,
      productionEnd: data.productionEnd instanceof Timestamp ? data.productionEnd.toDate().toISOString() : data.productionEnd,
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
    asBuiltDate: data.asBuiltDate instanceof Timestamp ? data.asBuiltDate.toDate().toISOString() : data.asBuiltDate,
    shipDate: data.shipDate instanceof Timestamp ? data.shipDate.toDate().toISOString() : data.shipDate,
    productionStart: data.productionStart instanceof Timestamp ? data.productionStart.toDate().toISOString() : data.productionStart,
    productionEnd: data.productionEnd instanceof Timestamp ? data.productionEnd.toDate().toISOString() : data.productionEnd,
    supportStart: data.supportStart instanceof Timestamp ? data.supportStart.toDate().toISOString() : data.supportStart,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as Project
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const projectRef = doc(collection(db, 'projects'))
  const id = projectRef.id
  
  const formattedData: any = { ...data }
  if (data.asBuiltDate) formattedData.asBuiltDate = Timestamp.fromDate(new Date(data.asBuiltDate))
  if (data.shipDate) formattedData.shipDate = Timestamp.fromDate(new Date(data.shipDate))
  if (data.productionStart) formattedData.productionStart = Timestamp.fromDate(new Date(data.productionStart))
  if (data.productionEnd) formattedData.productionEnd = Timestamp.fromDate(new Date(data.productionEnd))
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
  
  if (data.asBuiltDate) updateData.asBuiltDate = Timestamp.fromDate(new Date(data.asBuiltDate))
  if (data.shipDate) updateData.shipDate = Timestamp.fromDate(new Date(data.shipDate))
  if (data.productionStart) updateData.productionStart = Timestamp.fromDate(new Date(data.productionStart))
  if (data.productionEnd) updateData.productionEnd = Timestamp.fromDate(new Date(data.productionEnd))
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

export async function updateProjectHeaders(headers: Record<string, string>): Promise<void> {
  const docRef = doc(db, 'settings', 'projectHeaders')
  await setDoc(docRef, headers)
}

export async function getProjectHeaders(): Promise<Record<string, string>> {
  const docRef = doc(db, 'settings', 'projectHeaders')
  const snap = await getDoc(docRef)
  return snap.exists() ? snap.data() : {}
}
