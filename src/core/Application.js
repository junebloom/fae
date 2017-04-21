import * as PIXI from 'pixi.js'
import EventEmitter from 'eventemitter3'
import InputManager from './input'

export default class Application extends PIXI.Application {
  constructor (width, height, options, noWebGL) {
    super(width, height, options, noWebGL)
    this.view.setAttribute('tabindex', -1)

    this.event = new EventEmitter()
    this.input = new InputManager(this)

    this.systems = new Set()
    this.groups = { all: new Set() }

    this.entities = {
      with (...groups) {
        groups.sort((a, b) => this.groups[a].size - this.groups[b].size)
        const entities = []
        for (const e of this.groups[groups[0]]) {
          if (e.hasGroups(groups)) entities.push(e)
        }
        return entities
      }
    }

    this.ticker.add(() => {
      this.event.emit('preupdate', this.ticker.deltaTime)
      this.event.emit('update', this.ticker.deltaTime)
      this.event.emit('postupdate', this.ticker.deltaTime)
    })
  }
}
