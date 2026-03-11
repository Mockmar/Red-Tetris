const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const GameManager = require("./src/managers/GameManager")
const Player = require("./src/models/Player")

const {
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  hardDrop,
} = require("./src/engine/reducer")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

const gameManager = new GameManager()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("start_game", ({ roomId }) => {
    const game = gameManager.getGame(roomId)

    if (!game) {
      return
    }

    if (game.hostId !== socket.id) {
      socket.emit("start_error", {
        message: "Only the host can start the game"
      })
      return
    }

    const started = game.start(io)

    if (!started) {
      socket.emit("start_error", {
        message: "Game is already running"
      })
      return
    }

    io.to(roomId).emit("game_started", {
      roomId: game.roomId,
      hostId: game.hostId,
      status: game.status,
      players: game.getPlayersList()
    })
  })

  socket.on("join_room", ({ roomId, playerName }) => {
    console.log("join_room", roomId, playerName)
    if (!roomId || !playerName) {
      return
    }

    const game = gameManager.getOrCreateGame(roomId)

    if (game.status !== "waiting") {
      socket.emit("join_error", {
        message: "A game is already running in this room"
      })
      return
    }

    const player = new Player(socket.id, playerName)

    game.addPlayer(player)
    socket.join(roomId)

    io.to(roomId).emit("room_update", {
      roomId: game.roomId,
      hostId: game.hostId,
      status: game.status,
      players: game.getPlayersList()
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    for (const [roomId, game] of gameManager.games.entries()) {
      if (game.getPlayer(socket.id)) {

        game.removePlayer(socket.id)

        io.to(roomId).emit("room_update", {
          roomId: game.roomId,
          hostId: game.hostId,
          status: game.status,
          players: game.getPlayersList()
        })

        if (game.players.size === 0 && game.loop) {
          clearInterval(game.loop)
          game.loop = null
        }

        gameManager.removeGameIfEmpty(roomId)

        break
      }
    }
  })

    socket.on("player_input", ({ roomId, type }) => {
    const game = gameManager.getGame(roomId)

    if (!game || game.status !== "running") {
      return
    }

    const player = game.getPlayer(socket.id)

    if (!player || !player.alive || !player.state) {
      return
    }

    switch (type) {
      case "LEFT":
        player.state = moveLeft(player.state)
        break
      case "RIGHT":
        player.state = moveRight(player.state)
        break
      case "DOWN":
        player.state = moveDown(player.state)
        break
      case "ROTATE":
        player.state = rotate(player.state)
        break
      case "HARD_DROP":
        player.state = hardDrop(player.state)
        if (player.state.status === "over") {
          player.alive = false
        }
        break
      default:
        return
    }

    io.to(player.socketId).emit("game_state", {
      self: player.state,
      roomId: game.roomId,
      hostId: game.hostId,
      status: game.status,
      players: game.getPlayersList(),
    })
  })
})

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})