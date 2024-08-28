
const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    spr = null;
    posY = 0;
    offsetY = 20;
    isSelected = false;
    callback = null;
    index = null;

    onLoad() {
        this.spr = this.node.getComponent(cc.Sprite);
        this.posY = this.node.y;
    }

    onSelect() {
        this.node.y += this.isSelected ? -this.offsetY : this.offsetY;
        this.isSelected = !this.isSelected;
        if (this.isSelected && this.callback) {
            this.callback(this.index);
        }

    }

    getCardIndex() {
        return this.index;
    }

    select() {
        this.node.y = this.posY + this.offsetY;
        this.isSelected = true;
    }

    deSelect() {
        this.node.y = this.posY;
        this.isSelected = false;
    }
}
