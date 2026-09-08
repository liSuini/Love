<template>
  <div class="board-mode">
    <ScoreBoard icon="🎰" title="情趣大富翁" :turnInfo="`第 ${round} 轮 · ${currentPlayer.nick}的回合`" @back="goHome" />

    <!-- 玩家区 -->
    <div class="players">
      <PlayerCard v-for="(p, i) in session.players" :key="p.id" :player="p" :isActive="i === session.currentPlayerIdx" />
    </div>

    <!-- 棋盘 -->
    <div class="board-wrapper">
      <div class="board">
        <div
          v-for="tile in tiles"
          :key="tile.id"
          class="tile"
          :class="[tile.type, { 'has-p1': p1Pos === tile.pos, 'has-p2': p2Pos === tile.pos }]"
          @click="showTileInfo(tile)"
        >
          <span class="tile-icon">{{ tile.icon }}</span>
          <span class="tile-label">{{ tile.label }}</span>
          <div class="tile-avatars">
            <span v-if="p1Pos === tile.pos" class="avatar p1-avatar">🧑</span>
            <span v-if="p2Pos === tile.pos" class="avatar p2-avatar">💕</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 骰子区 -->
    <div class="dice-area">
      <div class="dice" :class="{ rolling: rolling }">{{ diceFace }}</div>
      <button class="btn-primary" :disabled="rolling || waiting" @click="rollDice">
        {{ rolling ? '掷骰中...' : waiting ? '请先完成挑战' : '掷骰子' }}
      </button>
      <div class="dice-hint">掷骰移动 · 完成挑战获得甜蜜值 · 先到100分获胜</div>
    </div>

    <!-- 卡牌弹窗 -->
    <CardModal :visible="cardVisible" :cardType="modalCardType" :content="modalContent" @close="cardVisible = false">
      <template #actions>
        <div class="card-actions" v-if="currentCard">
          <button class="btn-done" @click="completeCard">完成 (+{{ currentPoints }})</button>
          <button class="btn-skip" @click="skipCard">跳过</button>
        </div>
        <div class="card-actions" v-else-if="currentEventType === 'event'">
          <button class="btn-done" @click="resolveEvent">接受命运</button>
        </div>
        <div class="card-actions" v-else>
          <button class="btn-done" @click="cardVisible = false">继续</button>
        </div>
      </template>
    </CardModal>

    <!-- 连击特效 -->
    <div class="combo-fx" :class="{ show: comboFx }">连击 +5🔥</div>

    <!-- 结算页 -->
    <ResultScreen v-if="session.state === 'finished'"
      emoji="💖" title="情趣大富翁" icon="💕"
      :players="session.players" :winner="winner"
      :extra="resultExtra" :summary="resultSummary"
      @restart="restart" @home="goHome"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameSession } from '../../composables/useGameSession'
import { useAudio } from '../../composables/useAudio'
import { CardLibrary } from '../../services/CardLibrary'
import tilesData from '../../data/board-tiles.json'
import intimateRewards from '../../data/intimate-rewards.json'
import intimatePunishes from '../../data/intimate-punishments.json'
import tasks from '../../data/tasks.json'
import truths from '../../data/truths.json'
import bonuses from '../../data/bonuses.json'
import punishments from '../../data/punishments.json'
import boardEvents from '../../data/board-events.json'
import PlayerCard from '../../components/PlayerCard.vue'
import CardModal from '../../components/CardModal.vue'
import ScoreBoard from '../../components/ScoreBoard.vue'
import ResultScreen from '../../components/ResultScreen.vue'

const router = useRouter()
const { session, startMode, switchPlayer, addScore, checkCombo, resetCombo, finishGame, reset } = useGameSession()
const { playEffect } = useAudio()

const TARGET_SCORE = 100
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
const typePoints = { task: 10, truth: 8, 'intimate-reward': 15, 'intimate-punish': 12, bonus: 18, event: 0, rest: 5, start: 0 }

const libraries = {
  task: new CardLibrary('task', tasks),
  truth: new CardLibrary('truth', truths),
  'intimate-reward': new CardLibrary('intimate-reward', intimateRewards),
  'intimate-punish': new CardLibrary('intimate-punish', intimatePunishes),
  bonus: new CardLibrary('bonus', bonuses),
  punishment: new CardLibrary('punishment', punishments),
}

const tiles = ref(tilesData)
const round = ref(1)
const p1Pos = ref(0)
const p2Pos = ref(0)
const rolling = ref(false)
const waiting = ref(false)
const diceFace = ref('?')
const cardVisible = ref(false)
const currentCard = ref(null)
const currentEventType = ref(null)
const currentEventDesc = ref('')
const currentEventEffect = ref(null)
const currentPoints = ref(0)
const comboFx = ref(false)
const doubleNext = ref(false)

const currentPlayer = computed(() => session.players[session.currentPlayerIdx])

const modalCardType = computed(() => {
  if (currentCard.value) return currentCard.value.type
  if (currentEventType.value === 'event') return 'event'
  return null
})

