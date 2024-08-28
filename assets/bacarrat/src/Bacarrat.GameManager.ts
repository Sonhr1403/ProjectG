import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import Bacarrat_Popup from "./Bacarat.Popup";


import Bacarrat_CardManager from "./Bacarrat.CardManager";
import Bacarrat_Chip from "./Bacarrat.Chip";
import Bacarrat_ChipManager from "./Bacarrat.ChipManager";
import Bacarrat_ClockCountDown from "./Bacarrat.ClockCountDown";
import { Bacarrat_Const, IDataPlayer } from "./Bacarrat.Const";
import Bacarrat_MyChipPot from "./Bacarrat.MyChipPot";
import Bacarrat_NanBai from "./Bacarrat.NanBai";
import Bacarrat_NotifyManager from "./Bacarrat.NotifyManager";

import Bacarrat_PlayerManager from "./Bacarrat.PlayerManager";
import Bacarrat_PotOnTableManager from "./Bacarrat.PotOnTableManager";
import Bacarrat_SoiCauInGame from "./Bacarrat.SoiCauInGame";
import Bacarrat_SoundManager, { SOUNDTYPE } from "./Bacarrat.SoundManager";
import { Bacarrat_CMD } from "./network/Bacarrat.Cmd";
import { Bacarrat_Connector } from "./network/Bacarrat.Connector";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_GameManager extends cc.Component {

    static instance: Bacarrat_GameManager = null;

    @property(cc.Node)
    maskClose: cc.Node = null;

    @property(cc.Label)
    lb_noti: cc.Label = null;

    @property(cc.SpriteFrame)
    spfAvatar: cc.SpriteFrame = null

    @property(Bacarrat_Popup)
    nPopup: Bacarrat_Popup = null;

    @property(cc.Node)
    nSoiCauSmall: cc.Node = null

    @property(cc.Node)
    notifyDealer: cc.Node = null

    @property(Bacarrat_SoundManager)
    soundManager: Bacarrat_SoundManager = null;

    @property(Bacarrat_PlayerManager)
    playerManager: Bacarrat_PlayerManager = null;

    @property(Bacarrat_ChipManager)
    chipManager: Bacarrat_ChipManager = null;

    @property(Bacarrat_CardManager)
    cardManager: Bacarrat_CardManager = null;

    @property(Bacarrat_PotOnTableManager)
    potOnTableManager: Bacarrat_PotOnTableManager = null;

    @property(Bacarrat_MyChipPot)
    myChipPotManager: Bacarrat_MyChipPot = null;

    @property(Bacarrat_SoiCauInGame)
    nSoiCauInGame: Bacarrat_SoiCauInGame = null;

    @property(Bacarrat_ClockCountDown)
    clockCountDownTime: Bacarrat_ClockCountDown = null;

    @property(Bacarrat_NotifyManager)
    notifyManager: Bacarrat_NotifyManager = null;

    @property(cc.Node)
    nNanBai: cc.Node = null;

    @property(cc.Label)
    lbSeasionId: cc.Label = null;
    @property(cc.Label)
    lbNumMorePlayer: cc.Label = null;

    @property(cc.Label)
    lbPointPlayer: cc.Label = null;

    @property(cc.Label)
    lbPointBanker: cc.Label = null;

    @property(sp.Skeleton)
    skeAnimTie: sp.Skeleton = null;

    @property(sp.Skeleton)
    skWinPlayer: sp.Skeleton = null;

    @property(sp.Skeleton)
    skWinBanker: sp.Skeleton = null;

    @property(cc.Button)
    btnX2: cc.Button = null;

    @property(cc.Button)
    btnRebet: cc.Button = null;

    private _listHistory = []
    private _listMySaveBet = [];
    private _seasionId: number = -1;


    hideTime: number = null;
    public _isGameActive: boolean = true;
    public _scheduler = null;
    public _actionIsRunning = null;
    public _listAction = [];


    isPlaying = false;
    numRoundGame = 0;

    onLoad() {
        Bacarrat_GameManager.instance = this;

        if (!BGUI.UserManager.instance.mainUserInfo) return;

        let str = BGUI.UserManager.instance.mainUserInfo.nickname + '_saveChipBet';
        let sBet = cc.sys.localStorage.getItem(str);
        if (sBet === null)
            this._listMySaveBet = []
        else
            this._listMySaveBet = JSON.parse(cc.sys.localStorage.getItem(str));

    }

    onEnable() {
        // Bacarrat_Connector.getInstance().getIPGame();

        this._updateLangByUrl()

        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.GET_GAME_INFO, this.onGetGameInfo, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.NEW_USER_JOIN_ROOM, this.onNewUserJoin, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.DEAL_CARD, this.onStartDealCard, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.CONTINUE_DEALCARD, this.onCotinueDealCard, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.END_GAME, this.onEndGame, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.INFO_PLAYER_BET, this.onInfoPlayerBet, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.START_GAME, this.onStartGame, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.CHAT_ROOM, this.onChatRoom, this)
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.NOTIFY_QUIT_ROOM, this.onNotifyQuitGame, this);
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.KICK_ROOM, this.onKickRoom, this);
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.USER_EXIT, this.onUserLeaveRoom, this);
        Bacarrat_Connector.instance.addCmdListener(1, this.onBacarratLoginSuccess, this)

        BGUI.EventDispatch.instance.add("SEND_CHAT_EMO", this.sendChatEmo, this);
        BGUI.EventDispatch.instance.add("SEND_CHAT_TEXT", this.sendChatText, this);

        cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
        cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);

        this._scheduler = window.setInterval(this.updateOffline.bind(this), 1000 / 60);

        BGUI.AudioManager.instance.musicVolume = 0;
        this.soundManager.initData();

        Bacarrat_Connector.instance.connect();
    }

    onDisable() {
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.GET_GAME_INFO);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.NEW_USER_JOIN_ROOM);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.DEAL_CARD);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.CONTINUE_DEALCARD);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.END_GAME);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.START_GAME);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.NOTIFY_QUIT_ROOM);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.KICK_ROOM);
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.USER_EXIT);
        Bacarrat_Connector.instance.removeCmdListener(this, 1)
        Bacarrat_Connector.instance.removeCmdListener(this);

        BGUI.EventDispatch.instance.remove("SEND_CHAT_EMO", this.sendChatEmo, this);
        BGUI.EventDispatch.instance.remove("SEND_CHAT_TEXT", this.sendChatText, this);

        BGUI.AudioManager.instance.musicVolume = 1;

        Bacarrat_Connector.instance.disconnect();
    }

    sendQuickText(data) {
        BGUI.ZLog.log("sendQuickText ---> ", data);

        let pk = new Bacarrat_CMD.SendChatRoom()
        pk.isIcon = 0;
        pk.content = data;

        Bacarrat_Connector.instance.sendPacket(pk);
    }

    sendChatText(data) {
        BGUI.ZLog.log("sendChatText ---> ", data);

        let pk = new Bacarrat_CMD.SendChatRoom()
        pk.isIcon = 0;
        pk.content = data;

        Bacarrat_Connector.instance.sendPacket(pk);
    }

    sendChatEmo(data) {
        BGUI.ZLog.log("sendChatEmo ---> ");

        let pk = new Bacarrat_CMD.SendChatRoom()
        pk.isIcon = 1;
        pk.content = data;

        Bacarrat_Connector.instance.sendPacket(pk);
    }

    onBacarratLoginSuccess(cmd, data) {
        BGUI.ZLog.log("onBacarratLoginSuccess--->: ");
        let res = new Bacarrat_CMD.ReceivedLogin();
        res.unpackData(data);



        const url = window.location.href;
        let urlSearchParams = new URLSearchParams(url.split('?')[1]);
        if (url && url.includes('?') && urlSearchParams) {
            BGUI.ZLog.log("onBacarratLoginSuccess byURL--->: ", res);
            if (res.getError() == BGUI.ErrorDefine.SUCCESS) {
                let userData: BGUI.IUserInfo = {
                    sessionKey: "",
                    nickname: "",
                    facebookId: "",
                    vinTotal: 1,
                    xuTotal: 1,
                    vippoint: 1,
                    vippointSave: 1,
                    createTime: "",
                    IP: "",
                    reference: "",
                    avatar: "",
                    certificate: "",
                    birthday: "",
                    luckyRotate: 1,
                    sessionKeyId: 1,
                    accessToken: "",
                    username: "",
                    identification: "",
                    email: "",
                    mobile: "",
                    mobileSecurity: "",
                    emailSecurity: "",
                    appSecurity: "",
                    loginSecure: "",
                    moneyLoginOtp: "",
                    moneyUse: "",
                    safe: "",
                    configGame: "",
                    userID: 1,
                    game: "",
                };
                // BGUI.UserManager.instance.mainUserInfo[''] = res.userId;
                userData.nickname = res.username;
                userData.username = res.username;
                userData.avatar = res.avatar;
                userData.vinTotal = res.currentMoney;

                BGUI.UserManager.instance.mainUserInfo = userData;
                BGUI.ZLog.log('BGUI.UserManager -> ', BGUI.UserManager.instance.mainUserInfo)
                this.sendJoinRoom();
            } else {
                BGUI.ZLog.log("onBacarratLoginFailed--->: ", cmd, res.getError());

                const url = window.location.href;
                let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                    Bacarrat_GameManager.instance.maskClose.active = true
                    Bacarrat_GameManager.instance.lb_noti.string = LanguageMgr.getString('bacarrat.noti.connection_error');
                } else {
                    BGUI.UIPopupManager.instance.showPopupSmall(res.getError().toString());
                }
            }
        } else {
            BGUI.ZLog.log("onBacarratLoginSuccess Normal--->: ", res);
            if (res.getError() == BGUI.ErrorDefine.SUCCESS) {
                this.sendJoinRoom();
            } else {
                const url = window.location.href;
                let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                    Bacarrat_GameManager.instance.maskClose.active = true
                    Bacarrat_GameManager.instance.lb_noti.string = res.getError().toString()
                } else {
                    BGUI.UIPopupManager.instance.showPopupSmall(res.getError().toString());
                }
            }
        }
    }

    sendJoinRoom() {
        let pk = new Bacarrat_CMD.SendJoinRoomType();
        pk.id = 1;
        pk.moneyBet = 1;
        pk.minMoney = 1;
        pk.maxMoney = 1;
        pk.maxUserPerRoom = 1;
        Bacarrat_Connector.instance.sendPacket(pk);
    }

    updateOffline() {
        if (!this._isGameActive) {
            if (cc.sys.isBrowser) {
                cc.director.mainLoop();
            }
            // cc.log("vao day em oi.." + cc.director.getTotalFrames());
        }
    }

    _onShowGame() {
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

    _onHideGame() {
        this._isGameActive = false;
        if (cc.sys.isNative && cc.sys.isMobile) {
            this.hideTime = performance.now();
        } else {
            cc.game.pause();
        }
    }

    cleanUpAllAction() {
        //override
        for (var i = 0; i < this._listAction.length; ++i) {
            this._listAction[i] = null;
        }

        this._listAction.splice(0, this._listAction.length);
    }

    addAction(action) {
        this._listAction.push(action);
    }

    actionStart() {
        this._actionIsRunning = true;
    }

    actionDone() {
        this._actionIsRunning = false;
    }


    onGetGameInfo(cmd, data) {
        this.isPlaying = false;
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedGetInfoGame();
            res.unpackData(data);
        }

        this.numRoundGame = 0;

        BGUI.ZLog.log("onGetGameInfo ---> ", res);

        this.cleanUpAllAction();
        this.actionDone();

        this.playerManager.setData(res.listPlayers);

        this.cardManager.isDealCard = false;
        this.cardManager.setData(res);

        this.chipManager.chipReconnect(res.listPlayers)

        if (res.stateGame === 0) {
            // this.notifyManager.showNotify("Đang trong thời gian cược")
            this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.time_bet'))

            this.clockCountDownTime.startCountDown(res.currentTime);
        }
        if (res.stateGame === 1) {
            this.isPlaying = true;
            this.clockCountDownTime.startCountDown(0);
            // phase mở 4 lá đầu
            if (res.currentTime >= 17) {
                this.cardManager.startDealCard();

                // mở bài bình thường
            } else if (res.currentTime >= 13) {
                // mở lá 1 player luôn và vẫn chạy animation mở 3 lá  còn lại
                this.cardManager.showCardNotAnim(4, false);
                this.cardManager.openShowCardPlayer1(null, false);
                this.cardManager.showSkeAnim([1, 2, 3]);


                this.cardManager.openShowCardBanker1(() => {
                    this.cardManager.openShowCardPlayer2(() => {
                        this.cardManager.openShowCardBanker2()
                    })
                })
            } else if (res.currentTime >= 9) {
                // mở lá 1 player, lá 1 banker luôn và vẫn chạy animation mở 2 lá còn lại

                this.cardManager.showCardNotAnim(4, false);
                this.cardManager.openShowCardPlayer1(null, false);
                this.cardManager.openShowCardBanker1(null, false);
                this.cardManager.showSkeAnim([2, 3]);

                this.cardManager.openShowCardPlayer2(() => {
                    this.cardManager.openShowCardBanker2()
                })

            } else if (res.currentTime >= 5) {

                this.cardManager.showCardNotAnim(4, false);
                this.cardManager.openShowCardPlayer1(null, false);
                this.cardManager.openShowCardPlayer2(null, false);
                this.cardManager.openShowCardBanker1(null, false);
                this.cardManager.showPointPlayer(2);
                this.cardManager.openShowCardBanker2()

                // mở lá 1 player, lá 1 banker, lá 2 player luôn và vẫn chạy animation mở 1 lá còn lại
            } else {
                this.cardManager.showCardNotAnim(4, true);
            }
        } else if (res.stateGame === 2) {
            this.isPlaying = true;
            this.clockCountDownTime.startCountDown(0);
            // phase mở lá thứ 3 của player
            // mở bằng ani
            if (res.currentTime >= 5) {
                this.cardManager.showCardNotAnim(5, true);
                this.cardManager.showPointPlayer(2);
                this.cardManager.showPointBanker(2);

                this.cardManager.showSkeAnim([4]);
                this.cardManager.openShowCardPlayer3()

            } else {
                // mở luôn
                this.cardManager.showCardNotAnim(5, true);
                this.cardManager.showPointPlayer(3);
                this.cardManager.showPointBanker(2);
            }
        } else if (res.stateGame === 3) {
            this.isPlaying = true;
            this.clockCountDownTime.startCountDown(0);
            // phase mở lá thứ 3 của banker
            if (res.currentTime >= 5) {
                // mở bằng ani
                this.cardManager.showCardNotAnim(6, true);
                this.cardManager.showPointPlayer(3);
                this.cardManager.showPointBanker(2);
                this.cardManager.showSkeAnim([5]);
                this.cardManager.openShowCardPlayer3()
            } else {
                // mở luôn
                this.cardManager.showCardNotAnim(6, true);
                this.cardManager.showPointPlayer(3);
                this.cardManager.showPointBanker(3);
            }
        } else if (res.stateGame === 4) {
            this.isPlaying = true;
            this.clockCountDownTime.startCountDown(0);
            // mở hết bài nếu đủ giờ thì chạy animation end game

            //Show hết bài 

            this.cardManager.showCardNotAnim(6, true);
            //show hết điểm
            this.cardManager.showPointBanker(res.cardBankers.length)
            this.cardManager.showPointPlayer(res.cardPlayers.length)

            if (this.potOnTableManager.getTotalMyBet() <= 0)
                this.numRoundGame += 1;
            else
                this.numRoundGame = 0

            this.scheduleOnce(() => {
                Bacarrat_GameManager.instance.cardManager.cleanUp();
                Bacarrat_GameManager.instance.potOnTableManager.cleanUp();
                Bacarrat_GameManager.instance.chipManager.cleanUP();
                Bacarrat_GameManager.instance.playerManager.cleanUp();
                this.cleanUp();
            }, res.currentTime - 1)
        }

        this._listHistory = res.listHistory;
        this._listHistory.reverse()
        this.nSoiCauInGame.setData(this._listHistory, true)
        this.setSeasionGame(res.seasionId)

    }

    setSeasionGame(seasionId: number) {
        // this.lbSeasionId.string = "ID: #" + BGUI.Utils.formatMoneyWithCommaOnly(seasionId);
        this.lbSeasionId.string = "ID: #" + seasionId;
        this._seasionId = seasionId;
    }

    getSeasionId() {
        return this._seasionId;
    }

    // update() {

    //     //===============================================================================
    //     // run action in order, action by action with delay
    //     //===============================================================================

    //     if (this._listAction.length > 0 && !this._actionIsRunning) {
    //         // reconnect to update states
    //         if (this._listAction.length >= Bacarrat_Const.MaxActionsToReconnect) {
    //             this._actionIsRunning = true;

    //             Bacarrat_Connector.instance.autoReconnect();

    //             return;
    //         }

    //         var nextAction = this._listAction[0];
    //         this._actionIsRunning = true;

    //         try {
    //             switch (nextAction.type) {
    //                 case Bacarrat_CMD.Code.GET_GAME_INFO:
    //                     break;
    //                 case Bacarrat_CMD.Code.NEW_USER_JOIN_ROOM:
    //                     this.onNewUserJoin(nextAction.data);
    //                     this.actionDone();
    //                     break;


    //             }
    //             this._listAction.splice(0, 1);
    //         }
    //         catch (err) {
    //             BGUI.ZLog.error("BCR: exception - " + err);
    //             Bacarrat_Connector.instance.autoReconnect();
    //         }
    //     }
    // }


    onInfoPlayerBet(cmd, data) {
        try {
            let res = null;
            if (cmd == "test") {
                res = data;
            } else {
                res = new Bacarrat_CMD.ReceivedInfoPlayerBet();
                res.unpackData(data);
            }

            BGUI.ZLog.log("onInfoPlayerBet ---> ", res);
            let err = res.getError();
            if (err != 0) {
                // this.notifyManager.showNotify("Không cược được !!!")
                this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.not_bet'))
                return;
            }
            let rdPotBet = res.typePot;
            let amountBet = res.betChip;
            let playerBet = res.nickName;


            let idColumOfPot = BGUI.Utils.randomInt(0, Bacarrat_GameManager.instance.chipManager.lsPosBet[rdPotBet].length - 1);
            let chipIdx = this.chipManager.getChipIdxByAmount(amountBet)
            let rdSlotIdx = this.playerManager.getSlotIdxByNickName(playerBet);
            BGUI.ZLog.log('---->rdSlotIdx --------->', rdSlotIdx);


            let posFrom = Bacarrat_GameManager.instance.playerManager.listPlayer[rdSlotIdx].node.getPosition();
            let posTo = Bacarrat_GameManager.instance.chipManager.lsPosBet[rdPotBet][idColumOfPot].clone();
            posTo.y += 4 * Math.min(Bacarrat_GameManager.instance.chipManager.arrChip[rdPotBet][idColumOfPot].length, 9)

            // Bacarrat_GameManager.instance.chipManager.totalBet[rdPotBet][idColumOfPot] += Bacarrat_Const.CHIP_AMOUNT[chipIdx]
            Bacarrat_GameManager.instance.chipManager.moveToPotBet(rdSlotIdx, chipIdx, rdPotBet, idColumOfPot, posFrom, posTo);

            let totalGoldFromPot = Bacarrat_GameManager.instance.chipManager.getTotalBetAllUser(rdPotBet)
            Bacarrat_GameManager.instance.potOnTableManager.showTotalBet(rdPotBet, totalGoldFromPot);

            if (playerBet === BGUI.UserManager.instance.mainUserInfo.nickname) {
                Bacarrat_GameManager.instance.potOnTableManager.showLightBet(rdPotBet);
                let mySlotIdx = 0;
                Bacarrat_GameManager.instance.playerManager.listPlayer[rdSlotIdx].updateGold(res.currentMoney);
                BGUI.UserManager.instance.mainUserInfo.vinTotal = res.currentMoney;
                let totalMyBetByPot = Bacarrat_GameManager.instance.chipManager.getTotalBetBySlotIdx(mySlotIdx, rdPotBet)
                Bacarrat_GameManager.instance.potOnTableManager.showMyBet(rdPotBet, totalMyBetByPot);
                res.seasionId = this.getSeasionId();
                this._listMySaveBet.push(res)
                let str = BGUI.UserManager.instance.mainUserInfo.nickname + '_saveChipBet';
                cc.sys.localStorage.setItem(str, JSON.stringify(this._listMySaveBet))

            } else {
                Bacarrat_GameManager.instance.playerManager.listPlayer[rdSlotIdx].updateGold(res.currentMoney);
            }
        } catch (error) {
            BGUI.ZLog.error("ERROR: ", error);
        }
    }

    onNewUserJoin(cmd, data) {
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedNewUserJoin();
            res.unpackData(data);
        }

        // BGUI.ZLog.log("onNewUserJoin --->", res);
        this.playerManager.addPlayer(res);
    }

    onUserLeaveRoom(cmd, data) {
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedLeaveRoom();
            res.unpackData(data);
        }

        BGUI.ZLog.log("onUserLeaveRoom --->", res);
        this.playerManager.leaveRoom(res);
    }

    onStartGame(cmd, data) {
        this.isPlaying = false;
        this.cleanUp();

        this.btnRebet.interactable = true;
        this.btnX2.interactable = true;

        Bacarrat_GameManager.instance.cardManager.cleanUpCard();
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedStartGame();
            res.unpackData(data);
        }
        BGUI.ZLog.log("onStartGame =>  ", res);
        // this.notifyManager.showNotify("Bắt đầu chơi !!!")
        this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.start_game'))
        this.cardManager.setAnimDealer('InviteBet')
        this.notifyDealer.getChildByName('lb_dealer').getComponent(cc.Label).string = LanguageMgr.getString('bacarrat.noti.invite_bet')
        cc.tween(this.notifyDealer)
            .to(0.2, { scaleX: 1, scaleY: 1 })
            .delay(1.2)
            .to(0.2, { scaleX: 0, scaleY: 0 })
            .start();

        this.clockCountDownTime.startCountDown(res.currentTime);
        this.setSeasionGame(res.seasionId)
    }

    onStartDealCard(cmd, data) {
        this.isPlaying = true;
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedDealCard();
            res.unpackData(data);
        }

        BGUI.ZLog.log("onStartDealCard =>  ", res);

        // this.notifyManager.showNotify("Dừng Cược")
        // this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.stop_bet'))

        this.cardManager.setData(res);
        this.cardManager.startDealCard();
    }

    onCotinueDealCard(cmd, data) {
        this.isPlaying = true;
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedContinueDealCard();
            res.unpackData(data);
        }

        if (res.state === 2) {
            this.cardManager.addCardPlayer(res.cardId)
            // deal next player
            BGUI.ZLog.log("onContinueDealCard Player =>  ", res);
            this.cardManager.dealCardPlayer3(() => {
                this.cardManager.openShowCardPlayer3(() => {
                    this.cardManager.showCardNotAnim(5, false);
                })
            });
        } else {
            this.cardManager.addCardBanker(res.cardId)
            // deal next banker
            BGUI.ZLog.log("onContinueDealCard Banker =>  ", res);
            this.cardManager.dealCardBanker3(() => {
                this.cardManager.openShowCardBanker3(() => {
                    this.cardManager.showCardNotAnim(6, false);
                });
            });
        }
    }

    getSideWin(arr: Array<number>): number {
        let side = -1;
        arr.forEach(e => {
            if (e == Bacarrat_Const.TAG_POT.PLAYER) {
                return side = 0;
            } else if (e == Bacarrat_Const.TAG_POT.BANKER) {
                return side = 1;
            }
            else if (e == Bacarrat_Const.TAG_POT.TIE) {
                return side = 2;
            }

            else {
                return side = - 1;
            }
        })

        return side;
    }

    onEndGame(cmd, data) {
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedEndGame();
            res.unpackData(data);
        }

        if (this.potOnTableManager.getTotalMyBet() <= 0)
            this.numRoundGame += 1;
        else
            this.numRoundGame = 0

        BGUI.ZLog.log("onEndGame -------------=>  ", res);

        this.cardManager.showCardNotAnim(6, true);
        //show hết điểm
        this.cardManager.hideAllAnim();

        this.cardManager.isDealCard = false;

        //show light win
        let side = this.getSideWin(res.winTypes)
        Bacarrat_GameManager.instance.potOnTableManager.showLightWin(res.winTypes, res.listPlayers);
        Bacarrat_GameManager.instance.cardManager.showWinSide(side)
        this.showWinSide(side)

        let potWin = res.winTypes;
        BGUI.ZLog.log(" xxxxxxxxxxxx potWin -------------=>  ", potWin);


        // BGUI.ZLog.log("total chip-> ", Bacarrat_GameManager.instance.chipManager.getAllChip())
        let chips = Bacarrat_GameManager.instance.chipManager.getAllChip();
        let listChipLose = chips.filter(e => {
            if (e) {
                if (side == 2 && res.winTypes.length == 1) {
                    let comp = e.getComponent(Bacarrat_Chip)
                    let pot = comp.getTypePot();
                    return ![0, 1, 2].includes(pot);
                } else {
                    let comp = e.getComponent(Bacarrat_Chip)
                    let pot = comp.getTypePot();
                    return !potWin.includes(pot);
                }

            }
        })
        // BGUI.ZLog.log("total chip lose-> ", listChipLose)

        // // Bacarrat_GameManager.instance.chipManager.getChipLose(listResult);

        var moveChipLoseToDealer = cc.callFunc(() => {
            var posTo = Bacarrat_GameManager.instance.cardManager.spDealer.node.getPosition();
            if (listChipLose.length > 0)
                Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.RUNMONEY);
            listChipLose.forEach((nChip: cc.Node) => {
                if (nChip) {
                    var posFrom = nChip.getPosition();
                    return nChip.getComponent(Bacarrat_Chip).actionMoveChipToDealer(posFrom, cc.v2(posTo.x, posTo.y - 120));
                }
            })
        })

        //move chip từ dealer vào bet thắng
        let listChipWin = chips.filter(e => {
            if (e) {
                let comp = e.getComponent(Bacarrat_Chip)
                let pot = comp.getTypePot();
                return potWin.includes(pot);
            }
        })

        var moveChipToBetWin = cc.callFunc(() => {
            var posFrom = Bacarrat_GameManager.instance.cardManager.spDealer.node.getPosition();
            if (listChipWin.length > 0)
                Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.RUNMONEY);
            listChipWin.forEach(function (nChip: cc.Node) {
                if (nChip) {
                    var posTo = nChip.getPosition();
                    var chip = nChip.getComponent(Bacarrat_Chip);

                    let idPos = chip.getIdPos();
                    var slotIdx = chip.getIdxSlot();
                    var chipIdx = chip.getIdxChip()
                    var typePot = chip.getTypePot();
                    Bacarrat_GameManager.instance.chipManager.moveToPotWin(slotIdx, chipIdx, typePot, idPos, cc.v2(posFrom.x, posFrom.y - 120), posTo);
                }
            })
        })


        let refurnChip = cc.callFunc(() => {
            BGUI.ZLog.log('refurnChip ------------------->')
            let listChipWinRefurn = chips.filter(e => {
                if (e) {
                    let comp = e.getComponent(Bacarrat_Chip)
                    let pot = comp.getTypePot();
                    return [0, 1].includes(pot);
                }
            })

            if (listChipWinRefurn.length > 0)
                Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.RUNMONEY);

            listChipWinRefurn.forEach((nChip: cc.Node) => {
                if (nChip) {
                    var chip = nChip.getComponent(Bacarrat_Chip);
                    var idxSlot = chip.getIdxSlot();
                    var posFrom = nChip.getPosition();
                    var posTo = Bacarrat_GameManager.instance.playerManager.listPlayer[idxSlot].node.getPosition();
                    chip.actionMoveChipToSlot(posFrom, posTo);
                }
            })
        })


        var moveChipWin = cc.callFunc(() => {
            if (listChipWin.length > 0)
                Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.RUNMONEY);
            listChipWin.forEach((nChip: cc.Node) => {
                if (nChip) {
                    var chip = nChip.getComponent(Bacarrat_Chip);
                    var idxSlot = chip.getIdxSlot();
                    var posFrom = nChip.getPosition();
                    var posTo = Bacarrat_GameManager.instance.playerManager.listPlayer[idxSlot].node.getPosition();
                    chip.actionMoveChipToSlot(posFrom, posTo);
                }
            })
        })

        var showEffectWinLose = cc.callFunc(() => {
            let players = res.listPlayers;
            players.forEach((e, idx) => {
                let slotIdx = Bacarrat_GameManager.instance.playerManager.getSlotIdxByNickName(e.nickName)
                if (slotIdx > 5) return;
                let player = Bacarrat_GameManager.instance.playerManager.listPlayer[slotIdx];
                if (player) {
                    if (players[idx].moneyExchange > 0) {
                        player.showEffectGoldWin(players[idx].moneyExchange);
                        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.WIN);
                    }
                    player.updateGold(players[idx].currentMoney);
                }
            })
        });

        var leaveGame = cc.callFunc(function () {
            Bacarrat_GameManager.instance.soundManager.stopMusicByType(SOUNDTYPE.BACKGROUND);
            Bacarrat_Connector.instance.disconnect();

            const url = window.location.href;
            let urlSearchParams = new URLSearchParams(url.split('?')[1]);
            if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                Bacarrat_GameManager.instance.maskClose.active = true
                Bacarrat_GameManager.instance.lb_noti.string = LanguageMgr.getString('bacarrat.noti.kick_room');
            } else {
                BGUI.UIPopupManager.instance.showPopupSmall(LanguageMgr.getString('bacarrat.noti.kick_room'));
            }
        })

        var cleanUpAllGame = cc.callFunc(() => {
            Bacarrat_GameManager.instance.cardManager.cleanUp();
            Bacarrat_GameManager.instance.potOnTableManager.cleanUp();
            Bacarrat_GameManager.instance.chipManager.cleanUP();
            Bacarrat_GameManager.instance.playerManager.cleanUp();
            this.cleanUp();

            if (cmd == "test") return;
            this._listHistory.push(res.history)
            this.nSoiCauInGame.setData(this._listHistory)
            this._sendGetStatitics();
            this._sendGetHistoryPlayer();
        })

        BGUI.ZLog.log('numRoundGame = ', this.numRoundGame)

        var listTask = [];
        this.node.stopAllActions();
        //run listTask
        // listTask.push(showLightWin);
        listTask.push(cc.delayTime(2));
        listTask.push(moveChipLoseToDealer);
        listTask.push(cc.delayTime(1));
        listTask.push(moveChipToBetWin);
        listTask.push(cc.delayTime(1));
        listTask.push(moveChipWin);
        if (side == 2 && res.winTypes.length == 1)
            listTask.push(refurnChip);
        listTask.push(cc.delayTime(1));
        listTask.push(showEffectWinLose);
        if (this.numRoundGame >= 5)
            listTask.push(leaveGame);
        listTask.push(cc.delayTime(0.5));
        listTask.push(cleanUpAllGame);
        var seq = cc.sequence(listTask);

        this.node.runAction(seq);
    }

    sendBetPotOnTable(pot: number) {
        this.btnRebet.interactable = false;
        this.btnX2.interactable = false;

        if (this.isPlaying)
            return;

        BGUI.ZLog.log("this.myChipPotManager.getValueBet() = ", this.myChipPotManager.getValueBet())
        BGUI.ZLog.log("BGUI.UserManager.instance.mainUserInfo.vinTotal = ", BGUI.UserManager.instance.mainUserInfo.vinTotal)

        if (this.myChipPotManager.getValueBet() > BGUI.UserManager.instance.mainUserInfo.vinTotal) {
            // this.notifyManager.showNotify("Không đủ tiền cược")
            this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.not_enough_money'))
            return;
        }

        try {
            let pk = new Bacarrat_CMD.SendRequestPlayerBet();
            pk.typePot = pot;
            pk.betChip = this.myChipPotManager.getValueBet();
            Bacarrat_Connector.instance.sendPacket(pk)
        } catch (error) {
            BGUI.ZLog.error("ERROR: ", error);
        }
    }

    showWinSide(nSide: number) {
        if (nSide == 1) {
            this.skWinBanker.node.active = true;
        } else if (nSide == 0) {
            this.skWinPlayer.node.active = true;
        }
        else if (nSide == 2) {
            this.skeAnimTie.node.active = true;
        }
    }

    onShowPointBanker(point: number) {
        this.lbPointBanker.node.active = true;

        if (point)
            BGUI.UINumericLabelHelper.scheduleForLabel(this.lbPointBanker, point, 0.6)
        this.lbPointBanker.string = point.toString();
    }

    onShowPointPlayer(point: number) {
        this.lbPointPlayer.node.active = true;
        if (point)
            BGUI.UINumericLabelHelper.scheduleForLabel(this.lbPointPlayer, point, 0.6)
        this.lbPointPlayer.string = point.toString();
    }

    cleanUp() {
        this.skWinBanker.node.active = false;
        this.skWinPlayer.node.active = false;
        this.skeAnimTie.node.active = false;

        this.lbPointPlayer.string = ''
        this.lbPointBanker.string = ''
    }

    genListResultFromDices(listResult: Array<string>) {
        var arrResult = {};
        var arrDices = [];
        listResult.forEach(rs => {
            let intValue = parseInt(rs);
            arrDices.push(intValue);
        });

        for (var i = 0; i < 6; i++) {
            arrResult[i] = 0;
            if (arrDices.some(dice => { return dice == i; }))
                arrResult[i] = 1;
        }
        for (var i = 6; i < Bacarrat_Const.RESULT_PATERN.length; i++) {
            arrResult[i] = 0;
            let tmp = Bacarrat_Const.RESULT_PATERN[i];
            if (tmp.every(v => arrDices.includes(v)))
                arrResult[i] = 1;
        }


        BGUI.ZLog.log(`RESULTS : ${JSON.stringify(arrResult)}`)
        var newArr = [];
        for (let k in arrResult) {
            if (arrResult[k] === 1) {
                newArr.push(k)
            }
        }
        BGUI.ZLog.log(`RESULTS FINALLLL : ${JSON.stringify(arrResult)}`)
        return newArr;
    }

    onNotifyQuitGame(cmd, data) {
        let res = new Bacarrat_CMD.ReceivedNotifyQuitRoom();
        res.unpackData(data);

        BGUI.ZLog.log("onNotifyQuitGame ---> ", res);

        if (res.nickName.toUpperCase() === BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase()) {
            if (res.reqQuitRoom === true) {
                // this.notifyManager.showNotify("Đăng kí thoát bàn thành công!")
                this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.register_leave_table'))
            }
            else {
                // this.notifyManager.showNotify("Hủy đăng kí thoát bàn!")
            }
        }
    }

    onBetX2Clicked() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        if (this._listMySaveBet.length == 0) {
            // this.notifyManager.showNotify("Không có dữ liệu");
            this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.not_data'))
            return;
        }
        this.btnRebet.interactable = false;
        this.btnX2.interactable = false;
        BGUI.ZLog.log("_listMySaveBet---> ", this._listMySaveBet);

        var last_element = this._listMySaveBet[this._listMySaveBet.length - 1];


        let listBetOld = this._listMySaveBet.filter((e) => {
            if (e) {
                return e.seasionId == last_element.seasionId;
            }
        })

        let listBetOldCopy = [...listBetOld];
        let duplicateArray = listBetOldCopy.concat(listBetOld)
        duplicateArray.forEach(e => {
            if (e) {
                let pk = new Bacarrat_CMD.SendRequestPlayerBet();
                pk.typePot = e.typePot;
                pk.betChip = e.betChip;
                Bacarrat_Connector.instance.sendPacket(pk)
            }
        })
    }

    onRebetClicked() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        if (this._listMySaveBet.length == 0) {
            // this.notifyManager.showNotify("Không có dữ liệu");
            this.notifyManager.showNotify(LanguageMgr.getString('bacarrat.noti.not_data'))
            return;
        }
        this.btnRebet.interactable = false;
        this.btnX2.interactable = false;

        var last_element = this._listMySaveBet[this._listMySaveBet.length - 1];
        let listBetOld = this._listMySaveBet.filter((e) => {
            if (e) {
                return e.seasionId == last_element.seasionId;
            }
        })

        listBetOld.forEach(e => {
            BGUI.ZLog.log(e);
            if (e) {
                let pk = new Bacarrat_CMD.SendRequestPlayerBet();
                pk.typePot = e.typePot;
                pk.betChip = e.betChip;
                Bacarrat_Connector.instance.sendPacket(pk)
            }
        })
    }

    onChatRoom(cmd, data) {
        let res = null;
        if (cmd == "test") {
            res = data;
        } else {
            res = new Bacarrat_CMD.ReceivedChatRoom();
            res.unpackData(data);
        }

        BGUI.ZLog.log("responseChatRoom = ", res);

        let isIcon = res.isIcon;
        let content = res.content;
        let player = res.nickname

        let idxPlayer = this.playerManager.getSlotIdxByNickName(player);
        let vt = idxPlayer < 4 ? 0 : 1;

        let dataChat = {
            node: this.playerManager.listPlayer[idxPlayer].node,
            content: content,
            vt: vt
        }

        if (isIcon) {
            BGUI.EventDispatch.instance.emit("SHOW_CHAT_EMO", dataChat);
        } else {
            BGUI.EventDispatch.instance.emit("SHOW_CHAT_TEXT", dataChat);
        }
    }

    onKickRoom(cmd, data) {
        let res = new Bacarrat_CMD.ReceivedKickRoom();
        res.unpackData(data);

        BGUI.ZLog.log("ReceivedKickRoom ---> ", res);
        if (res.reason === 1) {
            let str = BGUI.UserManager.instance.mainUserInfo.nickname + '_saveChipBet';
            cc.sys.localStorage.removeItem(str)
            BGUI.GameCoreManager.instance.onBackToLobby();
        }
    }

    _sendGetStatitics() {
        let pk = new Bacarrat_CMD.SendRequestHistoryStatitics();
        Bacarrat_Connector.instance.sendPacket(pk)
    }

    _sendGetHistoryPlayer() {
        let pk = new Bacarrat_CMD.SendRequestHistoryPlayer();
        Bacarrat_Connector.instance.sendPacket(pk)
    }

    private _updateLangByUrl() {
        const url = window.location.href;
        let urlSearchParams = new URLSearchParams(url.split('?')[1]);
        let lang = "en";
        if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("lang")) {
            lang = urlSearchParams.get("lang")
        }
        LanguageMgr.updateLocalization(lang);
    }

    onBackToLobby() {
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

    showGUINanBai(vtC, idxCard) {
        let comp = this.nNanBai.getComponent(Bacarrat_NanBai)
        comp.setDataCard(vtC, idxCard);
        this.nNanBai.active = true;
    }
}
