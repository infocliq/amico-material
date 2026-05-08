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

export default function KittingWorkOrders() {
  const wos = [
    { id: 'WO-03', so: 'SO-2024-081', desc: 'Switchgear install', start: '9 May 2026', pcs: 24, zone: 'A', status: 'In storage', type: 'urgent' },
    { id: 'WO-01', so: 'SO-2024-091', desc: 'Panel install', start: '12 May 2026', pcs: 6, zone: 'A', status: 'In storage', type: 'warn' },
    { id: 'WO-07', so: 'SO-2024-081', desc: 'Main bus bar', start: '15 Jan 2027', pcs: 48, zone: 'B', status: 'Future', type: 'future' },
    { id: 'WO-05', so: 'SO-2024-091', desc: 'Conduit run', start: 'Aug 2026', pcs: 300, zone: 'B', status: 'Future', type: 'future' },
    { id: 'WO-10', so: 'SO-2024-081', desc: 'Final fit-out', start: 'Mar 2028', pcs: 72, zone: 'C', status: 'Long-term', type: 'long' },
    { id: 'WO-02', so: 'SO-2024-073', desc: 'Earthing', start: '2 May 2026', pcs: 18, zone: '—', status: 'Closed', type: 'closed' },
  ]

  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Work Orders</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Work Orders</h2>
            <p className='text-sm text-muted-foreground'>
              All batches across all projects
            </p>
          </div>
          <Button className='gap-2'>
            <Plus className='size-4' />
            New Work Order
          </Button>
        </div>

        <Card>
          <CardContent className='p-0 overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Sales Order</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start date</TableHead>
                  <TableHead>Pcs</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='w-[80px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wos.map((wo, i) => (
                  <TableRow key={i}>
                    <TableCell className='font-bold font-mono text-xs'>{wo.id}</TableCell>
                    <TableCell className='font-mono text-xs'>{wo.so}</TableCell>
                    <TableCell className='text-xs'>{wo.desc}</TableCell>
                    <TableCell className={cn(
                      'text-xs font-bold',
                      wo.type === 'urgent' ? 'text-red-500' : wo.type === 'warn' ? 'text-orange-500' : ''
                    )}>
                      {wo.start}
                    </TableCell>
                    <TableCell className='font-bold'>{wo.pcs}</TableCell>
                    <TableCell>
                      <span className='px-2 py-0.5 rounded border bg-muted font-mono text-[10px] text-cyan-600 font-bold'>
                        {wo.zone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className={cn(
                        'text-[10px] uppercase font-bold py-0 h-5',
                        wo.type === 'urgent' || wo.type === 'warn' ? 'bg-primary/10 text-primary border-primary/20' :
                        wo.type === 'future' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        wo.type === 'long' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-muted/10 text-muted-foreground border-muted/20'
                      )}>
                        {wo.status}
                      </Badge>
                    </TableCell>
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
