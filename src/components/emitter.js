export const emitter = {
    attach() {
        this.emitOptions = {};
    },

    detach() {
        delete this.emitOptions;
    },

    properties: {
        emitting: true,
        emitTimer: 0
    }
};
