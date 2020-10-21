import test from "ava";
import { EventEmitter } from "./EventEmitter.js";

// EventEmitter API Tests

test("registers and calls listeners", (t) => {
  const emitter = new EventEmitter();

  emitter.addListener("somethingHappened", () =>
    t.pass("Something should happen.")
  );
  emitter.emit("somethingHappened");
});

test("unregisters listeners", (t) => {
  const emitter = new EventEmitter();
  const listener = () => t.fail("It did something instead of nothing!");

  emitter.addListener("doNothing", listener);
  emitter.removeListener("doNothing", listener);

  emitter.emit("doNothing");
  t.pass("Nothing should happen.");
});

test("arguments are passed to listeners", (t) => {
  const emitter = new EventEmitter();
  const args = ["apples", "oranges"];

  emitter.addListener("fruitTime", (...fruits) => {
    t.deepEqual(args, fruits, "The arguments should be fruits.");
  });

  emitter.emit("fruitTime", ...args);
});

test("multiple listeners for the same event are called in-order", (t) => {
  const emitter = new EventEmitter();
  let count = 0;
  t.plan(2);

  emitter.addListener("dejaVu", () => {
    t.is(count, 0, "This should come first.");
    count++;
  });

  emitter.addListener("dejaVu", () => {
    t.is(count, 1, "This should come last.");
    count++;
  });

  emitter.emit("dejaVu");
});
