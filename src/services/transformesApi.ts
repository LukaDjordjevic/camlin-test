import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { TransformerData } from '../../server/sampleTransformerData'

const BASE_API_URL = 'http://localhost:3001'

const fetchTransformerData = async (): Promise<TransformerData[]> => {
  const response = await fetch(`${BASE_API_URL}/getTransformerData`)
  if (!response.ok) throw new Error('fetchTransformerData failed')
  return response.json()
}

export const useTransformersQuery = (tableVisibilityState: Ref<Record<string, boolean>>) => {
  return useQuery({
    queryKey: ['transformers'],
    queryFn: async () => {
      const data = await fetchTransformerData()

      // Once we have the transformers data, we need to initialize tableVisibilityState (checkboxes)
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
  })
}
