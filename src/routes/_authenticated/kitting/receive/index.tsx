import { createFileRoute } from '@tanstack/react-router'
import KittingReceive from '@/features/kitting/pages/receive'

export const Route = createFileRoute('/_authenticated/kitting/receive/')({
  component: KittingReceive,
})
