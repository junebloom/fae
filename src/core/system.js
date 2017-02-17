import mixinEventListener from "./event-listener";

export default class System {
    constructor(app, system) {
        mixinEventListener(this);

        this.app = app;
        app.systems.push(this);

        this.require = system.require;

        for (const event in system) {
            if (event == "require") continue;
            this.bind(event, system[event]);
        }

        this.fire("ready");
    }

    // TODO: Optimize this?
    // Maybe set when entities are added or removed from the app,
    // instead of being a getter
    get entities() {
        return this.app.entities.filter((entity) => {
            for (const componentName of this.require) {
                if (entity.has(componentName)) return true;
            }
            return false;
        });
    }
}
