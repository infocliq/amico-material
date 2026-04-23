import { z } from 'zod'

export const ticketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['none', 'next', 'preparing', 'staged', 'done']),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  category: z.enum(['billing', 'technical', 'account', 'feature-request', 'other']),
  requestedBy: z.string(),
  requestedByEmail: z.string().email().optional().or(z.literal('')),
  assignee: z.string().optional().or(z.literal('')),
  assigneeEmail: z.string().email().optional().or(z.literal('')),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Ticket = z.infer<typeof ticketSchema>
