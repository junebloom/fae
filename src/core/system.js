import EventEmitter from "eventemitter3";

export default class System extends EventEmitter {
    constructor(app, system) {
        super();

        this.app = app;
        app.systems.push(this);

        for (const key in system) {
            switch (key) {
                case "group":
                    // TODO: use subset of entities from array of groups as entities for the system
                    this.entities = app.groups[system[key]];
                    break;

                default:
                    this.on(key, system[key], this);
            }
        }

        this.emit("ready");
    }
}
