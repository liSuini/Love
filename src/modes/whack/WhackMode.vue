<template>
  <div class="whack-mode">
    <ScoreBoard icon="🔨" title="打地鼠竞速" :turnInfo="phase === 'running' ? `${timeLeft}s` : (phase === 'switching' ? '换人' : '准备')" @back="goHome" />

    <!-- 比分板 -->
    <div class="score-bar">
      <div class="player-tag" :class="{ active: currentPlayer === 0 && phase === 'running' }">
        <img :src="luluImg" class="tag-avatar" />
        <span class="tag-name">噜噜</span>
        <span class="tag-score">{{ scores[0] }}</span>
      </div>
      <span class="vs">VS</span>
      <div class="player-tag" :class="{ active: currentPlayer === 1 && phase === 'running' }">
        <span class="tag-score">{{ scores[1] }}</span>
        <span class="tag-name">噜妹</span>
        <img :src="lumeiImg" class="tag-avatar" />
      </div>
    </div>

    <!-- 倒计时条 -->
    <div class="timer-bar">
      <div class="timer-fill" :style="{ width: timerPercent + '%' }"></div>
      <span class="timer-text">{{ phase === 'running' ? `${timeLeft}s` : '' }}</span>
    </div>

    <!-- 当前玩家提示 -->
    <div class="turn-hint" v-if="phase === 'running'">
      <img :src="currentPlayer === 0 ? luluImg : lumeiImg" class="turn-avatar" />
      <span>{{ currentPlayer === 0 ? '噜噜' : '噜妹' }} 的回合</span>
    </div>

    <!-- 换人提示 -->
    <transition name="fade">
      <div v-if="phase === 'switching'" class="switch-overlay" @click="startP2">
        <div class="switch-card" @click.stop>
          <img :src="lumeiImg" class="switch-avatar" />
          <div class="switch-text">噜噜打了 {{ scores[0] }} 分</div>
          <div class="switch-sub">轮到噜妹了！</div>
          <button class="btn-primary" @click="startP2">开始</button>
        </div>
      </div>
    </transition>

    <!-- 游戏区域（单个棋盘） -->
    <div class="whack-main">
      <div class="whack-zone">
        <div class="zone-label">
          <img :src="currentPlayer === 0 ? luluImg : lumeiImg" class="zone-avatar" />
          <span>{{ currentPlayer === 0 ? '噜噜' : '噜妹' }}</span>
          <span class="zone-char">{{ currentPlayer === 0 ? '🐹' : '🐰' }}</span>
        </div>
        <div class="mole-grid">
          <div
            v-for="i in 9" :key="i"
            class="mole-hole"
            :class="{ up: moles[i - 1] >= 0, bonk: moles[i - 1] === -1, disabled: phase !== 'running' }"
            @click="whack(i - 1)"
          >
            <div class="mole-character" v-if="moles[i - 1] >= 0">{{ currentPlayer === 0 ? '🐹' : '🐰' }}</div>
            <div class="bonk-effect" v-if="moles[i - 1] === -1">💥</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作 -->
    <div class="actions" v-if="phase === 'ready' || phase === 'ended'">
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
const TURN_TIME = 15
const MOLE_UP_MIN = 600
const MOLE_UP_MAX = 1200
const SPAWN_MIN = 300
const SPAWN_MAX = 800

const phase = ref('ready') // ready | running | switching | ended
const currentPlayer = ref(0)
const scores = ref([0, 0])
const timeLeft = ref(TURN_TIME)
const moles = ref(Array(9).fill(-2)) // -2=空, >=0=显示中, -1=被打
const winner = ref(null)

let gameTimer = null
let spawnTimer = null
let moleTimers = Array(9).fill(null)

const timerPercent = computed(() => (timeLeft.value / TURN_TIME) * 100)

function goHome() {
  cleanup()
  router.push('/')
}

function clearMoles() {
  moles.value = Array(9).fill(-2)
  for (let i = 0; i < 9; i++) {
    if (moleTimers[i]) { clearTimeout(moleTimers[i]); moleTimers[i] = null }
  }
}

