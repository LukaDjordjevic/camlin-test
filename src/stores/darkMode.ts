import { defineStore } from 'pinia'
import { ref, onScopeDispose } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const isDarkMode = ref(mediaQuery.matches)

  // Handler for when system preference changes
  const systemPreferenceListener = (e: MediaQueryListEvent) => {
    isDarkMode.value = e.matches
  }

  mediaQuery.addEventListener('change', systemPreferenceListener)

  const unsubscribe = () => {
    mediaQuery.removeEventListener('change', systemPreferenceListener)
  }

  onScopeDispose(() => {
    unsubscribe()
  })

  return {
    isDarkMode,
    unsubscribe,
  }
})
