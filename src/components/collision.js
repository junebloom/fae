import Vector from "../vector";

export const collision = {
    attach() {
        this.collisionAnchor = new Vector();
        this.collisionGroups = new Set();
        this.checked = [];
    },

    detach() {
        delete this.collisionAnchor;
        delete this.collisionGroups;
        delete this.checked;
    },

    properties: {
        w: 0,
        h: 0,
        r: null,
        awake: true,        

        get left()   { return this.x - this.w * this.collisionAnchor.x; },
        get right()  { return this.left + this.w; },
        get top()    { return this.y - this.h * this.collisionAnchor.y; },
        get bottom() { return this.top + this.h; }
    }
};
