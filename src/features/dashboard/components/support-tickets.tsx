import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tickets = [
  {
    id: 'TK-4821',
    title: 'Payment processing fails for EU customers',
    status: 'Next',
    statusColor: 'bg-red-500',
    assignee: 'MK',
    time: '12 min ago',
    description: 'Stripe webhook returns 402 for cards issued in Germany and France. Affects approximately 15% of EU transactions since the latest deployment.',
    expanded: true,
  },
  {
    id: 'TK-4819',
    title: 'Dashboard loading timeout on large datasets',
    status: 'Preparing',
    statusColor: 'bg-amber-500',
    assignee: 'JR',
    time: '34 min ago',
  },
  {
    id: 'TK-4817',
    title: 'SSO login redirect loop with Okta',
    status: 'Next',
    statusColor: 'bg-red-500',
    assignee: 'AL',
    time: '1 hr ago',
  },
  {
    id: 'TK-4815',
    title: 'CSV export missing custom field columns',
    status: 'Preparing',
    statusColor: 'bg-amber-500',
    assignee: 'PS',
    time: '2 hr ago',
  },
  {
    id: 'TK-4812',
    title: 'Email notifications delayed by 15 minutes',
    status: 'Staged',
    statusColor: 'bg-blue-500',
    assignee: 'MK',
    time: '3 hr ago',
  },
  {
    id: 'TK-4810',
    title: 'Mobile app crashes on image upload',
    status: 'Preparing',
    statusColor: 'bg-amber-500',
    assignee: 'TR',
    time: '4 hr ago',
  },
  {
    id: 'TK-4807',
    title: 'Typo in onboarding welcome email template',
    status: 'Next',
    statusColor: 'bg-slate-400',
    assignee: 'AL',
    time: '5 hr ago',
  },
  {
    id: 'TK-4805',
    title: 'Update API documentation for v3 endpoints',
    status: 'Done',
    statusColor: 'bg-emerald-500',
    assignee: 'PS',
    time: '6 hr ago',
  },
]

export function SupportTickets() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className='overflow-hidden rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <div>
          <h2 className='text-sm font-medium'>Support Tickets</h2>
          <p className='mt-0.5 text-xs text-muted-foreground'>Recent helpdesk requests</p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground'>7 open</span>
        </div>
      </div>
      <div className='divide-y'>
        {tickets.map((ticket) => (
          <div key={ticket.id} className='overflow-hidden'>
            <button
              type='button'
              onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
              className='flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50'
            >
              <span className={cn('size-2 shrink-0 rounded-full', ticket.statusColor)}></span>
              <span className='w-16 shrink-0 font-mono text-[10px] text-muted-foreground'>
                {ticket.id}
              </span>
              <div className='min-w-0 flex-1 px-1'>
                <span className='block truncate text-sm font-medium'>
                  {ticket.title}
                </span>
              </div>
              <span className='hidden shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline'>
                {ticket.status}
              </span>
              <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium'>
                {ticket.assignee}
              </div>
              <span className='hidden w-16 shrink-0 text-right text-[10px] text-muted-foreground sm:inline'>
                {ticket.time}
              </span>
              <ChevronRight
                className={cn(
                  'size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200',
                  expandedId === ticket.id && 'rotate-90'
                )}
              />
            </button>
            {expandedId === ticket.id && ticket.description && (
              <div className='bg-muted/10 pb-4 pl-[4.5rem] pr-4'>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {ticket.description}
                </p>
                <div className='mt-3 flex items-center gap-2'>
                  <Button variant='outline' size='sm' className='h-7 gap-1.5 px-3 text-xs text-foreground'>
                    Assign
                  </Button>
                  <Button variant='ghost' size='sm' className='h-7 gap-1.5 px-3 text-xs text-foreground'>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
