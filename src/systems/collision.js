export const collision = {
    require: ["collision"],

    update() {
        // Check e against every other collidable entity
        const entities = this.entities;
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];

            // Draw debug rects
            if (e.drawCollider) {
                this.app.stage.graph
                .lineStyle(0.25, 0xff0000)
                .beginFill(0xff0000, 0.1);

                if (e.r) this.app.stage.graph.drawCircle(e.x, e.y, e.r);
                else this.app.stage.graph.drawRect(e.left, e.top, e.w, e.h);

                this.app.stage.graph.endFill();
            }

            for (let j = 0; j < entities.length; j++) {
                if (i == j) continue;
                if (e.sleeping) continue;

                const other = entities[j];

                let hit;

                // if both aabb (no radius)
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

                if (hit) e.fire("collided", other);
            }
        }
    }
};

function testAABB(a, b) {
    if (a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    ) {
        return true;
    }

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
