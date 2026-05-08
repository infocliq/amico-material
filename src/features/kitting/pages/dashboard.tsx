import { LayoutDashboard, AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export default function KittingDashboard() {
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

      <Main fluid className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Kitting Dashboard</h2>
            <p className='text-sm text-muted-foreground'>
              7 May 2026 · All projects overview
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Active projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-primary'>12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pcs in storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>847</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>WOs starting this week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-orange-500'>3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Discrepancies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-500'>0</div>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Urgent — starting within 7 days</h3>
              <Badge variant='outline' className='bg-orange-500/10 text-orange-500 border-orange-500/20'>
                3 WOs
              </Badge>
            </div>
            
            <div className='space-y-3'>
              <div className='flex items-start gap-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4'>
                <AlertCircle className='mt-1 h-5 w-5 text-red-500 shrink-0' />
                <div className='flex-1 space-y-1'>
                  <div className='font-semibold'>WO-03 · SO-2024-081</div>
                  <p className='text-xs text-muted-foreground'>
                    Unit 3 — Switchgear · Starts <span className='font-bold text-red-500 uppercase'>2 days</span>
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Bin A-1-1-01 · 24 pcs RCP-4420-B
                  </p>
                </div>
                <Button variant='outline' size='sm' className='text-xs h-7'>Pick list</Button>
              </div>

              <div className='flex items-start gap-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4'>
                <AlertCircle className='mt-1 h-5 w-5 text-orange-500 shrink-0' />
                <div className='flex-1 space-y-1'>
                  <div className='font-semibold'>WO-01 · SO-2024-091</div>
                  <p className='text-xs text-muted-foreground'>
                    Unit 1 — Panel install · Starts <span className='font-bold text-orange-500 uppercase'>5 days</span>
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Bin A-1-1-02 · 6 pcs RCP-2210-A
                  </p>
                </div>
                <Button variant='outline' size='sm' className='text-xs h-7'>Pick list</Button>
              </div>

              <div className='flex items-start gap-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4'>
                <AlertCircle className='mt-1 h-5 w-5 text-orange-500 shrink-0' />
                <div className='flex-1 space-y-1'>
                  <div className='font-semibold'>WO-08 · SO-2024-073</div>
                  <p className='text-xs text-muted-foreground'>
                    Unit 8 — Conduit · Starts <span className='font-bold text-orange-500 uppercase'>7 days</span>
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Bins B-2-1-01, B-2-1-02 · 64 pcs
                  </p>
                </div>
                <Button variant='outline' size='sm' className='text-xs h-7'>Pick list</Button>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Storage by zone</h3>
            <Card>
              <CardContent className='p-4 space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-bold text-green-500 uppercase tracking-wider'>Zone A — Active (within 3 months)</span>
                    <span className='font-bold'>94 pcs</span>
                  </div>
                  <div className='flex justify-between text-[10px] text-muted-foreground mb-1'>
                    <span>6 bins occupied</span>
                  </div>
                  <Progress value={62} className='h-1.5' />
                  <p className='text-[10px] text-muted-foreground'>62% of Zone A capacity used</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-bold text-orange-500 uppercase tracking-wider'>Zone B — Future (3 months–2 years)</span>
                    <span className='font-bold'>421 pcs</span>
                  </div>
                  <div className='flex justify-between text-[10px] text-muted-foreground mb-1'>
                    <span>14 bins occupied</span>
                  </div>
                  <Progress value={47} className='h-1.5' />
                  <p className='text-[10px] text-muted-foreground'>47% of Zone B capacity used</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-bold text-red-500 uppercase tracking-wider'>Zone C — Long-term (2+ years)</span>
                    <span className='font-bold'>332 pcs</span>
                  </div>
                  <div className='flex justify-between text-[10px] text-muted-foreground mb-1'>
                    <span>8 bins occupied</span>
                  </div>
                  <Progress value={33} className='h-1.5' />
                  <p className='text-[10px] text-muted-foreground'>33% of Zone C capacity used</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='font-semibold'>Recent activity</h3>
          <Card>
            <CardContent className='p-6'>
              <div className='relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border'>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-green-500' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>Today 09:14</p>
                  <p className='text-sm font-semibold'>48 pcs received — SO-2024-081 · WO-07</p>
                  <p className='text-xs text-muted-foreground'>Bin B-1-2-01 assigned · J. Santos</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-primary' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>Today 08:50</p>
                  <p className='text-sm font-semibold'>Pick list generated — WO-03</p>
                  <p className='text-xs text-muted-foreground'>3 lines · 24 pcs · M. Reyes</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-orange-500' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>Yesterday 16:22</p>
                  <p className='text-sm font-semibold'>WO-02 closed — SO-2024-081</p>
                  <p className='text-xs text-muted-foreground'>24/24 issued · no discrepancies · R. Cruz</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-muted' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>Yesterday 14:05</p>
                  <p className='text-sm font-semibold'>Alert acknowledged — WO-03 starts in 3 days</p>
                  <p className='text-xs text-muted-foreground'>M. Reyes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
