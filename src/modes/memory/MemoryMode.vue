<template>
  <div class="mem-mode">
    <ScoreBoard icon="🃏" title="心电感应" :turnInfo="`${currentPlayer.nick}翻牌`" @back="goHome" />

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

    <!-- 进度 -->
    <div class="mem-progress">
      已配对 {{ matched }} / {{ TOTAL_PAIRS }} · 回合 {{ round }}
    </div>

    <!-- 牌面 -->
    <div class="mem-main">
      <div class="card-grid">
        <div
          v-for="card in cards" :key="card.id"
          class="card"
          :class="{ flipped: card.flipped, matched: card.matched }"
          @click="flipCard(card)"
        >
          <div class="card-inner">
            <div class="card-back">💖</div>
            <div class="card-front">{{ card.emoji }}</div>
          </div>
        </div>
      </div>

      <!-- 结算 -->
      <transition name="fade">
        <div v-if="matched === TOTAL_PAIRS" class="mem-result">
          <div class="result-emoji">{{ scores[0] === scores[1] ? '🤝' : '🎉' }}</div>
          <div class="result-title">
            {{ scores[0] === scores[1] ? '平局！默契满分！' : `${scores[0] > scores[1] ? '噜噜' : '噜妹'}赢了！` }}
          </div>
          <div class="result-detail">噜噜 {{ scores[0] }} : {{ scores[1] }} 噜妹</div>
          <div class="result-actions">
            <button class="btn-primary" @click="restart">再来一局</button>
            <button class="btn-secondary" @click="goHome">返回首页</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ScoreBoard from '../../components/ScoreBoard.vue'
import luluImg from '../../assets/avatars/lulu.jpg'
import lumeiImg from '../../assets/avatars/lumei.jpg'

const router = useRouter()
const EMOJIS = ['🌹', '🍫', '💍', '🐨', '🌙', '⭐', '🎈', '🍓']
const TOTAL_PAIRS = EMOJIS.length

const idx = ref(0)
const scores = ref([0, 0])
const cards = ref([])
const flippedCards = ref([])
const matched = ref(0)
const round = ref(1)
const lock = ref(false)

const currentPlayer = computed(() => ({
  0: { nick: '噜噜' },
  1: { nick: '噜妹' },
}[idx.value]))

function goHome() { router.push('/') }

function buildDeck() {
  const deck = [...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false,
  }))
  // Fisher-Yates 洗牌
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  cards.value = deck
}

function restart() {
  idx.value = 0
  scores.value = [0, 0]
  matched.value = 0
  round.value = 1
  flippedCards.value = []
  lock.value = false
  buildDeck()
}

function flipCard(card) {
  if (lock.value || card.flipped || card.matched) return
  card.flipped = true
  flippedCards.value.push(card)

  if (flippedCards.value.length === 2) {
    lock.value = true
    const [a, b] = flippedCards.value
    if (a.emoji === b.emoji) {
      // 配对成功
      setTimeout(() => {
        a.matched = true
        b.matched = true
        scores.value[idx.value]++
        matched.value++
        flippedCards.value = []
        lock.value = false
      }, 500)
    } else {
      // 不匹配
      setTimeout(() => {
        a.flipped = false
        b.flipped = false
        flippedCards.value = []
        idx.value = idx.value === 0 ? 1 : 0
        if (idx.value === 0) round.value++
        lock.value = false
      }, 900)
    }
  }
}

buildDeck()
</script>

<style scoped>
.mem-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }

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
.tag-score { font-size: 22px; font-weight: 800; color: var(--c-primary); }
.vs { font-size: 13px; font-weight: 700; color: var(--c-muted); }

.mem-progress { text-align: center; font-size: 13px; color: var(--c-muted); margin-bottom: 14px; flex-shrink: 0; }

.mem-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
.card-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
  width: min(90vw, 360px);
}
.card {
  aspect-ratio: 3 / 4; perspective: 600px; cursor: pointer;
}
.card-inner {
  width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
  transition: transform 0.4s; border-radius: 12px;
}
.card.flipped .card-inner { transform: rotateY(180deg); }
.card-back, .card-front {
  position: absolute; inset: 0; backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center; border-radius: 12px;
  font-size: clamp(24px, 7vw, 34px); box-shadow: var(--shadow);
}
.card-back {
  background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
}
.card-front {
  background: var(--c-card); transform: rotateY(180deg);
  border: 2px solid var(--c-primary);
}
.card.matched .card-front { border-color: #4ecdc4; background: rgba(78,205,196,0.12); }
.card.matched { pointer-events: none; }

.mem-result { text-align: center; }
.result-emoji { font-size: 48px; margin-bottom: 8px; }
.result-title { font-size: 22px; font-weight: 800; color: var(--c-primary); margin-bottom: 8px; }
.result-detail { font-size: 16px; color: var(--c-muted); margin-bottom: 20px; }
.result-actions { display: flex; gap: 12px; justify-content: center; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 12px 26px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow);
}
.btn-secondary {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 22px; font-size: 16px; cursor: pointer;
}

.fade-enter-active, .fade-leave-active { transition: all 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
