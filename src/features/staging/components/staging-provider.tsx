import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Ticket } from '../data/schema'

type StagingDialogType = 'create' | 'edit' | 'delete'

type StagingContextType = {
  open: StagingDialogType | null
  setOpen: (str: StagingDialogType | null) => void
  currentRow: Ticket | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Ticket | null>>
}

const StagingContext = React.createContext<StagingContextType | null>(null)

export function StagingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StagingDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Ticket | null>(null)

  return (
    <StagingContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StagingContext.Provider>
  )
}

export const useStagingContext = () => {
  const stagingContext = React.useContext(StagingContext)

  if (!stagingContext) {
    throw new Error('useStagingContext has to be used within <StagingProvider>')
  }

  return stagingContext
}
