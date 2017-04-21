export default class System {
  constructor (listeners) {
    this.listeners = listeners
  }

  start (app) {
    app.systems.add(this)
    for (const listener in this.listeners) {
      app.event.on(listener, this.listeners[listener])
    }
    return this
  }

  stop (app) {
    app.systems.delete(this)
    for (const listener in this.listeners) {
      app.event.removeListener(listener, this.listeners[listener])
    }
    return this
  }
}
