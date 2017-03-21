import Vector from "../vector";

export default class Entity extends PIXI.Container {
    constructor(app, entity) {
        super();

        this.app = app;
        this.persistent = false;
        this.components = new Set();
        this.groups = new Set();

        this.group("all");

        for (const key in entity) {
            switch (key) {
                case "components":
                    this.attach(...entity[key]);
                    break;

                case "groups":
                    this.group(...entity[key]);
                    break;

                case "parent":
                    entity[key].addChild(this);
                    break;

                default:
                    this.on(key, entity[key]);
            }
        }

        this.emit("ready");
        this.app.event.emit("entitycreated", this);
    }

    get position() { return new Vector(super.position); }
    set position(v) { super.position.set(v.x, v.y); }

    attach(...componentNames) {
        for (const componentName of componentNames) {
            const component = this.app.components[componentName];
            if (!component) throw new Error(componentName + " is not a component");

            if (component.properties) {
                Object.defineProperties(this, Object.getOwnPropertyDescriptors(component.properties));
            }
            if (component.attach) component.attach.call(this);

            this.components.add(componentName);
            this.group(componentName);
        }
    }

    detach(...componentNames) {
        for (const componentName of componentNames) {
            // TODO: actually remove component properties

            this.components.delete(componentName);
            this.ungroup(componentName);
        }
    }

    group(...groupNames) {
        for (const groupName of groupNames) {
            if (!this.app.groups[groupName]) this.app.groups[groupName] = new Set();
            this.app.groups[groupName].add(this);
            this.groups.add(groupName);
        }
    }

    ungroup(...groupNames) {
        for (const groupName of groupNames) {
            if (groupName == "all") throw new Error("You can't remove an entity from the 'all' group");
            this.app.groups[groupName].delete(this);
            this.groups.delete(groupName);
        }
    }

    timeout(time, callback, ...args) {
        let timer = time;

        const entity = this;
        function updateTimer(dt) {
            if (timer <= 0) {
                if (typeof callback == "function") callback.apply(entity, args);
                else entity.emit(callback, ...args);

                entity.removeListener("update", updateTimer);
            }

            timer -= dt / 60 * 1000;
        }

        this.on("update", updateTimer);
    }

    destroy(options = { children: true }) {
        if (options && options.children === undefined) options.children = true;
        this.emit("destroy");

        for (const groupName of this.groups) {
            this.app.groups[groupName].delete(this);
        }

        super.destroy(options);

        this.app.event.emit("entitydestroyed", this);
    }

    queueDestroy() {
        this.app.destroyQueue.add(this);
    }

    on(eventName, callback, thisArg = this) {
        return super.on(eventName, callback, thisArg);
    }

    once(eventName, callback, thisArg = this) {
        return super.once(eventName, callback, thisArg);
    }

    removeListener(eventName, callback, thisArg = this) {
        return super.removeListener(eventName, callback, thisArg);
    }
}
