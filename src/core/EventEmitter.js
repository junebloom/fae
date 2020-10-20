// A small event emitter class.
export class EventEmitter {
  constructor() {
    // A Map where the keys are event names and the values are Sets of
    // listeners for that event.
    this.events = new Map();
  }

  // Register the given event listener.
  addListener(event, listener) {
    let listeners = this.events.get(event);

    // Create a new Set to hold the event's listeners, if it doesn't exist yet.
    if (!listeners) {
      listeners = new Set();
      this.events.set(event, listeners);
    }

    listeners.add(listener);
    return this;
  }

  // Unregister the given event listener.
  removeListener(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    listeners.delete(listener);

    // Also delete the entry for the event if it has no more registered listeners.
    if (listeners.size === 0) this.events.delete(event);

    return this;
  }

  // Call all listeners for the event in order of registration,
  // passing the given arguments.
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return;
    listeners.forEach((listener) => listener(...args));
  }
}
