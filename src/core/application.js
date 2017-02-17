import Entity from "./entity";
import Component from "./component";
import System from "./system";
import Scene from "./scene";
import Vector from "../vector";

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

        this.destroyQueue = [];

        this.stage.particles = this.stage.addChild(new PIXI.particles.ParticleContainer());
        this.stage.particles.blendMode = PIXI.BLEND_MODES.ADD;
        this.stage.particles.setProperties({
            scale: true,
            position: true,
            rotation: true,
            alpha: true
        });

        // Set up debug graphics overlay
        this.stage.graph = this.stage.addChild(new PIXI.Graphics());
        this.bind("update", () => {
            this.stage.graph.clear();
        });

        // Load default components and systems
        for (const component in components) {
            this.c(component, components[component]);
        }

        for (const system in systems) {
            this.s(systems[system]);
        }

        // Set up input
        const interaction = this.renderer.plugins.interaction;
        const stage = this.stage;
        this.stage.interactive = true;

        this.input = {
            pointerDown: false,
            get pointerPos() {
                return new Vector(
                    interaction.pointer.global.x / stage.scale.x,
                    interaction.pointer.global.y / stage.scale.y
                );
            }
        };

        this.stage.on("pointerdown", () => {
            this.input.pointerDown = true;
        });

        this.stage.on("pointerup", () => {
            this.input.pointerDown = false;
        });

        this.view.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        // Start firing update events
        this.ticker.add(() => {
            for (let i = 0; i < this.destroyQueue.length; i++) {
                this.destroyQueue[i].destroy();
            }
            this.destroyQueue = [];

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
