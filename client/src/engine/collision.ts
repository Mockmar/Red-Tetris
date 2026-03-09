import { getPieceMatrix } from "./pieces"
import type { Board, Piece } from "./types"

export function canPlace(board: Board, piece: Piece): boolean {
  const matrix = getPieceMatrix(piece)

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === 0) {
        continue
      }

      const boardX = piece.x + x
      const boardY = piece.y + y

      if (boardX < 0 || boardX >= board[0].length) {
        return false
      }

      if (boardY < 0 || boardY >= board.length) {
        return false
      }

      if (board[boardY][boardX] !== 0) {
        return false
      }
    }
  }

  return true
}