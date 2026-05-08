import { Search, MoreHorizontal } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { cn } from '@/lib/utils'

export default function KittingInventory() {
  const inventoryItems = [
    { so: 'SO-2024-081', wo: 'WO-03', part: 'RCP-4420-B', qty: 24, bin: 'A-1-1-01', start: '9 May 2026', status: 'In storage', badge: 'bg-primary/10 text-primary border-primary/20' },
    { so: 'SO-2024-091', wo: 'WO-01', part: 'RCP-2210-A', qty: 6, bin: 'A-1-1-02', start: '12 May 2026', status: 'In storage', badge: 'bg-primary/10 text-primary border-primary/20' },
    { so: 'SO-2024-073', wo: 'WO-08', part: 'CVR-0080-C', qty: 64, bin: 'B-2-1-01', start: '14 May 2026', status: 'Future', badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    { so: 'SO-2024-081', wo: 'WO-07', part: 'RCP-4420-B', qty: 48, bin: 'B-1-2-01', start: '15 Jan 2027', status: 'Future', badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    { so: 'SO-2024-081', wo: 'WO-10', part: 'RCP-6610-A', qty: 72, bin: 'C-2-1-01', start: 'Mar 2028', status: 'Long-term', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { so: 'SO-2024-091', wo: 'WO-05', part: 'RCP-4420-B', qty: 300, bin: 'B-1-2-03', start: 'Aug 2026', status: 'Future', badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  ]

  return (
    <div className='flex flex-col min-h-screen'>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Inventory</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Inventory</h2>
            <p className='text-sm text-muted-foreground'>
              All receptacles in storage
            </p>
          </div>
          <Button>+ Receive goods</Button>
        </div>

        <Card>
          <CardContent className='p-4 space-y-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='relative flex-1 min-w-[200px]'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input placeholder='Search by SO, WO, part number, bin...' className='pl-9' />
              </div>
              <Select defaultValue='all'>
                <SelectTrigger className='w-[160px]'>
                  <SelectValue placeholder='All zones' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All zones</SelectItem>
                  <SelectItem value='a'>Zone A</SelectItem>
                  <SelectItem value='b'>Zone B</SelectItem>
                  <SelectItem value='c'>Zone C</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue='all'>
                <SelectTrigger className='w-[160px]'>
                  <SelectValue placeholder='All statuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All statuses</SelectItem>
                  <SelectItem value='storage'>In storage</SelectItem>
                  <SelectItem value='issued'>Issued</SelectItem>
                  <SelectItem value='closed'>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='rounded-md border overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sales Order</TableHead>
                    <TableHead>Work Order</TableHead>
                    <TableHead>Part number</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Bin</TableHead>
                    <TableHead>Start date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='w-[80px]'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className='font-bold font-mono text-xs'>{item.so}</TableCell>
                      <TableCell className='font-mono text-xs'>{item.wo}</TableCell>
                      <TableCell className='font-mono text-xs'>{item.part}</TableCell>
                      <TableCell className='font-bold'>{item.qty}</TableCell>
                      <TableCell>
                        <span className='px-2 py-0.5 rounded border bg-muted font-mono text-[10px] text-cyan-600 font-bold'>
                          {item.bin}
                        </span>
                      </TableCell>
                      <TableCell className='text-xs'>{item.start}</TableCell>
                      <TableCell>
                        <Badge variant='outline' className={cn('text-[10px] uppercase font-bold py-0 h-5', item.badge)}>
                          {item.status}
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
            </div>
          </CardContent>
        </Card>
      </Main>
    </div>
  )
}
