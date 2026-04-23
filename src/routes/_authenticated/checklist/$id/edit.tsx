import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getChecklist } from '@/lib/checklist-service'
import { ChecklistForm } from '@/features/checklist/components/checklist-form'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/checklist/$id/edit')({
  component: ChecklistEditPage,
})

function ChecklistEditPage() {
  const { id } = Route.useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['checklist', id],
    queryFn: () => getChecklist(id),
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
      <Main>
        <div className='py-6'>
          {isLoading && (
            <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-destructive">Error loading checklist</h2>
              <p className="text-muted-foreground mt-2">{(error as any).message}</p>
            </div>
          )}
          {data && <ChecklistForm initialData={data} isEdit />}
        </div>
      </Main>
    </>
  )
}
