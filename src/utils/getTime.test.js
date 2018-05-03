import test from 'ava'
import util from 'util'
import getTime from './getTime'

const promiseTimeout = util.promisify(setTimeout)

test('returns time accurately in seconds', async t => {
  const t1 = getTime() // Get time
  await promiseTimeout(1000) // Wait 1 second
  const t2 = getTime() // Get time again

  // t2 - t1 = ~1 = a
  // a - 1 = ~0 = b
  // |b| = total error
  // probably a few ms, caused by inaccuracy in setTimeout
  const error = Math.abs(t2 - t1 - 1)

  t.true(error < 0.01, 'Close to 1 second should have passed')
})
