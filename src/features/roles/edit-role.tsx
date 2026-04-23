
import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ChevronLeft, Info, Save, ShieldCheck } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ROLE_PERMISSIONS, Permission, Role } from '@/types/auth'
import { toast } from 'sonner'

export function EditRole() {
  const { roleId } = useParams({ from: '/_authenticated/roles/$roleId' })
  const role = roleId as Role
  
  // Initialize permissions state from existing data or empty array
  const [permissions, setPermissions] = useState<Permission[]>(
    ROLE_PERMISSIONS[role] || []
  )
  const [isSaving, setIsSaving] = useState(false)

  // Define all available permissions grouped by category
  const permissionGroups = [
    {
      title: 'Users Management',
      description: 'Manage user accounts, roles, and status.',
      items: [
        { id: 'users:read', label: 'View Users', description: 'Allow viewing the list of users and their profiles.' },
        { id: 'users:write', label: 'Create/Edit Users', description: 'Allow creating new users or updating existing ones.' },
        { id: 'users:delete', label: 'Delete Users', description: 'Allow removing users from the system.' },
        { id: 'users:assign_roles', label: 'Assign Roles', description: 'Allow changing user roles and permissions.' },
      ]
    },
    {
      title: 'Content Management',
      description: 'Manage project content and publishing.',
      items: [
        { id: 'content:read', label: 'View Content', description: 'Allow viewing existing content.' },
        { id: 'content:write', label: 'Create/Edit Content', description: 'Allow creating or editing content.' },
        { id: 'content:delete', label: 'Delete Content', description: 'Allow deleting content.' },
        { id: 'content:publish', label: 'Publish Content', description: 'Allow moving content to live status.' },
      ]
    },
    {
      title: 'Reports & Analytics',
      description: 'Access system reports and export data.',
      items: [
        { id: 'reports:read', label: 'View Reports', description: 'Allow viewing system reports.' },
        { id: 'reports:export', label: 'Export Data', description: 'Allow exporting reports to CSV/PDF.' },
      ]
    },
    {
      title: 'System Settings',
      description: 'Configure global system settings.',
      items: [
        { id: 'settings:read', label: 'View Settings', description: 'Allow viewing system configuration.' },
        { id: 'settings:write', label: 'Edit Settings', description: 'Allow modifying global configurations.' },
        { id: 'audit:read', label: 'View Audit Logs', description: 'Allow viewing system change history.' },
      ]
    }
  ]

  const togglePermission = (id: Permission) => {
    setPermissions(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Role permissions updated successfully', {
        description: `Permissions for ${role} have been synchronized.`
      })
    }, 1000)
  }

  const isSuperAdmin = role === 'superadmin'

  return (
    <>
      <Header fixed shadow>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6 max-w-5xl mx-auto w-full'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' asChild className='h-8 w-8'>
              <Link to='/users'>
                <ChevronLeft className='h-4 w-4' />
              </Link>
            </Button>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold tracking-tight capitalize'>{role} Role</h2>
                <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
                  Editing
                </Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                Configure granular permissions for this administrative role.
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving || isSuperAdmin} className='gap-2'>
            {isSaving ? 'Saving...' : <><Save className='h-4 w-4' /> Save Changes</>}
          </Button>
        </div>

        {isSuperAdmin && (
          <Alert className='bg-blue-50 border-blue-200 text-blue-800'>
            <ShieldCheck className='h-5 w-5 text-blue-600' />
            <AlertTitle>Master Role</AlertTitle>
            <AlertDescription>
              The superadmin role has full system access by default. These permissions cannot be modified.
            </AlertDescription>
          </Alert>
        )}

        <div className='grid gap-6'>
          {permissionGroups.map((group) => (
            <Card key={group.title} className='shadow-none border-slate-200 overflow-hidden'>
              <CardHeader className='bg-slate-50/50 py-4'>
                <CardTitle className='text-base'>{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid gap-6 sm:grid-cols-2'>
                  {group.items.map((item) => (
                    <div key={item.id} className='flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-slate-50/50'>
                      <Switch 
                        id={item.id} 
                        checked={permissions.includes(item.id as Permission)}
                        onCheckedChange={() => togglePermission(item.id as Permission)}
                        disabled={isSuperAdmin}
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <Label 
                          htmlFor={item.id}
                          className='text-sm font-semibold leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {item.label}
                        </Label>
                        <p className='text-xs text-muted-foreground'>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='flex justify-end gap-3 pb-10'>
          <Button variant='outline' asChild>
            <Link to='/users'>Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isSuperAdmin}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </Main>
    </>
  )
}
