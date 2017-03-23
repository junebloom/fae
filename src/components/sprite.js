export const sprite = {
    attach() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.addChild(this.sprite);
    },

    detach() {
        this.removeChild(this.sprite);
        this.sprite.destroy();
        delete this.sprite;
    }
};
