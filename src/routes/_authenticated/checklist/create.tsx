import { createFileRoute } from '@tanstack/react-router'
import { ChecklistForm } from '@/features/checklist/components/checklist-form'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'

export const Route = createFileRoute('/_authenticated/checklist/create')({
  component: ChecklistCreatePage,
})

function ChecklistCreatePage() {
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
          <ChecklistForm />
        </div>
      </Main>
    </>
  )
}
