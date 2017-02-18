export const timers = {
    require: ["timeout"],

    update(dt) {
        const entities = this.entities;
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];

            for (let j = 0; j < e.timers.length; j++) {
                if (e.timers[j]) {
                    e.timers[j].time -= this.app.ticker.deltaTime / 60 * 1000;

                    if (e.timers[j].time <= 0) {
                        e.fire(e.timers[j].event, ...e.timers[j].args);
                        e.timers[j] = undefined;
                    }
                }
            }
        }
    }
};
