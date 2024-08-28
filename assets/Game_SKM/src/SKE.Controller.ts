import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SKMConnector from "../../lobby/scripts/network/wss/SKMConnector";
import LobbyCtrl from "../../lobby/scripts/LobbyCtrl";
import { CmdSendGetBalance } from "../../lobby/scripts/network/LobbySend";
import { LobbyCmdId } from "../../lobby/LobbyConst";
import { cmdReceive } from "../../lobby/scripts/network/LobbyReceive";
import BaseCard from "./SKE.BaseCard";
import Chip from "./SKE.Chip";
import SKMCmd from "./SKE.Cmd";
import SKMConstant from "./SKE.Constant";
import SKEPlayer from "./SKE.Player";
import SKMItemRoom from "./SKE.ItemRoom";
import SKESoundController, { SOUNDTYPE } from "./SKE.SoundController";
import PopupConfirmLeave from "./SKE.PopupConfirmLeave";
import SKECountDown from "./SKE.CountDown";
import SKMChat from "./SKE.Chat";

const { ccclass, property } = cc._decorator;

interface ImpUpdateStateGame {
    cardsOfMe: Array<number>,
    timeCountDown: number
}

interface ImpMoiDatCuoc {
    timeDatCuoc: number
}

interface ImpActionMoiUserRutBai {
    timeUserRutBai: number
}

interface ImpActionMoiBankerRutBai {
    timeBankerRutbai: number
}

@ccclass
export default class SKEController extends cc.Component {

    public static instance: SKEController = null;

    @property(cc.Sprite)
    public spRoomLevel: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasRoomLevel: cc.SpriteAtlas = null;

    @property(cc.Label)
    public lbMyBalance: cc.Label = null;

    @property(cc.Label)
    public lbRoomBalance: cc.Label = null;

    @property(sp.Skeleton)
    public skeletonBanker: sp.Skeleton = null;

    @property(SKESoundController)
    public soundControler: SKESoundController = null;

    @property(cc.Node)
    public UI_ChooseRoom: cc.Node = null;

    @property(cc.Button)
    public btnPlayingNow: cc.Button = null;

    @property(cc.Prefab)
    public prbSkmItemRoom: cc.Prefab = null;

    @property(cc.Node)
    public nodeChipDecorate: cc.Node = null;

    @property(cc.Prefab)
    public prbSkeChipDecorate: cc.Prefab = null;

    @property(cc.Node)
    public pnPlayers: cc.Node = null;

    @property(cc.Node)
    public nodeKiss: cc.Node = null;

    @property(cc.Node)
    public lbMoneyTip: cc.Node = null;

    @property(cc.Node)
    public nodeChiaBai: cc.Node = null;

    @property(cc.Node)
    public listNodePlayer: Array<cc.Node> = [];

    @property(cc.Label)
    public lblInvite: cc.Label = null;

    @property(cc.Node)
    public contentListRooms: cc.Node = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasCards: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasEmos: cc.SpriteAtlas = null;

    @property(sp.SkeletonData)
    public emosSkeletonData: sp.SkeletonData = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasAvatar: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasBtnControl: cc.SpriteAtlas = null;

    @property(cc.Node)
    public UI_Playing: cc.Node = null;

    @property(cc.Node)
    public pnControl: cc.Node = null;

    @property(cc.Prefab)
    public prfCard: cc.Prefab = null;

    @property(cc.Prefab)
    public prefabChat: cc.Prefab = null;

    @property(cc.Prefab)
    public prefabMoiChoi: cc.Prefab = null;

    @property(cc.Prefab)
    public prefabGuide: cc.Prefab = null;

    @property(cc.Prefab)
    public prefabDoubleBanker: cc.Prefab = null;

    @property(cc.SpriteFrame)
    public sprPointer: cc.SpriteFrame = null;

    @property(cc.Label)
    public lbValId: cc.Label = null;

    @property(cc.Label)
    public lbValBet: cc.Label = null;

    @property(cc.Label)
    public lbTimeCountDown: cc.Label = null;

    @property(cc.Node)
    public btnsInGame: cc.Node = null;

    @property(cc.Node)
    public btnRutBai: cc.Node = null;

    @property(cc.Node)
    public btnKoRutBai: cc.Node = null;

    @property(cc.Node)
    public pnMoney: cc.Node = null;

    @property(cc.Node)
    public nodeCoinFall: cc.Node = null;

    @property(cc.Node)
    public spToast: cc.Node = null;

    @property(cc.Prefab)
    public prfTease: cc.Prefab = null;

    @property(cc.Prefab)
    public prfPopupConfirmLeave: cc.Prefab = null;

    @property(cc.Button)
    public btnOnOffMucsic: cc.Button = null;

    @property(cc.SpriteFrame)
    public spriteBtnMusic: cc.SpriteFrame[] = [];

    @property(cc.Node)
    public pnBalanceBanker: cc.Node = null;

    @property(cc.Node)
    public nBankerTurn: cc.Node = null;

    @property(cc.Label)
    public lblBankerTurn: cc.Label = null;

    @property(cc.Label)
    public lblBetSelect: cc.Label = null;

    @property(cc.Node)
    public btnBet1ByValue: cc.Node = null;

    @property(cc.Node)
    public btnBet2ByValue: cc.Node = null;

    @property(cc.Node)
    public btnBet3ByValue: cc.Node = null;

    @property(cc.Node)
    public btnBet4ByValue: cc.Node = null;

    @property(cc.Node)
    public btnOnOffBetSlider: cc.Node = null;

    @property(cc.Slider)
    public sliderBet: cc.Slider = null;

    @property(cc.Integer)
    public maxPlayer: number = 9;

    @property(cc.Node)
    public effectNode: cc.Node = null;

    @property(cc.Node)
    public nodeTableCoin: cc.Node = null;

    @property(cc.Node)
    public nodeTableCoinBackup: cc.Node = null;

    @property(cc.Prefab)
    public prfChip: cc.Prefab = null;

    @property(cc.Prefab)
    public prfCountDown: cc.Prefab = null;

    private UI_CountDown: cc.Node = null;
    private UI_Chat: cc.Node = null;
    // private UI_Tease: cc.Node = null;
    private UI_MoiChoi: cc.Node = null;
    private UI_Guide: cc.Node = null;
    private UI_DoubleBanker: cc.Node = null;
    private _localRoomId = null;
    private _localBankTurn = 0;
    private _localMyChairOriginal = -1;
    private _localMoneyInTable = -1;
    private _localChuongChairOriginal = -1;
    private _localLevelRoomBet = 0;
    private _localListFlagPlayerBet = [];
    private _localArrayMoney = [];
    private players: Array<SKEPlayer> = [];
    private dataRooms = {};
    private _isGameActive: boolean = true;
    private hideTime: number = null;
    private _localVolume = 0;
    public moneyBetBySlider = 0;
    public _isRunningEffectLuotChuong = false;
    public _roomInviteId = null;
    private percentageOfSlider = 0;
    private readonly arrayPosOfChip: Array<cc.Vec2> = [
        cc.v2(0, 0), cc.v2(-72, 33),  cc.v2(-90, 15), cc.v2(30, 50), cc.v2(20, 35),
        cc.v2(40, 5), cc.v2(5, 75), cc.v2(70, 33), cc.v2(90, 15),
        cc.v2(30, 50), cc.v2(20, 35), cc.v2(-40, 5),
        cc.v2(75, 0), cc.v2(80, 80), cc.v2(-110, -40),
        cc.v2(50, 50), cc.v2(-50, 50), cc.v2(0, -50),
        cc.v2(0, 50), cc.v2(50, -50), cc.v2(-50, -50),
        cc.v2(50, 0), cc.v2(-50, 0), cc.v2(-100, 0), cc.v2(0, 100),
    ];

    private countDoNotInteract = 0;
    private isLeaveRoom = false;
    private gameState = -1;
    private gameAction = -1;
    // LIFE-CYCLE CALLBACKS:

    start() {
        this.btnPlayingNow.node.active = false;
        this.UI_ChooseRoom.active = true;
        this.UI_Playing.active = false;
        // this.scheduleOnce(this.sendRefreshListRoomType, 0.5);
        if (BGUI.UserManager.instance.mainUserInfo.game != "") {
            this.scheduleOnce(this.sendAutoReconnect, 1);
        }

        // this.scheduleOnce(this.sendRefeshListRoom, 2);
        // setTimeout(() => {
        //     this.handleRutTienChuong({ chairChuong: 0, moneyChuongWin: 99999999999999999999 });
        //     // this.runEffectTienThangChuong(this.players[0], 100000);
        //     this.runEffectDoiChuong(this.players[0]);
        // }, 15000);
    }

    private _scheduler: number = null;

    onLoad() {
        SKEController.instance = this;
        SKMConnector.instance.addCmdListener(BGUI.CmdDefine.DISCONNECTED, this.backToMain, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.LOGIN, this.responseLogin, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.CHAT_ROOM, this.responseChatRoom, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.GET_LIST_ROOM, this.responseGetListRoom, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.GET_LIST_ROOM_TYPE, this.responseGetListRoomType, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.JOIN_ROOM_FAIL, this.responseJoinRoomFail, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.AUTO_RECONNECT_GAME_ROOM_FAIL, this.responseAutoReconnectGameRoomFail, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.JOIN_ROOM_SUCCESS, this.responseJoinRoomSuccess, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MOI_CHOI, this.responseMoiChoi, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MONEY_BET_CONFIG, this.responseMoneyBetConfig, this) // ???
        SKMConnector.instance.addCmdListener(SKMCmd.Code.UPDATE_GAME_INFO, this.responseUpdateGameInfo, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.AUTO_START, this.responseAutoStart, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.USER_JOIN_ROOM, this.responseUserJoinRoom, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.CHIA_BAI, this.responseChiaBai, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MO_BAI, this.responseMoBai, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.END_GAME, this.responseEndGame, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.UPDATE_MATCH, this.responseUpdateMatch, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.USER_LEAVE_ROOM, this.responseUserLeaveRoom, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.REQUEST_LEAVE_ROOM, this.responseRequestLeaveRoom, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.DOI_CHUONG, this.responseDoiChuong, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.BANK_MONEY, this.responseBankMoney, this);
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MOI_DAT_CUOC, this.responseInviteBet, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MOI_USER_RUT_BAI, this.responseMoiUserRutBai, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MOI_CHUONG_RUT_BAI, this.responseMoiChuongRutBai, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.RUT_TIEN_CHUONG, this.responseRutTienChuong, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.MOI_RUT_BAI, this.responseMoiRutBai, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.RUT_BAI, this.responseRutBai, this);
        SKMConnector.instance.addCmdListener(SKMCmd.Code.DAT_CUOC, this.responseDatCuoc, this);
        SKMConnector.instance.addCmdListener(SKMCmd.Code.DOUBLE_BANKER, this.responseDoubleBanker, this)
        SKMConnector.instance.addCmdListener(SKMCmd.Code.FIRST_TURN, this.responseFirstTurn, this);
        SKMConnector.instance.addCmdListener(SKMCmd.Code.BANK_TURN, this.responseBankTurn, this);
        SKMConnector.instance.addCmdListener(SKMCmd.Code.CHANGE_TURN, this.responseChangeTurn, this);
        SKMConnector.instance.addCmdListener(SKMCmd.Code.SKM_TIP_TO_BANKER, this.responseTipToBanker, this);

