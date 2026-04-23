import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { requireAuth } from '@/lib/auth-guards'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => requireAuth(location.href),
  component: AuthenticatedLayout,
})
