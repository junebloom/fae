import SAT from "sat";

export const collision = {
    require: ["collision"],

    update(dt) {
        // Check e against every other collidable entity
        for (const e of this.entities) {

            // Store e's collider (since e.collider is a getter)
            let ec = e.collider;

            for (const other of this.entities) {
                if (other == e) continue;

                // Store other's collider
                let oc = other.collider;

                // Determine which test to use
                let test;
                let args = [ec, oc];
                if (ec.type == "Vector") {
                    if (oc.type == "Vector") continue;
                    test = "pointIn" + oc.type;
                }
                else if (oc.type == "Vector") {
                    test = "pointIn" + ec.type;
                    args = [oc, ec];
                }
                else {
                    test = "test" + ec.type + oc.type;
                }

                // Do collision test
                let response = new SAT.Response();
                if (SAT[test](...args, response)) {
                    response.a = ec;
                    response.b = oc;
                    response.other = other;
                    e.fire("collided", response);
                }
            }
        }
    }
};
