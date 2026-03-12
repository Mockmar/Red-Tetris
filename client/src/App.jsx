import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import BoardView from "./components/Board"
import SpectrumView from "./components/SpectrumView"

const socket = io("http://localhost:3000")

function App() {
  const [room, setRoom] = useState(null)
  const [gameState, setGameState] = useState(null)

  useEffect(() => {
    socket.emit("join_room", {
      roomId: "room42",
      playerName: `jb-${Math.floor(Math.random() * 1000)}`    })

    socket.on("room_update", (payload) => {
      console.log("room_update", payload)
      setRoom(payload)
    })

    socket.on("game_started", (payload) => {
      console.log("game_started", payload)
      setRoom(payload)
    })

    socket.on("game_state", (payload) => {
      console.log("game_state", payload)
      setGameState(payload)
    })

    socket.on("start_error", (payload) => {
      console.log("start_error", payload)
    })

    socket.on("game_over", (payload) => {
      console.log("game_over", payload)
    })

    return () => {
      socket.off("room_update")
      socket.off("game_started")
      socket.off("game_state")
      socket.off("start_error")
      socket.off("game_over")
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.code === "Space"
      ) {
        event.preventDefault()
      }

      if (event.key === "ArrowLeft") {
        socket.emit("player_input", { roomId: "room42", type: "LEFT" })
      } else if (event.key === "ArrowRight") {
        socket.emit("player_input", { roomId: "room42", type: "RIGHT" })
      } else if (event.key === "ArrowDown") {
        socket.emit("player_input", { roomId: "room42", type: "DOWN" })
      } else if (event.key === "ArrowUp") {
        socket.emit("player_input", { roomId: "room42", type: "ROTATE" })
      } else if (event.code === "Space") {
        socket.emit("player_input", { roomId: "room42", type: "HARD_DROP" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div>
      <h1>Red Tetris</h1>

      <button onClick={() => socket.emit("start_game", { roomId: "room42" })}>
        Start
      </button>

      {gameState && (
        <BoardView
          board={gameState.self.board}
          piece={gameState.self.activePiece}
        />
      )}

      <div>
        {gameState && gameState.BoardView}
      </div>

      <h2>Other players</h2>

      {gameState?.players?.map((player) => {
        if (player.socketId === socket.id) {
          return null
        }

        return (
          <div key={player.socketId}>
            <p>{player.name}</p>
            <SpectrumView spectrum={player.spectrum} />
          </div>
        )
      })}
    </div>
  )
}

export default App
