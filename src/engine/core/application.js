import Entity from "./entity";
import Component from "./component";
import System from "./system";
import Scene from "./scene";

import * as components from "../components";
import * as systems from "../systems";

import mixinEventListener from "./event-listener";

export default class Application extends PIXI.Application {
    constructor(width, height, options, noWebGL) {
        super(width, height, options, noWebGL);
        mixinEventListener(this);

        this.loader = new PIXI.loaders.Loader();
        this.resources = this.loader.resources;

        this.entities = [];
        this.components = {};
        this.systems = [];
        this.scenes = {};

        this.stage.particles = this.stage.addChild(new PIXI.particles.ParticleContainer());
        this.stage.particles.blendMode = PIXI.BLEND_MODES.ADD;
        this.stage.particles.setProperties({
            scale: true,
            position: true,
            rotation: true,
            alpha: true
        });

        // Load default components and systems
        for (const component in components) {
            this.c(component, components[component]);
        }

        for (const system in systems) {
            this.s(systems[system]);
        }

        // Start firing update events
        this.ticker.add(() => {
            this.fire("update", this.ticker.deltaTime);

            for (const system of this.systems) {
                system.fire("update", this.ticker.deltaTime);
            }

            for (const entity of this.entities) {
                entity.fire("update", this.ticker.deltaTime);
            }
        });
    }

    // ECS wrappers
    e(options) {
        return new Entity(this, options);
    }

    c(name, options) {
        new Component(this, name, options);
    }

    s(options) {
        new System(this, options);
    }

    // Scene wrapper
    scene(name, options) {
        if (options) new Scene(this, name, options);
        else Scene.set(this, name);
    }
}
