import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants"
import type { Board, Piece, Cell } from "./types"
import { getPieceMatrix } from "./pieces";


export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0 as Cell)
  )
}

export function mergePieceIntoBoard(board: Board, piece: Piece): Board {
  const matrix = getPieceMatrix(piece)

  const newBoard = board.map((row) => [...row])

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === 0) {
        continue
      }

      const boardX = piece.x + x
      const boardY = piece.y + y

      newBoard[boardY][boardX] = getCellValueFromPieceType(piece.type)
    }
  }

  return newBoard
}

function getCellValueFromPieceType(type: Piece["type"]): Cell {
  switch (type) {
    case "I":
      return 1
    case "O":
      return 2
    case "T":
      return 3
    case "S":
      return 4
    case "Z":
      return 5
    case "J":
      return 6
    case "L":
      return 7
  }
}

export function clearLines(board: Board): { board: Board; cleared: number } {
  const remainingRows = board.filter((row) =>
    row.some((cell) => cell === 0)
  )

  const cleared = BOARD_HEIGHT - remainingRows.length

  const emptyRows: Board = Array.from({ length: cleared }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0 as Cell)
  )

  return {
    board: [...emptyRows, ...remainingRows],
    cleared,
  }
}