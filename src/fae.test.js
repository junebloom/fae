import test from "ava";
import fae from "./fae.js";
import { Application, getTime, logBanner } from "./fae.js";

test("default export", (t) => {
  t.truthy(fae.Application, "Application constructor should be present.");
  t.truthy(fae.getTime, "getTime function should be present.");
  t.truthy(fae.logBanner, "logBanner function should be present.");
});

test("named exports", (t) => {
  t.truthy(Application, "Application constructor should be present.");
  t.truthy(getTime, "getTime function should be present.");
  t.truthy(logBanner, "logBanner function should be present.");
});
