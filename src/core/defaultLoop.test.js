import test from "ava";
import util from "util";
import EventEmitter from "./EventEmitter.js";
import defaultLoop from "./defaultLoop.js";

const promiseTimeout = util.promisify(setTimeout);

test("emits proper events in node", async (t) => {
  const app = { event: new EventEmitter() };
  defaultLoop(app);

  let expected = 0;
  let updates = 0;
  let draws = 0;

  app.event.on("update", () => {
    t.is(updates, expected);
    updates++;
  });
  app.event.on("draw", () => {
    t.is(draws, expected);
    draws++;
    expected++;
  });

  await promiseTimeout(200);
  t.not(updates, 0); // update event is being emitted
  t.not(draws, 0); // draw event is being emitted
});
