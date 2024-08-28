import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import Bacarrat_Card from "./Bacarrat.Card";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import Bacarrat_NanBai from "./Bacarrat.NanBai";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const data_fake = { "__instanceId": 848, "_eventName": "b3", "cardPlayers": [25, 33], "turn": 0, "cardBankers": [50, 20], "winpot": [1], "chipUserOnBoard": [1950], "usersOnboard": ["user08"] };


const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_CardManager extends cc.Component {
    @property(cc.SpriteFrame)
    spfCards: Array<cc.SpriteFrame> = [];

    @property(sp.Skeleton)
    spDealer: sp.Skeleton = null;

    @property(sp.Skeleton)
    listSkeCard: Array<sp.Skeleton> = [];

    @property(cc.Prefab)
    prfCard: cc.Prefab = null;

    @property(cc.Toggle)
    cbNan: cc.Toggle = null;

    private _data: any = data_fake;
    isDealCard: boolean = false
    private _isNanBai: boolean = false
    private _listCard: Array<Bacarrat_Card> = [];

    onLoad() {
        this._isNanBai = false;
        this.isDealCard = false;

        this.hideAllAnim();
    }

    setData(d: any) {
        this._data = d;
    }

    getData() {
        return this._data;
    }


    startDealCard() {
        this.isDealCard = true;
        this._isNanBai = (this.cbNan.isChecked && Bacarrat_GameManager.instance.potOnTableManager.getSideNan() !== -1)

        this.dealCardPlayer1(() => {
            this.dealCardBanker1(() => {
                this.dealCardPlayer2(() => {
                    this.dealCardBanker2(() => {
                        this.openShowCard();
                    })
                })
            });
        });
    }

    addCardPlayer(idCard) {
        this._data.cardPlayers.push(idCard)
    }

    addCardBanker(idCard) {
        this._data.cardBankers.push(idCard)
    }

    setAnimDealer(str: string) {
        this.spDealer.setAnimation(0, str, false);
    }

    private _actionMoveCard(index: number, idxCard: number, callback: Function) {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.DEALCARDS);
        let card: cc.Node = this.addCard(index, idxCard);
        let scale = cc.scaleTo(0.4, .44, .42);
        let fadeTo = cc.fadeTo(0.4, 255)
        let rotateTo = cc.rotateTo(0.4, 0)

        if (index === 4)
            rotateTo = cc.rotateTo(0.4, 90)
        else if (index === 5)
            rotateTo = cc.rotateTo(0.4, -90)

        let moveTo = cc.moveTo(0.4, this.listSkeCard[index].node.getPosition());
        BGUI.ZLog.log(card)
        card.stopAllActions();
        card.runAction(cc.sequence(cc.spawn(scale, fadeTo, rotateTo, moveTo), cc.callFunc(() => {
            this.listSkeCard[index].node.active = !this.isCheckNanBai();
            this.listSkeCard[index].node.zIndex = 99;
            callback && callback();
        })));
    }

    private _actionMoveCardNanBai(index: number, idxCard: number, callback: Function) {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.DEALCARDS);
        let card = this.addCard(index, idxCard);
        let scale = cc.scaleTo(0.4, 1.42, 1.42);
        let fadeTo = cc.fadeTo(0.4, 255)
        let moveTo = cc.moveTo(0.4, cc.v2(0, 0));
        card.runAction(cc.sequence(cc.spawn(scale, fadeTo, moveTo), cc.callFunc(() => {
            Bacarrat_GameManager.instance.showGUINanBai(index, idxCard);
            card.active = false;
            callback && callback();
        })));
    }

    dealCardPlayer1(callback: Function = null) {
        this.setAnimDealer("TakeCard1")
        let idxCard = this.getData().cardPlayers[0];
        this.scheduleOnce(() => {
            this._actionMoveCard(0, idxCard, () => {
                this.unscheduleAllCallbacks();
                this.node.getChildByName("deal_card_0").active = this.isCheckNanBai();
                this.node.getChildByName("deal_card_0").getComponent(Bacarrat_Card).setSpriteCard();
                callback && callback();
            });

        }, 1.4)
    }

    dealCardBanker1(callback: Function = null) {
        this.setAnimDealer("TakeCard2")
        let idxCard = this.getData().cardBankers[0];
        this.scheduleOnce(() => {
            this._actionMoveCard(1, idxCard, () => {
                this.unscheduleAllCallbacks();
                // this.dealCardPlayer2();
                this.node.getChildByName("deal_card_1").active = this.isCheckNanBai();
                this.node.getChildByName("deal_card_1").getComponent(Bacarrat_Card).setSpriteCard();
                callback && callback();
            });

        }, 1.4)
    }

    dealCardPlayer2(callback: Function = null) {
        this.setAnimDealer("TakeCard3")
        let idxCard = this.getData().cardPlayers[1];
        this.scheduleOnce(() => {
            if (this._isNanBai && Bacarrat_GameManager.instance.potOnTableManager.getSideNan() === 0) {
                this._actionMoveCardNanBai(2, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    // this.dealCardBanker2();
                    this.node.getChildByName("deal_card_2").active = false;
                    this.node.getChildByName("deal_card_2").getComponent(Bacarrat_Card).setSpriteCard();
                    callback && callback();
                });
            }
            else {
                this._actionMoveCard(2, idxCard, () => {
                    this.unscheduleAllCallbacks();

                    this.node.getChildByName("deal_card_2").getComponent(Bacarrat_Card).setSpriteCard();

                    if (this.isCheckNanBai()) {
                        this.node.getChildByName("deal_card_2").active = true;
                        this.showPointPlayer(2);
                        // this.dealCardBanker2();
                        callback && callback();
                    }
                    else {
                        // this.dealCardBanker2();

                        this.node.getChildByName("deal_card_2").active = false;
                        callback && callback();
                    }
                });
            }

        }, 1.4)
    }

    dealCardBanker2(callback: Function = null) {
        this.setAnimDealer("TakeCard4")
        let idxCard = this.getData().cardBankers[1];
        this.scheduleOnce(() => {
            if (this._isNanBai && Bacarrat_GameManager.instance.potOnTableManager.getSideNan() === 1) {
                this._actionMoveCardNanBai(3, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    this.node.getChildByName("deal_card_3").active = false;
                    this.node.getChildByName("deal_card_3").getComponent(Bacarrat_Card).setSpriteCard();
                });
            }
            else {
                this._actionMoveCard(3, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    this.node.getChildByName("deal_card_3").getComponent(Bacarrat_Card).setSpriteCard();
                    if (this.isCheckNanBai()) {
                        this.node.getChildByName("deal_card_3").active = true;
                        this.showPointBanker(2);
                    }
                    else {
                        // this.openShowCard();
                        callback && callback();
                        this.node.getChildByName("deal_card_3").active = false;
                    }

                });
            }
        }, 1.4)
    }

    dealCardPlayer3(callback: Function = null) {
        this.isDealCard = true
        this.setAnimDealer("TakeCard5")
        let idxCard = this.getData().cardPlayers[2];
        BGUI.ZLog.log("idxCard---> ", idxCard)
        this.scheduleOnce(() => {
            if (this._isNanBai && Bacarrat_GameManager.instance.potOnTableManager.getSideNan() === 0) {
                this._actionMoveCardNanBai(4, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    //ToDO
                    this.node.getChildByName("deal_card_4").active = false;
                    this.node.getChildByName("deal_card_4").getComponent(Bacarrat_Card).setSpriteCard();
                    callback && callback();
                });
            }
            else {
                this._actionMoveCard(4, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    //ToDO
                    this.node.getChildByName("deal_card_4").getComponent(Bacarrat_Card).setSpriteCard();
                    BGUI.ZLog.log("_dealCardPlayer3---> this.isCheckNanBai() === ", this.isCheckNanBai())
                    if (this.isCheckNanBai()) {
                        this.node.getChildByName("deal_card_4").active = true;
                        this.showPointPlayer(3);
                    }
                    else {
                        this.node.getChildByName("deal_card_4").active = false;
                        callback && callback();
                    }
                });
            }
        }, 1.4)
    }

    dealCardBanker3(callback: Function = null) {
        this.isDealCard = true
        this.setAnimDealer("TakeCard6")
        let idxCard = this.getData().cardBankers[2];
        this.scheduleOnce(() => {
            if (this._isNanBai && Bacarrat_GameManager.instance.potOnTableManager.getSideNan() === 1) {
                this._actionMoveCardNanBai(5, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    //ToDO
                    this.node.getChildByName("deal_card_5").active = false;
                    this.node.getChildByName("deal_card_5").getComponent(Bacarrat_Card).setSpriteCard();
                    callback && callback();
                });
            }
            else {
                this._actionMoveCard(5, idxCard, () => {
                    this.unscheduleAllCallbacks();
                    //ToDO
                    this.node.getChildByName("deal_card_5").getComponent(Bacarrat_Card).setSpriteCard();

                    if (this.isCheckNanBai()) {
                        this.node.getChildByName("deal_card_5").active = true;
                        this.showPointBanker(3);
                    }
                    else {
                        this.node.getChildByName("deal_card_5").active = false;
                        callback && callback();
                    }
                });
            }
        }, 1.4)
    }

    getSkinAnimCard(idx: number) {
        if (!this.node.getChildByName("deal_card_" + idx.toString())) return;
        let animSkeFile = this.node.getChildByName("deal_card_" + idx.toString()).getComponent(Bacarrat_Card).animSkeFile();

        return this.listSkeCard[idx].setSkin(animSkeFile);
    }

    moveCardNanBaiToTable(vtC) {
        let card = this.node.getChildByName("deal_card_" + vtC)
        if (!card) return;
        card.active = true;
        card.getComponent(Bacarrat_Card).setSpriteCard();

        if (vtC === 2) {
            cc.tween(card)
                .to(0.4, {
                    scaleX: .44,
                    scaleY: .42,
                    x: this.listSkeCard[vtC].node.getPosition().x,
                    y: this.listSkeCard[vtC].node.getPosition().y
                })
                .call(() => {
                    this.showPointPlayer(2);
                })
                .start();
        }
        else if (vtC === 3) {
            cc.tween(card)
                .to(0.4, {
                    scaleX: .44,
                    scaleY: .42,
                    x: this.listSkeCard[vtC].node.getPosition().x,
                    y: this.listSkeCard[vtC].node.getPosition().y
                })
                .call(() => {
                    this.showPointBanker(2);
                })
                .start();
        }
        else if (vtC === 4) {
            cc.tween(card)
                .to(0.4, {
                    scaleX: .44,
                    scaleY: .42,
                    x: this.listSkeCard[vtC].node.getPosition().x,
                    y: this.listSkeCard[vtC].node.getPosition().y,
                    angle: -90
                })
                .call(() => {
                    this.showPointPlayer(3);
                })
                .start();
        }
        else if (vtC === 5) {
            cc.tween(card)
                .to(0.4, {
                    scaleX: .44,
                    scaleY: .42,
                    x: this.listSkeCard[vtC].node.getPosition().x,
                    y: this.listSkeCard[vtC].node.getPosition().y,
                    angle: 90
                })
                .call(() => {
                    this.showPointBanker(3);
                })
                .start();
        }
    }

    openShowCardPlayer3(callback: Function = null, activeAnim: boolean = true) {
        this.getSkinAnimCard(4);
        if (!activeAnim) {
            this.listSkeCard[0].node.active = false;
            this.node.getChildByName("deal_card_4").active = true;
            return;
        }
        this.node.getChildByName("deal_card_4").active = false;
        this._playSpine(this.listSkeCard[4].node, "animation", false, () => {
            BGUI.ZLog.log("_openShowCard Player3 === >>")
            this.listSkeCard[4].node.active = false;
            this.node.getChildByName("deal_card_4").active = true;
            this.node.getChildByName("deal_card_4").angle = -90;
            this.showPointPlayer(3);
            callback && callback();
        });
    }

    openShowCardBanker3(callback: Function = null, activeAnim: boolean = true) {
        this.getSkinAnimCard(5);
        if (!activeAnim) {
            this.listSkeCard[0].node.active = false;
            this.node.getChildByName("deal_card_5").active = true;
            return;
        }
        this.node.getChildByName("deal_card_5").active = false;
        this._playSpine(this.listSkeCard[5].node, "animation", false, () => {
            BGUI.ZLog.log("_openShowCard Banker3 === >>")
            this.listSkeCard[5].node.active = false;
            this.node.getChildByName("deal_card_5").active = true;
            this.node.getChildByName("deal_card_5").angle = 90;
            this.showPointBanker(3);
        });
    }


    openShowCardPlayer1(callback: Function = null, activeAnim: boolean = true) {
        this.getSkinAnimCard(0);
        if (!activeAnim) {
            this.listSkeCard[0].node.active = false;
            this.node.getChildByName("deal_card_0").active = true;
            return;
        }
        this.listSkeCard[0].node.active = true;
        this._playSpine(this.listSkeCard[0].node, "animation", false, () => {
            BGUI.ZLog.log("_openShowCard Player 1 === >>")
            this.listSkeCard[0].node.active = false;
            this.node.getChildByName("deal_card_0").active = true;
            callback && callback();
        });
    }

    openShowCardPlayer2(callback: Function = null, activeAnim: boolean = true) {
        this.getSkinAnimCard(2);

        if (!activeAnim) {
            this.listSkeCard[2].node.active = false;
            this.node.getChildByName("deal_card_2").active = true;
            return;
        }
        this.listSkeCard[2].node.active = true;
        this._playSpine(this.listSkeCard[2].node, "animation", false, () => {
            BGUI.ZLog.log("_openShowCard Player 2 === >>")
            this.listSkeCard[2].node.active = false;
            this.node.getChildByName("deal_card_2").active = true;
            this.showPointPlayer(2);
            callback && callback();
        });
    }

    openShowCardBanker1(callback: Function = null, activeAnim: boolean = true) {
        this.getSkinAnimCard(1);
        if (!activeAnim) {
            this.listSkeCard[1].node.active = false;
            this.node.getChildByName("deal_card_1").active = true;
            return;
        }
        this.listSkeCard[1].node.active = true;
        this._playSpine(this.listSkeCard[1].node, "animation", false, () => {
            BGUI.ZLog.log("_openShowCard Banker 1 === >>")
            this.listSkeCard[1].node.active = false;
            this.node.getChildByName("deal_card_1").active = true;


            callback && callback();
        });
    }

    openShowCardBanker2(callback: Function = null, activeAnim: boolean = true) {
        this.getSkinAnimCard(2);
        if (!activeAnim) {
            this.listSkeCard[3].node.active = false;
            this.node.getChildByName("deal_card_3").active = true;
            return;
        }
        this.listSkeCard[3].node.active = true;
        this._playSpine(this.listSkeCard[3].node, "animation", false, () => {
            BGUI.ZLog.log("_openShowCard Player 2 === >>")
            this.listSkeCard[3].node.active = false;
            this.node.getChildByName("deal_card_3").active = true;
            this.showPointBanker(2);
            callback && callback();
        });
    }


    openShowCard() {
        // this.listSkeCard[0].setSkin("Co_2");
        this.getSkinAnimCard(0);

        this._playSpine(this.listSkeCard[0].node, "animation", false, () => {
            this.listSkeCard[0].node.active = false;
            // this.listSkeCard[1].setSkin("Co_2");
            this.getSkinAnimCard(1);
            this.node.getChildByName("deal_card_0").active = true;

            this._playSpine(this.listSkeCard[1].node, "animation", false, () => {
                this.listSkeCard[1].node.active = false;
                // this.listSkeCard[2].setSkin("Co_2");
                this.getSkinAnimCard(2);
                this.node.getChildByName("deal_card_1").active = true;

                this._playSpine(this.listSkeCard[2].node, "animation", false, () => {
                    this.listSkeCard[2].node.active = false;
                    // this.listSkeCard[3].setSkin("Co_2");
                    this.getSkinAnimCard(3);
                    this.node.getChildByName("deal_card_2").active = true;
                    this.showPointPlayer(2);

                    this._playSpine(this.listSkeCard[3].node, "animation", false, () => {
                        this.listSkeCard[3].node.active = false;
                        this.node.getChildByName("deal_card_3").active = true;
                        this.showPointBanker(2);
                    })
                })
            })
        })
    }

    // private showGUINanBai(vtC, idCard) {
    //     let bundle = "bacarrat";
    //     let prfAttendance = "res/prefabs/GUI_NAN_BAI";
    //     BGUI.UIWaitingLayout.hideWaiting();
    //     BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
    //         BGUI.UIWaitingLayout.hideWaiting();
    //         let guiNan = cc.instantiate(prf);
    //         let comp = guiNan.getComponent(Bacarrat_NanBai)
    //         comp.setDataCard(vtC, idCard);
    //         Bacarrat_GameManager.instance.chipManager.node.addChild(guiNan, 999);
    //     })
    // }

    showPointPlayer(numberOfcard: number) {
        if (!this.node.getChildByName("deal_card_0") || !this.node.getChildByName("deal_card_2")) return;
        let point1 = this.node.getChildByName("deal_card_0").getComponent(Bacarrat_Card).pointNumber();
        let point2 = this.node.getChildByName("deal_card_2").getComponent(Bacarrat_Card).pointNumber();

        BGUI.ZLog.log("showPointPlayer-> ", point1)
        BGUI.ZLog.log("showPointPlayer-> ", point2)

        if (!point1) point1 = 0;
        if (!point2) point2 = 0;
        let total = point1 + point2;
        if (numberOfcard > 2) {
            let point3 = this.node.getChildByName("deal_card_4").getComponent(Bacarrat_Card).pointNumber();
            total += point3;
            BGUI.ZLog.log("showPointPlayer total --> ", total)
        }
        Bacarrat_GameManager.instance.onShowPointPlayer(total % 10);
    }

    showPointBanker(numberOfcard: number) {
        if (!this.node.getChildByName("deal_card_1") || !this.node.getChildByName("deal_card_3")) return;
        let point1 = this.node.getChildByName("deal_card_1").getComponent(Bacarrat_Card).pointNumber();
        let point2 = this.node.getChildByName("deal_card_3").getComponent(Bacarrat_Card).pointNumber();
        BGUI.ZLog.log("showPointBanker-> ", point1)
        BGUI.ZLog.log("showPointPlayer-> ", point2)
        if (!point1) point1 = 0;
        if (!point2) point2 = 0;
        let total = point1 + point2;
        if (numberOfcard > 2) {
            let point3 = this.node.getChildByName("deal_card_5").getComponent(Bacarrat_Card).pointNumber();
            total += point3;
            BGUI.ZLog.log("showPointBanker total -->", total)
        }
        Bacarrat_GameManager.instance.onShowPointBanker(total % 10);
    }

    // private _dealCardPlayerAndBanker() {
    //     this._dealCardPlayer3(() => {
    //         this._dealCardBanker3(() => {
    //             this._openShowCardPlayer3(() => {
    //                 this._openShowCardBanker3();
    //             });
    //         });
    //     })
    // }


    showCardNotAnim(numOfCard: number, activeCard: boolean) {
        // BGUI.ZLog.log("-----------showAllCardNotAnim------->", this.getData());
        // this._listCard.forEach((card: Bacarrat_Card, idx) => {
        //     BGUI.ZLog.log(card.name);

        // })
        for (let i = 0; i < numOfCard; i++) {
            let card = this.node.getChildByName("deal_card_" + i);
            if (card) {
                card.active = true;
                card.setPosition(this.listSkeCard[i].node.getPosition());
            } else {
                let node = cc.instantiate(this.prfCard);
                node.name = "deal_card_" + i;
                node.scaleX = 0.44;
                node.scaleY = 0.42;
                node.active = activeCard;
                node.setPosition(this.listSkeCard[i].node.getPosition());
                this.node.addChild(node, -1);
                let angle = 0;
                if (i === 4)
                    angle = 90;
                else if (i === 5)
                    angle = -90;

                let comp = node.getComponent(Bacarrat_Card);
                node.angle = angle;
                if (i % 2 == 0) {
                    comp.setId(this._data.cardPlayers[i / 2]);
                } else {
                    comp.setId(this._data.cardBankers[Math.floor(i / 2)]);
                }
                comp.setSpriteCard();
                this._listCard.push(comp);
            }
        }
    }



    private addCard(index: number, idxCard: number): cc.Node {

        let card = this.node.getChildByName("deal_card_" + index.toString());
        BGUI.ZLog.log("card-->", card)
        if (card != null) {
            card.active = true;
            card.setPosition(this.listSkeCard[index].node.getPosition());
            return card;
        } else {
            let card = cc.instantiate(this.prfCard);
            card.name = "deal_card_" + index;
            card.scale = 0.2
            card.setPosition(0, 170);
            card.opacity = 0
            card.scaleY = 0
            card.scaleY = 0
            this.node.addChild(card);
            let comp = card.getComponent(Bacarrat_Card);
            comp.setId(idxCard);
            this._listCard.push(comp);
            return card;
        }

    }


    private _playSpine(nAnim: cc.Node, animName: string, loop: boolean, callback: Function) {
        BGUI.ZLog.log('_playSpine -------------->' + nAnim.name)
        let spine = nAnim.getComponent(sp.Skeleton);
        spine.clearTracks();
        let track = spine.setAnimation(0, animName, loop);
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.FLIPCARDS);
        if (track) {
            spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animName && callback) {
                    callback && callback(); // Execute your own logic after the animation ends
                }
            });
        }
    }

    hideAllAnim() {
        this.listSkeCard.forEach(e => {
            if (e) {
                e.node.active = false;
            }
        })
    }

    showSkeAnim(list: Array<number>) {
        list.forEach(e => {
            if (e) {
                this.listSkeCard[e].node.active = true;
            }
        })
    }

    showWinSide(nSide: number) {
        if (nSide == 1) {
            this.setAnimDealer("ResultBanker");
        } else if (nSide == 0) {
            this.setAnimDealer("ResultPlayer");
        }
        else if (nSide == 2) {
            this.setAnimDealer("ResultTie");
        }
    }


    cleanUp() {
        this._data = [];
        this.hideAllAnim();

        this.setAnimDealer("Discard")

        this._listCard.forEach((e: Bacarrat_Card, idx) => {
            if (e) {
                e.node.stopAllActions();
                e.node.runAction(cc.sequence(cc.delayTime(0.1 * idx), cc.callFunc(() => { e.node.removeFromParent() }), cc.removeSelf()))
            }
        })

        this._listCard.forEach((e: Bacarrat_Card) => {
            if (e) {
                e.node.removeFromParent();
            }
        });
    }

    cleanUpCard() {

        this._listCard.forEach((e: Bacarrat_Card, idx) => {
            if (e) {
                e.node.stopAllActions();
                e.node.runAction(cc.sequence(cc.delayTime(0.1 * idx), cc.callFunc(() => { e.node.removeFromParent() }), cc.removeSelf()))
            }
        })

        this._listCard.forEach((e: Bacarrat_Card, idx) => {
            if (e) {
                e.node.removeFromParent();
            }
        });
    }

    isCheckNanBai() {
        if (this._isNanBai && Bacarrat_GameManager.instance.potOnTableManager.getSideNan() != -1)
            return true;

        return false
    }

    onClickNanBai() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        if (this.isDealCard) {
            if (this.cbNan.isChecked && !this._isNanBai)
                BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('bacarrat.noti.nan_bai'))
        }
        else {
            this._isNanBai = this.cbNan.isChecked
        }
    }
}