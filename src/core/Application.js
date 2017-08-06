import EventEmitter from 'eventemitter3'
import logBanner from '../utils/logBanner'

// Provides events and manages systems, scenes, and entity groups
export default class Application {
  constructor (start = main) {
    // ## Properties
    // *(read-only)*

    // An EventEmitter for messaging throughout the game
    this.event = new EventEmitter()

    // A Set containing all currently running ECS systems
    this.systems = new Set()

    // An object whose keys are group names and whose values are Sets
    // containing groups of related entities
    this.groups = { all: new Set() }

    start(this)
    logBanner()
  }

  // ## Methods

  // Return an array of entities that belong to all of the provided groups
  entitiesWith (...groups) {
    groups.sort((a, b) => this.groups[a].size - this.groups[b].size)
    const entities = []
    for (const entity of this.groups[groups[0]]) {
      if (entity.hasGroups(...groups)) entities.push(entity)
    }
    return entities
  }

  // Register `system`'s event listeners and return 'system'
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

  enterScene (scene) {
    this.event.emit('exitScene')
    for (const system of this.systems) this.stopSystem(system)
    for (const entity of this.groups.all) {
      if (!entity.persistent) entity.destroy()
    }
    scene()
  }
}

// #### Default game loop

// Used if you do not provide a custom `start` function to the
// `Application` constructor
function main (app) {
  let dt = 0
  let lastTime = window.performance.now()

  function gameLoop () {
    app.event.emit('preupdate')

    const currentTime = window.performance.now()
    dt = (currentTime - lastTime) / 1000
    lastTime = currentTime

    app.event.emit('update', dt)
    app.event.emit('draw')

    window.requestAnimationFrame(gameLoop)
  }
  gameLoop()
}
