import Vector from "../vector";

// TODO: object pool for particles
// TODO: access emitter velocity from particle constructor

export const particles = {
    require: ["emitter"],

    update(dt) {
        for (const e of this.entities) {
            if (e.emitting) {
                e.emitTimer -= this.app.ticker.elapsedMS;

                if (e.emitTimer <= 0) {
                    e.emitTimer = e.emitOptions.period || 50;

                    const particle = new Particle(this.app, e.emitOptions);

                    // TODO: Find a way to this to constructor
                    particle.position.set(
                        e.x + (((Math.random() - 0.5) * e.emitOptions.area) || 0),
                        e.y + (((Math.random() - 0.5) * e.emitOptions.area) || 0)
                    );
                }
            }
        }

        for (const particle of this.app.stage.particles.children) {
            particle.process(dt);
        }
    }
};

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
        this.velocity = options.velocity ? options.velocity.copy() : new Vector();

        // Calculate randomness for starting properties
        if (options.scaleRandom)
            this.scale.set(this.scale + ((Math.random() - 0.5) * options.scaleRandom));
        if (options.rotationRandom)
            this.rotation += (Math.random() - 0.5) * options.rotationRandom;
        if (options.velocityRandom)
            this.velocity.add(new Vector(
                (Math.random() - 0.5) * options.velocityRandom.x,
                (Math.random() - 0.5) * options.velocityRandom.y
            ));

        // Set ending properties
        this.endScale = options.endScale || this.scale.x;
        this.endRotation = options.endRotation || this.rotation;

        // Calculate randomness for ending properties
        if (options.endScaleRandom)
            this.endScale += (Math.random() - 0.5) * options.endScaleRandom;
        if (options.endRotationRandom)
            this.endRotation += (Math.random() - 0.5) * options.endRotationRandom;

        // Set/calculate property deltas
        this.scaleDelta = options.scaleDelta || (this.endScale - this.scale.x) / this.lifetime * app.ticker.elapsedMS;
        this.rotationDelta = options.rotationDelta || (this.endRotation - this.rotation) / this.lifetime * app.ticker.elapsedMS;
    }

    process(dt) {
        // Update properties each frame
        this.scale.x += this.scaleDelta * dt;
        this.scale.y += this.scaleDelta * dt;

        this.rotation += this.rotationDelta * dt;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        this.life -= this.app.ticker.elapsedMS;

        if (this.life <= 0 || this.scale.x <= 0 || this.alpha <= 0) {
            this.destroy();
        }
    }
}
