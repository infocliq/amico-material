import React, { createContext, useContext, useState } from 'react'
import { ChecklistItem } from '../data/schema'

type ChecklistDialogType = 'create' | 'edit' | 'delete' | 'duplicate' | 'view'

interface ChecklistContextType {
  open: ChecklistDialogType | null
  setOpen: (open: ChecklistDialogType | null) => void
  currentRow: ChecklistItem | null
  setCurrentRow: (row: ChecklistItem | null) => void
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined)

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<ChecklistDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<ChecklistItem | null>(null)

  return (
    <ChecklistContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  const context = useContext(ChecklistContext)
  if (!context) {
    throw new Error('useChecklist must be used within a ChecklistProvider')
  }
  return context
}
