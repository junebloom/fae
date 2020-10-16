import { EventEmitter } from "./EventEmitter.js";
import { EntityCollection } from "./EntityCollection.js";
import { SystemManager } from "./SystemManager.js";
import { defaultLoop } from "./defaultLoop.js";
import { logBanner } from "../utils/logBanner.js";

// Provides an interface to events, entities, and systems
export class Application {
  constructor({ hideBanner = false, startGame = defaultLoop, state = {} }) {
    // ## Properties
    // *(read-only)*

    // A store for global state
    this.state = state;

    // An EventEmitter for messaging throughout the game
    this.event = new EventEmitter();

    // An EntityCollection for creating and querying entities
    this.entity = new EntityCollection(this);

    // A SystemManager for starting and stopping systems
    this.system = new SystemManager(this);

    // Call the `startGame` function, which should initiate the game loop
    // It takes the app instance as its only argument
    startGame(this);

    // Print the fae banner to console unless `hideBanner` is truthy
    if (!hideBanner) logBanner();
  }

  // ## Methods

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
