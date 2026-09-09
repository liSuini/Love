<template>
  <div class="snake-mode">
    <ScoreBoard icon="🐍" title="贪吃蛇对战" :turnInfo="`噜噜 ${scores[0]} : ${scores[1]} 噜妹`" @back="goHome" />

    <!-- 比分板 -->
    <div class="score-bar">
      <div class="player-tag" :class="{ dead: !alive[0] }">
        <img :src="luluImg" class="tag-avatar" />
        <span class="tag-dot blue"></span>
        <span class="tag-score">{{ scores[0] }}</span>
      </div>
      <span class="vs">VS</span>
      <div class="player-tag" :class="{ dead: !alive[1] }">
        <span class="tag-score">{{ scores[1] }}</span>
        <span class="tag-dot pink"></span>
        <img :src="lumeiImg" class="tag-avatar" />
      </div>
    </div>

    <!-- 游戏状态 -->
    <div class="status-bar">
      <span v-if="phase === 'ready'" class="status-text">准备好了吗？</span>
      <span v-else-if="phase === 'playing'" class="status-text">倒计时 {{ countDown }}</span>
      <span v-else-if="phase === 'running'" class="status-text">冲鸭！</span>
      <span v-else-if="phase === 'ended'" class="status-text">{{ endMessage }}</span>
    </div>

    <!-- 画布 -->
    <div class="board-wrap">
      <canvas ref="canvasRef" class="board-canvas"></canvas>
    </div>

    <!-- 移动端方向按钮 -->
    <div class="controls" v-if="phase === 'running' || phase === 'playing'">
      <div class="dpad-left">
        <button class="dpad-btn" @click="setDir(0, 'up')">▲</button>
        <div class="dpad-row">
          <button class="dpad-btn" @click="setDir(0, 'left')">◀</button>
          <button class="dpad-btn" @click="setDir(0, 'down')">▼</button>
        </div>
        <span class="dpad-label">噜噜</span>
      </div>
      <div class="dpad-right">
        <button class="dpad-btn" @click="setDir(1, 'up')">▲</button>
        <div class="dpad-row">
          <button class="dpad-btn" @click="setDir(1, 'left')">◀</button>
          <button class="dpad-btn" @click="setDir(1, 'down')">▼</button>
        </div>
        <span class="dpad-label">噜妹</span>
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
          <div class="result-title">{{ winner === -1 ? '同归于尽！' : `${winner === 0 ? '噜噜' : '噜妹'}赢了！` }}</div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ScoreBoard from '../../components/ScoreBoard.vue'
import luluImg from '../../assets/avatars/lulu.jpg'
import lumeiImg from '../../assets/avatars/lumei.jpg'

const router = useRouter()

const COLS = 24
const ROWS = 18
const CELL = 20
const CANVAS_W = COLS * CELL
const CANVAS_H = ROWS * CELL
const TICK_MS = 130

const canvasRef = ref(null)
const phase = ref('ready') // ready | playing | running | ended
const countDown = ref(3)
const scores = ref([0, 0])
const alive = ref([true, true])
const winner = ref(null)
const endMessage = ref('')

let snakes = []
let food = null
let timer = null
let cdTimer = null
let ctx = null

const COLORS = [
  { head: '#4ecdc4', body: '#44a8a0', glow: 'rgba(78,205,196,0.3)' },
  { head: '#ff6b9d', body: '#e05680', glow: 'rgba(255,107,157,0.3)' },
]

function goHome() {
  cleanup()
  router.push('/')
}

function setDir(playerIdx, dir) {
  const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' }
  const snake = snakes[playerIdx]
  if (!snake) return
  if (opposite[dir] === snake.dir) return
  snake.nextDir = dir
}

function initGame() {
  snakes = [
    { body: [{ x: 5, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 4 }], dir: 'right', nextDir: 'right' },
    { body: [{ x: 18, y: 14 }, { x: 19, y: 14 }, { x: 20, y: 14 }], dir: 'left', nextDir: 'left' },
  ]
  scores.value = [0, 0]
  alive.value = [true, true]
  winner.value = null
  phase.value = 'ready'
  spawnFood()
}

