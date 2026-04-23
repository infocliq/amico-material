import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Role } from '@/types/auth'
import { type User } from '../data/schema'
import { SystemRole } from '@/lib/auth-service'
import { RoleActionDialog } from './role-action-dialog'
import { RoleDeleteDialog } from './role-delete-dialog'

interface RoleCardsProps {
  users: User[]
  roles: SystemRole[]
}

export function RoleCards({ users, roles }: RoleCardsProps) {
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)
  const roleStats = useMemo(() => {
    // Initialize counts for each role provided by the database
    const counts: Record<string, { count: number; users: User[] }> = {}
    
    roles.forEach(role => {
      if (role && role.id) {
        counts[role.id.toLowerCase()] = { count: 0, users: [] }
      }
    })

    // Count users for each role
    users.forEach((user) => {
      const userRole = user.role?.toLowerCase()
      if (userRole && counts[userRole]) {
        counts[userRole].count++
        if (counts[userRole].users.length < 4) {
          counts[userRole].users.push(user)
        }
      }
    })

    // Create the stats array and filter out roles that might not be in our counts 
    // (though they should be as we initialized from the roles array)
    return roles.map(role => {
      const roleId = role.id?.toLowerCase() || ''
      return {
        title: role.title || 'Untitled Role',
        role: role.id || 'unknown',
        count: (roleId ? counts[roleId]?.count : 0) || 0,
        previewUsers: (roleId ? counts[roleId]?.users : []) || [],
      }
    })
  }, [users, roles])

  return (
    <div className='space-y-4 mb-8'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Administrator roles available</h2>
        <p className='text-sm text-slate-500 mt-1 max-w-3xl'>
          A role provides access to predefined menus and features so that depending on the assigned
          role (Super Admin, Manager, Accountant) an administrator can have access to what he needs.
        </p>
      </div>

      <div
        className='flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar cursor-grab active:cursor-grabbing select-none'
        onMouseDown={(e) => {
          const container = e.currentTarget
          const startX = e.pageX - container.offsetLeft
          const scrollLeft = container.scrollLeft
          
          const handleMouseMove = (moveEvent: MouseEvent) => {
            const x = moveEvent.pageX - container.offsetLeft
            const walk = (x - startX) * 2 // Scroll speed multiplier
            container.scrollLeft = scrollLeft - walk
          }
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
          }
          
          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }}
      >
        {roleStats.map((role) => (
          <Card key={role.role} className='shadow-none border-slate-200 rounded-lg m-0 p-0 px-1 py-2 min-w-[280px] shrink-0 pointer-events-auto'>
            <CardContent className='flex flex-col justify-between h-full'>
              {/* Row 1: Accounts & Avatars */}
              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium text-slate-500'>
                  {role.count} Accounts
                </span>
                <div className='flex items-center gap-2'>
                  <div className='flex -space-x-1.5 overflow-hidden'>
                    {role.previewUsers.map((u) => (
                      <Avatar key={u.id} className='inline-block size-[26px] ring-2 ring-white border-none'>
                        <AvatarImage src='' />
                        <AvatarFallback className='text-[8px] bg-slate-100'>
                          {u.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {role.role !== 'superadmin' && role.role !== 'admin' && (
                    <Button 
                      variant='ghost' 
                      size='icon' 
                      className='h-6 w-6 text-slate-400 hover:text-destructive transition-colors'
                      onClick={() => setRoleToDelete(role.role)}
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                    </Button>
                  )}
                </div>
              </div>

              {/* Row 2: Role Title */}
              <div className='mt-1'>
                <h3 className='font-semibold tracking-tight text-sm'>
                  {role.title}
                </h3>
              </div>

              <div className='mt-1'>
                <Link
                  to='/roles'
                  className='text-xs font-semibold text-blue-500 hover:underline transition-all'
                >
                  Manage roles & permissions
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className='min-w-[200px] shrink-0'>
          <RoleActionDialog />
        </div>
      </div>

      <RoleDeleteDialog 
        roleId={roleToDelete}
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
      />
    </div>
  )
}
