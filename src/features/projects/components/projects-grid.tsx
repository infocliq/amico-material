import {
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
  Loader2,
  Folder,
  FolderPlus,
  Upload,
  Share2,
  Bookmark,
  MapPin
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, deleteProject, Project } from '@/lib/projects-service'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

const ASSIGNEE_MAP: Record<string, { initials: string, color: string }> = {
  sarah: { initials: 'SA', color: 'bg-violet-100 text-violet-700' },
  michael: { initials: 'MB', color: 'bg-blue-100 text-blue-700' },
  emily: { initials: 'ED', color: 'bg-emerald-100 text-emerald-700' },
  james: { initials: 'JW', color: 'bg-orange-100 text-orange-700' },
  lisa: { initials: 'LT', color: 'bg-pink-100 text-pink-700' },
}

export function ProjectsGrid() {
  const navigate = useNavigate()
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!projects || projects.length === 0 || error) {
    return (
      <div className='flex flex-col items-center justify-center px-4 py-24 text-center'>
        <div className='mb-6 flex size-20 items-center justify-center rounded-full bg-muted/50'>
          <Folder className='size-10 text-muted-foreground' aria-hidden='true' />
        </div>
        <h3 className='mb-2 text-xl font-bold tracking-tight text-foreground'>No projects yet</h3>
        <p className='mb-8 max-w-sm text-sm text-muted-foreground leading-relaxed'>
          Get started by creating your first project or importing an existing one from a template.
        </p>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button
            size='sm'
            className='h-8 gap-2 px-4'
            onClick={() => navigate({ to: '/projects/create' })}
          >
            <FolderPlus className='size-3.5' />
            Create Project
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='h-8 gap-2 px-4 border-black/10 dark:border-white/10 hover:bg-accent'
          >
            <Upload className='size-3.5' />
            Import from Template
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully.')
    },
    onError: () => {
      toast.error('Failed to delete project.')
    }
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(project.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({ to: '/projects/$projectId/edit', params: { projectId: project.id } })
  }

  return (
    <Card
      onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id } })}
      className='relative cursor-pointer rounded-2xl border border-primary/10 bg-card transition-all duration-200 hover:border-primary/20 overflow-hidden'
    >
      <CardContent className='space-y-4'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='space-y-0.5 min-w-0'>
            <p className='text-sm font-medium text-foreground truncate uppercase tracking-wider text-[10px] opacity-70'>{project.productType}</p>
            <p className='text-xs text-muted-foreground truncate'>Web Development</p>
            <h4 className='text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors'>{project.name}</h4>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <MapPin className='w-3 h-3' />
              <span>Remote</span>
              <Badge
                variant='secondary'
                className={cn(
                  'ml-1 px-1.5 py-0 text-[11px] border-0 rounded-full',
                  project.status === 'preparing' ? 'text-emerald-600 bg-emerald-50' :
                    project.status === 'done' ? 'text-blue-600 bg-blue-50' :
                      'text-amber-600 bg-amber-50'
                )}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Logo Replacement / Action */}
          <div className='flex flex-col items-end gap-2'>
            <div className='w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors'>
              <FigmaIcon />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant='ghost' size='icon' className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <MoreHorizontal className='size-3.5 text-muted-foreground' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={handleEdit} className='gap-2 text-xs'>
                  <Edit2 className='size-3' /> Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className='gap-2 text-xs text-red-500 focus:text-red-500'>
                  <Trash2 className='size-3' /> Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Divider + Stats */}
        <div className='flex items-center justify-between pt-1 border-t border-border/50'>
          <span className='text-sm font-medium text-foreground'>
            {project.tasks.length}
            <span className='font-normal text-muted-foreground'> tasks</span>
          </span>
          <span className='text-xs text-muted-foreground'>
            {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function FigmaIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 38 57' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z' fill='#1ABCFE' />
      <path d='M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 1 1 0 47.5z' fill='#0ACF83' />
      <path d='M19 0v19h9.5A9.5 9.5 0 0 0 19 0z' fill='#FF7262' />
      <path d='M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z' fill='#F24E1E' />
      <path d='M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z' fill='#FF7262' />
    </svg>
  )
}
