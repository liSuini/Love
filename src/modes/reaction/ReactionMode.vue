<template>
  <div class="react-mode">
    <ScoreBoard icon="⚡" title="反应力大挑战" :turnInfo="`第 ${round} / ${TOTAL_ROUNDS} 轮`" @back="goHome" />

    <!-- 比分板 -->
    <div class="score-bar">
      <div class="player-tag" :class="{ active: idx === 0 }">
        <img :src="luluImg" class="tag-avatar" />
        <span class="tag-name">噜噜</span>
        <span class="tag-score">{{ scores[0] }}</span>
      </div>
      <span class="vs">VS</span>
      <div class="player-tag" :class="{ active: idx === 1 }">
        <span class="tag-score">{{ scores[1] }}</span>
        <span class="tag-name">噜妹</span>
        <img :src="lumeiImg" class="tag-avatar" />
      </div>
    </div>

    <!-- 历史反应时间 -->
    <div class="history-bar" v-if="round > 1">
      <div class="history-item" v-for="(h, i) in history" :key="i" :class="h.winner === 0 ? 'win-l' : h.winner === 1 ? 'win-r' : 'tie'">
        <span class="hist-round">R{{ i + 1 }}</span>
        <span class="hist-time">{{ h.time }}ms</span>
      </div>
    </div>

    <!-- 游戏区域 -->
    <div class="react-main">
      <!-- 提示文字 -->
      <div class="react-arena" :class="arenaClass" @click="handleTap">
        <div class="arena-content">
          <template v-if="state === 'idle'">
            <div class="arena-emoji">⚡</div>
            <div class="arena-text">准备好就点击开始</div>
          </template>
          <template v-else-if="state === 'waiting'">
            <div class="arena-emoji">⏳</div>
            <div class="arena-text">等待变色…</div>
            <div class="arena-hint">别急着点！</div>
          </template>
          <template v-else-if="state === 'go'">
            <div class="arena-emoji">👆</div>
            <div class="arena-text">快 点！</div>
          </template>
          <template v-else-if="state === 'tooEarly'">
            <div class="arena-emoji">😅</div>
            <div class="arena-text">太心急了！</div>
            <div class="arena-hint">等变色再点</div>
          </template>
          <template v-else-if="state === 'result'">
            <div class="arena-emoji">{{ lastTime < 300 ? '⚡' : lastTime < 500 ? '👍' : '🐢' }}</div>
            <div class="arena-time">{{ lastTime }} ms</div>
            <div class="arena-hint">{{ lastTime < 300 ? '神反应！' : lastTime < 500 ? '不错！' : '再练练' }}</div>
          </template>
          <template v-else-if="state === 'finished'">
            <div class="arena-emoji">{{ winner === -1 ? '🤝' : '🎉' }}</div>
            <div class="arena-result">{{ winner === -1 ? '平局！' : `${winner === 0 ? '噜噜' : '噜妹'}赢了！` }}</div>
            <div class="arena-hint">噜噜 {{ scores[0] }} : {{ scores[1] }} 噜妹</div>
            <div class="result-actions">
              <button class="btn-primary" @click.stop="startGame">再来一局</button>
              <button class="btn-secondary" @click.stop="goHome">返回首页</button>
            </div>
          </template>
        </div>
      </div>

      <!-- 当前玩家指示 -->
      <div class="player-indicator" v-if="state !== 'finished' && state !== 'idle'">
        <img :src="idx === 0 ? luluImg : lumeiImg" class="indicator-avatar" />
        <span>{{ idx === 0 ? '噜噜' : '噜妹' }} 的回合</span>
      </div>
    </div>

    <!-- 开始/重来按钮 -->
    <div class="actions" v-if="state === 'idle'">
      <button class="btn-primary" @click="startGame">开始游戏</button>
      <button class="btn-secondary" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ScoreBoard from '../../components/ScoreBoard.vue'
import luluImg from '../../assets/avatars/lulu.jpg'
import lumeiImg from '../../assets/avatars/lumei.jpg'

const router = useRouter()
const TOTAL_ROUNDS = 6

const state = ref('idle') // idle | waiting | go | tooEarly | result | finished
const idx = ref(0)
const round = ref(1)
const scores = ref([0, 0])
const lastTime = ref(0)
const history = ref([])
const winner = ref(null)

let waitTimer = null
let goTimestamp = 0

const arenaClass = computed(() => ({
  'arena-idle': state.value === 'idle',
  'arena-waiting': state.value === 'waiting',
  'arena-go': state.value === 'go',
  'arena-early': state.value === 'tooEarly',
  'arena-result': state.value === 'result',
  'arena-finished': state.value === 'finished',
}))

