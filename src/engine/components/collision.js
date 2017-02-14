import SAT from "sat";

export const collision = {
    w: 0,
    h: 0,
    r: 0,

    get collider() {
        const pos = new SAT.Vector(this.x, this.y);
        let c;
        if (this.w > 0 && this.h > 0) {
            pos.y -= this.h;
            c = new SAT.Box(pos, this.w, this.h).toPolygon();
        } else if (this.r > 0) {
            c = new SAT.Circle(pos, this.r);
        } else {
            c = pos;
        }
        c.type = c.constructor.name;
        return c;
    },

    attach() {

    },

    remove() {

    }
};
