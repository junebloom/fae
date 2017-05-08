import EventEmitter from 'eventemitter3'
import Input from './Input'

function main (app) {
  let dt = 0
  let lastTime = window.performance.now()

  function gameLoop () {
    app.event.emit('preupdate')

    const curTime = window.performance.now()
    dt = curTime - lastTime
    lastTime = curTime

    app.event.emit('update', dt)
    app.event.emit('draw')

    window.requestAnimationFrame(gameLoop)
  }
  gameLoop()
}

export default class Application {
  constructor (customMain) {
    this.event = new EventEmitter()
    this.input = new Input(this)

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
    for (const listener in system) {
      this.event.on(listener, system[listener], this)
    }
  }

  stopSystem (system) {
    this.systems.delete(system)
    for (const listener in system) {
      this.event.removeListener(listener, system[listener], this)
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
