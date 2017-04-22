export const collision = {
  update () {
    if (!this.app.groups.Collider) return
    for (const e of this.app.groups.Collider) e.collider.checked = []

    for (const e of this.app.groups.Collider) {
      if (e.destroyed || e.collider.sleeping) continue

      for (const groupName of e.collider.groups) {
        if (!this.app.groups[groupName]) continue

        for (const other of this.app.groups[groupName]) {
          if (
            e === other ||
            !other.collider ||
            other.collider.sleeping ||
            e.checked.includes(other) ||
            other.checked.includes(e)
          ) continue

          let hit = testAABB(e.collider, other.collider)
          if (hit) this.app.event.emit('collision', e, other)

          e.checked.push(other)
          other.checked.push(e)
        }
      }
    }
  }
}

function testAABB (a, b) {
  if (a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    ) return true

  return false
}

function testCircleAABB (circle, aabb) {
  const p = circle.position.copy()

  if (p.x < aabb.left) p.x = aabb.left
  if (p.x > aabb.right) p.x = aabb.right
  if (p.y < aabb.top) p.y = aabb.top
  if (p.y > aabb.bottom) p.y = aabb.bottom

  if (p.minus(circle.position).length < circle.r) return true

  return false
}

function testCircle (a, b) {
  if (a.position.minus(b.position).length < a.r + b.r) return true

  return false
}
