import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '../lib/apiClient'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })
}
