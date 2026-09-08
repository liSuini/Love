<template>
  <div class="ttt-mode">
    <ScoreBoard icon="⭕" title="井字棋" :turnInfo="`${currentPlayer.nick}的回合`" @back="goHome" />

    <!-- 比分板 -->
    <div class="score-bar">
      <div class="player-tag" :class="{ active: idx === 0 }">
        <img :src="luluImg" class="tag-avatar" />
        <span class="tag-mark">⭕</span>
        <span class="tag-score">{{ wins[0] }}</span>
      </div>
      <span class="vs">VS</span>
      <div class="player-tag" :class="{ active: idx === 1 }">
        <span class="tag-score">{{ wins[1] }}</span>
        <span class="tag-mark">❌</span>
        <img :src="lumeiImg" class="tag-avatar" />
      </div>
    </div>

    <!-- 棋盘 -->
    <div class="ttt-main">
      <div class="ttt-board">
        <div
          v-for="i in 9" :key="i"
          class="ttt-cell"
          :class="{ win: winCells.includes(i - 1) }"
          @click="place(i - 1)"
        >
          <span v-if="board[i - 1] === 1" class="mark o">⭕</span>
          <span v-else-if="board[i - 1] === 2" class="mark x">❌</span>
        </div>
      </div>

      <!-- 胜负 -->
      <transition name="fade">
        <div v-if="gameOver" class="ttt-result">
          <div class="result-emoji">{{ winner === -1 ? '🤝' : '🎉' }}</div>
          <div class="result-title">{{ winner === -1 ? '平局！' : `${winner === 0 ? '噜噜' : '噜妹'}赢了！` }}</div>
          <div class="result-actions">
            <button class="btn-primary" @click="restart">再来一局</button>
            <button class="btn-secondary" @click="goHome">返回首页</button>
          </div>
        </div>
      </transition>

      <button v-if="!gameOver" class="btn-restart" @click="restart">重新开始</button>
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
const idx = ref(0)
const board = ref(Array(9).fill(0))
const winner = ref(null)
const winCells = ref([])
const wins = ref([0, 0])
const gameOver = computed(() => winner.value !== null)

const currentPlayer = computed(() => ({
  0: { nick: '噜噜' },
  1: { nick: '噜妹' },
}[idx.value]))

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function goHome() { router.push('/') }

function restart() {
  board.value = Array(9).fill(0)
  idx.value = 0
  winner.value = null
  winCells.value = []
}

function place(i) {
  if (board.value[i] !== 0 || winner.value !== null) return
  board.value[i] = idx.value + 1

  for (const line of LINES) {
    const [a, b, c] = line
    const v = board.value[a]
    if (v !== 0 && v === board.value[b] && v === board.value[c]) {
      winner.value = idx.value
      wins.value[idx.value]++
      winCells.value = line
      return
    }
  }
  if (board.value.every(v => v !== 0)) {
    winner.value = -1
    return
  }
  idx.value = idx.value === 0 ? 1 : 0
}
</script>

<style scoped>
.ttt-mode { padding: 16px 20px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }

.score-bar {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  margin-bottom: 18px; flex-shrink: 0;
}
.player-tag {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border-radius: 14px; background: var(--c-card); box-shadow: var(--shadow);
  border: 2px solid transparent; transition: all 0.3s; opacity: 0.6;
}
.player-tag.active { border-color: var(--c-primary); opacity: 1; transform: scale(1.03); }
.tag-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.tag-mark { font-size: 18px; }
.tag-score { font-size: 20px; font-weight: 800; color: var(--c-primary); }
.vs { font-size: 13px; font-weight: 700; color: var(--c-muted); }

.ttt-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
.ttt-board {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
  width: min(78vw, 300px); aspect-ratio: 1;
  background: var(--c-primary); padding: 6px; border-radius: 18px; box-shadow: var(--shadow);
}
.ttt-cell {
  background: var(--c-card); border-radius: 12px; display: flex;
  align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s;
}
.ttt-cell:hover:empty { background: rgba(255,107,157,0.08); }
.ttt-cell.win { background: rgba(255,217,61,0.25); }
.mark { font-size: clamp(28px, 9vw, 42px); }
.mark.o { animation: pop 0.2s ease; }
.mark.x { animation: pop 0.2s ease; }

@keyframes pop { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }

.ttt-result { text-align: center; }
.result-emoji { font-size: 48px; margin-bottom: 8px; }
.result-title { font-size: 22px; font-weight: 800; color: var(--c-primary); margin-bottom: 20px; }
.result-actions { display: flex; gap: 12px; justify-content: center; }
.btn-primary {
  background: var(--c-primary); color: #fff; border: none; border-radius: 14px;
  padding: 12px 26px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow);
}
.btn-secondary {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 12px 22px; font-size: 16px; cursor: pointer;
}
.btn-restart {
  background: transparent; color: var(--c-muted); border: 1px solid var(--c-border);
  border-radius: 14px; padding: 10px 24px; font-size: 15px; cursor: pointer; transition: all 0.2s;
}
.btn-restart:hover { border-color: var(--c-primary); color: var(--c-primary); }

.fade-enter-active, .fade-leave-active { transition: all 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
