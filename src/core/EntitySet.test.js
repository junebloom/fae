import test from "ava";
import { EntitySet } from "./EntitySet.js";

// Test Utilities

// Return a mock entity.
const mockEntity = (tags) => ({
  tags: {
    has: (tag) => tags.includes(tag),
  },
});

// Return a map of mock entities for testing queries.
const createFixtures = () => {
  const alice = mockEntity(["friend"]);
  const bob = mockEntity(["friend", "enemy"]);
  const charlie = mockEntity(["enemy"]);

  return {
    alice,
    bob,
    charlie,
    all: [alice, bob, charlie],
    friends: [alice, bob],
    friendsExclusive: [alice],
    frenemies: [bob],
    enemies: [bob, charlie],
    enemiesExclusive: [charlie],
  };
};

// EntitySet API Tests

test("implements `foreach` method", (t) => {
  const { all } = createFixtures();
  const set = new EntitySet({}, all);
  t.plan(3);

  set.forEach((entity) => {
    t.true(all.includes(entity), "Should assert once per entity.");
  });
});

test("is iterable", (t) => {
  const { all } = createFixtures();
  const set = new EntitySet({}, all);
  t.plan(4);

  for (const entity of set) {
    t.true(all.includes(entity), "`for ... of` loops should work.");
  }

  t.notThrows(() => [...set], "Spread operator should work.");
});

test("can chain the `and` condition", (t) => {
  const { all, friends } = createFixtures();
  const set = new EntitySet({}, all);

  // Get only friends.
  const result = set.and("friend");

  t.true(result instanceof EntitySet, "Should be chainable.");
  t.deepEqual(
    [...result],
    friends,
    'Should return only entities with the tag "friend".'
  );
});

test("can chain the `andNot` condition", (t) => {
  const { friends, friendsExclusive } = createFixtures();
  const set = new EntitySet({}, friends);

  // Get only friends, no frenemies.
  const result = set.andNot("enemy");

  t.true(result instanceof EntitySet, "Should be chainable.");
  t.deepEqual(
    [...result],
    friendsExclusive,
    'Should return entities with the tag "friend", excluding any which are also tagged "enemy".'
  );
});

test("can chain the `or` condition", (t) => {
  const { enemies, friends, all } = createFixtures();
  const set = new EntitySet({ get: () => enemies }, friends);

  // Get all friends and all enemies.
  const result = set.or("enemy");

  t.true(result instanceof EntitySet, "Should be chainable.");
  t.deepEqual(
    [...result],
    all,
    'Should return a union set of all entities with either "friend" or "enemy".'
  );
});

test("can be filtered with a custom condition", (t) => {
  const { all, alice, bob, charlie } = createFixtures();
  const set = new EntitySet({}, all);

  alice.age = 22;
  bob.age = 20;
  charlie.age = 23;

  // Get only those 21 or older.
  const result = set.filter((entity) => entity.age >= 21);

  t.true(result instanceof EntitySet, "Should be chainable.");
  t.deepEqual(
    [...result],
    [alice, charlie],
    "Should return only friends over 21."
  );
});
