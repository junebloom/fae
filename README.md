# fae
There are *a lot* of things missing or hastily written with no documentation, no tests, etc., so I can't recommend actually using it in this state, but I won't stop you ;)

Feel free to offer any suggestions or contributions, if you're interested.

## Overview
Many of the barebones core features are working, but the API isn't perfect yet. I'm working on making it awesome!

The event system I wrote is redundant and probably worse than the node-style implementation Pixi uses, so I'll replace it with EventEmitter3 (same as Pixi).

The ECS implementation needs some love as well. I have plans in mind to improve it a good deal.

Some systems still need to be written, like input handling.

### Events
Fae has a simple event system for communication among Entities, Systems, and the application.
```javascript
// Bind an event to the player entity. The passed callback will be called when the event is triggered.
// (Note that "this" inside of event handlers refers to the entity the event is bound to.)
player.bind("hitbyarrow", (data) => {

  if (data.shooter.friendly) return;
  
  this.hp -= data.arrow.damage - this.armor;
  
  // Trigger an event to be handled on the arrow entity, and pass some data along with it.
  data.arrow.fire("landedhit", { character: this });
});
```
In the example above, we don't directly destroy the arrow because it could be enchanted with piercing, or anything else that might alter its behavior, and that's none of the player entity's business.

### ECS
...

### Scenes
...
