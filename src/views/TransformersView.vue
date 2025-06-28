<template>
  <div class="container">
    <div v-if="!transformersData" class="spinner-container">
      <LoadingSpinner />
    </div>
    <div v-else>
      <TransformersTable
        :transformers-data="filteredTransformers"
        :visibility-state="visibilityState"
        :search-filter="searchFilter"
        :region-filter="regionFilter"
        :health-filter="healthFilter"
        @update-visibility="handleVisibilityUpdate"
        @update-search="handleSearchUpdate"
        @update-region="handleRegionUpdate"
        @update-health="handleHealthUpdate"
      />

      <VoltageChart
        v-if="filteredTransformers"
        initial-theme="system"
        :transformersData="filteredTransformers"
        :visibility-state="visibilityState"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Health, type TransformerData } from '../../server/sampleTransformerData'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VoltageChart from '@/components/VoltageChart.vue'
import TransformersTable from '@/components/TransformersTable.vue'
import { ref, onMounted, computed } from 'vue'

export type Region = 'London' | 'Manchester' | 'Glasgow'

const transformersData = ref<TransformerData[] | null>(null)
const visibilityState = ref<Record<string, boolean>>({})
const searchFilter = ref('')
const regionFilter = ref<Region | null>(null)
const healthFilter = ref<Health | null>(null)

onMounted(async () => {
  // Initialize filter states fron local storage
  const savedVisibility = localStorage.getItem('tableVisibilityState')
  const savedSearchFilter = localStorage.getItem('searchFilter')
  const savedRegionFilter = localStorage.getItem('regionFilter') as Region
  const savedHealthilter = localStorage.getItem('healthFilter') as Health
  if (savedVisibility) {
    visibilityState.value = JSON.parse(savedVisibility)
  } else {
    // Initialize all items as visible by default
    transformersData.value?.forEach((item) => {
      visibilityState.value[item.assetId] = true
    })
    saveVisibility()
  }
  if (savedSearchFilter) searchFilter.value = savedSearchFilter
  if (savedRegionFilter) regionFilter.value = savedRegionFilter
  if (savedHealthilter) healthFilter.value = savedHealthilter

  // Fetch transformers data from server
  try {
    const response = await fetch('http://localhost:3001/getTransformerData')
    const data = await response.json()
    transformersData.value = data
  } catch (error) {
    console.error('Error fetching transformer data:', error)
  }
})

const filteredTransformers = computed(() => {
  const returnValue = transformersData.value?.filter((transformer) => {
    // Search filter
    const matchesSearch = transformer.name.toLowerCase().includes(searchFilter.value.toLowerCase())

    // Region filter
    const matchesRegion = !regionFilter.value || transformer.region === regionFilter.value

    // Health filter
    const matchesHealth = !healthFilter.value || transformer.health === healthFilter.value

    return matchesSearch && matchesRegion && matchesHealth
  })
  console.log('returnValue:', returnValue)
  return returnValue
})

console.log('filteredTransformers:', filteredTransformers.value)

const handleVisibilityUpdate = (assetId: string, isVisible: boolean) => {
  visibilityState.value[assetId] = isVisible
  saveVisibility()
}

const handleSearchUpdate = (searchString: string) => {
  searchFilter.value = searchString
  localStorage.setItem('searchFilter', searchFilter.value)
}

const handleRegionUpdate = (region: Region | null) => {
  regionFilter.value = region
  localStorage.setItem('regionFilter', regionFilter.value || '')
}

const handleHealthUpdate = (health: Health | null) => {
  healthFilter.value = health
  localStorage.setItem('healthFilter', healthFilter.value || '')
}

const saveVisibility = () => {
  localStorage.setItem('tableVisibilityState', JSON.stringify(visibilityState.value))
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.spinner-container {
  display: flex;
  width: 100%;
  height: 80vh;
  align-items: center;
  justify-content: center;
}
</style>
