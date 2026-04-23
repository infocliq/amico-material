import {
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  XCircle,
} from 'lucide-react'

export const checklistStatuses = [
  {
    label: 'Pending',
    value: 'pending',
    icon: Circle,
    color: 'text-muted-foreground',
  },
  {
    label: 'In Progress',
    value: 'in-progress',
    icon: Clock,
    color: 'text-blue-500',
  },
  {
    label: 'Completed',
    value: 'completed',
    icon: CheckCircle2,
    color: 'text-emerald-500',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
    icon: XCircle,
    color: 'text-destructive',
  },
]

export const checklistPriorities = [
  {
    label: 'Low',
    value: 'low',
    color: 'bg-slate-400',
  },
  {
    label: 'Medium',
    value: 'medium',
    color: 'bg-blue-500',
  },
  {
    label: 'High',
    value: 'high',
    color: 'bg-amber-500',
  },
  {
    label: 'Urgent',
    value: 'urgent',
    color: 'bg-red-500',
  },
]

export const statusColors = new Map([
  ['pending', 'text-muted-foreground'],
  ['in-progress', 'text-blue-500'],
  ['completed', 'text-emerald-500'],
  ['cancelled', 'text-destructive'],
])
