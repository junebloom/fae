export const timeout = {
    attach() {
        this.timers = [];
    },

    remove() {
        delete this.timers;
    },

    timeout(ms, event, ...args) {
        this.timers.push({
            time: ms,
            event: event,
            args: args
        });
    }
};
