import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { TransformerData } from '../../server/sampleTransformerData'

const BASE_API_URL = 'http://localhost:3001'

const fetchTransformerData = async (): Promise<TransformerData[]> => {
  const response = await fetch(`${BASE_API_URL}/getTransformerData`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

export const useTransformersQuery = (tableVisibilityState: Ref<Record<string, boolean>>) => {
  return useQuery({
    queryKey: ['transformers'],
    queryFn: async () => {
      const data = await fetchTransformerData()
      console.log('data:', data)

      const savedVisibility = localStorage.getItem('tableVisibilityState')

      if (savedVisibility) {
        tableVisibilityState.value = JSON.parse(savedVisibility)
      } else {
        // Initialize all items as visible by default
        const newVisibilityState = {} as Record<string, boolean>
        data.forEach((item) => {
          newVisibilityState[item.assetId] = true
        })
        tableVisibilityState.value = newVisibilityState
        localStorage.setItem('tableVisibilityState', JSON.stringify(tableVisibilityState.value))
      }

      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
