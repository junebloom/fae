export default class System {
  constructor (app, listeners) {
    this.app = app
    this.listeners = listeners

    app.systems.add(this)
    for (const listener in listeners) {
      app.event.on(listener, listeners[listener])
    }
  }

  destroy () {
    this.app.systems.delete(this)
    for (const listener in this.listeners) {
      this.app.event.removeListener(listener, this.listeners[listener])
    }
  }
}
