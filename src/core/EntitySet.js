// Represents a set of entities, usually as the result of a query.
export class EntitySet {
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
