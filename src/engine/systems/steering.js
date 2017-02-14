export const steering = {
    require: ["steering"],

    update(dt) {
        for (const e of this.entities) {
            if (e.steer) {
                const desired = e.desiredVelocity;

                // Apply chase velocity
                if (e.chaseVec) desired.add(e.chaseVec.minus(e.position));

                // Apply avoid velocities
                // TODO: multipliers for each avoid vec
                for (const avoidVec of e.avoidVecs) {
                    // Scale diff by inverse square of distance and add to desired
                    const diff = e.position.minus(avoidVec);
                    desired.add(diff.multiply(1 / Math.pow(diff.length, 2)));
                }

                // Calculate steering force
                const sforce = desired.minus(e.velocity).truncate(e.turnSpeed);

                // Integrate steering force with current velocity
                e.velocity.add(sforce).truncate(e.moveSpeed);
                desired.set(0);
            }
        }
    }
};
