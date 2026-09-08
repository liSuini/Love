<template>
  <div class="heartbeat">
    <ScoreBoard icon="🎲" title="心动回合战" :turnInfo="`回合 ${Math.min(session.turnCount + 1, maxTurns)}/${maxTurns}`" @back="goHome" />

    <!-- 玩家区 -->
    <div class="players">
      <PlayerCard v-for="(p, i) in session.players" :key="p.id" :player="p" :isActive="i === session.currentPlayerIdx" />
    </div>

    <!-- 骰子区 -->
    <div class="dice-area">
      <div class="dice" :class="{ rolling: rolling }">{{ diceFace }}</div>
      <button class="btn-primary" :disabled="rolling" @click="rollDice">{{ rolling ? '掷骰中...' : '掷骰子' }}</button>
      <div class="dice-hint">点数 1-2 任务 · 3-4 真心话 · 5 惩罚 · 6 奖励</div>
    </div>

    <!-- 卡牌弹窗 -->
    <CardModal :visible="cardVisible" :cardType="currentCard?.type" :content="currentCard?.content" @close="cardVisible = false">
      <template #actions>
        <div class="card-actions">
          <button class="btn-done" @click="completeCard">完成 (+{{ currentPoints }})</button>
          <button class="btn-skip" @click="skipCard">跳过</button>
        </div>
        <div class="card-points">完成获得 {{ currentPoints }} 心动值 · 跳过将清零连击</div>
      </template>
    </CardModal>

    <!-- 连击特效 -->
    <div class="combo-fx" :class="{ show: comboFx }">连击 +5🔥</div>

    <!-- 结算页 -->
    <ResultScreen v-if="session.state === 'finished'"
      emoji="💖" title="心动结算" icon="💕"
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
import tasks from '../../data/tasks.json'
import truths from '../../data/truths.json'
import punishments from '../../data/punishments.json'
import bonuses from '../../data/bonuses.json'
import PlayerCard from '../../components/PlayerCard.vue'
import CardModal from '../../components/CardModal.vue'
import ScoreBoard from '../../components/ScoreBoard.vue'
import ResultScreen from '../../components/ResultScreen.vue'

const router = useRouter()
const { session, startMode, switchPlayer, addScore, checkCombo, resetCombo, finishGame, reset } = useGameSession()
const { playEffect } = useAudio()

const maxTurns = 10
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
const diceMap = { 1: 'task', 2: 'task', 3: 'truth', 4: 'truth', 5: 'punishment', 6: 'bonus' }
const typePoints = { task: 10, truth: 8, punishment: 12, bonus: 15 }

const libraries = {
  task: new CardLibrary('task', tasks),
  truth: new CardLibrary('truth', truths),
  punishment: new CardLibrary('punishment', punishments),
  bonus: new CardLibrary('bonus', bonuses),
}

const rolling = ref(false)
const diceFace = ref('?')
const cardVisible = ref(false)
const currentCard = ref(null)
const currentPoints = ref(0)
const comboFx = ref(false)

const winner = computed(() => {
  if (session.state !== 'finished') return null
  const [p1, p2] = session.players
  return p1.score >= p2.score ? p1 : p2
})

const resultSummary = computed(() => {
  const [p1, p2] = session.players
  const w = winner.value
  const l = w === p1 ? p2 : p1
  const diff = Math.abs(p1.score - p2.score)
  if (diff === 0) return '势均力敌的两个人，每一分都是甜蜜的碰撞！'
  if (diff <= 5) return `${w.nick}险胜！你们的默契只差一点点 💕`
  if (diff <= 15) return `${w.nick}完胜！但${l.nick}的心也被赢走了 🥰`
  return `${w.nick}大获全胜！看来今晚${l.nick}要好好服侍了 😏`
})

const resultExtra = computed(() => {
  if (session.state !== 'finished') return ''
  const diff = Math.abs(session.players[0].score - session.players[1].score)
  if (diff === 0) return '平局！'
  return `${winner.value.nick} 获胜！`
})

startMode('heartbeat')

function goHome() { router.push('/') }
function restart() { reset(); rolling.value = false; diceFace.value = '?'; cardVisible.value = false }

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
      setTimeout(() => drawCard(result), 400)
    }
  }, 80)
}

function drawCard(diceNum) {
  const type = diceMap[diceNum]
  const card = libraries[type].draw()
  currentCard.value = card
  currentPoints.value = typePoints[type]
  cardVisible.value = true
  playEffect('card')
}

function completeCard() {
  const pid = session.players[session.currentPlayerIdx].id
  addScore(pid, currentPoints.value)
  playEffect('score')
  const combo = checkCombo(pid)
  if (combo) {
    playEffect('combo')
    comboFx.value = true
    setTimeout(() => { comboFx.value = false }, 1000)
  }
  cardVisible.value = false
  nextTurn()
}

function skipCard() {
  const pid = session.players[session.currentPlayerIdx].id
  resetCombo(pid)
  cardVisible.value = false
  nextTurn()
}

function nextTurn() {
  session.turnCount++
  if (session.turnCount >= maxTurns) {
    finishGame({})
    return
  }
  switchPlayer()
}
</script>

<style scoped>
.heartbeat { padding: 16px 20px; }
.players { display: flex; gap: 12px; margin-bottom: 24px; }
.dice-area { text-align: center; padding: 30px 0; }
.dice {
  width: 80px; height: 80px; background: var(--c-card); border-radius: 16px;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
  font-size: 48px; box-shadow: var(--shadow); border: 2px solid var(--c-border);
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
.card-points { margin-top: 16px; font-size: 13px; color: var(--c-muted); }
.combo-fx {
  position: fixed; top: 35%; left: 50%; transform: translate(-50%, -50%);
  font-size: 48px; font-weight: 900; color: var(--c-secondary);
  text-shadow: 0 0 30px var(--c-primary); z-index: 200; pointer-events: none;
  opacity: 0; transition: all 0.5s;
}
.combo-fx.show { opacity: 1; animation: comboBounce 1s ease; }
</style>
