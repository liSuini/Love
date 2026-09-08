<template>
  <div class="quiz-mode">
    <ScoreBoard icon="❤️" title="默契问答" :turnInfo="quizPhase === 'finished' ? '' : `第 ${quizIdx + 1}/${totalQuestions} 题`" @back="goHome" />

    <!-- 玩家区 -->
    <div class="players">
      <PlayerCard v-for="(p, i) in session.players" :key="p.id" :player="p" :isActive="false" />
    </div>

    <!-- 问答阶段 -->
    <div v-if="quizPhase === 'p1'" class="quiz-area">
      <div class="quiz-progress">轮流回答同一道题，测试你们的默契</div>
      <div class="quiz-question">
        <div class="who">{{ '🧑 ' + session.players[0].nick }} 回答</div>
        <div class="text">{{ currentQuestion.question }}</div>
      </div>
      <input ref="inputRef" v-model="p1Answer" type="text" class="quiz-input" placeholder="输入你的答案..." @keydown.enter="submitP1">
      <button class="btn-primary" @click="submitP1">提交</button>
    </div>

    <div v-else-if="quizPhase === 'p2'" class="quiz-area">
      <div class="quiz-progress">轮到另一半了，别偷看哦～</div>
      <div class="quiz-question">
        <div class="who">{{ '💕 ' + session.players[1].nick }} 回答</div>
        <div class="text">{{ currentQuestion.question }}</div>
      </div>
      <input ref="inputRef" v-model="p2Answer" type="text" class="quiz-input" placeholder="输入你的答案..." @keydown.enter="submitP2">
      <button class="btn-primary" @click="submitP2">提交</button>
    </div>

    <div v-else-if="quizPhase === 'result'" class="quiz-area">
      <div class="quiz-result" :class="matched ? 'match' : 'miss'">
        <div class="title">{{ matched ? '💕 心有灵犀！' : '😅 默契不足' }}</div>
        <div class="detail">
          {{ session.players[0].nick }}: {{ p1Answer }}<br>
          {{ session.players[1].nick }}: {{ p2Answer }}<br>
          <span v-if="matched">双方各 +10 分</span>
          <span v-else>触发一张惩罚卡作为小惩罚~</span>
        </div>
      </div>
      <div v-if="!matched" class="punish-card">
        <span class="card-type punishment">🔥 惩罚卡</span>
        <div class="punish-content">{{ punishCard?.content }}</div>
      </div>
      <button class="btn-primary" @click="nextQuestion">{{ quizIdx + 1 >= totalQuestions ? '查看结果' : '下一题' }}</button>
    </div>

    <!-- 结算页 -->
    <ResultScreen v-if="quizPhase === 'finished'"
      emoji="💕" title="默契度结算" icon="❤️"
      :players="session.players"
      :extra="`${matchPercent}% 默契度`"
      :summary="resultSummary"
      @restart="restart" @home="goHome"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGameSession } from '../../composables/useGameSession'
import { useAudio } from '../../composables/useAudio'
import { CardLibrary } from '../../services/CardLibrary'
import quizData from '../../data/quiz.json'
import punishments from '../../data/punishments.json'
import PlayerCard from '../../components/PlayerCard.vue'
import ScoreBoard from '../../components/ScoreBoard.vue'
import ResultScreen from '../../components/ResultScreen.vue'

const router = useRouter()
const { session, startMode, addScore, reset } = useGameSession()
const { playEffect } = useAudio()

const totalQuestions = 10
const punishLib = new CardLibrary('punishment', punishments)

const quizQuestions = ref([])
const quizIdx = ref(0)
const quizPhase = ref('p1')
const p1Answer = ref('')
const p2Answer = ref('')
const matched = ref(false)
const punishCard = ref(null)
const inputRef = ref(null)

const currentQuestion = computed(() => quizQuestions.value[quizIdx.value] || {})

const matchPercent = computed(() => {
  const totalPossible = totalQuestions * 20
  const actual = session.players[0].score + session.players[1].score
  return Math.round(actual / totalPossible * 100)
})

