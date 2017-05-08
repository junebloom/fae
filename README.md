# fae
Fae is a small 2d game-engine designed to be flexible and easy to work with.

The main features of fae are:

- Renderer-agnostic, easily integrate with PixiJS or any other
- Lightweight core (a few hundred lines!)
- Powerful ECS implementation
- Event-driven
- Input manager
- Scenes

The engine is still in its fairly early stages, so some things are still a bit rough around the edges.

I encourage you to offer any suggestions (or contributions) for improvements, and of course I would love to see anything you make!

# Installation
Get fae using `npm install -S fae`

Keep in mind that fae is written using the latest JS standards. You may need to use a transpiler like Babel for your game to be supported in all browsers.

# Usage
The documentation is still in progress (sorry). The core is quite small and easy to understand, so you could learn all by reading the source if you are so inclined.

The heart of fae is the ECS implementation. I worked hard to pack as much goodness into as few lines as possible. The result is a powerful, easy to use framework for making games.

1. [Application](#application)
2. [Entities](#entities)
    - [Groups](#groups)
    - [Components](#components)
3. [Systems](#systems)
4. [Scenes](#scenes)
5. [Input](#input)
6. [Pixi Integration](#pixi-integration)

## Application
The `fae.Application` class is used to handle the game's state and loop. Create an instance of it to get an empty game running.

```javascript
import * as fae from 'fae'

const app = new fae.Application()
```

The `app.event` object is an `EventEmitter` that emits game loop events and input events as well as arbitrary user events. You can utilise the game loop by adding listeners to the following events: `'preupdate'`, `'update'`, and `'draw'`

```javascript
app.event.on('draw', () => {
  // Your rendering code here
})
```

Adding these listeners can be done manually, as above, but it is typically done using systems (the 'S' in ECS).

## Entities
An entity is a container for holding components. Entities can belong to groups, which can be iterated over by systems to perform game logic.

You can create entities and attach components like so:
```javascript
const bullet = new fae.Entity(app).attach(
  new fae.components.Transform(),
  new fae.components.Body(1),
  new fae.components.Collider(8, 8, 0.5)
)
```
`attach()` returns the entity object so that it may be chained with the constructor.

### Groups
Groups are JS Set objects. They can be accessed by name via the `app.groups` object.

Every entity is automatically added to the `'all'` group, as well as to a group for each of their components. They can also be added to arbitrary groups:
```javascript
bullet.group('bullet')
```

`bullet` now belongs to the following groups: `'all'`, `'Transform'`, `'Body'`, `'Collider'`, and `'bullet'`.

### Components
A component is a class that can be instanced and attached to an entity. Components should hold data and utility methods relevant to one piece of behavior, but no game logic.

They are simply classes:
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

An entity's component instances can be accessed like so:
```javascript
bullet.body.mass = 10
```
A lowercase-beginning version of the class name is used as the property name. I may change that if I can find a better way to handle it.

*`Body` becomes `body`*

*`MyComponent` becomes `myComponent`*

*`AIController` becomes `aiController`*

## Systems
...

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

Entering a scene will emit the `'exitScene'` event, stop all systems, and destroy all non-persistent entities before finally calling the scene function. (`tavern()` in this case)

## Input
...

## Pixi Integration
...
