import * as PIXI from 'pixi.js'
import EventEmitter from 'eventemitter3'
import InputManager from './InputManager'

export default class Application extends PIXI.Application {
  constructor (width, height, options, noWebGL) {
    super(width, height, options, noWebGL)
    this.view.setAttribute('tabindex', -1)

    this.event = new EventEmitter()
    this.input = new InputManager(this)

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

  enter (scene) {
    this.event.emit('exitScene')
    for (const system of this.systems) {
      if (!system.persistent) system.stop(this)
    }
    for (const entity of this.groups.all) {
      if (!entity.persistent) entity.destroy()
    }
    scene(this)
  }
}
