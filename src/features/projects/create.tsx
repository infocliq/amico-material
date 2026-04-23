import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createProject } from '@/lib/projects-service'
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
import { ArrowLeft, Ellipsis, Save, Loader2 } from 'lucide-react'
import { ProjectForm, ProjectFormValues, projectFormSchema } from './components/project-form'

export function CreateProject() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<ProjectFormValues, any, any>({
    resolver: zodResolver(projectFormSchema) as any,
    defaultValues: {
      salesOrder: '',
      workOrder: '',
      name: '',
      quantity: 1,
      drawing: '',
      productType: '',
      status: 'none',
      shipDate: undefined,
      productionStart: undefined,
      supportStart: undefined,
    },
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully!')
      navigate({ to: '/projects' })
    },
    onError: (error) => {
      console.error('Snapshot error:', error)
      toast.error('Failed to create project. Please try again.')
    }
  })

  const onSubmit = (values: ProjectFormValues) => {
    createMutation.mutate(values as any)
  }

  const isSubmitting = createMutation.isPending

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
        {/* Top Navigation & Title Row */}
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
                  New Project
                </h2>
                <Badge variant='outline' className='rounded-full font-medium h-fit'>
                  Draft
                </Badge>
              </div>
              <p className='mt-1 text-muted-foreground'>
                Configure your new project workspace and deployment settings.
              </p>
            </div>
            <div className='flex gap-2 items-center'>
              <Button
                size='sm'
                className='gap-2 px-6'
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : <Save className='size-4' />}
                {isSubmitting ? 'Creating...' : 'Create Project'}
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
