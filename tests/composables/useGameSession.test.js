import { describe, it, expect } from 'vitest'
import { useGameSession } from '../../src/composables/useGameSession'

describe('useGameSession', () => {
  it('startMode 初始化对局', () => {
    const { session, startMode } = useGameSession()
    startMode('heartbeat')
    expect(session.mode).toBe('heartbeat')
    expect(session.players.length).toBe(2)
    expect(session.players[0].score).toBe(0)
    expect(session.state).toBe('playing')
  })

  it('addScore 增加心动值', () => {
    const { session, startMode, addScore } = useGameSession()
    startMode('heartbeat')
    addScore('p1', 10)
    expect(session.players[0].score).toBe(10)
  })

  it('连击达3次额外加5分', () => {
    const { session, startMode, addScore, checkCombo } = useGameSession()
    startMode('heartbeat')
    addScore('p1', 10); checkCombo('p1')
    addScore('p1', 10); checkCombo('p1')
    addScore('p1', 10); const combo = checkCombo('p1')
    expect(combo).toBe(true)
    expect(session.players[0].score).toBe(35)
  })

  it('switchPlayer 切换当前玩家', () => {
    const { session, startMode, switchPlayer } = useGameSession()
    startMode('heartbeat')
    expect(session.currentPlayerIdx).toBe(0)
    switchPlayer()
    expect(session.currentPlayerIdx).toBe(1)
  })
})