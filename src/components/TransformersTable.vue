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
        placeholder="Filter by transformer name..."
        class="search-input"
        :class="{ 'dark-mode-input': isDarkMode }"
      />
    </div>

    <!-- Region Filter Pills -->
    <div class="filter-section">
      <label>Region:</label>
      <div class="pill-container">
        <button
          v-for="region in allRegions"
          :key="region"
          :class="[
            'pill',
            { 'dark-mode-pill': isDarkMode },
            { 'pill-selected': regionFilter?.includes(region) },
          ]"
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
          :class="[
            'pill',
            { 'dark-mode-pill': isDarkMode },
            ,
            { 'pill-selected': healthFilter?.includes(health) },
          ]"
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
          <th>Show in graph</th>
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
              :class="{ 'dark-mode-input': isDarkMode }"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Region } from '../../server/sampleTransformerData'
import { type Health, type TransformerData } from '../../server/sampleTransformerData'
import { useDarkModeStore } from '@/stores/darkMode'

const darkModeStore = useDarkModeStore()
const { isDarkMode } = storeToRefs(darkModeStore)

defineProps<{
  transformersData?: TransformerData[]
  visibilityState: Record<string, boolean>
  searchFilter: string
  regionFilter: Region[]
  healthFilter: Health[]
}>()

const emit = defineEmits<{
  (event: 'update-visibility', assetId: string, isVisible: boolean): void
  (event: 'update-search', searchString: string): void
  (event: 'update-region', region: Region): void
  (event: 'update-health', health: Health): void
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
  emit('update-region', region)
}

const toggleHealth = (health: Health) => {
  emit('update-health', health)
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
h2 {
  margin-bottom: 16px;
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

.filter-section {
  margin-bottom: 15px;
}

label {
  margin-right: 6px;
}

.filter-section {
  display: flex;
  gap: 8px;
}

.dark-mode-input {
  background-color: #2d3748;
  color: #f7fafc;
  border-color: #4a5568;
}

.search-input {
  padding: 6px 12px;
  border: 1px solid #575757;
  border-radius: 8px;
  width: 300px;
  font-size: 14px;
}

.pill-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  padding: 3px 8px;
  border-radius: 8px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.pill-selected {
  background-color: #0163cc !important;
  color: white !important;
  border-color: #007bff;
}

.dark-mode-pill {
  background-color: #2d3748;
  color: #9dabc5;
  border-color: #3e4e64;
}

.pill:hover {
  background-color: #d4d4d4;
}

.dark-mode-pill:hover {
  background-color: #2d3748;
  color: #ffffff;
}
</style>
