export class CardLibrary {
  constructor(type, cards) {
    this.type = type
    this.cards = [...cards]
    this.recentDraws = []
    this.maxRecent = 10
  }

  draw() {
    let pool = this.cards.filter(c => !this.recentDraws.includes(c.id))
    if (pool.length === 0) {
      this.recentDraws = []
      pool = this.cards
    }
    const card = pool[Math.floor(Math.random() * pool.length)]
    this.recentDraws.push(card.id)
    if (this.recentDraws.length > this.maxRecent) {
      this.recentDraws.shift()
    }
    return card
  }

  reset() {
    this.recentDraws = []
  }
}