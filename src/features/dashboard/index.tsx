import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>
        <div className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <div className='flex gap-2 p-1 bg-muted/20 rounded-lg w-max'>
               <Skeleton className="h-8 w-[100px]" />
               <Skeleton className="h-8 w-[100px]" />
               <Skeleton className="h-8 w-[100px]" />
            </div>
          </div>
          
          <div className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-[120px] mb-2" />
                    <Skeleton className="h-3 w-[80px]" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <Skeleton className="h-6 w-[150px]" />
                </CardHeader>
                <CardContent className='ps-2 flex flex-col gap-4'>
                   <div className="flex items-end gap-2 h-[200px]">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton 
                          key={i} 
                          className="w-full" 
                          style={{ height: `${Math.floor(Math.random() * 80) + 20}%` }} 
                        />
                      ))}
                   </div>
                   <div className="flex justify-between">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-10" />
                      ))}
                   </div>
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <Skeleton className="h-6 w-[180px]" />
                </CardHeader>
                <CardContent className="space-y-6">
                   {Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2 flex-1">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-3 w-2/3" />
                        </div>
                     </div>
                   ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
