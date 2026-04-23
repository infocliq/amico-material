import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Project } from '../data/schema'
import { projectStatuses, projectStatusColors } from '../data/data'
import { DataTableRowActions } from './data-table-row-actions'
import { EditableCell } from './editable-cell'
import { DateEditableCell } from './date-editable-cell'
import { EditableStatusCell } from './editable-status-cell'
import { ChecklistSelectCell } from './checklist-select-cell'

export const projectsColumns: ColumnDef<Project>[] = [
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
    accessorKey: 'salesOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sales Order' />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('salesOrder')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'salesOrder', val)}
      />
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
    accessorKey: 'workOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Work Order' />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('workOrder')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'workOrder', val)}
      />
    ),
  },
  {
    accessorKey: 'shipDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ship Date' />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('shipDate')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'shipDate', val)}
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('name')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'name', val)}
      />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row, table }) => (
      <EditableStatusCell
        value={row.getValue('status')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'status', val)}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'checklistId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Checklist' />
    ),
    cell: ({ row, table }) => (
      <ChecklistSelectCell
        value={row.getValue('checklistId')}
        onSave={(checklistId, fullChecklist) => 
          (table.options.meta as any)?.updateData(row.original.id, { 
            checklistId, 
            checklist: fullChecklist 
          })
        }
      />
    ),
  },
  {
    accessorKey: 'productType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product Type' />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('productType')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'productType', val)}
      />
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('quantity')}
        type='number'
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'quantity', val)}
      />
    ),
  },
  {
    accessorKey: 'productionStart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Production Start' />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('productionStart')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'productionStart', val)}
      />
    ),
  },
  {
    accessorKey: 'supportStart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Support Start' />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('supportStart')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'supportStart', val)}
      />
    ),
  },
  {
    accessorKey: 'drawing',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Drawing' />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('drawing')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'drawing', val)}
      />
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
