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
    }
  }

  if (!state.touchingFloor) {
    return {
      ...state,
      touchingFloor: true,
    }
  }

  const mergedBoard = mergePieceIntoBoard(state.board, state.activePiece)
  const { board: clearedBoard } = clearLines(mergedBoard)

  const newPiece = createRandomPiece()

  if (!canPlace(clearedBoard, newPiece)) {
    return {
      ...state,
      board: clearedBoard,
      status: "over",
    }
  }

  return {
    ...state,
    board: clearedBoard,
    activePiece: newPiece,
    touchingFloor: false,
  }
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

  const mergedBoard = mergePieceIntoBoard(state.board, droppedPiece)
  const { board: clearedBoard } = clearLines(mergedBoard)

  const newPiece = createRandomPiece()

  if (!canPlace(clearedBoard, newPiece)) {
    return {
      ...state,
      board: clearedBoard,
      activePiece: newPiece,
      touchingFloor: false,
      status: "over",
    }
  }

  return {
    ...state,
    board: clearedBoard,
    activePiece: newPiece,
    touchingFloor: false,
    status: "running",
  }
}

module.exports = {
  moveLeft,
  moveRight,
  moveDown,
  step,
  rotate,
  hardDrop,
}