import { Vec2 } from '../core'

export default class Body {
  constructor (mass = 1) {
    this.mass = mass
    this.force = new Vec2()
    this.velocity = new Vec2()
    this.acceleration = new Vec2()
  }
}
