import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Project } from '../data/schema'
import { ProjectsMultiDeleteDialog } from './projects-multi-delete-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/lib/projects-service'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = async (
    status: 'none' | 'next' | 'preparing' | 'staged' | 'done',
  ) => {
    const projects = selectedRows.map((row) => row.original as Project)
    const label = status.charAt(0).toUpperCase() + status.slice(1)

    toast.promise(
      Promise.all(projects.map((p) => updateProject(p.id, { status }))),
      {
        loading: `Setting ${projects.length} project${projects.length > 1 ? 's' : ''} to "${label}"...`,
        success: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          table.resetRowSelection()
          return `Updated ${projects.length} project${projects.length > 1 ? 's' : ''} to "${label}"`
        },
        error: (err) => `Error: ${err.message}`,
      },
    )
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='project'>
        {/* Mark as Done */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('done')}
              className='size-8'
              aria-label='Mark selected as Done'
            >
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <span className='sr-only'>Mark as Done</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mark selected as Done</p>
          </TooltipContent>
        </Tooltip>

        {/* Reset to None */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('none')}
              className='size-8'
              aria-label='Reset selected to None'
            >
              <Circle className='h-4 w-4 text-muted-foreground' />
              <span className='sr-only'>Reset to None</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset selected to None</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected projects'
            >
              <Trash2 className='h-4 w-4' />
              <span className='sr-only'>Delete selected projects</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected projects</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ProjectsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
