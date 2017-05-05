import { pascalToCamel } from '../utils'

export default class Entity {
  constructor (app) {
    this.app = app
    this.groups = new Set()
    this.group('all')
  }

  attach (...components) {
    for (const component of components) {
      const name = Object.getPrototypeOf(component).constructor.name
      this[pascalToCamel(name)] = component
      this.group(name)
      component.entity = this
    }
    return this
  }

  detach (...components) {
    for (const component of components) {
      const name = Object.getPrototypeOf(component).constructor.name
      this[pascalToCamel(name)] = null
      this.ungroup(name)
    }
    return this
  }

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

  destroy () {
    this.destroyed = true
    for (const group of this.groups) {
      this.ungroup(group)
    }
  }
}
