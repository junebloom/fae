import test from "ava";
import { Application } from "./Application.js";

// Systems API tests
test("system starts, handles event, and stops", (t) => {
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
  t.true(received, "Greeting should have been received.");

  received = false;
  application.stopSystem(system);
  application.event.emit("greet", "hello, system!");
  t.false(received, "Greeting should not be received once system is stopped.");
});

test("system state is initialized and passed to action", (t) => {
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

test("system lifecycle initializes and exits", (t) => {
  const application = new Application({ hideBanner: true });
  let running = null;

  const system = {
    event: "noop",
    // Init performs setup before the system starts (including optionally returning the initial state)
    init(app) {
      t.is(app, application, "Application instance should be passed in init.");
      running = true;
    },
    // Exit cleans up after the system is stopped
    exit(app) {
      t.is(app, application, "Application instance should be passed in exit.");
      running = false;
    },
    action() {},
  };

  application.startSystem(system);
  t.true(running, "Running should be set to true.");

  application.stopSystem(system);
  t.false(running, "Running should be set to false.");
});

// Application API tests
test.todo("can be reset to a blank slate");
