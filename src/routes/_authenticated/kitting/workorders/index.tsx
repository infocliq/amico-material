import { createFileRoute } from '@tanstack/react-router'
import KittingWorkOrders from '@/features/kitting/pages/work-orders'

export const Route = createFileRoute('/_authenticated/kitting/workorders/')({
  component: KittingWorkOrders,
})
