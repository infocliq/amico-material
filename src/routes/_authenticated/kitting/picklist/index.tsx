import { createFileRoute } from '@tanstack/react-router'
import KittingPickList from '@/features/kitting/pages/picklist'

export const Route = createFileRoute('/_authenticated/kitting/picklist/')({
  component: KittingPickList,
})
