import test from "ava";
import Application from "./Application.js";

test.skip("new api, basic system", (t) => {
  const app = new Application({ hideBanner: true });

  const system = {
    event: "event", // The event that the action is registered to
    action(app, ...args) {
      // Do something
    },
  };

  app.start(system);
});

test.skip("new api, system state", (t) => {
  const app = new Application({ hideBanner: true });

  const system = {
    event: "event",
    init: (app) => ({}), // Returns initial state
    action(app, state, ...args) {
      // state is only passed if init returns a value
    },
  };

  app.start(system);
});

test.skip("new api, system lifecycle", (t) => {
  const app = new Application({ hideBanner: true });

  const system = {
    event: "event",
    init() {}, // Init performs setup before the system starts (including optionally returning the initial state)
    exit() {}, // Exit cleans up after the system is stopped
    action(app, ...args) {},
  };

  app.start(system);
});

test("starts and stops systems properly", (t) => {
  const app = new Application({ hideBanner: true });
  let running;

  const listeners = {
    goodDay() {
      t.true(running, "This should not be called if the system is stopped");
    },
  };

  const system = app.startSystem({ listeners });
  running = true; // system should be running
  app.event.emit("goodDay");

  app.stopSystem(system);
  running = false; // system should be stopped
  app.event.emit("goodDay");
});

test("creates and holds reference to entity groups", (t) => {
  const app = new Application({ hideBanner: true });
  app.createGroup("powerpuff");
  t.truthy(app.groups.powerpuff, "The powerpuff group should exist");
});
