import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import DragonTiger_CardManager from "./DragonTiger.CardManager";
import DragonTiger_Chip from "./DragonTiger.Chip";
import DragonTiger_ChipManager from "./DragonTiger.ChipManager";
import DragonTiger_ClockCountDown from "./DragonTiger.ClockCountDown";
import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_MyChipPot from "./DragonTiger.MyChipPot";
import DragonTiger_NotifyManager from "./DragonTiger.NotifyManager";
import DragonTiger_PlayerManager from "./DragonTiger.PlayerManager";
import DragonTiger_Popup from "./DragonTiger.Popup";
import DragonTiger_PotOnTableManager from "./DragonTiger.PotOnTableManager";
import DragonTiger_SoiCauHistory from "./DragonTiger.SoiCauHistory";
import DragonTiger_SoundManager from "./DragonTiger.SoundManager";
import DragonTiger_CMD from "./network/DragonTiger.Cmd";
import DragonTiger_Connector from "./network/DragonTiger.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_GameManager extends cc.Component {

    static instance: DragonTiger_GameManager = null;

    @property(cc.Node)
    maskClose: cc.Node = null;
    @property(cc.Label)
    lb_noti: cc.Label = null;

    @property(sp.Skeleton)
    aniLong: sp.Skeleton = null;
    @property(sp.Skeleton)
    aniHo: sp.Skeleton = null;

    @property(cc.Node)
    clock: cc.Node = null

    @property(cc.SpriteFrame)
    spfAvatar: cc.SpriteFrame = null;

    @property(DragonTiger_Popup)
    nPopup: DragonTiger_Popup = null;

    @property(DragonTiger_SoundManager)
    soundManager: DragonTiger_SoundManager = null;

    @property(DragonTiger_PlayerManager)
    playerManager: DragonTiger_PlayerManager = null;

    @property(DragonTiger_ChipManager)
    chipManager: DragonTiger_ChipManager = null;

    @property(DragonTiger_CardManager)
    cardManager: DragonTiger_CardManager = null;

    @property(DragonTiger_PotOnTableManager)
    potOnTableManager: DragonTiger_PotOnTableManager = null;

    @property(DragonTiger_MyChipPot)
    myChipPotManager: DragonTiger_MyChipPot = null;

    @property(DragonTiger_SoiCauHistory)
    nSoiCauInGame: DragonTiger_SoiCauHistory = null;

    @property(DragonTiger_ClockCountDown)
    clockCountDownTime: DragonTiger_ClockCountDown = null;

    @property(DragonTiger_NotifyManager)
    notifyManager: DragonTiger_NotifyManager = null;

    @property(cc.Button)
    btnAddChip: cc.Button = null;
    @property(cc.Button)
    btnHoleChip: cc.Button = null;
    @property(cc.Toggle)
    btnAutoBet: cc.Toggle = null;

    @property(cc.Node)
    aniLongHo: cc.Node = null


    // @property(cc.Label)
    // lbSeasionId: cc.Label = null;

    // @property(cc.Label)
    // lbPointPlayer: cc.Label = null;

    // @property(cc.Label)
    // lbPointBanker: cc.Label = null;

    // @property(sp.Skeleton)
    // skeAnimTie: sp.Skeleton = null;

    // @property(sp.Skeleton)
    // skWinPlayer: sp.Skeleton = null;

    // @property(sp.Skeleton)
    // skWinBanker: sp.Skeleton = null;

    // private _dataMyBet = [];
    private _lastMyBet = [];
    private _seasionId: number = -1;

    hideTime: number = null;
    public _isGameActive: boolean = true;
    public _scheduler = null;
    public _actionIsRunning = null;
    public _listAction = [];

    isPlaying = false
    STATE_GAME = ''
    timeRemain = 0
    numRoundGame = 0
    rateReward = []
    isOpenCard = false
    sessionID = 0

    onLoad() {
        DragonTiger_GameManager.instance = this;

        if (!BGUI.UserManager.instance.mainUserInfo) return;

        let str = BGUI.UserManager.instance.mainUserInfo.nickname + '_saveBetLH';
        let sBet = cc.sys.localStorage.getItem(str);
        if (sBet === null)
            this._lastMyBet = [0, 0, 0, 0, 0]
        else
            this._lastMyBet = JSON.parse(cc.sys.localStorage.getItem(str));

        this.btnHoleChip.interactable = false
        if (this.getTotalBet(this._lastMyBet) > 0)
            this.btnAddChip.interactable = false

        BGUI.ZLog.log('this._lastMyBet = ', this._lastMyBet);
    }

    getTotalBet(arrChip) {
        let total = 0;
        for (let t of arrChip)
            total += t;

        return total;
    }

    onEnable() {

        this._updateLangByUrl();

        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_INFO, this.DRAGON_TIGER_GAME_INFO, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_STATE_GAME, this.DRAGON_TIGER_STATE_GAME, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_NEW_GAME, this.DRAGON_TIGER_NEW_GAME, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_BET, this.DRAGON_TIGER_BET, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_UNBET, this.DRAGON_TIGER_UNBET, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_DEAL_CARDS, this.DRAGON_TIGER_DEAL_CARDS, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_USER_JOIN_ROOM, this.DRAGON_TIGER_USER_JOIN, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_USER_OUT_ROOM, this.DRAGON_TIGER_USER_OUT_ROOM, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_END_GAME, this.DRAGON_TIGER_END_GAME, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_RATE_REWARD, this.DRAGON_TIGER_RATE_REWARD, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_LICH_SU_PHIEN, this.DRAGON_TIGER_LICH_SU_PHIEN, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_SOI_CAU_HISTORY, this.DRAGON_TIGER_SOI_CAU_HISTORY, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_RECEIVE_CHAT, this.DRAGON_TIGER_RECEIVE_CHAT, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.BACK_GAME, this.BACK_GAME, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_LOGIN, this.onDragonTigerLoginSuccess, this)

        BGUI.EventDispatch.instance.add("SEND_CHAT_EMO", this.sendChatEmo, this);
        BGUI.EventDispatch.instance.add("SEND_CHAT_TEXT", this.sendChatText, this);

        cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
        cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);

        this._scheduler = window.setInterval(this.updateOffline.bind(this), 1000 / 60);

        BGUI.AudioManager.instance.musicVolume = 0;
        this.soundManager.initData();

        DragonTiger_Connector.instance.connect();
    }

    onDisable() {
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_INFO);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_STATE_GAME);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_NEW_GAME);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_BET);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_DEAL_CARDS);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_USER_JOIN_ROOM);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_USER_OUT_ROOM);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_END_GAME);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_LICH_SU_PHIEN);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_SOI_CAU_HISTORY);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_RECEIVE_CHAT);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.BACK_GAME);

        BGUI.EventDispatch.instance.remove("SEND_CHAT_EMO", this.sendChatEmo, this);
        BGUI.EventDispatch.instance.remove("SEND_CHAT_TEXT", this.sendChatText, this);

        BGUI.AudioManager.instance.musicVolume = 1;

        DragonTiger_Connector.instance.disconnect();

        DragonTiger_GameManager.instance = null;
    }

    onDragonTigerLoginSuccess(cmd, data) {
        // BGUI.ZLog.log("onDragonTigerLoginSuccess--->: ");
        // this.sendJoinRoom();
        // return;
        BGUI.ZLog.log("onDragonTigerLoginSuccess--->: ");
        let res = new DragonTiger_CMD.ReceivedLogin();
        res.unpackData(data);

        const url = window.location.href;
        let urlSearchParams = new URLSearchParams(url.split('?')[1]);
        if (url && url.includes('?') && urlSearchParams) {
            BGUI.ZLog.log("onDragonTigerLogin Success byURL--->: ", res);
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
                userData.nickname = res.username;
                userData.username = res.username;
                userData.avatar = res.avatar;
                userData.vinTotal = res.currentMoney;

                BGUI.UserManager.instance.mainUserInfo = userData;
                BGUI.ZLog.log('BGUI.UserManager -> ', BGUI.UserManager.instance.mainUserInfo)
                this.sendJoinRoom();
            } else {
                BGUI.ZLog.log("onDragonTigerLogin Failed--->: ", cmd, res.getError());

                const url = window.location.href;
                let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                    DragonTiger_GameManager.instance.maskClose.active = true
                    DragonTiger_GameManager.instance.lb_noti.string = LanguageMgr.getString('longho.noti.connection_error');
                } else {
                    BGUI.UIPopupManager.instance.showPopupSmall(res.getError().toString());
                }
            }
        } else {
            BGUI.ZLog.log("onDragonTigerLoginSuccess Normal--->: ", res);
            if (res.getError() == BGUI.ErrorDefine.SUCCESS) {
                this.sendJoinRoom();
            } else {
                const url = window.location.href;
                let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                    DragonTiger_GameManager.instance.maskClose.active = true
                    DragonTiger_GameManager.instance.lb_noti.string = res.getError().toString()
                } else {
                    BGUI.UIPopupManager.instance.showPopupSmall(res.getError().toString());
                }
            }
        }
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

    onLoginSuccess() {
        BGUI.ZLog.log("onDragonTigerLoginSuccess--->: ");
        this.sendJoinRoom();
    }

    showHideSpine() {
        let aniDragon = this.aniLongHo.getChildByName('aniDragon').getComponent(sp.Skeleton);
        aniDragon.setAnimation(0, 'vs', false);

        let aniTiger = this.aniLongHo.getChildByName('aniTiger').getComponent(sp.Skeleton);
        aniTiger.setAnimation(0, 'vs', false);

        let aniVs = this.aniLongHo.getChildByName('aniVs').getComponent(sp.Skeleton);
        aniVs.setAnimation(0, 'animation', false);

        this.aniLongHo.active = true;
        cc.tween(this.aniLongHo)
            .delay(2.5)
            .call(() => {
                this.aniLongHo.active = false;
            })
            .start();
    }

    sendJoinRoom() {
        let pk = new DragonTiger_CMD.SendSubcribe();
        DragonTiger_Connector.instance.sendPacket(pk);
    }

    sendChatText(data) {
        BGUI.ZLog.log("sendChatText ---> ", data);

        let pk = new DragonTiger_CMD.SendChatRoom()
        pk.isIcon = 0;
        pk.content = data;

        DragonTiger_Connector.instance.sendPacket(pk);
    }

    sendChatEmo(data) {
        BGUI.ZLog.log("sendChatEmo ---> ");

        let pk = new DragonTiger_CMD.SendChatRoom()
        pk.isIcon = 1;
        pk.content = data;

        DragonTiger_Connector.instance.sendPacket(pk);
    }

    sendBetPotOnTable(pot: number) {
        if (this.STATE_GAME !== DragonTiger_Const.GAME_STATE.BETTING)
            return;

        if (this.myChipPotManager.getValueBet() > BGUI.UserManager.instance.mainUserInfo.vinTotal) {
            this.notifyManager.showNotify(LanguageMgr.getString('longho.noti.not_enough_money'))
            return;
        }

        try {
            let pk = new DragonTiger_CMD.SendBet()
            pk.betSide = pot;
            pk.betValue = this.myChipPotManager.getValueBet();
            DragonTiger_Connector.instance.sendPacket(pk)
            console.log('sendBetPotOnTable =>>>> ', pk)
        } catch (error) {
            BGUI.ZLog.error("ERROR: ", error);
        }
    }

    BACK_GAME(cmd, data) {
        let res = new DragonTiger_CMD.ReceivedBackGame();
        res.unpackData(data);

        BGUI.GameCoreManager.instance.onBackToLobby();
    }


    DRAGON_TIGER_RECEIVE_CHAT(cmd, data) {
        let res = new DragonTiger_CMD.ReceivedChatRoom();
        res.unpackData(data);

        let isIcon = res.isIcon;
        let content = res.content;
        let player = res.nickname

        let idxPlayer = this.playerManager.getSlotIdxByNickName(player);
        let vt = idxPlayer < 5 ? 0 : 1;

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

    // Receive Response
    DRAGON_TIGER_GAME_INFO(cmdId, data) {
        let res = null;
        if (cmdId == "test") {
            res = data;
        } else {
            res = new DragonTiger_CMD.ReceivedGameInfo();
            res.unpackData(data);
        }

        this.numRoundGame = 0;

        BGUI.ZLog.log('DRAGON_TIGER_GAME_INFO = ', JSON.stringify(res))

        this.STATE_GAME = res.currentState;
        this.timeRemain = res.remainTime;
        this.sessionID = res.referenceId;

        this.playerManager.setData(res.listPlayers);
        this.chipManager.chipReconnect(res.bets, res.myBets)
        this.playerManager.lbNumMorePlayer.string = res.userOutTable + ''

        if (this.chipManager.getTotalMyBet() > 0)
            this.numRoundGame = 1

        switch (this.STATE_GAME) {
            case DragonTiger_Const.GAME_STATE.START_NEW_ROUND:
                break
            case DragonTiger_Const.GAME_STATE.WAITING_EFFECT_DRAGON_TIGER:
                break
            case DragonTiger_Const.GAME_STATE.DEAL_CARD_FIRST_ROUND:
                this.cardManager.cardReconnect(res)
                break
            case DragonTiger_Const.GAME_STATE.BETTING:
                this.cardManager.cardReconnect(res)
                this.clockCountDownTime.startCountDown(res.remainTime)
                break
            case DragonTiger_Const.GAME_STATE.DEAL_CARD_SECOND_ROUND:
                this.cardManager.cardReconnect(res)
                break
            case DragonTiger_Const.GAME_STATE.CALCULATE_PRIZE:
                this.cardManager.cardReconnect(res)
                break
        }
    }

    DRAGON_TIGER_STATE_GAME(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedStateGame();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_STATE_GAME = ', JSON.stringify(res))

        this.STATE_GAME = res.state;
        this.timeRemain = res.time;

        switch (this.STATE_GAME) {
            case DragonTiger_Const.GAME_STATE.START_NEW_ROUND:
                this.isOpenCard = false;
                this.notifyManager.showNotify(LanguageMgr.getString('longho.noti.start_game'))
                this.aniLong.setAnimation(0, 'idle', true);
                this.aniHo.setAnimation(0, 'idle', true);
                break
            case DragonTiger_Const.GAME_STATE.WAITING_EFFECT_DRAGON_TIGER:
                this.showHideSpine()
                break
            case DragonTiger_Const.GAME_STATE.DEAL_CARD_FIRST_ROUND:
                // this.notifyManager.showNotify(LanguageMgr.getString('longho.noti.deal_card'))
                break
            case DragonTiger_Const.GAME_STATE.BETTING:
                this.clock.active = true;
                this.clockCountDownTime.startCountDown(res.time)
                this.notifyManager.showNotify(LanguageMgr.getString('longho.noti.invite_bet'))
                if (this._lastMyBet.length > 0) {
                    this.btnAddChip.interactable = true
                    if (this.btnAutoBet.isChecked) {
                        this.onClickAuto();
                    }
                }
                break
            case DragonTiger_Const.GAME_STATE.DEAL_CARD_SECOND_ROUND:
                this.clockCountDownTime.lbTime.string = ''
                this.clock.active = false;
                this.btnHoleChip.interactable = false
                this.btnAddChip.interactable = false;
                break
            case DragonTiger_Const.GAME_STATE.CALCULATE_PRIZE:
                this.btnHoleChip.interactable = false
                this.btnAddChip.interactable = false;
                if (!this.isOpenCard) {
                    this.cardManager.openShowCardDragon(0, 2)
                    this.cardManager.openShowCardTiger(0, 2)
                    this.isOpenCard = true;
                }
                break
        }
    }

    DRAGON_TIGER_NEW_GAME(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedStartNewGame();
        res.unpackData(data);

        BGUI.ZLog.log("START_NEW_GAME_DRAGON_TIGER = ", JSON.stringify(res));

        this.sessionID = res.referenceId;

        DragonTiger_GameManager.instance.cardManager.cleanUpCard();
        DragonTiger_GameManager.instance.potOnTableManager.cleanUp();
        DragonTiger_GameManager.instance.chipManager.cleanUP();

        this._sendGetStatitics();
        this._sendGetHistoryPlayer(0);
    }

    DRAGON_TIGER_BET(cmdId, data) {
        let res = null;
        if (cmdId == "test") {
            res = data;
        } else {
            res = new DragonTiger_CMD.ReceivedResponseBet();
            res.unpackData(data);

            if (res.getError() != 0) {
                switch (res.getError()) {
                    case 1:
                    case 2:
                        BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.not_in_bet_time'))
                        break;
                    case 3:
                        BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.not_enough_gold'))
                        break;
                    case 4:
                        BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.bet_too_small'))
                        break;
                    case 5:
                        BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.only_allow_bet_dragon_or_tiger'))
                        break;
                    // case 6:
                    //     BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.not_in_bet_time'))
                    //     break;
                    // case 7:
                    //     BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.only_alow_bet_red_or_black_dragon'))
                    //     break;
                    // case 8:
                    //     BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.only_alow_bet_tai_or_xiu_dragon'))
                    //     break;
                    // case 9:
                    //     BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.only_alow_bet_red_or_black_tiger'))
                    //     break;
                    // case 10:
                    //     BGUI.UITextManager.showCenterNotification(LanguageMgr.getString('longho.toast.only_alow_bet_tai_or_xiu_tiger'))
                    //     break;

                    default:
                        break;
                }
                return;
            }
        }

        let idPotBet = res.betSide;
        let amountBet = res.betValue;
        let playerBet = res.nickName;

        let chipIdx = this.chipManager.getChipIdxByAmount(amountBet)
        let slotIx = this.playerManager.getSlotIdxByNickName(playerBet);

        if (chipIdx < 0)
            return

        let posFrom = this.playerManager.listPlayer[slotIx].node.getPosition();
        let posTo = this.chipManager.lsPosBet[idPotBet].clone();
        if (idPotBet < 2) {
            posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 200)
            posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
        }
        else {
            posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 100)
            posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
        }

        this.chipManager.totalChipBet[idPotBet] += amountBet
        this.chipManager.moveToPotBet(chipIdx, idPotBet, posFrom, posTo, playerBet);
        this.potOnTableManager.showTotalBet(idPotBet, this.chipManager.totalChipBet[idPotBet]);

        if (playerBet === BGUI.UserManager.instance.mainUserInfo.nickname) {
            this.potOnTableManager.showLightBet(idPotBet);
            this.chipManager.chipMyBet[idPotBet] += amountBet
            this.playerManager.listPlayer[slotIx].updateGold(res.currentMoney);
            BGUI.UserManager.instance.mainUserInfo.vinTotal = res.currentMoney;
            this.potOnTableManager.showMyBet(idPotBet, this.chipManager.chipMyBet[idPotBet]);

            this.btnHoleChip.interactable = true
            this.btnAddChip.interactable = true;

            BGUI.ZLog.log("DRAGON_TIGER_BET = ", JSON.stringify(res));
        } else {
            this.playerManager.listPlayer[slotIx].updateGold(res.currentMoney);
        }
    }

    DRAGON_TIGER_UNBET(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedUnBet();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_UNBET = ', res.arrUnBet)

        let dataUnBet = res.arrUnBet;
        for (let i = 0; i < dataUnBet.length; i++) {
            this.chipManager.totalChipBet[i] -= dataUnBet[i];
            this.chipManager.chipMyBet[i] = 0;
            this.potOnTableManager.showTotalBet(i, this.chipManager.totalChipBet[i]);
            this.potOnTableManager.showMyBet(i, this.chipManager.chipMyBet[i]);
        }

        this.btnHoleChip.interactable = false
        this.chipManager.unBetChip();
    }

    DRAGON_TIGER_USER_JOIN(cmdId: number, data: Uint8Array) {
        let res = new DragonTiger_CMD.ReceivedUserJoin();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_USER_JOIN = ', res)

        this.playerManager.joinRoom(res);
    }

    DRAGON_TIGER_USER_OUT_ROOM(cmdId: number, data: Uint8Array) {
        let res = new DragonTiger_CMD.ReceivedUserLeave();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_USER_OUT_ROOM = ', res)

        this.playerManager.leaveRoom(res);
    }

    DRAGON_TIGER_DEAL_CARDS(cmdId, data) {
        let res = null;
        if (cmdId == "test") {
            res = data;
        } else {
            res = new DragonTiger_CMD.ReceivedDealCard();
            res.unpackData(data);
        }

        // {"_pos":26,"_data":{"0":1,"1":8,"2":65,"3":0,"4":0,"5":1,"6":0,"7":2,"8":0,"9":0,"10":0,"11":12,"12":0,"13":0,"14":0,"15":35,"16":0,"17":2,"18":0,"19":0,"20":0,"21":47,"22":0,"23":0,"24":0,"25":14},"_length":26,"_controllerId":1,"_cmdId":2113,"_error":0,"listCardDragon":[12,35],"listCardTiger":[47,14],"result":1}

        BGUI.ZLog.log('DRAGON_TIGER_DEAL_CARDS => ', JSON.stringify(res))

        this.cardManager.setData(res)

        if (this.STATE_GAME === DragonTiger_Const.GAME_STATE.DEAL_CARD_FIRST_ROUND)
            this.cardManager.startDealCard();
        else if (this.STATE_GAME === DragonTiger_Const.GAME_STATE.DEAL_CARD_SECOND_ROUND) {
            cc.tween(this.node)
                .call(() => {
                    this.cardManager.setData(res)
                    this.cardManager.updateCardDragon();
                    this.cardManager.updateCardTiger();
                    if (!this.isOpenCard) {
                        this.cardManager.openShowCardDragon(0, 1)
                        this.cardManager.openShowCardTiger(0, 1)
                        this.isOpenCard = true;
                    }
                })
                .delay(3)
                .call(() => {
                    this.cardManager.continueDealCard()
                })
                .start();
        }

    }

    DRAGON_TIGER_LICH_SU_PHIEN(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedChiTietPhienHienTai();
        res.unpackData(data);

        BGUI.ZLog.log('LICH_SU_PHIEN_DRAGON_TIGER => ', JSON.stringify(res))
    }

    DRAGON_TIGER_SOI_CAU_HISTORY(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedSoiCauHistory();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_SOI_CAU_HISTORY => ', JSON.stringify(res))

        this.nSoiCauInGame.setData(res.data)
    }

    DRAGON_TIGER_RATE_REWARD(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedRateReward();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_RATE_REWARD_MSG => ', JSON.stringify(res))

        let arr = res.rateReward;
        this.rateReward = []
        for (let i = 0; i < arr.length; i++) {
            this.rateReward.push(parseInt(arr[i]))
        }
    }

    DRAGON_TIGER_END_GAME(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedEndGame();
        res.unpackData(data);

        BGUI.ZLog.log('DRAGON_TIGER_END_GAME => ', JSON.stringify(res))

        if (this.chipManager.getTotalMyBet() > 0) {
            this._lastMyBet = [...this.chipManager.chipMyBet]
            let str = BGUI.UserManager.instance.mainUserInfo.nickname + '_saveBetLH';
            cc.sys.localStorage.setItem(str, JSON.stringify(this._lastMyBet))
            this.numRoundGame = 0;
        }
        else
            this.numRoundGame++

        BGUI.ZLog.log('this.numRoundGame = ', this.numRoundGame)

        //show light win
        let potWin = res.winPot;
        BGUI.ZLog.log(" xxxxxxxxxxxx potWin session-------------=>  ", this.sessionID, potWin);

        this.checkWinSide(potWin)

        //move chip lose to dealer
        let chips = this.chipManager.getAllChip();
        let listChipLose = chips.filter(e => {
            if (e) {
                let comp = e.getComponent(DragonTiger_Chip)
                let pot = comp.getTypePot();
                return !potWin.includes(pot);

            }
        })
        var moveChipLoseToDealer = cc.callFunc(() => {
            var posTo = cc.v2(0, 410)
            listChipLose.forEach((nChip: cc.Node) => {
                if (nChip) {
                    var posFrom = nChip.getPosition();
                    return nChip.getComponent(DragonTiger_Chip).actionMoveChipToDealer(posFrom, cc.v2(posTo.x, posTo.y));
                }
            })
        })

        //move chip từ dealer vào bet thắng
        var moveChipToBetWin = cc.callFunc(() => {
            var posFrom = cc.v2(0, 410)

            for (let i = 0; i < potWin.length; i++) {
                let arrChip = DragonTiger_GameManager.instance.chipManager.genChipValue(DragonTiger_GameManager.instance.chipManager.totalChipBet[potWin[i]] * DragonTiger_GameManager.instance.rateReward[potWin[i]])

                for (let id = 0; id < arrChip.length; id++) {

                    let idPotBet = potWin[i];
                    let amountBet = arrChip[id]
                    let chipIdx = DragonTiger_GameManager.instance.chipManager.getChipIdxByAmount(amountBet)

                    let posTo = DragonTiger_GameManager.instance.chipManager.lsPosBet[idPotBet].clone();
                    if (idPotBet < 2) {
                        posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 200)
                        posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                    }
                    else {
                        posTo.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 100)
                        posTo.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                    }

                    DragonTiger_GameManager.instance.chipManager.moveToPotWin(chipIdx, idPotBet, posFrom, posTo);
                }
            }
        })

        //move pot win to player
        var moveChipWin = cc.callFunc(() => {
            this.chipManager.cleanUP();
            let players = res.listPlayers;

            for (let pl of players) {
                let arrMoneyWin = pl.arrPrize;
                for (let idPot = 0; idPot < arrMoneyWin.length; idPot++) {

                    let arrChip = DragonTiger_GameManager.instance.chipManager.genChipValue(arrMoneyWin[idPot])

                    for (let id = 0; id < arrChip.length; id++) {
                        let idPotBet = idPot;
                        let amountBet = arrChip[id]
                        let chipIdx = DragonTiger_GameManager.instance.chipManager.getChipIdxByAmount(amountBet)
                        let idxPlayer = DragonTiger_GameManager.instance.playerManager.getSlotIdxByNickName(pl.nickName)
                        let posTo = DragonTiger_GameManager.instance.playerManager.listPlayer[idxPlayer].node.getPosition();
                        let posFrom = DragonTiger_GameManager.instance.chipManager.lsPosBet[idPotBet].clone();

                        if (idPotBet < 2) {
                            posFrom.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 200)
                            posFrom.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                        }
                        else {
                            posFrom.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 100)
                            posFrom.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                        }

                        let chip = DragonTiger_GameManager.instance.chipManager.addChip(chipIdx, idPotBet)
                        chip.node.setPosition(posFrom);
                        chip.actionMoveChipToSlot(posFrom, posTo);
                    }
                }
            }

            let arrMoney = res.arrMoneyReturn;
            for (let idPot = 0; idPot < arrMoney.length; idPot++) {
                let arrChip = this.chipManager.genChipValue(arrMoney[idPot])

                for (let id = 0; id < arrChip.length; id++) {
                    let idPotBet = idPot;
                    let amountBet = arrChip[id]
                    let chipIdx = DragonTiger_GameManager.instance.chipManager.getChipIdxByAmount(amountBet)
                    let idxPlayer = 8
                    let posTo = DragonTiger_GameManager.instance.playerManager.listPlayer[idxPlayer].node.getPosition();
                    let posFrom = DragonTiger_GameManager.instance.chipManager.lsPosBet[idPotBet].clone();

                    if (idPotBet < 2) {
                        posFrom.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 200)
                        posFrom.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                    }
                    else {
                        posFrom.x += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 100)
                        posFrom.y += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 50)
                    }
                    let chip = DragonTiger_GameManager.instance.chipManager.addChip(chipIdx, idPotBet)
                    chip.node.setPosition(posFrom);
                    chip.actionMoveChipToSlot(posFrom, posTo);
                }
            }
        })

        //show effect
        var showEffectWinLose = cc.callFunc(() => {
            let players = res.listPlayers;
            players.forEach((e, idx) => {
                let slotIdx = DragonTiger_GameManager.instance.playerManager.getSlotIdxByNickName(e.nickName)
                if (slotIdx > 8)
                    return;
                let player = DragonTiger_GameManager.instance.playerManager.listPlayer[slotIdx];
                if (player) {
                    let totalWin = this.getTotalBet(players[idx].arrPrize)
                    if (totalWin > 0) {
                        player.showEffectGoldWin(totalWin);
                    }
                    player.updateGold(players[idx].currentMoney);
                }
            })
        });

        var leaveGame = cc.callFunc(function () {
            DragonTiger_Connector.instance.disconnect();
            var listAction = [
                BGUI.PopupAction.make("OK", () => {
                    BGUI.GameCoreManager.instance.onBackToLobby();
                }),
            ]
            // const url = window.location.href;
            // let urlSearchParams = new URLSearchParams(url.split('?')[1]);
            // if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
            //     DragonTiger_GameManager.instance.maskClose.active = true
            //     DragonTiger_GameManager.instance.lb_noti.string = LanguageMgr.getString('longho.noti.kick_room');
            // } else {
            BGUI.UIPopupManager.instance.showPopupSmall(LanguageMgr.getString('longho.noti.kick_room'), listAction);
            // }
        })

        var cleanUpAllGame = cc.callFunc(() => {
            BGUI.ZLog.log('cleanUpAllGame----->>>>');

            DragonTiger_GameManager.instance.cardManager.cleanUpCard();
            DragonTiger_GameManager.instance.potOnTableManager.cleanUp();
            DragonTiger_GameManager.instance.chipManager.cleanUP();
        })

        var listTask = [];
        this.node.stopAllActions();
        //run listTask
        // listTask.push(showLightWin);
        // listTask.push(cc.delayTime(2));
        listTask.push(moveChipLoseToDealer);
        listTask.push(cc.delayTime(1));
        listTask.push(moveChipToBetWin);
        listTask.push(cc.delayTime(1));
        listTask.push(moveChipWin);
        listTask.push(cc.delayTime(1));
        listTask.push(showEffectWinLose);
        if (this.numRoundGame >= 5)
            listTask.push(leaveGame);
        listTask.push(cc.delayTime(0.5));
        listTask.push(cleanUpAllGame);
        var seq = cc.sequence(listTask);

        this.node.runAction(seq);
    }

    checkWinSide(potWin) {
        this.potOnTableManager.showLightWin(potWin);

        if (potWin[0] === 0) {
            this.aniLong.setAnimation(0, 'attack', false);
            this.aniHo.setAnimation(0, 'hit', false);
        }
        else if (potWin[0] === 1) {
            this.aniLong.setAnimation(0, 'hit', false);
            this.aniHo.setAnimation(0, 'attack', false);
        }
    }

    onSendUnBet() {
        let pk = new DragonTiger_CMD.SendUnBet()
        DragonTiger_Connector.instance.sendPacket(pk)
    }

    onClickAddChip() {
        BGUI.ZLog.log('onClickAddChip = ', this._lastMyBet);

        if (this.chipManager.getTotalMyBet() === 0) {
            let arrBet = [...this._lastMyBet];
            for (let idBet = 0; idBet < 5; idBet++) {
                let chip = arrBet[idBet] * 2
                if (chip > 0) {
                    let arrC = this.chipManager.genChipValue(chip)
                    console.log('onClickAddChip _lastMyBet = ', idBet, arrC)

                    for (let i = 0; i < arrC.length; i++) {
                        let pk = new DragonTiger_CMD.SendBet();
                        pk.betValue = arrC[i];
                        pk.betSide = idBet;
                        DragonTiger_Connector.instance.sendPacket(pk)
                    }
                }
            }
        }
        else {
            for (let idBet = 0; idBet < 5; idBet++) {
                let arrBet = [...this.chipManager.chipMyBet];
                let chip = arrBet[idBet]
                if (chip > 0) {
                    let arrC = this.chipManager.genChipValue(chip)
                    console.log('onClickAddChip _lastMyBet = ', idBet, arrC)

                    for (let i = 0; i < arrC.length; i++) {
                        let pk = new DragonTiger_CMD.SendBet();
                        pk.betValue = arrC[i];
                        pk.betSide = idBet;
                        DragonTiger_Connector.instance.sendPacket(pk)
                    }
                }
            }
        }
    }

    onClickAuto() {
        let arrBet = [...this._lastMyBet];
        for (let idBet = 0; idBet < 5; idBet++) {
            let chip = arrBet[idBet]
            if (chip > 0) {
                let arrC = this.chipManager.genChipValue(chip)
                console.log('onClickAddChip _lastMyBet = ', idBet, arrC)

                for (let i = 0; i < arrC.length; i++) {
                    let pk = new DragonTiger_CMD.SendBet();
                    pk.betValue = arrC[i];
                    pk.betSide = idBet;
                    DragonTiger_Connector.instance.sendPacket(pk)
                }
            }
        }
    }

    _sendGetStatitics() {
        let pk = new DragonTiger_CMD.SendSoiCau()
        DragonTiger_Connector.instance.sendPacket(pk)
    }

    _sendGetHistoryPlayer(page) {
        let pk = new DragonTiger_CMD.SendHistoryBet();
        pk.page = page
        DragonTiger_Connector.instance.sendPacket(pk)
    }

    private _updateLangByUrl() {
        // const url = window.location.href;
        // let urlSearchParams = new URLSearchParams(url.split('?')[1]);
        // let lang = LanguageMgr.instance.getCurrentLanguage()
        // if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("lang")) {
        //     lang = urlSearchParams.get("lang")
        // }
        // LanguageMgr.updateLocalization(lang);
    }
}
