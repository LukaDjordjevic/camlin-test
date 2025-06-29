<template>
  <div v-if="hasVisibleItems" ref="plotlyChart" style="width: 100%; height: 300px"></div>
  <div v-else>No items selected - please adjust filters above</div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
// @ts-expect-error - Missing type declaration
import Plotly, { type Config, type PlotlyHTMLElement } from 'plotly.js-dist'
import { useDarkModeStore } from '@/stores/darkMode'
import { storeToRefs } from 'pinia'
import { createLayout, createTrace, getThemeColors } from '@/utils/graph'
import type { TransformerData } from '../../server/sampleTransformerData'

const traceColors = ['teal', 'darkgreen', 'orange', 'blue', 'crimson']

const props = defineProps<{
  transformersData: TransformerData[]
  title?: string
}>()

defineOptions({
  name: 'VoltageChart',
})

const plotlyChart = ref<PlotlyHTMLElement | null>(null)
const hasVisibleItems = computed(() => props.transformersData?.length > 0)

const darkModeStore = useDarkModeStore()
const { isDarkMode } = storeToRefs(darkModeStore)

watchEffect(() => {
  if (!plotlyChart.value || !props.transformersData) return

  const themeColors = getThemeColors(isDarkMode.value)
  const traces = props.transformersData.map((transformer) =>
    createTrace({
      name: transformer.name,
      themeColors,
      voltageData: transformer.lastTenVoltgageReadings,
      traceColor: traceColors[Number(transformer.assetId) % traceColors.length],
      isDarkMode: isDarkMode.value,
    }),
  )

  const layout = createLayout(themeColors, props.title ?? 'Voltage Readings')
  const config: Partial<Config> = { responsive: true }

  if (plotlyChart.value.data) {
    Plotly.react(plotlyChart.value, traces, layout, config)
  } else {
    Plotly.newPlot(plotlyChart.value, traces, layout, config)
  }
})
</script>
