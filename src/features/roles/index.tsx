import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Crown,
  ShieldCheck,
  Shield,
  User,
  Check,
  Lock,
  ArrowLeft,
  Save,
  Ellipsis
} from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { getRoles } from '@/lib/auth-service'

const PERMISSION_GROUPS = [
  {
    title: 'User Management',
    permissions: [
      { id: 'users:view', label: 'View users' },
      { id: 'users:create', label: 'Create users' },
      { id: 'users:edit', label: 'Edit users' },
      { id: 'users:delete', label: 'Delete users' },
    ]
  },
  {
    title: 'Content',
    permissions: [
      { id: 'content:view', label: 'View content' },
      { id: 'content:create', label: 'Create content' },
      { id: 'content:edit', label: 'Edit content' },
      { id: 'content:publish', label: 'Publish content' },
      { id: 'content:delete', label: 'Delete content' },
    ]
  },
  {
    title: 'Settings',
    permissions: [
      { id: 'settings:view', label: 'View settings' },
      { id: 'settings:edit', label: 'Edit settings' },
    ]
  },
  {
    title: 'Analytics',
    permissions: [
      { id: 'analytics:view', label: 'View analytics' },
      { id: 'analytics:export', label: 'Export data' },
    ]
  }
]

// Default roles used as fallback or for matrix columns structure
const DEFAULT_ROLES_STRUCTURE = [
  { id: 'admin', label: 'Admin', icon: Crown, stats: '13/13' },
  { id: 'manager', label: 'Manager', icon: ShieldCheck, stats: '11/13' },
  { id: 'editor', label: 'Editor', icon: Shield, stats: '5/13' },
  { id: 'viewer', label: 'Viewer', icon: User, stats: '3/13' },
]

// Mock data for which roles have which permissions
const ROLE_MATRIX: Record<string, string[]> = {
  admin: ['users:view', 'users:create', 'users:edit', 'users:delete', 'content:view', 'content:create', 'content:edit', 'content:publish', 'content:delete', 'settings:view', 'settings:edit', 'analytics:view', 'analytics:export'],
  manager: ['users:view', 'users:create', 'users:edit', 'content:view', 'content:create', 'content:edit', 'content:publish', 'settings:view', 'analytics:view', 'analytics:export'],
  editor: ['users:view', 'content:view', 'content:create', 'content:edit', 'analytics:view'],
  viewer: ['users:view', 'content:view', 'analytics:view'],
}

export function RolePermissions() {
  const navigate = useNavigate()
  const { roleId } = useParams({ strict: false }) as { roleId?: string }
  const [isSaving, setIsSaving] = useState(false)

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles
  })

  const focusedRole = roles?.find(r => r.id === roleId)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Permissions updated', {
        description: 'New role access levels have been synchronized successfully.'
      })
    }, 1000)
  }

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

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {/* Top Navigation & Title Row */}
        <div>
          <Button
            variant='ghost'
            size='sm'
            className='mb-3 h-7 gap-1 px-2 text-xs -ml-2'
            onClick={() => navigate({ to: '/users' })}
          >
            <ArrowLeft className='size-3' />
            Back to Users
          </Button>

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-3xl font-bold tracking-tight'>
                  {focusedRole ? focusedRole.title : 'Role Permissions'}
                </h2>
                <Badge variant='outline' className='rounded-full font-medium h-fit'>
                  Active
                </Badge>
              </div>
              <p className='mt-1 text-muted-foreground'>
                {focusedRole?.description || 'Configure and audit access levels across all administrative roles'}
              </p>
            </div>
            <div className='flex gap-2 items-center'>
              <Button onClick={handleSave} disabled={isSaving} className='gap-2'>
                {isSaving ? 'Saving...' : <><Save className='size-4' /> Save Changes</>}
              </Button>
              <Button variant='outline' size='icon'>
                <Ellipsis className='size-5' />
              </Button>
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border bg-card'>
          <div className='flex items-center justify-between border-b px-4 py-3'>
            <div>
              <h3 className='text-sm font-medium'>
                {focusedRole ? focusedRole.title : 'Access Matrix'}
              </h3>
              <p className='text-xs text-muted-foreground'>
                {focusedRole?.description || 'Configure access levels for each role'}
              </p>
            </div>
            <Badge variant='outline' className='rounded-full px-2 py-0.5 text-xs font-medium'>
              13 permissions
            </Badge>
          </div>

          <div className='relative w-full overflow-x-auto'>
            <table className='w-full caption-bottom text-sm'>
              <thead className='[&_tr]:border-b'>
                <tr className='hover:bg-muted/50 transition-colors border-b'>
                  <th className='h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground'>
                    Permission
                  </th>
                  {DEFAULT_ROLES_STRUCTURE.map((role) => (
                    <th key={role.id} className={`h-12 px-2 align-middle text-center text-xs font-medium text-muted-foreground min-w-[120px] ${role.id === roleId ? 'bg-primary/5' : ''}`}>
                      <div className='flex flex-col items-center gap-1'>
                        <div className='flex items-center gap-1.5'>
                          <role.icon className={`h-4 w-4 ${role.id === 'admin' ? 'text-primary' : ''}`} />
                          <span className={role.id === roleId ? 'text-primary font-bold' : ''}>{role.label}</span>
                        </div>
                        <span className='text-[10px] font-normal text-muted-foreground'>{role.stats}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='[&_tr:last-child]:border-0'>
                {PERMISSION_GROUPS.map((group) => (
                  <React.Fragment key={group.title}>
                    <tr className='bg-muted/30'>
                      <td colSpan={5} className='px-4 py-2 font-medium text-sm border-b'>
                        {group.title}
                      </td>
                    </tr>
                    {group.permissions.map((perm) => (
                      <tr key={perm.id} className='hover:bg-muted/50 border-b transition-colors'>
                        <td className='px-4 py-3'>
                          <span className='text-sm cursor-help'>{perm.label}</span>
                        </td>
                        {DEFAULT_ROLES_STRUCTURE.map((role) => {
                          const hasPermission = ROLE_MATRIX[role.id]?.includes(perm.id)
                          const isLocked = role.id === 'admin'
                          
                          return (
                            <td key={`${role.id}-${perm.id}`} className={`p-2 align-middle text-center ${isLocked ? 'bg-muted/10' : ''} ${role.id === roleId ? 'bg-primary/5' : ''}`}>
                              <div className='flex items-center justify-center'>
                                {isLocked ? (
                                  <div className='flex h-5 w-5 items-center justify-center rounded bg-primary/10'>
                                    <Lock className='h-3 w-3 text-primary' />
                                  </div>
                                ) : (
                                  <div 
                                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                      hasPermission 
                                        ? 'bg-primary border-primary text-primary-foreground' 
                                        : 'bg-transparent border-input'
                                    }`}
                                  >
                                    {hasPermission && <Check className='h-3 w-3' />}
                                  </div>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex items-center gap-6 border-t px-4 py-3 text-[11px] text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <Crown className='h-3 w-3' />
              <span>System role (locked)</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='h-3 w-3 rounded bg-primary flex items-center justify-center'>
                <Check className='h-2.5 w-2.5 text-primary-foreground' />
              </div>
              <span>Permission granted</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='h-3 w-3 rounded border border-input'></div>
              <span>Permission denied</span>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
