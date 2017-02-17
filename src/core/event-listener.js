export default function mixinEventListener(object) {
    object.callbacks = {};

    const methods = {
        bind(eventName, callback) {
            if (!this.callbacks[eventName]) this.callbacks[eventName] = [];

            return this.callbacks[eventName].push(callback) - 1;
        },

        once(eventName, callback) {
            const id = this.bind(eventName, callback);

            this.bind(eventName, () => { this.unbind(eventName, [id, id + 1]); }, this);

            return id;
        },

        unbind(eventName, id) {
            if (this.callbacks[eventName]) {
                if (id === undefined) {
                    this.callbacks[eventName] = undefined;
                }
                else if (typeof id == "number") {
                    this.callbacks[eventName][id] = undefined;
                }
                else for (const i of id) {
                    this.callbacks[eventName][i] = undefined;
                }
            }
        },

        fire(eventName, data) {
            if (this.callbacks[eventName]) {
                for (const callback of this.callbacks[eventName]) {
                    if (callback) callback.call(this, data);
                }
            }
        }
    };

    for (const key in methods) {
        object[key] = methods[key].bind(object);
    }
}
