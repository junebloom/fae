export const sprite = {
    attach() {
        // TODO: placeholder sprite?
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.addChild(this.sprite);
    },

    remove() {
        this.removeChild(this.sprite);
        this.sprite.destroy();
        delete this.sprite;
    }
};
