import Vector from "../vector";

export const steering = {
    require: ["motion"],

    moveSpeed: 5,
    turnSpeed: 1,

    steer: true,
    chaseVec: null,
    avoidVecs: [],

    attach() {
        this.desiredVelocity = new Vector();
    },

    remove() {
        delete this.desiredVelocity;
    }
};
