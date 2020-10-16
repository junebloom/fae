import test from "ava";
import { Application } from "./Application.js";
import { EventEmitter } from "./EventEmitter.js";
import { EntityCollection } from "./EntityCollection.js";
import { SystemManager } from "./SystemManager.js";

test("provides the correct interfaces", (t) => {
  const app = new Application({ hideBanner: true });

  t.truthy(app.state, "Should provide a store for global state.");
  t.true(app.event instanceof EventEmitter, "Should provide an event emitter.");
  t.true(
    app.entity instanceof EntityCollection,
    "Should provide an entity collection."
  );
  t.true(
    app.system instanceof SystemManager,
    "Should provide a system manager."
  );
});

test.todo("can be reset to a blank slate");
