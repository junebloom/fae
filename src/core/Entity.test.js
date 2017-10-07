import esm from '@std/esm'
import test from 'ava'
const loader = esm(module)
const Application = loader('./Application').default
const Entity = loader('./Entity').default

test('is in \'all\' group', t => {
  const app = new Application()
  const entity = new Entity(app)
  t.true(entity.groups.has('all'), 'Every entity should be in \'all\'')
})

test('can be added to and removed from groups', t => {
  const app = new Application()
  const entity = new Entity(app)

  entity.group('cuddly', 'whiskers')
  t.true(entity.groups.has('cuddly'), 'Should be very cuddly')
  t.true(entity.groups.has('whiskers'), 'Should have whiskers')

  entity.ungroup('cuddly', 'whiskers')
  t.false(entity.groups.has('cuddly'), 'Should not be cuddly :(')
  t.false(entity.groups.has('whiskers'), 'Should not have whiskers')
})

test('hasGroups method works', t => {
  const app = new Application()
  const entity = new Entity(app)

  entity.group('dog', 'horse')

  t.true(
    entity.hasGroups('all', 'dog', 'horse'),
    'Should be true if entity is in every group provided'
  )
})