<template>
  <div v-if="hasVisibleItems" ref="plotlyChart" style="width: 100%; height: 500px"></div>
  <div v-else class="empty-state">No items selected - please check some boxes above</div>
</template>

<script lang="ts">
import { onMounted, ref, onBeforeUnmount, watchEffect, type PropType, computed } from 'vue'
import Plotly, { Config } from 'plotly.js-dist'

import type { TransformerData } from '../../server/sampleTransformerData'
import { createLayout, createTrace, getThemeColors } from '@/utils/graph'

const traceColors = ['teal', 'darkgreen', 'orange', 'blue', 'crimson']

export default {
  name: 'VoltageChart',
  props: {
    transformerData: {
      type: Array as PropType<TransformerData[]>,
      required: true,
      validator: (data: TransformerData[]) => data.length > 0,
    },
    dataIndices: {
      type: Object as PropType<Record<string, boolean>>,
      required: true,
    },
    title: {
      type: String,
      default: 'Voltage Readings',
    },
    initialTheme: {
      type: String as PropType<'light' | 'dark' | 'system'>,
      default: 'system',
      validator: (value: string) => ['light', 'dark', 'system'].includes(value),
    },
  },
  setup(props) {
    const { title, transformerData, initialTheme, dataIndices } = props
    const plotlyChart = ref<HTMLDivElement | null>(null)
    const hasVisibleItems = computed(() => {
      return Object.values(dataIndices).some(Boolean)
    })
    const colorSchemeMedia = ref<MediaQueryList | null>(null)
    const isDarkMode = ref(false)

    const renderChart = (): void => {
      if (!plotlyChart.value) return

      const themeColors = getThemeColors(isDarkMode.value)
      const filteredTransformerData = transformerData.filter(
        (transformer) => dataIndices[transformer.assetId],
      )

      const traces = filteredTransformerData.map((transformer) =>
        createTrace({
          name: transformer.name,
          themeColors,
          voltageData: transformer.lastTenVoltgageReadings,
          traceColor: traceColors[transformer.assetId % traceColors.length],
          isDarkMode: isDarkMode.value,
        }),
      )

      const layout = createLayout(themeColors, title)
      const config: Partial<Config> = { responsive: true }

      if (plotlyChart.value.data) {
        Plotly.react(plotlyChart.value, traces, layout, config)
      } else {
        Plotly.newPlot(plotlyChart.value, traces, layout, config)
      }
    }

    const handleThemeChange = (e: MediaQueryListEvent): void => {
      isDarkMode.value = e.matches
    }

    onMounted(() => {
      colorSchemeMedia.value = window.matchMedia('(prefers-color-scheme: dark)')

      isDarkMode.value =
        initialTheme === 'system' ? colorSchemeMedia.value.matches : initialTheme === 'dark'

      colorSchemeMedia.value.addEventListener('change', handleThemeChange)
      renderChart()
    })

    onBeforeUnmount(() => {
      if (colorSchemeMedia.value) {
        colorSchemeMedia.value.removeEventListener('change', handleThemeChange)
      }
    })

    watchEffect(() => {
      renderChart()
    })

    return {
      plotlyChart,
      hasVisibleItems,
    }
  },
}
</script>
