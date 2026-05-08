import { createFileRoute } from '@tanstack/react-router'
import KittingIssue from '@/features/kitting/pages/issue'

export const Route = createFileRoute('/_authenticated/kitting/issue/')({
  component: KittingIssue,
})
