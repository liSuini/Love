<template>
  <div class="player-card" :class="{ active: isActive }">
    <div class="avatar-wrap">
      <img :src="player.id === 'p1' ? luluImg : lumeiImg" :alt="player.nick" class="avatar-img" />
    </div>
    <div class="nick">{{ player.nick }}</div>
    <div class="score">{{ player.score }}</div>
    <div v-if="player.combo >= 2" class="combo-badge">连击 {{ player.combo }}🔥</div>
  </div>
</template>

<script setup>
import luluImg from '../assets/avatars/lulu.jpg'
import lumeiImg from '../assets/avatars/lumei.jpg'

defineProps({ player: Object, isActive: Boolean })
</script>

<style scoped>
.player-card {
  flex: 1; background: var(--c-card); border-radius: var(--radius); padding: 12px 16px;
  text-align: center; box-shadow: var(--shadow); border: 2px solid transparent;
  transition: all 0.3s; position: relative;
}
.player-card.active { border-color: var(--c-primary); animation: pulse 2s ease infinite; }
.avatar-wrap {
  width: 48px; height: 48px; margin: 0 auto 6px; border-radius: 50%; overflow: hidden;
  border: 2px solid var(--c-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.nick { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.score { font-size: 28px; font-weight: 800; color: var(--c-primary); }
.combo-badge {
  position: absolute; top: -8px; right: -8px; background: var(--c-secondary);
  color: #333; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700;
}
</style>
