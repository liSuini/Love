<template>
  <div class="whack-mode">
    <ScoreBoard icon="🔨" title="打地鼠竞速" :turnInfo="timeLeft > 0 ? `${timeLeft}s` : '结束'" @back="goHome" />

    <!-- 比分板 -->
    <div class="score-bar">
      <div class="player-tag" :class="{ active: phase === 'running' }">
        <img :src="luluImg" class="tag-avatar" />
        <span class="tag-name">噜噜</span>
        <span class="tag-score">{{ scores[0] }}</span>
      </div>
      <span class="vs">VS</span>
      <div class="player-tag" :class="{ active: phase === 'running' }">
        <span class="tag-score">{{ scores[1] }}</span>
        <span class="tag-name">噜妹</span>
        <img :src="lumeiImg" class="tag-avatar" />
      </div>
    </div>

    <!-- 倒计时显示 -->
    <div class="timer-bar">
      <div class="timer-fill" :style="{ width: timerPercent + '%' }"></div>
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <!-- 游戏区域 -->
    <div class="whack-main">
      <!-- 噜噜的区 -->
      <div class="whack-zone">
        <div class="zone-label">
          <img :src="luluImg" class="zone-avatar" />
          <span>噜噜</span>
        </div>
        <div class="mole-grid">
          <div
            v-for="i in 9" :key="'p0-' + i"
            class="mole-hole"
            :class="{ up: moles[0][i - 1] >= 0, bonk: moles[0][i - 1] === -1 }"
            @click="whack(0, i - 1)"
          >
            <div class="mole-character" v-if="moles[0][i - 1] >= 0">🐹</div>
            <div class="bonk-effect" v-if="moles[0][i - 1] === -1">💥</div>
          </div>
        </div>
      </div>

      <!-- 噜妹的区 -->
      <div class="whack-zone">
        <div class="zone-label">
          <img :src="lumeiImg" class="zone-avatar" />
          <span>噜妹</span>
        </div>
        <div class="mole-grid">
          <div
            v-for="i in 9" :key="'p1-' + i"
            class="mole-hole"
            :class="{ up: moles[1][i - 1] >= 0, bonk: moles[1][i - 1] === -1 }"
            @click="whack(1, i - 1)"
          >
            <div class="mole-character" v-if="moles[1][i - 1] >= 0">🐰</div>
            <div class="bonk-effect" v-if="moles[1][i - 1] === -1">💥</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作 -->
    <div class="actions" v-if="phase !== 'running'">
      <button v-if="phase === 'ready' || phase === 'ended'" class="btn-primary" @click="startGame">
        {{ phase === 'ended' ? '再来一局' : '开始游戏' }}
      </button>
      <button class="btn-secondary" @click="goHome">返回首页</button>
    </div>

    <!-- 结算 -->
    <transition name="fade">
      <div v-if="phase === 'ended'" class="result-overlay" @click="phase = 'ready'">
        <div class="result-card" @click.stop>
          <div class="result-emoji">{{ winner === -1 ? '🤝' : '🎉' }}</div>
          <div class="result-title">{{ winner === -1 ? '平局！' : `${winner === 0 ? '噜噜' : '噜妹'}赢了！` }}</div>
          <div class="result-detail">噜噜 {{ scores[0] }} : {{ scores[1] }} 噜妹</div>
          <div class="result-actions">
            <button class="btn-primary" @click="startGame">再来一局</button>
            <button class="btn-secondary" @click="goHome">返回首页</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ScoreBoard from '../../components/ScoreBoard.vue'
import luluImg from '../../assets/avatars/lulu.jpg'
import lumeiImg from '../../assets/avatars/lumei.jpg'

const router = useRouter()
const GAME_TIME = 30
const MOLE_UP_MIN = 600
const MOLE_UP_MAX = 1200
const SPAWN_MIN = 300
const SPAWN_MAX = 800

const phase = ref('ready') // ready | running | ended
const scores = ref([0, 0])
const timeLeft = ref(GAME_TIME)
const moles = ref([Array(9).fill(-2), Array(9).fill(-2)]) // -2=空, >=0=显示中, -1=被打
const winner = ref(null)

let gameTimer = null
let spawnTimers = [null, null]
let moleTimers = [Array(9).fill(null), Array(9).fill(null)]

const timerPercent = computed(() => (timeLeft.value / GAME_TIME) * 100)

function goHome() {
  cleanup()
  router.push('/')
}

function startGame() {
  cleanup()
  scores.value = [0, 0]
  timeLeft.value = GAME_TIME
  moles.value = [Array(9).fill(-2), Array(9).fill(-2)]
  phase.value = 'running'
  winner.value = null

  // 发出地鼠
  scheduleSpawn(0)
  scheduleSpawn(1)

  // 倒计时
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)
}

