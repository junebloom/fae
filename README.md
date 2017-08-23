# fae
A small JS game framework with a clean, simple API.

- Flexible entity-component-system design
- Event-driven game loop
- Renderer-agnostic; easily integrate with canvas, [pixi](https://github.com/pixijs/pixi.js/), or anything else
- Can run in the browser or in Node
- Written in modern JS
- Tiny

# Installation
`npm i -S fae`

# Getting Started
```javascript
import fae from 'fae'

const app = new fae.Application()
```

# Concepts
This is a minimal guide. Check out the annotated source for more API details (it's short and sweet!).

## The loop
`app.event` is an [EventEmitter3](https://github.com/primus/EventEmitter3) (follows the Node API).
Each frame it emits these events:

`preupdate`, `update`, and `draw`

Arbitrary events can be emitted as well:

```javascript
app.event.emit('entityWasHit', myEntity, 2)
```

You can manually listen for events with `app.event.on()`, but in practice you rarely need to do so because fae's systems allows you to manage listeners in a smarter way.

## Components
A component is an ES6 class for holding state and utility methods. Component instances can be attached to entities to compose their functionality.

```javascript
// A component that holds health-related state
class HP {
  constructor (max) {
    this.max = max
    this.current = max
  }
}
```

## Entities
Entities are the objects in your game. They are empty containers that you can group together and attach components to.

```javascript
const player = new fae.Entity(app).attach(
  new HP(10),
  new Position(0, 0),
  new Collider(12, 18),
  new KeyboardMovement(),
  new Sprite('sprites/player.png'),
  // etc...
)
```

## Systems
Systems tie things together by providing the actual game logic. A system is an object with a `listeners` property. `listeners` is itself an object whose keys are event names, and whose values are functions to handle those events.

```javascript
// A system for healing/dealing damage
const health = {
  listeners: {
    update (dt) {
      // Do something every frame
      // like iterate over entities with the HP component and slowly heal them:
      for (const e of app.groups.hp) {
        if (e.hp.current < e.hp.max) {
          e.hp.current = Math.min(e.hp.current + 0.1 * dt, e.hp.max)
        }
      }
    },
    entityWasHit (entity, damage) {
      // handle 'entityWasHit' event
    }
  }
}

app.startSystem(health)
```

Fae doesn't care how you structure the rest of the system. You can even write a class for each system to enable easy reuse across projects.

```javascript
class Health {
  constructor (app) {
    this.app = app
    this.listeners = {
      update: this.update,
      entityWasHit: this.entityWasHit
    }
  }
  update (dt) {}
  entityWasHit (entity, damage) {}
}

// startSystem() returns the system object that you pass to it
// (the Health instance in this case)
const health = app.startSystem(new Health(app))

// The system can later be passed to stopSystem()
app.stopSystem(health)
```

## Scenes
You can split your game into scenes (loading, main menu, cave, etc.) by wrapping the code for each scene in a function.

```javascript
function cave () {
  // Start all of the necessary systems for the cave area
  app.startSystem(new Health(app))
  app.startSystem(new Physics(app))
  // ...

  // Initialize the entities (player, enemies, terrain, treasure)
  const player = new fae.Entity(/* ... */)
  // ...
}

// Somewhere else in your code (maybe in response to the player clicking 'play')
app.enterScene(cave)
```

`enterScene()` will stop all systems, destroy all non-persistent entities, and then call the passed function.
