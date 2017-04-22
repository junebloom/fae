export const PIXIAdapter = {
  postupdate () {
    if (this.app.groups.Container) {
      for (const e of this.app.groups.Container) {
        e.container.position.x = e.transform.position.x
        e.container.position.y = e.transform.position.y
      }
    }
    if (this.app.groups.Sprite) {
      for (const e of this.app.groups.Sprite) {
        e.sprite.position.x = e.transform.position.x
        e.sprite.position.y = e.transform.position.y
      }
    }
    if (this.app.groups.AnimatedSprite) {
      for (const e of this.app.groups.AnimatedSprite) {
        e.animatedSprite.position.x = e.transform.position.x
        e.animatedSprite.position.y = e.transform.position.y
      }
    }
    if (this.app.groups.Graphics) {
      for (const e of this.app.groups.Graphics) {
        e.graphics.position.x = e.transform.position.x
        e.graphics.position.y = e.transform.position.y
      }
    }
    if (this.app.groups.Text) {
      for (const e of this.app.groups.Text) {
        e.graphics.position.x = e.transform.position.x
        e.graphics.position.y = e.transform.position.y
      }
    }
  }
}
