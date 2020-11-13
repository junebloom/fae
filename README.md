# Fae

A small game framework with a simple, joyful API.

- Flexible; decoupled entity-component-system approach.
- Agnostic; pairs with anything you prefer for rendering, UI, etc.
- Focused; only does what it's good at.
- Runs in browsers, [Node](https://github.com/nodejs/node), and [Deno](https://github.com/denoland/deno).
- Zero dependencies.
- ~1kb compressed.

# Getting Started

Via package manager:

`yarn add fae` _or_ `npm i -S fae`

```js
import { Application } from "fae";
```

Via CDN:

```js
// Use your preferred CDN; here we use jspm.
// (And be sure to specify a version so your game doesn't break when Fae updates!)
import { Application } from "https://jspm.dev/fae/dist/fae.js";
```

And then:

```js
// Create an Application instance and read the docs to get started!
const app = new Application();
```

# API Reference

The guide below is the best primary documentation, but if you need more detailed API information try taking a peek at the source!

I work hard to keep it small, readable, fully annotated, and fully unit-tested. The tests provide an overview of the APIs, and the implementation of course has the full details.

For convenience, each section of the guide has links to the relevant implementation and test files.

# Guide

After [Getting Started](#getting-started), you're ready to dive in!

> Asides such as this contain additional explanation or information and appear throughout the guide.

- [Introducing Entities](#introducing-entities)
  - [Tags](#tags)
- [Describing With Components](#describing-with-components)
  - [Component Parameters](#component-parameters)
- [Acting With Systems](#acting-with-systems)
- [Events](#events)
  - [Default Game Loop](#default-game-loop)
- [Querying Entities](#querying-entities)
  - [Conditions](#conditions)
  - [Using the Result](#using-the-result)
  - [_When to use queries?_](#when-to-use-queries)
  - [_How to get a specific entity?_](#how-to-get-a-specific-entity)
- [System State](#system-state)
  - [_When to use system state?_](#when-to-use-system-state)
- [Lifecycles](#lifecycles)
  - [Component Lifecycle](#component-lifecycle)
  - [System Lifecycle](#system-lifecycle)
- [Application State](#application-state)
  - [_When to use application state?_](#when-to-use-application-state)
- [Custom Game Loop](#custom-game-loop)
- [Integrating Rendering, UI, and More](#integrating-rendering-ui-and-more)
  - [Example: Canvas](#example-canvas)
  - [Example: Keyboard Input](#example-keyboard-input)
  - [Example: React](#example-react)

## Introducing Entities

[Implementation](/src/core/Entity.js) - [Tests](/src/core/Entity.test.js)

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

> Every entity has the `"all"` tag.

## Describing With Components

[Implementation](/src/core/Entity.js) - [Tests](/src/core/Entity.test.js)

Components are the data used to _describe_ entities. This is what a basic component looks like:

```js
const Weight = {
  tag: "weight",
  init: () => 19.4,
};
```

A component is an object with two properties:

- `tag` should be a short descriptive camelCase string, and
- `init` should be a function that returns the initial state of the component.

```js
// Let's attach the component.
edgar.attach(Weight);
```

Attaching a component to an entity does two things:

- It tags the entity with the component's `tag`, and
- It calls `init` and stores the result on the entity as a property with the name of the tag.

```js
console.log(edgar.weight); // 19.4
```

```js
// We can detach a component using its tag.
edgar.detach("weight");
```

> Components are designed to be reusable. Attaching effectively creates an 'instance' of the component, due to how `init` works. This means we can attach the same component to as many entities as we like, and each one will have its own unique component state.

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

So components describe an entity's characteristics, but they don't implement any logic or behaviors. How do we make stuff happen then? The answer is systems.

## Acting With Systems

[Implementation](/src/core/SystemManager.js) - [Tests](/src/core/SystemManager.test.js)

Systems provide actions, the code to _do stuff_ with entities. This is a basic system:

```js
const BatheInTheMorning = {
  event: "sunrise",
  action(app) {
    // Do morning grooming routine.
  },
};
```

As with components, a system is just an object with two properties:

- `event` is the name of the event that the system listens for, and
- `action` is the function that is triggered when the event occurs.

> You may have noticed that the action takes the `app` instance as an argument. [More on this in a minute.](#when-to-use-queries)

Let's start the system.

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

[Implementation](/src/core/EventEmitter.js) - [Tests](/src/core/EventEmitter.test.js)

Systems perform actions in response to events. Where do the events come from?

```js
// Emit a sunrise event.
// This will trigger the actions of all systems that are listening.
app.event.emit("sunrise");
```

You can emit any arbitrary event using `app.event.emit`. Additional `args` passed to `emit` will be passed through to the actions of any systems listening.

```js
const Feeding = {
  event: "feed",
  action(app, kitty, amount) {
    // Feed kitty the specified amount.
  },
};
```

```js
// Feed Edgar one portion.
app.event.emit("feed", edgar, 1);
```

> `emit()` triggers event listeners synchronously and in the order in which they were registered. _(i.e. the order in which the respective systems were started.)_

### Default Game Loop

[Implementation](/src/utils/startDefaultLoop.js) - [Tests](/src/utils/startDefaultLoop.test.js)

By default, there are two events emitted 60 times per second:

- `update` - With one argument `dt` _(The time in seconds since the last update.)_
- `draw` - No arguments.

> This behavior can be overridden. See [Custom Game Loop](#custom-game-loop).

## Querying Entities

[Implementation](/src/core/EntityCollection.js) - [Tests](/src/core/EntityCollection.test.js)

Let's re-create Edgar and give him some friends.

```js
app.entity.create().attach(Fur, "gray", "long").tag("hungry"); // Edgar
app.entity.create().attach(Fur, "black", "short"); // Gus
app.entity.create().attach(Fur, "gray", "short"); // Pam
app.entity.create().tag("hungry"); // Cleo (hairless!)
```

Now we've got some cool cats, but we haven't stored any reference to them. How do we access them? With queries!

```js
// Get all entities with the "fur" tag.
app.entity.get("fur"); // (Edgar, Gus, and Pam)
```

### Conditions

[Implementation](/src/core/EntitySet.js) - [Tests](/src/core/EntitySet.test.js)

Queries can be expanded with further conditions.

```js
// Get only entities tagged with both "fur" and "hungry".
app.entity.get("fur").and("hungry"); // (Edgar)

// Get all entities tagged with either "fur" or "hungry".
app.entity.get("fur").or("hungry"); // (Edgar, Gus, Pam, and Cleo)

// Get only entities with "fur" and without "hungry".
app.entity.get("fur").andNot("hungry"); // (Gus and Pam)
```

There is also a `filter` method for more complex conditions.

```js
// Get only entities with short fur.
app.entity.get("fur").filter(({ fur }) => fur.length === "short"); // (Gus and Pam)
```

These conditions can all be chained continuously as well, to build as much complexity as needed, though it's rare to need very long queries.

```js
// Get only entities that have gray fur and not "hungry".
app.entity
  .get("fur")
  .filter(({ fur }) => fur.color === "gray")
  .andNot("hungry"); // (Pam)
```

> For performance, an internal index is maintained for every tag that exists, meaning `get` always returns its result in constant time. Further conditions increase the complexity to linear time, which should still be quite fast in most cases.

### Using the Result

[Implementation](/src/core/EntitySet.js) - [Tests](/src/core/EntitySet.test.js)

The value returned from a query is an [EntitySet](/src/core/EntitySet.js), which implements the `forEach` method.

```js
app.entity.get("hungry").forEach((e) => {
  // Feed each hungry kitty.
});
```

EntitySet is also an Iterable, so it can be used with `for...of` loops.

```js
for e of app.entity.get("hungry") {
  // Feed each hungry kitty.
}
```

### _When to use queries?_

Any time you need to access entities that weren't defined within the current scope, which is almost always.

Generally, components and systems should only use state passed as arguments or defined within the function of the component or system itself - to keep them generic and reusable. This is one of the reasons queries are useful.

Remember how `app` is passed as an argument to a system's `action`? This allows us to use queries within an action.

```js
const PetThemAll = {
  event: "pet",
  action(app) {
    app.entity.get("all").forEach((e) => {
      // (Every entity has the "all" tag.)
      // Do a pet!
    });
  },
};
```

Though rare, if you need to use a query in a component's `init`, you can access the app instance through the entity's `app` property.

```js
const Name = {
  tag: "name",
  init({ app }, name) {
    app.entity.get("name").forEach((other) => {
      if (other.name === name) throw new Error("Oh no! That name is taken.");
    });
    return name;
  },
};
```

### _How to get a specific entity?_

Usually when you need to do something with a specific entity, you can simply pass that entity as an argument to wherever it is needed, as in the [Feeding system from earlier](#events).

If that's not possible, then you can query for some unique property of the entity, but this isn't recommended because it may not be robust - if the property isn't actually unique, or the entity doesn't exist, et cetera - and may create strong coupling, which can make it harder to maintain and expand your code later.

```js
app.entity.create().tag("edgar"); // Not recommended.
```

```js
const [edgar] = app.entity.get("edgar"); // Not recommended.
```

## System State

[Implementation](/src/core/SystemManager.js) - [Tests](/src/core/SystemManager.test.js)

Most state in your game will belong to individual entities in the form of components, but on occasion, systems will need access to state that shouldn't necessarily belong to individual entities.

To deal with this requirement, there is a way to store state in systems themselves.

```js
const HeadPat = {
  event: "headPat",
  init: (app) => ({ total: 0 }),
  action(app, state, kitty) {
    // Pat kitty's head.
    // ...

    // Increment the total so we know how many head pats have been given.
    state.total += 1;
    console.log(state.total);
  },
};
```

```js
app.event.emit("headPat", edgar); // console: 1
app.event.emit("headPat", gus); // console: 2
```

> `init` takes the `app` instance as its first argument. You can also give additional arguments to `app.system.start()`, and they will be passed to `init`, similar to passing arguments when [attaching components](#component-parameters).

As with component state, the `init` function should return the initial state for the system. The returned value will be passed to `action` as the second parameter, whenever `action` triggered.

> It is worth noting that this behavior of passing the state to `action` only occurs if `init` explicitly returns a value other than `undefined`. The mere presence of `init` does not cause this. See [System Lifecycle](#system-lifecycle) for the explanation.

### _When to use system state?_

Whenever a system needs to use some state that doesn't describe a specific entity, _i.e._ it doesn't make sense for the state to be a component.

Usually you won't need system state. For example, if you want to track which entities have had their heads patted, adding a `"patted"` tag or component to the individual entities is the recommended pattern, rather than keeping a list of entities in system state. This allows that information to remain [queryable](#querying-entities).

## Lifecycles

Sometimes your components and systems may need to "step outside" of Fae to do certain kinds of interaction with the environment _(i.e. adding/removing DOM event listeners)_, or other libraries _(i.e. creating/destroying object instances)_, or they may simply need to do something at the beginning or end of their "life".

Lifecycles are the way to do this.

> Lifecycles can be very handy, but you should use the lifecycle API carefully because unnecessary side-effects in your components and systems can lead to difficult bugs.

### Component Lifecycle

[Implementation](/src/core/Entity.js) - [Tests](/src/core/Entity.test.js)

While primarily for initializing state, a component's `init` function can also be used for other initialization. Simply do your set-up in the body of `init` and don't forget to still return the initial state for the component.

Components can also have an `exit` function which is called when being detached from an entity.

> Like `init`, `exit` takes the entity as its first argument.

```js
const Component = {
  tag: "foo",
  init(e) {
    // Do some set up.

    // Return the initial state.
    return "bar";
  },
  exit(e) {
    // Do some clean up.
  },
};
```

### System Lifecycle

[Implementation](/src/core/SystemManager.js) - [Tests](/src/core/SystemManager.test.js)

In systems, `init` can be used for set-up, and returning an initial state is optional. If a value is returned from `init`, then the behavior described in [System State](#system-state) occurs.

Systems can also have an `exit` function which is called when the system is stopped.

> Both `init` and `exit` take the `app` instance as their first argument. If the system has state, `exit` takes it as its second argument.

```js
const System = {
  event: "foo",
  init(app) {
    // Add a DOM event listener or something.
  },
  exit(app) {
    // Remove a DOM event listener or something.
  },
  action(app) {},
};
```

> Very rarely, you only need a system for its side effects in `init` and `exit`, rather than to respond to events, so `event` and `action` are technically optional. See [this example](#example-keyboard-input).

## Application State

[Implementation](/src/core/Application.js) - [Tests](/src/core/Application.test.js)

The Application State API is very minimal. The `app` instance simply has a `state` property, which you can use as a way to access global state throughout your game.

```js
app.state.canvas = document.getElementById("gameCanvas");
```

There is nothing special about the `state` property, except that it exists and you can initialize it in the Application constructor. It exists only to encourage a standard pattern for global state. By default it is just an empty object, but it can be set to anything you like.

```js
const app = new Application({ state: yourCustomStore });
```

### _When to use application state?_

There is a general order of precedence you can keep in mind when deciding where a piece of state should go:

`entity state -> system state -> application state`

1. Can the state logically "belong" to a thing in the game world? _If so,_ store it as a tag or component on the entity.

2. _If not,_ then is it only needed in a single system? _If so,_ store it as system state.

3. _If not,_ then is it only needed in reaction to specific events - or does it need to be queryable? _If the former,_ then store it as system state and pass it around with events. See [this example](#example-canvas).

4. _If the latter,_ then it's probably a good candidate for application state. See [this example](#example-keyboard-input).

> This is only a recommendation! Feel free to structure your state differently if it makes more sense for your case.

## Custom Game Loop

[Implementation](/src/core/Application.js) - [Tests](/src/core/Application.test.js)

If for any reason you want to override the [default game loop](#default-game-loop), there is a very simple way of doing so.

```js
const app = new Application({
  startGame: (app) => {
    // Start your custom game loop!
  },
});
```

You may want to do this for a variety of reasons:

- To add more features to the game loop.
- To write a loop suitable for your game's server.
- To make a turn-based game, where you might not need real-time updates.
- To disable the loop entirely and just use Fae as an ECS library.
- And more!

> Take a look at the [implementation](/src/utils/startDefaultLoop.js) of the default game loop for an example of a `startGame` function.

## Integrating Rendering, UI, and More

We've covered all of Fae's concepts and APIs, and you're just about ready to make an awesome game! The only thing left is integrating Fae with the other APIs or libraries you'll need for your game.

Fae is designed to be able to integrate with almost anything. The specifics of what this looks like will vary vastly depending on the exact API or library, and situation in which you're using them, but I'll provide examples for a few common cases here:

- [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - For rendering.
- [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) - For input.
- [React](https://github.com/facebook/react) - For UI.

> In the future, I may provide packages for common integrations.

### Example: Canvas

```js
// index.js
import { Application } from "fae";
import { CanvasRender } from "./CanvasRender.js";

const canvas = document.getElementById("canvas");
const app = new Application();

app.system.start(CanvasRender, canvas.getContext("2d"));
```

```js
// CanvasRender.js
export const CanvasRender = {
  event: "draw",
  init: (app, ctx) => ctx, // Store the rendering context as system state.
  action(app, ctx) {
    // Emit a "render" event that other systems can listen for.
    app.event.emit("render", ctx);

    // Clear the canvas after every frame.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};
```

With this set up, we can now write systems that consume the `render` event and use the passed [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) to do the actual drawing operations.

> For example, we could have a `DrawSprites` system to render any entities who have a `Sprite` component, or a `DrawColliders` system for debugging collisions.

### Example: Keyboard Input

> Keyboard input has some surprising subtleties, detailed below. Consider [Kaybee](https://github.com/junebloom/kaybee) as a library to handle these for you.

```js
// index.js
import { Application } from "fae";
import { KeyboardInput } from "./KeyboardInput.js";

const gameElement = document.getElementById("game");
const app = new Application();

app.system.start(KeyboardInput, gameElement);
```

```js
// KeyboardInput.js
export const KeyboardInput = {
  init(app, element) {
    // Application state is used to keep a map of pressed keys, so that key
    // state can be queried from anywhere in the game.
    function initializeState() {
      app.state.kb = {
        keys: {},
        codes: {},
      };
    }

    function handleKeyDown({ key, code, repeat }) {
      app.state.kb.keys[key.toLowerCase()] = true;
      app.event.emit("keydown", { key: key.toLowerCase(), code, repeat });
    }

    function handleKeyUp({ key, code }) {
      app.state.kb.keys[key.toLowerCase()] = false;
      app.event.emit("keyup", { key: key.toLowerCase(), code });
    }

    element.addEventListener("keydown", handleKeyDown);
    element.addEventListener("keyup", handleKeyUp);

    // Reset all pressed keys if the game loses focus. This prevents "stuck"
    // keys if the user releases the key while the game isn't focused and thus
    // can't receive the "keyup" event.
    window.addEventListener("blur", initializeState);
    element.addEventListener("blur", initializeState);

    initializeState();
  },
};
```

You should also write an `exit()` function that cleans up these DOM event listeners, especially if your game runs in a page where the user may also do other things besides playing your game. I've omitted it here for brevity.

> Note that the browser gives us the "printable representation" of the pressed `key`, including case. So "a" and "A" are two different keys. Seriously. This is why I used `toLowerCase()` to normalize key names. See [key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) and [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) at MDN for more info.

Now we can easily query keyboard state in our other systems.

```js
const KBMovementController = {
  event: "update",
  action(app, dt) {
    app.entity.get("KBControlled").forEach((e) => {
      if (app.state.kb.code["KeyA"]) {
        // Move left.
      }
    });
  },
};
```

Or respond to key events.

```js
const UIController = {
  event: "keydown",
  action(app, { key }) {
    if (key === "i") {
      // Open inventory.
    }
  },
};
```

### Example: React

> Coming soon.
