export const animatedsprite = {
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