const resultSummary = computed(() => {
  const pct = matchPercent.value
  if (pct >= 80) return '心有灵犀一点通！你们是天作之合 💞'
  if (pct >= 50) return '还需要更多了解彼此，继续加油！💕'
  if (pct >= 25) return '多花点时间相处吧，每一段感情都值得用心经营 🌹'
  return '没关系，爱不在于了解多少，而在于愿意一直了解下去 😊'
})

onMounted(() => {
  startMode('quiz')
  quizQuestions.value = [...quizData].sort(() => Math.random() - 0.5).slice(0, totalQuestions)
  nextTick(() => inputRef.value?.focus())
})

function goHome() { router.push('/') }

function submitP1() {
  if (!p1Answer.value.trim()) return
  playEffect('card')
  quizPhase.value = 'p2'
  p2Answer.value = ''
  nextTick(() => inputRef.value?.focus())
}

function submitP2() {
  if (!p2Answer.value.trim()) return
  const a1 = p1Answer.value.toLowerCase().trim()
  const a2 = p2Answer.value.toLowerCase().trim()
  matched.value = a1 === a2
  if (matched.value) {
    addScore('p1', 10)
    addScore('p2', 10)
    playEffect('score')
  } else {
    punishCard.value = punishLib.draw()
    playEffect('card')
  }
  quizPhase.value = 'result'
}

function nextQuestion() {
  quizIdx.value++
  p1Answer.value = ''
  p2Answer.value = ''
  if (quizIdx.value >= totalQuestions) {
    quizPhase.value = 'finished'
  } else {
    quizPhase.value = 'p1'
    nextTick(() => inputRef.value?.focus())
  }
}

function restart() {
  reset()
  quizIdx.value = 0
  quizPhase.value = 'p1'
  p1Answer.value = ''
  p2Answer.value = ''
  matched.value = false
  punishCard.value = null
  quizQuestions.value = [...quizData].sort(() => Math.random() - 0.5).slice(0, totalQuestions)
  nextTick(() => inputRef.value?.focus())
}
</script>

<style scoped>
.quiz-mode { padding: 16px 20px; }
.players { display: flex; gap: 12px; margin-bottom: 24px; }
.quiz-area { text-align: center; padding: 20px 0; }
.quiz-progress { font-size: 14px; color: var(--c-muted); margin-bottom: 24px; }
.quiz-question {
  background: var(--c-card); border-radius: var(--radius); padding: 28px 24px;
  box-shadow: var(--shadow); margin-bottom: 24px; animation: fadeInUp 0.4s ease;
}
.who { font-size: 14px; font-weight: 600; color: var(--c-primary); margin-bottom: 12px; }
.text { font-size: 20px; font-weight: 600; line-height: 1.6; }
.quiz-input {
  width: 90%; padding: 14px 18px; border: 2px solid var(--c-border);
  border-radius: 14px; font-size: 16px; background: var(--c-card);
  color: var(--c-text); outline: none; transition: border-color 0.2s; margin-bottom: 16px;
}
.quiz-input:focus { border-color: var(--c-primary); }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 14px 40px; font-size: 18px; font-weight: 700; cursor: pointer;
  box-shadow: var(--shadow); transition: all 0.2s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
.quiz-result {
  border-radius: var(--radius); padding: 28px 24px; margin-bottom: 20px; animation: fadeInUp 0.4s ease;
}
.quiz-result.match { background: rgba(78, 205, 196, 0.15); }
.quiz-result.miss { background: rgba(245, 87, 108, 0.15); }
.quiz-result .title { font-size: 22px; font-weight: 800; margin-bottom: 16px; color: var(--c-primary); }
.quiz-result .detail { font-size: 16px; line-height: 2; color: var(--c-text); }
.punish-card {
  background: var(--c-card); border-radius: var(--radius); padding: 24px 20px;
  box-shadow: var(--shadow); margin-bottom: 20px; text-align: center;
}
.card-type {
  font-size: 14px; color: #fff; padding: 4px 16px; border-radius: 20px;
  display: inline-block; font-weight: 600; margin-bottom: 16px;
}
.card-type.punishment { background: #f5576c; }
.punish-content { font-size: 18px; font-weight: 500; line-height: 1.6; }
</style>
