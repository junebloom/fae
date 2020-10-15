import test from "ava";
import Application from "./Application.js";
import Entity from "./Entity.js";

// Components API tests
test("basic component", (t) => {
  const app = new Application({ hideBanner: true });
  const entity = new Entity(app);
  t.falsy(entity.id, "ID field should not exist yet.");

  const component = {
    key: "id", // key is used to access the component on the entity.
    init: () => 0, // init returns the initial state for the component.
  };

  entity.attach(component);
  t.is(entity.id, 0, "ID should be present and set to 0.");

  entity.detach(component.key);
  t.falsy(entity.id, "ID should not exist anymore.");
});

test("component lifecycle", (t) => {
  const app = new Application({ hideBanner: true });
  const entity = new Entity(app);
  let alive = false;

  const component = {
    key: "itsAlive",
    // init can also be used for imperative set up/side effects.
    init(e) {
      t.is(e, entity, "Entity instance should be passed in init.");
      alive = true;
      return null;
    },
    // and exit handles the clean up afterwards.
    exit(e) {
      t.is(e, entity, "Entity instance should be passed in exit.");
      alive = false;
    },
  };

  entity.attach(component);
  t.true(alive, "Alive should be set to true as a side effect of attaching.");

  entity.detach(component.key);
  t.false(alive, "Alive should no longer be true.");
});

test("component parameters", (t) => {
  const app = new Application({ hideBanner: true });
  const entity = new Entity(app);

  const component = {
    key: "flavor",
    init: (e, flavor) => flavor,
  };

  entity.attach(component, "lime");
  t.is(entity.flavor, "lime", "Flavor should be set to the passed parameter.");
});

// Groups API tests
test("is in 'all' group", (t) => {
  const app = new Application({ hideBanner: true });
  const entity = new Entity(app);

  t.true(entity.groups.has("all"), "Every entity should be in 'all'");
});

test("can be added to and removed from groups", (t) => {
  const app = new Application({ hideBanner: true });
  const entity = new Entity(app);

  entity.group("cuddly", "whiskers");
  t.true(entity.groups.has("cuddly"), "Should be very cuddly");
  t.true(entity.groups.has("whiskers"), "Should have whiskers");

  entity.ungroup("cuddly", "whiskers");
  t.false(entity.groups.has("cuddly"), "Should not be cuddly :(");
  t.false(entity.groups.has("whiskers"), "Should not have whiskers");
});

test("hasGroups method works", (t) => {
  const app = new Application({ hideBanner: true });
  const entity = new Entity(app);

  entity.group("dog", "horse");

  t.true(
    entity.hasGroups("all", "dog", "horse"),
    "Should be true if entity is in every group provided"
  );
});
