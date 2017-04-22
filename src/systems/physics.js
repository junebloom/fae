export const physics = {
  update (dt) {
    for (const e of this.app.groups.Motion) {
      e.motion.velocity.add(e.motion.acceleration.times(dt))
      e.transform.position.add(e.motion.velocity.times(dt))
    }
  }
}
