import { reactive } from 'vue'
import { ThemeRegistry } from '../services/ThemeRegistry'

const registry = new ThemeRegistry()

export function useTheme() {
  const state = reactive({
    themes: registry.getThemes(),
    current: registry.getCurrent(),
  })

  function setTheme(id) {
    registry.setTheme(id)
    state.current = registry.getCurrent()
  }

  return { state, setTheme }
}