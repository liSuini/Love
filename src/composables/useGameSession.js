import { reactive } from 'vue'

export function useGameSession() {
  const session = reactive({
    mode: null,
    players: [
      { id: 'p1', nick: 'TA', score: 0, combo: 0 },
      { id: 'p2', nick: '宝贝', score: 0, combo: 0 },
    ],
    currentPlayerIdx: 0,
    turnCount: 0,
    state: 'idle',
    result: null,
  })

  function startMode(modeId) {
    session.mode = modeId
    session.players.forEach(p => { p.score = 0; p.combo = 0 })
    session.currentPlayerIdx = 0
    session.turnCount = 0
    session.state = 'playing'
    session.result = null
  }

  function switchPlayer() {
    session.currentPlayerIdx = 1 - session.currentPlayerIdx
  }

  function addScore(playerId, points) {
    const p = session.players.find(p => p.id === playerId)
    if (p) p.score += points
  }

  function checkCombo(playerId) {
    const p = session.players.find(p => p.id === playerId)
    if (!p) return false
    p.combo++
    if (p.combo >= 3) {
      p.score += 5
      p.combo = 0
      return true
    }
    return false
  }

  function resetCombo(playerId) {
    const p = session.players.find(p => p.id === playerId)
    if (p) p.combo = 0
  }

  function finishGame(result) {
    session.state = 'finished'
    session.result = result
  }

  function reset() {
    startMode(session.mode)
  }

  return { session, startMode, switchPlayer, addScore, checkCombo, resetCombo, finishGame, reset }
}