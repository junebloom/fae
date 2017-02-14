import mixinEventListener from "./event-listener";

export default class System {
    constructor(app, system) {
        mixinEventListener(this);

        this.app = app;
        app.systems.push(this);

        this._require = system.require;

        for (const event in system) {
            if (event == "require") continue;
            this.bind(event, system[event]);
        }

        this.fire("ready");
    }

    get entities() {
        return this.app.entities.filter((entity) => {
            for (const componentName of this._require) {
                if (entity.has(componentName)) return true;
            }
            return false;
        });
    }
}
