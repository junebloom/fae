# fae
A small JS game framework with a clean, simple API. Fae's features are:

- Flexible entity-component-system design
- Event-driven game loop
- Simple scene switching
- Can run in the browser or in Node (for multiplayer game servers)
- Renderer-agnostic, easily integrate with canvas, [pixi](https://github.com/pixijs/pixi.js/), or anything else
- Tiny (fewer than 150 lines!) (2.3kb gzipped)
- Written in ES6

I encourage you to offer any suggestions (or contributions) for improvements, and of course I would love to see anything that you make!

# Installation
Get fae using `npm install -S fae`

Keep in mind that fae is written using the latest JS standards. You may need to use a transpiler like Babel for your game to be supported in older browsers.

# Usage
I will assume you are at least a little bit familiar with the [ECS](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system) pattern. If something doesn't make sense, please put in an issue and I will clarify it! Taking a look at the source might be enough to figure it out in the meantime.

1. [Application](#application)
2. [Entities](#entities)
    - [Components](#components)
    - [Groups](#groups)
3. [Systems](#systems)
4. [Scenes](#scenes)

## Application
The `Application` class is used to handle the game's state and loop. Create an instance of it to get an empty game running.
```javascript
import * as fae from 'fae'

const app = new fae.Application()
```

#### Application instance properties:

`app.event`: An [EventEmitter](https://github.com/primus/eventemitter3) that emits game loop events as well as custom user events. You can utilise the default game loop by listening to the following events: `'preupdate'`, `'update'`, and `'draw'`.
```javascript
app.event.on('draw', () => {
  // Your rendering code here
})
```

`app.systems`: A [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of active systems for internal use.

`app.groups`: An object whose keys are [group](#groups) names and whose values are Sets containing the [Entities](#entities) in those groups.

#### Application instance methods:

`entitiesWith (...groups : String)`: Returns an array containing all entities that belong to every group specified. Uses [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) syntax.

`startSystem (system : Object)`: Registers the [`system`](#systems)'s event listeners.

`stopSystem (system : Object)`: Unregisters the [`system`](#systems)'s event listeners.

`enterScene (scene : Function)`: Emits the `'exitScene'` event, stops all running systems, destroys all non-persistent entities, and then calls `scene()`. See [scenes](#scenes).

#### Custom game loop
You can optionally pass a function as the only argument to the `Application` constructor, and it will be used to start the game instead of the default `main` function. Check out the source to see exactly how that works.

## Entities
An entity is a container for holding components. Entities belong to groups, which can be iterated over by systems to perform game logic.

The `Entity` constructor takes an `Application` instance as its only argument.
```javascript
const entity = new fae.Entity(app)
```

#### Entity instance properties:

`entity.app`: A reference to the Application instance passed in to the constructor. Mostly for internal use.

`entity.groups`: A Set of group names that this entity belongs to. Like `entity.app`, primarily for internal use.

#### Entity instance methods:

`attach (...components : Object)`: Takes one or more [component](#components) instances, attaches them to the entity, and adds the entity to the groups for those components. Returns the entity instance.

`detach (...componentNames : String)`: Takes one or more component names, detaches them from the entity, and removes the entity from those component groups. Returns the entity instance.

`group (...groups : String)`: Takes one or more [group](#groups) names, and adds the entity instance to those groups, creating any that don't already exist. Returns the entity instance.

`ungroup (...groups : String)`: Takes one or more group names, and removes the entity instance from those groups. Returns the entity instance.

`hasGroups (...groups : String)`: Takes one or more group names, and returns `true` if the entity instance belongs to every group provided. Returns `false` otherwise.

`destroy ()`: Sets the entity instance's `destroyed` property to `true`, and removes the instance from all groups, freeing all internal references that fae has to it. The entity instance will be garbage collected as long as your code doesn't hold any reference to it.

### Components
A component is a class that can be instanced and attached to an entity. Components should hold data and utility methods relevant to one piece of behavior, but no game logic.

They are defined using ES6 classes:
```javascript
class Body {
  constructor (mass = 1) {
    this.mass = mass
    this.force = new Vec2()
    this.velocity = new Vec2()
    this.acceleration = new Vec2()
  }
}
```

Components can be attached to entities by passing a component instance to the entity's `attach()` method: `entity.attach(new Body(10))`

Once attached, the component instance can be referenced as a property on the entity: `entity.body.mass = 100`

The name of the property is a camelCase transformed version of the class name. `Body` becomes `body`, `MyComponent` becomes `myComponent`, `AIController` becomes `aiController`.

The entity is also added to a group with the same camelCase-ified name for every component that is attached to it.

### Groups
Groups are JS Set objects that hold related entities. Every entity is automatically added to the `'all'` group, as well as to a group for each of their components. They can also be added to arbitrary groups.

Groups are the main way of getting entities for processing.
```javascript
// Add the entity to a group called 'bullet', creating the group if necessary
entity.group('bullet')

// Groups are accessible via the app.groups object
for (const e of app.groups.bullet) {
  // Do something with each entity in the group
  // ...
}
```

## Systems
A system is where the game logic lives. A system is any object with a `listeners` property, which in turn is an object whose keys are event names and whose values are funtions to handle those events:
```javascript
const system = {
  listeners: {
    update(dt) {
      // Do something every frame (usually involving processing some entities)
      // ...
    }
  }
}

app.startSystem(system)
```

Those listeners will be called when `app.event` emits the relevant event. Fae doesn't care about anything except the `listeners` property, so you are free to structure the rest of the system object in any way you desire.

If you want your systems to be easily reusable, you can write a class that creates an instance of the system. You won't have to `import` your `Application` instance into your system definition files.
```javascript
class CollisionSystem {
  constructor (app) {
    this.app = app
    this.listeners = {
      update: this.update
    }
  }

  update (dt) {
    for (const entity of this.app.groups.collider) {
      // Do something for every entity with the 'collider' component.
      // ...
    }
  }
}

// ...
// Somewhere in another file (probably in a scene function)
const collision = new CollisionSystem(app)
app.startSystem(collision)
```

## Scenes
Scenes are simply functions that can be called by fae to set a scene's initial state.

A scene might look like this:
```javascript
function tavern () {
  // Start some systems
  // ...

  // Create some entities
  // ...
}

app.enterScene(tavern)
```

---

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
