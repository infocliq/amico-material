import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
import { useChecklist } from './checklist-provider'
import { deleteChecklist } from '@/lib/checklist-service'
import { toast } from 'sonner'

export function ChecklistDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useChecklist()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteChecklist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      setOpen(null)
      setCurrentRow(null)
      toast.success('Checklist deleted')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete checklist.')
    },
  })

  return (
    <AlertDialog
      open={open === 'delete'}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(null)
          setCurrentRow(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            checklist for model <span className='font-bold text-foreground'>{currentRow?.modelNumber}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              if (currentRow) mutate(currentRow.id)
            }}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
