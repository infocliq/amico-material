import { createFileRoute } from '@tanstack/react-router'
import { ManageProject } from '@/features/projects/manage'

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: ManageProject,
})
