<template>
  <div>
    <h2>Region Health Status</h2>

    <!-- Search Input -->
    <div class="filter-section">
      <label for="search-input">Search:</label>
      <input
        id="search-input"
        type="text"
        :value="searchFilter"
        @input="handleSearchInput($event)"
        placeholder="Filter by name..."
        class="search-input"
      />
    </div>

    <!-- Region Filter Pills -->
    <div class="filter-section">
      <label>Region:</label>
      <div class="pill-container">
        <button
          v-for="region in allRegions"
          :key="region"
          :class="['pill', { 'pill-selected': regionFilter === region }]"
          @click="toggleRegion(region)"
        >
          {{ region }}
        </button>
      </div>
    </div>

    <!-- Health Filter Pills -->
    <div class="filter-section">
      <label>Health:</label>
      <div class="pill-container">
        <button
          v-for="health in allHealths"
          :key="health"
          :class="['pill', { 'pill-selected': healthFilter === health }]"
          @click="toggleHealth(health)"
        >
          {{ health }}
        </button>
      </div>
    </div>

    <!-- Table -->
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
              :checked="visibilityState[item.assetId]"
              @change="handleCheckboxChange(item.assetId, $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Region } from '@/views/TransformersView.vue'
import { type Health, type TransformerData } from '../../server/sampleTransformerData'

const props = defineProps<{
  transformersData?: TransformerData[]
  visibilityState: Record<string, boolean>
  searchFilter: string
  regionFilter: Region | null
  healthFilter: Health | null
}>()

const emit = defineEmits<{
  (event: 'update-visibility', assetId: string, isVisible: boolean): void
  (event: 'update-search', searchString: string): void
  (event: 'update-region', region: Region | null): void
  (event: 'update-health', health: Health | null): void
}>()

const allRegions = ['London', 'Manchester', 'Glasgow'] as const
const allHealths = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'] as const

const handleCheckboxChange = (assetId: number, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  emit('update-visibility', assetId.toString(), isChecked)
}

const handleSearchInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update-search', value)
}

const toggleRegion = (region: Region) => {
  const newRegion = props.regionFilter === region ? null : region
  emit('update-region', newRegion)
}

const toggleHealth = (health: Health) => {
  const newHealth = props.healthFilter === health ? null : health
  emit('update-health', newHealth)
}

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
  font-weight: bold;
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

input[type='checkbox'] {
  transform: scale(1.2);
  cursor: pointer;
}

/* Filter styles */
.filter-section {
  margin-bottom: 15px;
}

.filter-section label {
  display: inline-block;
  margin-right: 10px;
  font-weight: bold;
  min-width: 60px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
}

.pill-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  padding: 6px 12px;
  border-radius: 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pill:hover {
  background-color: #e0e0e0;
}

.pill-selected {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
