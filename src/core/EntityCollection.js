import { Entity } from "./Entity.js";
import { EntitySet } from "./EntitySet.js";

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
