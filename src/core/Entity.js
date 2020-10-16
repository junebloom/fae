// Represents a "thing" in the game world.
// It is an empty container to which components are attached.
// Components are the data that describe what the entity is.
export class Entity {
  constructor(collection) {
    this.collection = collection;
    this.app = collection.app;

    this.components = new Map();
    this.tags = new Set();

    // All entities have the 'all' tag.
    this.tag("all");
  }

  // Attach the provided component to this entity.
  attach(component, ...args) {
    this[component.key] = component.init(this, ...args);
    this.components.set(component.key, component);
    this.tag(component.key);
    return this;
  }

  // Remove the given component from this entity.
  detach(key) {
    const { exit } = this.components.get(key);
    this[key] = undefined;
    this.components.delete(key);
    this.untag(key);
    if (exit) exit(this);
    return this;
  }

  // Add the tag to this entity.
  // (And add the entity to the corresponding index of the collection.)
  tag(tag) {
    this.tags.add(tag);
    this.collection.index(tag).set.add(this);
    return this;
  }

  // Remove the tag from this entity.
  // (And remove the entity from the corresponding index.)
  untag(tag) {
    this.tags.delete(tag);
    this.collection.index(tag).set.delete(this);
    return this;
  }

  // Clean up any attached components and free all internal references
  // to the entity, allowing it to be garbage collected.
  destroy() {
    this.components.values().forEach(({ exit }) => {
      if (exit) exit(this);
    });
    this.tags.forEach((tag) => {
      this.collection.index(tag).set.delete(this);
    });
    this.destroyed = true;
  }
}
