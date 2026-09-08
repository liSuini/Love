<template>
  <div class="gomoku-mode">
    <ScoreBoard icon="♟️" title="五子棋" :turnInfo="`${currentPlayer.nick}执${currentPlayerIdx === 0 ? '黑' : '白'}`" @back="goHome" />

    <!-- 比分板 -->
    <div class="score-bar">
      <div class="player-tag" :class="{ active: currentPlayerIdx === 0 }">
        <img :src="luluImg" class="tag-avatar" />
        <span class="tag-name">噜噜</span>
        <span class="tag-stone black"></span>
        <span class="tag-score">{{ wins[0] }}</span>
      </div>
      <span class="vs">VS</span>
      <div class="player-tag" :class="{ active: currentPlayerIdx === 1 }">
        <span class="tag-score">{{ wins[1] }}</span>
        <span class="tag-stone white"></span>
        <span class="tag-name">噜妹</span>
        <img :src="lumeiImg" class="tag-avatar" />
      </div>
    </div>

    <!-- 棋盘 -->
    <div class="board-wrap">
      <canvas ref="canvasRef" class="board-canvas" @click="handleClick"></canvas>
    </div>

    <!-- 操作按钮 -->
    <div class="actions" v-if="!winner">
      <button class="btn-action" @click="undo" :disabled="history.length < 2">悔棋</button>
      <button class="btn-action" @click="restart">重新开始</button>
    </div>

    <!-- 胜负弹窗 -->
    <div v-if="winner" class="result-overlay" @click="winner = null">
      <div class="result-card" @click.stop>
        <div class="result-emoji">{{ winner === -1 ? '🤝' : '🎉' }}</div>
        <div class="result-title">{{ winner === -1 ? '平局！' : `${winner === 0 ? '噜噜' : '噜妹'}赢了！` }}</div>
        <img :src="winner === 0 ? luluImg : lumeiImg" class="result-avatar" v-if="winner >= 0" />
        <div class="result-actions">
          <button class="btn-primary" @click="restart">再来一局</button>
          <button class="btn-secondary" @click="goHome">返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ScoreBoard from '../../components/ScoreBoard.vue'
import luluImg from '../../assets/avatars/lulu.jpg'
import lumeiImg from '../../assets/avatars/lumei.jpg'

const router = useRouter()
const SIZE = 15
const CELL = 36
const PADDING = 24
const CANVAS_SIZE = CELL * (SIZE - 1) + PADDING * 2

const canvasRef = ref(null)
const board = ref([])
const currentPlayerIdx = ref(0)
const history = ref([])
const winner = ref(null)
const wins = ref([0, 0])
const lastMove = ref(null)

const currentPlayer = computed(() => ({
  0: { nick: '噜噜' },
  1: { nick: '噜妹' },
}[currentPlayerIdx.value]))

function initBoard() {
  board.value = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  history.value = []
  currentPlayerIdx.value = 0
  winner.value = null
  lastMove.value = null
}

function goHome() { router.push('/') }

function restart() {
  initBoard()
  drawBoard()
}

function undo() {
  if (history.value.length < 2) return
  for (let i = 0; i < 2; i++) {
    const [r, c] = history.value.pop()
    board.value[r][c] = 0
  }
  currentPlayerIdx.value = currentPlayerIdx.value === 0 ? 1 : 0
  lastMove.value = history.value.length > 0 ? history.value[history.value.length - 1] : null
  winner.value = null
  drawBoard()
}

function handleClick(e) {
  if (winner.value !== null) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const scale = canvas.width / rect.width
  const x = (e.clientX - rect.left) * scale - PADDING
  const y = (e.clientY - rect.top) * scale - PADDING
  const col = Math.round(x / CELL)
  const row = Math.round(y / CELL)
  if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return
  if (board.value[row][col] !== 0) return

  const player = currentPlayerIdx.value + 1 // 1=黑, 2=白
  board.value[row][col] = player
  history.value.push([row, col])
  lastMove.value = [row, col]

  if (checkWin(row, col, player)) {
    winner.value = currentPlayerIdx.value
    wins.value[currentPlayerIdx.value]++
  } else if (history.value.length === SIZE * SIZE) {
    winner.value = -1
  } else {
    currentPlayerIdx.value = currentPlayerIdx.value === 0 ? 1 : 0
  }
  drawBoard()
}

