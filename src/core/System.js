export default class System {
  constructor (listeners) {
    this.app = null
    this.listeners = listeners
  }

  start (app) {
    this.app = app
    app.systems.add(this)
    for (const listener in this.listeners) {
      app.event.on(listener, this.listeners[listener], this)
    }
    return this
  }

  stop (app) {
    this.app = null
    app.systems.delete(this)
    for (const listener in this.listeners) {
      app.event.removeListener(listener, this.listeners[listener], this)
    }
    return this
  }
}
