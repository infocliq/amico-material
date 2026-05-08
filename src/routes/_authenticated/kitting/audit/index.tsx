import { createFileRoute } from '@tanstack/react-router'
import KittingAuditTrail from '@/features/kitting/pages/audit-trail'

export const Route = createFileRoute('/_authenticated/kitting/audit/')({
  component: KittingAuditTrail,
})
