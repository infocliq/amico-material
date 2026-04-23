import {
  Activity,
  CheckCircle2,
  Clock,
  PlayCircle,
  Circle,
} from 'lucide-react'

export const projectStatuses = [
  {
    label: 'None',
    value: 'none',
    icon: Circle,
  },
  {
    label: 'Next',
    value: 'next',
    icon: Clock,
  },
  {
    label: 'Preparing',
    value: 'preparing',
    icon: PlayCircle,
  },
  {
    label: 'Staged',
    value: 'staged',
    icon: Activity,
  },
  {
    label: 'Done',
    value: 'done',
    icon: CheckCircle2,
  },
] as const

export const projectStatusColors = new Map<string, string>([
  ['none', 'bg-neutral-100/30 text-neutral-900 dark:text-neutral-200 border-neutral-200'],
  ['next', 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200'],
  ['preparing', 'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200'],
  ['staged', 'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200'],
  ['done', 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200'],
])

export const projectRowColors = new Map<string, string>([
  ['none', 'bg-slate-50 border-slate-200'],
  ['next', 'bg-blue-400/20 border-blue-400 text-blue-900 shadow-sm shadow-blue-100'],
  ['preparing', 'bg-orange-400/20 border-orange-400 text-orange-900 shadow-sm shadow-orange-100'],
  ['staged', 'bg-purple-400/20 border-purple-400 text-purple-900 shadow-sm shadow-purple-100'],
  ['done', 'bg-green-400/20 border-green-400 text-green-900 shadow-sm shadow-green-100'],
])

export const frameworks = [
  {
    label: 'React',
    value: 'React',
  },
  {
    label: 'Next.js',
    value: 'Next.js',
  },
  {
    label: 'Vue',
    value: 'Vue',
  },
  {
    label: 'Svelte',
    value: 'Svelte',
  },
] as const
