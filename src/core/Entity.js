// Composes one logical 'object' in the game using components
export default class Entity {
  constructor(app) {
    // ## Properties
    // *(read-only)*

    // A reference to an `Application` instance
    this.app = app;

    // A Map of attached components
    this.components = new Map();

    // The Set of group names that this entity is a member of
    this.groups = new Set();

    // Add this entity to the 'all' group
    this.group("all");
  }

  // ## Methods

  // Attach the provided component to this entity
  attach(component, ...args) {
    this[component.key] = component.init(this, ...args);
    this.components.set(component.key, component);
    this.group(component.key);
    return this;
  }

  // Remove the given component from this entity
  detach(key) {
    const { exit } = this.components.get(key);
    this[key] = undefined;
    this.components.delete(key);
    this.ungroup(key);
    if (exit) exit(this);
    return this;
  }

  // Add this entity to the provided groups,
  // creating any that don't already exist
  group(...groupNames) {
    for (const name of groupNames) {
      (this.app.groups[name] || this.app.createGroup(name)).add(this);
      this.groups.add(name);
    }
    return this;
  }

  // Remove this entity from the provided groups
  ungroup(...groupNames) {
    for (const name of groupNames) {
      if (!this.app.groups[name]) continue;
      this.app.groups[name].delete(this);
      this.groups.delete(name);
    }
    return this;
  }

  // Return `true` if this entity belongs to every group provided
  hasGroups(...groups) {
    for (const group of groups) {
      if (!this.groups.has(group)) return false;
    }
    return true;
  }

  // Clean up any attached components and free all of fae's internal references
  // to the entity, allowing it to be garbage collected.
  destroy() {
    this.components.values().forEach(({ exit }) => {
      if (exit) exit(this);
    });
    this.ungroup(...this.groups);
    this.destroyed = true;
  }
}
