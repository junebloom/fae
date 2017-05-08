export const debug = {
  drawDebug () {
    if (!this.groups.graphics) return
    for (const e of this.groups.graphics) {
      if (e.collider) {
        e.graphics.cacheAsBitmap = true
        e.graphics.clear()
        .beginFill(0xffffff, 0.25)
        .drawRect(
          -e.collider.width * e.collider.anchor.x,
          -e.collider.height * e.collider.anchor.y,
          e.collider.width,
          e.collider.height
        )
        .endFill()
      }
    }
  }
}
