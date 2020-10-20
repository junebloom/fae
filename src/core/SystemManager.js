export class SystemManager {
  constructor(app) {
    this.app = app;

    // A Map pairing running systems to any metadata necessary to manage them.
    this.systemMetadata = new Map();
  }

  // Start a system.
  start(system, ...initArgs) {
    // Initialize the system and store any state.
    const state = system.init && system.init(this.app, ...initArgs);
    const metadata = { state };

    if (system.action) {
      // App instance should always be passed to the action.
      const boundArgs = [this.app];

      // State should only be passed to the action if it exists.
      if (state !== undefined) boundArgs.push(state);

      // Bind the arguments to the action.
      const action = system.action.bind(undefined, ...boundArgs);

      // Register the bound action as an event listener.
      this.app.event.addListener(system.event, action);

      // And add it to the metadata so we can remove the listener later.
      metadata.action = action;
    }

    // Store any metadata for later use in `stop()`.
    this.systemMetadata.set(system, metadata);
  }

  // Stop a system.
  stop(system) {
    const { state, action } = this.systemMetadata.get(system);

    if (system.exit) system.exit(this.app, state);
    if (action) this.app.event.removeListener(system.event, action);

    this.systemMetadata.delete(system);
  }
}
