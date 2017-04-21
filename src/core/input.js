export default class InputManager extends PIXI.interaction.InteractionManager {
  constructor (app) {
    if (app.renderer.plugins.interaction) app.renderer.plugins.interaction.destroy()
    super(app.renderer)
    app.renderer.plugins.interaction = this

    this.app = app
    this.eventQueue = []

    this.buttons = {}
    this.axes = {}

    this.keyCodes = {}
    this.keys = {}
    this.pads = []

    app.event.on('preupdate', (dt) => {
      // This is imperfect due to pixi's pointer events being handled
      // in a way that they aren't easily deferred to the queue
      for (const event of this.eventQueue) this.emit(...event)
      this.eventQueue = []
    })

    app.view.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })

    app.view.addEventListener('keydown', (event) => {
      if (event.repeat || this.keys[event.key]) return
      this.eventQueue.push(['keydown', event.key, event.code])
    })

    document.addEventListener('keyup', (event) => {
      if (!this.keys[event.key]) return
      this.eventQueue.push(['keyup', event.key, event.code])
    })

    this.on('keydown', (key, code) => {
      this.keys[key] = true
      this.keyCodes[code] = true
    })

    this.on('keyup', (key, code) => {
      this.keys[key] = false
      this.keyCodes[code] = false
    })
  }

  key (k) { return this.keys[k] || false }

  keyCode (code) { return this.keyCodes[code] || false }

  button (name, ...bindings) {
    if (bindings) {
      if (this.buttons[name]) this.buttons[name].destroy()
      this.buttons[name] = new Button(this.app, name, ...bindings)
    } else {
      return clamp(this.buttons[name].value, 0, 1)
    }
  }
}

class Button {
  constructor (app, name, ...bindings) {
    this.app = app
    this.value = 0
    this.listeners = {
      keydown: [],
      keyup: []
    }

    for (const unparsedBinding of bindings) {
      const binding = parseBindingString(unparsedBinding)

      const onKeyDown = (key, code) => {
        if (this.value) return
        if ({ key: key, code: code }[binding.type] === binding.value) {
          app.input.eventQueue.push(['buttondown', name])
          this.value += 1
        }
      }

      const onKeyUp = (key, code) => {
        if (!this.value) return
        if ({ key: key, code: code }[binding.type] === binding.value) {
          app.input.eventQueue.push(['buttonup', name])
          this.value -= 1
        }
      }

      this.listeners.keydown.push(onKeyDown)
      this.listeners.keyup.push(onKeyUp)

      app.input.on('keydown', onKeyDown)
      app.input.on('keyup', onKeyUp)
    }
  }

  destroy () {
    for (const eventName in this.listeners) {
      for (const listener of this.listeners[eventName]) {
        this.app.input.removeListener(eventName, listener)
      }
    }
  }
}

function parseBindingString (string) {
  const split = string.split(' ')
  return {
    type: split.shift(),
    value: split.length > 1 ? split : split[0]
  }
}

function clamp (num, min, max) { return Math.min(Math.max(min, num), max) }
