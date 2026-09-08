<template>
  <div class="game-header">
    <button class="btn-back" @click="$emit('back')">←</button>
    <span class="mode-name">{{ icon }} {{ title }}</span>
    <span class="turn-info" v-if="turnInfo">{{ turnInfo }}</span>
  </div>
</template>

<script setup>
defineProps({ title: String, icon: String, turnInfo: String })
defineEmits(['back'])
</script>

<style scoped>
.game-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding: 12px 16px; background: var(--c-card);
  border-radius: var(--radius); box-shadow: var(--shadow);
}
.mode-name { font-size: 16px; font-weight: 700; color: var(--c-primary); }
.turn-info { font-size: 13px; color: var(--c-muted); }
.btn-back { background: none; border: none; color: var(--c-muted); cursor: pointer; font-size: 20px; min-width: 32px; }
</style>