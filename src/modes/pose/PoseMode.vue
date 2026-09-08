<template>
  <div class="pose-mode">
    <ScoreBoard icon="🧘" title="姿势大挑战" :turnInfo="`第 ${round} 轮 · ${currentPlayer.nick}的回合`" @back="goHome" />

    <!-- 玩家区 -->
    <div class="players">
      <PlayerCard v-for="(p, i) in session.players" :key="p.id" :player="p" :isActive="i === session.currentPlayerIdx" />
    </div>

    <!-- 主内容区 -->
    <div class="pose-main">
      <template v-if="!currentPose && !finished">
        <div class="pose-intro">
          <div class="intro-icon">🧘</div>
          <div class="intro-title">姿势大挑战</div>
          <div class="intro-desc">抽卡解锁亲密姿势教学<br>情侣配合完成 · 先到100分获胜</div>
          <button class="btn-primary" @click="drawPose">抽取姿势卡</button>
        </div>
      </template>

      <template v-else-if="currentPose && !finished">
        <!-- 姿势教学卡 -->
        <div class="pose-card" :class="`cat-${currentPose.category}`">
          <div class="pose-card-header">
            <span class="pose-badge cat-badge">{{ categoryEmoji(currentPose.category) }} {{ currentPose.category }}</span>
            <span class="pose-badge diff-badge">难度 {{ '★'.repeat(currentPose.difficulty) }}</span>
          </div>
          <div class="pose-name">{{ currentPose.name }}</div>
          <div class="pose-desc">{{ currentPose.description }}</div>

          <!-- 教学步骤 -->
          <div class="pose-section">
            <div class="section-title">📋 动作步骤</div>
            <ol class="step-list">
              <li v-for="(step, i) in currentPose.steps" :key="i">{{ step }}</li>
            </ol>
          </div>

          <!-- 小贴士 -->
          <div class="pose-section tips-section">
            <div class="section-title">💡 小贴士</div>
            <div class="tips-content">{{ currentPose.tips }}</div>
          </div>

          <!-- 注意事项 -->
          <div class="pose-section caution-section">
            <div class="section-title">⚠️ 注意事项</div>
            <div class="caution-content">{{ currentPose.caution }}</div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="pose-actions">
          <button class="btn-primary" @click="completePose">完成 (+{{ currentPoints }})</button>
          <button class="btn-skip" @click="skipPose">跳过</button>
          <button class="btn-next" @click="nextPose">换一个</button>
        </div>
      </template>

      <!-- 结算页 -->
      <ResultScreen v-if="finished"
        emoji="💓" title="姿势大挑战" icon="🧘"
        :players="session.players" :winner="winner"
        :extra="resultExtra" :summary="resultSummary"
        @restart="restart" @home="goHome"
      />
    </div>

    <!-- 连击特效 -->
    <div class="combo-fx" :class="{ show: comboFx }">连击 +5🔥</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameSession } from '../../composables/useGameSession'
import { useAudio } from '../../composables/useAudio'
import { CardLibrary } from '../../services/CardLibrary'
import poseData from '../../data/poses.json'
import PlayerCard from '../../components/PlayerCard.vue'
import ScoreBoard from '../../components/ScoreBoard.vue'
import ResultScreen from '../../components/ResultScreen.vue'

const router = useRouter()
const { session, startMode, switchPlayer, addScore, checkCombo, resetCombo, finishGame, reset } = useGameSession()
const { playEffect } = useAudio()

const TARGET_SCORE = 100
const typePoints = { 1: 8, 2: 10, 3: 13, 4: 16, 5: 20 }

const library = new CardLibrary('pose', poseData)
const round = ref(1)
const currentPose = ref(null)
const currentPoints = ref(0)
const finished = ref(false)
const comboFx = ref(false)

const currentPlayer = computed(() => session.players[session.currentPlayerIdx])

const winner = computed(() => {
  if (!finished.value) return null
  const [p1, p2] = session.players
  return p1.score >= p2.score ? p1 : p2
})

const resultSummary = computed(() => {
  const [p1, p2] = session.players
  const diff = Math.abs(p1.score - p2.score)
  if (diff === 0) return '势均力敌！你们配合得天衣无缝 💕'
  const w = winner.value
  const l = w === p1 ? p2 : p1
  if (diff <= 5) return `${w.nick}险胜！你们的默契只差一点点 💕`
  if (diff <= 15) return `${w.nick}完胜！今晚${l.nick}要好好配合 🥰`
  return `${w.nick}大获全胜！解锁了超多新姿势 😏`
})

const resultExtra = computed(() => {
  if (!finished.value) return ''
  const diff = Math.abs(session.players[0].score - session.players[1].score)
  if (diff === 0) return '平局！'
  return `${winner.value.nick} 获胜！`
})

startMode('pose')

function goHome() { router.push('/') }

function restart() {
  reset()
  round.value = 1
  currentPose.value = null
  finished.value = false
}

function categoryEmoji(cat) {
  const map = { '经典': '📘', '进阶': '📗', '高阶': '📕' }
  return map[cat] || '📖'
}