function spawnFood() {
  const occupied = new Set()
  for (const s of snakes) {
    for (const seg of s.body) occupied.add(`${seg.x},${seg.y}`)
  }
  let x, y, tries = 0
  do {
    x = Math.floor(Math.random() * COLS)
    y = Math.floor(Math.random() * ROWS)
    tries++
  } while (occupied.has(`${x},${y}`) && tries < 200)
  food = { x, y }
}

function startGame() {
  cleanup()
  initGame()
  phase.value = 'playing'
  countDown.value = 3
  draw()

  cdTimer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(cdTimer)
      cdTimer = null
      phase.value = 'running'
      timer = setInterval(tick, TICK_MS)
    }
  }, 800)
}

function tick() {
  if (phase.value !== 'running') return

  // 移动
  for (let i = 0; i < 2; i++) {
    if (!alive.value[i]) continue
    const s = snakes[i]
    s.dir = s.nextDir
    const head = { ...s.body[0] }
    if (s.dir === 'up') head.y--
    else if (s.dir === 'down') head.y++
    else if (s.dir === 'left') head.x--
    else if (s.dir === 'right') head.x++

    // 穿墙：从另一边出来
    if (head.x < 0) head.x = COLS - 1
    else if (head.x >= COLS) head.x = 0
    if (head.y < 0) head.y = ROWS - 1
    else if (head.y >= ROWS) head.y = 0

    s.body.unshift(head)

    // 吃食物
    if (head.x === food.x && head.y === food.y) {
      scores.value[i] += 10
      spawnFood()
    } else {
      s.body.pop()
    }
  }

  // 碰撞检测 — 先收集结果再统一应用，避免顺序影响
  const newAlive = [true, true]

  for (let i = 0; i < 2; i++) {
    const head = snakes[i].body[0]

    // 撞自己
    for (let j = 1; j < snakes[i].body.length; j++) {
      if (snakes[i].body[j].x === head.x && snakes[i].body[j].y === head.y) {
        newAlive[i] = false
        break
      }
    }

    // 撞对方（不管对方是否也死了，只要身体在这个位置就算撞）
    const other = 1 - i
    for (let j = 0; j < snakes[other].body.length; j++) {
      if (snakes[other].body[j].x === head.x && snakes[other].body[j].y === head.y) {
        newAlive[i] = false
        break
      }
    }
  }

  // 统一应用存活状态
  alive.value = newAlive

  // 头对头同归于尽
  if (alive.value[0] && alive.value[1]) {
    const h0 = snakes[0].body[0]
    const h1 = snakes[1].body[0]
    if (h0.x === h1.x && h0.y === h1.y) {
      alive.value = [false, false]
    }
  }

  draw()

  // 结束判定
  if (!alive.value[0] && !alive.value[1]) {
    endGame(-1)
  } else if (!alive.value[0]) {
    endGame(1)
  } else if (!alive.value[1]) {
    endGame(0)
  }
}

function endGame(w) {
  phase.value = 'ended'
  winner.value = w
  if (w === -1) endMessage.value = '同归于尽！'
  else endMessage.value = `${w === 0 ? '噜噜' : '噜妹'}赢了！`
  if (timer) { clearInterval(timer); timer = null }
}

