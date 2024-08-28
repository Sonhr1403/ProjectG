import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIPlayer from "./BOOGYI.Player";
import BOOGYIArrangeCard from "./BOOGYI.ArrangeCard";
import SoundController, { SOUNDTYPE } from "./BOOGYI.SoundController";
import LobbyCtrl from "../../lobby/scripts/LobbyCtrl";
import { LobbyCmdId } from "../../lobby/LobbyConst";
import { cmdReceive } from "../../lobby/scripts/network/LobbyReceive";
import { CmdSendGetBalance } from "../../lobby/scripts/network/LobbySend";
import BOOGYICountDown from "./BOOGYI.CountDown";
import { CardLogic } from "./BOOGYI.CardLogic";
import BOOGYIConstant from "./BOOGYI.Constant";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BOOGYIController extends cc.Component {
  public static instance: BOOGYIController = null;

  public Ui_Chat: cc.Node = null;
  public Ui_ArrangeCard: cc.Node = null;
  public Popup_Guide: cc.Node = null;
  public Popup_Setting: cc.Node = null;
  public Popup_InviteFriend: cc.Node = null;
  public Popup_ConfirmLeave: cc.Node = null;

  @property(cc.Label)
  public lbMyBalance: cc.Label = null;

  @property(cc.Label)
  public lbRoomBalance: cc.Label = null;

  @property(sp.Skeleton)
  public skeletonBanker: sp.Skeleton = null;

  @property(SoundController)
  public soundControler: SoundController = null;

  @property(cc.Node)
  public nodeUiGame: cc.Node = null;

  @property(cc.Node)
  public nodeUiRoom: cc.Node = null;

  @property(cc.Node)
  public nodeUiTable: cc.Node = null;

  @property(cc.Node)
  public listNodePlayer: Array<cc.Node> = [];

  // UI Rooms
  @property(cc.SpriteAtlas)
  public spriteAtlasCards: cc.SpriteAtlas = null;

  @property(cc.SpriteFrame)
  public spriteFrameCardsBack: cc.SpriteFrame = null;

  @property(cc.SpriteAtlas)
  public spriteAtlasAvatar: cc.SpriteAtlas = null;
  @property(cc.SpriteFrame)
  public defaultAvatar: cc.SpriteFrame = null;

  @property(cc.Prefab)
  public prefabCountDown: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabPhinh: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabUiRoom: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabUiChat: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabPopUpGuide: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabPopUpSoundSetting: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabPopUpInviteFriend: cc.Prefab = null;

  @property(cc.Prefab)
  public prefabPopUpConfirmLeave: cc.Prefab = null;

  @property(cc.Label)
  public lbRoomId: cc.Label = null;

  @property(cc.Label)
  public lbRoomBet: cc.Label = null;

  @property(cc.Node)
  public pnPlayers: cc.Node = null;

  @property(cc.Label)
  public lbTimeCountDown: cc.Label = null;

  @property(cc.Label)
  public lbTimeCoDownBid: cc.Label = null;

  @property(cc.Node)
  public spToast: cc.Node = null;

  @property(cc.Node)
  public pnMoney: cc.Node = null;

  @property(cc.Prefab)
  public prefabArrangeCard: cc.Prefab = null;

  @property(cc.Node)
  public nodeBidSelect: cc.Node = null;

  @property(cc.Node)
  public nodePhinh: cc.Node = null;

  @property(cc.Node)
  public nChiaBai: cc.Node = null;

  @property(cc.Integer)
  public maxPlayer: number = 7;

  @property(cc.Label)
  public lblBetSelectBtn1: cc.Label = null;

  @property(cc.Label)
  public lblBetSelectBtn2: cc.Label = null;

  @property(cc.Label)
  public lblBetSelectBtn3: cc.Label = null;

  @property(cc.Label)
  public lblBetSelectBtn4: cc.Label = null;

  @property(cc.Node)
  public effectNode: cc.Node = null;

  @property(cc.Button)
  public btnOnOffMucsic: cc.Button = null;

  @property(cc.SpriteFrame)
  public spriteBtnOnOffMusic: cc.SpriteFrame[] = [];

  @property(cc.Node)
  public pnInvite: cc.Node = null;

  @property(cc.Button)
  public pnTipBttn: cc.Button = null;

  @property(cc.Prefab)
  public chipTip: cc.Prefab = null;

  @property(cc.Node)
  public banker: cc.Node = null;

  @property(sp.SkeletonData)
  public emo: sp.SkeletonData = null;

  @property(cc.Node)
  public popupTab: cc.Node = null;

  @property(cc.Node)
  public btnQuit: cc.Node = null;

  @property(cc.Node)
  public btnCancelQuit: cc.Node = null;

  @property(cc.Prefab)
  public kiss: cc.Prefab = null;

  @property(cc.Node)
  public gameTable: cc.Node = null;

  @property(cc.SpriteFrame)
  public tableBet: cc.SpriteFrame[] = [];

  @property(cc.Sprite)
  public tableBetsprite: cc.Sprite = null;

  @property(cc.Prefab)
  public bankerWait: cc.Prefab = null;

  @property(cc.SpriteFrame)
  public chipBaySFA: cc.SpriteFrame[] = [];

  private bankerWaitTemp: any = null;

  // private myChair = 0;
  // private _localVolume = 0;

  private timeCountDownDatBid = 0;
  private timeCountDownRutBai = 0;

  private _localRoomBet = 0;
  private _localListFlagPlayerBet = [];
  private _localChuongChairOriginal: number = -1;
  private _localMyChairOriginal: number = -1;
  private arrayThuTuChiaBai = [4, 5, 6, 0, 1, 2, 3];
  private players: Array<BOOGYIPlayer> = [];
  private _localBetSlider: number = 0;

  private playerNotInteractCount: number = 0;
  isPlayerInteract: boolean = false;

  isPopUpOutRoom: boolean = false;
  isPopUpSetting: boolean = false;
  isPopUpGuide: boolean = false;

  public scoreList: Array<number> = [];
  private iCompareList: Array<number> = [];
  private compareList: Array<number> = [];
  private chuongPlayer: BOOGYIPlayer = null;
  private chuongScore: number = 0;

  private stateOfGame: number = 0;
  private readonly STATE_AUTO_START = 1;
  private readonly STATE_CHIA_BAI = 2;
  private readonly STATE_MOI_DAT_BID = 3;
  private readonly STATE_MOI_DAT_CUOC = 4;
  private readonly STATE_RUT_BAI = 5;
  private readonly STATE_MO_BAI = 6;
  private readonly STATE_END_GAME = 7;

  // LIFE-CYCLE CALLBACKS:
  // private _oldPotPos = [];
  private _roomInviteId = null;
  // private _intervalRoom = null;

  private _scheduler: number = null;

  
  private _isGameActive: boolean = true;
  private hideTime: number = null;

  onLoad() {
    BOOGYIController.instance = this;
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.LOGIN,
      this.responseLogin,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.CHAT_ROOM,
      this.responseChatRoom,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.JOIN_ROOM_FAIL,
      this.responseJoinRoomFail,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.JOIN_ROOM_SUCCESS,
      this.responseJoinRoomSuccess,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.MOI_CHOI,
      this.responseMoichoi,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.UPDATE_GAME_INFO,
      this.responseUpdateGameInfo,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.AUTO_START,
      this.responseAutoStart,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.USER_JOIN_ROOM,
      this.responseUserJoinRoom,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.DAT_BID,
      this.responseDatBid,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.CHIA_BAI,
      this.responseChiaBai,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.XEP_BAI,
      this.responseXepBai,
      this
    );
    // BOOGYIConnector.instance.addCmdListener(
    //   BOOGYICmd.Code.MO_BAI,
    //   this.responseMoBai,
    //   this
    // );
    // BOOGYIConnector.instance.addCmdListener(
    //   BOOGYICmd.Code.BO_LUOT,
    //   this.responseBoLuot,
    //   this
    // );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.END_GAME,
      this.responseEndGame,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.UPDATE_MATCH,
      this.responseUpdateMatch,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.USER_LEAVE_ROOM,
      this.responseUserLeaveRoom,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.REQUEST_LEAVE_ROOM,
      this.responseRequestLeaveRoom,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.DOI_CHUONG,
      this.responseDoichuong,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.BANK_MONEY,
      this.responseBankMoney,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.MOI_DAT_CUOC,
      this.responseMoiDatCuoc,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.MOI_DAT_BID,
      this.responseMoidatBid,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.DAT_CUOC,
      this.responseDatCuoc,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.RUT_BAI,
      this.responseRutBai,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.AUTO_RECONNECT_GAME_ROOM_FAIL,
      this.responseAutoReconnectGameRoomFail,
      this
    );
    BOOGYIConnector.instance.addCmdListener(
      BOOGYICmd.Code.TIP,
      this.responseTip,
      this
    );

    BOOGYIConnector.instance.addCmdListener(
      BGUI.CmdDefine.DISCONNECTED,
      this.backToMain,
      this
    );
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.MINI_GET_BALANCE,
      this.responseVinTotal,
      this
    );
    BOOGYIConnector.instance.addCmdListener(50, this.onPingPong, this);

    this.initSoundControler();
    this.initTempCountDown();
    this.initTemplatePlayer();
    this.initTemplateUiChat();
    this.initTemplateArrangeCard();
    this.Ui_ArrangeCard.getComponent(BOOGYIArrangeCard).hidden();
    this.initTemplatePopupGuide();
    this.initTemplatePopupSound();
    this.initTemplateUiInviteFriend();
    this.initTemplatePopUpConfirmLeave();

    this.activeAllNodeFirstGame(true);
    this.nodeUiRoom.active = true;
    this.activeBidSelect(false);
    this.effectNode.active = false;
    this.switchRoomAndTable("ROOM");
    this.sendRefeshListRoomType();

    console.log("game", BGUI.UserManager.instance.mainUserInfo.game);
    if (BGUI.UserManager.instance.mainUserInfo.game != "") {
      this.scheduleOnce(this.sendAutoReconnect, 0.5);
      BGUI.UserManager.instance.mainUserInfo.game = "";
    }
    this.setTimeCountDown(this.STATE_AUTO_START, 0);
    this.resetAllNodeEffect();
    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    this.lbRoomBalance.string = BGUI.StringUtils.formatNumber(
      BGUI.UserManager.instance.mainUserInfo.vinTotal
    );
    this.playerNotInteractCount = 0;
    this.isPlayerInteract = false;

    this.schedule(this.sendRefeshListRoomType, 5, cc.macro.REPEAT_FOREVER);
  }

  private UI_CountDown: cc.Node = null;

  private initTempCountDown() {
    this.UI_CountDown = cc.instantiate(this.prefabCountDown);
    this.UI_CountDown.setPosition(cc.v2(0, 60));
    this.nodeUiTable.addChild(this.UI_CountDown);
  }

  private resetCtrNewGame(): void {
    this._localListFlagPlayerBet = [];
    this.activeBidSelect(false);
    if (this.Ui_ArrangeCard) {
      this.Ui_ArrangeCard.getComponent(BOOGYIArrangeCard).hidden();
    }
    this.effectNode.active = false;
    this.onOffPnMoney(false);
    this.scoreList = [];
    this.iCompareList = [];
    this.compareList = [];
    this.chuongPlayer = null;
    this.chuongScore = 0;
  }

  public openSoundSetting() {
    this.Popup_Setting.active = !this.Popup_Setting.active;
    this.popupTab.active = false;
    this.isPopUpSetting = true;
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  // public onClickMusic() {
  //   this._localVolume = this._localVolume == 1 ? 0 : 1;
  // this.btnOnOffMucsic.node.children[0].getComponent(cc.Sprite).spriteFrame =
  // this.spriteBtnMusic[this._localVolume];
  //   BOOGYIController.instance.soundControler.setOnVolume(this._localVolume);
  // }

  public onClickChat(event: CustomEvent, id: number) {
    this.Ui_Chat.active = !this.Ui_Chat.active;
    if (id == 1) {
      this.nodeUiTable
        .getChildByName("BG_UI_CHAT")
        .getChildByName("ScrollviewQuickChat").active = true;
      this.nodeUiTable
        .getChildByName("BG_UI_CHAT")
        .getChildByName("ScrollviewEmotion").active = false;
    } else if (id == 2) {
      this.nodeUiTable
        .getChildByName("BG_UI_CHAT")
        .getChildByName("ScrollviewQuickChat").active = false;
      this.nodeUiTable
        .getChildByName("BG_UI_CHAT")
        .getChildByName("ScrollviewEmotion").active = true;
    }
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  public onClickGuide() {
    this.Popup_Guide.active = !this.Popup_Guide.active;
    this.popupTab.active = false;
    this.isPopUpGuide = true;
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  public onClickInviteFriend() {
    let pk = new BOOGYICmd.SendRequestInfoMoiChoi();
    BOOGYIConnector.instance.sendPacket(pk);
  }

  ///////// Response /////////
  private responseLogin(cmdId: any, data: Uint8Array) {
    console.error("HHHHH LOGIN", "123");
    /////////////////////////////
    this.sendRefeshListRoomType();
  }

  private responseChatRoom(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedChatRoom();
    res.unpackData(data);
    console.error("HHHHH CHAT_ROOM", res);
    /////////////////////////////
    let chair = res.chair;
    let isIcon = res.isIcon;
    let content = res.content;
    let seatId = this.convertChair(chair);
    let objPlayerChat = this.getInfoPlayerByChair(seatId);
    if (isIcon) {
      objPlayerChat.showChatSprite(content);
    } else {
      objPlayerChat.showChatMsg(LanguageMgr.getString(content));
    }
  }

  private responseUpdateGameInfo(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedUpdateGameInfo();
    res.unpackData(data);
    console.error("HHHHH UPDATE_GAME_INFO", res);
    /////////////////////////////
    this._localChuongChairOriginal = res.chuongChair;
    this.initMusic();
    this.switchRoomAndTable("TABLE");
    this.setTimeCountDown(this.STATE_AUTO_START, 0);
    let params = {
      roomId: res.roomId,
      gameId: res.gameId,
      moneyBet: res.moneyBet,
    };
    this.updateInfoRoom(params);
    this.renderPlayerWhenJoinRoom(
      res.playerInfos,
      res.chuongChair,
      res.myChair,
      res.gameServerState
    );
    this.updateGameInfo(res);
    this.unschedule(this.sendRefeshListRoomType);
  }

  private responseAutoStart(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedAutoStart();
    res.unpackData(data);
    console.error("HHHHH AUTO_START", res);
    this.stateOfGame = 1;
    /////////////////////////////
    this.resetCtrNewGame();
    for (let objPlayerTemp of this.players) {
      objPlayerTemp.resetNewGame();
    }
    if (res.isAutoStart) {
      this.setTimeCountDown(this.STATE_AUTO_START, res.autoStartTime);
    }
  }

  private responseUserJoinRoom(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceiveUserJoinRoom();
    res.unpackData(data);
    console.error("HHHHH USER_JOIN_ROOM", res);
    /////////////////////////////
    let playerInfo = res.playerInfo;
    let chair = this.convertChair(res.chairOfUser);
    let objPlayerJoinRoom = this.getInfoPlayerByChair(chair);
    playerInfo.chairInTable = chair;
    objPlayerJoinRoom.initPlayerInfo(playerInfo, true);
  }

  private responseDatBid(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedDatBid();
    res.unpackData(data);
    console.error("HHHHH DAT_BID", res);
    /////////////////////////////
    const errCode: number = res.getError();
    let msg = "";
    if (errCode == 1) {
      msg = LanguageMgr.getString("boogyi.bid_error_1");
    } else if (errCode == 2) {
      msg = LanguageMgr.getString("boogyi.bid_error_2");
    }
    if (msg != "") {
      BGUI.UIPopupManager.instance.showPopup(msg);
      return;
    }
    let chair = this.convertChair(res.chair);
    let objPlayer = this.getInfoPlayerByChair(chair);
    if (objPlayer.checkIsActive()) {
      objPlayer.setBid(res.bid);
      if (objPlayer.checkIsMe()) {
        this.nodeBidSelect.children[0].active = false;
        this.nodeBidSelect.children[1].active = false;
        this.nodeBidSelect.children[2].active = false;
        this.nodeBidSelect.children[3].active = false;
        this.nodeBidSelect.children[4].active = false;
      }
    }
  }

  private responseChiaBai(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedChiaBai();
    res.unpackData(data);
    console.error("HHHHH CHIA_BAI", res);
    this.stateOfGame = this.STATE_CHIA_BAI;
    ///////////////////////////////////////
    this.runEffectStart();
    let dataDealing = {
      timeChiaBai: res.countDownTime,
      cardsOfMe: res.cards,
    };
    this.actionDealing4Cards(dataDealing);
  }

  private actionDealing4Cards(data: {
    timeChiaBai: number;
    cardsOfMe: Array<number>;
  }) {
    this.scheduleOnce(() => {
      this.skeletonBanker.setAnimation(0, "chia bai", true);
      this.pnTipBttn.interactable = false;
      this.scheduleOnce(() => {
        this.skeletonBanker.setAnimation(0, "normal", true);
        this.pnTipBttn.interactable = true;
      }, 3.5);
      this.onOffPnMoney(false);

      let delayTime = 0;
      for (let i = 0; i < this.maxPlayer; i++) {
        // KHÔNG CẦN CONVERT
        let chair = this.arrayThuTuChiaBai[i];
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer.checkIsActive()) {
          if (objPlayer.checkIsMe()) {
            objPlayer.listCard = data.cardsOfMe;
            objPlayer.off4FirstCard(delayTime);
          } else {
            objPlayer.off4FirstCard(delayTime);
          }
          delayTime++;
        }
      }
    }, 1.5);
  }

  private actionDealing5Cards(data: { timeXepBai: number; card: number }) {
    this.autoBet();
    this.onOffPnMoney(false);
    let idxChia = 0;

    for (let objPlayer of this.players) {
      if (objPlayer.checkIsActive()) {
        this.skeletonBanker.setAnimation(0, "chia bai", true);
        this.pnTipBttn.interactable = false;
        this.scheduleOnce(() => {
          this.skeletonBanker.setAnimation(0, "normal", true);
          this.pnTipBttn.interactable = true;
        }, 0.5);
        objPlayer.effectChiaLaBaiCuoi(idxChia);
        objPlayer.setTimeRemain(data.timeXepBai);
        if (objPlayer.checkIsMe()) {
          objPlayer.addCard(data.card);
          this.setTimeCountDown(this.STATE_RUT_BAI, data.timeXepBai);
        }
        idxChia++;
      }
    }

    if (this.isPopUpOutRoom) {
      this.Popup_ConfirmLeave.active = false;
    }
    if (this.isPopUpSetting) {
      this.Popup_Setting.active = false;
    }
    if (this.isPopUpGuide) {
      this.Popup_Guide.active = false;
    }
    // this.scheduleOnce(() => {
    //   if (this.Ui_ArrangeCard.active) {
    //     for (let objPlayer of this.players) {
    //       if (objPlayer.checkIsMe() && objPlayer.checkIsActive()) {
    //         BOOGYIArrangeCard.instance.onClickSubmitCard();
    //         break;
    //       }
    //     }
    //   }
    // }, data.timeXepBai - 0.1);
  }

  private actionMoiDatBid(data: { timeDatBid: number; bidMax: number }) {
    this.activeBidSelect(true);
    this.checkBidSelect(data.bidMax);
    // Thời gian đặt bid
    this.setTimeCountDown(this.STATE_MOI_DAT_BID, data.timeDatBid);
    this.scheduleOnce(() => {
      this.activeBidSelect(false);
      this.autoBid();
    }, data.timeDatBid);
  }

  private responseXepBai(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedXepBai();
    res.unpackData(data);
    console.error("HHHHH XEP_BAI", res);

    let chair = this.convertChair(res.chair);
    let objPlayer = this.getInfoPlayerByChair(chair);

    let cards = res.cards;
    if (objPlayer.checkIsActive()) {
      if (objPlayer.checkIsMe()) {
        let clientCards = BOOGYIArrangeCard.instance.getArrayCards();
        this.runCtrOpenCardOfMe(objPlayer, clientCards);
      }
      if (cards.length > 4) {
        objPlayer.listCard = cards;
        objPlayer.openAllCardOfPlayer(cards);
      }
      if (objPlayer.isBankerWait) {
        this.bankerWaitTemp.removeFromParent();
        objPlayer.isBankerWait = false;
      }
      if (objPlayer.checkIsChuong() && !objPlayer.checkIsMe()) {
        if (cards.length == 0) {
          console.log("run banker wait");
          this.bankerWaitTemp = cc.instantiate(this.bankerWait);
          objPlayer.cardOnHand.addChild(this.bankerWaitTemp);
          this.bankerWaitTemp.setPosition(16, -47);
          this.bankerWaitTemp.active = true;
          objPlayer.isBankerWait = true;
        }
      }
      objPlayer.hidePlayCountdown();
      objPlayer.hideSpark();
    }
  }

  public runCtrOpenCardOfMe(objMe: BOOGYIPlayer, cards: Array<number>) {
    try {
      objMe.runOpenCardOfMe(cards);
      this.Ui_ArrangeCard.getComponent(BOOGYIArrangeCard).hidden();
    } catch (error) {
      console.error("ERROR:", error);
    }
  }

  // private responseMoBai(cmdId: any, data: Uint8Array) {
  //   // TODO
  // }

  // private responseBoLuot(cmdId: any, data: Uint8Array) {
  //   // TODO
  // }

  private responseEndGame(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedEndGame();
    res.unpackData(data);
    console.error("HHHHH END_GAME", res);
    this.stateOfGame = 7;
    //////////////////////////
    this.soundControler.playMusicByType(SOUNDTYPE.START_COMPARE);
    this.scheduleOnce(() => {
      //chờ nhạc start compare chạy xong
      this.processFinishGame(res);
    }, 1.5);

    console.log(this.isPlayerInteract, this.playerNotInteractCount);
    if (this.isPlayerInteract) {
      this.playerNotInteractCount = 0;
    } else if (!this.isPlayerInteract && res.listStatus[0] == 3) {
      this.playerNotInteractCount += 1;
    }
    this.isPlayerInteract = false;
    if (this.playerNotInteractCount == 3) {
      this.playerNotInteractCount = 0;
      this.Popup_ConfirmLeave.getComponent(
        "BOOGYI.PopupConfirmLeave"
      ).confirmLeave();
    }
    console.log(this.isPlayerInteract, this.playerNotInteractCount);
  }

  private responseUpdateMatch(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedUpdateMatch();
    res.unpackData(data);
    console.error("HHHHH UPDATE_MATCH", res);
    //////////////////////////
    this.renderPlayerWhenJoinRoom(
      res.playerInfos,
      this._localChuongChairOriginal,
      res.myChair,
      0
    );
  }

  private responseUserLeaveRoom(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.UserLeaveRoom();
    res.unpackData(data);
    console.error("HHHHH USER_LEAVE_ROOM", res);
    //////////////////////////
    let chair = this.convertChair(res.chair);
    let objPlayerLeaveRoom = this.getInfoPlayerByChair(chair);
    if (objPlayerLeaveRoom.checkIsInTable()) {
      objPlayerLeaveRoom.activeLeaveRoom(true);
      let objPlayerInfo = objPlayerLeaveRoom.getInforPlayer();
      objPlayerInfo.active = false;
      objPlayerLeaveRoom.initPlayerInfo(objPlayerInfo, true);
      objPlayerLeaveRoom.resetNewGame();
      if (objPlayerLeaveRoom.checkIsMe()) {
        this.soundControler.stopMusicByType(SOUNDTYPE.BACKGROUND);
        objPlayerLeaveRoom.resetNewGame();
        this.switchRoomAndTable("ROOM");
        // this.unschedule(this.updateInvite);
        this.schedule(this.sendRefeshListRoomType, 5, cc.macro.REPEAT_FOREVER);
      }
    }
  }

  private responseMoichoi(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedMoiChoi();
    res.unpackData(data);
    console.error("HHHHH MOI_CHOI", res);
    this._roomInviteId = res.id;
  }

  private responseJoinRoomFail(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedJoinRoomFail();
    res.unpackData(data);
    console.error("HHHHH JOIN_ROOM_FAIL", res);

    let msg = LanguageMgr.getString("boogyi.error_not_defined", {
      id: res.getError(),
    });
    const errCode: number = res.getError();
    switch (errCode) {
      case 1:
        msg = LanguageMgr.getString("boogyi.error_check_infomation");
        break;
      case 2:
        msg = LanguageMgr.getString(
          "boogyi.error_can_not_find_table_try_again"
        );
        break;
      case 3:
        msg = LanguageMgr.getString(
          "boogyi.error_not_enough_money_to_join_table"
        );
        break;
      case 4:
        msg = LanguageMgr.getString(
          "boogyi.error_can_not_find_table_try_again"
        );
        break;
      case 5:
        msg = LanguageMgr.getString("boogyi.error_join_room_too_fast");
        break;
      case 6:
        msg = LanguageMgr.getString("boogyierror_server_maintenance");
        break;
      case 7:
        msg = LanguageMgr.getString("boogyi.error_can_not_find_table");
        break;
      case 8:
        msg = LanguageMgr.getString("boogyi.error_password_table_not_correct");
        break;
      case 9:
        msg = LanguageMgr.getString("boogyi.error_room_full");
        break;
      case 10:
        msg = LanguageMgr.getString("boogyi.error_has_been_kick");
    }
    BGUI.UIPopupManager.instance.showPopup(msg);
  }

  private responseRequestLeaveRoom(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceiveNotifyRegOutRoom();
    res.unpackData(data);
    console.error("HHHHH REQUEST_LEAVE_ROOM", res);

    let outChair = res.outChair;
    let isOutRoom = res.isOutRoom;
    let chair = this.convertChair(outChair);
    let objPlayerRegister = this.getInfoPlayerByChair(chair);
    objPlayerRegister.activeLeaveRoom(isOutRoom);
    if (objPlayerRegister.checkIsMe()) {
      let message = isOutRoom
        ? LanguageMgr.getString("shankoemee.register_leave_table_success")
        : LanguageMgr.getString("shankoemee.cancel_register_leave_table");
      this.showToast(message);
    }
  }

  private responseBankMoney(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedBankMoney();
    res.unpackData(data);
    console.error("HHHHH BANK_MONEY", res);
  }

  private responseMoiDatCuoc(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedMoiDatCuoc();
    res.unpackData(data);
    console.error("HHHHH MOI_DAT_CUOC", res);
    this.stateOfGame = 4;
    ////////////////////////

    for (let objPlayerTemp of this.players) {
      if (!objPlayerTemp.checkIsChuong()) {
        if (objPlayerTemp.checkIsActive()) {
          objPlayerTemp.setTimeRemain(res.timeDatCuoc);
        }
      }
    }

    if (this._localChuongChairOriginal == this._localMyChairOriginal) {
      return;
    }

    this.processStateMoiDatCuoc(this._localMyChairOriginal);
    this.scheduleOnce(() => {
      this.onOffPnMoney(false);
    }, res.timeDatCuoc);
  }

  private responseMoidatBid(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedMoiDatBid();
    res.unpackData(data);
    console.error("HHHHH MOI_DAT_BID", res);
    this.stateOfGame = 3;
    ////////////////
    let dataDatBid = {
      timeDatBid: res.timeDatCuoc,
      bidMax: res.bidMax,
    };
    this.actionMoiDatBid(dataDatBid);
  }

  private activeBidSelect(isActive: boolean): void {
    this.nodeBidSelect.active = isActive;
    this.nodeBidSelect.children[0].active = isActive;
    this.nodeBidSelect.children[1].active = isActive;
    this.nodeBidSelect.children[2].active = isActive;
    this.nodeBidSelect.children[3].active = isActive;
    this.nodeBidSelect.children[4].active = isActive;
  }

  private responseDoichuong(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedDoiChuong();
    res.unpackData(data);
    ////////////////////
    console.error("HHHHH DOI_CHUONG", res);
    this._localChuongChairOriginal = res.chuongChair;
    this.setChuongChair(res.chuongChair, true, true);
    this.scheduleOnce(() => {
      for (let objPlayer of this.players) {
        if (!objPlayer.checkIsChuong()) {
          objPlayer.bidNode.active = false;
        }
      }
    }, 2);
  }

  private responseRutBai(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedRutBai();
    res.unpackData(data);
    console.error("HHHHH RUT_BAI", res);
    this.stateOfGame = 5;

    /// Thời  gian rút bài
    let dataRutBai = {
      timeXepBai: res.countDownTime,
      card: res.card,
    };
    this.actionDealing5Cards(dataRutBai);
  }

  private onOffPnMoney(isShow: boolean): void {
    this.pnMoney.active = isShow;
  }

  private responseDatCuoc(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedDatCuoc();
    res.unpackData(data);
    console.error("HHHHH DAT_CUOC", res);

    let err = res.getError();
    //0 thanh cong, 1 đã đặt cược, 2 không đủ tiền, 3 mức cược không đúng
    switch (err) {
      case 0:
        let chair = this.convertChair(res.chair);
        let objPlayer = this.getInfoPlayerByChair(chair);
        if (objPlayer) {
          this._localListFlagPlayerBet[chair] = true;
          objPlayer.throwMoneyToTable(this._localRoomBet, res.rate, chair);
        }
        break;

      case 1:
        BGUI.UIPopupManager.instance.showPopup(
          LanguageMgr.getString("boogyi.error_bet_already")
        );
        break;

      case 2:
        BGUI.UIPopupManager.instance.showPopup(
          LanguageMgr.getString("boogyi.error_not_enough_money")
        );
        break;

      case 3:
        BGUI.UIPopupManager.instance.showPopup(
          LanguageMgr.getString("boogyi.error_bet_not_correct")
        );
        break;
    }
  }

  private responseJoinRoomSuccess(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedJoinRoomSuccess();
    res.unpackData(data);
    console.error("HHHHH JOIN_ROOM_SUCCESS", res);
    ///////////////////////////////////////// HERE
    this._localChuongChairOriginal = res.chuongChair;
    this.initMusic();
    this.switchRoomAndTable("TABLE");
    let params = {
      roomId: res.roomId,
      gameId: res.gameId,
      moneyBet: res.moneyBet,
    };
    this.updateInfoRoom(params);
    this.renderPlayerWhenJoinRoom(
      res.playerInfos,
      res.chuongChair,
      res.myChair,
      res.gameServerState
    );
    this.updatejoinroom(res);

    this.unschedule(this.sendRefeshListRoomType);
    // this.schedule(this.updateInvite, 0.2, cc.macro.REPEAT_FOREVER);
  }

  private initMusic(): void {
    LobbyCtrl.instance.stopBgMusic();
    // this._localVolume = 1;
    // BOOGYISoundSetting.instance._localVolumeMusic = 1;
    // BOOGYISoundSetting.instance._localVolumeSound = 1;
    // this.btnOnOffMucsic.node.children[0].getComponent(cc.Sprite).spriteFrame =
    //   this.spriteBtnMusic[this._localVolume];
    // BOOGYIController.instance.soundControler.setOnVolume(this._localVolume);
  }

  /////////// END ///////
  private activeAllNodeFirstGame(isActive: boolean): void {
    this.nodeUiRoom.active = isActive;
    this.nodeUiTable.active = isActive;
    this.Popup_InviteFriend.active = isActive;
    this.Popup_Guide.active = isActive;
    this.Popup_ConfirmLeave.active = isActive;
    this.Popup_Setting.active = isActive;
    this.effectNode.active = isActive;
    this.Ui_Chat.active = isActive;
    this.nodeBidSelect.active = isActive;
  }

  private switchRoomAndTable(name: string) {
    this.activeAllNodeFirstGame(false);
    switch (name) {
      case "ROOM":
        this.lbRoomBalance.string = BGUI.StringUtils.formatNumber(
          BGUI.UserManager.instance.mainUserInfo.vinTotal
        );
        this.nodeUiRoom.active = true;
        if (this.Popup_Setting.active) {
          this.isPopUpSetting = false;
        }
        if (this.Popup_Guide.active) {
          this.isPopUpGuide = false;
        }
        if (this.Popup_ConfirmLeave.active) {
          this.isPopUpOutRoom = false;
        }
        if (this.popupTab.active) {
          this.popupTab.active = false;
        }
        break;

      case "TABLE":
        this.nodeUiTable.active = true;
        if (this.btnCancelQuit.active) {
          this.changeBtnQuit();
        }

        break;
    }
  }

  private initTemplateArrangeCard() {
    this.Ui_ArrangeCard = cc.instantiate(this.prefabArrangeCard);
    this.Ui_ArrangeCard.opacity = 0;
    this.Ui_ArrangeCard.zIndex = 999;
    this.Ui_ArrangeCard.active = true;
    this.Ui_ArrangeCard.setPosition(cc.v2(0, 0));
    this.nodeUiTable.addChild(this.Ui_ArrangeCard);
  }

  private initTemplateUiChat(): void {
    this.Ui_Chat = cc.instantiate(this.prefabUiChat);
    this.Ui_Chat.active = false;
    this.Ui_Chat.zIndex = 999;
    this.Ui_Chat.setPosition(cc.v2(-670, -250));
    this.nodeUiTable.addChild(this.Ui_Chat);
  }

  private initTemplatePopupGuide(): void {
    this.Popup_Guide = cc.instantiate(this.prefabPopUpGuide);
    this.Popup_Guide.active = false;
    this.Popup_Guide.zIndex = 999;
    this.nodeUiGame.addChild(this.Popup_Guide);
  }

  private initTemplatePopupSound(): void {
    this.Popup_Setting = cc.instantiate(this.prefabPopUpSoundSetting);
    this.Popup_Setting.active = false;
    this.Popup_Setting.zIndex = 999;
    this.nodeUiGame.addChild(this.Popup_Setting);
  }

  private initTemplateUiInviteFriend(): void {
    this.Popup_InviteFriend = cc.instantiate(this.prefabPopUpInviteFriend);
    this.Popup_InviteFriend.active = false;
    this.Popup_InviteFriend.zIndex = 999;
    this.nodeUiTable.addChild(this.Popup_InviteFriend);
  }

  private initTemplatePopUpConfirmLeave(): void {
    this.Popup_ConfirmLeave = cc.instantiate(this.prefabPopUpConfirmLeave);
    this.Popup_ConfirmLeave.active = false;
    this.Popup_ConfirmLeave.zIndex = 999;
    this.nodeUiTable.addChild(this.Popup_ConfirmLeave);
  }

  private onPingPong() {
    cc.log("onPingPong");
  }

  onDestroy() {
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BGUI.CmdDefine.DISCONNECTED
    );
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.LOGIN);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.CHAT_ROOM);
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.GET_LIST_ROOM
    );
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.JOIN_ROOM_FAIL
    );
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.JOIN_ROOM_SUCCESS
    );
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.MOI_CHOI);
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.REQUEST_INFO_MOI_CHOI
    );
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.MONEY_BET_CONFIG
    );
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.UPDATE_GAME_INFO
    );
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.AUTO_START);
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.USER_JOIN_ROOM
    );
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.DAT_BID);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.CHIA_BAI);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.XEP_BAI);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.MO_BAI);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.BO_LUOT);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.END_GAME);
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.UPDATE_MATCH
    );
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.USER_LEAVE_ROOM
    );
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.REQUEST_LEAVE_ROOM
    );
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.DOI_CHUONG);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.BANK_MONEY);
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.MOI_DAT_BID
    );
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.DAT_CUOC);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.RUT_BAI);
    BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.TIP);
    BOOGYIConnector.instance.removeCmdListener(
      this,
      BOOGYICmd.Code.AUTO_RECONNECT_GAME_ROOM_FAIL
    );
  }

  public sendBid(event, data) {
    try {
      let pk = new BOOGYICmd.SendBid();
      pk.bid = data;
      BOOGYIConnector.instance.sendPacket(pk);
    } catch (error) {
      console.error("Error:", error);
    }

    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  private sendRefeshListRoomType() {
    try {
      BOOGYIConnector.instance.sendPacket(new BOOGYICmd.SendGetListRoomType());
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }

  private sendAutoReconnect(): void {
    try {
      BOOGYIConnector.instance.sendPacket(new BOOGYICmd.SendAutoReconnect());
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }

  private responseAutoReconnectGameRoomFail(cmdId: any, data: Uint8Array) {
    console.error("XXXRES JOIN_ROOM_FAIL");
  }

  // btnTop() {
  //   BGUI.UIPopupManager.instance.showPopup(
  //     LanguageMgr.getString("boogyi.not_open_yet")
  //   );
  // }

  closeUIChat() {
    this.Ui_Chat.active = false;
  }


  onEnable() {
    this.nodeUiTable.on(cc.Node.EventType.TOUCH_START, this.closeUIChat, this);
    this.nodeUiTable.on(
      cc.Node.EventType.TOUCH_START,
      this.closePopupTab,
      this
    );
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
  }

  onDisable() {
    this.nodeUiTable.off(cc.Node.EventType.TOUCH_START, this.closeUIChat, this);
    this.nodeUiTable.off(
      cc.Node.EventType.TOUCH_START,
      this.closePopupTab,
      this
    );
    cc.game.off(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.off(cc.game.EVENT_HIDE, this._onHideGame, this);
  }

  private _onShowGame(): void {
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

  private _onHideGame(): void {
    this._isGameActive = false;
    if (cc.sys.isNative && cc.sys.isMobile) {
      this.hideTime = performance.now();
    }
  }

  private updateOffline() {
    if (!this._isGameActive) {
      if (cc.sys.isBrowser) {
        cc.director.mainLoop();
      }
    }
  }

  public onClickRegisterLeaveGame() {
    this.Popup_ConfirmLeave.active = !this.Popup_ConfirmLeave.active;
    this.popupTab.active = false;
    this.isPopUpOutRoom = true;
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  public onClickOpenPopupTab() {
    this.popupTab.active = !this.popupTab.active;
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  public closePopupTab() {
    this.popupTab.active = false;
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }


  btnMoiChoi() {
    let data = [];
    // for (let i = 0; i < this.nContentMoiChoi.childrenCount; i++) {
    //     let item = this.nContentMoiChoi.children[i];
    //     let check = item.getChildByName('check').getComponent(cc.Toggle).isChecked;
    //     if (check) {
    //         data.push(item.getChildByName('name').getComponent(cc.Label).string)
    //     }
    // }

    let pk = new BOOGYICmd.SendMoiChoi();
    pk.listName = data;
    BOOGYIConnector.instance.sendPacket(pk);
    // this.nMoiChoi.active = false;
  }

  private actionAfterBet() {
    this.onOffPnMoney(false);
  }

  public sendBetWithValue(event: Event, range: any) {
    try {
      console.error("Chưa hiểu đoạn này, gửi đúng ");
      this.actionAfterBet();
      let pk = new BOOGYICmd.SendDatCuoc();
      pk.range = parseInt(range);
      BOOGYIConnector.instance.sendPacket(pk);
    } catch (error) {
      console.error("Error:", error);
    }

    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  public sendBetWithSlider() {
    try {
      this.actionAfterBet();
      let pk = new BOOGYICmd.SendDatCuoc();
      pk.range = this._localBetSlider;
      BOOGYIConnector.instance.sendPacket(pk);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  private maxBetCheck() {
    let chair = this.convertChair(this._localMyChairOriginal);
    let objPlayer = this.getInfoPlayerByChair(chair);
    let maxBet = this._localRoomBet;
    if (objPlayer && objPlayer.checkIsMe()) {
      let balance = objPlayer.getAccountBalance();
      maxBet =
        balance >= this._localRoomBet * 40 ? this._localRoomBet * 40 : balance;
    }
    return maxBet;
  }

  protected sliderEvent(slider): void {
    let bet = this._localRoomBet;
    let maxBet = this.maxBetCheck();
    if (maxBet * slider.progress > this._localRoomBet) {
      bet = maxBet * slider.progress;
    }
  }

  private checkBidSelect(maxBid: number) {
    let plCount = 0;
    let myPlayer = null;
    for (let i = 0; i < this.maxPlayer; i++) {
      /// KHÔNG CẦN CONVERT ghế
      let objPlayer = this.getInfoPlayerByChair(i);
      if (objPlayer.checkIsActive()) {
        plCount++;
        if (objPlayer.checkIsMe()) {
          myPlayer = objPlayer;
        }
      }
    }

    if (maxBid <= 1) {
      maxBid = 1;
    }

    var checkMaxBid = (
      objPlayer: BOOGYIPlayer,
      maxBid: number,
      localRoomBet: number
    ) => {
      if (
        objPlayer.currentMoney >
        ((maxBid * localRoomBet * plCount) / 8) * 56
      ) {
        return maxBid;
      } else {
        if (maxBid == 1) {
          return 1;
        }
        return checkMaxBid(objPlayer, maxBid - 1, localRoomBet);
      }
    };

    if (plCount > 1) {
      maxBid = checkMaxBid(myPlayer, maxBid, this._localRoomBet);
      for (let idxBid = 0; idxBid < 5; idxBid++) {
        if (idxBid < maxBid) {
          this.nodeBidSelect.children[idxBid].getComponent(
            cc.Button
          ).interactable = true;
        } else {
          this.nodeBidSelect.children[idxBid].getComponent(
            cc.Button
          ).interactable = false;
        }
      }
    }
  }

  private initTemplatePlayer(): void {
    this.pnPlayers.active = true;
    for (let i = 0; i < this.listNodePlayer.length; i++) {
      let nodePlayer = this.listNodePlayer[i];
      nodePlayer.zIndex = 1;
      let objPlayer = nodePlayer.getComponent(BOOGYIPlayer);
      objPlayer.setTimeRemain(0);
      objPlayer.node.active = true;
      objPlayer.node.active = false;
      this.players.push(objPlayer);
    }
    this.nChiaBai.zIndex = 1;
  }

  private initSoundControler(): void {
    this.soundControler.initData();
  }

  private updateInfoRoom(data: { roomId: any; gameId: any; moneyBet: any }) {
    this._localRoomBet = data.moneyBet;
    switch (this._localRoomBet) {
      case 1000:
        this.tableBetsprite.spriteFrame = this.tableBet[0];
        break;

      case 5000:
        this.tableBetsprite.spriteFrame = this.tableBet[1];
        break;

      case 20000:
        this.tableBetsprite.spriteFrame = this.tableBet[2];
        break;

      case 50000:
        this.tableBetsprite.spriteFrame = this.tableBet[3];
        break;

      case 100000:
        this.tableBetsprite.spriteFrame = this.tableBet[4];
        break;

      case 500000:
        this.tableBetsprite.spriteFrame = this.tableBet[5];
        break;

      default:
        this.tableBetsprite.spriteFrame = null;
        break;
    }
    this.soundControler.playBackground();
    this.lbRoomId.string = data.roomId + data.gameId;
    this.lbRoomBet.string = BGUI.StringUtils.formatNumber(data.moneyBet);
    this.lblBetSelectBtn1.string = this.convert2Label(
      data.moneyBet * 1
    ).toString();
    this.lblBetSelectBtn2.string = this.convert2Label(
      data.moneyBet * 3
    ).toString();
    this.lblBetSelectBtn3.string = this.convert2Label(
      data.moneyBet * 5
    ).toString();
    this.lblBetSelectBtn4.string = this.convert2Label(
      data.moneyBet * 10
    ).toString();
  }

  private updatejoinroom(res: any) {
    if (res instanceof BOOGYICmd.ReceivedJoinRoomSuccess) {
      console.log("game server state: " + res.gameServerState);
      if (res.gameServerState == 1) {
        let dataDealing = {
          timeChiaBai: res.countDownTime,
          cardsOfMe: res.cards,
        };
        this.actionDealing4Cards(dataDealing);
      }
      if (res.gameServerState < 4 && res.gameServerState > 1) {
        for (let i = 0; i < this.players.length; i++) {
          let objPlayer = this.getInfoPlayerByChair(i);
          if (objPlayer.checkIsActive()) {
            objPlayer.cardsOnHand(res.playerInfos[i].cards);
          }
        }
      }
      if (res.gameServerState > 5) {
        for (let index = 0; index < this.players.length; index++) {
          let playerTemp = this.players[index];
          playerTemp.openAllCardOfPlayer(res.playerInfos[index].cards);
        }
      }
    }
  }

  private updateGameInfo(res: BOOGYICmd.ReceivedUpdateGameInfo) {
    if (res instanceof BOOGYICmd.ReceivedUpdateGameInfo) {
      console.error("game server state: " + res.gameServerState);

      if (res.gameServerState <= 3) {
        // Chia bài 4 lá
        this.processStateChia4La(res.playerInfos, res.cards);
      }

      if (res.gameServerState < 6 && res.gameServerState > 3) {
        //rut bai, show xep bai
        this.processStateShowDatCuoc(res.playerInfos, res.chuongChair);
        if (res.countDownTime > 4) {
          this.processStateChia5La(res.playerInfos, res.cards, true);
          this.setTimeCountDown(this.STATE_RUT_BAI, res.countDownTime - 2.1);
        }
        // this.scheduleOnce(() => {
        //   if (this.Ui_ArrangeCard.active) {
        //     for (let objPlayer of this.players) {
        //       if (objPlayer.checkIsMe() && objPlayer.checkIsActive()) {
        //         BOOGYIArrangeCard.instance.onClickSubmitCard();
        //         break;
        //       }
        //     }
        //   }
        // }, res.countDownTime - 2.2);
      }
    }
  }

  public convert2Label(num) {
    let data = num;
    let returnKey = "";
    if (data / 1000 >= 1) {
      data = data / 1000;
      returnKey = "K";
      if (data / 1000 >= 1) {
        data = data / 1000;
        returnKey = "M";
        if (data / 1000 >= 1) {
          data = data / 1000;
          returnKey = "B";
          if (data / 1000 >= 1) {
            data = data / 1000;
            returnKey = "T";
          }
        }
      }
    }
    if (!this.isInt(data)) {
      if (data > 100) {
        data = data.toFixed(1);
      } else if (data > 10) {
        data = data.toFixed(2);
      } else {
        data = data.toFixed(2);
      }
    }
    return data + returnKey;
  }

  isInt(num) {
    return num % 1 === 0;
  }

  private setChuongChair(
    chuongChair: number,
    isDoiChuong: boolean,
    doeffect: boolean
  ) {
    let chair = this.convertChair(chuongChair);
    let objPlayerChuong = this.getInfoPlayerByChair(chair);

    for (let objPlayerTemp of this.players) {
      if (objPlayerTemp.checkIsActive()) {
        let playerTemp1 = objPlayerTemp.getInforPlayer();
        playerTemp1.isChuong = false;
        objPlayerTemp.initPlayerInfo(playerTemp1, false);
      }
    }

    if (objPlayerChuong.checkIsActive()) {
      let playerTemp2 = objPlayerChuong.getInforPlayer();
      playerTemp2.isChuong = true;
      if (doeffect) {
        this.effectDoiChuong(objPlayerChuong, chair);
        this.scheduleOnce(() => {
          objPlayerChuong.initPlayerInfo(playerTemp2, false);
          if (isDoiChuong) {
            this.soundControler.playMusicByType(SOUNDTYPE.WIN);
          }
        }, 1.7);
      }
    }
  }

  private effectDoiChuong(objPlayerChuong: BOOGYIPlayer, chair: number) {
    let bankerPosTemp =
      objPlayerChuong.node.getComponent("BOOGYI.Player").arrayPosSpIsBanker[
        chair
      ];
    this.banker.setPosition(0, 75);
    this.banker.active = true;
    this.banker.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
    this.scheduleOnce(() => {
      this.banker.runAction(
        cc.sequence(
          cc.spawn(cc.delayTime(0.0001), cc.moveTo(0.6, bankerPosTemp)),
          cc.callFunc(() => {
            this.banker.active = false;
          })
        )
      );
    }, 1);
  }

  private renderPlayerWhenJoinRoom(
    playerInfo: Array<BOOGYICmd.ImpPlayerInfo>,
    chuongChair: number,
    myChair: number,
    gameServerState: number
  ) {
    this._localMyChairOriginal = myChair; // Set Duy nhất ở  đây thôi
    let chairChuong = this.convertChair(chuongChair);
    this.setChuongChair(chuongChair, false, false);
    for (let i = 0; i < playerInfo.length; i++) {
      let itemPlayer = playerInfo[i];
      let chair = this.convertChair(i);
      itemPlayer.chairInTable = chair;

      let objPlayer = this.getInfoPlayerByChair(chair);
      if (objPlayer && itemPlayer) {
        objPlayer.initPlayerInfo(itemPlayer, true);
        if (gameServerState > 2) {
          itemPlayer.isChuong = chairChuong == chair;
        } else {
          itemPlayer.isChuong = false;
        }
        if (itemPlayer.status > 1) {
          if (itemPlayer.isChuong) {
            objPlayer.setBid(itemPlayer.bid);
          }
          if (gameServerState > 3 && !itemPlayer.isChuong) {
            if (itemPlayer.cuocChuong == 0) {
              itemPlayer.cuocChuong = 1;
            }
            objPlayer.throwMoneyToTable(
              this._localRoomBet,
              itemPlayer.cuocChuong,
              chair
            );
          }
        }
        objPlayer.initPlayerInfo(itemPlayer, false);
        objPlayer.listCard = itemPlayer.cards;
        if (gameServerState > 0) {
          objPlayer.openCardNow(itemPlayer.cards, false);
        }
      }
    }
  }

  private getInfoPlayerByChair(chairConverted) {
    let objPlayer = this.players[chairConverted];
    if (objPlayer) {
      return objPlayer;
    } else {
      console.error("ERROR", "Lỗi không tìm thấy user");
      return null;
    }
  }

  private processStateShowDatCuoc(
    playerInfo: Array<BOOGYICmd.ImpPlayerInfo>,
    chuongChair: number
  ) {
    for (let i = 0; i < playerInfo.length; i++) {
      let playerItem = playerInfo[i];
      let chair = this.convertChair(i);
      let objPlayer = this.getInfoPlayerByChair(chair);
      objPlayer.initPlayerInfo(playerItem, false);
    }
  }

  private checkPlayerIsPlaying(data): boolean {
    if (data.playerStatus[0] > 1) {
      return true;
    }
    return false;
  }

  private processStateChia4La(
    playerInfos: Array<BOOGYICmd.ImpPlayerInfo>,
    cards: Array<number>
  ): void {
    for (let i = 0; i < playerInfos.length; i++) {
      let itemPlayer = playerInfos[i];
      let chair = this.convertChair(i);
      let objPlayer = this.getInfoPlayerByChair(chair);
      objPlayer.initPlayerInfo(itemPlayer, false);
      objPlayer.listCard = cards;
      if (true) {
        if (objPlayer.checkIsMe()) {
          objPlayer.on4FirstCard();
        } else {
          objPlayer.on4FirstCard();
        }
      }
    }
  }

  private processStateMoiDatCuoc(chairOriginal: number): void {
    let chair = this.convertChair(chairOriginal);
    let objPlayer = this.getInfoPlayerByChair(chair);
    if (objPlayer.checkIsActive()) {
      let balanceAccount = objPlayer.getAccountBalance();
      this.onOffPnMoney(true);
      this.pnMoney.children[0].active = true;
      let nodePnBtnMoney = this.pnMoney.getChildByName("PnMoneyBtn");
      nodePnBtnMoney.children[0].getComponent(cc.Button).interactable = true;
      nodePnBtnMoney.children[1].getComponent(cc.Button).interactable = true;
      nodePnBtnMoney.children[2].getComponent(cc.Button).interactable = true;
      nodePnBtnMoney.children[3].getComponent(cc.Button).interactable = true;

      nodePnBtnMoney.children[0].getComponentInChildren(cc.Label).string =
        this.convert2Label(this._localRoomBet * 1);
      nodePnBtnMoney.children[1].getComponentInChildren(cc.Label).string =
        this.convert2Label(this._localRoomBet * 3);
      nodePnBtnMoney.children[2].getComponentInChildren(cc.Label).string =
        this.convert2Label(this._localRoomBet * 5);
      nodePnBtnMoney.children[3].getComponentInChildren(cc.Label).string =
        this.convert2Label(this._localRoomBet * 10);

      if (balanceAccount < 10 * this._localRoomBet * 7) {
        nodePnBtnMoney.children[3].getComponent(cc.Button).interactable = false;
      }
      if (balanceAccount < 3 * this._localRoomBet * 7) {
        nodePnBtnMoney.children[2].getComponent(cc.Button).interactable = false;
      }
      if (balanceAccount < 5 * this._localRoomBet * 7) {
        nodePnBtnMoney.children[1].getComponent(cc.Button).interactable = false;
      }
      if (balanceAccount < 1 * this._localRoomBet * 7) {
        nodePnBtnMoney.children[0].getComponent(cc.Button).interactable = false;
      }
    }
  }

  private processStateChia5La(
    playerInfo: Array<BOOGYICmd.ImpPlayerInfo>,
    cards: Array<number>,
    isShowArCard: boolean
  ) {
    for (let i = 0; i < playerInfo.length; i++) {
      let itemPlayer = playerInfo[i];
      let chair = this.convertChair(i);
      let objPlayer = this.getInfoPlayerByChair(chair);
      objPlayer.initPlayerInfo(itemPlayer, false);
      if (objPlayer.checkIsActive()) {
        if (objPlayer.checkIsMe()) {
          objPlayer.listCard = cards;
          if (isShowArCard) {
            objPlayer.on5FirstCard();
          } else {
            objPlayer.openCardNow(objPlayer.listCard, false);
          }
        } else {
          objPlayer.on5FirstCard();
        }
      }
    }
  }

  private countDownDatBid(): void {
    this.timeCountDownDatBid -= 0.1;
    if (this.timeCountDownDatBid < 0) {
      this.lbTimeCoDownBid.node.active = false;
      this.unschedule(this.countDownDatBid);
    } else {
      this.lbTimeCoDownBid.string = this.timeCountDownDatBid.toFixed();
    }
  }

  private countDownRutBai(): void {
    this.timeCountDownRutBai -= 0.1;
    if (this.timeCountDownRutBai < 0) {
      this.unschedule(this.countDownRutBai);
    } else {
      BOOGYIArrangeCard.instance.setStrCountdown(
        Number(this.timeCountDownRutBai.toFixed())
      );
    }
  }

  private setTimeCountDown(stateOfGame: number, time: number) {
    this.lbTimeCountDown.node.active = false;
    this.lbTimeCoDownBid.node.active = false;
    switch (stateOfGame) {
      case this.STATE_AUTO_START:
        if (time > 0) {
          this.UI_CountDown.getComponent(BOOGYICountDown).setCountDown(time);
        }
        break;

      case this.STATE_CHIA_BAI:
        if (time > 0) {
          this.UI_CountDown.getComponent(BOOGYICountDown).setCountDown(time);
        }
        break;

      case this.STATE_MOI_DAT_BID:
        if (time > 0) {
          this.timeCountDownDatBid = time;
          this.lbTimeCoDownBid.node.active = true;
          this.schedule(this.countDownDatBid, 0.1);
        } else {
          this.lbTimeCoDownBid.node.active = false;
          this.unschedule(this.countDownDatBid);
        }
        break;

      case this.STATE_MOI_DAT_CUOC:
        if (time > 0) {
          this.UI_CountDown.getComponent(BOOGYICountDown).setCountDown(time);
        }
        break;

      case this.STATE_RUT_BAI:
        if (time > 0) {
          this.timeCountDownRutBai = time - 1;
          BOOGYIArrangeCard.instance.setStrCountdown(time);
          BOOGYIArrangeCard.instance.setTimeRemain(time - 0.5);
          this.schedule(this.countDownRutBai, 0.1);
        } else {
          this.unschedule(this.countDownRutBai);
        }
        break;

      case this.STATE_MO_BAI:
        // TODO
        break;

      case this.STATE_END_GAME:
        // TODO
        break;
    }
  }

  private datBid(data: { chuongChair: number; bid: number }): void {
    let chair = this.convertChair(data.chuongChair);
    let objPlayerChuong = this.getInfoPlayerByChair(chair);
    let infoPlayerChuongTemp = objPlayerChuong.getInforPlayer();
    infoPlayerChuongTemp.bid = data.bid;
    objPlayerChuong.initPlayerInfo(infoPlayerChuongTemp, false);
    if (objPlayerChuong.checkIsMe()) {
      this.activeBidSelect(false);
    }
  }

  private processFinishGame(res: BOOGYICmd.ReceivedEndGame) {
    let listInfoMoneyOfPlayer = [];
    for (let i = 0; i < this.maxPlayer; i++) {
      var chair = this.convertChair(i);
      let objPlayer = this.getInfoPlayerByChair(chair);
      if (objPlayer.checkIsActive()) {
        let cards = res.cardList[i];
        let _balance = res.listPlayerBalance[i];
        /// Tôi không cần mở nữa, vì đã  mở lúc xếp bài rồi
        if (objPlayer.checkIsMe()) {
          objPlayer.openCardNow(cards, false);
          let itemMe = objPlayer.getInforPlayer();
          itemMe.money = res.listPlayerBalance[0];
          objPlayer.initPlayerInfo(itemMe, false);
          BGUI.UserManager.instance.mainUserInfo.vinTotal = itemMe.money;
        }
        objPlayer.displayCardResults(cards, false);
        objPlayer.listCard = cards;
        let score = -1;
        if (CardLogic.checkBoogyi(cards) || CardLogic.checkBoolay(cards)) {
          score = 10;
        } else {
          score = CardLogic.getCardScore(cards);
        }
        this.scoreList.push(score);
        if (true) {
          listInfoMoneyOfPlayer.push({
            objPlayer: objPlayer,
            infoPlayer: objPlayer.getInforPlayer(),
            balance: _balance,
            chair: chair,
            cards: cards,
            money: res.tongCuoiVanList[i],
          });
        }
      }
    }

    this.compareSameScore(res.cardList, res.tongCuoiVanList);
    this.endGameChiaTien(listInfoMoneyOfPlayer);
    this.scheduleOnce(() => {
      for (let itemPlayerTemp of this.players) {
        itemPlayerTemp.resetNewGame();
        itemPlayerTemp.setBid(null);
      }
      this._localListFlagPlayerBet = [];
    }, 6);
  }

  private compareSameScore(cardList: any[], tongCuoiVanList: any[]) {
    console.log(this.scoreList);
    for (let i = 0; i < this.scoreList.length; i++) {
      if (this.scoreList[i] > 0) {
        this.iCompareList.push(i);
      }
    }
    console.log(this.iCompareList);

    for (let j = 0; j < this.iCompareList.length; j++) {
      let objPlayer = this.getInfoPlayerByChair(
        this.convertChair(this.iCompareList[j])
      );
      if (objPlayer.checkIsChuong()) {
        console.log("player chair: " + this.iCompareList[j] + " is Chuong");
        this.chuongPlayer = objPlayer;
        this.chuongScore = this.scoreList[this.iCompareList[j]];
        console.log("chuong Score: " + this.chuongScore);
        for (let index = 0; index < this.iCompareList.length; index++) {
          if (index == j) {
            continue;
          }
          if (this.chuongScore == this.scoreList[this.iCompareList[index]]) {
            if (tongCuoiVanList[this.iCompareList[index]] > 0) {
              console.log("player win");
              let objPlayerTemp = this.getInfoPlayerByChair(
                this.iCompareList[index]
              );
              let card4 = cardList[this.iCompareList[index]][3];
              let card5 = cardList[this.iCompareList[index]][4];
              console.log(card4, card5);
              if (card4 > card5) {
                objPlayerTemp.listNodeCards[5].getComponent(
                  cc.Sprite
                ).spriteFrame =
                  BOOGYIConstant.CardLogic.getTextureWithCode(card4);
                objPlayerTemp.listNodeCards[5].setPosition(
                  objPlayerTemp.listNodeCards[0].getPosition()
                );
                objPlayerTemp.listNodeCards[5].rotation =
                  objPlayerTemp.listNodeCards[0].rotation;
              } else {
                objPlayerTemp.listNodeCards[5].getComponent(
                  cc.Sprite
                ).spriteFrame =
                  BOOGYIConstant.CardLogic.getTextureWithCode(card5);
                objPlayerTemp.listNodeCards[5].setPosition(
                  objPlayerTemp.listNodeCards[1].getPosition()
                );
                objPlayerTemp.listNodeCards[5].rotation =
                  objPlayerTemp.listNodeCards[1].rotation;
              }
              objPlayerTemp.listNodeCards[5].opacity = 255;
              objPlayerTemp.listNodeCards[5].active = true;
              if (objPlayerTemp.checkIsMe()) {
                objPlayerTemp.listNodeCards[5].runAction(
                  cc.sequence(
                    cc.scaleTo(0, 1, 1),
                    cc.scaleTo(0.2, 1.1, 1.1)
                  )
                )
              } else {
                objPlayerTemp.listNodeCards[5].runAction(
                  cc.sequence(
                    cc.scaleTo(0, 0.7, 0.7),
                    cc.scaleTo(0.2, 0.8, 0.8)
                  )
                )
              }
              objPlayerTemp.listNodeCards[5].children[1].active = true;
              objPlayerTemp.listNodeCards[5].children[1].getComponent(sp.Skeleton).setAnimation(0, "animation", true);
              this.scheduleOnce(() => {
                objPlayerTemp.listNodeCards[5].children[1].active = false;
                objPlayerTemp.listNodeCards[5].opacity = 0;
                objPlayerTemp.listNodeCards[5].active = false;
              }, 3);
            } else {
              console.log("banker win");
              let card4 = cardList[this.iCompareList[j]][3];
              let card5 = cardList[this.iCompareList[j]][4];
              console.log(card4, card5);
              if (card4 > card5) {
                this.chuongPlayer.listNodeCards[5].getComponent(
                  cc.Sprite
                ).spriteFrame =
                  BOOGYIConstant.CardLogic.getTextureWithCode(card4);
                this.chuongPlayer.listNodeCards[5].setPosition(
                  this.chuongPlayer.listNodeCards[0].getPosition()
                );
                this.chuongPlayer.listNodeCards[5].rotation =
                  this.chuongPlayer.listNodeCards[0].rotation;
              } else {
                this.chuongPlayer.listNodeCards[5].getComponent(
                  cc.Sprite
                ).spriteFrame =
                  BOOGYIConstant.CardLogic.getTextureWithCode(card5);
                this.chuongPlayer.listNodeCards[5].setPosition(
                  this.chuongPlayer.listNodeCards[1].getPosition()
                );
                this.chuongPlayer.listNodeCards[5].rotation =
                  this.chuongPlayer.listNodeCards[1].rotation;
              }
              this.chuongPlayer.listNodeCards[5].opacity = 255;
              this.chuongPlayer.listNodeCards[5].active = true;
              if (this.chuongPlayer.checkIsMe()) {
                this.chuongPlayer.listNodeCards[5].runAction(
                  cc.sequence(
                    cc.scaleTo(0, 1, 1),
                    cc.scaleTo(0.2, 1.1, 1.1)
                  )
                )
              } else {
                this.chuongPlayer.listNodeCards[5].runAction(
                  cc.sequence(
                    cc.scaleTo(0, 0.7, 0.7),
                    cc.scaleTo(0.3, 0.8, 0.8)
                  )
                )
              }
              this.chuongPlayer.listNodeCards[5].children[1].active = true;
              this.chuongPlayer.listNodeCards[5].children[1].getComponent(sp.Skeleton).setAnimation(0, "animation", true);
              this.scheduleOnce(() => {
                this.chuongPlayer.listNodeCards[5].children[1].active = false;
                this.chuongPlayer.listNodeCards[5].opacity = 0;
                this.chuongPlayer.listNodeCards[5].active = false;
              }, 3);
            }
          }
        }
        console.log(this.compareList);
      }
    }
  }

  private endGameChiaTien(listInfoMoneyOfPlayer: Array<any>): void {
    let haveLoser: boolean = false;
    let chairChuong = this.convertChair(this._localChuongChairOriginal);
    let objPlayerChuong = this.getInfoPlayerByChair(chairChuong);
    /// Thu tiền của người thua;
    for (let i = 0; i < listInfoMoneyOfPlayer.length; i++) {
      let itemInfo = listInfoMoneyOfPlayer[i];
      if (itemInfo.objPlayer.checkIsActive() && itemInfo.money < 0) {
        if (!itemInfo.objPlayer.checkIsChuong()) {
          this.runEffectMoney(
            itemInfo.objPlayer,
            objPlayerChuong,
          );
        }
        haveLoser = true;
      }
    }
    let delay = haveLoser ? 2 : 0;
    if (haveLoser) {
      this.soundControler.playMusicByType(SOUNDTYPE.RUNMONEY);
    }

    this.scheduleOnce(() => {
      this.soundControler.playMusicByType(SOUNDTYPE.RUNMONEY);
      /// Trả tiền của người thắng;
      for (let k = 0; k < listInfoMoneyOfPlayer.length; k++) {
        let itemInfo = listInfoMoneyOfPlayer[k];
        if (itemInfo.objPlayer.checkIsActive()) {
          if (itemInfo.money > 0) {
            if (!itemInfo.objPlayer.checkIsChuong()) {
              this.runEffectMoney(
                objPlayerChuong,
                itemInfo.objPlayer,
              );
            }
            if (itemInfo.objPlayer.checkIsMe()) {
              this.runEffectWin(itemInfo.objPlayer, itemInfo.money);
            }
          }
        }
      }

      this.scheduleOnce(() => {
        for (let id = 0; id < listInfoMoneyOfPlayer.length; id++) {
          let itemInfo = listInfoMoneyOfPlayer[id];
          if (itemInfo.objPlayer.checkIsActive()) {
            itemInfo.objPlayer.setAccountBalance(itemInfo.balance);
            if (itemInfo.money > 0) {
              itemInfo.objPlayer.effectReward(itemInfo.money, true);
            }
            if (itemInfo.money < 0) {
              itemInfo.objPlayer.effectReward(itemInfo.money, false);
            }
            if (itemInfo.objPlayer.checkIsMe() && itemInfo.money < 0) {
              this.soundControler.playMusicByType(SOUNDTYPE.LOSE);
            }
          }
        }
      }, 0.5);
    }, delay);
  }

  private getArrTablePot2(money) {
    let chipData = this.getFormulaOfCchip(this._localRoomBet);
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = chipData.length - 1; i >= 0; i--) {
      data[i] = parseInt((money / chipData[i]).toString());
      money = money % chipData[i];
    }
    return data;
  }

  private getFormulaOfCchip(localRoomBet): Array<number> {
    return [
      localRoomBet / 100,
      localRoomBet / 20,
      localRoomBet / 10,
      localRoomBet / 2,
      localRoomBet,
      localRoomBet * 5,
      localRoomBet * 10,
      localRoomBet * 50,
    ];
  }

  private getRandomNumber(min: number, max: number): number {
    // Lấy ngẫu nhiên một số từ min đến max
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomTimeNumber(min: number, max: number): number {
    // Lấy ngẫu nhiên một số từ min đến max
    return Math.random() * (max - min) + min;
  }

  private getRandomPositiveOrNegative(): number {
    // Lấy ngẫu nhiên giá trị -1 hoặc 1
    return Math.random() < 0.5 ? -1 : 1;
  }

  private runEffectMoney(
    objPlayer1: BOOGYIPlayer,
    objPlayer2: BOOGYIPlayer,
  ): void {
    if (!objPlayer1.checkIsActive() || !objPlayer2.checkIsActive()) return;
    let delay = 0;

    for (let index = 0; index < 40; index++) {
      let randomChip = this.getRandomNumber(1, 5);
      let randomPos1 = this.getRandomNumber(-45, 45);
      let randomPos2 = this.getRandomNumber(-35, 35);
      let delayTime = this.getRandomTimeNumber(0.05, 0.35);
      let sign = this.getRandomPositiveOrNegative();
      let randomRotate = this.getRandomNumber(80, 120);
      let nodeChip = cc.instantiate(this.prefabPhinh);

      nodeChip.children[0].getComponent(cc.Sprite).spriteFrame = this.chipBaySFA[randomChip];
      nodeChip.setPosition(
        cc.v2(
          objPlayer1.node.getPosition().x + randomPos1,
          objPlayer1.node.getPosition().y + randomPos2 -100
        )
      );
      this.nodePhinh.addChild(nodeChip);
      let pos = cc.v2(
        objPlayer2.node.getPosition().x, 
        objPlayer2.node.getPosition().y - 100
      );
      nodeChip.runAction(
        cc.sequence(
          cc.fadeIn(0.3 + delay),
          cc.delayTime(delayTime),
          cc.spawn(cc.moveTo(0.8, pos), cc.rotateBy(0.8, sign * randomRotate)),
          cc.fadeOut(0.2),
          cc.callFunc(() => {
            nodeChip.removeFromParent(true);
          })
        )
      );
      delay += 0.01;
    }
  }

  ////////////////// EFFECT
  private resetAllNodeEffect() {
    this.effectNode.active = false;
    this.effectNode.getChildByName("EffectWin").active = false;
    this.effectNode.getChildByName("EffectStart").active = false;
  }

  private runEffectWin(objPlayer: BOOGYIPlayer, money: number): void {
    this.soundControler.playMusicByType(SOUNDTYPE.WIN);
    let nameNode = "EffectWin";
    this.effectNode.active = true;
    this.effectNode.getChildByName(nameNode).active = true;
    this.effectNode
      .getChildByName(nameNode)
      .getComponent(sp.Skeleton)
      .setAnimation(0, "animation", true);

    setTimeout(() => {
      this.effectNode.getChildByName(nameNode).active = false;
      this.effectNode.getChildByName(nameNode).stopAllActions();
    }, 2000);
  }

  private runEffectStart(): void {
    this.effectNode.active = true;
    this.effectNode.getChildByName("EffectStart").active = true;
    this.effectNode.getChildByName("EffectStart").setScale(1);
    this.effectNode.getChildByName("EffectStart").runAction(
      cc.sequence(
        cc.callFunc(() => {
          this.soundControler.playMusicByType(SOUNDTYPE.NEWGAME);
          this.effectNode
            .getChildByName("EffectStart")
            .getChildByName("Start Game").active = true;
          this.effectNode
            .getChildByName("EffectStart")
            .getChildByName("Start Game")
            .getComponent(sp.Skeleton)
            .setAnimation(0, "start game", false);
        }),
        cc.delayTime(3),
        cc.callFunc(() => {
          this.effectNode
            .getChildByName("EffectStart")
            .getChildByName("Start Game").active = false;
        })
      )
    );
  }

  public convertChair(seat: number): number {
    return (
      (seat - this._localMyChairOriginal + this.maxPlayer) % this.maxPlayer
    );
  }

  public showToast(message: string, autoHide = true) {
    this.spToast.active = true;
    let lbToast = this.spToast.children[0].getComponent(cc.Label);
    lbToast.string = message;
    this.spToast.opacity = 0;
    this.spToast.runAction(
      cc.sequence(
        cc.fadeIn(0.1),
        cc.delayTime(2),
        cc.fadeOut(0.2),
        cc.callFunc(() => {
          this.spToast.active = false;
          this.spToast.stopAllActions();
        })
      )
    );
  }

  private autoBet() {
    for (let i = 0; i < this.maxPlayer; i++) {
      let objPlayer = this.getInfoPlayerByChair(i);
      if (
        !this._localListFlagPlayerBet[i] &&
        objPlayer.checkIsActive() &&
        !objPlayer.checkIsChuong()
      ) {
        this._localListFlagPlayerBet[i] = true;
        objPlayer.throwMoneyToTable(this._localRoomBet, 1, i);
      }
    }
  }

  private autoBid() {
    for (let i = 0; i < this.maxPlayer; i++) {
      let objPlayer = this.getInfoPlayerByChair(i);
      if (objPlayer.checkIsActive() && objPlayer.bidNode.active === false) {
        objPlayer.setBid(1);
      }
    }
  }

  private sendTip() {
    try {
      let pk = new BOOGYICmd.SendTip();
      BOOGYIConnector.instance.sendPacket(pk);
    } catch (error) {
      console.error("ERROR Send Tip", error);
    }
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  private responseTip(cmdId: any, data: Uint8Array) {
    let res = new BOOGYICmd.ReceivedTip();
    res.unpackData(data);
    console.error("HHHHH TIP", res);

    let err = res.getError();
    console.log("err", err);

    switch (err) {
      case 0:
        let chair = this.convertChair(res.chair);
        let objPlayer = this.getInfoPlayerByChair(chair);
        let playerPos = objPlayer.node.getPosition();
        let bankerPos = cc.v2(-28, 400);

        let amount = res.amount;
        let balance = objPlayer.currentMoney;
        let moneyLeft = balance - amount;
        objPlayer.currentMoney = moneyLeft;
        let itemTemp = objPlayer.getInforPlayer();
        itemTemp.money = moneyLeft;
        objPlayer.initPlayerInfo(itemTemp, false);
        objPlayer.lbBalance.string = this.convert2Label(moneyLeft);

        let chipTipTemp = cc.instantiate(this.chipTip);
        this.gameTable.addChild(chipTipTemp);
        chipTipTemp.setPosition(playerPos);
        chipTipTemp.zIndex = 1999;
        chipTipTemp.children[0].getComponent(cc.Label).string =
          this.convert2Label(amount);
        chipTipTemp.runAction(
          cc.sequence(
            cc.fadeIn(0.3),
            cc.spawn(cc.scaleTo(0.2, 1), cc.moveTo(1, bankerPos)),
            cc.fadeOut(0.3),
            cc.callFunc(() => chipTipTemp.removeFromParent(true))
          )
        );

        this.scheduleOnce(() => {
          this.skeletonBanker.setAnimation(0, "tip_kiss", false);
          this.scheduleOnce(() => {
            this.skeletonBanker.setAnimation(0, "normal", true);
          }, 0.7);
        }, 2);

        this.scheduleOnce(() => {
          let kissTemp = cc.instantiate(this.kiss);
          this.gameTable.addChild(kissTemp);
          kissTemp.setPosition(2, 516);
          kissTemp.setScale(0.3);
          kissTemp.zIndex = 1999;
          kissTemp.runAction(
            cc.sequence(
              cc.fadeIn(0.05),
              cc.spawn(cc.moveTo(1, playerPos), cc.scaleTo(1, 1.2)),
              cc.fadeOut(0.3),
              cc.callFunc(() => kissTemp.removeFromParent(true))
            )
          );
        }, 2.5);

        this.scheduleOnce(() => {
          objPlayer.kissSkl.node.active = true;
          objPlayer.kissSkl.setAnimation(0, "animation", false);
          this.scheduleOnce(() => {
            objPlayer.kissSkl.node.active = false;
          }, 1);
        }, 4);

        break;

      case 1:
        console.error("Haven't join any room");
        break;

      case 2:
        console.error("Haven't join any chair");
        break;

      case 3:
        console.error("Don't have player info");
        break;

      case 4:
        BGUI.UIPopupManager.instance.showPopup(
          LanguageMgr.getString("boogyi.error_not_enough_money")
        );
        break;
    }
  }

  changeBtnQuit() {
    this.btnQuit.active = !this.btnQuit.active;
    this.btnCancelQuit.active = !this.btnCancelQuit.active;
  }

  cancelQuit() {
    this.Popup_ConfirmLeave.getComponent(
      "BOOGYI.PopupConfirmLeave"
    ).confirmLeave();
    this.popupTab.active = false;
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }

  private responseVinTotal(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ResVinTotalOfUser();
    res.unpackData(data);
    let totalMoney = res.vinTotal;
    BGUI.UserManager.instance.mainUserInfo.vinTotal = totalMoney;
    BGUI.EventDispatch.instance.emit(
      BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD,
      totalMoney
    );
    BGUI.GameCoreManager.instance.onBackToLobby();
    console.log("responseVinTotal");
  }

  private requestVintotal(): void {
    let req = new CmdSendGetBalance();
    BGUI.NetworkPortal.instance.sendPacket(req);
  }

  public backToMain() {
    this.requestVintotal();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }
}
