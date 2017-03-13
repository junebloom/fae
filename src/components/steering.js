import Vector from "../vector";

export const steering = {
    attach() {
        this.avoidVecs = [];
        this.desiredVelocity = new Vector();
    },

    detach() {
        delete this.avoidVecs;
        delete this.desiredVelocity;
    },

    properties: {
        steer: true,
        moveSpeed: 5,
        turnSpeed: 1,
        chaseVec: null
    }
};
