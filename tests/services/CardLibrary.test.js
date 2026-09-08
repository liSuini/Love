import { describe, it, expect, beforeEach } from 'vitest'
import { CardLibrary } from '../../src/services/CardLibrary'
import tasks from '../../src/data/tasks.json'

describe('CardLibrary', () => {
  let lib
  beforeEach(() => {
    lib = new CardLibrary('task', tasks)
  })

  it('draw() 返回有效卡牌', () => {
    const card = lib.draw()
    expect(card).toHaveProperty('id')
    expect(card).toHaveProperty('type', 'task')
    expect(card).toHaveProperty('content')
    expect(card).toHaveProperty('level')
  })

  it('连续抽取不重复（防短期重复）', () => {
    const ids = new Set()
    for (let i = 0; i < Math.min(10, tasks.length); i++) {
      const card = lib.draw()
      expect(ids.has(card.id)).toBe(false)
      ids.add(card.id)
    }
  })

  it('reset() 清空抽取历史', () => {
    const first = lib.draw()
    lib.reset()
    const draws = []
    for (let i = 0; i < 10; i++) draws.push(lib.draw().id)
    expect(draws.length).toBe(10)
  })
})