export default class Scene {
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
