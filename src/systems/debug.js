export const debug = {
  update () {
    if (!this.app.groups.Graphics) return
    for (const e of this.app.groups.Graphics) {
      if (e.collider) {
        e.graphics.lineStyle(2, 0xff0000)
        .drawRect(
          -e.collider.width * e.collider.anchor.x,
          -e.collider.height * e.collider.anchor.y,
          e.collider.width,
          e.collider.height
        )
      }
    }
  }
}