function drawPose() {
  const pose = library.draw()
  currentPose.value = pose
  currentPoints.value = typePoints[pose.difficulty] || 10
  playEffect('card')
}

function nextPose() {
  const pose = library.draw()
  currentPose.value = pose
  currentPoints.value = typePoints[pose.difficulty] || 10
  playEffect('card')
}

function completePose() {
  const pid = currentPlayer.value.id
  addScore(pid, currentPoints.value)
  playEffect('score')
  const combo = checkCombo(pid)
  if (combo) {
    playEffect('combo')
    comboFx.value = true
    setTimeout(() => { comboFx.value = false }, 1000)
  }
  currentPose.value = null

  if (session.players[0].score >= TARGET_SCORE || session.players[1].score >= TARGET_SCORE) {
    finished.value = true
    finishGame({})
    return
  }
  endTurn()
}

function skipPose() {
  resetCombo(currentPlayer.value.id)
  currentPose.value = null
  endTurn()
}

function endTurn() {
  switchPlayer()
  if (session.currentPlayerIdx === 0) round.value++
}
</script>

<style scoped>
.pose-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
.players { display: flex; gap: 12px; margin-bottom: 16px; flex-shrink: 0; }

.pose-main { flex: 1; display: flex; flex-direction: column; justify-content: center; }

/* 引导页 */
.pose-intro { text-align: center; padding: 20px; }
.intro-icon { font-size: 56px; margin-bottom: 16px; }
.intro-title { font-size: 24px; font-weight: 800; color: var(--c-primary); margin-bottom: 8px; }
.intro-desc { font-size: 14px; color: var(--c-muted); line-height: 1.8; margin-bottom: 28px; }

/* 姿势教学卡 */
.pose-card {
  background: var(--c-card); border-radius: var(--radius); padding: 20px 18px;
  box-shadow: var(--shadow); margin-bottom: 16px; max-height: 60vh; overflow-y: auto;
  border-top: 4px solid var(--c-primary);
}
.pose-card.cat-经典 { border-top-color: #4ecdc4; }
.pose-card.cat-进阶 { border-top-color: #ffd93d; }
.pose-card.cat-高阶 { border-top-color: #f5576c; }

.pose-card-header { display: flex; gap: 8px; margin-bottom: 12px; }
.pose-badge {
  font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 600;
}
.cat-badge { background: rgba(255,107,157,0.15); color: var(--c-primary); }
.diff-badge { background: rgba(255,217,61,0.2); color: #b8860b; }

.pose-name { font-size: 22px; font-weight: 800; color: var(--c-primary); margin-bottom: 6px; }
.pose-desc { font-size: 13px; color: var(--c-muted); margin-bottom: 16px; line-height: 1.5; }

.pose-section { margin-bottom: 14px; }
.section-title { font-size: 13px; font-weight: 700; color: var(--c-text); margin-bottom: 6px; }

.step-list { list-style: none; counter-reset: step; padding: 0; }
.step-list li {
  counter-increment: step; position: relative; padding-left: 28px; margin-bottom: 6px;
  font-size: 13px; line-height: 1.6; color: var(--c-text);
}
.step-list li::before {
  content: counter(step); position: absolute; left: 0; top: 0;
  width: 20px; height: 20px; border-radius: 50%; background: var(--c-primary); color: #fff;
  font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
}

.tips-section { background: rgba(78,205,196,0.1); border-radius: 10px; padding: 10px 12px; }
.tips-content { font-size: 13px; line-height: 1.6; color: var(--c-text); }

.caution-section { background: rgba(245,87,108,0.1); border-radius: 10px; padding: 10px 12px; }
.caution-content { font-size: 13px; line-height: 1.6; color: var(--c-text); }

/* 按钮区 */
.pose-actions { display: flex; gap: 10px; justify-content: center; flex-shrink: 0; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 12px 28px; font-size: 16px; font-weight: 700; cursor: pointer;
  box-shadow: var(--shadow); transition: all 0.2s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
.btn-skip {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 20px; font-size: 15px; cursor: pointer; transition: all 0.2s;
}
.btn-next {
  background: transparent; color: var(--c-secondary); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 20px; font-size: 15px; cursor: pointer; transition: all 0.2s;
}
.btn-skip:hover, .btn-next:hover { border-color: var(--c-primary); }

.combo-fx {
  position: fixed; top: 35%; left: 50%; transform: translate(-50%, -50%);
  font-size: 48px; font-weight: 900; color: var(--c-secondary);
  text-shadow: 0 0 30px var(--c-primary); z-index: 200; pointer-events: none;
  opacity: 0; transition: all 0.5s;
}
.combo-fx.show { opacity: 1; animation: comboBounce 1s ease; }

@media (max-width: 480px) {
  .pose-card { padding: 16px 14px; }
  .pose-name { font-size: 19px; }
  .step-list li { font-size: 12px; }
  .btn-primary { padding: 10px 22px; font-size: 15px; }
}
</style>
