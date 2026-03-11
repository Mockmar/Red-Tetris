const { createInitialState } = require("../engine/state")
const { step } = require("../engine/reducer")
const { getSpectrum } = require("../engine/board")

class Game {
  constructor(roomId) {
    this.roomId = roomId
    this.players = new Map()
    this.hostId = null
    this.status = "waiting"
    this.loop = null
  }

  addPlayer(player) {
    this.players.set(player.socketId, player)

    if (!this.hostId) {
      this.hostId = player.socketId
    }
  }

  removePlayer(socketId) {
    this.players.delete(socketId)

    if (this.hostId === socketId) {
      const nextPlayer = this.players.keys().next().value
      this.hostId = nextPlayer || null
    }
  }

  getPlayer(socketId) {
    return this.players.get(socketId)
  }

  getPlayersList() {
    return Array.from(this.players.values()).map((player) => ({
      socketId: player.socketId,
      name: player.name,
      alive: player.alive,
    }))
  }

  start(io) {
    if (this.status === "running") {
      return false
    }

    this.status = "running"

    for (const player of this.players.values()) {
      player.alive = true
      player.state = createInitialState()
    }

    this.broadcastStates(io)
    this.startLoop(io)

    return true
  }

  startLoop(io) {
    if (this.loop) {
      clearInterval(this.loop)
    }

    this.loop = setInterval(() => {
      let aliveCount = 0

      for (const player of this.players.values()) {
        if (!player.alive || !player.state) {
          continue
        }

        player.state = step(player.state)

        if (player.state.status === "over") {
          player.alive = false
        } else {
          aliveCount += 1
        }
      }

      this.broadcastStates(io)

      if (aliveCount <= 1) {
        this.end(io)
      }
    }, 500)
  }

  broadcastStates(io) {
    const playersData = Array.from(this.players.values()).map((player) => ({
      socketId: player.socketId,
      name: player.name,
      alive: player.alive,
      spectrum: player.state ? getSpectrum(player.state.board) : [],
    }))

    for (const player of this.players.values()) {
      io.to(player.socketId).emit("game_state", {
        self: player.state,
        roomId: this.roomId,
        hostId: this.hostId,
        status: this.status,
        players: playersData,
      })
    }
  }

  end(io) {
    if (this.loop) {
      clearInterval(this.loop)
      this.loop = null
    }

    this.status = "finished"

    io.to(this.roomId).emit("game_over", {
      roomId: this.roomId,
      players: this.getPlayersList(),
    })
  }
}

module.exports = Game