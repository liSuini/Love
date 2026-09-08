<template>
  <div class="player-card" :class="{ active: isActive }">
    <div class="emoji">{{ player.id === 'p1' ? '🧑' : '💕' }}</div>
    <div class="nick">{{ player.nick }}</div>
    <div class="score">{{ player.score }}</div>
    <div v-if="player.combo >= 2" class="combo-badge">连击 {{ player.combo }}🔥</div>
  </div>
</template>

<script setup>
defineProps({ player: Object, isActive: Boolean })
</script>

<style scoped>
.player-card {
  flex: 1; background: var(--c-card); border-radius: var(--radius); padding: 16px;
  text-align: center; box-shadow: var(--shadow); border: 2px solid transparent;
  transition: all 0.3s; position: relative;
}
.player-card.active { border-color: var(--c-primary); animation: pulse 2s ease infinite; }
.emoji { font-size: 32px; margin-bottom: 6px; }
.nick { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.score { font-size: 28px; font-weight: 800; color: var(--c-primary); }
.combo-badge {
  position: absolute; top: -8px; right: -8px; background: var(--c-secondary);
  color: #333; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700;
}
</style>