// Composes one logical 'object' in the game using components
export default class Entity {
  constructor (app) {
    // ## Properties
    // *(read-only)*

    // A reference to an `Application` instance
    this.app = app

    // The Set of group names that this entity is a member of
    this.groups = new Set()

    this.group('all')
  }

  // ## Methods

  // Attach the provided component instances to the entity
  attach (...components) {
    for (const component of components) {
      const name = Object.getPrototypeOf(component).constructor.name

      this[name] = component
      this.group(name)

      component.entity = this
    }
    return this
  }

  // Attach the properties of the `components` object,
  // where the keys are the component names
  // and the values are the component instances
  attachProperties (components) {
    for (const name in components) {
      this[name] = components[name]
      this.group(name)
      if (typeof components[name] === 'object') components[name].entity = this
    }
    return this
  }

  detach (...componentNames) {
    for (const name of componentNames) {
      this[name] = null
      this.ungroup(name)
    }
    return this
  }

  // Add this entity to the provided groups,
  // creating any that don't already exist
  group (...groupNames) {
    for (const name of groupNames) {
      (this.app.groups[name] || this.app.createGroup(name)).add(this)
      this.groups.add(name)
    }
    return this
  }

  ungroup (...groupNames) {
    for (const name of groupNames) {
      this.app.groups[name].delete(this)
      this.groups.delete(name)
    }
    return this
  }

  hasGroups (...groups) {
    for (const group of groups) {
      if (!this.groups.has(group)) return false
    }
    return true
  }

  // Free all of fae's internal references to the entity,
  // allowing it to be garbage collected
  destroy () {
    this.destroyed = true
    for (const group of this.groups) {
      this.ungroup(group)
    }
  }
}
