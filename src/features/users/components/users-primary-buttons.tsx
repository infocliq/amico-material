import { MailPlus, UserPlus, Database } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'
import { seedRoles } from '@/lib/seed-roles'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  const queryClient = useQueryClient()
  return (
    <div className='flex gap-2'>
      <Button
        variant='ghost'
        className='space-x-1 text-slate-400 hover:text-slate-600'
        onClick={async () => {
          try {
            await seedRoles()
            await queryClient.invalidateQueries({ queryKey: ['roles'] })
            toast.success('System roles seeded to database')
          } catch (e) {
            toast.error('Failed to seed roles')
          }
        }}
      >
        <Database size={18} />
      </Button>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>Invite User</span> <MailPlus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
