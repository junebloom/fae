import esm from '@std/esm'
import test from 'ava'
const Application = esm(module)('./Application').default

test('starts and stops systems properly', t => {
  const app = new Application()
  app.hideBanner = true

  const system = app.startSystem({
    listeners: {
      goodDay () {
        t.true(running, 'This should not be called if the system is stopped')
      }
    }
  })
  let running = true // system should be running

  app.event.emit('goodDay')

  app.stopSystem(system)
  running = false // system should be stopped

  app.event.emit('goodDay')
})

test('creates and holds reference to entity groups', t => {
  const app = new Application()

  app.createGroup('powerpuff')

  t.truthy(app.groups.powerpuff, 'The powerpuff group should exist')
})
