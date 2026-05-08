import { Scan, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

export default function KittingIssue() {
  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Issue / Scan Out</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Issue / Scan Out</h2>
            <p className='text-sm text-muted-foreground'>
              Scan receptacles out to a Work Order
            </p>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Select Work Order</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-2'>
                  <Label>Work Order</Label>
                  <Select defaultValue='wo3'>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='wo3'>WO-03 — SO-2024-081 (due 9 May)</SelectItem>
                      <SelectItem value='wo1'>WO-01 — SO-2024-091 (due 12 May)</SelectItem>
                      <SelectItem value='wo8'>WO-08 — SO-2024-073 (due 14 May)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-xs'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 shrink-0' />
                  <div>All 3 bins located and ready to pick</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Scan confirmation</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-muted/30 text-center gap-3'>
                  <Scan className='size-10 text-muted-foreground' />
                  <div className='text-sm text-muted-foreground'>
                    Point camera at QR label to scan<br />or enter manually below
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label>Manual entry</Label>
                  <Input placeholder='Scan or type part number...' />
                </div>
                <div className='divide-y border rounded-lg overflow-hidden bg-background'>
                  <div className='flex items-center gap-4 p-3'>
                    <span className='text-[10px] font-bold font-mono text-muted-foreground min-w-[60px] uppercase'>A-1-1-01</span>
                    <span className='flex-1 text-xs font-bold truncate'>RCP-4420-B</span>
                    <span className='text-xs font-bold text-green-500'>✓ 18 pcs</span>
                  </div>
                  <div className='flex items-center gap-4 p-3'>
                    <span className='text-[10px] font-bold font-mono text-muted-foreground min-w-[60px] uppercase'>A-1-1-02</span>
                    <span className='flex-1 text-xs font-bold truncate'>RCP-2210-A</span>
                    <span className='text-xs font-bold text-green-500'>✓ 4 pcs</span>
                  </div>
                  <div className='flex items-center gap-4 p-3'>
                    <span className='text-[10px] font-bold font-mono text-muted-foreground min-w-[60px] uppercase'>A-1-2-01</span>
                    <span className='flex-1 text-xs font-bold truncate'>CVR-0080-C</span>
                    <span className='text-xs font-bold text-muted-foreground'>— pending</span>
                  </div>
                </div>
                <Button className='w-full bg-green-600 hover:bg-green-700'>Confirm & close WO-03</Button>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='font-semibold'>Issue summary</h3>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <div className='space-y-3 divide-y'>
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-xs text-muted-foreground'>Expected</span>
                      <span className='font-bold'>24 pcs</span>
                    </div>
                    <div className='flex justify-between items-center py-2 pt-4'>
                      <span className='text-xs text-muted-foreground'>Scanned</span>
                      <span className='font-bold text-green-500'>22 pcs</span>
                    </div>
                    <div className='flex justify-between items-center py-2 pt-4'>
                      <span className='text-xs text-muted-foreground'>Remaining</span>
                      <span className='font-bold text-orange-500'>2 pcs</span>
                    </div>
                  </div>
                  
                  <Progress value={91} className='h-2 bg-muted' />

                  <div className='flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 text-xs mt-4'>
                    <AlertTriangle className='h-5 w-5 text-orange-500 shrink-0' />
                    <div>2 pcs not yet scanned. Confirm shortage or continue scanning.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
