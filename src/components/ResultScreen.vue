<template>
  <div class="result-screen">
    <div class="result-title">{{ emoji }} {{ title }} {{ emoji }}</div>
    <div class="result-scores">
      <div v-for="p in players" :key="p.id" class="result-player" :class="{ winner: p === winner }">
        <div class="crown">{{ p === winner ? '👑' : icon }}</div>
        <div class="nick">{{ p.nick }}</div>
        <div class="score">{{ p.score }}</div>
      </div>
    </div>
    <div v-if="extra" class="result-extra">{{ extra }}</div>
    <div class="result-summary">{{ summary }}</div>
    <div class="result-actions">
      <button class="btn-primary" @click="$emit('restart')">再来一局</button>
      <button class="btn-secondary" @click="$emit('home')">返回首页</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ emoji: String, title: String, icon: String, players: Array, winner: Object, summary: String, extra: String })
defineEmits(['restart', 'home'])
</script>

<style scoped>
.result-screen { text-align: center; padding: 40px 20px; }
.result-title { font-size: 28px; font-weight: 800; color: var(--c-primary); margin-bottom: 24px; }
.result-scores { display: flex; gap: 20px; justify-content: center; margin-bottom: 28px; }
.result-player { background: var(--c-card); border-radius: var(--radius); padding: 24px 20px; min-width: 140px; box-shadow: var(--shadow); }
.result-player.winner { border: 3px solid var(--c-primary); }
.crown { font-size: 32px; margin-bottom: 8px; }
.nick { font-size: 15px; margin-bottom: 8px; color: var(--c-muted); }
.score { font-size: 36px; font-weight: 800; color: var(--c-primary); }
.result-extra { font-weight: 800; font-size: 22px; color: var(--c-primary); margin-bottom: 12px; }
.result-summary { font-size: 16px; line-height: 1.8; margin-bottom: 28px; }
.result-actions { display: flex; gap: 12px; justify-content: center; }
.btn-primary { background: var(--c-primary); color: #fff; border: none; border-radius: 14px; padding: 14px 40px; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow); }
.btn-secondary { background: transparent; color: var(--c-muted); border: 1px solid var(--c-border); border-radius: 14px; padding: 14px 28px; font-size: 16px; cursor: pointer; }
</style>
