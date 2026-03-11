const { BOARD_HEIGHT, BOARD_WIDTH } = require("./constants")
const { getPieceMatrix } = require("./pieces")

function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0)
  )
}

function getCellValueFromPieceType(type) {
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
    default:
      return 0
  }
}

function mergePieceIntoBoard(board, piece) {
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

function clearLines(board) {
  const remainingRows = board.filter((row) =>
    row.some((cell) => cell === 0)
  )

  const cleared = BOARD_HEIGHT - remainingRows.length

  const emptyRows = Array.from({ length: cleared }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0)
  )

  return {
    board: [...emptyRows, ...remainingRows],
    cleared,
  }
}

function getSpectrum(board) {
  const width = board[0].length
  const height = board.length
  const spectrum = Array(width).fill(0)

  for (let x = 0; x < width; x++) {
    let columnHeight = 0

    for (let y = 0; y < height; y++) {
      if (board[y][x] !== 0) {
        columnHeight = height - y
        break
      }
    }

    spectrum[x] = columnHeight
  }

  return spectrum
}

module.exports = {
  createEmptyBoard,
  mergePieceIntoBoard,
  clearLines,
  getSpectrum,
}