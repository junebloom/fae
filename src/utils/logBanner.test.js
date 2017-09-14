import esm from '@std/esm'
import test from 'ava'
const logBanner = esm(module)('./logBanner').default

test('executes without erroring', t => {
  t.notThrows(logBanner)
})
