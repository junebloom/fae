export const emitter = {
    emitting: true,
    emitTimer: 0,

    attach() {
        this.emitOptions = {};
    },

    remove() {
        delete this.emitOptions;
    }
};
