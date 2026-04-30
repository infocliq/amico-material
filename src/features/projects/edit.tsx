import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { getProject, updateProject } from '@/lib/projects-service'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Ellipsis, Loader2, Save } from 'lucide-react'
import { ProjectForm, ProjectFormValues, projectFormSchema } from './components/project-form'
import { useEffect } from 'react'

export function EditProject() {
  const navigate = useNavigate()
  const { projectId } = useParams({ from: '/_authenticated/projects/$projectId/edit' })
  const queryClient = useQueryClient()

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProject(projectId),
  })

  const form = useForm<ProjectFormValues, any, any>({
    resolver: zodResolver(projectFormSchema) as any,
  })

  useEffect(() => {
    if (project) {
      form.reset({
        ...project,
        asBuiltDate: project.asBuiltDate ? new Date(project.asBuiltDate) : undefined,
        shipDate: project.shipDate ? new Date(project.shipDate) : undefined,
        productionStart: project.productionStart ? new Date(project.productionStart) : undefined,
        productionEnd: project.productionEnd ? new Date(project.productionEnd) : undefined,
        supportStart: project.supportStart ? new Date(project.supportStart) : undefined,
      } as any)
    }
  }, [project, form])

  const updateMutation = useMutation({
    mutationFn: (values: ProjectFormValues) => updateProject(projectId, values as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      toast.success('Project updated successfully!')
      navigate({ to: '/projects' })
    },
    onError: (err) => {
      console.error('Update error:', err)
      toast.error('Failed to update project.')
    }
  })

  const onSubmit = (values: ProjectFormValues) => {
    updateMutation.mutate(values)
  }

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className='flex h-screen items-center justify-center text-red-500'>
        Error loading project details.
      </div>
    )
  }

  const isSaving = updateMutation.isPending

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
        <div className='mx-auto w-full max-w-4xl pb-4'>
          <Button
            variant='ghost'
            size='sm'
            className='mb-3 h-7 gap-1 px-2 text-xs -ml-2'
            onClick={() => navigate({ to: '/projects' })}
          >
            <ArrowLeft className='size-3' />
            Back to Projects
          </Button>

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-3xl font-bold tracking-tight'>
                  Edit Project
                </h2>
                <Badge variant='outline' className='rounded-full font-medium h-fit capitalize'>
                  {project.status}
                </Badge>
              </div>
              <p className='mt-1 text-muted-foreground'>
                Update project details and configuration.
              </p>
            </div>
            <div className='flex gap-2 items-center'>
              <Button
                size='sm'
                className='gap-2 px-6'
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className='size-4 animate-spin' /> : <Save className='size-4' />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant='outline' size='sm' className='h-8 w-8'>
                <Ellipsis className='size-5' />
              </Button>
            </div>
          </div>
        </div>

        <ProjectForm 
          form={form}
          onSubmit={onSubmit}
        />
      </Main>
    </>
  )
}
