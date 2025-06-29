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
