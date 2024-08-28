import PokerCard from "./Poker.Card";
import { Poker } from "./Poker.Cmd";
import PokerController from "./Poker.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerCardCommon extends cc.Component {

    public static instance: PokerCardCommon = null;

    @property(cc.Node)
    private listCard: Array<cc.Node> = [];

    // LIFE-CYCLE CALLBACKS:
    private listPos: cc.Vec2 = [cc.v2(-290, 0), cc.v2(-145, 0), cc.v2(0, 0), cc.v2(145, 0), cc.v2(290, 0)];

    onLoad() {
        PokerCardCommon.instance = this;
    }

    start() {
        // TODO
    }

    public handleEndGame(res: Poker.ReceiveEndGame) {
        // TODO
    }

    public handleGameInfo(res: Poker.ReceiveGameInfo){
        this.updateCards(res.commonCards);
    }

    public handleStartNewRound(res: Poker.ReceiveStartNewRound){
        this.actionChiaBai(res.commonCards);
    }

    // update (dt) {}

    public updateCards(cards: Array<number>) {
        for (let i = 0; i < this.listCard.length; i++) {
            if (Number.isInteger(cards[i]) && cards[i] >= 0) {
                this.listCard[i].setPosition(this.listPos[i]);
                this.listCard[i].getComponent(PokerCard).setSpriteFrameForCard(cards[i]);
            } else {
                this.listCard[i].getComponent(PokerCard).activeCard(false);
            }
        }
    }

    // private getArrayPointChiaBai() {
    //     let convertToWorldSpaceAR = PokerController.instance.nChiaBai.convertToWorldSpaceAR(cc.v2(0, 0));
    //     return convertToWorldSpaceAR;
    // }

    private actionChiaBai(cards: Array<number>) {
        // let arrayPoint = PokerController.instance.nChiaBai.convertToWorldSpaceAR(cc.v2(0, 0));
        // var posChiaBai = this.node.convertToNodeSpaceAR(arrayPoint);
        let _cards = cards.filter((card) => (card <= 52 && card >= 0));
        for (let i = 0; i < _cards.length; i++) {
            if(!this.listCard[i].displayed) {
                this.listCard[i].scale = 0.25;
                this.listCard[i].setPosition(cc.v2(0, 215));
                this.listCard[i].getComponent(PokerCard).activeCard(true);
                this.listCard[i].getComponent(PokerCard).setBackCard();
                cc.tween(this.listCard[i]).delay(i)
                .to(1, { position: this.listPos[i], scale: 1 })
                .delay(0.25)
                .to(0.5, { scaleX: 0, scaleY: 1 }).call(() => {
                    this.listCard[i].getComponent(PokerCard).setSpriteFrameForCard(cards[i]);
                }).to(0.5, { scaleX: 1, scaleY: 1 }).start();
            }
        }
    }
}
