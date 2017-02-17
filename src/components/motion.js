import Vector from "../vector";

export const motion = {
    attach() {
        this.velocity = new Vector();
    },

    remove() {
        delete this.velocity;
    }
};
