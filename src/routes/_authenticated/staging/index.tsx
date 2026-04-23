import { createFileRoute } from '@tanstack/react-router'
import Staging from '@/features/staging'

export const Route = createFileRoute('/_authenticated/staging/')({
  component: Staging,
})
