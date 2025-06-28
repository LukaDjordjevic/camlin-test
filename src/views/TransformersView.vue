<template>
  <div class="container">
    <div v-if="!transformersData" class="loading-spinner">
      <LoadingSpinner />
    </div>
    <div v-else>
      <TransformersTable
        :transformers-data="transformersData"
        :visibility-state="visibilityState"
        @update-visibility="handleVisibilityUpdate"
      />
    </div>

    <VoltageChart
      v-if="transformersData"
      initial-theme="system"
      :transformer-data="transformersData"
      v-model:data-indices="visibilityState"
    />
  </div>
</template>

<script setup lang="ts">
import { type TransformerData } from '../../server/sampleTransformerData'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VoltageChart from '@/components/VoltageChart.vue'
import TransformersTable from '@/components/TransformersTable.vue'
import { ref, onMounted } from 'vue'

const transformersData = ref<TransformerData[] | null>(null)
const visibilityState = ref<Record<string, boolean>>({})

onMounted(async () => {
  try {
    // Fetch transformers data from server
    const response = await fetch('http://localhost:3001/getTransformerData')
    const data = await response.json()
    transformersData.value = data

    // Update checkbox visibility from local storage
    const savedState = localStorage.getItem('tableVisibilityState')
    if (savedState) {
      visibilityState.value = JSON.parse(savedState)
    } else {
      // Initialize all items as visible by default
      transformersData.value?.forEach((item) => {
        visibilityState.value[item.assetId] = true
      })
      saveVisibility()
    }
  } catch (error) {
    console.error('Error fetching transformer data:', error)
  }
})

const handleVisibilityUpdate = (assetId: string, isVisible: boolean) => {
  visibilityState.value[assetId] = isVisible
  saveVisibility()
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

.loading-spinner {
  display: flex;
  width: 100%;
  height: 80vh;
  align-items: center;
  justify-content: center;
}
</style>
