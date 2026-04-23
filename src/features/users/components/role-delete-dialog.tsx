
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteRole } from '@/lib/auth-service'

interface RoleDeleteDialogProps {
  roleId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleDeleteDialog({
  roleId,
  open,
  onOpenChange,
}: RoleDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    if (!roleId) return

    setIsLoading(true)
    try {
      await deleteRole(roleId)
      toast.success('Role deleted successfully')
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to delete role', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-2 text-destructive mb-2'>
            <AlertTriangle className='h-5 w-5' />
            <DialogTitle>Delete Role</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the <span className='font-bold text-foreground'>"{roleId}"</span> role? 
            This action cannot be undone and may affect users currently assigned to this role.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
