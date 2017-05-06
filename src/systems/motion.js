export const motion = {
  update (dt) {
    if (!this.groups.Motion) return
    for (const e of this.groups.Motion) {
      e.motion.velocity.add(e.motion.acceleration.times(dt))
      e.transform.position.add(e.motion.velocity.times(dt))
    }
  }
}