const modalContent = computed(() => {
  if (currentCard.value) return currentCard.value.content
  return currentEventDesc.value
})

const winner = computed(() => {
  if (session.state !== 'finished') return null
  const [p1, p2] = session.players
  return p1.score >= p2.score ? p1 : p2
})

const resultSummary = computed(() => {
  const [p1, p2] = session.players
  const diff = Math.abs(p1.score - p2.score)
  if (diff === 0) return '势均力敌的两个人，每一步都是甜蜜的碰撞！'
  const w = winner.value
  const l = w === p1 ? p2 : p1
  if (diff <= 5) return `${w.nick}险胜！你们的默契只差一点点 💕`
  if (diff <= 15) return `${w.nick}完胜！但${l.nick}的心也被赢走了 🥰`
  return `${w.nick}大获全胜！今晚${l.nick}要好好服侍了 😏`
})

const resultExtra = computed(() => {
  if (session.state !== 'finished') return ''
  const diff = Math.abs(session.players[0].score - session.players[1].score)
  if (diff === 0) return '平局！'
  return `${winner.value.nick} 获胜！`
})

startMode('board')

function goHome() { router.push('/') }
function restart() {
  reset()
  round.value = 1
  p1Pos.value = 0
  p2Pos.value = 0
  rolling.value = false
  waiting.value = false
  diceFace.value = '?'
  cardVisible.value = false
  currentCard.value = null
  doubleNext.value = false
}

function rollDice() {
  rolling.value = true
  playEffect('dice')
  let count = 0
  const interval = setInterval(() => {
    diceFace.value = diceFaces[Math.floor(Math.random() * 6)]
    count++
    if (count > 8) {
      clearInterval(interval)
      rolling.value = false
      const result = Math.floor(Math.random() * 6) + 1
      diceFace.value = diceFaces[result - 1]
      setTimeout(() => movePlayer(result), 400)
    }
  }, 80)
}

function movePlayer(steps) {
  const isP1 = session.currentPlayerIdx === 0
  let pos = isP1 ? p1Pos.value : p2Pos.value
  const oldPos = pos
  pos = (pos + steps) % tiles.value.length
  if (isP1) p1Pos.value = pos
  else p2Pos.value = pos

  // 经过起点加分
  if (pos < oldPos) {
    addScore(currentPlayer.value.id, 5)
    playEffect('score')
  }

  setTimeout(() => triggerTile(tiles.value[pos]), 500)
}

function triggerTile(tile) {
  switch (tile.type) {
    case 'start':
      endTurn()
      break
    case 'rest':
      addScore(currentPlayer.value.id, 5)
      currentEventType.value = null
      currentCard.value = null
      currentEventDesc.value = '休息片刻，恢复体力，甜蜜值 +5'
      cardVisible.value = true
      waiting.value = true
      playEffect('card')
      break
    case 'event':
      triggerEvent()
      break
    case 'intimate-reward':
    case 'intimate-punish':
    case 'task':
    case 'truth':
    case 'bonus':
      drawCard(tile.type)
      break
    default:
      endTurn()
  }
}

function drawCard(type) {
  const card = libraries[type].draw()
  currentCard.value = card
  currentEventType.value = null
  currentPoints.value = typePoints[type] || 10
  cardVisible.value = true
  waiting.value = true
  playEffect('card')
}

function completeCard() {
  const pid = currentPlayer.value.id
  let points = currentPoints.value
  if (doubleNext.value) {
    points *= 2
    doubleNext.value = false
  }
  addScore(pid, points)
  playEffect('score')
  const combo = checkCombo(pid)
  if (combo) {
    playEffect('combo')
    comboFx.value = true
    setTimeout(() => { comboFx.value = false }, 1000)
  }
  cardVisible.value = false
  waiting.value = false
  currentCard.value = null

  if (session.players[0].score >= TARGET_SCORE || session.players[1].score >= TARGET_SCORE) {
    finishGame({})
    return
  }
  endTurn()
}

function skipCard() {
  const pid = currentPlayer.value.id
  resetCombo(pid)
  cardVisible.value = false
  waiting.value = false
  currentCard.value = null
  endTurn()
}

function triggerEvent() {
  const event = boardEvents[Math.floor(Math.random() * boardEvents.length)]
  currentCard.value = null
  currentEventType.value = 'event'
  currentEventDesc.value = `${event.label}：${event.description}`
  currentEventEffect.value = event.effect
  cardVisible.value = true
  waiting.value = true
  playEffect('wheel')
}

