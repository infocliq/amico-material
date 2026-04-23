import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Save,
  Ellipsis,
  ChevronRight
} from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ContributionGraph } from './components/contribution-graph'

export function ManageProject() {
  const navigate = useNavigate()
  const { projectId } = useParams({ from: '/_authenticated/projects/$projectId' })

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
        <div>
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
                  Platform Migration v3
                </h2>
                <Badge variant='outline' className='rounded-full font-medium h-fit'>
                  Active
                </Badge>
              </div>
              <p className='mt-1 text-muted-foreground'>
                High-priority infrastructure modernization for core services
              </p>
            </div>
            <div className='flex gap-2 items-center'>
              <Button className='gap-1.5'>
                <Save className='size-4' />
                Save Changes
              </Button>
              <Button variant='outline' size='icon'>
                <Ellipsis className='size-5' />
              </Button>
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border bg-card'>
          <Tabs defaultValue='overview' className='w-full'>
            <div className='border-b px-4'>
              <TabsList className='bg-transparent p-0 h-9 justify-start'>
                <TabsTrigger
                  value='overview'
                  className='h-full data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 text-xs'
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value='activity'
                  className='h-full data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 text-xs'
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value='related'
                  className='h-full data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 text-xs'
                >
                  Related Items
                </TabsTrigger>
                <TabsTrigger
                  value='settings'
                  className='h-full data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 text-xs'
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='overview' className='mt-0'>
              <div className='grid lg:grid-cols-3'>
                {/* Main Content */}
                <div className='lg:col-span-2 lg:border-r'>
                  <div className='border-b'>
                    <ContributionGraph />
                  </div>

                  <div className='grid gap-0 sm:grid-cols-2'>
                    <div className='border-b px-4 py-3 sm:border-r'>
                      <p className='text-xs text-muted-foreground'>SKU / Project ID</p>
                      <p className='mt-0.5 font-mono text-xs uppercase'>{projectId}</p>
                    </div>
                    <div className='border-b px-4 py-3'>
                      <p className='text-xs text-muted-foreground'>Phase</p>
                      <p className='mt-0.5 text-sm font-medium'>Development</p>
                    </div>
                    <div className='border-b px-4 py-3 sm:border-r'>
                      <p className='text-xs text-muted-foreground'>Estimated Budget</p>
                      <p className='mt-0.5 text-sm font-medium'>$45,000.00</p>
                    </div>
                    <div className='border-b px-4 py-3'>
                      <p className='text-xs text-muted-foreground'>Team Size</p>
                      <p className='mt-0.5 text-sm font-medium'>8 Core Members</p>
                    </div>
                  </div>

                  <div className='border-b px-4 py-3'>
                    <p className='mb-1 text-xs text-muted-foreground font-medium'>Description</p>
                    <p className='text-xs text-muted-foreground leading-relaxed'>
                      Legacy monolith decomposition project. We are transitioning the core billing
                      and user management services to a microservices architecture using Node.js
                      and Go. This includes implementing a robust event bus and ensuring data
                      consistency across distributed databases.
                    </p>
                  </div>

                  <div className='px-4 py-3'>
                    <p className='mb-1.5 text-xs text-muted-foreground font-medium'>Deliverables</p>
                    <ul className='space-y-1.5'>
                      <li className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <span className='size-1 rounded-full bg-foreground'></span>
                        Microservices infrastructure setup
                      </li>
                      <li className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <span className='size-1 rounded-full bg-foreground'></span>
                        Data migration scripts execution
                      </li>
                      <li className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <span className='size-1 rounded-full bg-foreground'></span>
                        CI/CD pipeline performance audit
                      </li>
                      <li className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <span className='size-1 rounded-full bg-foreground'></span>
                        Security compliance verification (SOC2)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sidebar Metadata */}
                <div>
                  <div className='border-b px-4 py-3'>
                    <p className='mb-2 text-xs font-medium text-muted-foreground'>Metadata</p>
                    <div className='space-y-3 text-xs'>
                      <div>
                        <p className='text-muted-foreground'>Created</p>
                        <p className='font-medium'>Dec 10, 2024</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Last Modified</p>
                        <p className='font-medium'>Dec 14, 2024</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Project Lead</p>
                        <p className='font-medium'>Emma Davis</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Database Reference</p>
                        <p className='font-mono'>ref_abc123xyz_p3</p>
                      </div>
                    </div>
                  </div>

                  <div className='px-4 py-3'>
                    <p className='mb-2 text-xs font-medium text-muted-foreground'>Tags</p>
                    <div className='flex flex-wrap gap-1.5'>
                      <Badge variant='secondary' className='font-normal text-[10px]'>Infrastructure</Badge>
                      <Badge variant='secondary' className='font-normal text-[10px]'>Backend</Badge>
                      <Badge variant='secondary' className='font-normal text-[10px]'>Priority 1</Badge>
                      <Badge variant='secondary' className='font-normal text-[10px]'>Migration</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}
