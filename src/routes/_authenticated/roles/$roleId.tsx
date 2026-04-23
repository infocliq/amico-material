import { createFileRoute } from '@tanstack/react-router'
import { RolePermissions } from '@/features/roles'

export const Route = createFileRoute('/_authenticated/roles/$roleId')({
  component: RolePermissions,
})
