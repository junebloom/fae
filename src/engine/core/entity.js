import Vector from "../vector";
import mixinEventListener from "./event-listener";

let entityUID = 0;

export default class Entity extends PIXI.Container {
    constructor(app, entity) {
        super();
        mixinEventListener(this);

        this.app = app;
        this.index = app.entities.push(this) - 1;
        this.id = entityUID;
        entityUID++;

        this.components = entity.components;
        for (const componentName of entity.components) {
            this.attach(componentName);
        }

        for (const event in entity) {
            if (event == "components" || event == "parent") continue;
            this.bind(event, entity[event]);
        }

        if (entity.parent) entity.parent.addChild(this);

        this.alive = true;
        this.fire("ready");

        // TODO: fire global entityCreated event
    }

    // Free internal references
    destroy(options) {
        this.app.entities.splice(this.index, 1);
        for (let i = this.index; i < this.app.entities.length; i++) {
            this.app.entities[i].index -= 1;
        }

        super.destroy(options);

        this.fire("destroyed");

        // TODO: fire global entityDestroyed event
    }

    queueDestroy() {
        if (this.alive) {
            this.app.destroyQueue.push(this);
            this.alive = false;
        }
    }

    // Return a particular entity
    static get(id) {
        for (const entity of this.app.entities) {
            if (entity.id === id) return entity;
        }
    }

    // Vector position
    get position() { return new Vector(super.position); }
    set position(v) { super.position.set(v.x, v.y); }

    // Components
    attach(componentName) {
        const component = this.app.components[componentName];
        if (!component) throw new Error("'" + componentName + "' is not a valid component name");

        component.attachTo(this);

        this.components[componentName] = true;

        this.fire("attachedComponent", componentName);
    }

    remove(componentName) {
        const component = this.app.components[componentName];
        if (!component) throw new Error("'" + componentName + "' is not a valid component name");

        component.removeFrom(this);

        this.components[componentName] = undefined;

        this.fire("removedComponent", { name: componentName });
    }

    has(componentName) {
        if (this.components[componentName]) return true;
        return false;
    }
}
