import { z } from 'zod'

export const projectStatusSchema = z.union([
  z.literal('none'),
  z.literal('next'),
  z.literal('preparing'),
  z.literal('staged'),
  z.literal('done'),
])
export type ProjectStatus = z.infer<typeof projectStatusSchema>

const _projectSchema = z.object({
  id: z.string(),
  salesOrder: z.string().catch(''),
  workOrder: z.string().catch(''),
  shipDate: z.coerce.date().optional(),
  name: z.string(),
  quantity: z.number().catch(1),
  productionStart: z.coerce.date().optional(),
  supportStart: z.coerce.date().optional(),
  drawing: z.string().catch(''),
  productType: z.string().catch(''),
  checklistId: z.string().optional(),
  checklist: z.any().optional(),
  status: projectStatusSchema.catch('none'),
  assignee: z.string().catch(''),
  tasks: z.array(z.string()).catch([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Project = z.infer<typeof _projectSchema>
