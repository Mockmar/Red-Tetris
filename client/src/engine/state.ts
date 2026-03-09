import { createEmptyBoard } from "./board"
import { SPAWN_X, SPAWN_Y } from "./constants"
import type { GameState, Piece, PieceType } from "./types"

const PIECE_TYPES: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"]

export function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    activePiece: createRandomPiece(),
    touchingFloor: false,
    status: "running",
  }
}

export function createPiece(type: Piece["type"]): Piece {
  return {
    type,
    rotation: 0,
    x: SPAWN_X,
    y: SPAWN_Y,
  }
}

export function createRandomPiece(): Piece {
  const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length)
  const type = PIECE_TYPES[randomIndex]

  return createPiece(type)
}