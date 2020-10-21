import test from "ava";
import util from "util";
import { getTime } from "./getTime.js";

const promiseTimeout = util.promisify(setTimeout);

test("returns time accurately in seconds", async (t) => {
  const t1 = getTime();
  await promiseTimeout(1000);
  const t2 = getTime();

  // t2 - t1 = ~1 = a
  // a - 1 = ~0 = b
  // |b| = total error
  // (Probably a few ms, caused by inaccuracy in setTimeout.)
  const error = Math.abs(t2 - t1 - 1);

  t.true(error < 0.01, "Close to 1 second should have passed.");
});
