import EventEmitter from "eventemitter3";

// TODO: Make systems destroyable

export default class System extends EventEmitter {
    constructor(app, system) {
        super();

        this.app = app;
        app.systems.push(this);

        for (const key in system) {
            switch (key) {
                // TODO: use subset of entities from array of groups as entities for the system
                case "group":
                    this.entities = app.groups[system[key]];
                    break;

                default:
                    this.on(key, system[key], this);
            }
        }

        this.emit("ready");
    }
}
