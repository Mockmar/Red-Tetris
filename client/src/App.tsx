import { useState, useEffect } from "react"
import { createInitialState } from "./engine/state"
import { moveLeft, moveRight, moveDown, step, rotate } from "./engine/reducer"
import BoardView from "./components/Board"

function App() {
  const [state, setState] = useState(createInitialState())


  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => step(prev))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      setState((prev) => moveLeft(prev))
    } else if (event.key === "ArrowRight") {
      setState((prev) => moveRight(prev))
    } else if (event.key === "ArrowDown") {
      setState((prev) => moveDown(prev))
    } else if (event.key === "ArrowUp") {
      setState((prev) => rotate(prev))
    }
  }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div>
      <h1>Red Tetris</h1>

      <BoardView board={state.board} piece={state.activePiece} />

      <p>
        Piece: {state.activePiece.type} | x: {state.activePiece.x} | y: {state.activePiece.y}
      </p>

      <button onClick={() => setState(moveLeft(state))}>Left</button>
      <button onClick={() => setState(moveRight(state))}>Right</button>
      <button onClick={() => setState(moveDown(state))}>Down</button>
      <button onClick={() => setState(rotate(state))}>Rotate</button>
    </div>
  )
}

export default App
