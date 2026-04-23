import { z } from 'zod'

export const checklistSchema = z.object({
  id: z.string().optional(),
  modelNumber: z.string().min(1, 'Model number is required'),
  departments: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Department name is required'),
      isChecked: z.boolean().default(false),
      groups: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, 'Group name is required'),
          isChecked: z.boolean().default(false),
          items: z.array(
            z.object({
              id: z.string(),
              name: z.string().min(1, 'Item name is required'),
              isChecked: z.boolean().default(false),
              comment: z.string().optional(),
            })
          ),
        })
      ),
    })
  ),
  status: z.enum(['pending', 'completed', 'in-progress', 'cancelled']).default('pending'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type ChecklistItem = z.infer<typeof checklistSchema>
