export const physics = {
    group: "motion",

    update(dt) {
        for (const e of this.entities) {
            e.position = e.position.add(e.velocity.times(dt));
        }
    }
};
