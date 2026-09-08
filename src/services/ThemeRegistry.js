import themes from '../data/themes.json'

export class ThemeRegistry {
  constructor() {
    this.themes = themes
    this.currentId = localStorage.getItem('love-theme') || 'sweet'
    this.apply(this.currentId)
  }

  getThemes() {
    return this.themes
  }

  getCurrent() {
    return this.themes.find(t => t.id === this.currentId) || this.themes[0]
  }

  setTheme(id) {
    this.currentId = id
    localStorage.setItem('love-theme', id)
    this.apply(id)
  }

  apply(id) {
    const theme = this.themes.find(t => t.id === id)
    if (!theme) return
    document.documentElement.dataset.theme = id
    Object.entries(theme.vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }
}