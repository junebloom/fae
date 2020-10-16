import test from "ava";
import { SystemManager } from "./SystemManager.js";
import { EventEmitter } from "./EventEmitter.js";

function createSystemManager() {
  const mockApp = {
    event: new EventEmitter(),
  };
  return new SystemManager(mockApp);
}

test("system starts, handles event, and stops", (t) => {
  const manager = createSystemManager();
  let received = false;
  t.plan(4);

  const system = {
    event: "greet", // The event that the action is registered to.
    action(app, greeting) {
      t.is(app, manager.app, "Application instance should be passed.");
      t.is(greeting, "hello, system!", "Event arguments should be passed.");
      received = true;
    },
  };

  manager.start(system);
  manager.app.event.emit("greet", "hello, system!");
  t.true(received, "Greeting should have been received.");

  received = false;
  manager.stop(system);
  manager.app.event.emit("greet", "hello, system!");
  t.false(received, "Greeting should not be received once system is stopped.");
});

test("system state is initialized and passed to action", (t) => {
  const manager = createSystemManager();
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

  manager.start(system);
  manager.app.event.emit("add", 1);
  t.is(outerState.count, 1, "Count should be 1.");
});

test("system lifecycle initializes and exits", (t) => {
  const manager = createSystemManager();
  let running = null;

  const system = {
    event: "noop",
    // Init performs setup before the system starts (including optionally returning the initial state)
    init(app) {
      t.is(app, manager.app, "Application instance should be passed in init.");
      running = true;
    },
    // Exit cleans up after the system is stopped
    exit(app) {
      t.is(app, manager.app, "Application instance should be passed in exit.");
      running = false;
    },
    action() {},
  };

  manager.start(system);
  t.true(running, "Running should be set to true.");

  manager.stop(system);
  t.false(running, "Running should be set to false.");
});
