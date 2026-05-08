import { Printer, QrCode, History } from 'lucide-react'
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

export default function KittingLabelPrinter() {
  return (
    <>
      <Header fixed shadow>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold tracking-tight'>Label Printer</h2>
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
            <h2 className='text-2xl font-bold tracking-tight'>Label Printer</h2>
            <p className='text-sm text-muted-foreground'>
              Generate and reprint QR labels for any bin
            </p>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Label details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-2'>
                  <Label>Sales Order</Label>
                  <Input defaultValue='SO-2024-081' />
                </div>
                <div className='grid gap-2'>
                  <Label>Work Order</Label>
                  <Select defaultValue='wo7'>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='wo7'>WO-07</SelectItem>
                      <SelectItem value='wo3'>WO-03</SelectItem>
                      <SelectItem value='wo1'>WO-01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label>Part number</Label>
                  <Input defaultValue='RCP-4420-B' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label>Quantity</Label>
                    <Input type='number' defaultValue='48' />
                  </div>
                  <div className='grid gap-2'>
                    <Label>Bin</Label>
                    <Input defaultValue='B-1-2-01' />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label>Planned start</Label>
                    <Input type='date' defaultValue='2027-01-15' />
                  </div>
                  <div className='grid gap-2'>
                    <Label>Copies</Label>
                    <Input type='number' defaultValue='1' min='1' max='20' />
                  </div>
                </div>
                <div className='flex gap-2 pt-4'>
                  <Button className='flex-1 gap-2'>
                    <Printer className='size-4' />
                    Print label
                  </Button>
                  <Button variant='outline'>Preview</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='font-semibold'>Label preview</h3>
              <Card className='border-2 border-dashed'>
                <CardContent className='p-6'>
                  <div className='flex gap-4 items-start bg-muted/30 p-4 rounded-xl border'>
                    <div className='size-20 bg-background border flex items-center justify-center text-[10px] text-muted-foreground font-mono text-center shrink-0'>
                      QR<br />CODE
                    </div>
                    <div className='flex-1 grid grid-cols-1 gap-1 text-xs'>
                      <div className='flex gap-2'><span className='w-12 text-muted-foreground'>SO</span><span className='font-mono font-medium'>SO-2024-081</span></div>
                      <div className='flex gap-2'><span className='w-12 text-muted-foreground'>WO</span><span className='font-mono font-medium'>WO-07</span></div>
                      <div className='flex gap-2'><span className='w-12 text-muted-foreground'>Part</span><span className='font-mono font-medium'>RCP-4420-B</span></div>
                      <div className='flex gap-2'><span className='w-12 text-muted-foreground'>Qty</span><span className='font-mono font-medium'>48 pcs</span></div>
                      <div className='flex gap-2'><span className='w-12 text-muted-foreground'>Start</span><span className='font-mono font-medium'>15 Jan 2027</span></div>
                      <div className='flex gap-2'><span className='w-12 text-muted-foreground'>Bin</span><span className='font-mono font-bold text-cyan-500'>B-1-2-01</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold flex items-center gap-2'>
                <History className='size-4 text-muted-foreground' />
                Reprint history
              </h3>
              <Card>
                <CardContent className='p-6'>
                  <div className='relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border'>
                    <div className='relative pl-8'>
                      <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-muted' />
                      <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>14 Mar 2026 09:22</p>
                      <p className='text-sm font-semibold'>Original print</p>
                      <p className='text-xs text-muted-foreground'>J. Santos</p>
                    </div>
                    <div className='relative pl-8'>
                      <div className='absolute left-0 top-1.5 size-[23px] rounded-full border-4 border-background bg-muted' />
                      <p className='text-[10px] font-mono text-muted-foreground mb-0.5'>15 Mar 2026 11:05</p>
                      <p className='text-sm font-semibold text-orange-500'>Reprinted × 1</p>
                      <p className='text-xs text-muted-foreground'>Label damaged · M. Reyes</p>
                    </div>
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
