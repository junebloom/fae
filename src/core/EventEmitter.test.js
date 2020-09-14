import test from "ava";
import EventEmitter from "./EventEmitter.js";

test("registers and calls listeners", (t) => {
  const emitter = new EventEmitter();

  emitter.on("somethingHappened", () => t.pass("Something should happen"));
  emitter.emit("somethingHappened");
});

test("unregisters listeners", (t) => {
  const emitter = new EventEmitter();
  const listener = () => t.fail("It did something instead of nothing!");

  emitter.on("doNothing", listener);
  emitter.removeListener("doNothing", listener);

  emitter.emit("doNothing");
  t.pass("Nothing should happen");
});

test("arguments are passed to listeners", (t) => {
  const emitter = new EventEmitter();
  const args = ["apples", "oranges"];

  emitter.on("fruitTime", (...fruits) => {
    t.deepEqual(args, fruits, "The arguments should be fruits");
  });

  emitter.emit("fruitTime", ...args);
});

test("listeners are called with the correct context", (t) => {
  const emitter = new EventEmitter();
  const context = {};

  function listener() {
    t.is(this, context, "`this` should be the context that was supplied");
  }

  emitter.on("somethingWickedThisWayComes", listener, context);
  emitter.emit("somethingWickedThisWayComes");
});

test("multiple listeners for the same event are called in-order", (t) => {
  const emitter = new EventEmitter();
  let count = 0;
  t.plan(2);

  emitter.on("dejaVu", () => {
    t.is(count, 0, "This should come first");
    count++;
  });

  emitter.on("dejaVu", () => {
    t.is(count, 1, "This should come last");
    count++;
  });

  emitter.emit("dejaVu");
});
