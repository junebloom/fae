import test from "ava";
import { logBanner } from "./logBanner.js";

test("executes without erroring", (t) => {
  t.notThrows(logBanner);
});
