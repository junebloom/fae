export const physics = {
  update (dt) {
    if (!this.groups.Body) return
    for (const e of this.groups.Body) {
      e.body.acceleration = e.body.force.divided(e.body.mass)
      e.body.force.set(0)
      // TODO: Better integrator?
      e.body.velocity.add(e.body.acceleration.times(dt))
      e.transform.position.add(e.body.velocity.times(dt))
    }
  }
}
