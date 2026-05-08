import { MapPin, Info } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function KittingStorageMap() {
  const zones = [
    {
      id: 'a',
      title: 'Zone A — Active · starts within 3 months',
      color: 'border-green-500/20 bg-green-500/5',
      labelColor: 'text-green-500',
      bins: [
        { id: 'A-1-1-01', wo: 'WO-03', detail: '24 pcs · RCP-4420-B', status: 'In storage', type: 'storage' },
        { id: 'A-1-1-02', wo: 'WO-01', detail: '6 pcs · RCP-2210-A', status: 'In storage', type: 'storage' },
        { id: 'A-1-1-03', wo: 'WO-01', detail: '4 pcs · CVR-0080-C', status: 'In storage', type: 'storage' },
        { id: 'A-1-2-01', empty: true },
        { id: 'A-1-2-02', empty: true },
        { id: 'A-2-1-01', empty: true },
      ]
    },
    {
      id: 'b',
      title: 'Zone B — Future · 3 months to 2 years',
      color: 'border-orange-500/20 bg-orange-500/5',
      labelColor: 'text-orange-500',
      bins: [
        { id: 'B-1-2-01', wo: 'WO-07', detail: '48 pcs · RCP-4420-B', status: 'Jan 2027', type: 'future' },
        { id: 'B-1-2-03', wo: 'WO-05', detail: '300 pcs · RCP-4420-B', status: 'Aug 2026', type: 'future' },
        { id: 'B-2-1-01', wo: 'WO-08', detail: '64 pcs · CVR-0080-C', status: 'May 2026', type: 'future' },
        { id: 'B-2-1-02', empty: true },
        { id: 'B-2-2-01', empty: true },
      ]
    },
    {
      id: 'c',
      title: 'Zone C — Long-term · 2+ years',
      color: 'border-red-500/20 bg-red-500/5',
      labelColor: 'text-red-500',
      bins: [
        { id: 'C-2-1-01', wo: 'WO-10', detail: '72 pcs · RCP-6610-A', status: 'Mar 2028', type: 'long' },
        { id: 'C-2-1-02', empty: true },
        { id: 'C-2-2-01', empty: true },
      ]
    }
  ]

  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Storage Map</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Storage Map</h2>
            <p className='text-sm text-muted-foreground'>
              Visual bin layout — click any bin to view contents
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          {zones.map((zone) => (
            <div key={zone.id} className={cn('rounded-xl border p-4 sm:p-6', zone.color)}>
              <h3 className={cn('text-[10px] font-bold uppercase tracking-widest mb-4', zone.labelColor)}>
                {zone.title}
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
                {zone.bins.map((bin, i) => (
                  <Card 
                    key={i} 
                    className={cn(
                      'group relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 cursor-pointer',
                      bin.empty ? 'border-dashed opacity-40 bg-transparent' : 'bg-background'
                    )}
                  >
                    <CardContent className='p-3 space-y-1.5'>
                      <div className='text-[10px] font-bold font-mono text-cyan-600 uppercase tracking-tighter'>
                        {bin.id}
                      </div>
                      {!bin.empty ? (
                        <>
                          <div className='text-[11px] font-bold truncate'>{bin.wo}</div>
                          <div className='text-[9px] text-muted-foreground truncate'>{bin.detail}</div>
                          <div className='pt-1'>
                            <Badge variant='outline' className={cn(
                              'text-[8px] h-3.5 px-1 py-0 uppercase font-bold border-0',
                              bin.type === 'storage' ? 'bg-primary/10 text-primary' :
                              bin.type === 'future' ? 'bg-orange-500/10 text-orange-500' :
                              'bg-red-500/10 text-red-500'
                            )}>
                              {bin.status}
                            </Badge>
                          </div>
                        </>
                      ) : (
                        <div className='text-[10px] text-muted-foreground italic py-4'>Empty</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Main>
    </>
  )
}
