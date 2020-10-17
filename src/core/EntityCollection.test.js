import test from "ava";
import { EntityCollection } from "./EntityCollection.js";
import { Entity } from "./Entity.js";

// EntityCollection API tests.

test.skip("create and return an index idempotently", (t) => {});

test.skip("retrieve a set by tag", (t) => {});

test("create an entity", (t) => {
  const collection = new EntityCollection();
  const entity = collection.create();

  t.true(entity instanceof Entity, "Should be an instance of Entity.");
  t.is(entity.collection, collection, "Should reference this collection.");
});
