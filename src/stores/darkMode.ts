import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const systemPreferenceListener = (e: MediaQueryListEvent) => {
    isDarkMode.value = e.matches
  }
  mediaQuery.addEventListener('change', systemPreferenceListener)

  return { isDarkMode }
})
