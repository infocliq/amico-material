import { History, FileDown } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function KittingAuditTrail() {
  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Audit Trail</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Audit Trail</h2>
            <p className='text-sm text-muted-foreground'>
              Full history for every Work Order
            </p>
          </div>
          <div className='flex gap-2'>
            <Select defaultValue='all'>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select Work Order' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All work orders</SelectItem>
                <SelectItem value='wo3'>WO-03</SelectItem>
                <SelectItem value='wo2'>WO-02</SelectItem>
                <SelectItem value='wo1'>WO-01</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='outline' size='icon'>
              <FileDown className='size-4' />
            </Button>
          </div>
        </div>

        <div className='grid gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0'>
              <div className='space-y-1'>
                <CardTitle className='text-lg font-bold'>WO-03 audit trail</CardTitle>
                <p className='text-xs text-muted-foreground'>SO-2024-081 · Unit 3 — Switchgear installation</p>
              </div>
              <Badge variant='outline' className='bg-primary/10 text-primary border-primary/20 uppercase font-bold text-[10px]'>
                In progress
              </Badge>
            </CardHeader>
            <CardContent className='pt-6 space-y-6'>
              <div className='grid grid-cols-3 gap-4'>
                <Card className='bg-muted/30'>
                  <CardContent className='p-4 text-center'>
                    <div className='text-xl font-bold'>24</div>
                    <div className='text-[10px] text-muted-foreground uppercase font-bold mt-1'>Pcs received</div>
                  </CardContent>
                </Card>
                <Card className='bg-muted/30'>
                  <CardContent className='p-4 text-center'>
                    <div className='text-xl font-bold text-green-500'>0</div>
                    <div className='text-[10px] text-muted-foreground uppercase font-bold mt-1'>Issued so far</div>
                  </CardContent>
                </Card>
                <Card className='bg-muted/30'>
                  <CardContent className='p-4 text-center'>
                    <div className='text-xl font-bold'>54</div>
                    <div className='text-[10px] text-muted-foreground uppercase font-bold mt-1'>Days in storage</div>
                  </CardContent>
                </Card>
              </div>

              <div className='relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border'>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-primary' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>14 Mar 2026 09:14</p>
                  <p className='text-sm font-semibold'>Receptacles received</p>
                  <p className='text-xs text-muted-foreground'>48 pcs · RCP-4420-B · Packing slip PS-8841 · J. Santos</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-primary' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>14 Mar 2026 09:22</p>
                  <p className='text-sm font-semibold'>QR label printed & bin assigned</p>
                  <p className='text-xs text-muted-foreground'>Bin A-1-1-01 · label × 1 · J. Santos</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-muted' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>9 Apr 2026 08:00</p>
                  <p className='text-sm font-semibold'>30-day alert triggered</p>
                  <p className='text-xs text-muted-foreground'>Dashboard alert shown · acknowledged M. Reyes</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-primary' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>7 May 2026 07:55</p>
                  <p className='text-sm font-semibold'>Pick list generated</p>
                  <p className='text-xs text-muted-foreground'>3 lines · 24 pcs · M. Reyes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0'>
              <div className='space-y-1'>
                <CardTitle className='text-lg font-bold'>WO-02 audit trail</CardTitle>
                <p className='text-xs text-muted-foreground'>SO-2024-073 · Completed</p>
              </div>
              <Badge variant='outline' className='bg-muted/10 text-muted-foreground border-muted/20 uppercase font-bold text-[10px]'>
                Closed
              </Badge>
            </CardHeader>
            <CardContent className='pt-6 space-y-6'>
              <div className='relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border'>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-primary' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>1 Feb 2026</p>
                  <p className='text-sm font-semibold'>Received 18 pcs RCP-2210-A · Bin A-1-1-04</p>
                  <p className='text-xs text-muted-foreground'>J. Santos</p>
                </div>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-green-500' />
                  <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>2 May 2026</p>
                  <p className='text-sm font-semibold'>Issued 18/18 pcs — no discrepancies</p>
                  <p className='text-xs text-muted-foreground'>R. Cruz</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
