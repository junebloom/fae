export const physics = {
    require: ["motion"],

    update(dt) {
        for (const e of this.entities) {
            // Integrate velocity with position
            e.position = e.position.add(e.velocity.times(dt));
        }
    }
};
