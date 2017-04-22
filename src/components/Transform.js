import { Component } from '../core'
import { Vec2 } from '../utils'

export default class Transform extends Component {
  constructor (entity) {
    super(entity)
    this.position = new Vec2()
    this.rotation = 0
  }

  get x () { return this.position.x }
  set x (n) { this.position.x = n }

  get y () { return this.position.y }
  set y (n) { this.position.y = n }
}
