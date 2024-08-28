import { PokerConnector } from "../../lobby/scripts/network/wss/PokerConnector";
import { Poker } from "./Poker.Cmd";
import ErrorDefine = BGUI.ErrorDefine;
import PokerPlayer from "./Poker.Player";
import PokerPlayers from "./Poker.Players";
import PokerCardCommon from "./Poker.CardCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerController extends cc.Component {

    public static instance: PokerController = null;

    @property(cc.Node)
    private nRooms: cc.Node = null;

    @property(cc.Node)
    private nGame: cc.Node = null;

    @property(cc.SpriteAtlas)
    public cardSpriteAtlas: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    public infoUserSpriteAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    private nCardCommon: cc.Node = null;

    @property(cc.Node)
    private nMenu: cc.Node = null;

    @property(cc.Node)
    public nTotalBetInGame: cc.Node = null;

    @property(cc.Node)
    public nChiaBai: cc.Node = null;

    @property(cc.Node)
    public nGuider: cc.Node = null;

    @property(cc.Node)
    private nPlayers: cc.Node = null;

    @property(cc.Node)
    private nControlBet: cc.Node = null;

    @property(cc.Node)
    private nBtnFold: cc.Node = null;

    @property(cc.Node)
    private nBtnCheck: cc.Node = null;

    @property(cc.Node)
    private nBtnConfirm: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    // private playerInfo: any;
    ////////////////
    public localGameId: number;
    public localRoomId: number;
    public localTotalBetInGame: number;
    ///////////////////

    onLoad() {
        PokerController.instance = this;
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_GAME_INFO, this.responseGameInfo, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_NEW_USER_JOIN, this.responseNewUserJoin, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_NOTIFY_REQ_QUIT_ROOM, this.responseNotifyReqQuitRoom, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_USER_EXIT_ROOM, this.responseUserExitRoom, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_UPDATE_AUTO_START, this.responseUpdateAutoStart, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_START_GAME, this.responseStartGame, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_START_ROUND_PRE_FLOP, this.responseStartRoundPreFlop, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_START_NEW_ROUND, this.responseStartNewRound, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_START_ROUND_SHOW_DOWN, this.responseStartRoundShowDown, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_END_GAME, this.responseEndGame, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_OPEN_BET, this.responseOpenBet, this)
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_PLAYER_ACTION, this.responsePlayerAction, this);
        this.initElement();
    }

    onDestroy() {
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_NEW_USER_JOIN);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_NOTIFY_REQ_QUIT_ROOM);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_USER_EXIT_ROOM);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_UPDATE_AUTO_START);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_START_GAME);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_START_ROUND_PRE_FLOP);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_START_NEW_ROUND);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_START_ROUND_SHOW_DOWN);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_END_GAME);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_GAME_INFO);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_OPEN_BET);
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_PLAYER_ACTION);
    }

    start() {
        // TODO
        this.switchScreen("ROOM");
    }

    private initElement() {
        this.nCardCommon.action = false;
        this.nMenu.action = false;
        this.nControlBet.action = false;
    }

    private responseNewUserJoin(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveNewUserJoin();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End NewUserJoin 3031", res);
        /////////////////////////////
        // let player = res.player;

        PokerPlayers.instance.handleNewUserJoin(res);
    }

    private responseNotifyReqQuitRoom(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveNotifyReqQuitRoom();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End NotifyReqQuitRoom 3032", res);
        /////////////////////////////////////////////////////////////
        // let chair: number;
        // let isQuitRoom:boolean;
        PokerPlayers.instance.handleNotifyReqQuitRoom(res);
    }

    private responseUserExitRoom(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveUserExitRoom();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End UserExitRoom 3033", res);
        /////////////////////////////////
        PokerPlayers.instance.handleUserExitRoom(res);
    }

    private responseUpdateAutoStart(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveUpdateAutoStart();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End UpdateAutoStart 3101", res);
        /////////////////////////////
        let isAutoStart = res.isAutoStart;
        let autoStartTime = res.autoStartTime;
        this.localTotalBetInGame = 0;
        this.updateTotalBetInGame(this.localTotalBetInGame);
        if (isAutoStart) {
            // TODO
        }
    }

    private responseStartGame(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveStartGame();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End StartGame 3102", res);
        /////////////////////////////////
        this.localGameId = res.gameId;
        this.localRoomId = res.roomId;

        // let countDownTime = res.countDownTime;
        // let moneyBet = res.moneyBet;
        // let moneyType = res.moneyType;

        PokerPlayers.instance.handleStartGame(res);
        this.switchScreen("GAME");

    }

    private switchScreen(screen) {
        this.nRooms.active = false;
        this.nGame.active = false;
        switch (screen) {
            case "ROOM":
                this.nRooms.active = true;
                break;
            case "GAME":
                this.nGame.active = true;
                break;
        }
    }

    private responseStartRoundPreFlop(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveStartRoundPreFlop();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End StartRoundPreFlop 3103", res);
        /////////////////////////////////////////////////////////////
        this.localTotalBetInGame = res.totalBetInGame;
        this.updateTotalBetInGame(this.localTotalBetInGame);
        PokerPlayers.instance.handleStartRoundPreFlop(res);
        ///
        // PokerCardCommon.instance.updateCards(res.commonCards);
    }

    private responseStartNewRound(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveStartNewRound();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End StartNewRound 3104", res);
        /////////////////////////////////////////////////////////////
        PokerPlayers.instance.handleStartNewRound(res);
        this.localTotalBetInGame = res.totalBetInGame;
        this.updateTotalBetInGame(this.localTotalBetInGame);
        if (res.gameRound == Poker.GameRound.ROUND_THE_FLOP) {
            // The Flop
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_TURN) {
            // The Turn
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_RIVER) {
            // The River
        }

        switch (res.type) {
            case Poker.GameTypeCard.TYPE_HIGH_CARD:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_ONE_PAIR:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_TWO_PAIR:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_THREE_OF_A_KIND:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_STRAIGHT:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_FLUSH:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_FULL_HOUSE:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_FOUR_OF_A_KIND:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_STRAIGHT_FLUSH:
                // TODO
                break;

            case Poker.GameTypeCard.TYPE_ROYAL_FLUSH:
                // TODO
                break;
        }
    }

    private responseStartRoundShowDown(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveStartRoundShowDown();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End StartRoundShowDown 3105", res);
        /////////////////////////////////////////////////////////////
        this.localTotalBetInGame = res.totalBetInGame;
        this.updateTotalBetInGame(this.localTotalBetInGame);
        PokerPlayers.instance.handleStartRoundShowDown(res);
    }

    private responseEndGame(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveEndGame();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End EndGame 3106", res);
        /////////////////////////////////////////////////////////////

        PokerCardCommon.instance.handleEndGame(res);
        PokerPlayers.instance.handleEndGame(res);
    }

    private responseGameInfo(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveGameInfo();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End GameInfo 3201", res);
        //////////////////////////////
        this.localGameId = res.gameId;
        this.localRoomId = res.roomId;
        this.localTotalBetInGame = res.totalBetInGame;
        this.updateTotalBetInGame(this.localTotalBetInGame);
        // let myChair = res.myChair;
        // let players = res.players;
        // let infoMe = res.infoMe;
        // let commonCards = res.commonCards;
        this.switchScreen("GAME");
        if (res.gameRound == Poker.GameRound.ROUND_PRE_FLOP) {
            // The Flop
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_FLOP) {
            // The Flop
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_TURN) {
            // The Turn
        }
        if (res.gameRound == Poker.GameRound.ROUND_THE_RIVER) {
            // The River
        }
        PokerPlayers.instance.handleSubscribeGame(res);
        PokerCardCommon.instance.handleGameInfo(res);
    }

    private responseOpenBet(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceiveInviteBet();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End OpenBet 3202", res);
        /////////////////////////////////////
        this.localTotalBetInGame = res.totalBetInGame;
        this.updateTotalBetInGame(this.localTotalBetInGame);
        PokerPlayers.instance.handleOpenBet(res);
        if (res.chair == 0) {
            Poker.Send.sendPlayerAction(Poker.GamePlayerAction.CHECK, 0);
        }

        for(let action of res.nextAction) {
            this.showBtnAction(action);
        }
    }

    private responsePlayerAction(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceivePlayerAction();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "Start PlayerAction 3203", res);
        ///////////////////////////////////
        // let chair = res.chair;
        // let action = res.action;
        // let moneyBet = res.moneyBet;
        // let maxBetInRound = res.maxBetInRound;
        PokerPlayers.instance.handlePlayerAction(res);

        if (res.getError() == ErrorDefine.SUCCESS) {
            let chair = res.chair;
            let action = res.action;
            let moneyBet = res.moneyBet;
            let maxBetInRound = res.maxBetInRound;
            ///////////////

        } else if (res.getError() == ErrorDefine.FAIL) {
            console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End PlayerAction 3203 with error wrong action", res);
        } else if (res.getError() == ErrorDefine.PARAM_INVALID) {
            console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End PlayerAction 3203 with error wrong money", res);
        } else {
            console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "End PlayerAction 3203 with error unknown", res);
        }
    }

    private showBtnAction(action) {
        switch (action) {
            case Poker.GamePlayerAction.SMALL_BLIND:

                break;

            case Poker.GamePlayerAction.BIG_BLIND:

                break;

            case Poker.GamePlayerAction.FOLD:
                this.enableBtnFold(true);
                break;

            case Poker.GamePlayerAction.CHECK:
                this.enableBtnCheck(true);
                break;

            case Poker.GamePlayerAction.CALL:

                break;

            case Poker.GamePlayerAction.BET:

                break;

            case Poker.GamePlayerAction.RAISE:
                this.enableBtnFold(true);
                break;

            case Poker.GamePlayerAction.ALL_IN:

                break;
        }
    }

    private updateTotalBetInGame(money: number) {
        this.nTotalBetInGame.active = (money > 0);
        let nLbTotalBet = this.nTotalBetInGame.getChildByName("LbTotalBet");
        nLbTotalBet.getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(this.localTotalBetInGame);
    }

    private enableBtnFold(isEnabled: boolean) {
        this.nBtnFold.getComponent(cc.Button).interactable = isEnabled;
    }

    private enableBtnCheck(isEnabled: boolean) {
        this.nBtnCheck.getComponent(cc.Button).interactable = isEnabled;
    }

    private enableBtnConfirm(isEnabled: boolean) {
        this.nBtnConfirm.getComponent(cc.Button).interactable = isEnabled;
    }

    protected onClickMenu() {
        alert("onClickMenu");
    }

    protected onClickExit() {
        alert("onClickExit");
    }

    protected onClickGuide() {
        alert("onClickGuide");
    }

    protected onClickSetting() {
        alert("onClickSetting");
    }

    protected onClickFold() {
        Poker.Send.sendPlayerAction(Poker.GamePlayerAction.FOLD, 0);
    }

    protected onClickCheck() {
        Poker.Send.sendPlayerAction(Poker.GamePlayerAction.CHECK, 0);
    }

    protected onClickConfirm() {
        Poker.Send.sendPlayerAction(Poker.GamePlayerAction.CALL, 0);
    }

    protected onClickTip() {
        alert("onClickTip");
    }

    protected onClickShopping() {
        alert("onClickShopping");
    }
}
