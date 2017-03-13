export const animatedsprite = {
    attach() {
        this.sprite = new AnimatedSprite([PIXI.Texture.EMPTY]);
        this.addChild(this.sprite);
    },

    detach() {
        this.removeChild(this.sprite);
        this.sprite.stop();
        this.sprite.destroy();
        delete this.sprite;
    }
};

class AnimatedSprite extends PIXI.extras.AnimatedSprite {
    constructor(textures) {
        super(textures);

        this.animations = {};
        this.currentAnimation = null;

        this.animationQueue = [];
    }

    addAnimation(name, animation) {
        this.animations[name] = animation;
    }

    loopAnimation(name) {
        if (this.currentAnimation == name) return;
        this.currentAnimation = name;

        // TODO: replace 60 w/ app.ticker.FPS
        this.animationSpeed = this.animations[name].speed / 60;

        this.onFrameChange = function() {
            if (this.currentFrame > this.animations[name].end ||
                this.currentFrame < this.animations[name].start
            ) {
                this.gotoAndPlay(this.animations[name].start);
            }
        };

        this.texture = this.textures[this.animations[name].start];
        this.gotoAndPlay(this.animations[name].start);
    }

    // TODO: burn this all to the ground
    playAnimation(name) {
        this.currentAnimation = name;

        // TODO: replace 60 w/ app.ticker.FPS
        this.animationSpeed = this.animations[name].speed / 60;

        this.onFrameChange = function() {
            if (this.animations[name].events) {
                for (const frame in this.animations[name].events) {
                    if (this.currentFrame == frame) {
                        this.parent.fire(this.animations[name].events[frame]);
                    }
                }
            }

            if (this.currentFrame > this.animations[name].end ||
                this.currentFrame < this.animations[name].start
            ) {
                const nextAnimation = this.animationQueue.pop();
                if (nextAnimation) {
                    if (nextAnimation.loop) {
                        this.loopAnimation(nextAnimation.name);
                    } else {
                        this.playAnimation(nextAnimation.name);
                    }
                } else {
                    this.gotoAndStop(this.animations[name].end);
                }
            }
        };

        this.texture = this.textures[this.animations[name].start];
        this.gotoAndPlay(this.animations[name].start);
    }

    queueAnimation(name, loop) {
        this.animationQueue.push({ name: name, loop: loop });
    }
}
