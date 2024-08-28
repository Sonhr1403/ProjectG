import DragonTiger_Card from "./DragonTiger.Card";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";

const { ccclass, property } = cc._decorator;
const posCardDragon = cc.v2(-80, 140)
const posCardTiger = cc.v2(80, 140)


@ccclass
export default class DragonTiger_CardManager extends cc.Component {

    @property(cc.SpriteAtlas)
    spfCards: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    prfCard: cc.Prefab = null;

    @property(cc.Node)
    cardTiger: cc.Node = null;
    @property(cc.Node)
    cardDragon: cc.Node = null;

    @property(cc.Label)
    lb_dragon: cc.Label = null;
    @property(cc.Label)
    lb_tiger: cc.Label = null;

    private _data: any = null;


    onLoad() {
        // this.hideAllAnim();
    }

    setData(d: any) {
        this._data = d;
    }

    getData() {
        return this._data;
    }

    cardReconnect(res) {
        this.setData(res)

        for (let i = 0; i < this._data.listCardDragon.length; i++) {
            let idCard = this._data.listCardDragon[i]
            let nameC = 'card_' + i
            this.cardDragon.getChildByName(nameC).getComponent(DragonTiger_Card).setCardBack()
            this.cardDragon.getChildByName(nameC).active = true;
            this.cardDragon.getChildByName(nameC).getComponent(DragonTiger_Card).setId(idCard);
        }

        for (let i = 0; i < this._data.listCardTiger.length; i++) {
            let idCard = this._data.listCardTiger[i]
            let nameC = 'card_' + i
            this.cardTiger.getChildByName(nameC).getComponent(DragonTiger_Card).setCardBack()
            this.cardTiger.getChildByName(nameC).active = true;
            this.cardTiger.getChildByName(nameC).getComponent(DragonTiger_Card).setId(idCard);
        }
    }

    startDealCard() {
        this.dealCardDragon1(() => {
            this.dealCardTiger1(() => {
                this.dealCardDragon2(() => {
                    this.dealCardTiger2()
                })
            })
        })
    }

    continueDealCard() {
        if (this._data.listCardDragon.length === 3) {
            this.dealCardDragon3(() => {
                this.openShowCardDragon(2, 2);
                if (this._data.listCardTiger.length === 3) {
                    this.dealCardTiger3(() => {
                        this.openShowCardTiger(2, 2);
                    })
                }
            })
        }
        else {
            if (this._data.listCardTiger.length === 3) {
                this.dealCardTiger3(() => {
                    this.openShowCardTiger(2, 2);
                })
            }
        }
    }

