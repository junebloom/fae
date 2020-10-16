import test from "ava";
import { EntityCollection } from "./EntityCollection.js";

test("new entities can be created", (t) => {
  const collection = new EntityCollection();
  const entity = collection.create();
});

test("entity sets can be retrieved", (t) => {
  const collection = new EntityCollection();

  // Should return a set of all entities with the tag "friend".
  collection.get("friend");
});

test("entity sets can be queried with basic set operations", (t) => {
  const collection = new EntityCollection();

  // Should return only entities with both of the tags "friend" and "enemy".
  // (Only frenemies.)
  collection.get("friend").and("enemy");

  // Should return a union set of all entities with either "friend" or "enemy".
  // (All friends and all enemies.)
  collection.get("friend").or("enemy");

  // Should return entities with the tag "friend", excluding any which are also tagged "enemy".
  // (Only friends, no frenemies.)
  collection.get("friend").and.not("enemy");
});

test("entity sets can be filtered with custom queries", (t) => {
  const collection = new EntityCollection();

  // Should return only friends over 21.
  collection.get("friend").filter((entity) => entity.age >= 21);
});
