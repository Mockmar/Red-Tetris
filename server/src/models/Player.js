class Player {
  constructor(socketId, name) {
    this.socketId = socketId
    this.name = name
    this.alive = true
    this.state = null
  }
}

module.exports = Player