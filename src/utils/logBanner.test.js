import test from 'ava'
import logBanner from './logBanner'

test('executes without erroring', t => {
  t.notThrows(logBanner)
})
