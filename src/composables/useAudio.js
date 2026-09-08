import { reactive } from 'vue'
import { AudioManager } from '../services/AudioManager'

const manager = new AudioManager()

export function useAudio() {
  const state = reactive({
    effectEnabled: manager.effectEnabled,
    effectVolume: manager.effectVolume,
    musicEnabled: manager.musicEnabled,
    musicVolume: manager.musicVolume,
  })

  function playEffect(name) { manager.playEffect(name) }
  function toggleEffect(on) { manager.toggleEffect(on); state.effectEnabled = on }
  function setEffectVolume(v) { manager.setEffectVolume(v); state.effectVolume = v }
  function toggleMusic(on) { manager.toggleMusic(on); state.musicEnabled = on }
  function setMusicVolume(v) { manager.setMusicVolume(v); state.musicVolume = v }
  function loadUserMusic(file) { manager.loadUserMusic(file); state.musicEnabled = true }

  return { state, playEffect, toggleEffect, setEffectVolume, toggleMusic, setMusicVolume, loadUserMusic }
}