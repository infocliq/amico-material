import { createFileRoute } from '@tanstack/react-router'
import KittingStorageMap from '@/features/kitting/pages/storage-map'

export const Route = createFileRoute('/_authenticated/kitting/storage/')({
  component: KittingStorageMap,
})
