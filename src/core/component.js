export default class Component {
    constructor(app, name, component) {
        this.app = app;
        this.name = name;
        app.components[name] = this;

        this.require = component.require;
        this.attach = component.attach;
        this.remove = component.remove;

        delete component.require;
        delete component.attach;
        delete component.remove;

        this.members = component;
    }

    attachTo(entity) {
        if (this.require)
        for (let req of this.require) {
            this.app.components[req].attachTo(this);
        }

        this.attach.call(entity);

        Object.defineProperties(entity, Object.getOwnPropertyDescriptors(this.members));
    }

    removeFrom(entity) {
        this.remove.call(entity);

        for (const member in this.members) delete entity[member];
    }
}
