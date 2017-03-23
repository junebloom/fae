export const collision = {
    group: "collision",

    update() {
        for (const e of this.entities) e.checked = [];

        for (const e of this.entities) {
            if (!e.awake || this.app.destroyQueue.has(e)) continue;

            for (const groupName of e.collisionGroups) {
                if (!this.app.groups[groupName]) continue;

                for (const other of this.app.groups[groupName]) {
                    if (e == other ||
                        !other.awake || // implicitly checks that other has collision component
                        e.checked.includes(other) ||
                        other.checked.includes(e) ||
                        this.app.destroyQueue.has(other)
                    ) continue;

                    let hit;

                    // both aabb
                    if (!e.r && !other.r) {
                        hit = testAABB(e, other);
                    }

                    // circle and aabb
                    else if (e.r && !other.r) {
                        hit = testCircleAABB(e, other);
                    }

                    // aabb and circle
                    else if (!e.r && other.r) {
                        hit = testCircleAABB(other, e);
                    }

                    // both circle
                    else if (e.r && other.r) {
                        hit = testCircle(e, other);
                    }

                    if (hit) e.emit("collided", other);

                    e.checked.push(other);
                    other.checked.push(e);
                }
            }
        }
    }
};

function testAABB(a, b) {
    if (a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    ) return true;

    return false;
}

function testCircleAABB(circle, aabb) {
    const p = circle.position.copy();

    if (p.x < aabb.left)    p.x = aabb.left;
    if (p.x > aabb.right)   p.x = aabb.right;
    if (p.y < aabb.top)     p.y = aabb.top;
    if (p.y > aabb.bottom)  p.y = aabb.bottom;

    if (p.minus(circle.position).length < circle.r) return true;

    return false;
}

function testCircle(a, b) {
    if (a.position.minus(b.position).length < a.r + b.r) return true;

    return false;
}
