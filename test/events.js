import test from 'ava'
import util from 'util'
import { Application } from '../dist/fae'

const promiseTimeout = util.promisify(setTimeout)

test('emit proper events every frame', async t => {
  const app = new Application()

  let expected = 0
  let i = 0
  let j = 0
  let k = 0

  app.event.on('preupdate', () => {
    t.is(i, expected)
    i++
  })
  app.event.on('update', () => {
    t.is(j, expected)
    j++
  })
  app.event.on('draw', () => {
    t.is(k, expected)
    k++
    expected++
  })

  await promiseTimeout(200)
  t.not(i, 0) // preupdate event is being emitted
  t.not(j, 0) // update event is being emitted
  t.not(k, 0) // draw event is being emitted
})
