export default class Vec2 {
  constructor (x = 0, y = 0) {
    if (x.x) {
      this.x = x.x
      this.y = x.y
    } else {
      this.x = x
      this.y = y
    }
  }

  get length () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  get normalized () {
    return this.copy().normalize()
  }

  plus (v) {
    return this.copy().add(v)
  }

  minus (v) {
    return this.copy().subtract(v)
  }

  times (n) {
    return this.copy().multiply(n)
  }

  divided (n) {
    return this.copy().divide(n)
  }

  add (v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  subtract (v) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  multiply (n) {
    this.x *= n
    this.y *= n
    return this
  }

  divide (n) {
    this.x /= n
    this.y /= n
    return this
  }

  copy () {
    return new Vec2(this.x, this.y)
  }

  set (x, y) {
    if (y === undefined) y = x
    this.x = x
    this.y = y
    return this
  }

  normalize () {
    let l = this.length
    if (l > 0) {
      this.x /= l
      this.y /= l
    }
    return this
  }

  truncate (n) {
    let s = n / this.length
    if (s < 1) {
      this.x *= s
      this.y *= s
    }
    return this
  }
}
