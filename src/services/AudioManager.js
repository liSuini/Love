export class AudioManager {
  constructor() {
    const saved = JSON.parse(localStorage.getItem('love-audio') || '{}')
    this.effectEnabled = saved.effectEnabled !== false
    this.effectVolume = saved.effectVolume ?? 0.7
    this.musicEnabled = saved.musicEnabled ?? false
    this.musicVolume = saved.musicVolume ?? 0.3
    this.musicSrc = saved.musicSrc ?? null
    this.musicAudio = null
    this._initMusic()
  }

  _save() {
    localStorage.setItem('love-audio', JSON.stringify({
      effectEnabled: this.effectEnabled,
      effectVolume: this.effectVolume,
      musicEnabled: this.musicEnabled,
      musicVolume: this.musicVolume,
      musicSrc: this.musicSrc,
    }))
  }

  _initMusic() {
    if (this.musicAudio) return
    this.musicAudio = new Audio()
    this.musicAudio.loop = true
    this.musicAudio.volume = this.musicVolume
  }

  playEffect(name) {
    if (!this.effectEnabled) return
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.value = this.effectVolume * 0.3
      const freqs = { dice: 400, card: 600, score: 800, combo: 1000, wheel: 500 }
      osc.frequency.value = freqs[name] || 700
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
      osc.onended = () => ctx.close()
    } catch (e) { /* AudioContext not available */ }
  }

  playMusic(url) {
    this._initMusic()
    this.musicAudio.src = url
    this.musicAudio.volume = this.musicVolume
    if (this.musicEnabled) this.musicAudio.play().catch(() => {})
    this.musicSrc = url
    this._save()
  }

  stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause()
      this.musicAudio.currentTime = 0
    }
  }

  setEffectVolume(v) { this.effectVolume = v; this._save() }

  setMusicVolume(v) {
    this.musicVolume = v
    if (this.musicAudio) this.musicAudio.volume = v
    this._save()
  }

  toggleEffect(on) { this.effectEnabled = on; this._save() }

  toggleMusic(on) {
    this.musicEnabled = on
    if (on && this.musicAudio?.src) {
      this.musicAudio.play().catch(() => {})
    } else {
      this.musicAudio?.pause()
    }
    this._save()
  }

  loadUserMusic(file) {
    const url = URL.createObjectURL(file)
    this.playMusic(url)
  }
}