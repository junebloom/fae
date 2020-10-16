import { EventEmitter } from "./EventEmitter.js";
import { EntityCollection } from "./EntityCollection.js";
import { logBanner } from "../utils/logBanner.js";
import { defaultLoop } from "./defaultLoop.js";

// Provides events and manages systems, scenes, and entity groups
export class Application {
  constructor({ hideBanner = false, startGame = defaultLoop }) {
    // ## Properties
    // *(read-only)*

    // An EventEmitter for messaging throughout the game
    this.event = new EventEmitter();

    // An EntityCollection for creating and querying entities
    this.entity = new EntityCollection();

    // A Set containing all currently running systems
    this.systems = new Set();

    // Call the `startGame` function, which should initiate the game loop
    // It takes the app instance as its only argument
    startGame(this);

    // Print the fae banner to console unless `hideBanner` is truthy
    if (!hideBanner) logBanner();
  }

  // ## Methods

  // Initialize the system and register its event listener.
  startSystem(system) {
    const args = [system.event, system.action, this];
    if (system.init) {
      const initialState = system.init(this);
      if (initialState !== undefined) args.push(initialState);
    }
    this.systems.add(system);
    this.event.addListener(...args);
  }

  // Unregister system's event listener and clean up
  stopSystem(system) {
    this.event.removeListener(system.event, system.action);
    this.systems.delete(system);
    if (system.exit) system.exit(this);
  }

  // Stop/destroy all non-persistent systems and entities
  // Includes persistent entities if `clearAll` is truthy
  clear(clearAll = false) {
    for (const system of this.systems) {
      if (!system.persistent || clearAll) this.stopSystem(system);
    }
    for (const entity of this.groups.all) {
      if (!entity.persistent || clearAll) entity.destroy();
    }
  }
}
