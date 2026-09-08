<template>
  <div class="theme-switcher" v-if="open">
    <div class="overlay" @click="$emit('close')"></div>
    <div class="panel">
      <h3>🎨 选择主题</h3>
      <button v-for="t in themes" :key="t.id" :class="{ active: t.id === currentId }" @click="selectTheme(t.id)">{{ t.name }}</button>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
const { state, setTheme } = useTheme()
const themes = state.themes
const currentId = state.current.id
defineProps({ open: Boolean })
const emit = defineEmits(['close'])
function selectTheme(id) {
  setTheme(id)
  emit('close')
}
</script>

<style scoped>
.theme-switcher { position: fixed; inset: 0; z-index: 90; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
.panel { position: absolute; top: 60px; right: 20px; background: var(--c-card); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 10px; }
.panel h3 { font-size: 15px; margin-bottom: 6px; color: var(--c-muted); }
.panel button { padding: 10px 20px; border: 1px solid var(--c-border); border-radius: 12px; background: transparent; color: var(--c-text); cursor: pointer; font-size: 14px; transition: all 0.2s; }
.panel button.active { background: var(--c-primary); color: #fff; border-color: var(--c-primary); }
</style>
