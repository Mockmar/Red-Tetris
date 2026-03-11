const Game = require("../models/Game")

class GameManager {
  constructor() {
    this.games = new Map()
  }

  getOrCreateGame(roomId) {
    if (!this.games.has(roomId)) {
      this.games.set(roomId, new Game(roomId))
    }

    return this.games.get(roomId)
  }

  getGame(roomId) {
    return this.games.get(roomId)
  }

  removeGameIfEmpty(roomId) {
    const game = this.games.get(roomId)

    if (game && game.players.size === 0) {
      this.games.delete(roomId)
    }
  }
}

module.exports = GameManager