<template>
  <div v-if="hasVisibleItems" ref="plotlyChart" style="width: 100%; height: 500px"></div>
  <div v-else class="empty-state">No items selected - please adjust filters above</div>
</template>

<script lang="ts">
import { ref, watchEffect, type PropType, computed } from 'vue'
// @ts-expect-error Missing declaration file
import Plotly, { type Config, type PlotlyHTMLElement } from 'plotly.js-dist'
import { useDarkModeStore } from '@/stores/darkMode'

import { createLayout, createTrace, getThemeColors } from '@/utils/graph'
import type { TransformerData } from '../../server/sampleTransformerData'
import { storeToRefs } from 'pinia'

const traceColors = ['teal', 'darkgreen', 'orange', 'blue', 'crimson']

export default {
  name: 'VoltageChart',
  props: {
    transformersData: {
      type: Array as PropType<TransformerData[]>,
      validator: (data: TransformerData[]) => data.length > 0,
    },
    title: {
      type: String,
      default: 'Voltage Readings',
    },
  },
  setup(props) {
    const plotlyChart = ref<PlotlyHTMLElement | null>(null)

    const hasVisibleItems = computed(() => {
      return props.transformersData?.length
    })

    const darkModeStore = useDarkModeStore()
    const { isDarkMode } = storeToRefs(darkModeStore)

    const renderChart = (): void => {
      const { title, transformersData } = props

      if (!plotlyChart.value || !transformersData) return

      const themeColors = getThemeColors(isDarkMode.value)

      const traces = transformersData.map((transformer) =>
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
