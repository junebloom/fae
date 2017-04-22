export const motion = {
  update (dt) {
    if (!this.app.groups.Motion) return
    for (const e of this.app.groups.Motion) {
      e.motion.velocity.add(e.motion.acceleration.times(dt))
      e.transform.position.add(e.motion.velocity.times(dt))
    }
  }
}
