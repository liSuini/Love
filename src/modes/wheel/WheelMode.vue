<template>
  <div class="wheel-mode">
    <ScoreBoard icon="🎡" title="命运大转盘" @back="goHome" />

    <div class="wheel-container">
      <div class="wheel-wrapper">
        <div class="wheel-pointer"></div>
        <div class="wheel" :style="{ background: conicGradient, transform: `rotate(${rotation}deg)` }">
          <span
            v-for="(e, i) in events"
            :key="e.id"
            class="wheel-label"
            :style="labelStyle(i)"
          >{{ e.label }}</span>
          <div class="wheel-center">💖</div>
        </div>
      </div>
      <button class="btn-primary" :disabled="spinning" @click="spin">{{ spinning ? '转动中...' : '转动转盘' }}</button>
    </div>

    <CardModal :visible="cardVisible" cardType="event" :content="currentEvent?.description" @close="cardVisible = false">
      <template #actions>
        <div class="card-actions">
          <button class="btn-done" @click="closeCard">完成</button>
        </div>
      </template>
    </CardModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../../composables/useAudio'
import wheelEvents from '../../data/wheel-events.json'
import ScoreBoard from '../../components/ScoreBoard.vue'
import CardModal from '../../components/CardModal.vue'

const router = useRouter()
const { playEffect } = useAudio()

const events = ref([])
const rotation = ref(0)
const spinning = ref(false)
const cardVisible = ref(false)
const currentEvent = ref(null)

const segAngle = computed(() => 360 / events.value.length)

const conicGradient = computed(() => {
  const seg = segAngle.value
  return events.value.map((e, i) =>
    `${e.color} ${i * seg}deg ${(i + 1) * seg}deg`
  ).join(', ')
})

function labelStyle(i) {
  const angle = i * segAngle.value + segAngle.value / 2
  const rad = (angle - 90) * Math.PI / 180
  const x = 42 + 35 * Math.cos(rad)
  const y = 42 + 35 * Math.sin(rad)
  return {
    left: `${x}%`,
    top: `${y}%`,
  }
}

onMounted(() => {
  events.value = [...wheelEvents].sort(() => Math.random() - 0.5)
})

function goHome() { router.push('/') }

function spin() {
  spinning.value = true
  playEffect('wheel')
  const segCount = events.value.length
  const targetIdx = Math.floor(Math.random() * segCount)
  const targetAngle = -(targetIdx * segAngle.value + segAngle.value / 2)
  rotation.value += 360 * 5 + (targetAngle - (rotation.value % 360))

  setTimeout(() => {
    const event = events.value[targetIdx]
    if (event.eventType === 'respin') {
      spinning.value = false
      return
    }
    currentEvent.value = event
    cardVisible.value = true
    playEffect('card')
  }, 4200)
}

function closeCard() {
  cardVisible.value = false
  spinning.value = false
}
</script>

<style scoped>
.wheel-mode { padding: 16px 20px; }
.wheel-container { text-align: center; padding: 40px 0; }
.wheel-wrapper { position: relative; width: 280px; height: 280px; margin: 0 auto 30px; }
.wheel-pointer {
  position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
  width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent;
  border-top: 20px solid var(--c-primary); z-index: 10;
}
.wheel {
  width: 100%; height: 100%; border-radius: 50%;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  box-shadow: var(--shadow); position: relative;
  border: 4px solid var(--c-card);
}
.wheel-label {
  position: absolute; transform: translate(-50%, -50%);
  font-size: 13px; font-weight: 700; color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5); white-space: nowrap;
}
.wheel-center {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 50px; height: 50px; background: var(--c-card); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 14px 40px; font-size: 18px; font-weight: 700; cursor: pointer;
  box-shadow: var(--shadow); transition: all 0.2s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.card-actions { display: flex; gap: 12px; justify-content: center; }
.card-actions button {
  padding: 10px 28px; border-radius: 12px; border: none; font-size: 15px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-done { background: var(--c-primary); color: #fff; }
</style>
