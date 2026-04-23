
import { useQuery } from '@tanstack/react-query'
import { getRoles } from '@/lib/auth-service'

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })
}
