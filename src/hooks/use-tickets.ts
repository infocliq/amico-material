import { useQuery } from '@tanstack/react-query'
import { getTickets } from '@/lib/tickets-service'

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
  })
}
