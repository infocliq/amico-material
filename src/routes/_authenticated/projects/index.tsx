import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Projects } from '@/features/projects'
import { projectStatuses, frameworks } from '@/features/projects/data/data'

const projectsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter
  name: z.string().optional().catch(''),
  salesOrder: z.string().optional().catch(''),
  workOrder: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/projects/')({
  validateSearch: projectsSearchSchema,
  component: Projects,
})