function resolveEvent() {
  const effect = currentEventEffect.value
  const pid = currentPlayer.value.id
  const isP1 = session.currentPlayerIdx === 0

  switch (effect) {
    case 'swap':
      const tmp = p1Pos.value
      p1Pos.value = p2Pos.value
      p2Pos.value = tmp
      break
    case 'extra-turn':
      cardVisible.value = false
      waiting.value = false
      currentEventType.value = null
      return
    case 'add-score':
      addScore(pid, 5)
      playEffect('score')
      break
    case 'lose-score':
      const p = session.players.find(p => p.id === pid)
      p.score = Math.max(0, p.score - 3)
      break
    case 'forward':
      let fwd = isP1 ? p1Pos.value : p2Pos.value
      fwd = (fwd + 3) % tiles.value.length
      if (isP1) p1Pos.value = fwd
      else p2Pos.value = fwd
      cardVisible.value = false
      waiting.value = false
      currentEventType.value = null
      setTimeout(() => triggerTile(tiles.value[fwd]), 500)
      return
    case 'backward':
      let bwd = isP1 ? p1Pos.value : p2Pos.value
      bwd = (bwd - 3 + tiles.value.length) % tiles.value.length
      if (isP1) p1Pos.value = bwd
      else p2Pos.value = bwd
      cardVisible.value = false
      waiting.value = false
      currentEventType.value = null
      setTimeout(() => triggerTile(tiles.value[bwd]), 500)
      return
    case 'double':
      doubleNext.value = true
      break
    case 'free-reward':
      currentEventType.value = null
      drawCard('intimate-reward')
      return
  }

  cardVisible.value = false
  waiting.value = false
  currentEventType.value = null

  if (session.players[0].score >= TARGET_SCORE || session.players[1].score >= TARGET_SCORE) {
    finishGame({})
    return
  }
  endTurn()
}

function endTurn() {
  switchPlayer()
  if (session.currentPlayerIdx === 0) round.value++
}

function showTileInfo(tile) {
  if (tile.type === 'start') return
  if (waiting.value || rolling.value) return
  const typeNames = {
    'intimate-reward': '💋 情趣奖励卡',
    'intimate-punish': '🔥 情趣惩罚卡',
    task: '✨ 任务卡',
    truth: '💬 真心话',
    bonus: '🎁 惊喜卡',
    event: '🎲 命运格',
    rest: '😴 休息格',
  }
  currentCard.value = null
  currentEventType.value = null
  currentEventDesc.value = typeNames[tile.type] || tile.label
  cardVisible.value = true
}
</script>

<style scoped>
.board-mode { padding: 16px 20px; }
.players { display: flex; gap: 12px; margin-bottom: 20px; }

.board-wrapper { margin-bottom: 24px; }
.board {
  max-width: 500px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;
}
.tile {
  background: var(--c-card); border-radius: 12px; padding: 10px 6px;
  text-align: center; box-shadow: var(--shadow); border: 2px solid transparent;
  transition: all 0.3s; position: relative; min-height: 64px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer;
}
.tile.intimate-reward { border-color: #ff6b9d; }
.tile.intimate-punish { border-color: #f5576c; }
.tile.event { border-color: var(--c-secondary); }
.tile.start { background: var(--c-primary); color: #fff; }
.tile.rest { opacity: 0.7; }
.tile-icon { font-size: 20px; margin-bottom: 2px; }
.tile-label { font-size: 10px; font-weight: 600; line-height: 1.2; }
.tile-avatars {
  position: absolute; top: 2px; right: 4px;
  display: flex; gap: 2px; font-size: 12px;
}
.tile.has-p1 { box-shadow: 0 0 15px rgba(255,107,157,0.5); }
.tile.has-p2 { box-shadow: 0 0 15px rgba(78,205,196,0.5); }

.dice-area { text-align: center; padding: 20px 0; }
.dice {
  width: 70px; height: 70px; background: var(--c-card); border-radius: 14px;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
  font-size: 42px; box-shadow: var(--shadow); border: 2px solid var(--c-border);
  transition: transform 0.1s;
}
.dice.rolling { animation: shake 0.5s ease infinite; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 14px 40px; font-size: 18px; font-weight: 700; cursor: pointer;
  box-shadow: var(--shadow); transition: all 0.2s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.dice-hint { margin-top: 14px; font-size: 13px; color: var(--c-muted); }

.card-actions { display: flex; gap: 12px; justify-content: center; }
.card-actions button {
  padding: 10px 28px; border-radius: 12px; border: none; font-size: 15px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-done { background: var(--c-primary); color: #fff; }
.btn-skip { background: transparent; color: var(--c-muted); border: 1px solid var(--c-border) !important; }
.combo-fx {
  position: fixed; top: 35%; left: 50%; transform: translate(-50%, -50%);
  font-size: 48px; font-weight: 900; color: var(--c-secondary);
  text-shadow: 0 0 30px var(--c-primary); z-index: 200; pointer-events: none;
  opacity: 0; transition: all 0.5s;
}
.combo-fx.show { opacity: 1; animation: comboBounce 1s ease; }

@media (max-width: 480px) {
  .tile { min-height: 52px; padding: 6px 4px; }
  .tile-icon { font-size: 16px; }
  .tile-label { font-size: 9px; }
  .dice { width: 60px; height: 60px; font-size: 36px; }
}
</style>
