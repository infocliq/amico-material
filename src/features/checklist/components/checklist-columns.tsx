import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { checklistStatuses, checklistPriorities } from '../data/data'
import { type ChecklistItem } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const checklistColumns: ColumnDef<ChecklistItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'modelNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Model Number' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-72 ps-1 font-bold'>{row.getValue('modelNumber')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'status-progress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Checklist Status' />
    ),
    cell: ({ row }) => {
      const departments = (row.original.departments as any[]) || []
      let total = 0
      let completed = 0
      
      departments.forEach(dept => {
        const groups = (dept.groups as any[]) || []
        if (groups.length === 0) {
          total++
          if (dept.isChecked) completed++
        } else {
          groups.forEach(group => {
            const items = (group.items as any[]) || []
            if (items.length === 0) {
              total++
              if (group.isChecked) completed++
            } else {
              items.forEach(item => {
                total++
                if (item.isChecked) completed++
              })
            }
          })
        }
      })
      
      return (
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>{completed}/{total} Checked</span>
          <div className='w-24 h-2 bg-muted rounded-full overflow-hidden'>
            <div 
              className='h-full bg-primary transition-all' 
              style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: DataTableRowActions,
  },
]
