export const text = {
    attach() {
        this.text = new PIXI.Text("");
        this.addChild(this.text);
    },

    remove() {
        this.removeChild(this.text);
        this.text.destroy();
        delete this.text;
    }
};