        BGUI.NetworkPortal.instance.addCmdListener(LobbyCmdId.MINI_GET_BALANCE, this.responseVinTotal, this);
        SKMConnector.instance.addCmdListener(50, this.onPingPong, this);
        this.initSoundController();
        this.initTemplateCountDown();
        this.initTemplatePlayer();
        this.initTemplateChat();
        this.initTemplateTease();
        this.initTemplateMoiChoi();
        this.initTempleGuide();
        this.initTempleDoubleBanker();

        this._scheduler = window.setInterval(this.updateOffline.bind(this), 1000 / 60);
        this.setTextOfControl();
        this.lbRoomBalance.string = BGUI.StringUtils.formatNumber(BGUI.UserManager.instance.mainUserInfo.vinTotal);
        this.resetFirtGame();
        this.sendRefreshListRoomType();
        this.schedule(this.sendRefreshListRoomType, 5, cc.macro.REPEAT_FOREVER);
    }

    private onTouchStart(touchEvent) {
        this.countDoNotInteract = 0;
        this.hiddenPnControl();
        this.UI_Chat.active = false;
    }

    private updateOffline() {
        if (!this._isGameActive) {
            if (cc.sys.isBrowser) {
                cc.director.mainLoop();
            }
        }
    }

    onEnable() {
        this.UI_Playing.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
        cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
    }

    onDisable() {
        this.UI_Playing.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        cc.game.off(cc.game.EVENT_SHOW, this._onShowGame, this);
        cc.game.off(cc.game.EVENT_HIDE, this._onHideGame, this);
    }

    public backToMain() {
        SKMConnector.instance.disconnect();
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

    private responseVinTotal(cmdId: any, data: Uint8Array) {
        let res = new cmdReceive.ResVinTotalOfUser();
        res.unpackData(data);
        let totalMoney = res.vinTotal;
        BGUI.UserManager.instance.mainUserInfo.vinTotal = totalMoney
        BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD, totalMoney);
    }

    private requestVintotal(): void {
        let req = new CmdSendGetBalance();
        BGUI.NetworkPortal.instance.sendPacket(req);
    }

    public _onShowGame() {
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
        }
    }

    public _onHideGame() {
        this._isGameActive = false;
        if (cc.sys.isNative && cc.sys.isMobile) {
            this.hideTime = performance.now();
        }
    }

    public setMyBalance(balance: number): void {
        this.lbMyBalance.string = BGUI.StringUtils.formatNumber(balance);
        this.lbRoomBalance.string = BGUI.StringUtils.formatNumber(balance);
    }

    private initTemplateTease(): void {
        // this.UI_Tease = cc.instantiate(this.prfTease);
        // this.UI_Tease.active = true;
        // this.UI_Tease.zIndex = 999;
        // this.UI_Tease.setPosition(cc.v2(0, 0));
        // this.node.addChild(this.UI_Tease);
    }

    private initTemplateCountDown(): void {
        this.UI_CountDown = cc.instantiate(this.prfCountDown);
        this.UI_CountDown.active = true;
        this.UI_CountDown.setPosition(cc.v2(0, 60));
        this.UI_Playing.addChild(this.UI_CountDown);
    }

    private initTemplateChat(): void {
        this.UI_Chat = cc.instantiate(this.prefabChat);
        this.UI_Chat.active = true;
        this.UI_Chat.zIndex = 999;
        this.UI_Chat.setPosition(cc.v2(-700, 0));
        this.UI_Chat.getComponent(cc.Widget).isAlignLeft = true
        this.UI_Chat.getComponent(cc.Widget).left = 50;
        this.UI_Playing.addChild(this.UI_Chat);
    }

    private initTemplateMoiChoi(): void {
        this.UI_MoiChoi = cc.instantiate(this.prefabMoiChoi);
        this.UI_MoiChoi.active = true;
        this.UI_MoiChoi.zIndex = 999;
        this.UI_MoiChoi.setPosition(cc.v2(0, 0));
        this.node.addChild(this.UI_MoiChoi);
    }

    private initTempleGuide(): void {
        this.UI_Guide = cc.instantiate(this.prefabGuide);
        this.UI_Guide.active = true;
        this.UI_Guide.setPosition(cc.v2(0, 0));
        this.node.addChild(this.UI_Guide);
    }

    private initTempleDoubleBanker(): void {
        this.UI_DoubleBanker = cc.instantiate(this.prefabDoubleBanker);
        this.UI_DoubleBanker.active = true;
        this.UI_DoubleBanker.setPosition(cc.v2(0, 0));
        this.UI_Playing.addChild(this.UI_DoubleBanker);
    }

    // Note
    private resetFirtGame(): void {
        this.UI_Playing.active = false;
        this.UI_ChooseRoom.active = false;
        this.nodeChiaBai.active = true;
        this.nodeTableCoin.active = true;
        this.initEffect();
        this.lbTimeCountDown.node.active = false;
        this.spToast.active = false;
        this.resetAllPopup();
        this.resetNewSession();
        this.pnControl.getChildByName("BtnClose").getChildByName("Label").getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.leave_room_title");
        this.pnControl.getChildByName("BtnClose").getChildByName("Label").color = cc.color(255, 238, 214, 255);
        this.pnControl.active = false;
        this.isLeaveRoom = false;
    }

    // Reset ván mới
    private resetNewSession(): void {
        this._localListFlagPlayerBet = [];
        this._isRunningEffectLuotChuong = false;
        this.resetSkeketonBanker();
        this.hiddenPnMoney();
        this.setOnOffButtonsControl(false, false, false);
    }

    private actionSkeletonBanker(type, timeOut) {
        this.skeletonBanker.setAnimation(0, type, true);
        this.scheduleOnce(() => {
            this.resetSkeketonBanker();
        }, timeOut);
    }

    private resetSkeketonBanker() {
        this.skeletonBanker.setAnimation(0, "normal", true);
    }

    private resetAllPopup(): void {
        this.UI_MoiChoi.active = false;
        this.UI_Chat.active = false;
        // this.UI_Tease.active = false;
        this.UI_Guide.active = false;
        this.UI_DoubleBanker.active = false;
    }

    public onPingPong() {
        // TODO
    }

    private initTemplatePlayer(): void {
        this.pnPlayers.active = true;
        this.players = [];
        for (let i = 0; i < this.listNodePlayer.length; i++) {
            let nodePlayer = this.listNodePlayer[i];
            nodePlayer.zIndex = 1;
            let objPlayer = nodePlayer.getComponent(SKEPlayer);
            objPlayer.node.active = true;
            objPlayer.node.active = false;
            this.players.push(objPlayer);
        }
        this.nodeChiaBai.zIndex = 1;
        this.nodeTableCoin.zIndex = 2;
        this.nodeTableCoinBackup.zIndex = 2;
    }

    onDestroy() {
        this.unschedule(this.sendRefreshListRoomType);
        SKMConnector.instance.removeCmdListener(this, BGUI.CmdDefine.DISCONNECTED)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.LOGIN)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.CHAT_ROOM)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.GET_LIST_ROOM)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.GET_LIST_ROOM_TYPE)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.JOIN_ROOM_FAIL)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.AUTO_RECONNECT_GAME_ROOM_FAIL)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.JOIN_ROOM_SUCCESS)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MOI_CHOI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MONEY_BET_CONFIG)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.UPDATE_GAME_INFO)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.AUTO_START)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.USER_JOIN_ROOM)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.FIRST_TURN)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.CHIA_BAI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.CHANGE_TURN)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MO_BAI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MOI_DAT_CUOC)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.END_GAME)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.UPDATE_MATCH)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.USER_LEAVE_ROOM)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.REQUEST_LEAVE_ROOM)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.DOI_CHUONG)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.BANK_MONEY)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.BANK_TURN)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.DOUBLE_BANKER)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.DAT_CUOC)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.RUT_BAI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.RUT_TIEN_CHUONG)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MOI_USER_RUT_BAI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MOI_CHUONG_RUT_BAI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.MOI_RUT_BAI)
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.SKM_TIP_TO_BANKER);
        BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.MN_UPDATE_USER_INFO);
    }

    // Request UI Room
    public sendJoinRoom(infoRoom: SKMCmd.ImpRoomInfo): void {
        let pk = new SKMCmd.SendJoinRoom();
        pk.moneyType = infoRoom.moneyType;
        pk.rule = infoRoom.rule;
        pk.maxUserPerRoom = infoRoom.maxUserPerRoom;
        pk.moneyBet = infoRoom.moneyBet;
        SKMConnector.instance.sendPacket(pk);
    }

    public sendJoinRoomType(infoRoom: SKMCmd.ImpRoomTypeInfo): void {
        let pk = new SKMCmd.SendJoinRoomType();
        pk.id = infoRoom.id;
        pk.moneyBet = infoRoom.moneyBet;
        pk.minMoney = infoRoom.minMoney;
        pk.maxMoney = infoRoom.maxMoney;
        pk.maxUserPerRoom = infoRoom.maxUserPerRoom;
        SKMConnector.instance.sendPacket(pk);
    }

    private sendRefeshListRoom(): void {
        let pk = new SKMCmd.SendGetListRoom();
        pk.player = this.maxPlayer;
        SKMConnector.instance.sendPacket(pk)
    }

    private sendRefreshListRoomType(): void {
        SKMConnector.instance.sendPacket(new SKMCmd.SendGetListRoomType())
    }

    private sendAutoReconnect(): void {
        SKMConnector.instance.sendPacket(new SKMCmd.SendAutoReconnect())
    }

    public sendTipToBanker() {
        SKMConnector.instance.sendPacket(new SKMCmd.SendTipToBanker())
    }

    /// 28/06 đổi logic chơi phòng cao nhất
    public onClickPlayingNow() {
        this.soundControler.playMusicByType(SOUNDTYPE.CLICK);
        let infoRoomWillJoinGame = null;

        for (let key in this.dataRooms) {
            let infoRoom = this.dataRooms[key]
            if (infoRoom.allowJoin) {
                infoRoomWillJoinGame = infoRoom;
            }
        }
        if (infoRoomWillJoinGame) {
            this.sendJoinRoomType(infoRoomWillJoinGame);
        } else {
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("shankoemee.no_valid_table_found"));
        }
    }

    private hiddenPnControl() {
        this.pnControl.active = false;
    }

    public onClickOnOffTabControl() {
        this.UI_Chat.active = false;
        this.pnControl.active = !this.pnControl.active;
    }

    public onClickChat() {
        this.hiddenPnControl();
        this.UI_Chat.active = !this.UI_Chat.active;
        this.UI_Chat.getComponent(SKMChat).cleanEditbox();
    }

    public onClickShowUIGuide(): void {
        this.hiddenPnControl();
        this.UI_Guide.active = !this.UI_Guide.active;
    }

    public onClickOnOffMusic(event, data) {
        this._localVolume = (this._localVolume == 1) ? 0 : 1;
        this.btnOnOffMucsic.node.children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBtnMusic[this._localVolume];
        SKEController.instance.soundControler.setOnVolume(this._localVolume);
    }

    public onClickCloseUiPlaying() {
        if(this.isLeaveRoom) {
            this.sendRequestLeaveGame();
            this.hiddenPnControl();
        } else {
            BGUI.UIPopupManager.instance.showPopupFromPrefab(this.prfPopupConfirmLeave, (pop: PopupConfirmLeave) => {
                this.hiddenPnControl();
            });
        }
    }

    // Playing
    public onClickOpenMoiChoi() {
        let pk = new SKMCmd.SendRequestInfoMoiChoi();
        SKMConnector.instance.sendPacket(pk)
    }

    /// Moi Choi
    public sendBetAtFaceValue(event, data) {
        var moneyBet = (this._localArrayMoney[parseInt(data) - 1]) ? this._localArrayMoney[parseInt(data) - 1] : 0;
        if (moneyBet > 0) {
            let pk = new SKMCmd.SendDatCuoc();
            pk.moneyBet = moneyBet;
            SKMConnector.instance.sendPacket(pk);
            this.hiddenPnMoney();
        }
    }

    public toggleSlider() {
        this.showSliderMoney(true);
    }

    private showSliderMoney(isShow: boolean) {
        // if(isShow) {
        //     var spChipDecorate = cc.instantiate(this.prbSkeChipDecorate);
        //     spChipDecorate.setPosition(cc.v2(230, 0));
        //     this.nodeChipDecorate.addChild(spChipDecorate);
        // } else {
        //     this.nodeChipDecorate.removeAllChildren();
        // }
        this.resetSliderChip();
        this.btnOnOffBetSlider.active = !isShow;
        this.pnMoney.getChildByName("PnSliderMoney").active = isShow;
    }

    public betSelect2() {
        let pk = new SKMCmd.SendDatCuoc();
        pk.moneyBet = (this.moneyBetBySlider < this._localLevelRoomBet) ? this._localLevelRoomBet : this.moneyBetBySlider;
        SKMConnector.instance.sendPacket(pk);
        this.hiddenPnMoney();
    }

    public sliderEvent(slider): void {
        let percentTemp = Math.ceil(slider.progress * 100);
        let percent = (percentTemp < 10) ? 10 : percentTemp;
        let numberChip = Math.floor(percent / 10);

        this.nodeCoinFall.active = false;
        this.percentageOfSlider = percent;
        let numberChipInNode = this.nodeChipDecorate.children.length;
        if (numberChip >= numberChipInNode) {
            for (let i = 0; i < (numberChip - numberChipInNode); i++) {
                var spChipDecorate = cc.instantiate(this.prbSkeChipDecorate);
                spChipDecorate.setPosition(cc.v2(0, 45 * (numberChipInNode + i)));
                this.nodeChipDecorate.addChild(spChipDecorate);
            }
        } else {
            for(let k = numberChipInNode; k > numberChipInNode - numberChip ; k--) {
                let nodeChip = this.nodeChipDecorate.children[k -1];
                this.nodeChipDecorate.removeChild(nodeChip);
            }
        }

        this.lblBetSelect.node.setPosition(cc.v2(230, -200 + 40 * numberChip));
        this.moneyBetBySlider = this.calcMoneyBet(percent);
        let moneyBetBySlider = this.convertFl2Label(this.moneyBetBySlider);
        this.lblBetSelect.string = moneyBetBySlider;
    }

    private resetSliderChip() {
        this.nodeChipDecorate.removeAllChildren();
        this.percentageOfSlider = 0;
        if (this.nodeCoinFall) {
            this.nodeCoinFall.active = false;
        }
        var spChipDecorate = cc.instantiate(this.prbSkeChipDecorate);
        spChipDecorate.setPosition(cc.v2(0, 0));
        this.lblBetSelect.node.setPosition(cc.v2(230, -220 + 40 * 1));
        this.lblBetSelect.string = this.convertFl2Label(this._localLevelRoomBet);
        this.nodeChipDecorate.addChild(spChipDecorate);
    }

    private showDoubleBanker(isShow: boolean) {
        this.UI_DoubleBanker.active = isShow;
    }

    // ============= Response =============
    private responseRutTienChuong(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveRutTienChuong();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES RUT_TIEN_CHUONG 3129", res);
        ///////////////////////////////////////
        this.handleRutTienChuong({ chairChuong: res.chairChuong, moneyChuongWin: res.moneyChuongWin });
    }

    private handleRutTienChuong(res: { chairChuong: number, moneyChuongWin: number }) {
        this._localMoneyInTable = 0;
        let chairChuong = res.chairChuong;
        let moneyChuongWin = res.moneyChuongWin;
        let chair = this.convertChair(chairChuong);
        let objPlayerChuong = this.getInfoPlayerByChair(chair);
        if (objPlayerChuong && objPlayerChuong.checkIsActive()) {
            this.clearTablePot();
            this.runEffectTienThangChuong(objPlayerChuong, moneyChuongWin)
        }
    }

    private responseMoiRutBai(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveMoiRutBai();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MOI_RUT_BAI 3117", res);
        ////////////////////////////
        let chair = this.convertChair(res.chair);
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer.checkIsActive()) {
            objPlayer.setStateRutBai(res.dongy);
        }
    }

    private responseMoiChoi(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedMoiChoi();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MOI_CHOI 3011", res);
        //////////////////////////

        // this._roomInviteId = res.id;
        // this.lblInvite.string = LanguageMgr.getString("shankoemee.invite_user", { name: res.inviter });
    }

    private responseJoinRoomSuccess(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedJoinRoomSuccess();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES JOIN_ROOM_SUCCESS 3118", res);
        //////////////////////////
        this.initMusic();
        this.updateJoinRoomSuccess(res);
        let dataStateGame = {
            cardsOfMe: res.cardsOfMe,
            timeCountDown: res.countDownTime
        };
        this.updateStateOfGame(res.gameServerState, res.gameAction, dataStateGame);
    }

    private updateStateOfGame(gameServerState: number, gameAction: number, data: ImpUpdateStateGame): void {
        this.gameAction = gameAction;
        this.gameState = gameServerState;
        return;
        if (gameServerState == SKMConstant.ServerGameState.WAITING) {
            if (gameAction == SKMConstant.ActionInGameState.DEALING_CARDS) {
                this.handleMoiDatCuoc({ timeDatCuoc: 10 });
            } else {
                this.showToast(LanguageMgr.getString("shankoemee.waiting_new_game"));
            }
        }

        if (gameServerState == SKMConstant.ServerGameState.IN_GAME) {
            if (gameAction == SKMConstant.ActionInGameState.AUTO_OPEN_CARDS) {
            }
            if (gameAction == SKMConstant.ActionInGameState.INVITE_DRAW_CARD) {
                this.actionMoiUserRutBai({ timeUserRutBai: 90 });
            }
            if (gameAction == SKMConstant.ActionInGameState.AUTO_DRAW_CARDS) {
 
                this.actionMoiBankerRutBai({ timeBankerRutbai: 90 });
            }
            if (gameAction == SKMConstant.ActionInGameState.OPEN_CARDS_OF_USER) {

            }
            if (gameAction == SKMConstant.ActionInGameState.OPEN_CARD_OF_BANKER) {
          
            }
            if (gameAction == SKMConstant.ActionInGameState.END_GAME) {
            }
        }
    }

    private actionChiaBai(data: SKMCmd.PlayersCard) {
        // Hiệu ứng dealer
        this.actionSkeletonBanker("chia_bai", 1);
        this.showDoubleBanker(false);
        this._autoBets();
        this.nodeTableCoin.zIndex = 0;
        this.nodeChiaBai.zIndex = 1;
        this.pnPlayers.zIndex = 1;
        for (let i = 0; i < 9; i++) {
            // KHÔNG CẦN CONVERT
            let objPlayer = this.getInfoPlayerByChair(i);
            objPlayer.roomNodeCard(false, i);
            if (objPlayer.checkIsActive()) {
                if (objPlayer.checkIsMe()) {
                    objPlayer.setValueCards(data);
                }
                // Gán giá trị
                for (let index = 0; index < 2; index++) {
                    let prfCard = cc.instantiate(this.prfCard);
                    prfCard.zIndex = index;
                    prfCard.active = true;
                    let _baseCard = prfCard.getComponent(BaseCard);
                    objPlayer.addCard(_baseCard);
                }

                objPlayer.dealCardsToPlayers();

                this.scheduleOnce(() => {
                    if (objPlayer.checkIsMe()) {
                        objPlayer.autoOpenHiddenCards();
                        objPlayer.showResultOfCards(data.multiple, data.score, data.type);
                    }
                }, 5);
            }
        }
    }

    private handleMoiDatCuoc(data: ImpMoiDatCuoc) {
        for (let i = 0; i < 9; i++) {
            /// Cái này  không  phải convert
            let objPlayer = this.getInfoPlayerByChair(i);
            if (!objPlayer.checkIsChuong() && objPlayer.checkIsActive()) {
                objPlayer.setProgressThinking(data.timeDatCuoc);
            }
            if (!(this._localChuongChairOriginal == this._localMyChairOriginal)) {
                this.showToast(LanguageMgr.getString("shankoemee.place_bet"), true);
                if (objPlayer.checkIsMe()  && objPlayer.checkIsActive()) {
                    this.showPnMoney(objPlayer);
                }
                this.scheduleOnce(() => {
                    this.hiddenPnMoney();
                }, data.timeDatCuoc);
            }
        }
    }

    private actionMoiUserRutBai(data: ImpActionMoiUserRutBai) {
        for (let i = 0; i < 9; i++) {
            // KHÔNG CẦN CONVERT
            let objPlayerRutBai = this.getInfoPlayerByChair(i);

            if (objPlayerRutBai.checkIsActive() && !objPlayerRutBai.checkIsChuong()) {
                /// User thường
                objPlayerRutBai.setProgressThinking(data.timeUserRutBai);
                if (objPlayerRutBai.checkIsMe()) {
                    let listValueCards = objPlayerRutBai.getValueCards();
                    let cardScore = SKMConstant.CardLogic.getCardScore(listValueCards);
                    if (cardScore <= 2 && listValueCards.length == 2) {
                        this.setOnOffButtonsControl(true, true, false);
                    } else if (cardScore >= 8 && listValueCards.length == 2) {
                        objPlayerRutBai.offForceCountDown();
                        this.setOnOffButtonsControl(false, false, false);
                    } else {
                        this.setOnOffButtonsControl(true, true, true);
                    }
                    objPlayerRutBai.autoOpenHiddenCards();
                    this.scheduleOnce(() => {
                        this.setOnOffButtonsControl(false, false, false);
                    }, data.timeUserRutBai);
                }
            }
        }
    }

    private actionMoiBankerRutBai(data: ImpActionMoiBankerRutBai) {
        let chair = this.convertChair(this._localChuongChairOriginal);
        let objPlayerBanker = this.getInfoPlayerByChair(chair);
        if (objPlayerBanker.checkIsActive() && objPlayerBanker.checkIsChuong()) {
            ///  Banker thường
            objPlayerBanker.setProgressThinking(data.timeBankerRutbai);
            if (objPlayerBanker.checkIsMe()) {
                let listValueCards = objPlayerBanker.getValueCards();
                let cardScore = SKMConstant.CardLogic.getCardScore(listValueCards);
                if (cardScore <= 2 && listValueCards.length == 2) {
                    this.setOnOffButtonsControl(true, true, false);
                } else if (cardScore >= 8 && listValueCards.length == 2) {
                    this.setOnOffButtonsControl(false, false, false);
                } else {
                    this.setOnOffButtonsControl(true, true, true);
                }
                objPlayerBanker.autoOpenHiddenCards();
                this.scheduleOnce(() => {
                    this.setOnOffButtonsControl(false, false, false);
                }, data.timeBankerRutbai)
            }
        } else {
            console.error("ERROR: URGENT", "Chương nhưng không active hoặc không phải là chương")
        }
    }

    private initMusic() {
        LobbyCtrl.instance.stopBgMusic();
        this._localVolume = 1;
        this.btnOnOffMucsic.node.children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBtnMusic[this._localVolume];
        SKEController.instance.soundControler.setOnVolume(this._localVolume);
    }

    private responseLogin(cmdId: any, data: Uint8Array) {
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES LOGIN", "Login thành công");
        this.sendRefreshListRoomType();
    }

    private responseAutoReconnectGameRoomFail(cmdId: any, data: Uint8Array) {
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES AUTO_RECONNECT_GAME_ROOM_FAIL 3023");
    }

    private responseJoinRoomFail(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedJoinRoomFail();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES JOIN_ROOM_FAIL 3004", res);
        ////////////////////////////////
        let msg = LanguageMgr.getString("shankoemee.error_not_defined", { id: res.getError() })
        const errCode: number = res.getError();
        switch (errCode) {
            case 1:
                msg = LanguageMgr.getString("shankoemee.error_check_infomation");
                break;
            case 2:
                msg = LanguageMgr.getString("shankoemee.error_can_not_find_table_try_again");
                break;
            case 3:
                msg = LanguageMgr.getString("shankoemee.error_not_enough_money_to_join_table");
                break;
            case 4:
                msg = LanguageMgr.getString("shankoemee.error_can_not_find_table_try_again");
                break;
            case 5:
                msg = LanguageMgr.getString("shankoemee.error_join_room_too_fast");
                break;
            case 6:
                msg = LanguageMgr.getString("shankoemee.error_server_maintenance");
                break;
            case 7:
                msg = LanguageMgr.getString("shankoemee.error_can_not_find_table");
                break;
            case 8:
                msg = LanguageMgr.getString("shankoemee.error_password_table_not_correct");
                break;
            case 9:
                msg = LanguageMgr.getString("shankoemee.error_room_full");
                break;
            case 10:
                msg = LanguageMgr.getString("shankoemee.error_has_been_kick")
        }
        BGUI.UIPopupManager.instance.showPopup(msg);
    }

    private responseRequestLeaveRoom(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveNotifyRegOutRoom();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES REQUEST_LEAVE_ROOM 3111", res);
        ////////////////////////////////
        let isOutRoom = res.isOutRoom;
        let chair = this.convertChair(res.outChair);
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer.checkIsActive()) {
            objPlayer.showSpLeaveRoom(isOutRoom);
            if (objPlayer.checkIsMe()) {
                if (isOutRoom) {
                    this.isLeaveRoom = true;
                    this.pnControl.getChildByName("BtnClose").getChildByName("Label").getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.cancel_leave_room");
                    this.showToast(LanguageMgr.getString("shankoemee.register_leave_table_success"));
                    this.pnControl.getChildByName("BtnClose").getChildByName("Label").color = cc.color(255, 214, 20, 255);
                } else {
                    this.isLeaveRoom = false;
                    this.pnControl.getChildByName("BtnClose").getChildByName("Label").getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.leave_room_title");
                    this.showToast(LanguageMgr.getString("shankoemee.cancel_register_leave_table"));
                    this.pnControl.getChildByName("BtnClose").getChildByName("Label").color = cc.color(255, 238, 214, 255);
                }
            }
        }
    }

    private setTextOfControl() {
        this.pnControl.getChildByName("BtnClose").getChildByName("Label").getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.leave_room_title");
    }

    private responseBankMoney(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedBankMoney();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES BANK_MONEY 3124", res);
        /////////////////////////////////////
        if (res.money <= 0 || !res.isThrow) {
            return
        }

        let chair = this.convertChair(this._localChuongChairOriginal);
        let objPlayerBanker = this.getInfoPlayerByChair(chair);
        if (objPlayerBanker.checkIsActive()) {
            this._localMoneyInTable = res.money;
            let chipData = this.getChipData();
            let arrayNumberChip = this.calcChipBetweenPlayerAndTable(this._localMoneyInTable);
            let posPlayer = cc.v2(objPlayerBanker.node.getPosition().x, objPlayerBanker.node.getPosition().y);
            for (let i = 0; i < chipData.length; i++) {
                for (let j = 0; j < arrayNumberChip[i]; j++) {
                    let posChip = cc.v2(0,0);
                    let prfChip = cc.instantiate(this.prfChip);
                    prfChip.getComponent(Chip).init(chipData[i]);
                    prfChip.setPosition(posPlayer);
                    prfChip.opacity = 255;
                    this.nodeTableCoinBackup.addChild(prfChip);
                    prfChip.runAction(
                        cc.sequence(
                            cc.spawn(cc.fadeTo(1, 255), cc.moveTo(1, posChip).easing(cc.easeCubicActionOut())),
                            cc.callFunc(() => {
                                this.renderMoneyOfBanker(false, this._localMoneyInTable, "Banker bank tiền vào bàn");
                            }),
                            cc.delayTime(0.5),
                            cc.callFunc(() => {
                                prfChip.stopAllActions();
                                prfChip.removeFromParent(true);
                            })
                        ));
                }
            }
        }
    }

    private responseBankTurn(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedBankTurn();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES BANK_TURN 3130", res);
        ///////////////////////
        this._localBankTurn = res.bankTurn;
        let countDownTime = res.countDownTime;
        this.onOffBankTurn();
        if (this._isRunningEffectLuotChuong == false && this._localBankTurn >= 0) {
            this.runEffectBankTurn(countDownTime);
        }
    }

    private responseInviteBet(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedMoiDatCuoc();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MOI_DAT_CUOC 3114", res);
        /////////////////////////
        this.handleMoiDatCuoc({ timeDatCuoc: res.timeDatCuoc })
    }

    private responseMoiUserRutBai(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveMoiUserRutBai();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MOI_USER_RUT_BAI 3115", res);
        //////////////////////////
        this.actionMoiUserRutBai({ timeUserRutBai: res.countDownTime });
    }

    private responseMoiChuongRutBai(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveMoiChuongRutBai();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MOI_CHUONG_RUT_BAI 3116", res);
        //////////////////////////
        this.actionMoiBankerRutBai({ timeBankerRutbai: res.countDownTime });
    }

    private responseDoubleBanker(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveDoubleBanker();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES DOUBLE_BANKER 3125", res);
        /////////////////////////////////////////////////
        let chair = this.convertChair(this._localChuongChairOriginal);
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer.checkIsActive() && objPlayer.checkIsMe()) {
            this.showDoubleBanker(true);
            this.scheduleOnce(() => {
                this.showDoubleBanker(false);
            }, res.countDownTime)
        }
        if (objPlayer.checkIsActive()) {
            this.showToast(LanguageMgr.getString("shankoemee.waiting_banker"), false);
        }
    }

    private responseRutBai(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedRutBai();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES RUT_BAI 3128", res);
        //////////////////////////////////////////////////////////

        this.actionSkeletonBanker("chia_bai", 1);
        let chair = this.convertChair(res.chair);
        let objPlayerRutBai = this.getInfoPlayerByChair(chair);
        if (objPlayerRutBai.checkIsActive()) {
            objPlayerRutBai.setStateRutBai(-1);
            objPlayerRutBai.autoOpenHiddenCards();
            objPlayerRutBai.offForceCountDown();
            let nodeCard = cc.instantiate(this.prfCard);
            nodeCard.active = true;
            nodeCard.setPosition(0, 0);
            nodeCard.zIndex = 2;

            let _baseCard = nodeCard.getComponent(BaseCard);
            objPlayerRutBai.addCard(_baseCard);

            if (objPlayerRutBai.checkIsMe()) {
                objPlayerRutBai.addValueCard(res);
                this.setOnOffButtonsControl(false, false, false);
            }

            objPlayerRutBai.runEffectDealCards();
            this.scheduleOnce(() => {
                if (objPlayerRutBai.checkIsMe()) {
                    objPlayerRutBai.runEffectCardMeRutBai()
                } else {
                    objPlayerRutBai.runEffectCardUserRutBai();
                }
                this.scheduleOnce(() => {
                    if (objPlayerRutBai.checkIsMe()) {
                        objPlayerRutBai.autoOpenHiddenCards();
                        objPlayerRutBai.showResultOfCards(res.multiple, res.score, res.type);
                    }
                }, 5);
            }, 0.5)
        }
    }

    private responseDoiChuong(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedDoiChuong();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES DOI_CHUONG 3113", res);
        ///////////////////////////
        this.soundControler.playMusicByType(SOUNDTYPE.CHANGEBANKER);
        this._localChuongChairOriginal = res.chuongChair;
        let chair = this.convertChair(res.chuongChair);
        this._localMoneyInTable = res.bankMoney;
        this._localBankTurn = res.bankTurn;
        this.renderMoneyOfBanker(true, this._localMoneyInTable, "Đổi chương");
        this.onOffBankTurn();
        for (let i = 0; i < 9; i++) {
            // KHÔNG CẦN CONVERT
            let objPlayerTemp = this.getInfoPlayerByChair(i);
            if (objPlayerTemp.checkIsActive()) {
                objPlayerTemp.activeIsChuong(false);
            }
        }

        let objPlayerChuong = this.getInfoPlayerByChair(chair);

        if (objPlayerChuong instanceof SKEPlayer) {
            let playerInfo = objPlayerChuong.getInforPlayer();
            playerInfo.isChuong = true;
            objPlayerChuong.setPlayerInfo(playerInfo);
            this.runEffectDoiChuong(objPlayerChuong);
        }
        this.clearTablePot();
    }

    private responseDatCuoc(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedDatCuoc();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES DAT_CUOC 3109", res);
        //////////////////////////
        let errorCode = res.getError();
        // 0 thanh cong, 1 đã đặt cược, 2 không đủ tiền, 3 mức cược không đúng

        switch (errorCode) {
            case 0:
                let chair = this.convertChair(res.chair);
                let objPlayer = this.getInfoPlayerByChair(chair);
                this._localListFlagPlayerBet[chair] = true;
                if (objPlayer.checkIsActive()) {
                    objPlayer.offForceCountDown();
                    let moneyBet = res.moneyBet;
                    objPlayer.throwMoneyToTable(this._localLevelRoomBet, moneyBet);
                }
                break;

            case 1:
                BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("shankoemee.error_bet_already"))
                break;

            case 2:
                BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("shankoemee.error_not_enough_money"))
                break;

            case 3:
                BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("shankoemee.error_bet_not_correct"))
                break;
        }
    }

    private responseGetListRoom(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedGetListRoom();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES GET_LIST_ROOM 3014", res);
        //////////////////////////
    }

    private responseGetListRoomType(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedGetListRoomType();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES GET_LIST_ROOMTYPE 3017", res);
        //////////////////////////

        let roomBackgrounds = { "1000": "1", "5000": "1", "20000": "2", "100000": "2", "500000": "3", "1000000": "3", "5000000": "4", "20000000": "4" };

        this.dataRooms = {};
        var vinTotal = BGUI.UserManager.instance.mainUserInfo.vinTotal;
        for (let i = 0; i < res.list.length; i++) {
            let key = res.list[i].moneyBet;
            if (roomBackgrounds[key]) {
                const roomTypeData = res.list[i];
                this.dataRooms[key] = roomTypeData;
                this.dataRooms[key].bg = roomBackgrounds[key];
                this.dataRooms[key].userCount = roomTypeData.totalUser;
                this.dataRooms[key].requiredMoney = roomTypeData.minMoney;
                var tempMinJoin = 0;
                var tempMaxJoin = 0;
                if (!roomTypeData.maxMoney) {
                    this.dataRooms[key].maxJoin = [roomTypeData.minMoney];
                    tempMinJoin = roomTypeData.minMoney;
                    tempMaxJoin = roomTypeData.minMoney;
                } else {
                    this.dataRooms[key].maxJoin = [roomTypeData.minMoney, roomTypeData.maxMoney];
                    tempMinJoin = roomTypeData.minMoney;
                    tempMaxJoin = roomTypeData.maxMoney;
                }
                this.dataRooms[key].allowJoin = (tempMinJoin !== tempMaxJoin) ? (vinTotal >= tempMinJoin) && (vinTotal <= tempMaxJoin) : vinTotal >= tempMaxJoin;
            }
        }
        this.reloadListRoom();
    }

    private responseChatRoom(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedChatRoom();
        res.unpackData(data);
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES CHAT_ROOM 3008", res);
        //////////////////////////
        let chair = res.chair;
        let isIcon = res.isIcon;
        let content = res.content;
        let seatId = this.convertChair(chair);
        let objPlayer = this.getInfoPlayerByChair(seatId);
        if (objPlayer.checkIsActive()) {
            if (isIcon) {
                objPlayer.showChatEmotion(content);
            } else {
                objPlayer.showChatMsg(LanguageMgr.getString(content));
            }
        };
    }

    private responseMoneyBetConfig(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ResMoneyBetConfig();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MONEY_BET_CONFIG 3003", res);
        //////////////////////////
    }

    private reloadListRoom() {
        this.btnPlayingNow.node.active = true;
        this.contentListRooms.removeAllChildren(true);
        for (let key in this.dataRooms) {
            let itemRoom = this.dataRooms[key];
            let _prbSkmItemRoom = cc.instantiate(this.prbSkmItemRoom);
            let _skmItemRoom = _prbSkmItemRoom.getComponent(SKMItemRoom);
            _skmItemRoom.renderRoom(itemRoom);
            this.contentListRooms.addChild(_prbSkmItemRoom);
        }
    }

    private responseUpdateGameInfo(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedUpdateGameInfo();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES VIEW UPDATE_GAME_INFO 3110", res);
        //////////////////////////
        this.showToast(LanguageMgr.getString("shankoemee.waiting_new_game"));
        this.initMusic();
        // this.setTimeCountDown(0);
        this.updateJoinRoomSuccess(res);
        let dataStateGame = {
            cardsOfMe: res.cards,
            timeCountDown: res.countDownTime
        };
        this.updateStateOfGame(res.gameServerState, res.gameAction, dataStateGame);
    }

    public sendRequestLeaveGame(): void {
        if (!this.checkChuongIsMe() || this._localMoneyInTable <= 0) {
            SKMConnector.instance.sendPacket(new SKMCmd.SendRequestLeaveGame());
        } else {
            this.showToast(LanguageMgr.getString("shankoemee.cannot_out_room"));
        }
    }

    private responseAutoStart(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedAutoStart();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES AUTO_START 3107", res);
        //////////////////////////
        this.players.forEach((objPlayer) => {
            objPlayer.resetAndCleanUp();
            objPlayer.hideScore();
        });

        if (this.countDoNotInteract > 2) {
            this.sendRequestLeaveGame();
        }

        this.actionSkeletonBanker("tip_kiss", 1);
        if (res.isAutoStart) {
            this.resetNewSession();
            this.soundControler.playMusicByType(SOUNDTYPE.NEWGAME);
            this.showToast(LanguageMgr.getString("shankoemee.waiting_new_game"), true)
            this.setTimeCountDown(res.autoStartTime);
        }
    }

    private responseUserJoinRoom(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveUserJoinRoom();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES USER_JOIN_ROOM 3121", res);
        //////////////////////////

        if (res.uStatus != 0) {
            let playerInfo = res.playerInfo;
            let chair = this.convertChair(res.indexChair);
            let objPlayer = this.getInfoPlayerByChair(chair);
            playerInfo.indexChair = chair;
            if (objPlayer instanceof SKEPlayer) {
                this.players[chair].setPlayerInfo(playerInfo);
                let moneyBet = 0;
                this.players[chair].throwMoneyToTable(this._localLevelRoomBet, moneyBet);
            }
        }
    }

    private responseFirstTurn(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedFirstTurnDecision();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES FIRST_TURN", res);
        //////////////////////////
    }

    private responseTipToBanker(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedTipToBanker();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES SKM_TIP_TO_BANKER 3024", res);
        //////////////////////////
        let errorCode = res.getError();
        let amount = res.amount;
        if (errorCode === 0) {
            ///
            // this.showToast(LanguageMgr.getString("shankoemee.error_3024_tip_banker_0"));
            let chair = this.convertChair(res.chair);
            let objPlayerTip = this.players[chair];
            let balance = objPlayerTip.getAccountBalance();
            objPlayerTip.setAccountBalance(balance - amount);
            let posPlayer = cc.v2(objPlayerTip.node.getPosition().x, objPlayerTip.node.getPosition().y);

            let nodeHeart = cc.instantiate(this.nodeKiss);
            let labelTip = cc.instantiate(this.lbMoneyTip);

            this.pnPlayers.addChild(nodeHeart);
            this.pnPlayers.addChild(labelTip);

            nodeHeart.setPosition(cc.v2(0, 400));
            nodeHeart.active = false;
            nodeHeart.scale = 0.5;
            nodeHeart.opacity = 0;
            nodeHeart.zIndex = 9999;
            labelTip.setPosition(posPlayer);
            labelTip.getComponent(cc.Label).string = this.convert2Label(amount);
            labelTip.active = false;
            labelTip.scale = 0.65;
            labelTip.opacity = 255;
            labelTip.zIndex = 9999;
            this.scheduleOnce(() => {
                // this.skeletonBanker.setAnimation(0, "tip_kiss", false);
                this.actionSkeletonBanker("tip_kiss", 1);
            }, 1);
            this.scheduleOnce(() => {
                labelTip.active = true;
                labelTip.opacity = 255;
                labelTip.runAction(
                    cc.sequence(
                        cc.spawn(cc.moveTo(1, cc.v2(0, 310)).easing(cc.easeBackOut()), cc.scaleTo(1, 0.3),),
                        cc.callFunc(() => {
                            labelTip.active = false;
                            labelTip.opacity = 0;
                            nodeHeart.active = true;
                            nodeHeart.opacity = 255;

                            nodeHeart.runAction(
                                cc.sequence(
                                    cc.spawn(cc.moveTo(1, posPlayer).easing(cc.easeBackIn()), cc.scaleTo(1, 1)),
                                    cc.repeat(cc.sequence(cc.spawn(cc.scaleTo(0.2, 0.8, 1), cc.scaleTo(0.2, 1, 0.8)), cc.spawn(cc.scaleTo(0.2, 1, 0.8), cc.scaleTo(0.2, 0.8, 1))), 3),
                                    cc.callFunc(() => {
                                        nodeHeart.active = false;
                                        nodeHeart.opacity = 0;
                                        nodeHeart.stopAllActions();
                                        nodeHeart.removeFromParent();
                                        labelTip.stopAllActions();
                                        labelTip.removeFromParent();
                                    })
                                )
                            );
                        })),
                );
            }, 0.5);

        } else {
            switch (errorCode) {
                case 1:
                    // 1 - Chưa join room nào
                    break;

                case 2:
                    // 2 - Đã join room nhưng đang k ở chair nào
                    break;

                case 3:
                    // 3 - Không có thông tin gameplayer
                    break;

                case 4:
                    // 4 - Số tiền k đủ để thực hiện tip
                    break;
            }
            this.showToast(LanguageMgr.getString("shankoemee.error_3024_tip_banker_4"));
        }
    }

    private responseChangeTurn(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedChangeTurn();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES CHANGE_TURN  3112", res);
        //////////////////////////
    }

    private responseChiaBai(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedChiaBai();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES CHIA_BAI 3105", res);
        //////////////////////////

        if(res.cards.length != 2) {
            console.error("LỖI CHIA_BAI", res.cards);
        }

        let params: SKMCmd.PlayersCard = {
            cards: res.cards,
            type: res.type,
            multiple: res.multiple,
            score: res.score
        }
        this.actionChiaBai(params);
    }

    private responseMoBai(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedMoBai();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES MO_BAI 3101", res);
        //////////////////////////
        // this.setTimeCountDown(0);
        let cards = res.cards;
        // let type = res.type;
        // let multiple = res.multiple;
        // let score = res.score;

        let chair = this.convertChair(res.chair);
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer.checkIsActive()) {
            objPlayer.setStateRutBai(-1);
            if (objPlayer.checkIsMe()) {
                objPlayer.autoOpenHiddenCards();
                this.scheduleOnce(() => {
                    objPlayer.effectOpenCard(cards, res.multiple, res.score, res.type)
                }, 0.5)
            } else {
                objPlayer.roomNodeCard(true, null);
                objPlayer.effectOpenCard(cards, res.multiple, res.score, res.type)
                objPlayer.showResultOfCards(res.multiple, res.score, res.type);
            }
        }
    }

    private responseEndGame(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceivedEndGame();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES END_GAME 3103", res);
        //////////////////////////
        // this.countDoNotInteract++;
        this.handleEndGame(res);
    }

    private responseUpdateMatch(cmdId: any, data: Uint8Array): void {
        let res = new SKMCmd.ReceivedUpdateMatch();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES UPDATE_MATCH 3123", res);
        /////////////////////////////
        this._localMyChairOriginal = res.myChair;
        let bankerInTable = this.convertChair(this._localChuongChairOriginal);
        for (let i = 0; i < res.playerInfos.length; i++) {
            let chair = this.convertChair(i);
            let objPlayer = this.getInfoPlayerByChair(chair);
            let playerInfo = res.playerInfos[i];
            playerInfo.isChuong = (chair == bankerInTable);
            playerInfo.indexChair = chair;
            objPlayer.setPlayerInfo(playerInfo);
        }
    }

    private responseUserLeaveRoom(cmdId: any, data: Uint8Array): void {
        let res = new SKMCmd.ReceivedUserLeaveRoom();
        res.unpackData(data)
        console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, "XXXRES USER_LEAVE_ROOM 3119", res);
        ////////////
        let chair = this.convertChair(res.chair);
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer.checkIsInTable()) {
            if (objPlayer.checkIsMe()) {
                this.resetFirtGame();
                this.requestVintotal();
                this.soundControler.stopMusicByType(SOUNDTYPE.BACKGROUND);
                LobbyCtrl.instance.playBgMusic();
                this.players.forEach((itemPlayer) => {
                    itemPlayer.resetAndCleanUp();
                    itemPlayer.setNodeActive(false);
                });
                this.UI_Playing.active = false;
                this.UI_ChooseRoom.active = true;
                this.clearTablePot();
                this.resetAllPopup();
                this.sendRefreshListRoomType();
                this.schedule(this.sendRefreshListRoomType, 5, cc.macro.REPEAT_FOREVER);
            }
            objPlayer.setNodeActive(false);
            let moneyBet = 0;
            objPlayer.throwMoneyToTable(this._localLevelRoomBet, moneyBet);
        }
    }
    // ============= END - Response =============
    // ============= Handle =============

    private getInfoPlayerByChair(chairConverted: number): SKEPlayer {
        let objPlayer = this.players[chairConverted];
        if (objPlayer instanceof SKEPlayer) {
            return objPlayer;
        } else {
            console.error("ERROR", "Lỗi không tìm thấy user");
            return null;
        }
    }

    private getPossionChipInTable(index): cc.Vec2 {
        let pos = this.getRandomPosPhinh();
        return (this.arrayPosOfChip[index]) ? this.arrayPosOfChip[index] : pos;
    }

    private getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    private hiddenPnMoney(): void {
        // this.pnMoney.active = true;
        // this.showSliderMoney(true);
        this.pnMoney.active = false;
        this.showSliderMoney(false);
        this.lblBetSelect.string = BGUI.StringUtils.formatNumber(this._localLevelRoomBet);
        this._localArrayMoney = [];
        this.sliderBet.progress = 0;
        this.moneyBetBySlider = 0;
    }

    private calcMoneyBet(percent: number): number {
        var chair = this.convertChair(this._localMyChairOriginal);
        var objMe = this.players[chair];
        var myBalance = objMe.getAccountBalance();
        let money = this.roundAmount(this._localMoneyInTable, percent, this._localLevelRoomBet);
        let soTienBetToiDa = Math.min(this._localMoneyInTable, myBalance);
        if (myBalance < this._localLevelRoomBet) {
            return 0
        } else if (money >= soTienBetToiDa) {
            return soTienBetToiDa;
        } else if (money < this._localLevelRoomBet) {
            return this._localLevelRoomBet
        } else {
            return money
        }
    }

    private roundAmount(bankAmount, percent, moneyBetRom) {
        var soTienChuaLamTron = (bankAmount * percent) / 100;
        var count = 1;
        var integerValue = soTienChuaLamTron / 1000;
        var decimalValue = 0;
        while (decimalValue >= 1000) {
            var newIntegerValue = integerValue / 1000;
            decimalValue = Math.ceil((integerValue - newIntegerValue * 1000) / 10) * 10;
            integerValue = newIntegerValue;
            if (decimalValue >= 950) {
                decimalValue = 0;
                integerValue += 1;
            }
            count++;
        }
        return Math.max((integerValue * Math.pow(1000, count) + decimalValue * Math.pow(1000, count - 1)), moneyBetRom);
    }

    private showPnMoney(objPlayer: SKEPlayer): void {
        this.pnMoney.active = true;

        var percentage10 = this.calcMoneyBet(10);
        var percentage20 = this.calcMoneyBet(20);
        var percentage30 = this.calcMoneyBet(30);
        var percentage40 = this.calcMoneyBet(40);
        this._localArrayMoney = _.uniq([percentage10, percentage20, percentage30, percentage40]);

        this.btnBet1ByValue.active = false;
        this.btnBet2ByValue.active = false;
        this.btnBet3ByValue.active = false;
        this.btnBet4ByValue.active = false;

        for (var i = 0; i < this._localArrayMoney.length; i++) {
            var money = this._localArrayMoney[i];
            // var isEnabled = (money > 0);
            switch (i) {
                case 0:
                    this.btnBet1ByValue.active = true;
                    this.btnBet1ByValue.getChildByName("LbMoney").getComponent(cc.Label).string = this.convert2Label(money);
                    break;

                case 1:
                    this.btnBet2ByValue.active = true;
                    this.btnBet2ByValue.getChildByName("LbMoney").getComponent(cc.Label).string = this.convert2Label(money);
                    break;

                case 2:
                    this.btnBet3ByValue.active = true;
                    this.btnBet3ByValue.getChildByName("LbMoney").getComponent(cc.Label).string = this.convert2Label(money);
                    break;

                case 3:
                    this.btnBet4ByValue.active = true;
                    this.btnBet4ByValue.getChildByName("LbMoney").getComponent(cc.Label).string = this.convert2Label(money);
                    break;
            }
        }
    }

    private handleEndGame(res: SKMCmd.ReceivedEndGame): void {
        this.soundControler.playMusicByType(SOUNDTYPE.START_COMPARE)
        this.setOnOffButtonsControl(false, false, false);
        let listInfoMoneyOfPlayer = [];
        // this.setTimeCountDown(res.countDownEndGame);

        for (let i = 0; i < this.maxPlayer; i++) {
            // Cái này phải chạy lần lượt rồi máp  vơ
            let indexChair = this.convertChair(i);
            let objPlayer = this.getInfoPlayerByChair(indexChair);
            let _balance = res.listPlayerBalance[i];
            let cardInfo = res.cardList[i];
            let payoutInfo = res.listPlayerPayout[i];

            if (objPlayer.checkIsActive()) {
                objPlayer.autoOpenHiddenCards();
                objPlayer.setStateRutBai(-1);
                // objPlayer.setAccountBalance(_balance);
                let itemMoneyOfPlayer = {
                    objPlayer: objPlayer,
                    infoPlayer: objPlayer.getInforPlayer(),
                    chair: indexChair,
                    balance: _balance,
                    cardInfo: cardInfo,
                    payout: parseInt(payoutInfo)
                }

                if (!objPlayer.checkIsChuong()) {
                    listInfoMoneyOfPlayer.push(itemMoneyOfPlayer);
                }
            }
        }

        // Thông báo danh sách thắng và thua
        let totalMoneyLoser = 0;
        let totalMoneyWiner = 0;
        for (let itemInfoMoneyOfPlayer of listInfoMoneyOfPlayer) {
            if (itemInfoMoneyOfPlayer.payout < 0) {
                totalMoneyLoser += Math.abs(itemInfoMoneyOfPlayer.payout);
                itemInfoMoneyOfPlayer.objPlayer.setBonusAmount(parseInt(itemInfoMoneyOfPlayer.payout), true);
            }
            if (itemInfoMoneyOfPlayer.payout > 0) {
                totalMoneyWiner += Math.abs(itemInfoMoneyOfPlayer.payout);
                itemInfoMoneyOfPlayer.objPlayer.setBonusAmount(parseInt(itemInfoMoneyOfPlayer.payout), false);
            }
        }

        this.scheduleOnce(() => {
            this._localMoneyInTable = this._localMoneyInTable + totalMoneyLoser;
            this.renderMoneyOfBanker(true, this._localMoneyInTable, "Thu tiền người thua");
            for (let itemInfoMoneyOfPlayer of listInfoMoneyOfPlayer) {
                if (itemInfoMoneyOfPlayer.payout < 0) {
                    this.effectChipBetweenPlayerAndTable(itemInfoMoneyOfPlayer.objPlayer, -itemInfoMoneyOfPlayer.payout, false, false);
                    itemInfoMoneyOfPlayer.objPlayer.effectMoneyLoser(parseInt(itemInfoMoneyOfPlayer.payout));
                }
            }
            this.scheduleOnce(() => {
                this._localMoneyInTable = this._localMoneyInTable - totalMoneyWiner;
                this.renderMoneyOfBanker(true, this._localMoneyInTable, "Trả thưởng người thắng");
                for (let itemInfoMoneyOfPlayer of listInfoMoneyOfPlayer) {
                    if (itemInfoMoneyOfPlayer.payout > 0) {
                        this.effectChipBetweenPlayerAndTable(itemInfoMoneyOfPlayer.objPlayer, itemInfoMoneyOfPlayer.payout, true, false);
                        itemInfoMoneyOfPlayer.objPlayer.effectMoneyWin(parseInt(itemInfoMoneyOfPlayer.payout));
                    }
                }
                // this.scheduleOnce(() => {
                //     this._localMoneyInTable = res.bankMoney;
                //     this.renderMoneyOfBanker(true, this._localMoneyInTable, "Tổng kết tiền trên bàn");
                // }, 1)
            }, 1);
        }, 1);

        this.scheduleOnce(() => {
            this.resetInfoOfAllPlayer();
        }, 5);
    }

    // ============= End - Handle =============
    private initSoundController(): void {
        this.soundControler.initData();
    }

    private showBackgroundGameTable() {
        this.soundControler.playMusicByType(SOUNDTYPE.BACKGROUND);
        this.UI_Playing.active = true;
        this.UI_ChooseRoom.active = false;
    }

    private updateJoinRoomSuccess(res: any): void {
        if (res instanceof SKMCmd.ReceivedUpdateGameInfo || res instanceof SKMCmd.ReceivedJoinRoomSuccess) {
            this.unschedule(this.sendRefreshListRoomType);
            this._localRoomId = res.roomId;
            this._localChuongChairOriginal = res.chuongChair;
            this._localMyChairOriginal = res.myChair;
            this._localLevelRoomBet = _.get(res, "moneyBet", 0);
            this._localMoneyInTable = _.get(res, "bankMoney", 0);
            this._localBankTurn = _.get(res, "bankTurn", 0);
            this.countDoNotInteract = 0;
            this.showBackgroundGameTable();
            this.setRoomInfo();
            this.renderPlayerWhenJoinRoom(res);
            this.renderMoneyOfBanker(true, this._localMoneyInTable, "Join phòng");
            this.setSpriteRoomLevel();
        }
    }

    private setSpriteRoomLevel() {
        switch (this._localLevelRoomBet) {
            case 1000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_1k");
                break;

            case 5000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_5k");
                break;

            case 20000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_20k");
                break;

            case 100000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_100k");
                break;

            case 500000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_500k");
                break;

            case 1000000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_1m");
                break;

            case 5000000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_5m");
                break;

            case 20000000:
                this.spRoomLevel.spriteFrame = this.spriteAtlasRoomLevel.getSpriteFrame("ske_room_20m");
                break;
        }
    }

    private setRoomInfo(): void {
        // this.lblBetSelect.string = this._localLevelRoomBet.toString();
        this.lbValId.string = this._localRoomId.toString();
        this.lbValBet.string = BGUI.StringUtils.formatNumber(this._localLevelRoomBet);
        this.onOffBankTurn();
    }

    private convertFl2Label(num) {
        if (!num) {
            return "0";
        }

        let data = num;
        let extention = '';
        if ((data / 1000) >= 1) {
            data = data / 1000
            extention = "K";
            if ((data / 1000) >= 1) {
                data = data / 1000
                extention = "M";
                if ((data / 1000) >= 1) {
                    data = data / 1000
                    extention = "B";
                    if ((data / 1000) >= 1) {
                        data = data / 1000
                        extention = "T";
                    }
                }
            }
        }
        let dataFloor: any = (Math.floor(data * 100) / 100);
        if (parseInt(dataFloor) > 100) {
            dataFloor = dataFloor.toFixed(1)
        } else if (parseInt(dataFloor) > 10) {
            dataFloor = dataFloor.toFixed(2)
        } else {
            dataFloor = dataFloor.toFixed(3);
        }
        return dataFloor.toString() + extention;
    }

    private convert2Label(num): string {
        if (!num) {
            return "0";
        }

        let data = num;
        let returnKey = '';
        if ((data / 1000) >= 1) {
            data = data / 1000
            returnKey = "K";
            if ((data / 1000) >= 1) {
                data = data / 1000
                returnKey = "M";
                if ((data / 1000) >= 1) {
                    data = data / 1000
                    returnKey = "B";
                    if ((data / 1000) >= 1) {
                        data = data / 1000
                        returnKey = "T";
                    }
                }
            }
        }

        if (!this.isInt(data)) {
            if (data > 100) {
                data = data.toFixed(1)
            } else if (data > 10) {
                data = data.toFixed(2)
            } else {
                data = data.toFixed(2);
            }
        }
        return data.toString() + returnKey;
    }

    private isInt(num) {
        return num % 1 === 0;
    }

    private renderPlayerWhenJoinRoom(res: any): void {
        if (res instanceof SKMCmd.ReceivedJoinRoomSuccess || res instanceof SKMCmd.ReceivedUpdateGameInfo) {
            for (let i = 0; i < res.playerInfos.length; i++) {
                let infoPlayer = res.playerInfos[i];
                let chair = this.convertChair(i);
                infoPlayer.indexChair = chair;
                if (infoPlayer) {
                    let objPlayer = this.getInfoPlayerByChair(chair);
                    objPlayer.setPlayerInfo(infoPlayer);
                    objPlayer.resetAndCleanUp();
                    if (objPlayer.checkIsActive()) {
                        let moneyBet = infoPlayer.cuocChuong;
                        objPlayer.throwMoneyToTable(this._localLevelRoomBet, moneyBet);
                        let playersCard: SKMCmd.PlayersCard = {
                            cards: infoPlayer.cards,
                            multiple: infoPlayer.multiple,
                            score: infoPlayer.score,
                            type: infoPlayer.type
                        }
                        objPlayer.setValueCards(playersCard);
                        objPlayer.showCardWhenUpdateInfoGame(playersCard);
                    }
                }
            }
        }
    }

    private initEffect(): void {
        this.effectNode.active = true;
        this.effectNode.zIndex = this.pnPlayers.zIndex +  1;
        this.effectNode.getChildByName("EffectBankTurn").active = false;
        this.effectNode.getChildByName("EffectChuongThang").active = false;
        this.effectNode.getChildByName("EffectDoiChuong").active = false;
    }

    //// ========= END - SET ===============
    private runEffectDoiChuong(objPlayer: SKEPlayer) {
        this.soundControler.playMusicByType(SOUNDTYPE.CHANGEBANKER);
        let nodeDoiChuong = this.effectNode.getChildByName("EffectDoiChuong");
        let spEffectBanker = nodeDoiChuong.getChildByName("SpEffectBanker");
        let infoNickName = _.get(objPlayer, "info.displayName", "");
        var nickNameExt = (infoNickName.length > 12) ? ".." : "";
        spEffectBanker.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
        nodeDoiChuong.stopAllActions();
        nodeDoiChuong.active = true;
        nodeDoiChuong.getChildByName("LbMoney").getComponent(cc.Label).string = (infoNickName) ? infoNickName.slice(0, 12) + nickNameExt : "";;
        nodeDoiChuong.setPosition(0, 0);
        nodeDoiChuong.runAction(
            cc.sequence(
                cc.repeat(cc.sequence(cc.scaleTo(0.65, 1), cc.scaleTo(0.65, 0.85)), 3),
                cc.callFunc(() => {
                    nodeDoiChuong.stopAllActions();
                    spEffectBanker.stopAllActions();
                    nodeDoiChuong.active = false;
                })
            )
        );
    }

    private runEffectTienThangChuong(objPlayer: SKEPlayer, money: number) {
        let effectChuongThang = this.effectNode.getChildByName("EffectChuongThang");
        let spEffectBanker = effectChuongThang.getChildByName("SpEffectBanker");
        spEffectBanker.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
        effectChuongThang.active = true;
        effectChuongThang.stopAllActions();
        effectChuongThang.getChildByName("LbTitle").getComponent(cc.Label).string = _.get(objPlayer, "info.nickName", "");
        effectChuongThang.getChildByName("LbMoney").getComponent(cc.Label).string = "+" + BGUI.StringUtils.formatNumber(money);
        effectChuongThang.setPosition(0, 0);
        effectChuongThang.runAction(
            cc.sequence(
                cc.repeat(cc.sequence(cc.scaleTo(0.65, 1), cc.scaleTo(0.65, 0.85)), 3),
                cc.callFunc(() => {
                    spEffectBanker.stopAllActions();
                    effectChuongThang.stopAllActions();
                    effectChuongThang.active = false;
                    this.renderMoneyOfBanker(true, this._localMoneyInTable, "Tiền thắng chương");
                    objPlayer.addBalance(money);
                })
            )
        );
    }

    private onOffBankTurn(): void {
        if (this._localBankTurn >= 0) {
            this.nBankerTurn.active = true;
            this.lblBankerTurn.string = (this._localBankTurn + 1).toString();
        } else {
            this.nBankerTurn.active = false;
            this.lblBankerTurn.string = "";
        }
    }

    private runEffectBankTurn(time: number): void {
        this._isRunningEffectLuotChuong = true;
        let effectBankTurn = this.effectNode.getChildByName("EffectBankTurn");
        effectBankTurn.stopAllActions();
        effectBankTurn.active = true;
        effectBankTurn.getChildByName("LbTitle").active = true;

        if (this._localBankTurn > 0) {
            effectBankTurn.getChildByName("LbTitle").getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.banker_turn3", { turn: (this._localBankTurn + 1).toString() });
        } else {
            effectBankTurn.getChildByName("LbTitle").getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.banker_turn", { turn: (this._localBankTurn + 1).toString() });
        }
        var yPos = 0;
        effectBankTurn.setPosition(-850, yPos);
        effectBankTurn.runAction(
            cc.sequence(
                cc.moveTo(0.5, 0, yPos),
                cc.delayTime(time - 1),
                cc.moveTo(0.5, 850, yPos),
                cc.callFunc(() => {
                    effectBankTurn.stopAllActions();
                    effectBankTurn.active = false;
                    this._isRunningEffectLuotChuong = false;
                })
            )
        );
    }

    private setTimeCountDown(time: number): void {
        if (time > 0) {
            this.UI_CountDown.getComponent(SKECountDown).setCountDown(time);
        }
    }

    // Ấn số tiền
    private resetInfoOfAllPlayer(): void {
        for (let objPlayer of this.players) {
            let moneyBet = 0;
            objPlayer.throwMoneyToTable(this._localLevelRoomBet, moneyBet);
            objPlayer.resetAndCleanUp();
            objPlayer.hideScore();
        }
    }

    private setOnOffButtonsControl(showParent: boolean, allowRutBai: boolean, allowKoRutBai: boolean) {
        this.btnsInGame.active = showParent;
        if (showParent) {
            if (allowRutBai) {
                this.btnRutBai.getComponent(cc.Button).enabled = true;
            } else {
                this.btnRutBai.getComponent(cc.Button).enabled = false;
            }
            if (allowKoRutBai) {
                this.btnKoRutBai.getComponent(cc.Button).enabled = true;
                this.btnKoRutBai.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasBtnControl.getSpriteFrame("ske_btn_red_v1");
                this.btnKoRutBai.getChildByName("Background").getChildByName("Label").getComponent(cc.LabelOutline).color = cc.color(188, 21, 33, 255);
            } else {
                this.btnKoRutBai.getComponent(cc.Button).enabled = false;
                this.btnKoRutBai.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasBtnControl.getSpriteFrame("ske_btn_grey_v1");
                this.btnKoRutBai.getChildByName("Background").getChildByName("Label").getComponent(cc.LabelOutline).color = cc.color(51, 51, 51, 255);
            }
        }
    }

    private effectChipBetweenPlayerAndTable(objPlayer: SKEPlayer, money: number, isPlayerWin: boolean, isThangChuong: boolean) {
        let chipData = this.getChipData();
        let arrayNumberChip = this.calcChipBetweenPlayerAndTable(money);
        this.soundControler.playMusicByType(SOUNDTYPE.RUNMONEY);
        let posPlayer = cc.v2(objPlayer.node.getPosition().x, objPlayer.node.getPosition().y);
        let isOpenSound = false;
        for (let i = 0; i < chipData.length; i++) {
            for (let j = 0; j < arrayNumberChip[i]; j++) {
                let nodeChip = cc.instantiate(this.prfChip);
                nodeChip.getComponent(Chip).init(chipData[i]);
                nodeChip.opacity = 255;
                this.nodeTableCoinBackup.addChild(nodeChip);
                let posOfChip = this.getRandomPosPhinh();
                if (isPlayerWin) {
                    nodeChip.setPosition(posOfChip);
                    nodeChip.runAction(
                        cc.sequence(
                            cc.callFunc(() => {
                                if (objPlayer.checkIsMe() && isOpenSound == false) {
                                    isOpenSound = true
                                    this.soundControler.playMusicByType(SOUNDTYPE.WIN)
                                }
                            }),
                            cc.delayTime(0.5),
                            cc.moveTo(1, posPlayer).easing(cc.easeCubicActionOut()),
                            cc.callFunc(() => {
                                nodeChip.stopAllActions();
                                nodeChip.removeFromParent(true);
                            })
                        ));
                } else {
                    nodeChip.setPosition(posPlayer);
                    nodeChip.runAction(cc.sequence(
                        cc.moveTo(1, posOfChip).easing(cc.easeCubicActionOut()),
                        cc.callFunc(() => {
                            nodeChip.stopAllActions();
                            nodeChip.removeFromParent(true);
                            if (objPlayer.checkIsMe() && isOpenSound == false) {
                                isOpenSound = true
                                this.soundControler.playMusicByType(SOUNDTYPE.LOSE)
                            }
                        })));
                }
            }
        }
    }

    private convertChair(chair: number): number {
        let result = (chair - this._localMyChairOriginal + this.maxPlayer) % this.maxPlayer;
        return result;
    }

    public showToast(message: string, autoHide = true) {
        this.spToast.active = true;
        let lbToast = this.spToast.children[0].getComponent(cc.Label);
        if (!autoHide) {
            lbToast.string = message;
            this.spToast.stopAllActions();
            this.spToast.active = true;
            this.spToast.opacity = 255;
            return;
        }
        lbToast.string = message;
        this.spToast.stopAllActions();
        this.spToast.active = true;
        this.spToast.opacity = 0;
        this.spToast.runAction(cc.sequence(
            cc.fadeIn(0.1),
            cc.delayTime(2),
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.spToast.active = false;
            })));
    }

    public actLeaveRoom() {
        // TODO
    }

    ///
    public checkChuongIsMe(): boolean {
        let chairChuong = this.convertChair(this._localChuongChairOriginal);
        let objPlayerChuong = this.getInfoPlayerByChair(chairChuong);
        return objPlayerChuong.checkIsMe();
    }

    public _autoBets() {
        for (let i = 0; i < 9; i++) {
            /// Cái này  không phải convert
            let objPlayer = this.getInfoPlayerByChair(i);
            if (objPlayer.checkIsActive()) {
                if (!objPlayer.checkIsChuong()) {
                    let infoPlayer = objPlayer.getInforPlayer();
                    if (!this._localListFlagPlayerBet[infoPlayer.indexChair]) {
                        var moneyBet = this._localLevelRoomBet;
                        objPlayer.throwMoneyToTable(this._localLevelRoomBet, moneyBet);
                    }
                }
            }
        }
    }

    public sendRutBai() {
        this.setOnOffButtonsControl(false, false, false);
        let pk = new SKMCmd.SendRutBai();
        pk.rutbai = 1;
        SKMConnector.instance.sendPacket(pk);
    }

    public sendKhongRutBai() {
        this.setOnOffButtonsControl(false, false, false);
        let pk = new SKMCmd.SendRutBai();
        pk.rutbai = 0;
        SKMConnector.instance.sendPacket(pk);
    }

    private renderMoneyOfBanker(needCalc: boolean, money: number, note: string) {
        this.refeshChipInTable(needCalc);
        let validMoney = (money > 0) ? money : 0
        let _tempMoney = this.pad(validMoney, 10);
        let arrayMoneyReal = _tempMoney.split("");
        for (let i = 0; i < arrayMoneyReal.length; i++) {
            this.pnBalanceBanker.children[i].getComponent(cc.Label).string = arrayMoneyReal[i];
        }
    }

    private pad(num, n) {
        var _length = n - num.toString().length;
        if (_length <= 0) {
            return num.toString();
        }
        return (new Array(_length + 1)).join('0') + num;
    }

    private clearTablePot(): void {
        this.nodeTableCoin.removeAllChildren();
    }

    private refeshChipInTable(needCalc: boolean): void {
        if (needCalc) {
            this.clearTablePot();
        }
        this.scheduleOnce(() => {
            let arrayChipFaceValue = this.getChipData();
            let arrayNumberOfChipFaceValue = this.calcChipInTable(this._localMoneyInTable);
            let index = 0;
            for (let i = 0; i < arrayChipFaceValue.length; i++) {
                let itemChipFaceValue = arrayChipFaceValue[i];
                for (let j = 0; j < arrayNumberOfChipFaceValue[i]; j++) {
                    let posChip = this.getPossionChipInTable(index++);
                    let _prfChip = cc.instantiate(this.prfChip);
                    _prfChip.setPosition(posChip);
                    _prfChip.opacity = 255;
                    _prfChip.getComponent(Chip).init(itemChipFaceValue);
                    this.nodeTableCoin.addChild(_prfChip)
                }
            }
        }, 0.5);
    }

    private getRandomPosPhinh() {
        let x = this.getRandomArbitrary(-200, 200);
        let y = this.getRandomArbitrary(-50, 50);
        return cc.v2(x, y);
    }

    private getChipData(): Array<any> {
        let result = [
            this._localLevelRoomBet / 1000,
            this._localLevelRoomBet / 500,
            this._localLevelRoomBet / 200,
            this._localLevelRoomBet / 100,
            this._localLevelRoomBet / 50,
            this._localLevelRoomBet / 20,
            this._localLevelRoomBet / 10,
            this._localLevelRoomBet / 5,
            this._localLevelRoomBet / 2,
            this._localLevelRoomBet * 1,
            this._localLevelRoomBet * 2,
            this._localLevelRoomBet * 5,
            this._localLevelRoomBet * 10,
            this._localLevelRoomBet * 20,
            this._localLevelRoomBet * 50,
            this._localLevelRoomBet * 100,
            this._localLevelRoomBet * 200,
            this._localLevelRoomBet * 500,
            this._localLevelRoomBet * 1000,
        ];
        return result;
    }

    private calcChipInTable(money: number) {
        let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let _bankpot = (money > 0) ? money : 0;
        let chipData = this.getChipData();

        for (let i = chipData.length - 1; i > 0; i--) {
            result[i] = (_bankpot > 0) ? parseInt((_bankpot / (chipData[i])).toString()) : 0;
            _bankpot = _bankpot % (chipData[i]);
        }
        return result;
    }

    private calcChipBetweenPlayerAndTable(money): Array<any> {
        let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let chipData = this.getChipData();
        if (money < 0) {
            money = money * (-1);
        }
        for (let i = chipData.length - 1; i >= 0; i--) {
            result[i] = parseInt((money / (chipData[i])).toString());
            money = money % (chipData[i]);
        }
        return result;
    }
}
