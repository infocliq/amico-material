import { createFileRoute } from '@tanstack/react-router'
import KittingLabelPrinter from '@/features/kitting/pages/label-printer'

export const Route = createFileRoute('/_authenticated/kitting/labels/')({
  component: KittingLabelPrinter,
})
