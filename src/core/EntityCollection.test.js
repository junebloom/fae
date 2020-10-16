import test from "ava";
import { EntityCollection } from "./EntityCollection.js";

test("new entities can be created", (t) => {
  const collection = new EntityCollection();
  const entity = collection.create();

  t.log("entity type: ", typeof entity);
});

function setupFriends() {
  const collection = new EntityCollection();
  const alice = collection.create();
  const bob = collection.create();
  const charlie = collection.create();

  alice.tag("friend");
  bob.tag("friend").tag("enemy");
  charlie.tag("enemy");

  return { collection, alice, bob, charlie };
}

test("entity sets can be retrieved", (t) => {
  const { collection, alice, bob } = setupFriends();

  t.like(
    collection.get("friend"),
    [alice, bob],
    'Should return a set of all entities with the tag "friend".'
  );
});

test("entity sets can be queried with basic set operations", (t) => {
  const { collection, alice, bob, charlie } = setupFriends();

  // (Only frenemies.)
  t.like(
    collection.get("friend").and("enemy"),
    [bob],
    'Should return only entities with both of the tags "friend" and "enemy".'
  );

  // (All friends and all enemies.)
  t.like(
    collection.get("friend").or("enemy"),
    [alice, bob, charlie],
    'Should return a union set of all entities with either "friend" or "enemy".'
  );

  // (Only friends, no frenemies.)
  t.like(
    collection.get("friend").andNot("enemy"),
    [alice],
    'Should return entities with the tag "friend", excluding any which are also tagged "enemy".'
  );
});

test("entity sets can be filtered with custom queries", (t) => {
  const { collection, alice, bob } = setupFriends();

  const ageComponent = {
    key: "age",
    init: (e, age) => age,
  };

  alice.attach(ageComponent, 22);
  bob.attach(ageComponent, 20);

  t.like(
    collection.get("friend").filter((entity) => entity.age >= 21),
    [alice],
    "Should return only friends over 21."
  );
});
