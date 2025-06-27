<template>
  <div class="container">
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
        <tr v-for="item in items" :key="item.assetId">
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

    <VoltageChart
      initial-theme="system"
      :transformer-data="sampleData"
      v-model:data-indices="visibilityState"
    />
  </div>
</template>

<script setup lang="ts">
import { sampleData, type Health } from '@/api/sampledata'
import VoltageChart from '@/components/VoltageChart.vue'
import { ref, onMounted } from 'vue'

// Hardcoded data
// const items = [
//   { id: 1, name: 'Service A', region: 'North America', health: 'Fair' },
//   { id: 2, name: 'Service B', region: 'Europe', health: 'Excellent' },
//   { id: 3, name: 'Service C', region: 'Asia', health: 'Poor' },
//   { id: 4, name: 'Service D', region: 'South America', health: 'Critical' },
//   { id: 5, name: 'Service E', region: 'Africa', health: 'Fair' },
// ]

const items = sampleData

// Initialize visibility state from localStorage or default to true
const visibilityState = ref({} as Record<string, boolean>)

// Load visibility state from localStorage when component mounts
onMounted(() => {
  const savedState = localStorage.getItem('tableVisibilityState')
  if (savedState) {
    // Ensure reactivity
    const parsedState = JSON.parse(savedState)
    Object.keys(parsedState).forEach((key) => {
      visibilityState.value[key] = parsedState[key]
    })
  } else {
    // Initialize all items as visible by default
    items.forEach((item) => {
      visibilityState.value[item.assetId] = true
    })
    saveVisibility()
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
  background-color: #33c46f;
}

.good {
  background-color: #2ea2cc;
}

.fair {
  background-color: #5e34db;
}

.poor {
  background-color: #f39c12;
}

.critical {
  background-color: #e74c3c;
}

input[type='checkbox'] {
  transform: scale(1.2);
  cursor: pointer;
}
</style>
