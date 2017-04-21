export default class Entity {
  constructor (app, ...components) {
    this.app = app
    this.groups = new Set()

    this.attach(...components)
    this.group('all')
    app.event.emit('entityCreated', this)
  }

  // TODO: Multiple instances of same component
  attach (...components) {
    for (const component of components) {
      this[pascalToCamel(component.name)] = new component()
      this.group(component.name)
    }
  }

  detach (...components) {
    for (const component of components) {
      this[pascalToCamel(component.name)] = null
      this.ungroup(component.name)
    }
  }

  group (...groups) {
    for (const group of groups) {
      if (!this.app.groups[group]) this.app.groups[group] = new Set()
      this.app.groups[group].add(this)
      this.groups.add(group)
    }
  }

  ungroup (...groups) {
    for (const group of groups) {
      this.app.groups[group].delete(this)
      this.groups.delete(group)
    }
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
    this.app.event.emit('entityDestroyed', this)
  }
}

// Does not account for unicode (WTF) identifiers
const re = /^[A-Z](?:[A-Z](?![a-z]))*/
function pascalToCamel (string) {
  return string.replace(re, match => match.toLowerCase())
}
