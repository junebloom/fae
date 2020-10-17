import test from "ava";
import { EntityCollection } from "./EntityCollection.js";
import { EntitySet } from "./EntitySet.js";
import { Entity } from "./Entity.js";

// EntityCollection API tests.

test("create and return an index idempotently", (t) => {
  const collection = new EntityCollection();

  const firstResult = collection.index("someIndex");
  const secondResult = collection.index("someIndex");

  t.true(
    firstResult instanceof EntitySet,
    "Should be an instance of EntitySet."
  );
  t.is(firstResult, secondResult), "Should be the same index every time.";
});

test("get a set by tag", (t) => {
  const collection = new EntityCollection();
  let result = collection.get("someTag");

  t.true(
    result instanceof EntitySet,
    "Should return an empty set if no index exists for the tag."
  );

  const index = collection.index("someTag"); // Create the index.
  result = collection.get("someTag");

  t.is(index, result, "Should return the index if it exists.");
});

test("create an entity", (t) => {
  const collection = new EntityCollection();
  const entity = collection.create();

  t.true(entity instanceof Entity, "Should be an instance of Entity.");
  t.is(entity.collection, collection, "Should reference this collection.");
});
