# fae
Fae is a small 2d game-engine designed to be fast and easy to work with. It uses PixiJS for maximum rendering performance and flexibility.

The main features of fae are:

- Straightforward and powerful ECS implementation
- Communication via events
- Basic scenes
- Flexible InputManager
- Vectors
- Plus everything Pixi has! (resource loader, glsl shaders, etc.)

Fae is in its early stages, so some things are still a bit rough around the edges. Core parts of the engine may be scrapped and rewritten as I decide on the best way to do things.

Feel free to offer any suggestions or contributions, if you're interested.

## Installation
Get fae using `npm install -S fae`. Keep in mind that fae is written using the latest JS standards. You may need to use a transpiler like Babel for your game to be supported in all browsers.

## Usage
There is currently no real documentation (sorry), but the core is pretty small and easy to understand so you should be able to figure out the API by reading the source.

Some of the default components/systems (specifically particles, steering, animatedsprite) are pretty hacky, as I needed something that worked (sorry again). I'll remove/rewrite them later.

### Application
The `fae.Application` class is where most of the action is. It extends `PIXI.Application` and provides access to fae's various features. Create an instance of it to get a basic game running.

```javascript
import * as fae from "fae";

const app = new fae.Application();
document.body.appendChild(app.view);
```

### Scenes
Games in fae are built primarily from scenes with entities in them.

A scene looks like this:
```javascript
app.scene("myScene", {
  enter() {
    // Set up the scene
  },
  
  exit(next) {
    // Do some stuff, then call next() to enter the next scene
  },
});
```

To enter the scene you can call `app.scene("myScene");`. This will call the current scene's `exit()` method, and enter `"myScene"` once that exit method calls `next()`.

It is set up this way to allow a smooth transition between scenes. You can start an exit animation in `exit()`, and call `next()` when it is finished.

All non-persistent entities will be destroyed when `next()` is called.

### Entities
An entity is basically a fancified PIXI.Container. You can attach components to it to add behaviors.

```javascript
const myEntity = app.e({
  components: ["someComponent", "anotherOne"], // Names of components to attach to this entity
  groups: ["myGroup"], // Names of groups to add this entity to
  parent: myParentContainer // Can be a PIXI.Container (or subclass thereof, including other entities)
  
  ready() {
    // Set initial values
  },
  
  someEvent() {
    // Do stuff when this entity recieves 'someEvent'
  }
});
```

#### Groups
Groups are how you work with sets of entities (in fact they are currently implemented using Set objects).

...

### Components
...

### Systems
...

### Input
...
