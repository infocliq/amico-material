import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

interface DateEditableCellProps {
  value: string | undefined
  onSave: (value: Date) => void
  label?: string
  className?: string
}

export function DateEditableCell({ value: initialValue, onSave, label = 'Pick a date', className }: DateEditableCellProps) {
  const [date, setDate] = useState<Date | undefined>(initialValue ? new Date(initialValue) : undefined)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setDate(initialValue ? new Date(initialValue) : undefined)
  }, [initialValue])

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      setIsEditing(false)
      onSave(selectedDate)
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  return (
    <div onDoubleClick={handleDoubleClick} className={cn('cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded transition-colors truncate min-h-[1.5rem]', className)}>
      <Popover open={isEditing} onOpenChange={setIsEditing} modal={true}>
        <PopoverTrigger asChild>
          <div className='flex items-center gap-1.5'>
            {date ? format(date, 'MMM dd, yyyy') : <span className='text-muted-foreground italic font-light opacity-50'>{label}</span>}
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
