export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Board = Cell[][]

export type PieceType =
  | "I"
  | "O"
  | "T"
  | "S"
  | "Z"
  | "J"
  | "L"

export interface Piece {
  type: PieceType
  rotation: number
  x: number
  y: number
}

export interface GameState {
  board: Board
  activePiece: Piece
  touchingFloor: boolean
  status: "running" | "over"
}