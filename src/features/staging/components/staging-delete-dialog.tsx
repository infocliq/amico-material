import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useStagingContext } from './staging-provider'
import { deleteTicket } from '@/lib/tickets-service'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function StagingDeleteDialog() {
  const { open, setOpen, currentRow } = useStagingContext()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    if (!currentRow) return
    setIsLoading(true)
    try {
      await deleteTicket(currentRow.id)
      toast.success('Staging record deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setOpen(null)
    } catch (error) {
      toast.error('Failed to delete staging record.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the staging entry
            <span className='font-bold'> {currentRow?.title}</span> and remove its
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className='bg-red-600 hover:bg-red-700'
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
