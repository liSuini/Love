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
.mode-card { background: var(--c-card); border-radius: var(--radius); padding: 28px 24px; cursor: pointer; box-shadow: var(--shadow); border: 2px solid transparent; transition: all 0.3s; text-align: left; position: relative; }
.mode-card:hover { border-color: var(--c-primary); transform: translateY(-3px); }
.mode-card:active { transform: translateY(0); }
.icon { font-size: 40px; margin-bottom: 12px; display: block; }
.name { font-size: 20px; font-weight: 700; margin-bottom: 6px; color: var(--c-primary); }
.desc { font-size: 14px; color: var(--c-muted); }
</style>
