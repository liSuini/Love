<template>
  <div class="mode-card" @click="$emit('select')">
    <span class="icon">{{ mode.icon }}</span>
    <div class="name">{{ mode.name }}</div>
    <div class="desc">{{ mode.description }}</div>
  </div>
</template>

<script setup>
defineProps({ mode: Object })
defineEmits(['select'])
</script>

<style scoped>
.mode-card { background: var(--c-card); border-radius: var(--radius); padding: 18px 20px; cursor: pointer; box-shadow: var(--shadow); border: 2px solid transparent; transition: all 0.3s; text-align: left; position: relative; display: flex; align-items: center; gap: 14px; }
.mode-card:hover { border-color: var(--c-primary); transform: translateY(-3px); }
.mode-card:active { transform: translateY(0); }
.icon { font-size: 36px; flex-shrink: 0; }
.name { font-size: 19px; font-weight: 700; margin-bottom: 3px; color: var(--c-primary); }
.desc { font-size: 13px; color: var(--c-muted); }
</style>
