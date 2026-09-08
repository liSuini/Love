import { describe, it, expect, beforeEach } from 'vitest'
import { AudioManager } from '../../src/services/AudioManager'

describe('AudioManager', () => {
  let audio
  beforeEach(() => {
    localStorage.clear()
    audio = new AudioManager()
  })

  it('toggleEffect(false) 后 effectEnabled 为 false', () => {
    audio.toggleEffect(false)
    expect(audio.effectEnabled).toBe(false)
  })

  it('setEffectVolume 存储值', () => {
    audio.setEffectVolume(0.5)
    expect(audio.effectVolume).toBe(0.5)
  })

  it('偏好持久化到 localStorage', () => {
    audio.setEffectVolume(0.3)
    audio.setMusicVolume(0.7)
    audio.toggleMusic(true)
    const raw = JSON.parse(localStorage.getItem('love-audio'))
    expect(raw.effectVolume).toBe(0.3)
    expect(raw.musicVolume).toBe(0.7)
    expect(raw.musicEnabled).toBe(true)
  })
})