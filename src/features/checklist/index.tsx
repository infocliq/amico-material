import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ChecklistTable } from './components/checklist-table'
import { ChecklistPrimaryButtons } from './components/checklist-primary-buttons'
import { ChecklistProvider } from './components/checklist-provider'
import { getChecklists } from '@/lib/checklist-service'
import { ChecklistDialogs } from './components/checklist-dialogs'

const route = getRouteApi('/_authenticated/checklist/')

export function CheckList() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: checklists, isLoading } = useQuery({
    queryKey: ['checklists'],
    queryFn: getChecklists,
  })

  return (
    <ChecklistProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Check List</h2>
            <p className='text-muted-foreground'>
              Manage your product model parts and assembly checklists.
            </p>
          </div>
          <ChecklistPrimaryButtons />
        </div>
        
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
              <p className='text-xs text-muted-foreground'>Loading checklists...</p>
            </div>
          </div>
        ) : (
          <ChecklistTable data={checklists || []} search={search} navigate={navigate} />
        )}
        <ChecklistDialogs />
      </Main>
    </ChecklistProvider>
  )
}
