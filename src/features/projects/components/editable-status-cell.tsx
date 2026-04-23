import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { projectStatuses, projectStatusColors } from '../data/data'

interface EditableStatusCellProps {
  value: string
  onSave: (value: string) => void
  className?: string
}

export function EditableStatusCell({ value: initialValue, onSave, className }: EditableStatusCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const status = projectStatuses.find((s) => s.value === initialValue)

  if (isEditing) {
    return (
      <Select
        defaultValue={initialValue}
        defaultOpen={true}
        onValueChange={(val) => {
          setIsEditing(false)
          onSave(val)
        }}
        onOpenChange={(open) => {
          if (!open) setIsEditing(false)
        }}
      >
        <SelectTrigger className='h-8 w-[130px] px-2 py-1'>
          <SelectValue placeholder='Select status' />
        </SelectTrigger>
        <SelectContent>
          {projectStatuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              <div className='flex items-center gap-2'>
                {s.icon && <s.icon className='size-3.5 text-muted-foreground' />}
                {s.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (!status) {
    return (
      <div 
        onDoubleClick={() => setIsEditing(true)} 
        className={cn('cursor-pointer hover:bg-muted py-1 px-2 rounded-md text-xs text-muted-foreground italic border border-dashed text-center min-w-[80px]', className)}
      >
        Set Status
      </div>
    )
  }

  return (
    <div onDoubleClick={() => setIsEditing(true)} className={cn('cursor-pointer hover:opacity-80 transition-opacity w-fit', className)}>
      <Badge
        variant='outline'
        className={cn('capitalize whitespace-nowrap', projectStatusColors.get(status.value))}
      >
        {status.icon && (
          <status.icon className='mr-2 size-3.5 text-muted-foreground' />
        )}
        <span>{status.label}</span>
      </Badge>
    </div>
  )
}
