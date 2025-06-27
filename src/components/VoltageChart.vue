<template>
  <div v-if="hasVisibleItems" ref="plotlyChart" style="width: 100%; height: 500px"></div>
  <div v-else class="empty-state">No items selected - please check some boxes above</div>
</template>

<script lang="ts">
import { onMounted, ref, onBeforeUnmount, watchEffect, type PropType, computed } from 'vue'
import Plotly, { Data, Layout, Config } from 'plotly.js-dist-min'

import type { TransformerData, VoltageReading } from '@/api/sampledata'

type ThemeColors = {
  plotBg: string
  paperBg: string
  textColor: string
  gridColor: string
  lineColor: string
  markerColor: string
}

const traceColors = ['teal', 'magenta', 'orange', 'blue', 'yellow', 'cyan']

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
      // validator: (data: number[]) => data.length > 0,
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
      console.log('COMPUTING', Object.values(dataIndices).some(Boolean))
      return Object.values(dataIndices).some(Boolean)
    })
    const colorSchemeMedia = ref<MediaQueryList | null>(null)
    const isDarkMode = ref(false)

    const getThemeColors = (isDark: boolean): ThemeColors => {
      return isDark
        ? {
            plotBg: 'rgba(30, 30, 30, 1)',
            paperBg: 'rgba(20, 20, 20, 1)',
            textColor: 'rgba(255, 255, 255, 0.9)',
            gridColor: 'rgba(100, 100, 100, 0.3)',
            lineColor: 'rgba(200, 200, 200, 0.2)',
            markerColor: 'rgb(100, 200, 255)',
          }
        : {
            plotBg: 'rgba(240, 240, 240, 0.8)',
            paperBg: 'rgba(255, 255, 255, 1)',
            textColor: 'rgba(0, 0, 0, 0.9)',
            gridColor: 'rgba(0, 0, 0, 0.1)',
            lineColor: 'rgba(0, 0, 0, 0.2)',
            markerColor: 'rgb(55, 128, 191)',
          }
    }

    const createTrace = ({
      name,
      themeColors,
      voltageData,
      traceColor,
    }: {
      name: string
      themeColors: ThemeColors
      voltageData: VoltageReading[]
      traceColor: string
    }): Data => ({
      x: voltageData.map((item) => new Date(item.timestamp)),
      y: voltageData.map((item) => Number(item.voltage)),
      type: 'scatter',
      mode: 'lines+markers',
      marker: {
        color: themeColors.markerColor,
        size: 8,
        line: {
          color: isDarkMode.value ? 'rgba(30, 30, 30, 1)' : 'white',
          width: 1,
        },
      },
      line: {
        color: traceColor,
        width: 2,
      },
      name,
    })

    const createLayout = (colors: ThemeColors): Partial<Layout> => ({
      title: {
        text: title,
        font: {
          color: colors.textColor,
        },
      },
      plot_bgcolor: colors.plotBg,
      paper_bgcolor: colors.paperBg,
      font: {
        color: colors.textColor,
      },
      xaxis: {
        title: 'Date',
        type: 'date',
        tickformat: '%Y-%m-%d',
        gridcolor: colors.gridColor,
        linecolor: colors.lineColor,
        zerolinecolor: colors.lineColor,
      },
      yaxis: {
        title: 'Voltage (V)',
        gridcolor: colors.gridColor,
        linecolor: colors.lineColor,
        zerolinecolor: colors.lineColor,
      },
      hovermode: 'closest',
      showlegend: true,
      margin: { l: 50, r: 30, b: 50, t: 50, pad: 4 },
    })

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
        }),
      )

      const layout = createLayout(themeColors)
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
