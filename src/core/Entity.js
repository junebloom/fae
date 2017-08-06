import pascalToCamel from '../utils/pascalToCamel'

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
      const rawName = Object.getPrototypeOf(component).constructor.name
      const name = pascalToCamel(rawName)

      this[name] = component
      this.group(name)

      component.entity = this
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
  group (...groups) {
    for (const group of groups) {
      if (!this.app.groups[group]) this.app.groups[group] = new Set()
      this.app.groups[group].add(this)
      this.groups.add(group)
    }
    return this
  }

  ungroup (...groups) {
    for (const group of groups) {
      this.app.groups[group].delete(this)
      this.groups.delete(group)
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
