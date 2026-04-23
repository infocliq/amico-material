import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getUsers, getRoles } from '@/lib/auth-service'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { RoleCards } from './components/role-cards'
import { type User } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  const isLoading = usersLoading || rolesLoading

  // Map UserProfile to the User schema expected by the table
  const tableData: User[] = useMemo(() => {
    try {
      return (users || []).map((u) => ({
        id: u.uid,
        firstName: u.displayName?.split(' ')[0] || '',
        lastName: u.displayName?.split(' ').slice(1).join(' ') || '',
        username: u.displayName || u.email.split('@')[0],
        email: u.email,
        phoneNumber: u.phoneNumber || '',
        status: (u.isActive ? 'active' : 'inactive') as User['status'],
        role: u.role as any,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      }))
    } catch (err) {
      console.error('Error mapping user data:', err)
      return []
    }
  }, [users])

  return (
    <UsersProvider>
      <Header fixed shadow>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <RoleCards users={tableData} roles={roles || []} />

        <div className='flex flex-wrap items-end justify-between gap-2 border-t pt-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {!isLoading && (
          <UsersTable data={tableData} search={search} navigate={navigate} />
        )}
        {isLoading && (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-muted-foreground'>Loading users...</p>
          </div>
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
