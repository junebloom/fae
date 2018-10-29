// Composes one logical 'object' in the game using components
export default class Entity {
  constructor (app) {
    // ## Properties
    // *(read-only)*

    // A reference to an `Application` instance
    this.app = app

    // The Set of group names that this entity is a member of
    this.groups = new Set()

    // Add this entity to the 'all' group
    this.group('all')
  }

  // ## Methods

  // Attach the provided component instances to this entity
  attach (...components) {
    for (const component of components) {
      this[component.key] = component
      this.group(component.key)
      if (component.componentWasAttached) component.componentWasAttached(this)
    }
    return this
  }

  // Remove the given components from this entity
  detach (...components) {
    for (const component of components) {
      if (this[component.key] !== component)
        throw new Error('component is not attached to this entity')
      if (component.componentWillBeDetached)
        component.componentWillBeDetached(this)
      this.ungroup(component.key)
      this[component.key] = null
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

  // Remove this entity from the provided groups
  ungroup (...groupNames) {
    for (const name of groupNames) {
      if (!this.app.groups[name]) continue
      this.app.groups[name].delete(this)
      this.groups.delete(name)
    }
    return this
  }

  // Return `true` if this entity belongs to every group provided
  hasGroups (...groups) {
    for (const group of groups) {
      if (!this.groups.has(group)) return false
    }
    return true
  }

  // Return an array of all components attached to this entity
  getComponents() {
    const components = []
    for (const [key, value] of Object.entries(this)) {
      if (value && value.key && value.key === key && this.groups.has(key)) {
        components.push(value)
      }
    }
    return components
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
