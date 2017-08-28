import getTime from '../utils/getTime'

// Default game loop used if you do not provide a custom `start` function to the
// `Application` constructor
export default function defaultLoop (app) {
  let lastTime = getTime()
  let dt = 0

  function gameLoop () {
    app.event.emit('preupdate')

    const currentTime = getTime()
    dt = currentTime - lastTime
    lastTime = currentTime

    app.event.emit('update', dt)
    app.event.emit('draw')

    if (global.window) window.requestAnimationFrame(gameLoop)
  }

  if (global.window) gameLoop()
  else setInterval(gameLoop, 1000 / 60)
}