function checkWin(row, col, player) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (const [dr, dc] of dirs) {
    let count = 1
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i, c = col + dc * i
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board.value[r][c] !== player) break
      count++
    }
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i, c = col - dc * i
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board.value[r][c] !== player) break
      count++
    }
    if (count >= 5) return true
  }
  return false
}

function drawBoard() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f5deb3'
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  // 网格线
  ctx.strokeStyle = '#8b7355'
  ctx.lineWidth = 1
  for (let i = 0; i < SIZE; i++) {
    ctx.beginPath()
    ctx.moveTo(PADDING + i * CELL, PADDING)
    ctx.lineTo(PADDING + i * CELL, PADDING + (SIZE - 1) * CELL)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(PADDING, PADDING + i * CELL)
    ctx.lineTo(PADDING + (SIZE - 1) * CELL, PADDING + i * CELL)
    ctx.stroke()
  }

  // 星位
  const stars = [[3,3],[3,11],[7,7],[11,3],[11,11]]
  ctx.fillStyle = '#8b7355'
  for (const [r, c] of stars) {
    ctx.beginPath()
    ctx.arc(PADDING + c * CELL, PADDING + r * CELL, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // 棋子
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board.value[r][c]
      if (v === 0) continue
      const cx = PADDING + c * CELL
      const cy = PADDING + r * CELL
      const radius = CELL * 0.42

      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      if (v === 1) {
        const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 1, cx, cy, radius)
        grad.addColorStop(0, '#666')
        grad.addColorStop(1, '#111')
        ctx.fillStyle = grad
      } else {
        const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 1, cx, cy, radius)
        grad.addColorStop(0, '#fff')
        grad.addColorStop(1, '#ddd')
        ctx.fillStyle = grad
      }
      ctx.fill()
      ctx.strokeStyle = v === 1 ? '#000' : '#bbb'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }

  // 最后落子标记
  if (lastMove.value) {
    const [r, c] = lastMove.value
    const cx = PADDING + c * CELL
    const cy = PADDING + r * CELL
    ctx.strokeStyle = '#e8788e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, CELL * 0.18, 0, Math.PI * 2)
    ctx.stroke()
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE
  initBoard()
  drawBoard()
})
</script>

<style scoped>
.gomoku-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }

.score-bar {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  margin-bottom: 14px; flex-shrink: 0;
}
.player-tag {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border-radius: 14px; background: var(--c-card); box-shadow: var(--shadow);
  border: 2px solid transparent; transition: all 0.3s; opacity: 0.6;
}
.player-tag.active { border-color: var(--c-primary); opacity: 1; transform: scale(1.03); }
.tag-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.tag-name { font-size: 14px; font-weight: 600; color: var(--c-text); }
.tag-stone { width: 16px; height: 16px; border-radius: 50%; }
.tag-stone.black { background: radial-gradient(circle at 30% 30%, #666, #111); }
.tag-stone.white { background: radial-gradient(circle at 30% 30%, #fff, #ddd); border: 1px solid #ccc; }
.tag-score { font-size: 20px; font-weight: 800; color: var(--c-primary); }
.vs { font-size: 13px; font-weight: 700; color: var(--c-muted); }

.board-wrap { flex: 1; display: flex; justify-content: center; align-items: center; overflow: auto; }
.board-canvas {
  max-width: 100%; height: auto; border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15); cursor: pointer; touch-action: manipulation;
}

.actions { display: flex; gap: 12px; justify-content: center; margin-top: 14px; flex-shrink: 0; }
.btn-action {
  background: var(--c-card); color: var(--c-text); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 10px 24px; font-size: 15px; cursor: pointer; transition: all 0.2s;
}
.btn-action:hover:not(:disabled) { border-color: var(--c-primary); color: var(--c-primary); }
.btn-action:disabled { opacity: 0.4; cursor: not-allowed; }

.result-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 100; padding: 20px;
}
.result-card {
  background: var(--c-card); border-radius: 24px; padding: 36px 28px; text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2); max-width: 320px; width: 100%;
}
.result-emoji { font-size: 56px; margin-bottom: 12px; }
.result-title { font-size: 24px; font-weight: 800; color: var(--c-primary); margin-bottom: 20px; }
.result-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid var(--c-primary); margin-bottom: 20px; }
.result-actions { display: flex; gap: 12px; justify-content: center; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 12px 28px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow);
}
.btn-secondary {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 24px; font-size: 16px; cursor: pointer;
}
</style>
