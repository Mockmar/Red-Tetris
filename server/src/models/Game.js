const { createInitialState, createRandomPiece } = require("../engine/state")
const { step } = require("../engine/reducer")
const { getSpectrum } = require("../engine/board")

class Game {
  constructor(roomId) {
    this.roomId = roomId
    this.players = new Map()
    this.hostId = null
    this.status = "waiting"
    this.loop = null
    this.sharedPieceSequence = []
  }

  fillPieceSequence(minLength = 14) {
    while (this.sharedPieceSequence.length < minLength) {
      this.sharedPieceSequence.push(createRandomPiece())
    }
  }

  getNextPieceForPlayer(player) {
    if (player.nextPieceIndex >= this.sharedPieceSequence.length) {
      this.fillPieceSequence(player.nextPieceIndex + 1)
    }

    const nextPiece = this.sharedPieceSequence[player.nextPieceIndex]
    player.nextPieceIndex += 1

    if (this.sharedPieceSequence.length - player.nextPieceIndex < 7) {
      this.fillPieceSequence(player.nextPieceIndex + 7)
    }

    return { ...nextPiece }
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
    this.sharedPieceSequence = []
    this.fillPieceSequence()

    const initialPiece = { ...this.sharedPieceSequence[0] }

    for (const player of this.players.values()) {
      player.alive = true
      player.nextPieceIndex = 1
      player.state = createInitialState(initialPiece)
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

        player.state = step(player.state, () => this.getNextPieceForPlayer(player))

        const cleared = player.state.cleared || 0

        if (cleared > 1) {
          this.sendGarbage(player.socketId, cleared - 1)
        }

        if (player.state.status === "over") {
          player.alive = false
        } else {
          aliveCount += 1
        }
      }

      this.broadcastStates(io)

      if (aliveCount === 0) {
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

  sendGarbage(fromSocketId, lines) {
    for (const player of this.players.values()) {

      if (player.socketId === fromSocketId) {
        continue
      }

      if (!player.alive || !player.state) {
        continue
      }

      player.state.board = this.addGarbageLines(player.state.board, lines)
    }
  }

  addGarbageLines(board, lines) {
    const width = board[0].length
    const height = board.length

    let newBoard = board.map(row => [...row])

    for (let i = 0; i < lines; i++) {

      newBoard.shift()

      const hole = Math.floor(Math.random() * width)
      // 8 pour differencier avec les pieces
      const garbage = Array(width).fill(8)
      garbage[hole] = 0

      newBoard.push(garbage)
    }

    return newBoard
  }
}



module.exports = Game