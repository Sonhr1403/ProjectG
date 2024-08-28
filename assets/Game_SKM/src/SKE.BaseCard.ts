import SKMConstant from "./SKE.Constant";
import SKEController from "./SKE.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseCard extends cc.Component {
    public idxCard = -1;

    @property(cc.Sprite)
    public spCard: cc.Sprite = null;

    @property(cc.Sprite)
    public imgHighLight: cc.Sprite = null;

    @property(cc.SpriteFrame)
    public plistSpriteFrame: cc.SpriteFrame = null;

    onLoad() {
        this.enableTouch();
    }

    onDestroy() {
        this.disableTouch();
    }

    enableTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    disableTouch() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    public setTextureWithCode(idxCard: number) {
        this.idxCard = idxCard;
        let cardName = SKMConstant.CardLogic.getNameCard(idxCard);
        this.spCard.spriteFrame = SKEController.instance.spriteAtlasCards.getSpriteFrame(cardName);
    }

    public setTextureCardBack() {
        this.spCard.spriteFrame = SKEController.instance.spriteAtlasCards.getSpriteFrame("card_back");
    }

    private _onTouchMoved(event) {
        return true;
    }

    private _onTouchBegin(event) {
        return true;
    }

    private _onTouchEnd(event) {
        return true;
    }
}