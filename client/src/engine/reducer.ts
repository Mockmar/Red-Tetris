import { clearLines, mergePieceIntoBoard } from "./board"
import { canPlace } from "./collision"
import { createRandomPiece } from "./state"
import type { GameState, Piece } from "./types"

function movePiece(piece: Piece, dx: number, dy: number): Piece {
  return {
    ...piece,
    x: piece.x + dx,
    y: piece.y + dy
  }
}

export function moveLeft(state: GameState): GameState {
  const nextPiece = movePiece(state.activePiece, -1, 0)

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece
  }
}

export function moveRight(state: GameState): GameState {
  const nextPiece = movePiece(state.activePiece, 1, 0)

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece
  }
}

export function moveDown(state: GameState): GameState {
  const nextPiece = movePiece(state.activePiece, 0, 1)

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece
  }
}

export function step(state: GameState): GameState {
  const nextPiece = movePiece(state.activePiece, 0, 1)

  if (canPlace(state.board, nextPiece)) {
    return {
      ...state,
      activePiece: nextPiece,
      touchingFloor: false
    }
  }

  if (!state.touchingFloor) {
    return {
      ...state,
      touchingFloor: true
    }
  }

  const mergedBoard = mergePieceIntoBoard(state.board, state.activePiece)
  const { board: clearedBoard } = clearLines(mergedBoard)

  const newPiece = createRandomPiece()

  if (!canPlace(clearedBoard, newPiece)) {
    return {
      ...state,
      board: clearedBoard,
      status: "over"
    }
  }

  return {
    ...state,
    board: clearedBoard,
    activePiece: newPiece,
    touchingFloor: false
  }
}

export function rotate(state: GameState): GameState {

  const nextPiece: Piece = {
    ...state.activePiece,
    rotation: (state.activePiece.rotation + 1) % 4
  }

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece
  }
}