import Vector from "../vector";

export const collision = {
    w: 0,
    h: 0,
    r: null,
    sleeping: false,
    drawCollider: false,

    get left() {    return this.x - this.w * this.cAnchor.x; },
    get right() {   return this.left + this.w; },
    get top() {     return this.y - this.h * this.cAnchor.y; },
    get bottom() {  return this.top + this.h; },

    attach() {
        this.cAnchor = new Vector();
    },

    remove() {
        delete this.cAnchor;
    }
};
