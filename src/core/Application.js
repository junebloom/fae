import * as PIXI from 'pixi.js'
import EventEmitter from 'eventemitter3'
import InputManager from './input'

export default class Application extends PIXI.Application {
  constructor (width, height, options, noWebGL) {
    super(width, height, options, noWebGL)
    this.view.setAttribute('tabindex', -1)

    this.input = new InputManager(this)
    this.event = new EventEmitter()
    this.groups = { all: new Set() }

    this.ticker.add(() => {
      this.event.emit('preupdate', this.ticker.deltaTime)
      this.event.emit('update', this.ticker.deltaTime)
      this.event.emit('postupdate', this.ticker.deltaTime)
    })
  }
}
