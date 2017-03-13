export const steering = {
    group: "steering",

    update(dt) {
        for (const e of this.entities) {
            if (e.steer) {
                const desired = e.desiredVelocity;

                if (e.chaseVec) desired.add(e.chaseVec.minus(e.position));

                for (const avoidVec of e.avoidVecs) {
                    const diff = e.position.minus(avoidVec);
                    desired.add(diff.multiply(1 / Math.pow(diff.length, 2)));
                }

                const steeringForce = desired.minus(e.velocity).truncate(e.turnSpeed);

                e.velocity.add(steeringForce).truncate(e.moveSpeed);
                desired.set(0);
            }
        }
    }
};
