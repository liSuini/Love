<template>
  <div class="card-overlay" :class="{ show: visible }" @click.self="$emit('close')">
    <div class="card-box">
      <span class="card-type" :class="cardType">{{ typeEmoji }} {{ typeName }}</span>
      <div class="card-content">{{ content }}</div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ visible: Boolean, cardType: String, content: String })
defineEmits(['close'])

const typeNames = { task: '任务卡', truth: '真心话', punishment: '惩罚卡', bonus: '奖励卡', event: '转盘事件' }
const typeEmojis = { task: '💋', truth: '💬', punishment: '🔥', bonus: '🎁', event: '🎡' }
const typeName = computed(() => typeNames[props.cardType] || '')
const typeEmoji = computed(() => typeEmojis[props.cardType] || '')
</script>

<style scoped>
.card-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 100; opacity: 0;
  pointer-events: none; transition: opacity 0.3s;
}
.card-overlay.show { opacity: 1; pointer-events: auto; }
.card-box {
  background: var(--c-card); border-radius: var(--radius); width: 85%; max-width: 400px;
  padding: 36px 28px; text-align: center; box-shadow: var(--shadow);
  transform: rotateY(90deg) scale(0.8); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.card-overlay.show .card-box { transform: rotateY(0) scale(1); }
.card-type {
  font-size: 14px; color: #fff; padding: 4px 16px; border-radius: 20px;
  margin: 0 auto 20px; display: inline-block; font-weight: 600;
}
.card-type.task { background: #ff6b9d; }
.card-type.truth { background: #4ecdc4; }
.card-type.punishment { background: #f5576c; }
.card-type.bonus { background: #ffd93d; color: #333; }
.card-type.event { background: var(--c-primary); }
.card-content {
  font-size: 20px; line-height: 1.6; font-weight: 500; margin-bottom: 28px; min-height: 80px;
}
</style>