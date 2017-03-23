import Vector from "../vector";

export const motion = {
    attach() {
        this.velocity = new Vector();
    },

    detach() {
        delete this.velocity;
    }
};
