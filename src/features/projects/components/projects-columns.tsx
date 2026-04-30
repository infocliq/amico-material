import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Project } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { EditableCell } from './editable-cell'
import { DateEditableCell } from './date-editable-cell'
import { EditableStatusCell } from './editable-status-cell'
import { ChecklistSelectCell } from './checklist-select-cell'

export const getProjectsColumns = (headers: Record<string, string> = {}): ColumnDef<Project>[] => [
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
      <DataTableColumnHeader column={column} title={headers.salesOrder || 'Sales Order'} />
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
    accessorKey: 'productionOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.productionOrder || 'Production Order'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('productionOrder')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'productionOrder', val)}
      />
    ),
  },
  {
    accessorKey: 'asBuiltDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.asBuiltDate || 'As-Built Date'} />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('asBuiltDate')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'asBuiltDate', val)}
      />
    ),
  },
  {
    accessorKey: 'shipDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.shipDate || 'Ship Date'} />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('shipDate')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'shipDate', val)}
      />
    ),
  },
  {
    accessorKey: 'supervisors',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.supervisors || 'Supervisors'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('supervisors')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'supervisors', val)}
      />
    ),
  },
  {
    accessorKey: 'line',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.line || 'Line'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('line')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'line', val)}
      />
    ),
  },
  {
    accessorKey: 'plNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.plNumber || 'PL#'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('plNumber')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'plNumber', val)}
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.name || 'Project Name'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('name')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'name', val)}
      />
    ),
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.product || 'Product'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('product')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'product', val)}
      />
    ),
  },
  {
    accessorKey: 'productionStart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.productionStart || 'Prod Start'} />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('productionStart')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'productionStart', val)}
      />
    ),
  },
  {
    accessorKey: 'productionEnd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.productionEnd || 'Prod End'} />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('productionEnd')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'productionEnd', val)}
      />
    ),
  },
  {
    accessorKey: 'phase',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.phase || 'Phase'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('phase')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'phase', val)}
      />
    ),
  },
  {
    accessorKey: 'drawing',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.drawing || 'Drawing'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('drawing')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'drawing', val)}
      />
    ),
  },
  {
    accessorKey: 'supportStart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.supportStart || 'Support Start Date'} />
    ),
    cell: ({ row, table }) => (
      <DateEditableCell
        value={row.getValue('supportStart')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'supportStart', val)}
      />
    ),
  },
  {
    accessorKey: 'panelMaterial',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.panelMaterial || 'Panel Material'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('panelMaterial')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'panelMaterial', val)}
      />
    ),
  },
  {
    accessorKey: 'checklistId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Checklist Template' />
    ),
    cell: ({ row, table }) => (
      <ChecklistSelectCell
        value={row.getValue('checklistId')}
        onSave={(val, checklist) => {
          const meta = table.options.meta as any
          meta?.updateData(row.original.id, 'checklistId', val)
          meta?.updateData(row.original.id, 'checklist', checklist)
        }}
      />
    ),
  },
  // Checklist Columns (Now as Text)
  {
    accessorKey: 'hollyMaterial',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.hollyMaterial || 'Holly - Material'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('hollyMaterial')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'hollyMaterial', val)}
      />
    ),
  },
  {
    accessorKey: 'blueFolderFredG',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.blueFolderFredG || 'Blue folder- Fred G.'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('blueFolderFredG')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'blueFolderFredG', val)}
      />
    ),
  },
  {
    accessorKey: 'firstOffJay',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.firstOffJay || '1st Off- Jay'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('firstOffJay')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'firstOffJay', val)}
      />
    ),
  },
  {
    accessorKey: 'uvKitting',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.uvKitting || 'UV - Kitting'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('uvKitting')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'uvKitting', val)}
      />
    ),
  },
  {
    accessorKey: 'woodshopPanel',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.woodshopPanel || 'Woodshop - Panel'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('woodshopPanel')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'woodshopPanel', val)}
      />
    ),
  },
  {
    accessorKey: 'robertoSub',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.robertoSub || 'Roberto- SUB'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('robertoSub')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'robertoSub', val)}
      />
    ),
  },
  {
    accessorKey: 'alexSumelEmtPipe',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.alexSumelEmtPipe || 'Alex/Sumel- EMT pipe'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('alexSumelEmtPipe')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'alexSumelEmtPipe', val)}
      />
    ),
  },
  {
    accessorKey: 'jaysonBox',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.jaysonBox || 'Jayson - Box'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('jaysonBox')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'jaysonBox', val)}
      />
    ),
  },
  {
    accessorKey: 'jaysonWire',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.jaysonWire || 'Jayson Wire'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('jaysonWire')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'jaysonWire', val)}
      />
    ),
  },
  {
    accessorKey: 'arnoldCut',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.arnoldCut || 'Arnold Cut'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('arnoldCut')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'arnoldCut', val)}
      />
    ),
  },
  {
    accessorKey: 'arnoldCnc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.arnoldCnc || 'Arnold CNC'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('arnoldCnc')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'arnoldCnc', val)}
      />
    ),
  },
  {
    accessorKey: 'kevinMaterialHandling',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.kevinMaterialHandling || 'Kevin- Material Handling'} />
    ),
    cell: ({ row, table }) => (
      <EditableCell
        value={row.getValue('kevinMaterialHandling')}
        onSave={(val) => (table.options.meta as any)?.updateData(row.original.id, 'kevinMaterialHandling', val)}
      />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={headers.status || 'Status'} />
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
    id: 'actions',
    cell: DataTableRowActions,
  },
]
