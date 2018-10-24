import EventEmitter from 'eventemitter3'
import logBanner from '../utils/logBanner'
import defaultLoop from './defaultLoop'

// Provides events and manages systems, scenes, and entity groups
export default class Application {
  constructor (startGame = defaultLoop) {
    // ## Properties
    // *(read-only)*

    // An EventEmitter for messaging throughout the game
    this.event = new EventEmitter()

    // A Set containing all currently running ECS systems
    this.systems = new Set()

    // An object whose keys are group names and whose values are Sets
    // containing groups of related entities
    this.groups = {}
    this.createGroup('all')

    // Call the `startGame` function, which should initiate the game loop
    // It takes the app instance as its only argument
    startGame(this)

    // Print the fae banner to the console upon the first frame of the gameloop
    // being processed, unless `this.hideBanner` is truthy
    this.event.once('preupdate', () => {
      if (!this.hideBanner) logBanner()
    })
  }

  // ## Methods

  // Create an empty group with the given name and return it
  createGroup (name) {
    this.groups[name] = new Set()
    return this.groups[name]
  }

  // Return an array of entities that belong to *all* of the provided groups
  entitiesWith (...groups) {
    for (const group of groups) if (!this.groups[group]) return []
    groups.sort((a, b) => this.groups[a].size - this.groups[b].size)
    const entities = []
    for (const entity of this.groups[groups[0]]) {
      if (entity.hasGroups(...groups)) entities.push(entity)
    }
    return entities
  }

  // Register `system`'s event listeners and return `system`
  startSystem (system) {
    this.systems.add(system)
    for (const listener in system.listeners) {
      this.event.on(listener, system.listeners[listener], system)
    }
    return system
  }

  // Unregister `system`'s event listeners
  stopSystem (system) {
    this.systems.delete(system)
    for (const listener in system.listeners) {
      this.event.removeListener(listener, system.listeners[listener], system)
    }
  }

  // Stop/destroy all non-persistent systems and entities
  // Includes persistent entities if `clearAll` is truthy
  clear (clearAll = false) {
    for (const system of this.systems) {
      if (!system.persistent || clearAll) this.stopSystem(system)
    }
    for (const entity of this.groups.all) {
      if (!entity.persistent || clearAll) entity.destroy()
    }
  }
}
