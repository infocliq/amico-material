import { useMemo, useState } from 'react'
import {
  Circle,
  Clock,
  PlayCircle,
  Activity,
  CheckCircle2,
  ListChecks,
  Package,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Project } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ProjectChecklistView } from './project-checklist-view'
import { ScrollArea } from '@/components/ui/scroll-area'
import { projectRowColors } from '../data/data'

interface ProjectsKanbanProps {
  data: Project[]
}

const kanbanColumns = [
  { id: 'none', title: 'None', icon: Circle, color: 'text-slate-400' },
  { id: 'next', title: 'Next', icon: Clock, color: 'text-blue-500' },
  { id: 'preparing', title: 'Preparing', icon: PlayCircle, color: 'text-amber-500' },
  { id: 'staged', title: 'Staged', icon: Activity, color: 'text-purple-500' },
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
      if (dept.isChecked) completed++
    } else {
      groups.forEach((group: any) => {
        const items = group.items || []
        if (items.length === 0) {
          total++
          if (group.isChecked) completed++
        } else {
          items.forEach((item: any) => {
            total++
            if (item.isChecked) completed++
          })
        }
      })
    }
  })
  return { completed, total }
}

export function ProjectsKanban({ data }: ProjectsKanbanProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const groupedProjects = useMemo(() => {
    return kanbanColumns.reduce((acc, col) => {
      acc[col.id] = data.filter((p) => p.status === col.id)
      return acc
    }, {} as Record<string, Project[]>)
  }, [data])

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {kanbanColumns.map((column) => (
        <div key={column.id} className='flex flex-col gap-4'>
          <div className='flex items-center justify-between border-b pb-2 px-1'>
            <div className='flex items-center gap-2'>
              <column.icon className={cn('size-4', column.color)} />
              <h3 className='font-semibold text-sm'>{column.title}</h3>
              <span className='text-xs text-muted-foreground ml-1'>
                {groupedProjects[column.id]?.length || 0}
              </span>
            </div>
          </div>
          
          <div className='flex flex-col gap-3'>
            {groupedProjects[column.id]?.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
            {groupedProjects[column.id]?.length === 0 && (
              <div className='flex h-20 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground bg-muted/5'>
                No projects
              </div>
            )}
          </div>
        </div>
      ))}

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
                   {selectedProject?.name} • PO: {selectedProject?.productionOrder}
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
    </div>
  )
}

function ProjectCard({ project, onClick }: { project: Project, onClick: () => void }) {
  const { completed, total } = useMemo(() => calculateProgress(project.checklist), [project.checklist])
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div 
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all hover:border-black/50 hover:shadow-md cursor-pointer',
        projectRowColors.get(project.status) || 'bg-white'
      )}
      onClick={onClick}
    >
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Package className='size-3.5 text-black/70' />
            <span className='text-[10px] font-bold text-black uppercase tracking-wider'>PO: {project.productionOrder}</span>
          </div>
          <Badge variant='outline' className='text-[9px] h-4 px-1 opacity-70 border-black/20 text-black'>{project.product}</Badge>
        </div>
        <h4 className='font-semibold text-sm leading-tight text-foreground truncate'>
          {project.name}
        </h4>
        {project.drawing && (
          <div className='flex items-center gap-1.5 mt-0.5'>
            <FileText className='size-3.5 text-blue-600/70' />
            <span className='text-[10px] font-bold text-black/60 uppercase tracking-wider'>Drawing: {project.drawing}</span>
          </div>
        )}
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
             SO: <span className='text-foreground font-medium'>{project.salesOrder}</span>
          </span>
          {project.productionStart && (
            <span className='flex items-center gap-1.5'>
              Start: <span className='text-foreground font-medium'>
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(project.productionStart))}
              </span>
            </span>
          )}
        </div>
        
        {project.checklistId && (
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
