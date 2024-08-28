const { ccclass, property } = cc._decorator;

@ccclass
export default class BCListHistory extends cc.Component {

    @property(cc.SpriteAtlas)
    public spriteAtlasFaces: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    public prfItemHitory: cc.Prefab = null;

    @property(cc.Node)
    public content: cc.Node = null;

    @property(cc.Node)
    public btnArrow: cc.Node = null;

    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    private isShow: boolean = false;

    start() {
        // TODO
    }

    // update (dt) {}
    public renderData(data: Array<Array<number>>) {
        this.content.removeAllChildren();
        let lengthX = data.length;
        this.content.height = 80 * lengthX;
        for (let i = 0; i < lengthX; i++) {
            let item = data[lengthX - i - 1];
            if(item) {
                let itemHistory = cc.instantiate(this.prfItemHitory);
                itemHistory.getChildByName("SpNew").active = (0 == (lengthX - i - 1));
                let nItem = itemHistory.getChildByName("NRessult");
                nItem.children[0].getComponent(cc.Sprite).spriteFrame = this.spriteAtlasFaces.getSpriteFrame("face_" + item[0].toString());
                nItem.children[1].getComponent(cc.Sprite).spriteFrame = this.spriteAtlasFaces.getSpriteFrame("face_" + item[1].toString());
                nItem.children[2].getComponent(cc.Sprite).spriteFrame = this.spriteAtlasFaces.getSpriteFrame("face_" + item[2].toString());
                this.content.addChild(itemHistory);
            }
        }
        this.scrollView.scrollToBottom();
    }

    public onClickToggle(event, data) {
        if (this.isShow) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        if(this.isShow == false) {
            this.isShow = true;
            this.btnArrow.angle = 180;
            cc.tween(this.node).by(0.5, {position: cc.v3(0, -630, 0)}).start();
        }
    }

    public hide() {
        if(this.isShow == true) {
            this.isShow = false;
            this.btnArrow.angle = 0;
            cc.tween(this.node).by(0.5, {position: cc.v3(0, 630, 0)}).start();
        }
    }
}
