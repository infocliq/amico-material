import { useState } from 'react'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getProjects } from '@/lib/projects-service'
import { ProjectsTable } from './components/projects-table'
import { ProjectsKanban } from './components/projects-kanban'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { type Project } from './data/schema'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = getRouteApi('/_authenticated/projects/')

export function Projects() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [view, setView] = useState<'table' | 'kanban'>('table')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

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
        <div className='flex flex-wrap items-end justify-between gap-2 border-b pb-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Manage and track your design projects across different stages.
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className='w-full'>
              <TabsList className='grid h-9 w-[200px] grid-cols-2'>
                <TabsTrigger value='table' className='text-xs gap-2'>
                  <TableIcon className='size-3.5' /> Table
                </TabsTrigger>
                <TabsTrigger value='kanban' className='text-xs gap-2'>
                  <LayoutGrid className='size-3.5' /> Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ProjectsPrimaryButtons />
          </div>
        </div>
        
        {!isLoading && projects && (
          <div className='flex flex-1 flex-col'>
            {view === 'table' ? (
              <ProjectsTable data={projects as unknown as Project[]} search={search} navigate={navigate} />
            ) : (
              <ProjectsKanban data={projects as unknown as Project[]} />
            )}
          </div>
        )}
        
        {isLoading && (
          <div className='flex flex-1 items-center justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
              <p className='text-xs text-muted-foreground'>Loading projects...</p>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
