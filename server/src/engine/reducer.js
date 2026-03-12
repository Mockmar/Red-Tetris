const { clearLines, mergePieceIntoBoard } = require("./board")
const { canPlace } = require("./collision")
const { createRandomPiece } = require("./state")

function movePiece(piece, dx, dy) {
  return {
    ...piece,
    x: piece.x + dx,
    y: piece.y + dy,
  }
}

function lockPieceAndSpawn(state, piece) {
  const mergedBoard = mergePieceIntoBoard(state.board, piece)
  const { board: clearedBoard, cleared } = clearLines(mergedBoard)

  const newPiece = createRandomPiece()

  if (!canPlace(clearedBoard, newPiece)) {
    return {
      ...state,
      board: clearedBoard,
      touchingFloor: false,
      status: "over",
      cleared,
    }
  }

  return {
    ...state,
    board: clearedBoard,
    activePiece: newPiece,
    touchingFloor: false,
    status: "running",
    cleared,
  }
}

function moveLeft(state) {
  const nextPiece = movePiece(state.activePiece, -1, 0)

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece,
  }
}

function moveRight(state) {
  const nextPiece = movePiece(state.activePiece, 1, 0)

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece,
  }
}

function moveDown(state) {
  const nextPiece = movePiece(state.activePiece, 0, 1)

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece,
  }
}

function step(state) {
  const nextPiece = movePiece(state.activePiece, 0, 1)

  if (canPlace(state.board, nextPiece)) {
    return {
      ...state,
      activePiece: nextPiece,
      touchingFloor: false,
      cleared: 0,
    }
  }

  if (!state.touchingFloor) {
    return {
      ...state,
      touchingFloor: true,
      cleared: 0,
    }
  }

  return lockPieceAndSpawn(state, state.activePiece)
}

function rotate(state) {
  const nextPiece = {
    ...state.activePiece,
    rotation: (state.activePiece.rotation + 1) % 4,
  }

  if (!canPlace(state.board, nextPiece)) {
    return state
  }

  return {
    ...state,
    activePiece: nextPiece,
  }
}

function hardDrop(state) {
  let droppedPiece = state.activePiece

  while (true) {
    const nextPiece = movePiece(droppedPiece, 0, 1)

    if (!canPlace(state.board, nextPiece)) {
      break
    }

    droppedPiece = nextPiece
  }

  return lockPieceAndSpawn(state, droppedPiece)
}

module.exports = {
  moveLeft,
  moveRight,
  moveDown,
  step,
  rotate,
  hardDrop,
}