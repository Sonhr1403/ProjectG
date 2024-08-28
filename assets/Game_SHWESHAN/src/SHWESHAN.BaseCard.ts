import SHWESHANConstant from "./SHWESHAN.Constant";
import SHWESHANController from "./SHWESHAN.Controller";

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

    private idxCard = -1;
    public serverId = -1;

    public S = 0;
    public N = 0;
    private cardName = "";
    private _type = TYPE_CARD.CARD_NORMAL;
    private _isClicked = false;
    private _isClickable = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
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


    _onTouchBegin(event) {
        console.log("Card: Touch begin....");

        // if (this._gameScene._isDealingCard || this._gameScene.gameStatus == SHWESHANConst.TablePhase.END_GAME) return false;
        // var point = event.touch.getLocation();
        // point = this.node.convertToNodeSpaceAR(point);


        // var length = this._gameScene.mySlot.getlistCardsSlot().length;
        // for (var i = 0; i < length; i++) {
        //     var card = _this.mySlot.getlistCardsSlot()[i];
        //     if (!card.getClickable()) continue;
        //     if (i < length - 1 && _this.isTouchedCard_notTail(card, tap) ||
        //         i === length - 1 && _this.isTouchedCard_Tail(card, tap)) {
        //         _this.disTouchBegan = cc.size(tap.x - card.getPositionX(),
        //             tap.y - card.getPositionY());
        //         _this.indexCardCurrent = i;
        //         break;
        //     }
        // }




        return true;
    }



    _onTouchMoved(event) {
        return;
    }

    _onTouchEnd(event) {
        var point = event.touch.getLocation();
        // point = this.node.convertToNodeSpaceAR(point);
    }

    deSelect() {
        this.setClicked(false);
        this.node.y = (SHWESHANConstant.Config.PosCardWhenClick);
    }

    select() {
        this.setClicked(true);
        this.node.y = (SHWESHANConstant.Config.PosCardWhenClick + 20);
    }


    setTextureWithCode(code) {
        this.setIdCard(code);
        this.decodeCard();
        this.imgFront.spriteFrame = SHWESHANController.instance.spriteCards[this.serverId];
    }

    getSuitInVietnamese() {
        if (this.S === 1)
            return "t"; //tep
        if (this.S === 2)
            return "r"; //ro
        if (this.S === 3)
            return "c"; //co
        if (this.S === 4)
            return "b"; //bich
        return "-1";
    }

    getIdx() {
        return this.idxCard;
    }

    setIdCard(id: number) {
        this.serverId = id;
        this.idxCard = id;
    }

    convertIDCard(id) {
        let c = 0;
        if (id < 44)
            c = id + 8
        else
            c = id - 44
        return c;
    }

    decodeCard() {
        this.S = this.idxCard % 4 + 1;
        this.N = Math.floor(this.idxCard / 4) + 1;

        if (this.N === 1) {
            this.N = 14;
        }
        if (this.N === 2) {
            this.N = 15;
        }
    }

    setClickable(b: boolean) {
        this._isClickable = b;
        if (b) {
            this.imgFront.node.color = cc.Color.WHITE;
            // this.node.opacity = 255;
        }

        else {
            //this.node.opacity = 180;
            this.imgFront.node.color = cc.Color.GRAY;
        }

    }

    getClickable() {
        return this._isClickable;
    }

    getRank() {
        return this.N;
    }

    getSuit() { /// 1 : bich , 2 : tep , 3 : ro , 4 : co
        return this.S;
    }

    flipCard() {
        this.decodeCard();
        var spriteFrame = SHWESHANController.instance.spriteCards[this.serverId];
        if (!spriteFrame || spriteFrame === undefined) {
            this.idxCard = -1;
            return;
        }

        var scale = this.node.scale;
        var scaleTo = cc.scaleTo(0.4, 0.1, scale);
        var comeBack = cc.scaleTo(0.4, scale, scale);
        var delay = cc.delayTime(0.05);

        this.node.runAction(cc.sequence(scaleTo, delay, cc.spawn(cc.callFunc(function (sender) {
            sender.setSpriteFrame(spriteFrame);
        }, this), comeBack)));
    }

    showCard() {
        this.decodeCard();
        this.imgFront.spriteFrame = SHWESHANController.instance.spriteCards[this.serverId];
    }


    setClicked(b: boolean) {
        this._isClicked = b;
    }

    getClicked() {
        return this._isClicked;
    }


    setTypeCard(type: TYPE_CARD) {
        this._type = type;
        switch (type) {
            case TYPE_CARD.CARD_SMALL:
                this.setScale(0.5);
                break;
            case TYPE_CARD.CARD_NORMAL:
                this.setScale(0.8);
                break;
            case TYPE_CARD.CARD_BIG:
                this.setScale(1);
                break;
        }
    }

    setScale(value: number) {
        this.node.scale = value;
    }

    runEffectDealCard(posTo: cc.Vec2, delayTime: number, timeMove: number, bHiddenWhenFinish: boolean, scale: number) {
        this.node.stopAllActions();
        this.node.active = (true);
        var ac1 = cc.sequence(cc.scaleTo(timeMove * 0.45, scale * 1.1), cc.scaleTo(timeMove * 0.45, scale));
        var ac2 = cc.spawn(ac1, cc.moveTo(timeMove, posTo));
        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            ac2,
            cc.delayTime(0.25),
            cc.callFunc(function () {
                this.active = (!bHiddenWhenFinish);
            }, this)));
    }

    cardToString() {
        var str = "";
        if (this.N == 11)
            str = "J";
        else if (this.N == 12)
            str = "Q";
        else if (this.N == 13)
            str = "K";
        else if (this.N == 14)
            str = "A";
        else if (this.N == 15)
            str = "2";
        else
            str = this.N + "";

        return str + this.getSuitInVietnamese();
    }

    getCardIndex() {
        return this.serverId;
    }

    // update (dt) {}
}

declare global {
    interface Array<T> {
        arrCardEqual(n: Array<BaseCard>): boolean
    }
}

if (!Array.prototype.arrCardEqual) {
    Array.prototype.arrCardEqual = function (arr: BaseCard[]) {
        if (this.length !== arr.length)
            return false;
        for (var i = this.length; i--;) {
            if (this[i].getIdx() !== arr[i].getIdx())
                return false;
        }

        return true;
    };
}