import { Component } from '../core'
import { Vec2 } from '../utils'

export default class Collider extends Component {
  constructor (entity) {
    super(entity)

    this.groups = []
    this.checked = []
    this.sleeping = false

    this.width = 100
    this.height = 100
    this.anchor = new Vec2()
  }

  get left () { return this.entity.transform.x - this.width * this.anchor.x }
  get right () { return (this.entity.transform.y + this.width) - this.width * this.anchor.x }
  get top () { return this.entity.transform.y - this.height * this.anchor.y }
  get bottom () { return (this.entity.transform.y + this.height) - this.height * this.anchor.y }
}
