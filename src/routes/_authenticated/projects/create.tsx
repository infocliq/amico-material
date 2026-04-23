import { createFileRoute } from '@tanstack/react-router'
import { CreateProject } from '@/features/projects/create'

export const Route = createFileRoute('/_authenticated/projects/create')({
  component: CreateProject,
})
