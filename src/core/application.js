import * as PIXI from "pixi.js";
import sound from "pixi-sound";
import EventEmitter from "eventemitter3";

import Entity from "./entity";
import System from "./system";
import InputManager from "./input";

import * as components from "../components";
import * as systems from "../systems";

export default class Application extends PIXI.Application {
    constructor(width, height, options, noWebGL) {
        super(width, height, options, noWebGL);
        this.view.setAttribute("tabindex", -1);

        this.event = new EventEmitter();
        this.input = new InputManager(this);
        this.loader = new PIXI.loaders.Loader();
        this.resources = this.loader.resources;

        this.systems = [];
        this.components = {};
        this.scenes = { current: null };
        this.groups = { all: new Set() };

        this.exitingScene = false;
        this.destroyQueue = new Set();

        for (const c in components) this.c(c, components[c]);
        for (const s in systems)    this.s(systems[s]);

        this.ticker.add(() => {
            this.event.emit("preupdate", this.ticker.deltaTime);
            this.event.emit("update", this.ticker.deltaTime);
            this.event.emit("postupdate", this.ticker.deltaTime);
        });

        this.event.on("update", (dt) => {
            for (const system of this.systems)      system.emit("update", dt);
            for (const entity of this.groups.all)   entity.emit("update", dt);
        });

        this.event.on("postupdate", (dt) => {
            for (const entity of this.destroyQueue) entity.destroy();
            this.destroyQueue.clear();
        });
    }

    e(entity) { return new Entity(this, entity); }

    c(name, component) {
        this.components[name] = component;
        this.groups[name] = new Set();
    }

    s(system) { return new System(this, system); }

    scene(name, scene) {
        if (scene) this.scenes[name] = scene;
        else {
            const next = () => {
                this.exitingScene = false;
                for (const entity of this.groups.all) {
                    if (!entity.persistent) entity.queueDestroy();
                }
                // TODO: Also destroy any display objects in stage?

                this.event.once("postupdate", () => {
                    this.scenes.current = this.scenes[name];
                    this.scenes[name].enter();
                    this.event.emit("scenechanged", name);
                });
            };

            this.exitingScene = true;

            const curScene = this.scenes.current;
            if (curScene && curScene.exit) curScene.exit(next);
            else next();
        }
    }

    timeout(time, callback, ...args) {
        let timer = time;

        const ee = this.event;
        function updateTimer(dt) {
            if (timer <= 0) {
                if (typeof callback == "function") callback(...args);
                else ee.emit(callback, ...args);

                ee.removeListener("update", updateTimer);
            }

            timer -= dt / 60 * 1000;
        }

        ee.on("update", updateTimer);
    }
}
