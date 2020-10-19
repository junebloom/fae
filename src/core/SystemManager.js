export class SystemManager {
  constructor(app) {
    this.app = app;

    // A Map pairing systems to their state, if they have any.
    this.states = new Map();
  }

  // Start a system.
  start(system, ...initArgs) {
    const initialState = system.init && system.init(this.app, ...initArgs);
    const frontArgs = [this.app];
    if (initialState) {
      this.states.set(system, initialState);
      frontArgs.push(initialState);
    }
    if (system.event) {
      this.app.event.addListener(system.event, system.action, frontArgs);
    }
  }

  // Stop a system.
  stop(system) {
    const state = this.states.get(system);
    this.states.delete(system);
    if (system.event) {
      this.app.event.removeListener(system.event, system.action);
    }
    if (system.exit) system.exit(this.app, state);
  }
}
