import { TrashIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useTicketsContext } from './tickets-provider'
import { bulkDeleteTickets } from '@/lib/tickets-service'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows
  const { setOpen, setCurrentRow } = useTicketsContext()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  if (selectedRows.length === 0) return null

  const handleDelete = async () => {
    const ids = selectedRows.map((row: any) => row.original.id)
    setIsLoading(true)
    try {
      await bulkDeleteTickets(ids)
      toast.success(`${ids.length} tickets deleted successfully.`)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      table.resetRowSelection()
    } catch (error) {
       toast.error('Failed to delete tickets.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background p-2 shadow-lg animate-in fade-in slide-in-from-bottom-2'>
      <span className='px-2 text-sm font-medium'>
        {selectedRows.length} ticket{selectedRows.length > 1 ? 's' : ''} selected
      </span>
      <div className='flex items-center gap-1 border-l pl-2'>
        <Button
          variant='ghost'
          size='sm'
          className='text-red-600 hover:text-red-700 hover:bg-red-50'
          onClick={handleDelete}
          disabled={isLoading}
        >
          <TrashIcon className='mr-2 h-4 w-4' />
          Delete
        </Button>
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => table.resetRowSelection()}
      >
        <span className='sr-only'>Close</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='h-4 w-4'
        >
          <path d='M18 6 6 18' />
          <path d='m6 6 12 12' />
        </svg>
      </Button>
    </div>
  )
}
