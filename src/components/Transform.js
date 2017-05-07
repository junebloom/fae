import { Vec2 } from '../core'

export default class Transform {
  constructor (x = 0, y = 0, r = 0) {
    this.position = new Vec2(x, y)
    this.rotation = r
  }

  get x () { return this.position.x }
  set x (n) { this.position.x = n }

  get y () { return this.position.y }
  set y (n) { this.position.y = n }
}
