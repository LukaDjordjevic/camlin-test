<template>
  <div class="container">
    <div v-if="isFetching" class="spinner-container">
      <LoadingSpinner />
    </div>
    <div v-else>
      <div v-if="isFetchingError">Error fetching data. Please make sure the server is running.</div>
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

        <VoltageChart :transformersData="chartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Health, type Region, type TransformerData } from '../../server/sampleTransformerData'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VoltageChart from '@/components/VoltageChart.vue'
import TransformersTable from '@/components/TransformersTable.vue'
import { ref, onMounted, computed } from 'vue'

// Initialize local states
const transformersData = ref<TransformerData[] | null>(null)
const visibilityState = ref<Record<string, boolean>>({})
const isFetching = ref(true)
const isFetchingError = ref(false)
const searchFilter = ref('')
const regionFilter = ref<Region[]>([])
const healthFilter = ref<Health[]>([])

onMounted(async () => {
  // Update filter states fron local storage
  const savedVisibility = localStorage.getItem('tableVisibilityState')
  const savedSearchFilter = localStorage.getItem('searchFilter')
  const savedRegionFilter = localStorage.getItem('regionFilter') as Region
  const savedHealthilter = localStorage.getItem('healthFilter') as Health

  if (savedSearchFilter) searchFilter.value = savedSearchFilter
  if (savedRegionFilter) regionFilter.value = JSON.parse(savedRegionFilter)
  if (savedHealthilter) healthFilter.value = JSON.parse(savedHealthilter)

  // Fetch transformers data from server
  try {
    const response = await fetch('http://localhost:3001/getTransformerData')
    const data = await response.json()
    transformersData.value = data

    // Update visibility states if saved in local storage
    if (savedVisibility) {
      visibilityState.value = JSON.parse(savedVisibility)
    } else {
      // Initialize all items as visible by default
      transformersData.value?.forEach((item) => {
        visibilityState.value[item.assetId] = true
      })
      saveVisibility()
    }
  } catch (error) {
    isFetchingError.value = true
    console.error('Error fetching transformer data:', error)
  } finally {
    isFetching.value = false
  }
})

const filteredTransformers = computed(() =>
  transformersData.value?.filter((transformer) => {
    // Search filter
    const matchesSearch = transformer.name.toLowerCase().includes(searchFilter.value.toLowerCase())
    // Region filter
    const matchesRegion =
      !regionFilter.value.length || regionFilter.value.includes(transformer.region)
    // Health filter
    const matchesHealth =
      !healthFilter.value.length || healthFilter.value.includes(transformer.health)

    return matchesSearch && matchesRegion && matchesHealth
  }),
)

const chartData = computed(() => {
  return filteredTransformers.value?.filter(
    (transformer) => visibilityState.value[transformer.assetId],
  )
})

const handleVisibilityUpdate = (assetId: string, isVisible: boolean) => {
  visibilityState.value[assetId] = isVisible
  saveVisibility()
}

const handleSearchUpdate = (searchString: string) => {
  searchFilter.value = searchString
  localStorage.setItem('searchFilter', searchFilter.value)
}

const handleRegionUpdate = (region: Region) => {
  if (regionFilter.value.includes(region)) {
    regionFilter.value = regionFilter.value.filter((element) => element !== region)
  } else {
    regionFilter.value = [...regionFilter.value, region]
  }
  localStorage.setItem('regionFilter', JSON.stringify(regionFilter.value))
}

const handleHealthUpdate = (health: Health) => {
  if (healthFilter.value.includes(health)) {
    healthFilter.value = healthFilter.value.filter((element) => element !== health)
  } else {
    healthFilter.value = [...healthFilter.value, health]
  }
  localStorage.setItem('healthFilter', JSON.stringify(healthFilter.value))
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
