# Fae

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
// Create an Application instance and read the docs to get started!
const app = new Application();
```

# API Reference

The guide below is the best primary documentation, but if you need more detailed API information try taking a peek at the source!

I work hard to keep it simple, readable, fully annotated, and fully unit-tested. The tests provide an overview of the APIs through usage examples, and the implementation of course has the full details.

For convenience, each section of the guide has links to the relevant implementation and test files.

# Guide

- [Introducing Entities]()
  - [Tags]()
- [Describing With Components]()
  - [Component Parameters]()
- [Acting With Systems]()
- [Events]()
  - [Default Game Loop]()
- [Querying Entities]()
  - [Conditions]()
  - [Using the Result]()
  - [When to use queries?]()
  - [How to get a specific entity?]()
- [System State]()
- [Lifecycles]()
  - [Component Lifecycle]()
  - [System Lifecycle]()
- [Application State]()
- [Custom Game Loop]()

> Asides such as this contain additional explanation or information and appear throughout the guide.

## Introducing Entities

[Implementation]() - [Tests]()

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

[Implementation]() - [Tests]()

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

[Implementation]() - [Tests]()

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

> You may have noticed that the action takes the `app` instance as an argument. [More on this in a minute.]()

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

[Implementation]() - [Tests]()

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

### Default Game Loop

[Implementation]() - [Tests]()

By default, there are two events emitted 60 times per second:

- `update` - With one argument `dt` (the time in seconds since last update.)
- `draw` - No arguments.

> This behavior can be overridden. [See Custom Game Loop.]()

## Querying Entities

[Implementation]() - [Tests]()

Let's re-create Edgar and give him some friends.

```js
app.entity.create().attach(Fur, "gray", "long").tag("hungry"); // Edgar
app.entity.create().attach(Fur, "black", "short"); // Gus
app.entity.create().attach(Fur, "gray", "short"); // Pam
app.entity.create().tag("hungry"); // Cleo (hairless!)
```

Now we've got some cool cats, but we haven't stored any reference to them. How do we do access them? With queries!

```js
// Get all entities with the "fur" tag.
app.entity.get("fur"); // (Edgar, Gus, and Pam)
```

### Conditions

[Implementation]() - [Tests]()

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

[Implementation]() - [Tests]()

The value returned from a query is an EntitySet, which implements the `forEach` method.

```js
app.entity.get("hungry").forEach((e) => {
  // Feed each hungry kitty.
});
```

It is also an Iterable, so it can be used with `for...of` loops.

```js
for e of app.entity.get("hungry") {
  // Feed each hungry kitty.
}
```

### When to use queries?

Any time you need to access entities that weren't defined within the current scope, which is almost always.

Generally, components and systems should only use local state - meaning either state passed as arguments or defined within the function of the component or system itself - to keep them generic and reusable.

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

### How to get a specific entity?

Usually when you need to do something with a specific entity, you can simply pass that entity as an argument to wherever it is needed, as in the [Feeding system from earlier]().

If that's not possible, then you can query for some unique property of the entity, but this isn't recommended because it may not be robust - if the property isn't actually unique, or the entity doesn't exist, et cetera - and may create strong coupling, which can make it harder to maintain and expand your code later.

```js
app.entity.create().tag("edgar"); // Not recommended.
```

```js
const [edgar] = app.entity.get("edgar"); // Not recommended.
```

## System State

[Implementation]() - [Tests]()

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

> `init` takes the `app` instance as its only argument.

Similar to component state, the `init` function should return the initial state for the system. The returned value will be passed to `action` as the second parameter, whenever it is triggered.

> It is worth noting that this behavior of passing the state to `action` only occurs if `init` explicitly returns a value other than `undefined`. The mere presence of `init` does not cause this. See [System Lifecycle]() for the explanation.

### When to use system state?

Whenever a system needs to use some state that doesn't describe a specific entity, _i.e._ it doesn't make sense for the state to be a component.

Usually you won't need system state. For example, if you want to track which entities have had their heads patted, adding a `"patted"` tag or component to the individual entities is the recommended pattern, rather than keeping a list of entities in system state. This allows that information to remain queryable.

## Lifecycles

Sometimes your components and systems may need to "step outside" of Fae to do certain kinds of interaction with the environment _(i.e. adding/removing DOM event listeners)_, or other libraries _(i.e. creating/destroying object instances)_, or they may simply need to do something at the beginning or end of their "life".

Lifecycles are the way to do this.

> Lifecycles can be very handy, but you should use the lifecycle API carefully because unnecessary side-effects in your components and systems can lead to difficult bugs.

### Component Lifecycle

[Implementation]() - [Tests]()

While primarily for initializing state, a component's `init` function can also be used for other initialization. Simply do your set-up in the body of `init` and don't forget to still return the initial state for the component.

Components can also have an `exit` function.

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

> `init()` is called as the first step when a component is being attached, and `exit()` is called as the last step when being detached.

### System Lifecycle

[Implementation]() - [Tests]()

In systems, `init` can be used for set-up, and returning an initial state is optional. If a value is returned from `init`, then the behavior described in [System State]() occurs.

Systems can also have an `exit` function.

> Both `init` and `exit` take the `app` instance as their only argument.

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

> `init()` is called as the first step when a system is started, and `exit()` is called as the last step when stopped.

## Application State

[Implementation]() - [Tests]()

## Custom Game Loop

[Implementation]() - [Tests]()
