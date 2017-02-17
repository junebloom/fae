(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fae"] = factory();
	else
		root["fae"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector {
    constructor(x = 0, y = 0) {
        if (typeof x == "object") {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    // Getter properties
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get normalized() {
        return this.copy().normalize();
    }

    // Arithmetic
    plus(v) {
        return this.copy().add(v);
    }

    minus(v) {
        return this.copy().subtract(v);
    }

    times(n) {
        return this.copy().multiply(n);
    }

    divided(n) {
        return this.copy().divide(n);
    }

    // Assignment Arithmetic
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    divide(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    // Manipulation
    copy() {
        return new Vector(this.x, this.y);
    }

    set(x, y) {
        if (y === undefined) y = x;
        this.x = x;
        this.y = y;
        return this;
    }

    normalize() {
        let l = this.length;
        if (l > 0) {
            this.x /= l;
            this.y /= l;
        }
        return this;
    }

    truncate(n) {
        let s = n / this.length;
        if (s < 1) {
            this.x *= s;
            this.y *= s;
        }
        return this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mixinEventListener;
function mixinEventListener(object) {
    object.callbacks = {};

    const methods = {
        bind(eventName, callback) {
            if (!this.callbacks[eventName]) this.callbacks[eventName] = [];

            return this.callbacks[eventName].push(callback) - 1;
        },

        once(eventName, callback) {
            const id = this.bind(eventName, callback);

            this.bind(eventName, () => { this.unbind(eventName, [id, id + 1]); }, this);

            return id;
        },

        unbind(eventName, id) {
            if (this.callbacks[eventName]) {
                if (id === undefined) {
                    this.callbacks[eventName] = undefined;
                }
                else if (typeof id == "number") {
                    this.callbacks[eventName][id] = undefined;
                }
                else for (const i of id) {
                    this.callbacks[eventName][i] = undefined;
                }
            }
        },

        fire(eventName, data) {
            if (this.callbacks[eventName]) {
                for (const callback of this.callbacks[eventName]) {
                    if (callback) callback.call(this, data);
                }
            }
        }
    };

    for (const key in methods) {
        object[key] = methods[key].bind(object);
    }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__application__["a"]; });



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const animatedsprite = {
    attach() {
        // TODO: placeholder sprite?
        this.as = new AnimatedSprite([this.app.resources.mage.array[0]]);
        this.addChild(this.as);
    },

    remove() {
        this.removeChild(this.as);
        this.as.destroy();
        delete this.as;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = animatedsprite;


class AnimatedSprite extends PIXI.extras.AnimatedSprite {
    constructor(textures) {
        super(textures);

        this.animations = {};
        this.currentAnimation = null;
    }

    addAnimation(name, animation) {
        this.animations[name] = animation;
    }

    playAnimation(name) {
        if (this.currentAnimation == name) return;
        this.currentAnimation = name;

        this.onFrameChange = function() {
            // TODO: replace 60 w/ app.ticker.FPS
            this.animationSpeed = this.animations[name].speed / 60;

            if (this.currentFrame > this.animations[name].end ||
                this.currentFrame < this.animations[name].start
            ) { this.gotoAndPlay(this.animations[name].start); }
        };

        this.play();
    }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


const collision = {
    w: 0,
    h: 0,
    r: null,
    sleeping: false,
    drawCollider: false,

    get left() {    return this.x - this.w * this.cAnchor.x; },
    get right() {   return this.left + this.w; },
    get top() {     return this.y - this.h * this.cAnchor.y; },
    get bottom() {  return this.top + this.h; },

    attach() {
        this.cAnchor = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    },

    remove() {
        delete this.cAnchor;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = collision;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const emitter = {
    emitting: true,
    emitTimer: 0,

    attach() {
        this.emitOptions = {};
    },

    remove() {
        delete this.emitOptions;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = emitter;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__motion__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "motion", function() { return __WEBPACK_IMPORTED_MODULE_0__motion__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__steering__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "steering", function() { return __WEBPACK_IMPORTED_MODULE_1__steering__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__collision__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "collision", function() { return __WEBPACK_IMPORTED_MODULE_2__collision__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sprite__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sprite", function() { return __WEBPACK_IMPORTED_MODULE_3__sprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__animatedsprite__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "animatedsprite", function() { return __WEBPACK_IMPORTED_MODULE_4__animatedsprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__emitter__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "emitter", function() { return __WEBPACK_IMPORTED_MODULE_5__emitter__["a"]; });










/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


const motion = {
    attach() {
        this.velocity = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    },

    remove() {
        delete this.velocity;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = motion;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const sprite = {
    attach() {
        // TODO: placeholder sprite?
        this.sprite = new PIXI.Sprite(this.app.resources.mage.array[0]);
        this.addChild(this.sprite);
    },

    remove() {
        this.removeChild(this.sprite);
        this.sprite.destroy();
        delete this.sprite;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = sprite;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


const steering = {
    require: ["motion"],

    moveSpeed: 5,
    turnSpeed: 1,

    steer: true,
    chaseVec: null,
    avoidVecs: [],

    attach() {
        this.desiredVelocity = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    },

    remove() {
        delete this.desiredVelocity;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = steering;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__system__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scene__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__systems__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__event_listener__ = __webpack_require__(1);











class Application extends PIXI.Application {
    constructor(width, height, options, noWebGL) {
        super(width, height, options, noWebGL);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__event_listener__["a" /* default */])(this);

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
        for (const component in __WEBPACK_IMPORTED_MODULE_5__components__) {
            this.c(component, __WEBPACK_IMPORTED_MODULE_5__components__[component]);
        }

        for (const system in __WEBPACK_IMPORTED_MODULE_6__systems__) {
            this.s(__WEBPACK_IMPORTED_MODULE_6__systems__[system]);
        }

        // Set up input
        const interaction = this.renderer.plugins.interaction;
        const stage = this.stage;
        this.stage.interactive = true;

        this.input = {
            pointerDown: false,
            get pointerPos() {
                return new __WEBPACK_IMPORTED_MODULE_4__vector__["a" /* default */](
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
        return new __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */](this, options);
    }

    c(name, options) {
        new __WEBPACK_IMPORTED_MODULE_1__component__["a" /* default */](this, name, options);
    }

    s(options) {
        new __WEBPACK_IMPORTED_MODULE_2__system__["a" /* default */](this, options);
    }

    // Scene wrapper
    scene(name, options) {
        if (options) new __WEBPACK_IMPORTED_MODULE_3__scene__["a" /* default */](this, name, options);
        else __WEBPACK_IMPORTED_MODULE_3__scene__["a" /* default */].set(this, name);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Application;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Component {
    constructor(app, name, component) {
        this.app = app;
        this.name = name;
        app.components[name] = this;

        this.require = component.require;
        this.attach = component.attach;
        this.remove = component.remove;

        delete component.require;
        delete component.attach;
        delete component.remove;

        this.members = component;
    }

    attachTo(entity) {
        if (this.require)
        for (let req of this.require) {
            this.app.components[req].attachTo(this);
        }

        this.attach.call(entity);

        Object.defineProperties(entity, Object.getOwnPropertyDescriptors(this.members));
    }

    removeFrom(entity) {
        this.remove.call(entity);

        for (const member in this.members) delete entity[member];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Component;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__event_listener__ = __webpack_require__(1);



let entityUID = 0;

class Entity extends PIXI.Container {
    constructor(app, entity) {
        super();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__event_listener__["a" /* default */])(this);

        this.app = app;
        this.index = app.entities.push(this) - 1;
        this.id = entityUID;
        entityUID++;

        this.components = entity.components;
        for (const componentName of entity.components) {
            this.attach(componentName);
        }

        for (const event in entity) {
            if (event == "components" || event == "parent") continue;
            this.bind(event, entity[event]);
        }

        if (entity.parent) entity.parent.addChild(this);

        this.alive = true;
        this.fire("ready");

        // TODO: fire global entityCreated event
    }

    // Free internal references
    destroy(options) {
        this.app.entities.splice(this.index, 1);
        for (let i = this.index; i < this.app.entities.length; i++) {
            this.app.entities[i].index -= 1;
        }

        super.destroy(options);

        this.fire("destroyed");

        // TODO: fire global entityDestroyed event
    }

    queueDestroy() {
        if (this.alive) {
            this.app.destroyQueue.push(this);
            this.alive = false;
        }
    }

    // Return a particular entity
    static get(id) {
        for (const entity of this.app.entities) {
            if (entity.id === id) return entity;
        }
    }

    // Vector position
    get position() { return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](super.position); }
    set position(v) { super.position.set(v.x, v.y); }

    // Components
    attach(componentName) {
        const component = this.app.components[componentName];
        if (!component) throw new Error("'" + componentName + "' is not a valid component name");

        component.attachTo(this);

        this.components[componentName] = true;

        this.fire("attachedComponent", componentName);
    }

    remove(componentName) {
        const component = this.app.components[componentName];
        if (!component) throw new Error("'" + componentName + "' is not a valid component name");

        component.removeFrom(this);

        this.components[componentName] = undefined;

        this.fire("removedComponent", { name: componentName });
    }

    has(componentName) {
        if (this.components[componentName]) return true;
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Entity;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Scene {
    constructor(app, name, scene) {
        this.app = app;
        app.scenes[name] = this;

        this.enter = scene.enter;
        this.exit = scene.exit;
    }

    static set(app, name) {
        // TODO: Fire some events
        // TODO: Delete entities, unbind event listeners, etc.
        if (app.currentScene) app.scenes[app.currentScene].exit();

        // Load new scene
        app.currentScene = name;
        app.scenes[name].enter();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Scene;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_listener__ = __webpack_require__(1);


class System {
    constructor(app, system) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__event_listener__["a" /* default */])(this);

        this.app = app;
        app.systems.push(this);

        this.require = system.require;

        for (const event in system) {
            if (event == "require") continue;
            this.bind(event, system[event]);
        }

        this.fire("ready");
    }

    // TODO: Optimize this?
    // Maybe set when entities are added or removed from the app,
    // instead of being a getter
    get entities() {
        return this.app.entities.filter((entity) => {
            for (const componentName of this.require) {
                if (entity.has(componentName)) return true;
            }
            return false;
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = System;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const collision = {
    require: ["collision"],

    update() {
        // Check e against every other collidable entity
        const entities = this.entities;
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];

            // Draw debug rects
            if (e.drawCollider) {
                this.app.stage.graph
                .lineStyle(0.25, 0xff0000)
                .beginFill(0xff0000, 0.1);

                if (e.r) this.app.stage.graph.drawCircle(e.x, e.y, e.r);
                else this.app.stage.graph.drawRect(e.left, e.top, e.w, e.h);

                this.app.stage.graph.endFill();
            }

            for (let j = 0; j < entities.length; j++) {
                if (i == j) continue;
                if (e.sleeping) continue;

                const other = entities[j];

                let hit;

                // if both aabb (no radius)
                if (!e.r && !other.r) {
                    hit = testAABB(e, other);
                }

                // circle and aabb
                else if (e.r && !other.r) {
                    hit = testCircleAABB(e, other);
                }

                // aabb and circle
                else if (!e.r && other.r) {
                    hit = testCircleAABB(other, e);
                }

                // both circle
                else if (e.r && other.r) {
                    hit = testCircle(e, other);
                }

                if (hit) e.fire("collided", other);
            }
        }
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = collision;


function testAABB(a, b) {
    if (a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    ) {
        return true;
    }

    return false;
}

function testCircleAABB(circle, aabb) {
    const p = circle.position.copy();

    if (p.x < aabb.left)    p.x = aabb.left;
    if (p.x > aabb.right)   p.x = aabb.right;
    if (p.y < aabb.top)     p.y = aabb.top;
    if (p.y > aabb.bottom)  p.y = aabb.bottom;

    if (p.minus(circle.position).length < circle.r) return true;

    return false;
}

function testCircle(a, b) {
    if (a.position.minus(b.position).length < a.r + b.r) return true;

    return false;
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__steering__ = __webpack_require__(19);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "steering", function() { return __WEBPACK_IMPORTED_MODULE_0__steering__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__physics__ = __webpack_require__(18);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "physics", function() { return __WEBPACK_IMPORTED_MODULE_1__physics__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__collision__ = __webpack_require__(15);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "collision", function() { return __WEBPACK_IMPORTED_MODULE_2__collision__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__particles__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "particles", function() { return __WEBPACK_IMPORTED_MODULE_3__particles__["a"]; });






/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);


// TODO: object pool for particles
// TODO: access emitter velocity from particle constructor

const particles = {
    require: ["emitter"],

    update(dt) {
        for (const e of this.entities) {
            if (e.emitting) {
                e.emitTimer -= this.app.ticker.elapsedMS;

                if (e.emitTimer <= 0) {
                    e.emitTimer = e.emitOptions.period || 50;

                    const particle = new Particle(this.app, e.emitOptions);

                    // TODO: Find a way to this to constructor
                    const globalPos = e.toGlobal(this.app.stage.position);
                    particle.position.set(
                        globalPos.x / this.app.stage.scale.x + (((Math.random() - 0.5) * e.emitOptions.area) || 0),
                        globalPos.y / this.app.stage.scale.y + (((Math.random() - 0.5) * e.emitOptions.area) || 0)
                    );
                }
            }
        }

        for (const particle of this.app.stage.particles.children) {
            particle.process(dt);
        }
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = particles;


const defaultTexture = new PIXI.Graphics()
.beginFill(0xff4411)
.drawRect(0,0,1,1)
.endFill()
.generateCanvasTexture(PIXI.SCALE_MODES.LINEAR);

class Particle extends PIXI.Sprite {
    constructor(app, options) {
        super(options.texture || defaultTexture);
        app.stage.particles.addChild(this);
        this.app = app;
        this.anchor.set(0.5);

        this.lifetime = options.lifetime || 300;
        this.life = this.lifetime;

        // Set starting properties
        this.scale.set(options.scale || 1);
        this.rotation = options.rotation || 0;
        this.alpha = options.alpha || 1;
        this.velocity = options.velocity ? options.velocity.copy() : new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();

        // Calculate randomness for starting properties
        if (options.scaleRandom)
            this.scale.set(this.scale + ((Math.random() - 0.5) * options.scaleRandom));
        if (options.rotationRandom)
            this.rotation += (Math.random() - 0.5) * options.rotationRandom;
        if (options.alphaRandom)
            this.alpha += (Math.random() - 0.5) * options.alphaRandom;
        if (options.velocityRandom)
            this.velocity.add(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](
                (Math.random() - 0.5) * options.velocityRandom.x,
                (Math.random() - 0.5) * options.velocityRandom.y
            ));

        // Set ending properties
        this.endScale = options.endScale || this.scale.x;
        this.endRotation = options.endRotation || this.rotation;
        this.endAlpha = options.endAlpha || this.alpha;

        // Calculate randomness for ending properties
        if (options.endScaleRandom)
            this.endScale += (Math.random() - 0.5) * options.endScaleRandom;
        if (options.endRotationRandom)
            this.endRotation += (Math.random() - 0.5) * options.endRotationRandom;
        if (options.endAlphaRandom)
            this.endAlpha += (Math.random() - 0.5) * options.endAlphaRandom;

        // Set/calculate property deltas
        this.scaleDelta = options.scaleDelta || (this.endScale - this.scale.x) / this.lifetime * (1000/60);
        this.rotationDelta = options.rotationDelta || (this.endRotation - this.rotation) / this.lifetime * (1000/60);
        this.alphaDelta = options.alphaDelta || (this.endAlpha - this.alpha) / this.lifetime * (1000/60);
    }

    process(dt) {
        // Update properties each frame
        this.scale.x += this.scaleDelta * dt;
        this.scale.y += this.scaleDelta * dt;

        this.rotation += this.rotationDelta * dt;

        this.alpha += this.alphaDelta * dt;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        this.life -= this.app.ticker.elapsedMS;

        if (this.life <= 0 || this.scale.x <= 0 || this.alpha <= 0) {
            this.destroy();
        }
    }
}


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const physics = {
    require: ["motion"],

    update(dt) {
        for (const e of this.entities) {
            // Integrate velocity with position
            e.position = e.position.add(e.velocity.times(dt));
        }
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = physics;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const steering = {
    require: ["steering"],

    update(dt) {
        for (const e of this.entities) {
            if (e.steer) {
                const desired = e.desiredVelocity;

                // Apply chase velocity
                if (e.chaseVec) desired.add(e.chaseVec.minus(e.position));

                // Apply avoid velocities
                // TODO: multipliers for each avoid vec
                for (const avoidVec of e.avoidVecs) {
                    // Scale diff by inverse square of distance and add to desired
                    const diff = e.position.minus(avoidVec);
                    desired.add(diff.multiply(1 / Math.pow(diff.length, 2)));
                }

                // Calculate steering force
                const sforce = desired.minus(e.velocity).truncate(e.turnSpeed);

                // Integrate steering force with current velocity
                e.velocity.add(sforce).truncate(e.moveSpeed);
                desired.set(0);
            }
        }
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = steering;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(2);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Application", function() { return __WEBPACK_IMPORTED_MODULE_0__core__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Vector", function() { return __WEBPACK_IMPORTED_MODULE_1__vector__["a"]; });





/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map