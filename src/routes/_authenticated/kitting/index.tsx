import { createFileRoute } from '@tanstack/react-router'
import KittingDashboard from '@/features/kitting/pages/dashboard'

export const Route = createFileRoute('/_authenticated/kitting/')({
  component: KittingDashboard,
})
