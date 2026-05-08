import { PackagePlus, QrCode, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function KittingReceive() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Receive Receptacles</h2>
            <p className='text-sm text-muted-foreground'>
              Register incoming goods and assign bin locations
            </p>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Delivery details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='recv-so'>Sales Order number</Label>
                  <Input id='recv-so' placeholder='SO-2024-081' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label>Work Order</Label>
                    <Select defaultValue='WO-07'>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='WO-07'>WO-07</SelectItem>
                        <SelectItem value='WO-08'>WO-08</SelectItem>
                        <SelectItem value='WO-09'>WO-09</SelectItem>
                        <SelectItem value='WO-10'>WO-10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='recv-ps'>Packing slip #</Label>
                    <Input id='recv-ps' placeholder='PS-8841' />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='recv-part'>Part number</Label>
                  <Input id='recv-part' placeholder='RCP-4420-B' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='recv-qty'>Quantity received</Label>
                    <Input id='recv-qty' type='number' placeholder='48' />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='recv-date'>Planned start date</Label>
                    <Input id='recv-date' type='date' />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='recv-notes'>Notes (optional)</Label>
                  <Textarea id='recv-notes' placeholder='Any remarks about this delivery...' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>Suggested bin</h3>
                  <Badge className='bg-primary/10 text-primary border-primary/20 hover:bg-primary/10'>
                    Auto-assigned
                  </Badge>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-4xl font-bold font-mono text-cyan-500'>B-1-2-01</div>
                  <div className='text-xs text-muted-foreground'>
                    Zone B · Row 1 · Shelf 2 · Bin 01
                    <br />
                    Currently empty · correct zone for start date
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button className='flex-1'>Confirm & Print label</Button>
                  <Button variant='outline'>Change bin</Button>
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
                  <Button variant='outline' className='w-full mt-4'>Print label</Button>
                </CardContent>
              </Card>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold'>Receiving checklist</h3>
              <Card>
                <CardContent className='p-4 divide-y'>
                  {[
                    'Verify part number matches packing slip',
                    'Count quantity — matches order?',
                    'Check for damage',
                    'Label printed and applied to box',
                    'Box placed in correct bin'
                  ].map((item, i) => (
                    <div key={i} className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
                      <div className='size-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors'>
                        {/* Checkmark could be here */}
                      </div>
                      <span className='text-sm'>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
