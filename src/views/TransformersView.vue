<template>
  <div class="container">
    <div v-if="!transformersData" class="loading-spinner">
      <LoadingSpinner />
    </div>
    <div v-else>
      <h2>Region Health Status</h2>
      <table class="health-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Health</th>
            <th>Show</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transformersData" :key="item.assetId">
            <td>{{ item.name }}</td>
            <td>{{ item.region }}</td>
            <td>
              <span :class="['health-badge', getHealthClass(item.health)]">
                {{ item.health }}
              </span>
            </td>
            <td>
              <input
                type="checkbox"
                v-model="visibilityState[item.assetId]"
                @change="saveVisibility"
              />
            </td>
          </tr>
        </tbody>
      </table>
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
import { type Health, type TransformerData } from '../../server/sampleTransformerData'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VoltageChart from '@/components/VoltageChart.vue'
import { ref, onMounted } from 'vue'
const transformersData = ref<TransformerData[] | null>(null)

// Initialize visibility state from localStorage or default to true
const visibilityState = ref({} as Record<string, boolean>)

// Load visibility state from localStorage when component mounts
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3001/getTransformerData')
    const data = await response.json()
    console.log('data:', data)
    transformersData.value = data
    const savedState = localStorage.getItem('tableVisibilityState')
    if (savedState) {
      // Ensure reactivity
      const parsedState = JSON.parse(savedState)
      Object.keys(parsedState).forEach((key) => {
        visibilityState.value[key] = parsedState[key]
      })
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

// Save visibility state to localStorage
const saveVisibility = () => {
  // console.log('visibilityState:', visibilityState.value)

  localStorage.setItem('tableVisibilityState', JSON.stringify(visibilityState.value))
}

// Helper function to determine health status class
const getHealthClass = (health: Health) => {
  const healthMap = {
    Excellent: 'excellent',
    Good: 'good',
    Fair: 'fair',
    Poor: 'poor',
    Critical: 'critical',
  } as Record<Health, string>
  return healthMap[health] || ''
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.health-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 40px;
}

.health-table th,
.health-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.health-table th {
  /* background-color: #f5f5f5; */
  font-weight: bold;
}

.health-table tr:hover {
  /* background-color: #f9f9f9; */
}

.health-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: bold;
  color: white;
}

.excellent {
  background-color: #00893a;
}

.good {
  background-color: #3a8c56;
}

.fair {
  background-color: #7c8404;
}

.poor {
  background-color: #9a630b;
}

.critical {
  background-color: #8e1103;
}

.loading-spinner {
  display: flex;
  width: 100%;
  height: 80vh;
  align-items: center;
  justify-content: center;
}

input[type='checkbox'] {
  transform: scale(1.2);
  cursor: pointer;
}
</style>
