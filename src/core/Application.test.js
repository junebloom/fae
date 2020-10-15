import test from "ava";
import Application from "./Application.js";

// Systems API tests
test("basic system", (t) => {
  t.plan(4);
  const application = new Application({ hideBanner: true });
  let received = false;

  const system = {
    event: "greet", // The event that the action is registered to.
    action(app, greeting) {
      t.is(app, application, "Application instance should be passed.");
      t.is(greeting, "hello, system!", "Event arguments should be passed.");
      received = true;
    },
  };

  application.startSystem(system);
  application.event.emit("greet", "hello, system!");
  t.is(received, true, "Greeting should have been received.");

  received = false;
  application.stopSystem(system);
  application.event.emit("greet", "hello, system!");
  t.is(
    received,
    false,
    "Greeting should not be received once system is stopped."
  );
});

test("system state", (t) => {
  const app = new Application({ hideBanner: true });
  const outerState = { count: 0 };

  const system = {
    event: "add",
    init: () => outerState, // Returns initial state.
    // `state` is only passed if init returns a value.
    action(app, state, amount) {
      t.is(
        state,
        outerState,
        "Internal state should match the object we gave."
      );
      state.count += amount;
    },
  };

  app.startSystem(system);
  app.event.emit("add", 1);
  t.is(outerState.count, 1, "Count should be 1.");
});

test("system lifecycle", (t) => {
  const application = new Application({ hideBanner: true });
  let running = null;

  const system = {
    event: "noop",
    // Init performs setup before the system starts (including optionally returning the initial state)
    init(app) {
      t.is(app, application, "Application instance should be passed.");
      running = true;
    },
    // Exit cleans up after the system is stopped
    exit(app) {
      t.is(app, application, "Application instance should be passed.");
      running = false;
    },
    action() {},
  };

  application.startSystem(system);
  t.is(running, true, "Running should be set to true.");

  application.stopSystem(system);
  t.is(running, false, "Running should be set to false.");
});

// Groups API tests
test("creates and holds reference to entity groups", (t) => {
  const app = new Application({ hideBanner: true });
  app.createGroup("powerpuff");
  t.truthy(app.groups.powerpuff, "The powerpuff group should exist");
});
