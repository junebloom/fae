import EventEmitter from 'eventemitter3'

function main (app) {
  let dt = 0
  let lastTime = window.performance.now()

  function gameLoop () {
    app.event.emit('preupdate')

    const currentTime = window.performance.now()
    dt = currentTime - lastTime
    lastTime = currentTime

    app.event.emit('update', dt)
    app.event.emit('draw')

    window.requestAnimationFrame(gameLoop)
  }
  gameLoop()
}

export default class Application {
  constructor (customMain) {
    this.event = new EventEmitter()

    this.systems = new Set()
    this.groups = { all: new Set() }

    if (customMain) customMain(this)
    else main(this)
  }

  entitiesWith (...groups) {
    groups.sort((a, b) => this.groups[a].size - this.groups[b].size)
    const entities = []
    for (const entity of this.groups[groups[0]]) {
      if (entity.hasGroups(...groups)) entities.push(entity)
    }
    return entities
  }

  startSystem (system) {
    this.systems.add(system)
    for (const listener in system.listeners) {
      this.event.on(listener, system.listeners[listener])
    }
  }

  stopSystem (system) {
    this.systems.delete(system)
    for (const listener in system.listeners) {
      this.event.removeListener(listener, system.listeners[listener])
    }
  }

  enterScene (scene) {
    this.event.emit('exitScene')
    for (const system of this.systems) this.stopSystem(system)
    for (const entity of this.groups.all) {
      if (!entity.persistent) entity.destroy()
    }
    scene()
  }
}
