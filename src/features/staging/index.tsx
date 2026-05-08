import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CircleDot,
  Clock,
  AlertCircle,
  CheckCircle2,
  Package,
  ListChecks,
  Users as UsersIcon,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTickets } from '@/hooks/use-tickets'
import { useUsers } from '@/hooks/use-users'
import { getProjects } from '@/lib/projects-service'
import { projectRowColors } from '@/features/projects/data/data'
import { StagingProvider, useStagingContext } from './components/staging-provider'
import { StagingDialogs } from './components/staging-dialogs'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ProjectChecklistView } from '@/features/projects/components/project-checklist-view'
import { ScrollArea } from '@/components/ui/scroll-area'

const kanbanColumns = [
  { id: 'next', title: 'Next', icon: CircleDot, color: 'text-blue-500' },
  { id: 'preparing', title: 'Preparing', icon: Clock, color: 'text-amber-500' },
  { id: 'staged', title: 'Staged', icon: AlertCircle, color: 'text-red-500' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
]

const calculateProgress = (checklist: any) => {
  if (!checklist || !checklist.departments) return { completed: 0, total: 0 }
  let total = 0
  let completed = 0
  
  checklist.departments.forEach((dept: any) => {
    const groups = dept.groups || []
    if (groups.length === 0) {
      total++
      if (dept.isStaged) completed++
    } else {
      groups.forEach((group: any) => {
        const items = group.items || []
        if (items.length === 0) {
          total++
          if (group.isStaged) completed++
        } else {
          items.forEach((item: any) => {
            total++
            if (item.isStaged) completed++
          })
        }
      })
    }
  })
  return { completed, total }
}

export default function Staging() {
  return (
    <StagingProvider>
      <StagingContent />
    </StagingProvider>
  )
}

function StagingContent() {
  const { setOpen, setCurrentRow } = useStagingContext()
  const { data: tickets = [], isLoading: stagingLoading } = useTickets()
  const { data: users = [] } = useUsers()
  
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const isLoading = stagingLoading || projectsLoading
  
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    return tickets.filter(ticket => {
      const matchAssignee = !assigneeFilter || 
        (assigneeFilter === 'unassigned' ? (ticket.assignee === 'unassigned' || !ticket.assignee) : ticket.assignee === assigneeFilter)
      return matchAssignee
    })
  }, [tickets, assigneeFilter])

  const groupedItems = useMemo(() => {
    return kanbanColumns.reduce((acc, col) => {
      acc[col.id] = [
        ...filteredItems.filter((t) => t.status === col.id).map(t => ({ ...t, type: 'staging' })),
        ...((projects as any[]).filter((p) => p.status === col.id).map(p => ({ ...p, type: 'project' })))
      ]
      return acc
    }, {} as Record<string, any[]>)
  }, [filteredItems, projects])

  return (
    <>
      <Header fixed shadow>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Staging Dashboard</h2>
            <p className='text-sm text-muted-foreground'>
              Monitor and manage projects through the production pipeline.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='hidden md:flex items-center gap-2 mr-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className={cn('h-8 gap-2 text-xs', assigneeFilter && 'border-primary bg-primary/5 text-primary')}>
                    <UsersIcon className='size-3.5' />
                    {assigneeFilter === 'unassigned' ? 'Unassigned' : (assigneeFilter || 'Assignee')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setAssigneeFilter(null)}>All Users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAssigneeFilter('unassigned')}>Unassigned</DropdownMenuItem>
                  {users.filter(u => u.isActive).map(u => (
                    <DropdownMenuItem key={u.uid} onClick={() => setAssigneeFilter(u.displayName || u.email)}>
                      {u.displayName || u.email}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-[400px] items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {kanbanColumns.map((column) => (
              <div key={column.id} className='flex flex-col gap-4'>
                <div className='flex items-center justify-between border-b pb-2 px-1'>
                  <div className='flex items-center gap-2'>
                    <column.icon className={cn('size-4', column.color)} />
                    <h3 className='font-semibold text-sm'>{column.title}</h3>
                    <span className='text-xs text-muted-foreground ml-1'>
                      {groupedItems[column.id]?.length || 0}
                    </span>
                  </div>
                </div>
                
                <div className='flex flex-col gap-3'>
                  {groupedItems[column.id]?.map((item) => (
                    item.type === 'staging' ? (
                      <div
                        key={item.id}
                        onClick={() => {
                          setCurrentRow(item)
                          setOpen('edit')
                        }}
                        className={cn(
                          'group relative flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all hover:border-black/50 hover:shadow-md cursor-pointer',
                          'border border-orange-500',
                          projectRowColors.get(item.status) || 'bg-card'
                        )}
                      >
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2 min-w-0'>
                              <span className={cn('size-2 shrink-0 rounded-full',
                                item.priority === 'urgent' ? 'bg-red-500' :
                                  item.priority === 'high' ? 'bg-amber-500' :
                                    item.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-400'
                              )} />
                              <h4 className={cn('font-bold text-[10px] text-black uppercase tracking-wider truncate',
                                item.status === 'done' ? 'text-muted-foreground line-through opacity-60' : 'text-black'
                              )}>
                                TICKET: {item.id.slice(0, 8).toUpperCase()}
                              </h4>
                            </div>
                            <Badge variant='outline' className='text-[9px] h-4 px-1 opacity-70 border-black/20 text-black capitalize'>
                              {item.priority}
                            </Badge>
                          </div>
                          <h4 className={cn('font-semibold text-sm leading-tight text-foreground truncate mt-1',
                            item.status === 'done' && 'text-muted-foreground line-through opacity-60'
                          )}>
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <ProjectItemCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => setSelectedProject(item)} 
                      />
                    )
                  ))}
                  {groupedItems[column.id]?.length === 0 && (
                    <div className='flex h-20 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground'>
                      No items
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Main>

      <Sheet open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-xl p-0 flex flex-col h-full border-l border-black/10 shadow-2xl"
        >
          <SheetHeader className="p-4 sm:p-6 border-b border-black/5 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-black flex items-center justify-center text-white shrink-0">
                <ListChecks className="size-5" />
              </div>
              <div className="text-left min-w-0">
                <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-black truncate">
                  Project Checklist
                </SheetTitle>
                <SheetDescription className="text-[10px] sm:text-xs font-medium text-black/50 truncate">
                   {selectedProject?.name} • WO: {selectedProject?.workOrder}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-6">
                {selectedProject && (
                  <ProjectChecklistView project={selectedProject} />
                )}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <StagingDialogs />
    </>
  )
}

function ProjectItemCard({ item, onClick }: { item: any, onClick: () => void }) {
  const { completed, total } = useMemo(() => calculateProgress(item.checklist), [item.checklist])
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-black/10 p-4 shadow-sm transition-all hover:border-black/30 hover:shadow-md cursor-pointer',
        projectRowColors.get(item.status) || 'bg-white'
      )}
    >
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Package className='size-3.5 text-black/70' />
            <span className='text-[10px] font-bold text-black uppercase tracking-wider'>
              WO: {item.productionOrder || item.workOrder || 'N/A'}
            </span>
          </div>
          <Badge variant='outline' className='text-[9px] h-4 px-1 opacity-70 border-black/20 text-black'>
            {item.productType || item.product || 'No Product'}
          </Badge>
        </div>
        <h4 className={cn('font-semibold text-sm leading-tight text-foreground truncate',
          item.status === 'done' && 'text-muted-foreground line-through opacity-60'
        )}>
          {item.name}
        </h4>
        <div className='flex flex-col gap-1 mt-1'>
          {item.drawing && (
            <div className='flex items-center gap-1.5'>
              <FileText className='size-3 text-blue-600/70' />
              <span className='text-[9px] font-bold text-black/60 uppercase tracking-wider'>{item.drawing}</span>
            </div>
          )}
          <div className='flex items-center gap-1.5'>
            <span className='text-[9px] font-bold text-black/60 uppercase tracking-wider'>Line: {item.line || '—'}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='text-[9px] font-bold text-black/60 uppercase tracking-wider'>Building #: {item.plNumber || '—'}</span>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            SO: <span className='text-foreground font-medium'>{item.salesOrder || '—'}</span>
          </span>
          {item.productionStart && (
            <span className='flex items-center gap-1.5'>
              Start: <span className='text-foreground font-medium'>
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(item.productionStart))}
              </span>
            </span>
          )}
        </div>

        {item.checklistId && (
          <div className='pt-2 space-y-1.5'>
            <div className='flex items-center justify-between text-[10px]'>
              <span className='font-bold text-black/60'>PARTS CHECKLIST STATUS</span>
              <span className='font-bold text-black'>{completed}/{total}</span>
            </div>
            <div className='w-full h-1.5 bg-black/[0.05] rounded-full overflow-hidden'>
              <div
                className='h-full bg-black transition-all duration-500 ease-in-out'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
