export default class InputManager extends PIXI.interaction.InteractionManager {
    constructor(app) {
        super(app.renderer);

        this.app = app;
        this.eventQueue = [];

        this.keyCodes = {};
        this.keys = {};

        app.event.on("preupdate", (dt) => {
            // This is imperfect due to pixi's pointer events being handled
            // in a way that they aren't easily deferred to the queue
            for (const event of this.eventQueue) this.emit(...event);
            this.eventQueue = [];
        });

        app.view.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        app.view.addEventListener("keydown", (event) => {
            if (event.repeat || this.keys[event.key]) return;
            this.eventQueue.push(["keydown", event.key, event.code]);
        });

        document.addEventListener("keyup", (event) => {
            if (!this.keys[event.key]) return;
            this.eventQueue.push(["keyup", event.key, event.code]);
        });

        this.on("keydown", (key, code) => {
            this.keyCodes[code] = 1;
            this.keys[key] = 1;
        });

        this.on("keyup", (key, code) => {
            this.keyCodes[code] = 0;
            this.keys[key] = 0;
        });
    }
}
