import { createFileRoute } from '@tanstack/react-router'
import KittingProjects from '@/features/kitting/pages/projects'

export const Route = createFileRoute('/_authenticated/kitting/projects/')({
  component: KittingProjects,
})
