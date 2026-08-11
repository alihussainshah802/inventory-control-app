import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../lib/apiClient'
import type { StockStatusFilter } from '../types/inventory'

export function useProducts(status: StockStatusFilter) {
  return useQuery({
    queryKey: ['products', { status }],
    queryFn: () => fetchProducts(status),
  })
}