function startGame() {
  cleanup()
  scores.value = [0, 0]
  currentPlayer.value = 0
  startTurn()
}

function startTurn() {
  clearMoles()
  timeLeft.value = TURN_TIME
  phase.value = 'running'
  scheduleSpawn()

  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endTurn()
    }
  }, 1000)
}

function endTurn() {
  cleanup()
  clearMoles()
  if (currentPlayer.value === 0) {
    phase.value = 'switching'
  } else {
    endGame()
  }
}

function startP2() {
  currentPlayer.value = 1
  startTurn()
}

function scheduleSpawn() {
  if (phase.value !== 'running') return
  const delay = Math.random() * (SPAWN_MAX - SPAWN_MIN) + SPAWN_MIN
  spawnTimer = setTimeout(() => {
    if (phase.value !== 'running') return
    const empty = []
    for (let i = 0; i < 9; i++) {
      if (moles.value[i] === -2) empty.push(i)
    }
    if (empty.length > 0) {
      const idx = empty[Math.floor(Math.random() * empty.length)]
      moles.value[idx] = Date.now()

      const upTime = Math.random() * (MOLE_UP_MAX - MOLE_UP_MIN) + MOLE_UP_MIN
      moleTimers[idx] = setTimeout(() => {
        if (moles.value[idx] >= 0) {
          moles.value[idx] = -2
        }
      }, upTime)
    }
    scheduleSpawn()
  }, delay)
}

function whack(holeIdx) {
  if (phase.value !== 'running') return
  if (moles.value[holeIdx] < 0) return

  moles.value[holeIdx] = -1
  scores.value[currentPlayer.value]++

  if (moleTimers[holeIdx]) {
    clearTimeout(moleTimers[holeIdx])
    moleTimers[holeIdx] = null
  }

  setTimeout(() => {
    if (moles.value[holeIdx] === -1) {
      moles.value[holeIdx] = -2
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
  if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null }
  for (let i = 0; i < 9; i++) {
    if (moleTimers[i]) { clearTimeout(moleTimers[i]); moleTimers[i] = null }
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
.player-tag.active { border-color: var(--c-primary); opacity: 1; transform: scale(1.03); }
.tag-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.tag-name { font-size: 14px; font-weight: 600; color: var(--c-text); }
.tag-score { font-size: 22px; font-weight: 800; color: var(--c-primary); min-width: 28px; text-align: center; }
.vs { font-size: 13px; font-weight: 700; color: var(--c-muted); }

.timer-bar {
  position: relative; width: 100%; max-width: 400px; height: 28px; margin: 0 auto 10px;
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

.turn-hint {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-bottom: 14px; font-size: 16px; font-weight: 700; color: var(--c-primary); flex-shrink: 0;
}
.turn-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--c-primary); }

.whack-main {
  flex: 1; display: flex; justify-content: center; align-items: flex-start;
}
.whack-zone {
  display: flex; flex-direction: column; gap: 10px; width: min(80vw, 280px);
}
.zone-label {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  font-size: 14px; font-weight: 700; color: var(--c-text);
}
.zone-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
.zone-char { font-size: 18px; }

.mole-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
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
.mole-hole.disabled { cursor: default; }

.mole-character {
  font-size: clamp(28px, 7vw, 40px); animation: moleUp 0.2s ease;
  padding-bottom: 4px;
}
@keyframes moleUp {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
.bonk-effect {
  font-size: clamp(28px, 7vw, 40px); animation: bonk 0.3s ease;
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

.switch-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 100; padding: 20px;
}
.switch-card {
  background: var(--c-card); border-radius: 24px; padding: 36px 28px; text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2); max-width: 320px; width: 100%;
}
.switch-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid var(--c-primary); margin-bottom: 16px; }
.switch-text { font-size: 18px; font-weight: 700; color: var(--c-text); margin-bottom: 8px; }
.switch-sub { font-size: 16px; color: var(--c-muted); margin-bottom: 20px; }

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
