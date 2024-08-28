import BOOGYIConstant from "./BOOGYI.Constant";

export enum TYPE_CARD {
    CARD_SMALL = 0,
    CARD_NORMAL = 1,
    CARD_BIG = 2,
};

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseCard extends cc.Component {
    @property(cc.Sprite)
    imgFront: cc.Sprite = null;

    @property(cc.Sprite)
    imgHighLight: cc.Sprite = null;

    idxCard = -1;

    public S = 0;
    public N = 0;

    private _isClicked = false;

    onLoad() {
        this._onTouch();
    }

    enableTouch() {
        this._onTouch();
    }

    onDestroy() {
        this._offTouch();
    }

    disableTouch() {
        this._offTouch();
    }


    private _onTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _offTouch() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _onTouchBegin(event) {
        return;
    }

    private _onTouchMoved(event) {
        return;
    }

    private _onTouchEnd(event) {
        return;
    }

    public setTextureWithCode(idxCard) {
        this.idxCard = idxCard;
        this.imgFront.spriteFrame = BOOGYIConstant.CardLogic.getTextureWithCode(idxCard);
    }

    public getIdx() {
        return this.idxCard;
    }

    public getRank() {
        return this.N;
    }

    public setClicked(isClick: boolean) {
        this._isClicked = isClick;
    }

    public getClicked() {
        return this._isClicked;
    }

    public getCardIndex() {
        return this.idxCard;
    }
}