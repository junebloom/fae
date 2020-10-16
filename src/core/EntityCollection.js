import { Entity } from "./Entity.js";

// Represents a set of entities, usually as the result of a query.
// Additional queries can be chained.
class EntitySet {
  constructor(collection, entities) {
    this.collection = collection;
    this.set = new Set(entities);
  }

  // Return a new set containing only the entities from this set which
  // have the given tag.
  and(tag) {
    return this.filter((entity) => entity.tags.has(tag));
  }

  // Return a new set containing only the entities from this set which
  // do not have the given tag.
  andNot(tag) {
    return this.filter((entity) => !entity.tags.has(tag));
  }

  // Return a new set containing a union between this set and the set of
  // entities which have the given tag.
  or(tag) {
    return new EntitySet(this.collection, [
      ...this.set,
      ...this.collection.get(tag),
    ]);
  }

  // Return a new set filtered in a similar way to `Array.prototype.filter`.
  filter(callback) {
    const filtered = new EntitySet(this.collection);
    this.forEach((entity) => {
      if (callback(entity)) filtered.set.add(entity);
    });
    return filtered;
  }

  // See `Set.prototype.forEach`.
  forEach(callback) {
    this.set.forEach(callback);
  }

  // Allow iteration of this object.
  [Symbol.iterator]() {
    return this.set.values();
  }
}

// Represents the collection of all entities for an app and provides an
// interface to access them.
export class EntityCollection {
  constructor(app) {
    // The Application instance. This is only stored so that entities can
    // access it from component `init` or `exit` functions.
    this.app = app;

    // Store internal indexes for quickly accessing entities grouped by tags.
    this.indexes = new Map();
  }

  // Return a new entity managed by this collection.
  create() {
    return new Entity(this);
  }

  // Return the set of entities for the given tag.
  get(tag) {
    if (this.indexes.has(tag)) return this.indexes.get(tag);
    else return new EntitySet(this);
  }

  // Return the requested index, creating it if necessary.
  index(tag) {
    let set;
    if (this.indexes.has(tag)) {
      set = this.indexes.get(tag);
    } else {
      set = new EntitySet(this);
      this.indexes.set(tag, set);
    }
    return set;
  }
}
