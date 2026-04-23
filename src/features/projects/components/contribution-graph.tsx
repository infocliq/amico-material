import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const shades = [
  'bg-[#ebedf0]', // Empty
  'bg-[#9be9a8]', // Low
  'bg-[#40c463]', // Mid-Low
  'bg-[#30a14e]', // Mid-High
  'bg-[#216e39]'  // High
]

export function ContributionGraph() {
  const weeks = 53
  const days = 7

  return (
    <div className='w-full p-6'>
      <div className='flex items-center justify-between mb-2 px-1'>
        <h3 className='text-base font-medium text-foreground'>3,936 contributions in 2022</h3>
        <Button variant='outline' size='sm' className='h-7 gap-1 px-3 text-[11px] font-normal text-muted-foreground bg-background hover:bg-muted/50'>
          Contribution settings <ChevronDown className='size-3' />
        </Button>
      </div>

      <div className='rounded-lg border bg-background p-4'>
        <div className='flex gap-1'>
          {/* Day Labels Column */}
          <div className='flex flex-col justify-start pt-[18px] mr-1 text-[9px] text-muted-foreground leading-none h-full'>
            <div className='h-[11px] flex items-center mb-[4px]'></div>
            <div className='h-[11px] flex items-center mb-[4px]'>Mon</div>
            <div className='h-[11px] flex items-center mb-[4px]'></div>
            <div className='h-[11px] flex items-center mb-[4px]'>Wed</div>
            <div className='h-[11px] flex items-center mb-[4px]'></div>
            <div className='h-[11px] flex items-center mb-[4px]'>Fri</div>
            <div className='h-[11px] flex items-center'></div>
          </div>

          <div className='flex-1 flex flex-col'>
            {/* Month Labels Row */}
            <div className='flex text-[9px] text-muted-foreground mb-[6px]'>
              <div className='flex-1 flex justify-between px-2'>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

            {/* Contribution Grid */}
            <div className='flex gap-[3px] overflow-hidden'>
              {Array.from({ length: weeks }).map((_, i) => (
                <div key={i} className='flex flex-col gap-[3px]'>
                  {Array.from({ length: days }).map((_, j) => {
                    const hasActivity = Math.random() > 0.2
                    const shade = hasActivity 
                      ? shades[Math.floor(Math.random() * (shades.length - 1)) + 1] 
                      : shades[0]
                    return (
                      <div
                        key={j}
                        className={`h-[11px] w-[11px] rounded-[2px] ${shade} transition-all hover:ring-1 hover:ring-foreground/20`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-4 flex items-center justify-between text-[11px] text-muted-foreground'>
          <a href="#" className='hover:text-blue-600 hover:underline transition-all'>
            Learn how we count contributions
          </a>
          <div className='flex items-center gap-1.5'>
            <span>Less</span>
            <div className='flex gap-[2px]'>
              {shades.map((s, i) => (
                <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${s}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
