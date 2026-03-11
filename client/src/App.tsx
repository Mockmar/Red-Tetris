// import { useState, useEffect } from "react"
// import { createInitialState } from "./engine/state"
// import { moveLeft, moveRight, moveDown, rotate, step, hardDrop } from "./engine/reducer"
// import BoardView from "./components/Board"

// function App() {
//   const [state, setState] = useState(createInitialState())


//   useEffect(() => {
//     const interval = setInterval(() => {
//       setState(prev => step(prev))
//     }, 500)

//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//   function handleKeyDown(event: KeyboardEvent) {
//     if (state.status === "over") return

//     if (event.key === "ArrowLeft") {
//       setState((prev) => moveLeft(prev))
//     } else if (event.key === "ArrowRight") {
//       setState((prev) => moveRight(prev))
//     } else if (event.key === "ArrowDown") {
//       setState((prev) => moveDown(prev))
//     } else if (event.key === "ArrowUp") {
//       setState((prev) => rotate(prev))
//     } else if (event.key === " ") {
//       setState((prev) => hardDrop(prev))
//     }
//   }

//     window.addEventListener("keydown", handleKeyDown)

//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [])

//   return (
//     <div>
//       <h1>Red Tetris</h1>
//       {state.status === "over" && (
//         <h2 style={{color: "red"}}>Game Over</h2>
//       )}

//       <BoardView board={state.board} piece={state.activePiece} />

//       <p>
//         Piece: {state.activePiece.type} | x: {state.activePiece.x} | y: {state.activePiece.y}
//       </p>

//       <button onClick={() => setState(moveLeft(state))}>Left</button>
//       <button onClick={() => setState(moveRight(state))}>Right</button>
//       <button onClick={() => setState(moveDown(state))}>Down</button>
//       <button onClick={() => setState(rotate(state))}>Rotate</button>
//       <button onClick={() => setState(createInitialState())}>Restart</button>
//     </div>
//   )
// }

// export default App

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import BoardView from "./components/Board"

const socket = io("http://localhost:3000")

function App() {
  const [room, setRoom] = useState<any>(null)
  const [gameState, setGameState] = useState<any>(null)

  useEffect(() => {
    socket.emit("join_room", {
      roomId: "room42",
      playerName: "jb"
    })

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
      setGameState(payload.self)
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
    function handleKeyDown(event: KeyboardEvent) {
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

      {room && (
        <div>
          <p>Room: {room.roomId}</p>
          <p>Status: {room.status}</p>
          <p>Host: {room.hostId}</p>
        </div>
      )}

      {gameState && (
        <BoardView
          board={gameState.board}
          piece={gameState.activePiece}
        />
      )}
    </div>
  )
}

export default App
