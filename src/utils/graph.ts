import { Data, Layout } from 'plotly.js-dist'
import type { VoltageReading } from '../../server/sampleTransformerData'

export type ThemeColors = {
  plotBg: string
  paperBg: string
  textColor: string
  gridColor: string
  lineColor: string
  markerColor: string
}

export const getThemeColors = (isDark: boolean): ThemeColors => {
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

export const createLayout = (colors: ThemeColors, title: string): Partial<Layout> => ({
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

export const createTrace = ({
  name,
  themeColors,
  voltageData,
  traceColor,
  isDarkMode,
}: {
  name: string
  themeColors: ThemeColors
  voltageData: VoltageReading[]
  traceColor: string
  isDarkMode: boolean
}): Data => ({
  x: voltageData.map((item) => new Date(item.timestamp)),
  y: voltageData.map((item) => Number(item.voltage)),
  type: 'scatter',
  mode: 'lines+markers',
  marker: {
    color: themeColors.markerColor,
    size: 8,
    line: {
      color: isDarkMode ? 'rgba(30, 30, 30, 1)' : 'white',
      width: 1,
    },
  },
  line: {
    color: traceColor,
    width: 2,
  },
  name,
})
