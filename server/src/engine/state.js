const { createEmptyBoard } = require("./board")
const { SPAWN_X, SPAWN_Y } = require("./constants")

const PIECE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"]

function createPiece(type) {
  return {
    type,
    rotation: 0,
    x: SPAWN_X,
    y: SPAWN_Y,
  }
}

function createRandomPiece() {
  const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length)
  const type = PIECE_TYPES[randomIndex]

  return createPiece(type)
}

function createInitialState() {
  return {
    board: createEmptyBoard(),
    activePiece: createRandomPiece(),
    touchingFloor: false,
    status: "running",
  }
}

module.exports = {
  createInitialState,
  createPiece,
  createRandomPiece,
}