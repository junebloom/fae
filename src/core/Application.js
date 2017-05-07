import * as PIXI from 'pixi.js'
import EventEmitter from 'eventemitter3'
import Input from './Input'

export default class Application extends PIXI.Application {
  constructor (width, height, options, noWebGL) {
    super(width, height, options, noWebGL)

    this.event = new EventEmitter()
    this.input = new Input(this)

    this.systems = new Set()
    this.groups = { all: new Set() }

    this.ticker.add(() => {
      this.event.emit('preupdate', this.ticker.deltaTime)
      this.event.emit('update', this.ticker.deltaTime)
      this.event.emit('postupdate', this.ticker.deltaTime)
    })
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

  enter (scene) {
    this.event.emit('exitScene')
    for (const system of this.systems) {
      if (!system.persistent) this.stopSystem(system)
    }
    for (const entity of this.groups.all) {
      if (!entity.persistent) entity.destroy()
    }
    // TODO: Only destroy non-persistent children of stage?
    this.stage.destroy()
    this.stage = new PIXI.Container()
    scene(this)
  }
}
