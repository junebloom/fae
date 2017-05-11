// TODO: Better key names (no 'a' vs 'A', or ' ' instead of 'space', etc.)
// TODO: Mouse/touch
// TODO: Gamepad support
// TODO: Bndable 'buttons' and 'axes'
export default class Input {
  constructor (app) {
    this.keyRepeat = false
    this.keys = {}
    this.codes = {}

    document.addEventListener('keydown', event => {
      if (!this.keyRepeat && event.repeat) return

      this.keys[event.key] = true
      this.codes[event.code] = true

      app.event.once('preupdate', () => {
        app.event.emit('keydown', event.key, event.code)
      })
    })

    document.addEventListener('keyup', event => {
      if (!this.keys[event.key] || !this.codes[event.code]) return

      this.keys[event.key] = false
      this.codes[event.code] = false

      app.event.once('preupdate', () => {
        app.event.emit('keyup', event.key, event.code)
      })
    })
  }

  keyPressed (key) { return this.keys[key] || false }
  codePressed (code) { return this.codes[code] || false }
}
