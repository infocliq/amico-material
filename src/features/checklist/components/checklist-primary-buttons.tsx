import { Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ChecklistPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Link 
        to='/checklist/create'
        className={cn(buttonVariants(), 'h-9 px-4 gap-2')}
      >
        <Plus size={16} /> Add Task
      </Link>
    </div>
  )
}
