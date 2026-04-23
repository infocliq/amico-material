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
import { deleteProject } from '@/lib/projects-service'

interface ProjectDeleteDialogProps {
  projectId: string | null
  projectName: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDeleteDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: ProjectDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    if (!projectId) return

    setIsLoading(true)
    try {
      await deleteProject(projectId)
      toast.success('Project deleted successfully')
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to delete project', {
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
            <DialogTitle>Delete Project</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the project <span className='font-bold text-foreground'>"{projectName || projectId}"</span>? 
            This action cannot be undone and will permanently remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
