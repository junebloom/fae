import { Component } from '../core'
import { Vec2 } from '../utils'

export default class Motion extends Component {
  constructor (entity) {
    super(entity)
    this.velocity = new Vec2()
    this.acceleration = new Vec2()
  }
}
