import PokerCard from "./Poker.Card";
import { Poker } from "./Poker.Cmd";
import PokerController from "./Poker.Controller";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PokerPlayer extends cc.Component {
    @property(cc.Integer)
    private position: cc.Integer = 0;

    @property(cc.Node)
    private spBorder: cc.Node = null;

    @property(cc.Node)
    private spAvatar: cc.Node = null;

    @property(cc.Node)
    private lbNickname: cc.Node = null;

    @property(cc.Node)
    private lbBalance: cc.Node = null;

    @property(cc.Node)
    private lbRole: cc.Node = null;

    @property(cc.Node)
    private nCards: cc.Node = null;

    @property(cc.Node)
    private cards: Array<cc.Node> = [];

    private _player: Poker.ImpPlayer = null;

    ///////////
    private listPosCards = [cc.v2(-28, 0), cc.v2(48, -2)];
    private listRotateCards = [5, -5];

    start() {
        // TODO
    }

    public initInfoPlayer(player: Poker.ImpPlayer) {
        this._player = player;
        this.setNickName();
        this.setBalance();
        this.setActive();
        this.setRole();
    }


    /////////////////////////////////
    public setNickName() {
        this.lbNickname.getComponent(cc.Label).string = this._player.pl_nick_name;
    }

    public setBalance() {
        this.lbBalance.getComponent(cc.Label).string = BGUI.StringUtils.formatNumber(this._player.pl_balance);
    }

    public setRole() {
        this.lbRole.getComponent(cc.Label).string = "";
        if (this._player.pl_is_dealer) {
            this.lbRole.getComponent(cc.Label).string = "DEALER";
        } else if (this._player.pl_is_small_blind) {
            this.lbRole.getComponent(cc.Label).string = "SMALL BLIND";
        } else if (this._player.pl_is_big_blind) {
            this.lbRole.getComponent(cc.Label).string = "BIG BLIND";
        }
    }

    public setActive() {
        // this.node.active = true;
        this.node.active = this._player.pl_active;
    }

    public setStatus() {
        if(true) {

        } else {

        }
        // this.node.active = this._player.pl_status;
    }

    //////////////////// MODEL ////////////////////////
    public set player(data: any) {
        if (!(data instanceof Object)) {
            return;
        }
        if (data.pl_display_name && typeof data.pl_display_name == "string") {
            this._player.pl_display_name = data.pl_display_name;
        }
        if (data.pl_nick_name && typeof data.pl_nick_name == "string") {
            this._player.pl_nick_name = data.pl_nick_name;
        }
        if (data.pl_avatar && typeof data.pl_avatar == "string") {
            this._player.pl_avatar = data.pl_avatar;
        }
        if (data.pl_balance && typeof data.pl_balance == "number") {
            this._player.pl_balance = data.pl_balance;
        }
        if (data.pl_active && typeof data.pl_active == "boolean") {
            this._player.pl_active = data.pl_active;
        }
        if (data.pl_chair && typeof data.pl_chair == "number") {
            this._player.pl_chair = data.pl_chair;
        }
        if (data.pl_status && typeof data.pl_status == "number") {
            this._player.pl_status = data.pl_status;
        }
        if (data.pl_type && typeof data.pl_type == "number") {
            this._player.pl_type = data.pl_type;
        }
        if (data.pl_score && typeof data.pl_score == "number") {
            this._player.pl_score = data.pl_score;
        }
        if (data.pl_action && typeof data.pl_action == "number") {
            this._player.pl_action = data.pl_action;
        }
        if (data.pl_cards && typeof data.pl_cards == "string") {
            this._player.pl_cards = data.pl_cards;
        }
        if (data.pl_list_card_max && typeof data.pl_list_card_max == "string") {
            this._player.pl_list_card_max = data.pl_list_card_max;
        }
        if (data.pl_total_bet_money && typeof data.pl_total_bet_money == "number") {
            this._player.pl_total_bet_money = data.pl_total_bet_money;
        }
        if (data.pl_win_money && typeof data.pl_win_money == "number") {
            this._player.pl_win_money = data.pl_win_money;
        }
        if (data.pl_round_bet_money && typeof data.pl_round_bet_money == "number") {
            this._player.pl_round_bet_money = data.pl_round_bet_money;
        }
    }

    public get player(): Poker.ImpPlayer {
        return this._player;
    }

    ////////////////////////////////////////////
    // update (dt) {}

    public dealCards(cards: Array<number>) {
        let arrayPoint = PokerController.instance.nChiaBai.convertToWorldSpaceAR(cc.v2(0, 0));
        var posChiaBai = this.nCards.convertToNodeSpaceAR(arrayPoint);
        for (let i = 0; i < 2; i++) {
            this.cards[i].scale = 0.25;
            this.cards[i].angle = 0;
            this.cards[i].setPosition(posChiaBai);
            this.cards[i].getComponent(PokerCard).activeCard(true);
            this.cards[i].getComponent(PokerCard).setBackCard();
            cc.tween(this.cards[i]).delay(i).to(1, { position: this.listPosCards[i], scale: 1, angle: this.listRotateCards[i]}).call(() => { }).start();
        }

        if(this._player && this._player.pl_is_me) {
            this.scheduleOnce(() => {
                this.openCardSecond(cards[1]);
                this.scheduleOnce(() => {
                    this.openCardFirst(cards[0])
                }, 1)
            }, 4)
        }
    }

    private openCardFirst(card: number) {
        this.cards[0].runAction(cc.sequence(
            cc.scaleTo(0.5, 1),
            cc.delayTime(0.25),
            cc.scaleTo(0.25, 0, 1),
            cc.callFunc(() => {
                this.cards[0].getComponent(PokerCard).setSpriteFrameForCard(card);
            }),
            cc.scaleTo(0.25, 1, 1),
        ))
    }

    private openCardSecond(card: number) {
        this.cards[1].runAction(cc.sequence(
            cc.scaleTo(0.5, 1),
            cc.delayTime(0.25),
            cc.scaleTo(0.25, 0, 1),
            cc.callFunc(() => {
                this.cards[1].getComponent(PokerCard).setSpriteFrameForCard(card);
            }),
            cc.scaleTo(0.25, 1, 1),
        ))
    }
}
