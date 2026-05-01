import { useEffect, useState, useMemo } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { updateProject, getProjectHeaders } from '@/lib/projects-service'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type Project } from '../data/schema'
import { getProjectsColumns } from './projects-columns'
import { projectStatuses, projectRowColors } from '../data/data'
import { DataTableBulkActions } from './data-table-bulk-actions'

const projectQueryKey = ['projects']

type DataTableProps = {
  data: Project[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ProjectsTable({ data, search, navigate }: DataTableProps) {
  const queryClient = useQueryClient()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: headersMap } = useQuery({
    queryKey: ['projectHeaders'],
    queryFn: getProjectHeaders,
  })

  const columns = useMemo(() => getProjectsColumns(headersMap || {}), [headersMap])

  const {
    onGlobalFilterChange,
    globalFilter,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10000 },
    globalFilter: { enabled: true },
    columnFilters: [],
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Project> }) => updateProject(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKey })
      toast.success('Project updated!')
    },
    onError: () => toast.error('Failed to update project.'),
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    meta: {
      updateData: (id: string, columnId: string | Record<string, any>, value?: any) => {
        const data = typeof columnId === 'object' ? columnId : { [columnId]: value }
        updateMutation.mutate({ id, data })
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const name = (row.getValue('name') as string || '').toLowerCase()
      const salesOrder = (row.getValue('salesOrder') as string || '').toLowerCase()
      const productionOrder = (row.getValue('productionOrder') as string || '').toLowerCase()
      
      return name.includes(search) || 
             salesOrder.includes(search) || 
             productionOrder.includes(search)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className={cn(
      'max-sm:has-[div[role="toolbar"]]:mb-16',
      'flex flex-1 flex-col gap-4'
    )}>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search project, sales order, production order...'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: projectStatuses.map((t) => ({
              label: t.label,
              value: t.value,
              icon: t.icon,
            })),
          },
        ]}
      />
      <div className='flex-1 overflow-auto rounded-md border text-xs xl:text-sm'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted font-medium',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted h-10 py-1',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTableBulkActions table={table} />
    </div>
  )
}
