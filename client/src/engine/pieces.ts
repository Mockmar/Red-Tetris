import type { PieceType, Piece } from "./types"

export type PieceMatrix = number[][]

export const PIECES: Record<PieceType, PieceMatrix> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
}

export function getPieceMatrix(piece: Piece): PieceMatrix {
  let matrix = PIECES[piece.type]

  for (let i = 0; i < piece.rotation; i++) {
    matrix = rotateMatrix(matrix)
  }

  return matrix
}

export function isPieceCell(piece: Piece, x: number, y: number, matrix: PieceMatrix): boolean {
  const localX = x - piece.x
  const localY = y - piece.y

  if (localY < 0 || localY >= matrix.length) return false
  if (localX < 0 || localX >= matrix[0].length) return false

  return matrix[localY][localX] === 1
}

export function rotateMatrix(matrix: PieceMatrix): PieceMatrix {
  const size = matrix.length

  const rotated: PieceMatrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0)
  )

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = matrix[y][x]
    }
  }

  return rotated
}