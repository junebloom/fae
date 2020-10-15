# fae

A small game framework with a simple, joyful API.

- Flexible; decoupled entity-component-system approach
- Agnostic; pairs with anything you prefer for rendering, physics, etc.
- Focused; only does what it's good at
- Runs in browsers, Node, and Deno
- Zero dependencies
- ~1kb compressed

# Getting Started

via package manager:

`yarn add fae` _or_ `npm i -S fae`

```javascript
import fae from "fae";

const app = new fae.Application();
```

via CDN:

```javascript
// Use your preferred CDN; here we use jspm
import fae from "https://jspm.dev/fae@1.4.1/dist/fae.js";
```

# Concepts

This is a minimal guide. Check out the annotated source for more API details (it's short and sweet!).

## The loop

`app.event` is an EventEmitter (a subset of the Node API). By default, it emits two events every frame:

`update` and `draw`.

Arbitrary events can be emitted as well:

```javascript
app.event.emit("entityWasHit", myEntity, 2);
```

You could manually listen for events with `app.event.on()`, but in practice it is better to use systems ([see below](#systems)) to manage event listeners.

## Entities

Entities are the objects in your game. They are empty containers that you can group together and attach components to.

```javascript
const player = new fae.Entity(app).attach(
  new Position(0, 0),
  new HP(10)
  // etc...
);
```

Entities are automatically added to a group named for the component's `key` property when a component is attached. (So the player above may be in the groups 'hp', 'position', etc.)

## Components

A component is an object that holds state and utility methods related to an entity. Components can be attached to entities to compose their functionality.

A component object must have a property named `key` _(But it can be on the component's prototype!)_.

```javascript
// A component class that holds health-related state
class HP {
  constructor(max) {
    this.key = "hp";
    this.max = max;
    this.current = max;
  }
}
```

## Systems

Systems tie things together by providing the actual game logic. A system is an object with a `listeners` property. `listeners` is itself an object whose keys are event names, and whose values are functions to handle those events. `this` inside of system listeners refers to the system object.

```javascript
// A system for healing/dealing damage
const health = {
  listeners: {
    update(dt) {
      // Do something every frame
      // like iterate over entities with the HP component and slowly heal them:
      for (const e of app.groups.hp) {
        if (e.hp.current < e.hp.max) {
          e.hp.current = Math.min(e.hp.current + 0.1 * dt, e.hp.max);
        }
      }
    },
    entityWasHit(entity, damage) {
      // handle 'entityWasHit' event
    },
  },
};

app.startSystem(health);
```

Fae doesn't care how you structure the rest of the system. You can even write a class to ease reuse across projects.

```javascript
class Health {
  constructor(app) {
    this.app = app;
    this.listeners = {
      update: this.update,
      entityWasHit: this.entityWasHit,
    };
  }
  update(dt) {
    // ...
  }
  entityWasHit(entity, damage) {
    // ...
  }
}
```

`startSystem()` returns the system object that you pass to it. The `Health` instance in this case.

```javascript
const health = app.startSystem(new Health(app));
```

The system object can later be passed to `stopSystem()`.

```javascript
app.stopSystem(health);
```

## Scenes

You can split your game into scenes (loading, main menu, cave, etc.) by wrapping the code for each scene in a function.

```javascript
function cave() {
  // Start all of the necessary systems for the cave area
  app.startSystem(new Health(app));
  app.startSystem(new Physics(app));
  // ...

  // Initialize the entities (player, enemies, terrain, treasure)
  const player = new fae.Entity /* ... */();
  // ...
}
```

```javascript
// Somewhere else in your code (maybe in response to the player clicking 'play')
app.clear();
cave();
```

`app.clear()` will stop all non-persistent systems and destroy all non-persistent entities, leaving you with a blank slate to call your scene function.