function draw() {
  if (!ctx) return

  // 背景
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--c-bg').trim() || '#fff0f5'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // 网格
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--c-border').trim() || 'rgba(255,107,157,0.1)'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath()
    ctx.moveTo(i * CELL, 0)
    ctx.lineTo(i * CELL, CANVAS_H)
    ctx.stroke()
  }
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * CELL)
    ctx.lineTo(CANVAS_W, i * CELL)
    ctx.stroke()
  }

  // 食物
  if (food) {
    const fx = food.x * CELL + CELL / 2
    const fy = food.y * CELL + CELL / 2
    ctx.fillStyle = '#ffd93d'
    ctx.shadowColor = 'rgba(255,217,61,0.6)'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(fx, fy, CELL * 0.35, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // 蛇
  for (let i = 0; i < 2; i++) {
    const s = snakes[i]
    if (!s) continue
    const c = COLORS[i]

    for (let j = s.body.length - 1; j >= 0; j--) {
      const seg = s.body[j]
      const x = seg.x * CELL
      const y = seg.y * CELL
      const alpha = alive.value[i] ? 1 : 0.3

      if (j === 0) {
        // 蛇头
        ctx.fillStyle = c.head
        ctx.globalAlpha = alpha
        ctx.shadowColor = c.glow
        ctx.shadowBlur = 6
        roundRect(ctx, x + 1, y + 1, CELL - 2, CELL - 2, 5)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
        // 眼睛
        ctx.fillStyle = '#fff'
        ctx.globalAlpha = alpha
        const ex = x + CELL / 2
        const ey = y + CELL / 2
        ctx.beginPath()
        ctx.arc(ex - 3, ey - 2, 2, 0, Math.PI * 2)
        ctx.arc(ex + 3, ey - 2, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      } else {
        ctx.fillStyle = c.body
        ctx.globalAlpha = alpha
        roundRect(ctx, x + 2, y + 2, CELL - 4, CELL - 4, 3)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function handleKey(e) {
  const map = {
    'w': [0, 'up'], 'W': [0, 'up'],
    's': [0, 'down'], 'S': [0, 'down'],
    'a': [0, 'left'], 'A': [0, 'left'],
    'd': [0, 'right'], 'D': [0, 'right'],
    'ArrowUp': [1, 'up'],
    'ArrowDown': [1, 'down'],
    'ArrowLeft': [1, 'left'],
    'ArrowRight': [1, 'right'],
  }
  const m = map[e.key]
  if (m) {
    e.preventDefault()
    setDir(m[0], m[1])
  }
}

function cleanup() {
  if (timer) { clearInterval(timer); timer = null }
  if (cdTimer) { clearInterval(cdTimer); cdTimer = null }
}

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  ctx = canvas.getContext('2d')
  window.addEventListener('keydown', handleKey)
  initGame()
  draw()
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
.snake-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }

.score-bar {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  margin-bottom: 10px; flex-shrink: 0;
}
.player-tag {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border-radius: 14px; background: var(--c-card); box-shadow: var(--shadow);
  border: 2px solid transparent; transition: all 0.3s;
}
.player-tag.dead { opacity: 0.3; filter: grayscale(0.8); }
.tag-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.tag-dot { width: 12px; height: 12px; border-radius: 50%; }
.tag-dot.blue { background: #4ecdc4; }
.tag-dot.pink { background: #ff6b9d; }
.tag-score { font-size: 20px; font-weight: 800; color: var(--c-primary); }
.vs { font-size: 13px; font-weight: 700; color: var(--c-muted); }

.status-bar { text-align: center; margin-bottom: 10px; flex-shrink: 0; }
.status-text { font-size: 16px; font-weight: 700; color: var(--c-primary); }

.board-wrap { flex: 1; display: flex; justify-content: center; align-items: center; overflow: auto; }
.board-canvas {
  max-width: 100%; height: auto; border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15); touch-action: manipulation;
}

.controls {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 10px; margin-top: 10px; flex-shrink: 0;
}
.dpad-left, .dpad-right {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.dpad-row { display: flex; gap: 4px; }
.dpad-btn {
  width: 44px; height: 44px; border: 1px solid var(--c-border);
  background: var(--c-card); border-radius: 10px; font-size: 18px;
  color: var(--c-text); cursor: pointer; touch-action: manipulation;
  display: flex; align-items: center; justify-content: center;
}
.dpad-btn:active { transform: scale(0.9); background: var(--c-primary); color: #fff; }
.dpad-label { font-size: 11px; color: var(--c-muted); margin-top: 2px; }

.actions { display: flex; gap: 12px; justify-content: center; margin-top: 12px; flex-shrink: 0; }
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
