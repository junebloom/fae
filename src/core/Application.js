import { EventEmitter } from "./EventEmitter.js";
import { EntityCollection } from "./EntityCollection.js";
import { SystemManager } from "./SystemManager.js";
import { startDefaultLoop } from "../utils/startDefaultLoop.js";
import { logBanner } from "../utils/logBanner.js";

// Provides an interface to events, entities, and systems.
export class Application {
  constructor({
    startGame = startDefaultLoop,
    state = {},
    hideBanner = false,
  } = {}) {
    // A store for global state.
    this.state = state;

    // An EventEmitter for messaging throughout the game.
    this.event = new EventEmitter();

    // An EntityCollection for creating and querying entities.
    this.entity = new EntityCollection(this);

    // A SystemManager for starting and stopping systems.
    this.system = new SystemManager(this);

    // Call the `startGame` function, which should initiate the game loop.
    // It takes the app instance as its only argument.
    // `startGame` should return a `stop` function which can be called to
    // terminate the loop.
    this.stop = startGame(this);

    // Print the fae banner to console unless `hideBanner` is true.
    if (!hideBanner) logBanner();
  }
}
