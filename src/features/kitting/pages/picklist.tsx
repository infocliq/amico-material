import { ListChecks, Printer, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export default function KittingPickList() {
  const pickLines = [
    { bin: 'A-1-1-01', part: 'RCP-4420-B', desc: '20A receptacle, panel-mount', qty: '18 pcs' },
    { bin: 'A-1-1-02', part: 'RCP-2210-A', desc: '10A receptacle, surface', qty: '4 pcs' },
    { bin: 'A-1-2-01', part: 'CVR-0080-C', desc: 'Weatherproof cover plate', qty: '2 pcs' },
  ]

  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Pick Lists</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Pick Lists</h2>
            <p className='text-sm text-muted-foreground'>
              Generate and manage picking for Work Orders
            </p>
          </div>
          <Button>Generate pick list</Button>
        </div>

        <Card>
          <CardContent className='p-6 space-y-6'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-lg font-bold'>WO-03 · SO-2024-081</h3>
                  <Badge className='bg-orange-500/10 text-orange-500 border-orange-500/20'>
                    Starts in 2 days
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Unit 3 — Switchgear installation · Starts 9 May 2026
                </p>
              </div>
            </div>

            <div className='flex items-center gap-4 bg-muted/30 p-3 rounded-lg border'>
              <div className='text-xs font-medium'>3 lines · 24 pcs total</div>
              <div className='flex-1'>
                <Progress value={0} className='h-1.5' />
              </div>
              <div className='text-xs font-mono font-bold'>0 / 3 picked</div>
            </div>

            <div className='divide-y border rounded-lg overflow-hidden bg-background'>
              {pickLines.map((line, i) => (
                <div key={i} className='flex items-center gap-4 p-4 group hover:bg-muted/50 transition-colors'>
                  <div className='size-6 rounded border-2 border-muted-foreground/30 flex items-center justify-center cursor-pointer group-hover:border-primary transition-colors'>
                  </div>
                  <div className='w-24 shrink-0'>
                    <span className='px-2 py-0.5 rounded border bg-muted font-mono text-[10px] text-cyan-600 font-bold'>
                      {line.bin}
                    </span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-sm font-bold truncate'>{line.part}</div>
                    <div className='text-[10px] text-muted-foreground truncate'>{line.desc}</div>
                  </div>
                  <div className='text-sm font-mono font-bold whitespace-nowrap'>{line.qty}</div>
                </div>
              ))}
            </div>

            <div className='flex flex-wrap gap-3'>
              <Button variant='outline' className='gap-2'>
                <Printer className='size-4' />
                Print pick list
              </Button>
              <Button disabled variant='secondary' className='bg-green-500/10 text-green-500 border-green-500/20 opacity-50 cursor-not-allowed'>
                Confirm & Issue WO-03
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
