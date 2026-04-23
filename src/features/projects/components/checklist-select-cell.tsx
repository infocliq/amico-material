import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getChecklists, getChecklist } from '@/lib/checklist-service'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ChecklistSelectCellProps {
  value?: string
  onSave: (checklistId: string, fullChecklist?: any) => void
}

export function ChecklistSelectCell({ value, onSave }: ChecklistSelectCellProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const { data: checklists } = useQuery({
    queryKey: ['checklists'],
    queryFn: getChecklists,
  })

  const handleSelect = async (checklistId: string) => {
    // Fetch the full checklist template to clone it
    const template = await getChecklist(checklistId)
    if (template) {
       // Clone the structure but we keep it linked
       onSave(checklistId, template)
    } else {
       onSave(checklistId)
    }
    setIsEditing(false)
  }

  const selectedChecklist = checklists?.find((c) => c.id === value)

  if (!isEditing) {
    return (
      <div
        className={cn(
          'flex h-8 w-full items-center rounded-md px-2 text-sm transition-colors hover:bg-muted cursor-pointer font-medium',
          !selectedChecklist && 'text-muted-foreground'
        )}
        onClick={() => setIsEditing(true)}
      >
        {selectedChecklist ? selectedChecklist.modelNumber : 'Select Checklist...'}
      </div>
    )
  }

  return (
    <Select
      defaultValue={value}
      onValueChange={handleSelect}
      onOpenChange={(open) => !open && setIsEditing(false)}
    >
      <SelectTrigger className='h-8 w-full border-none p-0 px-2 focus:ring-0'>
        <SelectValue placeholder='Select Checklist' />
      </SelectTrigger>
      <SelectContent>
        {checklists?.map((c) => (
          <SelectItem key={c.id} value={c.id || ''}>
            {c.modelNumber}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
