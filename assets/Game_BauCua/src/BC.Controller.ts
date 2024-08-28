import { BCLanguageMgr } from "./BC.LanguageMgr";
import BCConnector from "./BC.Connector";
import BCDoor from "./BC.Door";
import BCDices from "./BC.Dices";
import cmd from "./BauCua.Cmd";
import BCPlayer from "./BC.Player";
import BCDealer from "./BC.Dealer";
import BCCommon from "./BC.Common";
import BCPhinh from "./BC.Phinh";
import BCClock from "./BC.Clock";
import BCListUser from "./BC.ListUser";
import BCListHistory from "./BC.ListHistory";
import BCSoundControler, { BC_SOUND_TYPE } from "./BC.SoundControler";
import BCTransaction from "./BC.Transaction";
// import LobbyCtrl from "../../lobby/scripts/LobbyCtrl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BCController extends BGUI.UIWindow {

    public static instance: BCController = null;

    @property(BCSoundControler)
    public nSoundControler: BCSoundControler = null;

    @property(cc.Node)
    public UI_BauCua: cc.Node = null;

    @property(cc.Node)
    public UI_ListUser: cc.Node = null;

    @property(cc.Node)
    public UI_ListHistory: cc.Node = null;

    @property(cc.Node)
    public UI_Game: cc.Node = null;

    @property(cc.Node)
    public UI_Toast: cc.Node = null;

    @property([cc.Node])
    public doors: cc.Node[] = [];

    @property(cc.Label)
    public lblBcSession: cc.Label = null;

    @property(cc.Node)
    public UI_Dides: cc.Node = null;

    @property(cc.Node)
    public UI_Player: cc.Node = null;

    @property(cc.Node)
    public UI_Menu: cc.Node = null;

    @property(cc.Node)
    public nBtnBack: cc.Node = null;

    @property(cc.Node)
    public skeletonHandShake: cc.Node = null;

    @property(cc.Prefab)
    public prfChip: cc.Prefab = null;

    @property(cc.Prefab)
    public prfHeart: cc.Prefab = null;

    @property(cc.Node)
    public nClock: cc.Node = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasChip: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    public prfPlayer: cc.Prefab = null;

    @property(cc.Prefab)
    public prfGuide: cc.Prefab = null;

    @property(cc.Prefab)
    public prfChat: cc.Prefab = null;

    @property(cc.Prefab)
    public prfListUser: cc.Prefab = null;

    @property(cc.Node)
    public nDealer: cc.Node = null;

    @property(cc.Node)
    public currentBtnBet: cc.Node = null;

    @property(cc.ScrollView)
    public scrollViewBet: cc.ScrollView = null;

    @property(sp.SkeletonData)
    public emosSkeletonData: sp.SkeletonData = null;

    @property(cc.Node)
    public cheerSkeleton: cc.Node = null;

    @property(cc.Node)
    public Ui_Guide: cc.Node = null;

    @property(cc.Node)
    public btnReBet: cc.Node = null;

    @property(cc.Node)
    public listBtnBet: Array<cc.Node> = [];

    @property(cc.Prefab)
    public prfTransaction: cc.Prefab = null;

    @property(cc.Node)
    public bgBtnMusic: cc.Node = null;

    @property(cc.SpriteFrame)
    public spFrameAvtDefault: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    public spFrameIconMusic: Array<cc.SpriteFrame> = [];

    /////////////////////////////////////////////////
    public Ui_Transaction: cc.Node = null;
    public UI_Chat: cc.Node = null;

    public myBalance: number = 0;
    public countDoNotInteract: number = 0;
    ////////////////////////////
    private roomId = 0;
    private betValue = 1000;
    private bettingState = false;
    private players: cc.Node[] = [];
    private playerExt: cc.Node = null;
    private playerMe: cc.Node = null;
    private isRecordingBet = false
    private listTotalMoneyInDoor = {};
    private listMoneyOfMeInDoor = {};
    private listDetailTotalMoneyInDoor = {};
    private listDetailMoneyOfMeInDoor = {};
    private timePhinh = 1;
    private timeExpandBowl = 0.5;
    private timeShrinkBowl = 0.5;
    private timeShowResultDices = 3;
    private listShakeDishes = { "EXPAND": { pos: cc.v3(0, -120, 0), scale: 0.9 }, "SHRINK": { pos: cc.v3(190, 360, 0), scale: 0.2 }, }
    private defFaceMoney = { 1000: 0, 5000: 1, 10000: 2, 50000: 3, 100000: 4, 500000: 5, 1000000: 6, 5000000: 7, 10000000: 8, 50000000: 9 };
    private localRefId = 0;

    private infoMe: cmd.User = null;
    private listUserInTable: Array<cmd.User> = [];
    private historyBetPerDoorOfMe = {};
    public listExternalUsers: Array<cmd.User> = [];
    private totalUserPlaying: number = 0;
    private stepScroll = 1 / 12;
    private currentScroll = 0;
    ////////////////////////////////////////////////

    onLoad() {
        BCController.instance = this;
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_LOGIN, this.responseLogin, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_TIP_5027, this.responseTipToBanker, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_LOGOUT, this.responseDisconnect, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_DISCONNECTED, this.responseDisconnect, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_SUBSCRIBE, this.responseSubscribe, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_START_NEW_GAME, this.responseStartNewGame, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_RESULT, this.responseResult, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_BET_SUCCESS, this.responseBetSuccess, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_HISTORY, this.responseHistory, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_USER_JOIN_ROOM, this.responseNewUserJoinRoom, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_USER_EXIT_ROOM, this.responseNewUserExitRoom, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_USER_OUT_ROOM, this.responseNewUserOutRoom, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_USER_KICK_OUT, this.responseNewUserKickOutRoom, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_CHAT, this.responseBcChat, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_SHAKE_BOWL, this.responseBcShakeBowl, this);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_LIST_EXTERNAL_USERS, this.responseBcListExternalUsers, this);
        // cc.director.getScheduler().scheduleUpdate(this, this.update, this);
        cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
        cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
        this._scheduler = window.setInterval(this.updateOffline.bind(this), 1000 / 60);
        BCConnector.instance.connect();
    }

    private _localIsMusic: boolean = false;

    private initMusic() {
        // LobbyCtrl.instance.stopBgMusic();
        BCSoundControler.instance.playBackgroundAudio();
        this._localIsMusic = true;
        this.bgBtnMusic.getComponent(cc.Sprite).spriteFrame = this.spFrameIconMusic[(this._localIsMusic) ? 1 : 0];
    }

    private hideTime: number = null;
    private _isGameActive: boolean = true;
    private _scheduler = null;

    private updateOffline() {
        if (!this._isGameActive) {
            if (cc.sys.isBrowser) {
                cc.director.mainLoop();
            }
        }
    }

    private _onShowGame() {
        this._isGameActive = true;
        if (cc.sys.isNative && cc.sys.isMobile && this.hideTime) {
            let curTime = performance.now();
            let delta = (curTime - this.hideTime) / 1000;
            let itr = 0;
            while (itr < delta) {
                let dt = Math.min(0.1, delta - itr);
                cc.director.getScheduler().update(dt);
                itr += dt;
            }
            this.hideTime = null;
        } else {
            cc.game.resume();
        }
    }

    private _onHideGame() {
        this._isGameActive = false;
        if (cc.sys.isNative && cc.sys.isMobile) {
            this.hideTime = performance.now();
        } else {
            cc.game.pause();
        }
    }

    ///////////////////////////////
    onEnable() {
        this.UI_Game.on(cc.Node.EventType.TOUCH_START, this.onTouchUIGame, this);
    }

    onDisable() {
        this.UI_Game.off(cc.Node.EventType.TOUCH_START, this.onTouchUIGame, this);
    }

    private activeCheers(isActive: boolean, money: number) {
        this.cheerSkeleton.active = isActive;
        if (isActive) {
            this.cheerSkeleton.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
            this.cheerSkeleton.children[0].getComponent(cc.Label).string = BCCommon.convert2Label(money);
        }
    }

    public showToast(message: string) {
        let nLabel = this.UI_Toast.children[0];
        if (nLabel) {
            let lbToast = nLabel.getComponent(cc.Label);
            lbToast.string = message;
            this.activeUiToast(true);
            this.UI_Toast.opacity = 0;
            this.UI_Toast.runAction(cc.sequence(
                cc.fadeIn(0.1),
                cc.delayTime(2),
                cc.fadeOut(0.2),
                cc.callFunc(() => {
                    this.UI_Toast.stopAllActions();
                    this.activeUiToast(false);
                })));
        }
    }

    private activeUiToast(isActive: boolean) {
        this.UI_Toast.active = isActive;
    }

    private onTouchUIGame(touchEvent: any) {
        this.UI_ListHistory.getComponent(BCListHistory).hide();
        this.UI_ListHistory.getComponent(BCListHistory).hide();
        this.closeUiMenu();
        this.closeUiGuide();
        this.closeUiChat();
        this.UI_ListUser.getComponent(BCListUser).hide();
        BCController.instance.countDoNotInteract = 0;
    }

    private closeUiChat() {
        this.UI_Chat.active = false;
    }

    protected update(dt: number): void {
        // TODO
    }

    private renderInfoForMe(infoMe: cmd.User) {
        this.playerMe.getComponent(BCPlayer).updateInfo(infoMe);
    }

    private setTotalUserPlaying(totalUser: number) {
        this.playerExt.getComponent(BCPlayer).renderNumberPlayer(totalUser);
    }

    protected responseSubscribe(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveSubScribe();
        res.unpackData(data);
        // console.error("BAU_CUA X 5005", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        //////////////////////////////
        this.resetAllDefineMoneyInDoor();
        this.resetAllDoor();
        this.activeBtnReBet(true);
        this.localRefId = res.referenceId;
        this.isRecordingBet = false;
        this.bettingState = res.bettingState;

        //////////////////////////
        this.infoMe = res.infoMe;
        this.listUserInTable = res.listUserInTable;
        this.totalUserPlaying = res.numberUserOutTable;
        ////////////////////////// 
        this.initMoneyInDoor(res.listBetOfUserOutTable);
        this.initMoneyInDoor(res.infoMe.listBet);
        for (let itemUser of res.listUserInTable) {
            this.initMoneyInDoor(itemUser.listBet);
        }
        //////////////////////////
        this.renderInfoForMe(this.infoMe);
        this.renderUserInSeat(this.listUserInTable);
        this.setTotalUserPlaying(this.totalUserPlaying);
        //////////////////////////
        this.calcMoneyOfMeInDoor(res.infoMe);
        this.calcTotalMoneyInDoorOfPlayerInChair(this.listUserInTable);
        this.calcTotalMoneyInDoorOfPlayOutTable(res.listBetOfUserOutTable);
        this.renderTotalMoneyInDoor(this.listTotalMoneyInDoor);
        this.UI_ListHistory.getComponent(BCListHistory).renderData(BCCommon.convertStrHisrotyToArray(res.sessionHistory));

        if (this.bettingState) {
            this.nClock.getComponent(BCClock).setCountDown(res.remainTime);
        } else {
            this.UI_Dides.getComponent(BCDices).setFaceDices(res.dices);
            this.handleReward(res);
            this.bunnceDoorWins(res.winTypes);
        }
    }

    protected responseTipToBanker(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaRecevieTipToBanker();
        res.unpackData(data);
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        ///////////////////////////
        let nickName = res.nickName;
        let money = res.money;
        let errorCode = res.getError();
        if (errorCode == 0) {
            let isMe = this.isPlayerMe(nickName);
            let nUser: cc.Node = null;
            if (isMe) {
                nUser = this.playerMe;
            } else {
                nUser = this.getNodeUserInTable(nickName);
            }
            if (nUser) {
                let posPlayer = cc.v2(nUser.getPosition().x, nUser.getPosition().y);
                //Set Lại số dư
                let infoUser = nUser.getComponent(BCPlayer).getInfoUser();
                infoUser.balance = infoUser.balance - money;

                nUser.getComponent(BCPlayer).updateInfo(infoUser);
                let posHeart = cc.v2(-20, 500);
                let nHeart = cc.instantiate(this.prfHeart);
                nHeart.setPosition(posHeart);
                nHeart.active = false;
                nHeart.opacity = 0;
                this.UI_Player.addChild(nHeart);

                let nChip = cc.instantiate(this.prfChip);
                nChip.getComponent(BCPhinh).setFaceMoney(money);
                nChip.setPosition(posPlayer);
                nChip.active = false;
                nChip.opacity = 0;
                this.UI_Player.addChild(nChip);

                this.scheduleOnce(() => {
                    nChip.active = true;
                    nChip.opacity = 255;
                    nChip.runAction(
                        cc.sequence(
                            cc.spawn(cc.moveTo(1, cc.v2(-20, 400)), cc.scaleTo(1, 0.3),),
                            cc.callFunc(() => {
                                nChip.active = false;
                                nChip.opacity = 0;
                                nHeart.active = true;
                                nHeart.opacity = 255;
                                this.nDealer.getComponent(BCDealer).notiLoser();
                                nHeart.runAction(
                                    cc.sequence(
                                        cc.spawn(cc.moveTo(1, posPlayer).easing(cc.easeBackIn()), cc.scaleTo(1, 1)),
                                        cc.callFunc(() => {
                                            nHeart.stopAllActions();
                                            nHeart.removeFromParent();
                                            nChip.stopAllActions();
                                            nChip.removeFromParent();
                                            nUser.getComponent(BCPlayer).kiss();
                                        })
                                    )
                                );
                            })),
                    );
                })
            }
        }
    }

    protected responseLogin(cmdId: any, data: Uint8Array) {
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId);
        ///////////////////////////
        cmd.Send.sendBauCuaSubscribe(this.roomId);
    }

    protected responseDisconnect(cmdId: any, data: Uint8Array) {
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId);
        ///////////////////////////
        this.unSubscribeGame();
    }

    protected responseResult(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveResult();
        res.unpackData(data);
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        //////////////////////////////
        this.showToast(BCLanguageMgr.getString("minibaucua.bc_stop_bet"));
        this.isRecordingBet = false;
        this.bettingState = false;
        //////////////////////////////////////////
        this.openBowl(res);
        //////////////////////////////////////////
        if (this.historyBetPerDoorOfMe) {
            this.historyBetPerDoorOfMe[this.localRefId] = this.listMoneyOfMeInDoor;
        } else {
            this.historyBetPerDoorOfMe = { [this.localRefId]: this.listMoneyOfMeInDoor }
        }
        cc.sys.localStorage.setItem("BC_HISTORY_BET", JSON.stringify(this.historyBetPerDoorOfMe));
    }

    protected responseStartNewGame(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveNewGame();
        res.unpackData(data);
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        //////////////////////////////
        this.isRecordingBet = false;
        this.bettingState = true;
        this.localRefId = res.referenceId;

        this.activeBtnReBet(true);
        this.nDealer.getComponent(BCDealer).dealerStartNewGame();
        this.resetAllDefineMoneyInDoor();
        this.resetAllDoor();
        this.nClock.getComponent(BCClock).setCountDown(res.time);
    }

    // 5022
    protected responseBcShakeBowl(cmdId: any, data: Uint8Array) {
        BCController.instance.countDoNotInteract++;
        let res = new cmd.BauCuaReceiveShakeBowl();
        res.unpackData(data);
        // console.error("BAU_CUA X", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        //////////////////////////////
        this.showToast(BCLanguageMgr.getString("minibaucua.bc_new_game"));
        this.isRecordingBet = false;
        this.bettingState = true;
        this.infoMe = res.infoMe;
        this.listUserInTable = res.listUserInTable;
        this.totalUserPlaying = res.numberUserOutTable;
        this.activeCheers(false, 0);
        this.renderInfoForMe(this.infoMe);
        this.renderUserInSeat(this.listUserInTable);
        this.setTotalUserPlaying(this.totalUserPlaying);
        this.resetAllDoor();
        this.shakeBowl();
        this.playerMe.getComponent(BCPlayer).resetNewGame();
        this.playerExt.getComponent(BCPlayer).resetNewGame();
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].getComponent(BCPlayer).resetNewGame();
        }
    }

    protected responseNewUserJoinRoom(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveUserJoinRoom();
        res.unpackData(data);
        ////////////////////////////////////////////
        // console.error("BAU_CUA X", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        ///////////
        this.infoMe = res.infoMe;
        this.listUserInTable = res.listUserInTable;
        this.totalUserPlaying = res.numberUserOutTable;
        this.renderInfoForMe(this.infoMe);
        this.renderUserInSeat(this.listUserInTable);
        this.setTotalUserPlaying(this.totalUserPlaying);
    }

    protected responseNewUserExitRoom(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveUserExitRoom();
        res.unpackData(data);
        ////////////////////////////////////////////
        // console.error("BAU_CUA X", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        ///////////
        this.infoMe = res.infoMe;
        this.listUserInTable = res.listUserInTable;
        this.totalUserPlaying = res.numberUserOutTable;
        this.renderInfoForMe(this.infoMe);
        this.renderUserInSeat(this.listUserInTable);
        this.setTotalUserPlaying(this.totalUserPlaying);
    }

    protected responseNewUserKickOutRoom(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveMeKichOutRoom();
        res.unpackData(data);
        ////////////////////////////////////////////
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        this.backToLobby();
    }

    protected responseBcChat(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveChat();
        res.unpackData(data);
        ////////////////////////////////////////////
        // console.error("BAU_CUA_CHAT", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);

        ///////////////////////////////////
        /// Tìm node
        let isMe = this.isPlayerMe(res.userName);
        let nodePlayer: cc.Node = (isMe) ? this.playerMe : this.getNodeUserInTable(res.userName);
        if (nodePlayer) {
            nodePlayer.getComponent(BCPlayer).responseChat(res);
        }
    }

    protected responseNewUserOutRoom(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveUserOutRoom();
        res.unpackData(data);
        ////////////////////////////////////////////
        // console.error("BAU_CUA X", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        let isOut = res.isOut;
        if (isOut) {
            let userName = res.userName;
            let objUserOut = _.remove(this.listUserInTable, (itemUser) => {
                return (userName == itemUser.userName);
            });
            if (!objUserOut) {
                // TODO
            } else {
                this.totalUserPlaying -= 1;
                this.renderUserInSeat(this.listUserInTable);
                this.setTotalUserPlaying(this.totalUserPlaying);
            }
        }
    }

    protected responseHistory(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveHistory();
        res.unpackData(data);
        // console.error("BAU_CUA  HISTORY", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        ////////////////////////////////////////////
        this.scheduleOnce(() => {
            this.UI_ListHistory.getComponent(BCListHistory).renderData(BCCommon.convertStrHisrotyToArray(res.sessionHistory));
        }, 5);
    }

    protected responseBetSuccess(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaRecevieBetSuccess();
        res.unpackData(data);
        // console.error("BET BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        //////////////////////////////
        let errorCode = res.getError();
        let userBet = res.userBet;
        let money = res.money;
        let typePot = res.typePot;
        if (errorCode === 0) {
            var nDoor = this.getInfoDoorByTypePot(typePot);
            let isMe = this.isPlayerMe(userBet);
            this.listDetailTotalMoneyInDoor[typePot].push({ door: typePot, money: money });
            this.listTotalMoneyInDoor[typePot] += money;
            if (isMe) {
                this.isRecordingBet = false;
                this.activeBtnReBet(false);
                this.listDetailMoneyOfMeInDoor[typePot].push({ door: typePot, money: money });
                this.listMoneyOfMeInDoor[typePot] += money;
                this.myBalance = res.currentMoney;
                this.throwPhinhFromMeToDoor(nDoor, money);
                this.renderMoneyOfMeInDoor(this.listMoneyOfMeInDoor);
                // Update money
                this.playerMe.getComponent(BCPlayer).setBalance(res.currentMoney);
            } else {
                var nUser = this.getNodeUserInTable(userBet);
                if (!nUser) {
                    var nUser = this.playerExt;
                } else {
                    nUser.getComponent(BCPlayer).setBalance(res.currentMoney);
                }
                this.throwPhinhFromUserToDoor(nUser, nDoor, money);
            }
            this.renderTotalMoneyInDoor(this.listTotalMoneyInDoor);
        }
    }

    protected responseBcListExternalUsers(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaReceiveListExternalUsers();
        res.unpackData(data);
        ////////////////////////////////////////////
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        this.listExternalUsers = res.listExternalUsers;
        this.UI_ListUser.getComponent(BCListUser).show();
        this.UI_ListUser.getComponent(BCListUser).initData(this.listExternalUsers);
        ///////////////////////////////////
    }

    start() {
        this.UI_Dides.active = true;
        this.skeletonHandShake.active = false;
        this.UI_Dides.setPosition(this.listShakeDishes["SHRINK"].pos);
        this.UI_Dides.scale = this.listShakeDishes["SHRINK"].scale;
        this.initTempPlayer();
        this.initTempChat();
        this.initTempTransaction();
        this.hiddenAllPopup();
        this.activeUiToast(false);
        this.resetAllDefineMoneyInDoor();
        this.resetAllDoor();
        this.nDealer.getComponent(BCDealer).dealerNormal();
        this.activeBtnBet(this.betValue);
        this.activeCheers(false, 0);
        this.initMusic();
        this.schedule(() => {
            cmd.Send.sendBauCuaPingPong();
        }, 5);
        this.historyBetPerDoorOfMe = JSON.parse(cc.sys.localStorage.getItem("BC_HISTORY_BET"));
    }

    private initTempPlayer() {
        for (let i = 0; i < 7; i++) {
            let prfPlayer = cc.instantiate(this.prfPlayer);
            prfPlayer.getComponent(BCPlayer).init(i);
            this.players.push(prfPlayer);
            this.UI_Player.addChild(prfPlayer);
        }
        this.playerExt = this.UI_Player.getChildByName("BC_PLAYER_EXT");
        this.playerMe = this.UI_Player.getChildByName("BC_PLAYER_ME");
    }

    private initTempChat() {
        this.UI_Chat = cc.instantiate(this.prfChat);
        // this.UI_Chat.setPosition(cc.v3(-630, -50, 0));
        this.UI_Chat.zIndex = 999;
        this.closeUiChat();
        this.UI_Game.addChild(this.UI_Chat);
    }

    private initTempTransaction() {
        this.Ui_Transaction = cc.instantiate(this.prfTransaction);
        this.Ui_Transaction.setPosition(cc.v3(0, 0, 0));
        this.Ui_Transaction.zIndex = 9999;
        this.UI_Game.addChild(this.Ui_Transaction);
    }

    onDestroy() {
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_LOGIN);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_LOGOUT);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_DISCONNECTED);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_SUBSCRIBE);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_START_NEW_GAME);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_RESULT);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_BET);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_HISTORY);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_USER_JOIN_ROOM);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_USER_EXIT_ROOM);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_USER_OUT_ROOM);
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_USER_KICK_OUT);
        cc.director.getScheduler().unscheduleUpdate(this);
        BCConnector.instance.disconnect();
    }

    private shakeBowl(): void {
        cc.tween(this.UI_Dides).parallel(
            cc.tween().call(() => { this.showBowlDish }),
            this.acctionshakeBowl()
        ).call(() => {
            this.showHandDealer()
            this.skeletonHandShake.getComponent(sp.Skeleton).setAnimation(0, "lac-bat", true);
        }).delay(3).call(() => {
            this.shinkBowl()
        }).start();
    }

    private shinkBowl(): void {
        cc.tween(this.UI_Dides).parallel(
            cc.tween(this.UI_Dides).call(() => {
                this.showBowlDish()
            }),
            cc.tween(this.UI_Dides).to(this.timeShrinkBowl, { scale: this.listShakeDishes["SHRINK"].scale, position: this.listShakeDishes["SHRINK"].pos }, { easing: "easeInCubic" }),
        ).start();
    }

    private openBowl(res: cmd.BauCuaReceiveResult) {
        let dices = res.dices;
        let winTypes = res.winTypes;
        this.UI_Dides.getComponent(BCDices).setFaceDices(dices);
        cc.tween(this.UI_Dides).parallel(
            cc.tween().call(() => { this.showBowlDish }),
            this.acctionshakeBowl()
        ).delay(0.5).call(() => {
            this.UI_Dides.getComponent(BCDices).openBowl();
        }).delay(this.timeShowResultDices).call(() => {
            this.hidenBowlDish();
            this.bunnceDoorWins(winTypes);
            this.handleReward(res);
        }).call(() => {
            if (BCController.instance.countDoNotInteract >= 5) {
                this.onClickExitGame();
            }
        }).start();
    }

    private handleReward(res: any) {
        let listUserInTable = res.listUserInTable;
        let winTypes = res.winTypes;
        let infoMe = res.infoMe;
        this.scheduleOnce(() => {
            let arPointDealer = BCDealer.instance.nChips.convertToWorldSpaceAR(cc.v2(0, 0));
            let isChipLose = false;
            // Thu tiền cửa thua
            this.nDealer.getComponent(BCDealer).notiLoser();
            for (let i = 0; i < 21; i++) {
                let nDoorLose = this.getInfoDoorByTypePot(i);
                if (!_.includes(winTypes, i) && nDoorLose) {
                    isChipLose = true;

                    let objDoorLose = nDoorLose.getComponent(BCDoor);
                    let chips = _.clone(objDoorLose.getAllChipInDoor());
                    objDoorLose.removeAllChipInDoor();
                    for (let j = 0; j < chips.length; j++) {
                        let nChipLose = chips[j];
                        objDoorLose.addChip(nChipLose);
                        var posToDealer = nDoorLose.convertToNodeSpaceAR(arPointDealer);
                        cc.tween(nChipLose).to(this.timePhinh, { position: cc.v3(posToDealer.x, posToDealer.y, 0) }, { easing: "cubicInOut" }).call(() => {
                            nChipLose.removeFromParent(true);
                        }).start();
                    }
                }
            }

            if (isChipLose) {
                BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.CHIP_MOVE_DEALER);
                this.nDealer.getComponent(BCDealer).collectMoney();
            }

            // Trả tiền cửa thắng
            this.scheduleOnce(() => {
                let isChipWin = false;
                for (let k = 0; k < 21; k++) {
                    let nDoorWin = this.getInfoDoorByTypePot(k);
                    if (_.includes(winTypes, k) && nDoorWin) {
                        isChipWin = true;
                        let arPoint = nDoorWin.convertToWorldSpaceAR(cc.v2(0, 0));
                        let chips = nDoorWin.getComponent(BCDoor).getAllChipInDoor();
                        for (let h = 0; h < chips.length; h++) {
                            var posToDealerT = BCDealer.instance.nChips.convertToNodeSpaceAR(arPoint);
                            let money = chips[h].getComponent(BCPhinh).money;
                            if (money > 0) {
                                let nChipWin = cc.instantiate(this.prfChip);
                                nChipWin.getComponent(BCPhinh).setFaceMoney(money);
                                this.nDealer.getComponent(BCDealer).addChip(nChipWin);
                                let posSlip = nDoorWin.getComponent(BCDoor).getRandomPosOfChip();
                                cc.tween(nChipWin).to(this.timePhinh, { position: cc.v3(posToDealerT.x + posSlip.x, posToDealerT.y + posSlip.y, 0) }, { easing: "cubicInOut" }).call(() => {
                                    nChipWin.removeFromParent(true);
                                    nChipWin.setPosition(posSlip);
                                    nDoorWin.getComponent(BCDoor).addChip(nChipWin);
                                }).start();
                            }
                        }
                    }
                }
                if (isChipWin) {
                    BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.CHIP_MOVE_TABLE);
                    this.nDealer.getComponent(BCDealer).payMoney();
                }
            }, 1.5);

            this.scheduleOnce(() => {
                for (let i = 0; i < 21; i++) {
                    var nDoor = this.getInfoDoorByTypePot(i);
                    nDoor.getComponent(BCDoor).removeAllChipInDoor();
                }
                this.givePrizeForMe(infoMe);
                this.givePrizeForGuest(listUserInTable);
                this.givePrizeForOther(res.listWinUserOutTable);
            }, 3);
        }, 0.001);
    }

    private givePrizeForMe(infoMe: cmd.User) {
        let listWinOfMe = infoMe.listWin;
        let totalMoneyWinOfMe = 0;
        if (listWinOfMe) {
            const pairsUser = this.spitListWin1(listWinOfMe);
            pairsUser.forEach((pair) => {
                const [door, money] = this.spitListWin2(pair);
                totalMoneyWinOfMe += parseInt(money);
                var nDoor = this.getInfoDoorByTypePot(parseInt(door));
                nDoor.getComponent(BCDoor).showMoneyWinOfMe(parseInt(money));
                this.receivePhinhFromDoorWinToMe(nDoor, parseInt(money));
            });
            this.playerMe.getComponent(BCPlayer).showPrize(totalMoneyWinOfMe);
            if (totalMoneyWinOfMe > 0) {
                this.activeCheers(true, totalMoneyWinOfMe);
            }
        }
    }

    private givePrizeForGuest(listUserInTable: Array<cmd.User>) {
        for (let itemUser of listUserInTable) {
            var userGuest = this.getNodeUserInTable(itemUser.userName);
            let totalMoneyWinOfGuest = 0;
            if (userGuest) {
                var listWinOfGuest = itemUser.listWin;
                if (listWinOfGuest) {
                    const pairsUser = this.spitListWin1(listWinOfGuest);
                    pairsUser.forEach((pair) => {
                        const [door, money] = this.spitListWin2(pair);
                        totalMoneyWinOfGuest += parseInt(money);
                        var nDoor = this.getInfoDoorByTypePot(parseInt(door));
                        this.receivePhinhFromDoorWinToUser(userGuest, nDoor, parseInt(money), false);
                    });
                    userGuest.getComponent(BCPlayer).showPrize(totalMoneyWinOfGuest);
                }
            }
        }
    }

    private givePrizeForOther(listWin: string) {
        let totalMoneyWinOfOther = 0;
        if (listWin) {
            const pairsUser = listWin.split(";");
            pairsUser.forEach((pair) => {
                const [door, money] = this.spitListWin2(pair);
                totalMoneyWinOfOther += parseInt(money);
                var nDoor = this.getInfoDoorByTypePot(parseInt(door));
                this.receivePhinhFromDoorWinToOther(nDoor, parseInt(money));
            });
            this.playerExt.getComponent(BCPlayer).showPrize(totalMoneyWinOfOther);
        }
    }

    private acctionshakeBowl() {
        BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.SHAKE_BOWL);
        return cc.tween(this.UI_Dides).to(this.timeExpandBowl, { scale: this.listShakeDishes["EXPAND"].scale, position: this.listShakeDishes["EXPAND"].pos }, { easing: "easeOutCubic" });
    }

    private hidenBowlDish() {
        this.UI_Dides.getComponent(BCDices).showBowl();
        this.skeletonHandShake.active = false;
        this.UI_Dides.opacity = 0;
        this.UI_Dides.scale = this.listShakeDishes["SHRINK"].scale;
        this.UI_Dides.position = this.listShakeDishes["SHRINK"].pos;
    }

    private showBowlDish() {
        this.UI_Dides.getComponent(BCDices).showBowl();
        this.skeletonHandShake.active = false;
        this.UI_Dides.opacity = 255;
        this.UI_Dides.active = true;
    }

    private showHandDealer() {
        this.skeletonHandShake.active = true;
        this.UI_Dides.opacity = 0;
    }

    private backToLobby() {
        BCConnector.instance.disconnect();
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

    private isPlayerMe(nickName: string): boolean {
        return (this.playerMe.getComponent(BCPlayer).nickName === nickName);
    }

    private getInfoUserByIndex(index: number): cc.Node {
        return this.players[index];
    }

    private getNodeUserInTable(nickName: string): cc.Node {
        return this.players.find((nUser) => {
            return nUser.getComponent(BCPlayer).nickName == nickName;
        })
    }

    private getInfoDoorByTypePot(typePot: number): cc.Node {
        if (this.doors[typePot]) {
            return this.doors[typePot];
        } else {
            // console.error("ERROR", "Không có door");
            return null;
        }
    }

    private bunnceDoorWins(winTypes: Array<number>) {
        for (let i = 0; i < this.doors.length; i++) {
            let nDoor = this.doors[i];
            if (nDoor) {
                let door = nDoor.getComponent(BCDoor).getDoorId()
                if (_.includes(winTypes, door)) {
                    nDoor.getComponent(BCDoor).showAura();
                } else {
                    nDoor.getComponent(BCDoor).stopAura();
                }
            }
        }
    }

    private initMoneyInDoor(listBet: string) {
        let arrListBet = this.spitListBet1(listBet); // example 0&100000:1
        arrListBet.forEach((pair) => {
            const [door, moneyAndCount] = this.spitListBet2(pair); //  0 va 100000:1
            if (moneyAndCount) {
                const [money, count] = this.spitListBet3(moneyAndCount);
                if (money && parseInt(money) > 0) {
                    var nDoor = this.getInfoDoorByTypePot(parseInt(door));
                    for (let i = 0; i < parseInt(count); i++) {
                        let nChipBet = cc.instantiate(this.prfChip);
                        nChipBet.getComponent(BCPhinh).setFaceMoney(parseInt(money));
                        let posSlip = nDoor.getComponent(BCDoor).getRandomPosOfChip();
                        nChipBet.setPosition(posSlip);
                        nDoor.getComponent(BCDoor).addChip(nChipBet);
                    }
                }
            }
        });
    }

    private renderUserInSeat(listUser: Array<cmd.User>) {
        let guestAccounts = listUser.filter((itemUser) => {
            return !itemUser.isMe
        });
        for (let i = 0; i < 7; i++) {
            let objPlayer = this.players[i];
            let userItem = guestAccounts[i];
            if (userItem && objPlayer) {
                objPlayer.getComponent(BCPlayer).showPlayer();
                objPlayer.getComponent(BCPlayer).updateInfo(userItem);
            } else {
                objPlayer.getComponent(BCPlayer).hidePlayer();
            }
        }
    }

    private renderTotalMoneyInDoor(listMoney: Object) {
        for (let door in listMoney) {
            let money = listMoney[door];
            let nDoor = this.doors[door];
            nDoor.getComponent(BCDoor).setTotalMoneyInDoor(money);
        }
    }

    private calcMoneyOfMeInDoor(infoMe: cmd.User) {
        let listBetOfMe = infoMe.listBet;
        if (listBetOfMe) {
            let arrListBet = this.spitListBet1(listBetOfMe);
            arrListBet.forEach((pair) => {
                const [door, moneyAndCount] = this.spitListBet2(pair); //  0 va 100000:1
                if (moneyAndCount) {
                    const [money, count] = this.spitListBet3(moneyAndCount);
                    if (money && parseInt(money) > 0) {
                        for (let i = 0; i < parseInt(count); i++) {
                            this.listDetailMoneyOfMeInDoor[door].push({ door: parseInt(door), money: parseInt(money) });
                            this.listMoneyOfMeInDoor[door] += parseInt(money);
                            this.listDetailTotalMoneyInDoor[door].push({ door: parseInt(door), money: parseInt(money) });
                            this.listTotalMoneyInDoor[door] += parseInt(money);
                        }
                    }
                }
            });
        }
        this.renderMoneyOfMeInDoor(this.listMoneyOfMeInDoor);
    }

    private calcTotalMoneyInDoorOfPlayerInChair(users: Array<cmd.User>) {
        for (let user of users) {
            if (!user.isMe) {
                let listBet = user.listBet;
                let arrListBet = this.spitListBet1(listBet);
                arrListBet.forEach((pair) => {
                    const [door, moneyAndCount] = this.spitListBet2(pair); //  0 va 100000:1
                    if (moneyAndCount) {
                        const [money, count] = this.spitListBet3(moneyAndCount);
                        if (money && parseInt(money) > 0) {
                            for (let i = 0; i < parseInt(count); i++) {
                                this.listDetailTotalMoneyInDoor[door].push({ door: parseInt(door), money: parseInt(money) });
                                this.listTotalMoneyInDoor[door] += parseInt(money);
                            }
                        }
                    }
                });
            }
        }
    }

    private calcTotalMoneyInDoorOfPlayOutTable(listBetOfUserOutTable) {
        let arrListBet = this.spitListBet1(listBetOfUserOutTable);
        arrListBet.forEach((pair) => {
            const [door, moneyAndCount] = this.spitListBet2(pair); //  0 va 100000:1
            if (moneyAndCount) {
                const [money, count] = this.spitListBet3(moneyAndCount);
                if (money && parseInt(money) > 0) {
                    for (let i = 0; i < parseInt(count); i++) {
                        this.listDetailTotalMoneyInDoor[door].push({ door: parseInt(door), money: parseInt(money) });
                        this.listTotalMoneyInDoor[door] += parseInt(money);
                    }
                }
            }
        });
    }

    private spitListBet1(str: string) {
        return str.split("/");
    }

    private spitListBet2(str: string) {
        return str.split("&");
    }

    private spitListBet3(str: string) {
        return str.split(":");
    }

    private spitListWin1(str: string) {
        return str.split(";");
    }

    private spitListWin2(str: string) {
        return str.split(":");
    }

    private renderMoneyOfMeInDoor(listMoneyOfMeInDoor: object) {
        for (let door in listMoneyOfMeInDoor) {
            let money = listMoneyOfMeInDoor[door];
            let nDoor = this.doors[door];
            nDoor.getComponent(BCDoor).setMoneyOfMeInDoor(money);
        }
    }

    private throwPhinhFromUserToDoor(nUser: cc.Node, nDoor: cc.Node, money: number): void {
        BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.CHIP_BET);
        if (money > 0) {
            let nChipBet = cc.instantiate(this.prfChip);
            nChipBet.getComponent(BCPhinh).setFaceMoney(money);
            nUser.getComponent(BCPlayer).addChip(nChipBet);
            let arPoint = nDoor.convertToWorldSpaceAR(cc.v2(0, 0));
            var posDoor = nUser.convertToNodeSpaceAR(arPoint);
            let posSlip = nDoor.getComponent(BCDoor).getRandomPosOfChip();
            cc.tween(nChipBet).to(this.timePhinh, { position: cc.v3(posDoor.x + posSlip.x, posDoor.y + posSlip.y, 0) }, { easing: "cubicInOut" }).call(() => {
                nChipBet.removeFromParent(true);
                nChipBet.setPosition(posSlip);
                nDoor.getComponent(BCDoor).addChip(nChipBet);
            }).start();
        }
    }

    private throwPhinhFromMeToDoor(nDoor: cc.Node, money: number) {
        let nUser = this.playerMe;
        this.throwPhinhFromUserToDoor(nUser, nDoor, money);
    }

    private receivePhinhFromDoorWinToUser(nUser: cc.Node, nDoor: cc.Node, money: number, isMe: boolean) {
        if (nUser && nDoor && money > 0) {
            BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.CHIP_MOVE_TABLE);
            let nChipPrize = cc.instantiate(this.prfChip);
            nChipPrize.getComponent(BCPhinh).setFaceMoney(money);
            nDoor.getComponent(BCDoor).addChip(nChipPrize);
            let arPoint = nUser.convertToWorldSpaceAR(cc.v2(0, 0));
            var posUser = nDoor.convertToNodeSpaceAR(arPoint);
            let posMove = (isMe) ? cc.v3(posUser.x - 100, posUser.y, 0) : cc.v3(posUser.x, posUser.y, 0);
            cc.tween(nChipPrize).to(this.timePhinh, { position: posMove }, { easing: "cubicInOut" }).call(() => {
                nChipPrize.removeFromParent(true);
            }).start();
        }
    }

    private receivePhinhFromDoorWinToMe(nDoor: cc.Node, money: number) {
        this.receivePhinhFromDoorWinToUser(this.playerMe, nDoor, money, true);
    }

    private receivePhinhFromDoorWinToOther(nDoor: cc.Node, money: number) {
        this.receivePhinhFromDoorWinToUser(this.playerExt, nDoor, money, false);
    }

    private resetAllDefineMoneyInDoor(): void {
        this.initDetailMoneyOfMeInDoor();
        this.initDetailTotalMoneyInDoor();
        this.initTotalMoneyInDoor();
        this.initMoneyOfMeInDoor();
    }

    private initDetailTotalMoneyInDoor(): void {
        this.listDetailTotalMoneyInDoor = { [cmd.Config.CA]: [], [cmd.Config.TOM]: [], [cmd.Config.CA]: [], [cmd.Config.GA]: [], [cmd.Config.HO]: [], [cmd.Config.VOI]: [], [cmd.Config.RUA]: [], [cmd.Config.TOM_GA]: [], [cmd.Config.TOM_VOI]: [], [cmd.Config.TOM_CA]: [], [cmd.Config.HO_RUA]: [], [cmd.Config.HO_CA]: [], [cmd.Config.GA_HO]: [], [cmd.Config.GA_RUA]: [], [cmd.Config.CA_VOI]: [], [cmd.Config.HO_TOM]: [], [cmd.Config.TOM_RUA]: [], [cmd.Config.RUA_CA]: [], [cmd.Config.CA_GA]: [], [cmd.Config.GA_VOI]: [], [cmd.Config.VOI_HO]: [], [cmd.Config.VOI_RUA]: [], };
    }

    private initDetailMoneyOfMeInDoor(): void {
        this.listDetailMoneyOfMeInDoor = { [cmd.Config.CA]: [], [cmd.Config.TOM]: [], [cmd.Config.CA]: [], [cmd.Config.GA]: [], [cmd.Config.HO]: [], [cmd.Config.VOI]: [], [cmd.Config.RUA]: [], [cmd.Config.TOM_GA]: [], [cmd.Config.TOM_VOI]: [], [cmd.Config.TOM_CA]: [], [cmd.Config.HO_RUA]: [], [cmd.Config.HO_CA]: [], [cmd.Config.GA_HO]: [], [cmd.Config.GA_RUA]: [], [cmd.Config.CA_VOI]: [], [cmd.Config.HO_TOM]: [], [cmd.Config.TOM_RUA]: [], [cmd.Config.RUA_CA]: [], [cmd.Config.CA_GA]: [], [cmd.Config.GA_VOI]: [], [cmd.Config.VOI_HO]: [], [cmd.Config.VOI_RUA]: [], };
    }

    private initTotalMoneyInDoor(): void {
        this.listTotalMoneyInDoor = { [cmd.Config.CA]: 0, [cmd.Config.TOM]: 0, [cmd.Config.CA]: 0, [cmd.Config.GA]: 0, [cmd.Config.HO]: 0, [cmd.Config.VOI]: 0, [cmd.Config.RUA]: 0, [cmd.Config.TOM_GA]: 0, [cmd.Config.TOM_VOI]: 0, [cmd.Config.TOM_CA]: 0, [cmd.Config.HO_RUA]: 0, [cmd.Config.HO_CA]: 0, [cmd.Config.GA_HO]: 0, [cmd.Config.GA_RUA]: 0, [cmd.Config.CA_VOI]: 0, [cmd.Config.HO_TOM]: 0, [cmd.Config.TOM_RUA]: 0, [cmd.Config.RUA_CA]: 0, [cmd.Config.CA_GA]: 0, [cmd.Config.GA_VOI]: 0, [cmd.Config.VOI_HO]: 0, [cmd.Config.VOI_RUA]: 0, };
    }

    private initMoneyOfMeInDoor(): void {
        this.listMoneyOfMeInDoor = { [cmd.Config.CA]: 0, [cmd.Config.TOM]: 0, [cmd.Config.CA]: 0, [cmd.Config.GA]: 0, [cmd.Config.HO]: 0, [cmd.Config.VOI]: 0, [cmd.Config.RUA]: 0, [cmd.Config.TOM_GA]: 0, [cmd.Config.TOM_VOI]: 0, [cmd.Config.TOM_CA]: 0, [cmd.Config.HO_RUA]: 0, [cmd.Config.HO_CA]: 0, [cmd.Config.GA_HO]: 0, [cmd.Config.GA_RUA]: 0, [cmd.Config.CA_VOI]: 0, [cmd.Config.HO_TOM]: 0, [cmd.Config.TOM_RUA]: 0, [cmd.Config.RUA_CA]: 0, [cmd.Config.CA_GA]: 0, [cmd.Config.GA_VOI]: 0, [cmd.Config.VOI_HO]: 0, [cmd.Config.VOI_RUA]: 0, };
    }

    private resetAllDoor() {
        for (let i = 0; i < 21; i++) {
            let nDoor = this.doors[i];
            nDoor.getComponent(BCDoor).resetNewSession();
            nDoor.getComponent(BCDoor).stopAura();
            nDoor.getComponent(BCDoor).removeAllChipInDoor();
        }
    }
    ///////////////////
    public onClickScrollLeft() {
        BCController.instance.countDoNotInteract = 0;
        BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.BTN_CLICK);
        this.currentScroll -= this.stepScroll;
        if (this.currentScroll < 0) {
            this.currentScroll = 0
        }
        this.scrollViewBet.scrollToPercentHorizontal(this.currentScroll, .3);
    }

    public onClickScrollRight() {
        BCController.instance.countDoNotInteract = 0;
        BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.BTN_CLICK);
        this.currentScroll += this.stepScroll;
        if (this.currentScroll > 1) {
            this.currentScroll = 1
        }
        this.scrollViewBet.scrollToPercentHorizontal(this.currentScroll, .3);
    }
    ///////////////////////

    public onClickTipToBanker() {
        BCController.instance.countDoNotInteract = 0;
        cmd.Send.sendTipToBanker();
    }

    public onClickClose() {
        BCController.instance.countDoNotInteract = 0;
        this.unSubscribeGame();
    }

    private unSubscribeGame() {
        cmd.Send.sendBauCuaUnSubcribe(this.roomId);
        cc.audioEngine.stopAll();
        this.unscheduleAllCallbacks();
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

    public onClickBet(event, money) {
        BCController.instance.countDoNotInteract = 0;
        this.betValue = parseInt(money);
        this.activeBtnBet(money);
    }

    private activeBtnBet(money) {
        for (let item of this.listBtnBet) {
            item.getComponent(cc.Animation).play("EffectStopBtnBet");
        }
        let index = this.defFaceMoney[money];
        this.listBtnBet[index].getComponent(cc.Animation).play("EffectBtnBet");
    }

    public onSubmitBet(typePot: number) {
        BCController.instance.countDoNotInteract = 0;
        let myBalance = this.playerMe.getComponent(BCPlayer).getBalance();
        if (!(myBalance >= this.betValue)) {
            this.showToast(BCLanguageMgr.getString("minibaucua.bc_err_bet_2"));
            return;
        }
        if (!this.bettingState) {
            this.showToast(BCLanguageMgr.getString("minibaucua.bc_err_bet_1"));
            return;
        }
        this.isRecordingBet = true;
        cmd.Send.sendBauCuaBet(typePot, this.betValue);
        // if (this.isRecordingBet) {
        //     this.showToast(LanguageMgr.getString("minibaucua.bc_err_bet_0"));
        // } else {
        //     this.isRecordingBet = true;
        //     cmd.Send.sendBauCuaBet(typePot, this.betValue);
        // }
    }

    public onClickExitGame() {
        cmd.Send.sendBauCuaUserExitRoom(this.roomId);
        this.hiddenAllPopup();
    }

    public onClickToggleGuide() {
        BCController.instance.countDoNotInteract = 0;
        this.openUiGuide();
        this.hiddenAllPopup();
    }

    private hiddenAllPopup() {
        this.closeUiMenu();
    }

    public onClickSound() {
        BCController.instance.countDoNotInteract = 0;
        this.hiddenAllPopup();
        this._localIsMusic = !this._localIsMusic;
        this.bgBtnMusic.getComponent(cc.Sprite).spriteFrame = this.spFrameIconMusic[(this._localIsMusic) ? 1 : 0];
        BCSoundControler.instance.onOffMusic(this._localIsMusic);
    }

    public onClickchat() {
        BCController.instance.countDoNotInteract = 0;
        this.UI_Chat.active = !this.UI_Chat.active;
        this.hiddenAllPopup();
    }

    public onClickShopping(): void {
        BCController.instance.countDoNotInteract = 0;
        this.hiddenAllPopup();
    }

    public onClickHistory(): void {
        BCController.instance.countDoNotInteract = 0;
        this.Ui_Transaction.getComponent(BCTransaction).show();
        cmd.Send.sendTransaction();
        this.hiddenAllPopup();
    }

    public onClickMenu(event: cc.Event, data: any) {
        BCController.instance.countDoNotInteract = 0;
        this.openUiMenu();
    }

    private closeUiMenu() {
        this.nBtnBack.active = true;
        this.UI_Menu.active = false;
    }

    private openUiMenu() {
        this.nBtnBack.active = false;
        this.UI_Menu.active = true;
    }

    private isShowGuide: boolean = false;

    private openUiGuide() {
        if (!this.isShowGuide) {
            this.isShowGuide = true;
            cc.tween(this.Ui_Guide).by(0.5, { position: cc.v3(1000, 0, 0) }).start();
        }
    }

    private closeUiGuide() {
        if (this.isShowGuide) {
            this.isShowGuide = false;
            cc.tween(this.Ui_Guide).by(0.5, { position: cc.v3(-1000, 0, 0) }).start();
        }
    }

    private calcTotal(infoBet: any): number {
        let totalMoney = 0;
        for (let key in infoBet) {
            totalMoney += infoBet[key];
        }
        return totalMoney;
    }

    protected onClickReBet() {
        BCController.instance.countDoNotInteract = 0;
        let infoBet = null;
        for (let key in this.historyBetPerDoorOfMe) {
            let data = this.historyBetPerDoorOfMe[key];
            let total = this.calcTotal(data);
            if (total > 0) {
                infoBet = data;
            }
        }
        let totalMoney = (infoBet) ? this.calcTotal(infoBet) : 0;
        let myBalance = this.playerMe.getComponent(BCPlayer).getBalance();
        if (myBalance < totalMoney) {
            this.showToast(BCLanguageMgr.getString("minibaucua.bc_err_bet_2"));
            return;
        }
        if (!this.bettingState) {
            this.showToast(BCLanguageMgr.getString("minibaucua.bc_err_bet_1"));
            return;
        }
        if (totalMoney <= 0) {
            this.showToast(BCLanguageMgr.getString("minibaucua.bc_have_not_before"));
            return;
        }
        if (infoBet && myBalance >= totalMoney && totalMoney > 0) {
            if (this.bettingState && !this.isRecordingBet) {
                this.isRecordingBet = true;
                for (let door in infoBet) {
                    let money = infoBet[door];
                    cmd.Send.sendBauCuaBet(parseInt(door), parseInt(money));
                }
            }
        }
    }

    private activeBtnReBet(isActive: boolean) {
        this.btnReBet.active = isActive;
    }
}
