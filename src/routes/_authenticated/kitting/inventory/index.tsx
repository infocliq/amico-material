import { createFileRoute } from '@tanstack/react-router'
import KittingInventory from '@/features/kitting/pages/inventory'

export const Route = createFileRoute('/_authenticated/kitting/inventory/')({
  component: KittingInventory,
})
