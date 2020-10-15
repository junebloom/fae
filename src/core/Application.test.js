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
    init: (app) => outerState, // Returns initial state.
    action(app, state, amount) {
      // `state` is only passed if init returns a value.
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
  t.is(outerState.count, 1, "Count should equal one.");
});

test.skip("new api, system lifecycle", (t) => {
  const app = new Application({ hideBanner: true });

  const system = {
    event: "event",
    init() {}, // Init performs setup before the system starts (including optionally returning the initial state)
    exit() {}, // Exit cleans up after the system is stopped
    action(app, ...args) {},
  };

  app.startSystem(system);
});

// Groups API tests
test("creates and holds reference to entity groups", (t) => {
  const app = new Application({ hideBanner: true });
  app.createGroup("powerpuff");
  t.truthy(app.groups.powerpuff, "The powerpuff group should exist");
});
