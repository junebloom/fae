export const sprite = {
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
