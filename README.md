# fae

A small game framework with a simple, joyful API.

- Flexible; decoupled entity-component-system approach.
- Agnostic; pairs with anything you prefer for rendering, physics, etc.
- Focused; only does what it's good at.
- Runs in browsers, Node, and Deno.
- Zero dependencies.
- ~1kb compressed.

# Getting Started

via package manager:

`yarn add fae` _or_ `npm i -S fae`

```js
import { Application } from "fae";
```

via CDN:

```js
// Use your preferred CDN; here we use jspm.
import { Application } from "https://jspm.dev/fae@1.4.1/dist/fae.js";
```

```js
const app = new Application();
```

## Introducing Entities

Entities are the _things_ in your game. Characters, items, tiles; if it exists in the game world, then it's probably an entity.

```js
// Let's make a kitty. His name is Edgar.
const edgar = app.entity.create();
```

### Tags

Entities can be given tags.

```js
edgar.tag("hungry");
```

```js
// Oh no, let's feed him!
edgar.untag("hungry");
edgar.tag("loved");
```

## Describing With Components

Components are the data used to _describe_ entities. This is what a basic component looks like:

```js
const Weight = {
  tag: "weight",
  init: () => 19.4,
};
```

A component is an object with a `tag` property and an `init` function. `tag` is a string tag which will be associated with the component, and `init` should be a function that returns the initial state of the component.

```js
// Let's attach the component.
edgar.attach(Weight);
```

Attaching a component to an entity does two things: It tags the entity with the component's `tag`, and it calls `init` and stores the result on the entity as a property with the same name as the tag.

```js
console.log(edgar.weight); // 19.4
```

```js
// We can detach a component using its tag.
edgar.detach("weight");
```

Components are designed to be reusable. Attaching effectively creates an 'instance' of the component, due to how `init` works. This means we can attach the same component to as many entities as we like, and each one will have its own unique component state.

### Component Parameters

`init` always takes the entity that the component is being attached to as its first argument. Additional arguments can be supplied to `attach`, and they will be passed to `init`.

```js
const Fur = {
  tag: "fur",
  init: (e, color, length) => ({ color, length }),
};
```

```js
edgar.attach(Fur, "gray", "long");

console.log(edgar.fur.color); // "gray"
console.log(edgar.fur.length); // "long"
```

So components describe an entity's characteristics, but they don't implement any logic or behaviors. How do we do that then? The answer is systems.

## Acting With Systems

Systems provide actions, the code to _do stuff_ with entities. This is a basic system:

```js
const BatheInTheMorning = {
  event: "sunrise",
  action(app) {
    // Do morning grooming routine.
  },
};
```

Blah blah `event`, blah blah `action`.

```js
// Grooming will happen every sunrise until the system is stopped.
app.system.start(BatheInTheMorning);
```

```js
// Maybe sprinting around the house in the morning is more fun.
app.system.stop(BatheInTheMorning);
app.system.start(RunInTheMorning);
```

## Events

## Querying Entities

### Advanced Queries

## System State

## Lifecycles

### System Lifecycle

### Component Lifecycle

`Entity.app`

## Application State

## Custom Game Loop
