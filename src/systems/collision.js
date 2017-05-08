export const collision = {
  update () {
    if (!this.groups.collider) return
    for (const e of this.groups.collider) e.collider.checked = []

    for (const e of this.groups.collider) {
      if (e.destroyed || e.collider.sleeping) continue

      for (const groupName of e.collider.groups) {
        if (!this.groups[groupName]) continue

        for (const other of this.groups[groupName]) {
          if (e === other ||
            !other.collider ||
            other.collider.sleeping ||
            e.collider.checked.includes(other) ||
            other.collider.checked.includes(e)
          ) continue

          let hit = testAABB(e.collider, other.collider)
          if (hit) this.event.emit('collision', e, other)

          e.collider.checked.push(other)
          other.collider.checked.push(e)
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
