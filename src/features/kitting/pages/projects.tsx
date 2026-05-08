import { Plus, MoreHorizontal } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export default function KittingProjects() {
  const projects = [
    { so: 'SO-2024-081', name: 'Substation Alpha', client: 'GridTech Inc.', wos: 10, status: 'Active', pcs: 144 },
    { so: 'SO-2024-091', name: 'Industrial Park B', client: 'Nova Build', wos: 8, status: 'Active', pcs: 306 },
    { so: 'SO-2024-073', name: 'Riverside Office', client: 'Apex Contractors', wos: 5, status: 'In progress', pcs: 64 },
  ]

  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Projects / SO</h2>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fluid className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects / Sales Orders</h2>
            <p className='text-sm text-muted-foreground'>
              Register and manage projects
            </p>
          </div>
          <Button className='gap-2'>
            <Plus className='size-4' />
            New project
          </Button>
        </div>

        <Card>
          <CardContent className='p-0 overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sales Order</TableHead>
                  <TableHead>Project name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Work Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pcs in storage</TableHead>
                  <TableHead className='w-[80px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project, i) => (
                  <TableRow key={i}>
                    <TableCell className='font-bold font-mono text-xs'>{project.so}</TableCell>
                    <TableCell className='font-medium'>{project.name}</TableCell>
                    <TableCell className='text-xs'>{project.client}</TableCell>
                    <TableCell>{project.wos}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className={cn(
                        'text-[10px] uppercase font-bold py-0 h-5',
                        project.status === 'Active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      )}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-bold'>{project.pcs}</TableCell>
                    <TableCell>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