function scheduleSpawn(playerIdx) {
  if (phase.value !== 'running') return
  const delay = Math.random() * (SPAWN_MAX - SPAWN_MIN) + SPAWN_MIN
  spawnTimers[playerIdx] = setTimeout(() => {
    if (phase.value !== 'running') return
    // 找空穴
    const empty = []
    for (let i = 0; i < 9; i++) {
      if (moles.value[playerIdx][i] === -2) empty.push(i)
    }
    if (empty.length > 0) {
      const idx = empty[Math.floor(Math.random() * empty.length)]
      moles.value[playerIdx][idx] = Date.now()

      // 自动消失
      const upTime = Math.random() * (MOLE_UP_MAX - MOLE_UP_MIN) + MOLE_UP_MIN
      moleTimers[playerIdx][idx] = setTimeout(() => {
        if (moles.value[playerIdx][idx] >= 0) {
          moles.value[playerIdx][idx] = -2
        }
      }, upTime)
    }
    scheduleSpawn(playerIdx)
  }, delay)
}

function whack(playerIdx, holeIdx) {
  if (phase.value !== 'running') return
  if (moles.value[playerIdx][holeIdx] < 0) return // 空穴或已打

  moles.value[playerIdx][holeIdx] = -1
  scores.value[playerIdx]++

  // 清除消失定时器
  if (moleTimers[playerIdx][holeIdx]) {
    clearTimeout(moleTimers[playerIdx][holeIdx])
    moleTimers[playerIdx][holeIdx] = null
  }

  // 显示打击效果
  setTimeout(() => {
    if (moles.value[playerIdx][holeIdx] === -1) {
      moles.value[playerIdx][holeIdx] = -2
    }
  }, 300)
}

function endGame() {
  phase.value = 'ended'
  if (scores.value[0] > scores.value[1]) winner.value = 0
  else if (scores.value[1] > scores.value[0]) winner.value = 1
  else winner.value = -1
  cleanup()
}

function cleanup() {
  if (gameTimer) { clearInterval(gameTimer); gameTimer = null }
  for (let p = 0; p < 2; p++) {
    if (spawnTimers[p]) { clearTimeout(spawnTimers[p]); spawnTimers[p] = null }
    for (let i = 0; i < 9; i++) {
      if (moleTimers[p][i]) { clearTimeout(moleTimers[p][i]); moleTimers[p][i] = null }
    }
  }
}

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.whack-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }

.score-bar {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  margin-bottom: 10px; flex-shrink: 0;
}
.player-tag {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border-radius: 14px; background: var(--c-card); box-shadow: var(--shadow);
  border: 2px solid transparent; transition: all 0.3s; opacity: 0.6;
}
.player-tag.active { border-color: var(--c-primary); opacity: 1; }
.tag-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.tag-name { font-size: 14px; font-weight: 600; color: var(--c-text); }
.tag-score { font-size: 22px; font-weight: 800; color: var(--c-primary); min-width: 28px; text-align: center; }
.vs { font-size: 13px; font-weight: 700; color: var(--c-muted); }

.timer-bar {
  position: relative; width: 100%; max-width: 400px; height: 28px; margin: 0 auto 16px;
  background: var(--c-card); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow);
}
.timer-fill {
  position: absolute; inset: 0; background: linear-gradient(90deg, var(--c-primary), var(--c-secondary));
  transition: width 1s linear; border-radius: 14px;
}
.timer-text {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.whack-main {
  flex: 1; display: flex; gap: 12px; justify-content: center; align-items: flex-start;
  flex-wrap: wrap;
}
.whack-zone {
  flex: 1; min-width: 140px; max-width: 200px; display: flex; flex-direction: column; gap: 10px;
}
.zone-label {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  font-size: 14px; font-weight: 700; color: var(--c-text);
}
.zone-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }

.mole-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
}
.mole-hole {
  aspect-ratio: 1; background: radial-gradient(circle at 50% 70%, #8b7355, #6b5535);
  border-radius: 50%; position: relative; cursor: pointer; overflow: hidden;
  display: flex; align-items: flex-end; justify-content: center;
  box-shadow: inset 0 -4px 8px rgba(0,0,0,0.4);
  transition: transform 0.1s;
}
.mole-hole:active { transform: scale(0.95); }
.mole-hole.up { box-shadow: inset 0 -4px 8px rgba(0,0,0,0.4), 0 0 12px rgba(255,217,61,0.4); }
.mole-hole.bonk { box-shadow: inset 0 -4px 8px rgba(0,0,0,0.4), 0 0 16px rgba(255,107,157,0.5); }

.mole-character {
  font-size: clamp(24px, 6vw, 36px); animation: moleUp 0.2s ease;
  padding-bottom: 4px;
}
@keyframes moleUp {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
.bonk-effect {
  font-size: clamp(24px, 6vw, 36px); animation: bonk 0.3s ease;
}
@keyframes bonk {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(0); }
}

.actions { display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-shrink: 0; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 12px 28px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow);
}
.btn-secondary {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 22px; font-size: 16px; cursor: pointer;
}

.result-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 100; padding: 20px;
}
.result-card {
  background: var(--c-card); border-radius: 24px; padding: 36px 28px; text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2); max-width: 320px; width: 100%;
}
.result-emoji { font-size: 56px; margin-bottom: 12px; }
.result-title { font-size: 24px; font-weight: 800; color: var(--c-primary); margin-bottom: 8px; }
.result-detail { font-size: 16px; color: var(--c-muted); margin-bottom: 20px; }
.result-actions { display: flex; gap: 12px; justify-content: center; }

.fade-enter-active, .fade-leave-active { transition: all 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
