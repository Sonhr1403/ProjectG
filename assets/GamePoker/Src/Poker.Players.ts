const { ccclass, property } = cc._decorator;
import { Poker } from "./Poker.Cmd";
import PokerController from "./Poker.Controller";
import PokerPlayer from "./Poker.Player";

@ccclass
export default class PokerPlayers extends cc.Component {
    public static instance: PokerPlayers = null;

    @property(cc.Node)
    private nMe: cc.Node = null;

    @property(cc.Node)
    private players: Array<cc.Node> = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        PokerPlayers.instance = this;
    }


    public localInfoMe: Poker.ImpPlayer;
    public localListPlayer: Array<Poker.ImpPlayer> = [];
    public localMyChair: number;
    public localChairDealer: number;
    public localChairSmallBlind: number;
    public localChairBigBlind: number;

    start() {

    }

    // update (dt) {}

    public initInfoForOther(list: Array<Poker.ImpPlayer>) {
        this.localListPlayer = [];
        for (let i = 0; i < list.length; i++) {
            let info = list[i];
            if (info && !info.pl_is_me) {
                this.localListPlayer.push(info);
            }
        }

        for (let k = 0; k < this.players.length; k++) {
            let info = this.localListPlayer[k];
            let indexChair = this.convertChair(info.pl_chair);
            // console.log("IT IS HERE", info, info.pl_chair, indexChair);
            this.players[indexChair].getComponent(PokerPlayer).initInfoPlayer(info);
        }
    }

    public initInfoForMe(info: Poker.ImpPlayer) {
        this.nMe.getComponent(PokerPlayer).initInfoPlayer(info);
    }

    public updateInfoForOther(list: Array<any>) {
        let otherPlayers: Array<Poker.ImpPlayer> = [];
        for (let i = 0; i < list.length; i++) {
            let info = list[i];
            if (info && !info.pl_is_me) {
                otherPlayers.push(info);
            }
        }
        this.localListPlayer = otherPlayers;
        for (let k = 0; k < this.players.length; k++) {
            let info = otherPlayers[k];
            let indexChair = this.convertChair(info.pl_chair);
            this.players[indexChair].getComponent(PokerPlayer).player = info;
        }
    }

    public updateInfoForMe(info: any) {
        this.nMe.getComponent(PokerPlayer).player = info;
    }

    public updateMyCards(cards: Array<number>) {
        this.nMe.getComponent(PokerPlayer)
    }

    public handleSubscribeGame(res: Poker.ReceiveGameInfo) {
        this.localMyChair = res.myChair;
        this.localChairDealer = res.chairDealer;
        this.localChairSmallBlind = res.chairSmallBlind;
        this.localChairBigBlind = res.chairBigBlind;

        this.initInfoForMe(res.infoMe);
        this.initInfoForOther(res.players);
        this.updateMyCards(res.myCards);
    }

    public handleStartGame(res: Poker.ReceiveStartGame) {
        this.localMyChair = res.myChair;
        this.initInfoForMe(res.infoMe);
        this.initInfoForOther(res.players);
    }

    public handleNewUserJoin(res: Poker.ReceiveNewUserJoin) {
        let info = res.player;
        let existed = false;
        for (let player of this.localListPlayer) {
            if (player.pl_nick_name == info.pl_nick_name) {
                existed = true;
                break;
            }
        }

        if (!existed) {
            let indexChair = this.convertChair(info.pl_chair);
            this.players[indexChair].getComponent(PokerPlayer).initInfoPlayer(info);
        }
    }

    public handleUserExitRoom(res: Poker.ReceiveUserExitRoom) {
        let info = res.player;
        for (let player of this.localListPlayer) {
            if (player.pl_nick_name == info.pl_nick_name) {
                let indexChair = this.convertChair(info.pl_chair);
                this.players[indexChair].getComponent(PokerPlayer).initInfoPlayer(info);
            }
        }
    }

    public handleStartRoundPreFlop(res: Poker.ReceiveStartRoundPreFlop) {
        // TODO
        this.localChairDealer = res.chairDealer;
        this.localChairSmallBlind = res.chairSmallBlind;
        this.localChairBigBlind = res.chairBigBlind;
        this.dealCardsForMe(res.myCards);
        this.dealCardsForPlayer();
    }

    public handleStartNewRound(res: Poker.ReceiveStartNewRound) {
        // TODO
        if (res.gameRound == Poker.GameRound.ROUND_THE_FLOP) {
            // The Flop
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_TURN) {
            // The Turn
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_RIVER) {
            // The River
        }
    }

    public handleOpenBet(res: Poker.ReceiveInviteBet) {
        // TODO
    }

    public handlePlayerAction(res: Poker.ReceivePlayerAction) {
        // TODO
    }

    public handleStartRoundShowDown(res: Poker.ReceiveStartRoundShowDown) {
        // TODO
    }

    public handleNotifyReqQuitRoom(res: Poker.ReceiveNotifyReqQuitRoom) {
        // TODO
        let chair = res.chair;
        let isQuitRoom = res.isQuitRoom;
        let indexChair = this.convertChair(chair);
        if (this.players[indexChair] && isQuitRoom) {
            // TODO
        }
    }

    public handleEndGame(res: Poker.ReceiveEndGame) {
        let infos = res.playerInfos;
        for (let k = 0; k < infos.length; k++) {

        }

        for (let i = 0; i < this.players.length; i++) {

        }
    }

    private findNodeByNickName(nickName: string): cc.Node {
        let isMe = this.isMeByNickname(nickName);
        if (isMe) {
            return this.nMe;
        } else {
            for (let i = 0; i < this.players.length; i++) {
                let nPlayer: cc.Node = this.players[i];
                let objPlayer: PokerPlayer = nPlayer.getComponent(PokerPlayer);
                if (objPlayer.player.pl_active && (objPlayer.player.pl_nick_name == nickName)) {
                    return nPlayer;
                }
            }
        }
        return null;
    }

    private findNodeByChair(chair: number): cc.Node {
        if (chair == 0) {
            return this.nMe;
        }
        return null;
    }

    private isMeByNickname(nickname: string) {
        return (this.nMe.getComponent(PokerPlayer).player.pl_nick_name == nickname);
    }

    private dealCardsForPlayer() {
        for (let nPlayer of this.players) {
            let objPlayer = (nPlayer instanceof cc.Node) ? nPlayer.getComponent(PokerPlayer) : null;
            if (objPlayer && objPlayer.player && objPlayer.player.pl_active) {
                nPlayer.getComponent(PokerPlayer).dealCards([52, 52]);
            }
        }
    }

    private dealCardsForMe(cards: Array<number>) {
        this.nMe.getComponent(PokerPlayer).dealCards(cards);
    }

    private convertChair(chair: number): number {
        let numberSeat = 8;
        return (chair - this.localMyChair + numberSeat) % numberSeat;
    }
}
