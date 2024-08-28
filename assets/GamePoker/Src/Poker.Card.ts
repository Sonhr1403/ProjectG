const { ccclass, property } = cc._decorator;
import { Poker } from "./Poker.Cmd";
import PokerController from "./Poker.Controller";

@ccclass
export default class PokerCard extends cc.Component {

    @property(cc.Sprite)
    private spCard: cc.Sprite = null;

    /////////////////
    private _isShow: boolean = false;

    public set displayed(val: boolean) {
        this._isShow = val;
    }

    public get displayed(): boolean {
        return this._isShow;
    }

    onLoad() {
        this.activeCard(false);
    }

    start() {
        // TODO
    }

    public resetNewSession() {
        this.activeCard(false);
        this.setBackCard();
        this.displayed = false;
    }

    // update (dt) {}
    public setSpriteFrameForCard(card: number) {
        if (card >= 0) {
            if (card <= 51) {
                this.activeCard(true);
                let strCard = Poker.Config.CARD_ATLAS[card.toString()];
                this.displayed = true;
                let spriteCard = PokerController.instance.cardSpriteAtlas.getSpriteFrame(strCard);
                this.spCard.spriteFrame = spriteCard;
            } else {
                this.setBackCard();
            }
        } else {
            this.activeCard(false);
        }
    }

    public setBackCard() {
        let spriteCard = PokerController.instance.cardSpriteAtlas.getSpriteFrame("card_back");
        this.spCard.spriteFrame = spriteCard;
    }

    public activeCard(isActive: boolean) {
        this.node.active = isActive;
    }
}
