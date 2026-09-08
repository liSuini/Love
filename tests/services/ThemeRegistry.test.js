import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeRegistry } from '../../src/services/ThemeRegistry'

describe('ThemeRegistry', () => {
  let registry
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    registry = new ThemeRegistry()
  })

  it('getThemes() 返回至少 3 套主题', () => {
    const themes = registry.getThemes()
    expect(themes.length).toBeGreaterThanOrEqual(3)
    expect(themes[0]).toHaveProperty('id')
    expect(themes[0]).toHaveProperty('name')
  })

  it('setTheme() 设置 data-theme 属性', () => {
    registry.setTheme('midnight')
    expect(document.documentElement.dataset.theme).toBe('midnight')
  })

  it('setTheme() 持久化到 localStorage', () => {
    registry.setTheme('rainbow')
    expect(localStorage.getItem('love-theme')).toBe('rainbow')
  })

  it('getCurrent() 返回上次保存的主题', () => {
    localStorage.setItem('love-theme', 'midnight')
    const reg = new ThemeRegistry()
    expect(reg.getCurrent().id).toBe('midnight')
  })
})