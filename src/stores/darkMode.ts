import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

  return { isDarkMode }
})
