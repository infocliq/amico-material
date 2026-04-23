import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CheckList } from '@/features/checklist'

export const Route = createFileRoute('/_authenticated/checklist/')({
  component: CheckList,
})