    private _actionMoveCard(posFrom, posTo, idxCard, callback: Function) {
        let card: cc.Node = this.addCard(idxCard);
        card.scale = 0
        card.opacity = 0;
        card.x = posFrom.x;
        card.y = posFrom.y

        let scale = cc.scaleTo(0.2, 1);
        let fadeTo = cc.fadeTo(0.2, 255)
        let moveTo = cc.moveTo(0.2, cc.v2(posTo.x, posTo.y));

        card.stopAllActions();
        card.runAction(cc.sequence(cc.spawn(scale, fadeTo, moveTo), cc.callFunc(() => {
            DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.DEALCARDS);
            card.removeFromParent();
            callback && callback();
        })));
    }

    dealCardDragon1(callback: Function = null) {
        let idxCard = this.getData().listCardDragon[0];
        this.scheduleOnce(() => {
            this._actionMoveCard(posCardDragon, this.cardDragon.getPosition(), idxCard, () => {
                this.unscheduleAllCallbacks();
                this.cardDragon.getChildByName("card_0").getComponent(DragonTiger_Card).setCardBack()
                this.cardDragon.getChildByName("card_0").active = true;
                this.cardDragon.getChildByName("card_0").getComponent(DragonTiger_Card).setId(idxCard);
                callback && callback();
            });
        })
    }

    dealCardDragon2(callback: Function = null) {
        let idxCard = this.getData().listCardDragon[1];
        this.scheduleOnce(() => {
            this._actionMoveCard(posCardDragon, this.cardDragon.getPosition(), idxCard, () => {
                this.unscheduleAllCallbacks();
                this.cardDragon.getChildByName("card_1").getComponent(DragonTiger_Card).setCardBack()
                this.cardDragon.getChildByName("card_1").active = true;
                this.cardDragon.getChildByName("card_1").getComponent(DragonTiger_Card).setId(idxCard);
                callback && callback();

            });
        }, 0.2)
    }

    dealCardDragon3(callback: Function = null) {
        let idxCard = this.getData().listCardDragon[2];
        this.scheduleOnce(() => {
            this._actionMoveCard(posCardDragon, this.cardDragon.getPosition(), idxCard, () => {
                this.unscheduleAllCallbacks();
                this.cardDragon.getChildByName("card_2").getComponent(DragonTiger_Card).setCardBack()
                this.cardDragon.getChildByName("card_2").active = true;
                this.cardDragon.getChildByName("card_2").getComponent(DragonTiger_Card).setId(idxCard);
                callback && callback();
            });
        }, 2)
    }

    dealCardTiger1(callback: Function = null) {
        let idxCard = this.getData().listCardTiger[0];
        this.scheduleOnce(() => {
            this._actionMoveCard(posCardTiger, this.cardTiger.getPosition(), idxCard, () => {
                this.unscheduleAllCallbacks();
                this.cardTiger.getChildByName("card_0").getComponent(DragonTiger_Card).setCardBack()
                this.cardTiger.getChildByName("card_0").active = true;
                this.cardTiger.getChildByName("card_0").getComponent(DragonTiger_Card).setId(idxCard);
                callback && callback();
            });
        }, 0.2)
    }

    dealCardTiger2(callback: Function = null) {
        let idxCard = this.getData().listCardTiger[1];
        this.scheduleOnce(() => {
            this._actionMoveCard(posCardTiger, this.cardTiger.getPosition(), idxCard, () => {
                this.unscheduleAllCallbacks();
                this.cardTiger.getChildByName("card_1").getComponent(DragonTiger_Card).setCardBack()
                this.cardTiger.getChildByName("card_1").active = true;
                this.cardTiger.getChildByName("card_1").getComponent(DragonTiger_Card).setId(idxCard);
                callback && callback();
            });
        }, 0.2)
    }

    dealCardTiger3(callback: Function = null) {
        let idxCard = this.getData().listCardTiger[2];
        this.scheduleOnce(() => {
            this._actionMoveCard(posCardTiger, this.cardTiger.getPosition(), idxCard, () => {
                this.unscheduleAllCallbacks();
                this.cardTiger.getChildByName("card_2").getComponent(DragonTiger_Card).setCardBack()
                this.cardTiger.getChildByName("card_2").active = true;
                this.cardTiger.getChildByName("card_2").getComponent(DragonTiger_Card).setId(idxCard);
                callback && callback();
            });
        }, 2)
    }

    updateCardDragon() {
        for (let i = 0; i < 2; i++) {
            let idCard = this._data.listCardDragon[i]
            let nameC = 'card_' + i
            this.cardDragon.getChildByName(nameC).getComponent(DragonTiger_Card).setId(idCard);
        }
    }

    updateCardTiger() {
        for (let i = 0; i < 2; i++) {
            let idCard = this._data.listCardTiger[i]
            let nameC = 'card_' + i
            this.cardTiger.getChildByName(nameC).getComponent(DragonTiger_Card).setId(idCard);
        }
    }

    openShowCardDragon(vt1, vt2) { // vt1: lá bắt đầu, vt2: lá kết thúc
        for (let i = vt1; i <= Math.min(vt2, this._data.listCardDragon.length - 1); i++) {
            let cardD = this.cardDragon.children[i];

            if (cardD.active)
                this.showCard(cardD, 0.1 * (i - vt1))
        }

        cc.tween(this.node)
            .delay(0.2)
            .call(() => {
                this.showPoint(this.cardDragon)
            })
            .start()
    }

    openShowCardTiger(vt1, vt2) { // vt1: lá bắt đầu, vt2: lá kết thúc
        for (let i = vt1; i <= Math.min(vt2, this._data.listCardTiger.length - 1); i++) {
            let cardT = this.cardTiger.children[i];

            if (cardT.active)
                this.showCard(cardT, 0.1 * (i - vt1))
        }

        cc.tween(this.node)
            .delay(0.2)
            .call(() => {
                this.showPoint(this.cardTiger)
            })
            .start()
    }

    showPoint(nCard) {
        if (!nCard.getChildByName("card_0").active || !nCard.getChildByName("card_1").active) return;
        let point1 = nCard.getChildByName("card_0").getComponent(DragonTiger_Card).pointNumber();
        let point2 = nCard.getChildByName("card_1").getComponent(DragonTiger_Card).pointNumber();

        if (!point1) point1 = 0;
        if (!point2) point2 = 0;
        let total = point1 + point2;

        if (nCard.getChildByName("card_2").active) {
            let point3 = nCard.getChildByName("card_2").getComponent(DragonTiger_Card).pointNumber();
            total += point3;
        }

        if (nCard.name === 'cardDragon') {
            this.onShowPointDragon(total % 10);
        }
        else {
            this.onShowPointTiger(total % 10);
        }

    }

    onShowPointDragon(point: number) {
        this.lb_dragon.node.parent.active = true;
        this.lb_dragon.string = point + ' point'
    }

    onShowPointTiger(point: number) {
        this.lb_tiger.node.parent.active = true;
        this.lb_tiger.string = point + ' point'
    }

    showCard(card, delay) {
        let sk1 = 0;
        let sk2 = 0;
        let index = 1;
        if (index <= 1) {
            sk1 = -15;
            sk2 = 15;
        } else {
            sk1 = 15;
            sk2 = -15;
        }

        let orgPos = card.getPosition()
        card.stopAllActions()

        cc.tween(card)
            .delay(delay)
            .to(0.15, { scaleX: 0, scaleY: 1.05, skewX: 0, skewY: sk1 }, { easing: cc.easing.cubicOut })
            .call(() => {
                card.skewY = sk2
            })
            .to(0.15, { scale: 1.05, skewX: 0, skewY: 0 }, { easing: cc.easing.cubicOut })
            .to(0.15, { scaleX: 0, scaleY: 1.05, skewX: 0, skewY: sk1 }, { easing: cc.easing.cubicOut })
            .call(() => {
                card.getComponent(DragonTiger_Card).setSpriteCard()
                card.skewY = sk2
            })
            .to(0.15, { scale: 1, skewX: 0, skewY: 0 }, { easing: cc.easing.cubicOut })
            .start();

        cc.tween(card)
            .delay(delay)
            .to(0.3, { position: cc.v2(orgPos.x, orgPos.y + 30) }, { easing: cc.easing.cubicOut })
            .to(0.3, { position: orgPos }, { easing: cc.easing.cubicOut })
            .start();
    }

    private addCard(idxCard: number): cc.Node {
        let card = cc.instantiate(this.prfCard);
        card.opacity = 0
        card.scaleY = 0
        card.scaleY = 0
        this.node.addChild(card);
        // let comp = card.getComponent(DragonTiger_Card);
        // comp.setId(idxCard);
        return card;
    }

    cleanUpCard() {
        this._data = null
        for (let i = 0; i < 3; i++) {
            let nameC = 'card_' + i
            this.cardDragon.getChildByName(nameC).getComponent(DragonTiger_Card).setCardBack()
            this.cardDragon.getChildByName(nameC).active = false;
        }

        for (let i = 0; i < 3; i++) {
            let nameC = 'card_' + i
            this.cardTiger.getChildByName(nameC).getComponent(DragonTiger_Card).setCardBack()
            this.cardTiger.getChildByName(nameC).active = false;
        }

        this.lb_dragon.node.parent.active = false;
        this.lb_tiger.node.parent.active = false;
    }
}
