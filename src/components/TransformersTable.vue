<template>
  <div>
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
import { type Health, type TransformerData } from '../../server/sampleTransformerData'

const { transformersData, visibilityState } = defineProps<{
  transformersData: TransformerData[]
  visibilityState: Record<string, boolean>
}>()

const emit = defineEmits<{
  (event: 'update-visibility', assetId: string, isVisible: boolean): void
}>()

const handleCheckboxChange = (assetId: number, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  emit('update-visibility', assetId.toString(), isChecked)
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
</style>
