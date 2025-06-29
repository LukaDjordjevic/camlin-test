<template>
  <div class="table-container">
    <div v-if="isLoading" class="spinner-container">
      <LoadingSpinner />
    </div>
    <div v-else>
      <div v-if="isLoadingError">Error fetching data. Please make sure the server is running.</div>
      <div v-else>
        <h2>Region Health Status</h2>
        <button @click="resetFilters">Reset Filters</button>
        <TransformersTable
          :transformers-data="filteredTransformers"
          :visibility-state="tableVisibilityState"
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
import { type Health, type Region } from '../../server/sampleTransformerData'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VoltageChart from '@/components/VoltageChart.vue'
import TransformersTable from '@/components/TransformersTable.vue'
import { ref, onMounted, computed, type Ref } from 'vue'
import { useTransformersQuery } from '@/services/transformesApi'

// Initialize local states
const searchFilter = ref('')
const regionFilter = ref<Region[]>([])
const healthFilter = ref<Health[]>([])
const tableVisibilityState = ref<Record<string, boolean>>({})

const {
  data: transformersData,
  isLoading,
  isError: isLoadingError,
} = useTransformersQuery(tableVisibilityState)

onMounted(() => {
  // Update filter states fron local storage
  const savedSearchFilter = localStorage.getItem('searchFilter')
  const savedRegionFilter = localStorage.getItem('regionFilter') as Region
  const savedHealthilter = localStorage.getItem('healthFilter') as Health
  const savedVisibility = localStorage.getItem('tableVisibilityState')

  if (savedSearchFilter) searchFilter.value = savedSearchFilter
  if (savedRegionFilter) regionFilter.value = JSON.parse(savedRegionFilter)
  if (savedHealthilter) healthFilter.value = JSON.parse(savedHealthilter)
  if (savedVisibility) {
    tableVisibilityState.value = JSON.parse(savedVisibility)
  }
})

const filteredTransformers = computed(
  () =>
    transformersData.value?.filter((transformer) => {
      const matchesSearch = transformer.name
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase())
      const matchesRegion =
        !regionFilter.value.length || regionFilter.value.includes(transformer.region)
      const matchesHealth =
        !healthFilter.value.length || healthFilter.value.includes(transformer.health)

      return matchesSearch && matchesRegion && matchesHealth
    }) ?? [],
)

const chartData = computed(
  () =>
    filteredTransformers.value?.filter(
      (transformer) => tableVisibilityState.value[transformer?.assetId],
    ) ?? [],
)

const handleVisibilityUpdate = (assetId: string, isVisible: boolean) => {
  tableVisibilityState.value[assetId] = isVisible
  saveVisibility()
}

const handleSearchUpdate = (searchString: string) => {
  searchFilter.value = searchString
  localStorage.setItem('searchFilter', searchFilter.value)
}

const toggleFilter = <T,>(filter: Ref<T[]>, value: T, storageKey: string) => {
  filter.value = filter.value.includes(value)
    ? filter.value.filter((item) => item !== value)
    : [...filter.value, value]
  localStorage.setItem(storageKey, JSON.stringify(filter.value))
}

const handleRegionUpdate = (region: Region) => toggleFilter(regionFilter, region, 'regionFilter')
const handleHealthUpdate = (health: Health) => toggleFilter(healthFilter, health, 'healthFilter')

const saveVisibility = () => {
  localStorage.setItem('tableVisibilityState', JSON.stringify(tableVisibilityState.value))
}

const resetFilters = () => {
  searchFilter.value = ''
  regionFilter.value = []
  healthFilter.value = []
  localStorage.removeItem('searchFilter')
  localStorage.removeItem('regionFilter')
  localStorage.removeItem('healthFilter')
}
</script>
