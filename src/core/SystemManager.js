export class SystemManager {
  constructor(app) {
    // The Application instance.
    this.app = app;

    // A Set containing all currently running systems.
    this.systems = new Set();
  }

  // Initialize the system and register its event listener.
  start(system) {
    const args = [system.event, system.action, this.app];
    if (system.init) {
      const initialState = system.init(this.app);
      if (initialState !== undefined) args.push(initialState);
    }
    this.systems.add(system);
    this.app.event.addListener(...args);
  }

  // Unregister system's event listener and clean up.
  stop(system) {
    this.app.event.removeListener(system.event, system.action);
    this.systems.delete(system);
    if (system.exit) system.exit(this.app);
  }
}
