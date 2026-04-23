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
} from 'firebase/firestore'
import { db } from './firebase'

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'next' | 'preparing' | 'staged' | 'done'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  category: 'billing' | 'technical' | 'account' | 'feature-request' | 'other'
  requestedBy: string
  requestedByEmail?: string
  assignee?: string
  assigneeEmail?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export async function getTickets(): Promise<Ticket[]> {
  const q = query(collection(db, 'tickets'))
  const snap = await getDocs(q)
  
  return snap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      requestedBy: data.requestedBy,
      requestedByEmail: data.requestedByEmail,
      assignee: data.assignee,
      assigneeEmail: data.assigneeEmail,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
    } as Ticket
  })
}

export async function createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ticketRef = doc(collection(db, 'tickets'))
  const id = ticketRef.id
  
  await setDoc(ticketRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return id
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<void> {
  const ticketRef = doc(db, 'tickets', id)
  await updateDoc(ticketRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTicket(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tickets', id))
}

export async function bulkDeleteTickets(ids: string[]): Promise<void> {
  const batch = writeBatch(db)
  ids.forEach(id => {
    batch.delete(doc(db, 'tickets', id))
  })
  await batch.commit()
}

export async function bulkUpdateTickets(ids: string[], data: Partial<Ticket>): Promise<void> {
  const batch = writeBatch(db)
  const now = serverTimestamp()
  ids.forEach(id => {
    batch.update(doc(db, 'tickets', id), {
      ...data,
      updatedAt: now,
    })
  })
  await batch.commit()
}
