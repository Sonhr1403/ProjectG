const {ccclass, property} = cc._decorator;

@ccclass
export default class SKETeaseChat extends cc.Component {

    @property(cc.Node)
    public content: cc.Node = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasGift: cc.SpriteAtlas = null;

    private readonly arraySpriteAtlas = [
        "skm_gift_balloon",
        "skm_gift_clap",
        "skm_gift_egg",
        "skm_gift_heart",
        "skm_gift_kiss",
        "skm_gift_money",
        "skm_gift_rocket",
        "skm_gift_rose",
        "skm_gift_tnt",
        "skm_gift_tomato",
        "skm_gift_water",
        "skm_gift_wine",
    ];

    private allButtonNode: Array<cc.Node> = [];

    onLoad() {
        this.content.removeAllChildren();
        for (let i = 0; i < this.arraySpriteAtlas.length; i++) {
            let spriteName = this.arraySpriteAtlas[i];
            let spriteFrame = this.spriteAtlasGift.getSpriteFrame(spriteName);
            this.allButtonNode[i] = this.createButton(spriteFrame, i);
            this.content.addChild(this.allButtonNode[i]);
        }
    }

    // start () {

    // }

    // update (dt) {}

    private createButton(spriteFrame: cc.SpriteFrame, customEventData: number): cc.Node {
        let node = new cc.Node();
        node.width = 130;
        node.height = 130;
        node.anchorX = 0.5;
        node.anchorY = 0.5;
        node.ID_GIFT = customEventData;
        node.addComponent(cc.Button);
        let spriteNode = new cc.Node();
        let sprite = spriteNode.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;

        node.addChild(spriteNode);

        spriteNode.setPosition(cc.v2(0, 0));
        spriteNode.anchorX = 0.5;
        spriteNode.anchorY = 0.5;
        
        node.on("click", this.onButtonClick, this);

        return node;
    }

    private onButtonClick(event) {
        // TODO
    }

    public onClickClose() {
        this.node.active = false;
    }
}
