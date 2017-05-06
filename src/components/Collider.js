import { Vec2 } from '../utils'

export default class Collider {
  constructor (w = 100, h = 100, ax = 0, ay = ax) {
    this.groups = []
    this.checked = []
    this.sleeping = false

    this.width = w
    this.height = h
    this.anchor = new Vec2(ax, ay)
  }

  get left () { return this.entity.transform.x - this.width * this.anchor.x }
  get right () { return (this.entity.transform.x + this.width) - this.width * this.anchor.x }
  get top () { return this.entity.transform.y - this.height * this.anchor.y }
  get bottom () { return (this.entity.transform.y + this.height) - this.height * this.anchor.y }
}
