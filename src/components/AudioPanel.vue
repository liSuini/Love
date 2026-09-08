<template>
  <div class="audio-panel" v-if="open">
    <div class="overlay" @click="$emit('close')"></div>
    <div class="panel">
      <h3>🔊 音频设置</h3>
      <label>音效 <input type="checkbox" :checked="state.effectEnabled" @change="toggleEffect($event.target.checked)"></label>
      <label v-if="state.effectEnabled">音量 <input type="range" min="0" max="1" step="0.1" :value="state.effectVolume" @input="setEffectVolume(parseFloat($event.target.value))"></label>
      <hr>
      <label>背景音乐 <input type="checkbox" :checked="state.musicEnabled" @change="toggleMusic($event.target.checked)"></label>
      <label v-if="state.musicEnabled">音量 <input type="range" min="0" max="1" step="0.1" :value="state.musicVolume" @input="setMusicVolume(parseFloat($event.target.value))"></label>
      <label class="upload">🎵 上传音乐 <input type="file" accept="audio/*" @change="onUpload"></label>
    </div>
  </div>
</template>

<script setup>
import { useAudio } from '../composables/useAudio'
const { state, toggleEffect, setEffectVolume, toggleMusic, setMusicVolume, loadUserMusic } = useAudio()
defineProps({ open: Boolean })
defineEmits(['close'])
function onUpload(e) { if (e.target.files[0]) loadUserMusic(e.target.files[0]) }
</script>

<style scoped>
.audio-panel { position: fixed; inset: 0; z-index: 90; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
.panel { position: absolute; top: 60px; right: 20px; background: var(--c-card); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 12px; min-width: 260px; }
.panel h3 { font-size: 15px; margin-bottom: 6px; color: var(--c-muted); }
.panel label { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.panel hr { border: none; border-top: 1px solid var(--c-border); margin: 4px 0; }
.panel input[type=range] { flex: 1; }
.upload { color: var(--c-primary); cursor: pointer; }
.upload input[type=file] { display: none; }
</style>