function goHome() { router.push('/') }

function startGame() {
  idx.value = 0
  round.value = 1
  scores.value = [0, 0]
  history.value = []
  winner.value = null
  startRound()
}

function startRound() {
  state.value = 'waiting'
  const delay = Math.random() * 2500 + 1500
  waitTimer = setTimeout(() => {
    state.value = 'go'
    goTimestamp = Date.now()
  }, delay)
}

function handleTap() {
  if (state.value === 'idle') {
    startGame()
    return
  }

  if (state.value === 'finished') {
    return
  }

  if (state.value === 'waiting') {
    // 提前点击
    clearTimeout(waitTimer)
    state.value = 'tooEarly'
    setTimeout(() => {
      state.value = 'waiting'
      startRound()
    }, 1200)
    return
  }

  if (state.value === 'go') {
    const reactionTime = Date.now() - goTimestamp
    lastTime.value = reactionTime

    // 计分：越快分越高
    let points = 0
    if (reactionTime < 200) points = 10
    else if (reactionTime < 300) points = 8
    else if (reactionTime < 400) points = 6
    else if (reactionTime < 500) points = 4
    else points = 2

    scores.value[idx.value] += points
    history.value.push({ time: reactionTime, winner: idx.value, points })

    state.value = 'result'

    setTimeout(() => {
      // 切换玩家
      if (idx.value === 0) {
        idx.value = 1
        startRound()
      } else {
        idx.value = 0
        round.value++
        if (round.value > TOTAL_ROUNDS) {
          endGame()
        } else {
          startRound()
        }
      }
    }, 1500)
    return
  }

  if (state.value === 'tooEarly' || state.value === 'result') {
    return
  }
}

function endGame() {
  state.value = 'finished'
  if (scores.value[0] > scores.value[1]) winner.value = 0
  else if (scores.value[1] > scores.value[0]) winner.value = 1
  else winner.value = -1
}

function cleanup() {
  if (waitTimer) { clearTimeout(waitTimer); waitTimer = null }
}

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.react-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }

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

.history-bar {
  display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;
  margin-bottom: 14px; flex-shrink: 0;
}
.history-item {
  display: flex; flex-direction: column; align-items: center; padding: 4px 10px;
  border-radius: 8px; font-size: 11px; min-width: 52px;
}
.history-item.win-l { background: rgba(78,205,196,0.15); color: #4ecdc4; }
.history-item.win-r { background: rgba(255,107,157,0.15); color: #ff6b9d; }
.history-item.tie { background: rgba(255,217,61,0.15); color: #c4a738; }
.hist-round { font-weight: 700; }
.hist-time { font-size: 13px; font-weight: 800; }

.react-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }

.react-arena {
  width: min(85vw, 380px); aspect-ratio: 1; border-radius: 28px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s; user-select: none; touch-action: manipulation;
}
.arena-idle {
  background: var(--c-card); box-shadow: var(--shadow);
}
.arena-waiting {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  box-shadow: 0 0 40px rgba(231,76,60,0.4);
}
.arena-go {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  box-shadow: 0 0 50px rgba(46,204,113,0.5);
  animation: goPulse 0.3s ease;
}
@keyframes goPulse {
  0% { transform: scale(0.97); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
.arena-early {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  box-shadow: 0 0 30px rgba(243,156,18,0.4);
}
.arena-result {
  background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
  box-shadow: 0 0 40px rgba(255,107,157,0.4);
}
.arena-finished {
  background: var(--c-card); box-shadow: var(--shadow);
}

.arena-content { text-align: center; padding: 20px; }
.arena-emoji { font-size: 56px; margin-bottom: 12px; }
.arena-text { font-size: 22px; font-weight: 800; color: #fff; }
.arena-waiting .arena-text, .arena-go .arena-text, .arena-early .arena-text, .arena-result .arena-text {
  color: #fff;
}
.arena-idle .arena-text, .arena-finished .arena-result {
  color: var(--c-text);
}
.arena-hint {
  font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 8px;
}
.arena-idle .arena-hint, .arena-finished .arena-hint {
  color: var(--c-muted);
}
.arena-time {
  font-size: 40px; font-weight: 900; color: #fff;
}
.arena-result-title {
  font-size: 24px; font-weight: 800; color: var(--c-primary);
}

.player-indicator {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 700; color: var(--c-primary);
}
.indicator-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--c-primary); }

.actions { display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-shrink: 0; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 12px 28px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow);
}
.btn-secondary {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 22px; font-size: 16px; cursor: pointer;
}

.result-actions { display: flex; gap: 12px; justify-content: center; margin-top: 16px; }
</style>
