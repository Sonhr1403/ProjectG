const { ccclass, property } = cc._decorator;

import RLTClock from "./Roulette.Clock";
import { RouletteNetwork } from "./Roulette.Cmd";
import RLTDealer from "./Roulette.Dealer";
import RLTDoor from "./Roulette.Door";
import RLTPhinh from "./Roulette.Phinh";
import RLTPlayer from "./Roulette.Player";
import RouletteWheel from "./Roulette.RouletteWheel";
import RLTCommon from "./Roulette.Common";
import RLTSoundControler, { RLT_SOUND_TYPE } from "./Roulette.SoundControler";
import RLTSetting from "./Roulette.Setting";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import RLTListUser from "./Roulette.ListUser";
import RLTUSERHISTORY from "./Roulette.UserHistory";
import { RouletteConnector } from "./Network/RouletteConnector";
@ccclass
export default class RouletteController extends cc.Component {
  public static instance: RouletteController = null;

  @property(cc.Node)
  private arrowDown: cc.Node = null;

  @property(cc.Node)
  private tab: cc.Node = null;

  @property(cc.Node)
  private currentChip: cc.Node = null;

  @property(cc.ScrollView)
  private chipViewContent: cc.ScrollView = null;

  @property(cc.Node)
  private rltHistory: cc.Node = null;

  @property([cc.Node])
  public doors: cc.Node[] = [];

  @property(cc.Prefab)
  public prfPlayer: cc.Prefab = null;

  @property(cc.Prefab)
  public prfHeart: cc.Prefab = null;

  @property(cc.Prefab)
  public prfChat: cc.Prefab = null;

  @property(cc.Node)
  public pnPlayer: cc.Node = null;

  @property(cc.Node)
  public nDealer: cc.Node = null;

  @property(cc.Node)
  public pnGame: cc.Node = null;

  @property(cc.Prefab)
  public pfGuide: cc.Prefab = null;

  @property(cc.Prefab)
  public wheelPrefab: cc.Prefab = null;

  @property(sp.Skeleton)
  public effectStartBet: sp.Skeleton = null;

  @property(cc.Prefab)
  public prfChip: cc.Prefab = null;

  @property(cc.SpriteAtlas)
  public spriteAtlasChip: cc.SpriteAtlas = null;

  @property(sp.SkeletonData)
  public emosSkeletonData: sp.SkeletonData = null;

  @property(cc.Label)
  public referenceID: cc.Label = null;

  @property(cc.Button)
  public btnClearBet: cc.Button = null;

  @property(cc.Button)
  public btnShowMe: cc.Button = null;

  @property(cc.Button)
  public btnShowAll: cc.Button = null;

  @property(RLTSoundControler)
  public nSoundControler: RLTSoundControler = null;

  @property(cc.Prefab)
  public pfSetting: cc.Prefab = null;

  @property(cc.Label)
  public toast: cc.Label = null;

  @property(cc.Prefab)
  public pfLOPS: cc.Prefab = null;

  @property(cc.Node)
  public pnTable: cc.Node = null;

  @property(cc.Prefab)
  public prbUserHistory: cc.Prefab = null;

  @property(cc.Prefab)
  public prfDoor: cc.Prefab = null;

  @property(cc.Button)
  public btnTip: cc.Button = null;

  @property(cc.SpriteFrame)
  public defaultAvatar: cc.SpriteFrame = null;

  @property(cc.Node)
  public noti: cc.Node = null;

  @property(cc.Label)
  public notiContent: cc.Label = null;

  public UI_Chat: cc.Node = null;
  public UI_UserHistory: cc.Node = null;
  public UI_Guide: cc.Node = null;
  public UI_Setting: cc.Node = null;
  public UI_LOPS: cc.Node = null;

  private rltOn = false;
  private winning_history = [];
  public red_numbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  spinningWheel: cc.Node = null;
  private bettingState = false;
  private betChipValue: number = 1000;
  private listTotalMoneyInDoor = {};
  private listMoneyOfMeInDoor = {};
  private listDetailTotalMoneyInDoor = {};
  private listDetailMoneyOfMeInDoor = {};

  private infoMe: RouletteNetwork.User = null;
  private totalUserPlaying: number = 0;
  private listUserInTable: Array<RouletteNetwork.User> = [];
  private players: cc.Node[] = [];
  private otherPlayer: cc.Node = null;
  private playerMe: cc.Node = null;
  private stepScroll = 1 / 12;
  private currentScroll = 0;

  private showOnlyMe: boolean = false;
  public listExternalUsers: Array<RouletteNetwork.User> = [];

  private localRefId = 0;

  private timePhinh = 0.5;

  private isMouseDown: boolean = false;
  private currentDoor = null;

  private readonly gameState = cc.Enum({
    START_NEW_GAME: 1,
    OPEN_WHEEL: 2,
    END_GAME: 3,
  });

  private vibrationStatus: boolean = true;

  private canClearBet: boolean = true;

  private arrRed = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  private arrBlack = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
  ];

  public _scheduler = null;
  public _isGameActive: boolean = true;
  private hideTime: number = null;

  private isPartner: boolean = false;

  private playerNotInteractCount: number = 0;
  isPlayerInteract: boolean = false;

  private gameStateNow: number = -1;
  private isNotiOn: boolean = false;

  private isMobile: boolean = false;

  //cycle start
  onLoad() {
    RouletteController.instance = this;
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_LOGIN,
      this.responseLogin,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_EXITGAME,
      this.responseDisconnect,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_DISCONNECTED,
      this.responseDisconnect,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_RECEIVEINFO,
      this.responseReceiveGameInfo,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_KICK_OUT,
      this.responseUserOut,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_BET_SUCCESS,
      this.responseBetSuccess,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_EXIT_ROOM,
      this.responseOtherUserExitRoom,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_START_NEW_GAME,
      this.responseStartNewGame,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_SPIN_RESULT,
      this.responseSpinResult,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_ENDGAME,
      this.responseEndGame,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_JOIN_ROOM,
      this.responseNewUserJoinRoom,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_OUT_ROOM,
      this.responseNewUserOutRoom,
      this
    );
    // RouletteConnector.instance.addCmdListener(
    //   RouletteNetwork.Cmd.CMD_ROULETTE_TIP,
    //   this.responseTipToBanker,
    //   this
    // );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_CHAT,
      this.responseRltChat,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_CLEAR_BET,
      this.responseClearBet,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_LIST_OTHER_USERS,
      this.responseRltListOtherUsers,
      this
    );
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_MATCH_HISTORY,
      this.responseMatchHistory,
      this
    );
  }

  onDestroy() {
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_LOGIN
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_EXITGAME
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_DISCONNECTED
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_RECEIVEINFO
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_KICK_OUT
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_BET_SUCCESS
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_EXIT_ROOM
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_START_NEW_GAME
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_SPIN_RESULT
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_ENDGAME
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_JOIN_ROOM
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_OUT_ROOM
    );
    // RouletteConnector.instance.removeCmdListener(
    //   this,
    //   RouletteNetwork.Cmd.CMD_ROULETTE_TIP
    // );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_CHAT
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_LIST_OTHER_USERS
    );
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_MATCH_HISTORY
    );
    this.pnGame.off(cc.Node.EventType.TOUCH_START, this.closeUIChat, this);
    this.pnGame.off(cc.Node.EventType.TOUCH_START, this.closeTab, this);

    cc.game.off(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.off(cc.game.EVENT_HIDE, this._onHideGame, this);

    this.UI_Guide.getChildByName("dau x").off(
      cc.Node.EventType.TOUCH_START,
      this.onCloseGuide,
      this
    );

    cc.director.getScheduler().unscheduleUpdate(this);
  }

  protected start(): void {
    this.isMobile = cc.sys.isMobile;
    // if (this.isMobile) {
    //   for (let door of this.doors) {
    //     door.getChildByName("Btn").active = true;
    //   }
    // } else {
    //   for (let door of this.doors) {
    //     door.getChildByName("Btn").active = false;
    //   }
    // }
    this.nSoundControler.stopAll();
    this.nSoundControler.init();
    this.initTempPlayer();
    this.initWheel();
    this.initGuide();
    this.initSetting();
    this.initListOtherPlayers();
    this.initChat();
    this.initUserHistory();
    this.resetAllDefineMoneyInDoor();
    this.resetAllDoor();
    RLTDealer.instance.idle();
    this.updatebtnShowView();
    this.activeBtnClearBet(false);
    this.noti.active = false;
    for (let i = 8; i > -1; i--) {
      this.rltHistory.children[i].active = false;
    }
    this.pnGame.on(cc.Node.EventType.TOUCH_START, this.closeUIChat, this);
    this.pnGame.on(cc.Node.EventType.TOUCH_START, this.closeTab, this);

    this.UI_Guide.getChildByName("dau x").on(
      cc.Node.EventType.TOUCH_START,
      this.onCloseGuide,
      this
    );

    const url = window.location.href;
    const urlSearchParams = new URLSearchParams(url.split("?")[1]);
    if (
      url &&
      url.includes("?") &&
      urlSearchParams &&
      urlSearchParams.get("accessToken")
    ) {
      this.tab.getComponent(cc.Widget).top = -103;
      this.tab.getChildByName("btnExit").active = false;
      this.isPartner = true;
    } else {
      this.tab.getComponent(cc.Widget).top = 0;
      this.tab.getChildByName("btnExit").active = true;
      this.isPartner = false;
    }

    if (
      url &&
      url.includes("?") &&
      urlSearchParams &&
      urlSearchParams.get("lang")
    ) {
      let lang = urlSearchParams.get("lang");
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
      LanguageMgr.updateLang(lang);
    } else {
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en");
      LanguageMgr.updateLang("en");
    }

    this.tab.active = false;

    this.playerNotInteractCount = 0;
    this.isPlayerInteract = false;

    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
  }

  protected onEnable(): void {
    RouletteConnector.instance.connect();
  }

  // protected onDisable(): void {
  //   RouletteConnector.instance.disconnect();
  // }
  // cycle end

  //Response Start

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE DISCONNECT: ",
    //   cmdId
    // );
  }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveLogin();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE LOGIN: ",
    //   cmdId, res
    // );
    ////////////////////////////////////////////
    let msg = "";
    switch (res.err) {
      case 0:
        RouletteNetwork.Send.sendRouletteJoinGame(0);
        break;

      default:
        msg = LanguageMgr.getString("roulette.login_fail");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
    }
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveGameInfo();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE RECEIVE GAME INFO: ",
    //   cmdId,
    //   res
    // );
    //////////////////////////////
    this.resetAllDefineMoneyInDoor();
    this.resetAllDoor();
    this.bettingState = res.bettingState;
    this.referenceID.string =
      LanguageMgr.getString("roulette.game_session") + res.referenceId;
    ///////////////////
    this.infoMe = res.infoMe;
    this.UI_Setting.getComponent(RLTSetting).getStarted(0.5);
    this.listUserInTable = res.listUserInTable;
    this.totalUserPlaying = res.numberUserOutTable;
    this.renderInfoForMe(this.infoMe);
    this.renderUserInSeat(this.listUserInTable);
    this.setTotalUserPlaying(this.totalUserPlaying);
    this.winning_history = RLTCommon.convertStrHisrotyToArray(
      res.sessionHistory
    );
    this.renderRltHistoryNumber();
    //////////////////////////
    this.calcMoneyOfMeInDoor(res.infoMe);
    this.calcMoneyOfUserInTableInDoor(this.listUserInTable);
    this.calcMoneyOfUserOutTableInDoor(res.listBetOfUserOutTable);

    switch (res.state) {
      case this.gameState.START_NEW_GAME:
        RLTClock.instance.setCountDown(res.remainTime);
        this.onHighlight();
        if (res.remainTime > 6) {
          this.canClearBet = true;
          this.scheduleOnce(() => {
            this.activeBtnClearBet(false);
            this.canClearBet = false;
            this.nSoundControler.playType(RLT_SOUND_TYPE.TIME_LIMIT);
          }, res.remainTime - 5);
        } else {
          this.canClearBet = false;
          this.nSoundControler.playType(RLT_SOUND_TYPE.TIME_LIMIT);
        }
        break;

      case this.gameState.OPEN_WHEEL:
        this.gameStateNow = res.state;
        let result = res.dices[0];
        this.spinningWheel.active = true;
        this.spinningWheel.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
        this.rltOn = true;
        RouletteWheel.instance.winNumber = result;
        RouletteWheel.instance.ball.active = false;
        RouletteWheel.instance.show_spin_result();
        this.scheduleOnce(() => {
          this.toggleRltWheel();
          this.gameStateNow = -1;
        }, res.remainTime);
        break;

      case this.gameState.END_GAME:
        this.highLight(res.dices[0], true);
        this.handleReward(res);
        break;
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveUserOut();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE RECEIVE USER OUT",
    //   cmdId,
    //   res
    // );

    ////////////////////////////////////////////

    if (this.isPartner) {
      if (!this.isNotiOn) {
        let msg = LanguageMgr.getString("roulette.cant_make_transaction");
        if (!RouletteController.instance.noti.active) {
          RouletteController.instance.noti.active = true;
          RouletteController.instance.notiContent.string = msg;
        }
      }
    } else {
      this.backToLobby();
    }
  }

  private responseBetSuccess(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteRecevieBetSuccess();
    res.unpackData(data);
    // console.log(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   cmdId,
    //   "ROULETTE BET SUCCESS: ",
    //   res
    // );
    //////////////////////////////////////////////////////
    let err = res.getError();
    let userBet = res.userBet;
    let money = res.money;
    let typePot = res.typePot;
    var nDoor = this.getInfoDoorByTypePot(typePot);
    this.toast.string = "";
    switch (err) {
      case 0:
        let isMe = this.isPlayerMe(userBet);
        this.listDetailTotalMoneyInDoor[typePot].push({
          door: typePot,
          money: money,
        });
        this.listTotalMoneyInDoor[typePot] += money;
        if (isMe) {
          this.activeBtnClearBet(this.canClearBet);
          this.listDetailMoneyOfMeInDoor[typePot].push({
            door: typePot,
            money: money,
          });
          this.listMoneyOfMeInDoor[typePot] += money;
          this.playerMe.getComponent(RLTPlayer).lbBalance.string =
            RLTCommon.convert2Label(res.currentMoney);
          this.throwPhinhFromMeToDoor(nDoor, money);
        } else {
          var nUser = this.getNodeUserInTable(userBet);
          if (!nUser) {
            var nUser = this.otherPlayer;
          } else {
            nUser.getComponent(RLTPlayer).setBalance(res.currentMoney);
          }
          if (!this.showOnlyMe) {
            this.throwPhinhFromUserToDoor(nUser, nDoor, money);
          }
        }
        break;
      case 1:
        this.toast.string = LanguageMgr.getString("roulette.not_in_bet_time");
        break;
      case 2:
        this.toast.string = LanguageMgr.getString(
          "roulette.type_pot_invalidate"
        );
        break;
      case 3:
        this.toast.string = LanguageMgr.getString("roulette.not_enough_money");
        break;
      case 4:
        this.toast.string = LanguageMgr.getString(
          "roulette.invalid_bet_request"
        );
        break;
    }
    this.showToast();
  }

  protected responseStartNewGame(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveNewGame();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE START NEW GAME: ",
    //   cmdId,
    //   res
    // );
    //////////////////////////////
    this.referenceID.string =
      LanguageMgr.getString("roulette.game_session") + res.referenceId;
    this.btnTip.interactable = false;
    RLTDealer.instance.startGame();
    this.nSoundControler.playType(RLT_SOUND_TYPE.START_NEW_GAME);
    this.startEffectStartBet();
    RLTClock.instance.setCountDown(res.time);
    this.bettingState = true;
    this.resetAllDefineMoneyInDoor();
    this.resetAllDoor();
    this.playerMe.getComponent(RLTPlayer).resetNewGame();
    this.otherPlayer.getComponent(RLTPlayer).resetNewGame();
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].getComponent(RLTPlayer).resetNewGame();
    }
    this.canClearBet = true;
    if (this.UI_UserHistory.active === true) {
      RouletteNetwork.Send.sendUserHistory();
    }
    this.scheduleOnce(() => {
      this.activeBtnClearBet(false);
      this.canClearBet = false;
      this.nSoundControler.playType(RLT_SOUND_TYPE.TIME_LIMIT);
    }, res.time - 5);
    this.onHighlight();
  }

  protected responseOtherUserExitRoom(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveUserExitRoom();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE OTHER USER EXIT ROOM: ",
    //   cmdId,
    //   res
    // );
    ///////////////////////////////////////////////
    this.infoMe = res.infoMe;
    this.listUserInTable = res.listUserInTable;
    this.totalUserPlaying = res.numberUserOutTable;
    this.renderInfoForMe(this.infoMe);
    this.renderUserInSeat(this.listUserInTable);
    this.setTotalUserPlaying(this.totalUserPlaying);
  }

  private responseSpinResult(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveSpinResult();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE SPIN RESULT: ",
    //   cmdId,
    //   res
    // );
    ///////////////////////////////////////////////////
    if (this.gameStateNow !== this.gameState.OPEN_WHEEL) {
      this.bettingState = false;
      this.offHighlight();
      this.nSoundControler.playType(RLT_SOUND_TYPE.TIME_END);
      let result = res.doorList[2];
      this.toggleRltWheel();
      this.nSoundControler.playType(RLT_SOUND_TYPE.SPIN_ROULETTE);
      RouletteWheel.instance.winNumber = result;
    }
  }

  private responseEndGame(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveEndGame();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE_END",
    //   cmdId,
    //   res
    // );
    //////////////////////////////
    RouletteNetwork.Send.sendMatchHistory();
    this.highLight(res.dices[0], true);
    this.infoMe = res.infoMe;
    this.listUserInTable = res.listUserInTable;
    this.totalUserPlaying = res.numberUserOutTable;
    this.renderInfoForMe(this.infoMe);
    this.renderUserInSeat(this.listUserInTable);
    this.setTotalUserPlaying(this.totalUserPlaying);
    //////////////////////////////////////////
    this.scheduleOnce(() => this.handleReward(res), 1);
    this.scheduleOnce(() => {
      if (this.isPlayerInteract) {
        this.playerNotInteractCount = 0;
      } else {
        this.playerNotInteractCount += 1;
      }
      this.isPlayerInteract = false;
      if (this.playerNotInteractCount === 3) {
        this.playerNotInteractCount = 0;

        this.isNotiOn = true;
        let msg = LanguageMgr.getString("roulette.dont_play");
        if (!RouletteController.instance.noti.active) {
          RouletteController.instance.noti.active = true;
          RouletteController.instance.notiContent.string = msg;
        }
        this.onClickExit();
      }
    }, 6.5);
  }

  protected responseNewUserJoinRoom(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveUserJoinRoom();
    res.unpackData(data);
    // console.log(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE NEW USER JOIN ROOM: ",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
    this.infoMe = res.infoMe;
    this.listUserInTable = res.listUserInTable;
    this.totalUserPlaying = res.numberUserOutTable;
    this.renderInfoForMe(this.infoMe);
    this.renderUserInSeat(this.listUserInTable);
    this.setTotalUserPlaying(this.totalUserPlaying);
  }

  protected responseNewUserOutRoom(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveUserOutRoom();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE NEW USER OUT ROOM: ",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
    let isOut = res.isOut;
    if (isOut) {
      let userName = res.userName;
      let nUser = this.getNodeUserInTable(userName);
      if (nUser) {
        nUser.getComponent(RLTPlayer).resetNewGame();
      }
      let objUserOut = _.remove(this.listUserInTable, (itemUser) => {
        return userName == itemUser.userName;
      });
      if (!objUserOut) {
      } else {
        this.renderUserInSeat(this.listUserInTable);
        this.setTotalUserPlaying(this.totalUserPlaying);
      }
    }
  }

  protected responseTipToBanker(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteRecevieTipToBanker();
    res.unpackData(data);
    // console.error(
    //   "ROULETTE TIP: ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
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
        let infoUser = nUser.getComponent(RLTPlayer).getInfoUser();
        infoUser.balance = infoUser.balance - money;
        nUser.getComponent(RLTPlayer).updateInfo(infoUser);

        let posHand = cc.v2(0, 290);
        let nChip = cc.instantiate(this.prfChip);
        nChip.getComponent(RLTPhinh).setFaceMoney(money);
        nChip.setPosition(posPlayer);
        nChip.scale = 1.2;
        nChip.active = false;
        nChip.opacity = 0;
        this.pnPlayer.addChild(nChip);

        this.scheduleOnce(() => {
          /// Chip bay
          nChip.active = true;
          nChip.opacity = 255;
          nChip.runAction(
            cc.sequence(
              cc.spawn(cc.moveTo(0.8, posHand), cc.scaleTo(0.8, 0.6)),
              cc.callFunc(() => {
                nChip.active = false;
                nChip.opacity = 0;

                RLTDealer.instance.tips();

                this.scheduleOnce(() => {
                  let nHeart = cc.instantiate(this.prfHeart);
                  nHeart.setPosition(cc.v2(0, 450));
                  nHeart.active = true;
                  nHeart.opacity = 255;

                  this.pnPlayer.addChild(nHeart);
                  nHeart.runAction(
                    cc.sequence(
                      cc.spawn(cc.moveTo(0.5, posPlayer), cc.scaleTo(0.5, 1)),
                      cc.callFunc(() => {
                        nHeart.stopAllActions();
                        nHeart.removeFromParent();
                        nChip.stopAllActions();
                        nChip.removeFromParent();
                        nUser.getComponent(RLTPlayer).kiss();
                      })
                    )
                  );
                }, 1);
              })
            )
          );
        });
      }
    }
  }

  protected responseClearBet(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveClearBet();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE CLEAR BET: ",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////////
    let err = res.err;
    this.toast.string = "";
    switch (err) {
      case 0:
        let nUser = null;
        if (
          res.userName ===
          this.playerMe.getComponent(RLTPlayer).getInfoUser().userName
        ) {
          nUser = this.playerMe;
        } else {
          nUser = this.getNodeUserInTable(res.userName);
          if (!nUser) {
            nUser = this.otherPlayer;
          }
        }
        let listBet = res.listBet;
        if (listBet) {
          const pairsUser = this.getArrayListBet2(listBet);
          pairsUser.forEach((pair) => {
            const [door, money] = pair.split(":");
            this.listTotalMoneyInDoor[door] -= parseInt(money);
            if (nUser === this.playerMe) {
              this.listMoneyOfMeInDoor[door] -= parseInt(money);
            }
            let nDoor = this.getInfoDoorByTypePot(Number(door));
            if (this.showOnlyMe) {
              nDoor
                .getComponent(RLTDoor)
                .countBetChip(this.listMoneyOfMeInDoor[door], true);
            } else {
              nDoor
                .getComponent(RLTDoor)
                .countBetChip(this.listTotalMoneyInDoor[door], false);
            }
            this.receivePhinhFromDoorWinToUser(nUser, nDoor, Number(money));
          });
          nUser.getComponent(RLTPlayer).setBalance(res.currentMoney);
        }

        this.activeBtnClearBet(false);
        break;

      case 1:
        this.toast.string = LanguageMgr.getString("roulette.invalid_time");
        break;
    }
    this.showToast();
  }

  protected responseRltListOtherUsers(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveListOtherUsers();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE LIST OTHER USERS: ",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
    this.listExternalUsers = res.listExternalUsers;
    this.UI_LOPS.getComponent(RLTListUser).show();
    this.UI_LOPS.getComponent(RLTListUser).initData(this.listExternalUsers);
  }

  protected responseMatchHistory(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveMatchHistory();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE MATCH HISTORY: ",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
    this.winning_history = RLTCommon.convertStrHisrotyToArray(
      res.sessionHistory
    );
    this.renderRltHistoryNumber();
  }

  protected responseRltChat(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteReceiveChat();
    res.unpackData(data);
    // console.error(
    //   "ROULETTE_CHAT",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   cmdId,
    //   res
    // );

    /////////////////////////////////////////////////////
    let isMe = this.isPlayerMe(res.userName);
    let nodePlayer: cc.Node = isMe
      ? this.playerMe
      : this.getNodeUserInTable(res.userName);
    if (nodePlayer) {
      nodePlayer.getComponent(RLTPlayer).responseChat(res);
    }
  }
  //Response End

  //Button Start
  private onClickArrowDown() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    this.arrowDown.active = false;
    this.tab.active = true;
    this.checkClick();
  }

  private onClickExit() {
    this.onClick();
    this.checkClick();
    RouletteNetwork.Send.sendRouletteExitGame(0);
  }

  private chooseChipValue(event, value) {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    this.betChipValue = value;
    let chip = event.target;
    if (this.currentChip) {
      this.currentChip.getComponent(cc.Animation).play("RLT_EffectStopBtnBet");
    } else {
      console.error("No chip selected");
    }
    this.currentChip = chip;
    this.currentChip.getComponent(cc.Animation).play("RLT_EffectBtnBet");
    this.checkClick();
  }

  public onClickchat() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    this.UI_Chat.active = !this.UI_Chat.active;
    this.checkClick();
  }

  public onClickGuide() {
    this.onClick();
    this.UI_Guide.active = true;
    this.checkClick();
  }

  public onCloseGuide() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    this.UI_Guide.active = false;
    this.checkClick();
  }

  public onClickTipToBanker() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    RouletteNetwork.Send.sendTipToBanker();
    this.btnTip.interactable = false;
    this.checkClick();
  }

  private onClickChangeShowView() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    this.showOnlyMe = !this.showOnlyMe;
    this.updatebtnShowView();
    this.checkClick();
  }

  private onClickClearBet() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    RouletteNetwork.Send.sendClearBet();
    this.checkClick();
  }

  private onClickSetting() {
    this.onClick();
    this.UI_Setting.active = true;
    this.checkClick();
  }

  public onClickHistory(): void {
    this.onClick();
    this.UI_UserHistory.getComponent(RLTUSERHISTORY).show();
    RouletteNetwork.Send.sendUserHistory();
    this.checkClick();
  }

  private onClick() {
    this.nSoundControler.playType(RLT_SOUND_TYPE.BTN_CLICK);
    this.tab.active = false;
    this.arrowDown.active = true;
  }

  public checkClick() {
    if (!this.isPlayerInteract) {
      this.isPlayerInteract = true;
    }
  }
  //Button End

  private backToLobby() {
    RouletteConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }

  private resetAllDefineMoneyInDoor(): void {
    this.initDetailMoneyOfMeInDoor();
    this.initDetailTotalMoneyInDoor();
    this.initTotalMoneyInDoor();
    this.initMoneyOfMeInDoor();
  }

  private initDetailTotalMoneyInDoor() {
    this.listDetailTotalMoneyInDoor = {
      [RouletteNetwork.Config.T_0]: [],
      [RouletteNetwork.Config.T_1]: [],
      [RouletteNetwork.Config.T_2]: [],
      [RouletteNetwork.Config.T_3]: [],
      [RouletteNetwork.Config.T_4]: [],
      [RouletteNetwork.Config.T_5]: [],
      [RouletteNetwork.Config.T_6]: [],
      [RouletteNetwork.Config.T_7]: [],
      [RouletteNetwork.Config.T_8]: [],
      [RouletteNetwork.Config.T_9]: [],
      [RouletteNetwork.Config.T_10]: [],
      [RouletteNetwork.Config.T_11]: [],
      [RouletteNetwork.Config.T_12]: [],
      [RouletteNetwork.Config.T_13]: [],
      [RouletteNetwork.Config.T_14]: [],
      [RouletteNetwork.Config.T_15]: [],
      [RouletteNetwork.Config.T_16]: [],
      [RouletteNetwork.Config.T_17]: [],
      [RouletteNetwork.Config.T_18]: [],
      [RouletteNetwork.Config.T_19]: [],
      [RouletteNetwork.Config.T_20]: [],
      [RouletteNetwork.Config.T_21]: [],
      [RouletteNetwork.Config.T_22]: [],
      [RouletteNetwork.Config.T_23]: [],
      [RouletteNetwork.Config.T_24]: [],
      [RouletteNetwork.Config.T_25]: [],
      [RouletteNetwork.Config.T_26]: [],
      [RouletteNetwork.Config.T_27]: [],
      [RouletteNetwork.Config.T_28]: [],
      [RouletteNetwork.Config.T_29]: [],
      [RouletteNetwork.Config.T_30]: [],
      [RouletteNetwork.Config.T_31]: [],
      [RouletteNetwork.Config.T_32]: [],
      [RouletteNetwork.Config.T_33]: [],
      [RouletteNetwork.Config.T_34]: [],
      [RouletteNetwork.Config.T_35]: [],
      [RouletteNetwork.Config.T_36]: [],
      [RouletteNetwork.Config.EVEN]: [],
      [RouletteNetwork.Config.ODD]: [],
      [RouletteNetwork.Config.RED]: [],
      [RouletteNetwork.Config.BLACK]: [],
      [RouletteNetwork.Config.T_1_TO_18]: [],
      [RouletteNetwork.Config.T_19_TO_36]: [],
      [RouletteNetwork.Config.T_1_TO_12]: [],
      [RouletteNetwork.Config.T_13_TO_24]: [],
      [RouletteNetwork.Config.T_25_TO_36]: [],
      [RouletteNetwork.Config.T_ROW_1]: [],
      [RouletteNetwork.Config.T_ROW_2]: [],
      [RouletteNetwork.Config.T_ROW_3]: [],
      [RouletteNetwork.Config.T0_1]: [],
      [RouletteNetwork.Config.T0_2]: [],
      [RouletteNetwork.Config.T0_3]: [],
      [RouletteNetwork.Config.T1_2]: [],
      [RouletteNetwork.Config.T1_4]: [],
      [RouletteNetwork.Config.T2_3]: [],
      [RouletteNetwork.Config.T2_5]: [],
      [RouletteNetwork.Config.T3_6]: [],
      [RouletteNetwork.Config.T4_5]: [],
      [RouletteNetwork.Config.T4_7]: [],
      [RouletteNetwork.Config.T5_6]: [],
      [RouletteNetwork.Config.T5_8]: [],
      [RouletteNetwork.Config.T6_9]: [],
      [RouletteNetwork.Config.T7_8]: [],
      [RouletteNetwork.Config.T7_10]: [],
      [RouletteNetwork.Config.T8_9]: [],
      [RouletteNetwork.Config.T8_11]: [],
      [RouletteNetwork.Config.T9_12]: [],
      [RouletteNetwork.Config.T10_11]: [],
      [RouletteNetwork.Config.T10_13]: [],
      [RouletteNetwork.Config.T11_12]: [],
      [RouletteNetwork.Config.T11_14]: [],
      [RouletteNetwork.Config.T12_15]: [],
      [RouletteNetwork.Config.T13_14]: [],
      [RouletteNetwork.Config.T13_16]: [],
      [RouletteNetwork.Config.T14_15]: [],
      [RouletteNetwork.Config.T14_17]: [],
      [RouletteNetwork.Config.T15_18]: [],
      [RouletteNetwork.Config.T16_17]: [],
      [RouletteNetwork.Config.T16_19]: [],
      [RouletteNetwork.Config.T17_18]: [],
      [RouletteNetwork.Config.T17_20]: [],
      [RouletteNetwork.Config.T18_21]: [],
      [RouletteNetwork.Config.T19_20]: [],
      [RouletteNetwork.Config.T19_22]: [],
      [RouletteNetwork.Config.T20_21]: [],
      [RouletteNetwork.Config.T20_23]: [],
      [RouletteNetwork.Config.T21_24]: [],
      [RouletteNetwork.Config.T22_23]: [],
      [RouletteNetwork.Config.T22_25]: [],
      [RouletteNetwork.Config.T23_24]: [],
      [RouletteNetwork.Config.T23_26]: [],
      [RouletteNetwork.Config.T24_27]: [],
      [RouletteNetwork.Config.T25_26]: [],
      [RouletteNetwork.Config.T25_28]: [],
      [RouletteNetwork.Config.T26_27]: [],
      [RouletteNetwork.Config.T26_29]: [],
      [RouletteNetwork.Config.T27_30]: [],
      [RouletteNetwork.Config.T28_29]: [],
      [RouletteNetwork.Config.T28_31]: [],
      [RouletteNetwork.Config.T29_30]: [],
      [RouletteNetwork.Config.T29_32]: [],
      [RouletteNetwork.Config.T30_33]: [],
      [RouletteNetwork.Config.T31_32]: [],
      [RouletteNetwork.Config.T31_34]: [],
      [RouletteNetwork.Config.T32_33]: [],
      [RouletteNetwork.Config.T32_35]: [],
      [RouletteNetwork.Config.T33_36]: [],
      [RouletteNetwork.Config.T34_35]: [],
      [RouletteNetwork.Config.T35_36]: [],
      [RouletteNetwork.Config.T0_1_2]: [],
      [RouletteNetwork.Config.T0_2_3]: [],
      [RouletteNetwork.Config.T1_2_3]: [],
      [RouletteNetwork.Config.T4_5_6]: [],
      [RouletteNetwork.Config.T7_8_9]: [],
      [RouletteNetwork.Config.T10_11_12]: [],
      [RouletteNetwork.Config.T13_14_15]: [],
      [RouletteNetwork.Config.T16_17_18]: [],
      [RouletteNetwork.Config.T19_20_21]: [],
      [RouletteNetwork.Config.T22_23_24]: [],
      [RouletteNetwork.Config.T25_26_27]: [],
      [RouletteNetwork.Config.T28_29_30]: [],
      [RouletteNetwork.Config.T31_32_33]: [],
      [RouletteNetwork.Config.T34_35_36]: [],
      [RouletteNetwork.Config.T0_1_2_3]: [],
      [RouletteNetwork.Config.T1_2_4_5]: [],
      [RouletteNetwork.Config.T2_3_5_6]: [],
      [RouletteNetwork.Config.T4_5_7_8]: [],
      [RouletteNetwork.Config.T5_6_8_9]: [],
      [RouletteNetwork.Config.T7_8_10_11]: [],
      [RouletteNetwork.Config.T8_9_11_12]: [],
      [RouletteNetwork.Config.T10_11_13_14]: [],
      [RouletteNetwork.Config.T11_12_14_15]: [],
      [RouletteNetwork.Config.T13_14_16_17]: [],
      [RouletteNetwork.Config.T14_15_17_18]: [],
      [RouletteNetwork.Config.T16_17_19_20]: [],
      [RouletteNetwork.Config.T17_18_20_21]: [],
      [RouletteNetwork.Config.T19_20_22_23]: [],
      [RouletteNetwork.Config.T20_21_23_24]: [],
      [RouletteNetwork.Config.T22_23_25_26]: [],
      [RouletteNetwork.Config.T23_24_26_27]: [],
      [RouletteNetwork.Config.T25_26_28_29]: [],
      [RouletteNetwork.Config.T26_27_29_30]: [],
      [RouletteNetwork.Config.T28_29_31_32]: [],
      [RouletteNetwork.Config.T29_30_32_33]: [],
      [RouletteNetwork.Config.T31_32_34_35]: [],
      [RouletteNetwork.Config.T32_33_35_36]: [],
      [RouletteNetwork.Config.T1_2_3_4_5_6]: [],
      [RouletteNetwork.Config.T4_5_6_7_8_9]: [],
      [RouletteNetwork.Config.T7_8_9_10_11_12]: [],
      [RouletteNetwork.Config.T10_11_12_13_14_15]: [],
      [RouletteNetwork.Config.T13_14_15_16_17_18]: [],
      [RouletteNetwork.Config.T16_17_18_19_20_21]: [],
      [RouletteNetwork.Config.T19_20_21_22_23_24]: [],
      [RouletteNetwork.Config.T22_23_24_25_26_27]: [],
      [RouletteNetwork.Config.T25_26_27_28_29_30]: [],
      [RouletteNetwork.Config.T28_29_30_31_32_33]: [],
      [RouletteNetwork.Config.T31_32_33_34_35_36]: [],
    };
  }

  private initDetailMoneyOfMeInDoor() {
    this.listDetailMoneyOfMeInDoor = {
      [RouletteNetwork.Config.T_0]: [],
      [RouletteNetwork.Config.T_1]: [],
      [RouletteNetwork.Config.T_2]: [],
      [RouletteNetwork.Config.T_3]: [],
      [RouletteNetwork.Config.T_4]: [],
      [RouletteNetwork.Config.T_5]: [],
      [RouletteNetwork.Config.T_6]: [],
      [RouletteNetwork.Config.T_7]: [],
      [RouletteNetwork.Config.T_8]: [],
      [RouletteNetwork.Config.T_9]: [],
      [RouletteNetwork.Config.T_10]: [],
      [RouletteNetwork.Config.T_11]: [],
      [RouletteNetwork.Config.T_12]: [],
      [RouletteNetwork.Config.T_13]: [],
      [RouletteNetwork.Config.T_14]: [],
      [RouletteNetwork.Config.T_15]: [],
      [RouletteNetwork.Config.T_16]: [],
      [RouletteNetwork.Config.T_17]: [],
      [RouletteNetwork.Config.T_18]: [],
      [RouletteNetwork.Config.T_19]: [],
      [RouletteNetwork.Config.T_20]: [],
      [RouletteNetwork.Config.T_21]: [],
      [RouletteNetwork.Config.T_22]: [],
      [RouletteNetwork.Config.T_23]: [],
      [RouletteNetwork.Config.T_24]: [],
      [RouletteNetwork.Config.T_25]: [],
      [RouletteNetwork.Config.T_26]: [],
      [RouletteNetwork.Config.T_27]: [],
      [RouletteNetwork.Config.T_28]: [],
      [RouletteNetwork.Config.T_29]: [],
      [RouletteNetwork.Config.T_30]: [],
      [RouletteNetwork.Config.T_31]: [],
      [RouletteNetwork.Config.T_32]: [],
      [RouletteNetwork.Config.T_33]: [],
      [RouletteNetwork.Config.T_34]: [],
      [RouletteNetwork.Config.T_35]: [],
      [RouletteNetwork.Config.T_36]: [],
      [RouletteNetwork.Config.EVEN]: [],
      [RouletteNetwork.Config.ODD]: [],
      [RouletteNetwork.Config.RED]: [],
      [RouletteNetwork.Config.BLACK]: [],
      [RouletteNetwork.Config.T_1_TO_18]: [],
      [RouletteNetwork.Config.T_19_TO_36]: [],
      [RouletteNetwork.Config.T_1_TO_12]: [],
      [RouletteNetwork.Config.T_13_TO_24]: [],
      [RouletteNetwork.Config.T_25_TO_36]: [],
      [RouletteNetwork.Config.T_ROW_1]: [],
      [RouletteNetwork.Config.T_ROW_2]: [],
      [RouletteNetwork.Config.T_ROW_3]: [],
      [RouletteNetwork.Config.T0_1]: [],
      [RouletteNetwork.Config.T0_2]: [],
      [RouletteNetwork.Config.T0_3]: [],
      [RouletteNetwork.Config.T1_2]: [],
      [RouletteNetwork.Config.T1_4]: [],
      [RouletteNetwork.Config.T2_3]: [],
      [RouletteNetwork.Config.T2_5]: [],
      [RouletteNetwork.Config.T3_6]: [],
      [RouletteNetwork.Config.T4_5]: [],
      [RouletteNetwork.Config.T4_7]: [],
      [RouletteNetwork.Config.T5_6]: [],
      [RouletteNetwork.Config.T5_8]: [],
      [RouletteNetwork.Config.T6_9]: [],
      [RouletteNetwork.Config.T7_8]: [],
      [RouletteNetwork.Config.T7_10]: [],
      [RouletteNetwork.Config.T8_9]: [],
      [RouletteNetwork.Config.T8_11]: [],
      [RouletteNetwork.Config.T9_12]: [],
      [RouletteNetwork.Config.T10_11]: [],
      [RouletteNetwork.Config.T10_13]: [],
      [RouletteNetwork.Config.T11_12]: [],
      [RouletteNetwork.Config.T11_14]: [],
      [RouletteNetwork.Config.T12_15]: [],
      [RouletteNetwork.Config.T13_14]: [],
      [RouletteNetwork.Config.T13_16]: [],
      [RouletteNetwork.Config.T14_15]: [],
      [RouletteNetwork.Config.T14_17]: [],
      [RouletteNetwork.Config.T15_18]: [],
      [RouletteNetwork.Config.T16_17]: [],
      [RouletteNetwork.Config.T16_19]: [],
      [RouletteNetwork.Config.T17_18]: [],
      [RouletteNetwork.Config.T17_20]: [],
      [RouletteNetwork.Config.T18_21]: [],
      [RouletteNetwork.Config.T19_20]: [],
      [RouletteNetwork.Config.T19_22]: [],
      [RouletteNetwork.Config.T20_21]: [],
      [RouletteNetwork.Config.T20_23]: [],
      [RouletteNetwork.Config.T21_24]: [],
      [RouletteNetwork.Config.T22_23]: [],
      [RouletteNetwork.Config.T22_25]: [],
      [RouletteNetwork.Config.T23_24]: [],
      [RouletteNetwork.Config.T23_26]: [],
      [RouletteNetwork.Config.T24_27]: [],
      [RouletteNetwork.Config.T25_26]: [],
      [RouletteNetwork.Config.T25_28]: [],
      [RouletteNetwork.Config.T26_27]: [],
      [RouletteNetwork.Config.T26_29]: [],
      [RouletteNetwork.Config.T27_30]: [],
      [RouletteNetwork.Config.T28_29]: [],
      [RouletteNetwork.Config.T28_31]: [],
      [RouletteNetwork.Config.T29_30]: [],
      [RouletteNetwork.Config.T29_32]: [],
      [RouletteNetwork.Config.T30_33]: [],
      [RouletteNetwork.Config.T31_32]: [],
      [RouletteNetwork.Config.T31_34]: [],
      [RouletteNetwork.Config.T32_33]: [],
      [RouletteNetwork.Config.T32_35]: [],
      [RouletteNetwork.Config.T33_36]: [],
      [RouletteNetwork.Config.T34_35]: [],
      [RouletteNetwork.Config.T35_36]: [],
      [RouletteNetwork.Config.T0_1_2]: [],
      [RouletteNetwork.Config.T0_2_3]: [],
      [RouletteNetwork.Config.T1_2_3]: [],
      [RouletteNetwork.Config.T4_5_6]: [],
      [RouletteNetwork.Config.T7_8_9]: [],
      [RouletteNetwork.Config.T10_11_12]: [],
      [RouletteNetwork.Config.T13_14_15]: [],
      [RouletteNetwork.Config.T16_17_18]: [],
      [RouletteNetwork.Config.T19_20_21]: [],
      [RouletteNetwork.Config.T22_23_24]: [],
      [RouletteNetwork.Config.T25_26_27]: [],
      [RouletteNetwork.Config.T28_29_30]: [],
      [RouletteNetwork.Config.T31_32_33]: [],
      [RouletteNetwork.Config.T34_35_36]: [],
      [RouletteNetwork.Config.T0_1_2_3]: [],
      [RouletteNetwork.Config.T1_2_4_5]: [],
      [RouletteNetwork.Config.T2_3_5_6]: [],
      [RouletteNetwork.Config.T4_5_7_8]: [],
      [RouletteNetwork.Config.T5_6_8_9]: [],
      [RouletteNetwork.Config.T7_8_10_11]: [],
      [RouletteNetwork.Config.T8_9_11_12]: [],
      [RouletteNetwork.Config.T10_11_13_14]: [],
      [RouletteNetwork.Config.T11_12_14_15]: [],
      [RouletteNetwork.Config.T13_14_16_17]: [],
      [RouletteNetwork.Config.T14_15_17_18]: [],
      [RouletteNetwork.Config.T16_17_19_20]: [],
      [RouletteNetwork.Config.T17_18_20_21]: [],
      [RouletteNetwork.Config.T19_20_22_23]: [],
      [RouletteNetwork.Config.T20_21_23_24]: [],
      [RouletteNetwork.Config.T22_23_25_26]: [],
      [RouletteNetwork.Config.T23_24_26_27]: [],
      [RouletteNetwork.Config.T25_26_28_29]: [],
      [RouletteNetwork.Config.T26_27_29_30]: [],
      [RouletteNetwork.Config.T28_29_31_32]: [],
      [RouletteNetwork.Config.T29_30_32_33]: [],
      [RouletteNetwork.Config.T31_32_34_35]: [],
      [RouletteNetwork.Config.T32_33_35_36]: [],
      [RouletteNetwork.Config.T1_2_3_4_5_6]: [],
      [RouletteNetwork.Config.T4_5_6_7_8_9]: [],
      [RouletteNetwork.Config.T7_8_9_10_11_12]: [],
      [RouletteNetwork.Config.T10_11_12_13_14_15]: [],
      [RouletteNetwork.Config.T13_14_15_16_17_18]: [],
      [RouletteNetwork.Config.T16_17_18_19_20_21]: [],
      [RouletteNetwork.Config.T19_20_21_22_23_24]: [],
      [RouletteNetwork.Config.T22_23_24_25_26_27]: [],
      [RouletteNetwork.Config.T25_26_27_28_29_30]: [],
      [RouletteNetwork.Config.T28_29_30_31_32_33]: [],
      [RouletteNetwork.Config.T31_32_33_34_35_36]: [],
    };
  }

  private initTotalMoneyInDoor() {
    this.listTotalMoneyInDoor = {
      [RouletteNetwork.Config.T_0]: 0,
      [RouletteNetwork.Config.T_1]: 0,
      [RouletteNetwork.Config.T_2]: 0,
      [RouletteNetwork.Config.T_3]: 0,
      [RouletteNetwork.Config.T_4]: 0,
      [RouletteNetwork.Config.T_5]: 0,
      [RouletteNetwork.Config.T_6]: 0,
      [RouletteNetwork.Config.T_7]: 0,
      [RouletteNetwork.Config.T_8]: 0,
      [RouletteNetwork.Config.T_9]: 0,
      [RouletteNetwork.Config.T_10]: 0,
      [RouletteNetwork.Config.T_11]: 0,
      [RouletteNetwork.Config.T_12]: 0,
      [RouletteNetwork.Config.T_13]: 0,
      [RouletteNetwork.Config.T_14]: 0,
      [RouletteNetwork.Config.T_15]: 0,
      [RouletteNetwork.Config.T_16]: 0,
      [RouletteNetwork.Config.T_17]: 0,
      [RouletteNetwork.Config.T_18]: 0,
      [RouletteNetwork.Config.T_19]: 0,
      [RouletteNetwork.Config.T_20]: 0,
      [RouletteNetwork.Config.T_21]: 0,
      [RouletteNetwork.Config.T_22]: 0,
      [RouletteNetwork.Config.T_23]: 0,
      [RouletteNetwork.Config.T_24]: 0,
      [RouletteNetwork.Config.T_25]: 0,
      [RouletteNetwork.Config.T_26]: 0,
      [RouletteNetwork.Config.T_27]: 0,
      [RouletteNetwork.Config.T_28]: 0,
      [RouletteNetwork.Config.T_29]: 0,
      [RouletteNetwork.Config.T_30]: 0,
      [RouletteNetwork.Config.T_31]: 0,
      [RouletteNetwork.Config.T_32]: 0,
      [RouletteNetwork.Config.T_33]: 0,
      [RouletteNetwork.Config.T_34]: 0,
      [RouletteNetwork.Config.T_35]: 0,
      [RouletteNetwork.Config.T_36]: 0,
      [RouletteNetwork.Config.EVEN]: 0,
      [RouletteNetwork.Config.ODD]: 0,
      [RouletteNetwork.Config.RED]: 0,
      [RouletteNetwork.Config.BLACK]: 0,
      [RouletteNetwork.Config.T_1_TO_18]: 0,
      [RouletteNetwork.Config.T_19_TO_36]: 0,
      [RouletteNetwork.Config.T_1_TO_12]: 0,
      [RouletteNetwork.Config.T_13_TO_24]: 0,
      [RouletteNetwork.Config.T_25_TO_36]: 0,
      [RouletteNetwork.Config.T_ROW_1]: 0,
      [RouletteNetwork.Config.T_ROW_2]: 0,
      [RouletteNetwork.Config.T_ROW_3]: 0,
      [RouletteNetwork.Config.T0_1]: 0,
      [RouletteNetwork.Config.T0_2]: 0,
      [RouletteNetwork.Config.T0_3]: 0,
      [RouletteNetwork.Config.T1_2]: 0,
      [RouletteNetwork.Config.T1_4]: 0,
      [RouletteNetwork.Config.T2_3]: 0,
      [RouletteNetwork.Config.T2_5]: 0,
      [RouletteNetwork.Config.T3_6]: 0,
      [RouletteNetwork.Config.T4_5]: 0,
      [RouletteNetwork.Config.T4_7]: 0,
      [RouletteNetwork.Config.T5_6]: 0,
      [RouletteNetwork.Config.T5_8]: 0,
      [RouletteNetwork.Config.T6_9]: 0,
      [RouletteNetwork.Config.T7_8]: 0,
      [RouletteNetwork.Config.T7_10]: 0,
      [RouletteNetwork.Config.T8_9]: 0,
      [RouletteNetwork.Config.T8_11]: 0,
      [RouletteNetwork.Config.T9_12]: 0,
      [RouletteNetwork.Config.T10_11]: 0,
      [RouletteNetwork.Config.T10_13]: 0,
      [RouletteNetwork.Config.T11_12]: 0,
      [RouletteNetwork.Config.T11_14]: 0,
      [RouletteNetwork.Config.T12_15]: 0,
      [RouletteNetwork.Config.T13_14]: 0,
      [RouletteNetwork.Config.T13_16]: 0,
      [RouletteNetwork.Config.T14_15]: 0,
      [RouletteNetwork.Config.T14_17]: 0,
      [RouletteNetwork.Config.T15_18]: 0,
      [RouletteNetwork.Config.T16_17]: 0,
      [RouletteNetwork.Config.T16_19]: 0,
      [RouletteNetwork.Config.T17_18]: 0,
      [RouletteNetwork.Config.T17_20]: 0,
      [RouletteNetwork.Config.T18_21]: 0,
      [RouletteNetwork.Config.T19_20]: 0,
      [RouletteNetwork.Config.T19_22]: 0,
      [RouletteNetwork.Config.T20_21]: 0,
      [RouletteNetwork.Config.T20_23]: 0,
      [RouletteNetwork.Config.T21_24]: 0,
      [RouletteNetwork.Config.T22_23]: 0,
      [RouletteNetwork.Config.T22_25]: 0,
      [RouletteNetwork.Config.T23_24]: 0,
      [RouletteNetwork.Config.T23_26]: 0,
      [RouletteNetwork.Config.T24_27]: 0,
      [RouletteNetwork.Config.T25_26]: 0,
      [RouletteNetwork.Config.T25_28]: 0,
      [RouletteNetwork.Config.T26_27]: 0,
      [RouletteNetwork.Config.T26_29]: 0,
      [RouletteNetwork.Config.T27_30]: 0,
      [RouletteNetwork.Config.T28_29]: 0,
      [RouletteNetwork.Config.T28_31]: 0,
      [RouletteNetwork.Config.T29_30]: 0,
      [RouletteNetwork.Config.T29_32]: 0,
      [RouletteNetwork.Config.T30_33]: 0,
      [RouletteNetwork.Config.T31_32]: 0,
      [RouletteNetwork.Config.T31_34]: 0,
      [RouletteNetwork.Config.T32_33]: 0,
      [RouletteNetwork.Config.T32_35]: 0,
      [RouletteNetwork.Config.T33_36]: 0,
      [RouletteNetwork.Config.T34_35]: 0,
      [RouletteNetwork.Config.T35_36]: 0,
      [RouletteNetwork.Config.T0_1_2]: 0,
      [RouletteNetwork.Config.T0_2_3]: 0,
      [RouletteNetwork.Config.T1_2_3]: 0,
      [RouletteNetwork.Config.T4_5_6]: 0,
      [RouletteNetwork.Config.T7_8_9]: 0,
      [RouletteNetwork.Config.T10_11_12]: 0,
      [RouletteNetwork.Config.T13_14_15]: 0,
      [RouletteNetwork.Config.T16_17_18]: 0,
      [RouletteNetwork.Config.T19_20_21]: 0,
      [RouletteNetwork.Config.T22_23_24]: 0,
      [RouletteNetwork.Config.T25_26_27]: 0,
      [RouletteNetwork.Config.T28_29_30]: 0,
      [RouletteNetwork.Config.T31_32_33]: 0,
      [RouletteNetwork.Config.T34_35_36]: 0,
      [RouletteNetwork.Config.T0_1_2_3]: 0,
      [RouletteNetwork.Config.T1_2_4_5]: 0,
      [RouletteNetwork.Config.T2_3_5_6]: 0,
      [RouletteNetwork.Config.T4_5_7_8]: 0,
      [RouletteNetwork.Config.T5_6_8_9]: 0,
      [RouletteNetwork.Config.T7_8_10_11]: 0,
      [RouletteNetwork.Config.T8_9_11_12]: 0,
      [RouletteNetwork.Config.T10_11_13_14]: 0,
      [RouletteNetwork.Config.T11_12_14_15]: 0,
      [RouletteNetwork.Config.T13_14_16_17]: 0,
      [RouletteNetwork.Config.T14_15_17_18]: 0,
      [RouletteNetwork.Config.T16_17_19_20]: 0,
      [RouletteNetwork.Config.T17_18_20_21]: 0,
      [RouletteNetwork.Config.T19_20_22_23]: 0,
      [RouletteNetwork.Config.T20_21_23_24]: 0,
      [RouletteNetwork.Config.T22_23_25_26]: 0,
      [RouletteNetwork.Config.T23_24_26_27]: 0,
      [RouletteNetwork.Config.T25_26_28_29]: 0,
      [RouletteNetwork.Config.T26_27_29_30]: 0,
      [RouletteNetwork.Config.T28_29_31_32]: 0,
      [RouletteNetwork.Config.T29_30_32_33]: 0,
      [RouletteNetwork.Config.T31_32_34_35]: 0,
      [RouletteNetwork.Config.T32_33_35_36]: 0,
      [RouletteNetwork.Config.T1_2_3_4_5_6]: 0,
      [RouletteNetwork.Config.T4_5_6_7_8_9]: 0,
      [RouletteNetwork.Config.T7_8_9_10_11_12]: 0,
      [RouletteNetwork.Config.T10_11_12_13_14_15]: 0,
      [RouletteNetwork.Config.T13_14_15_16_17_18]: 0,
      [RouletteNetwork.Config.T16_17_18_19_20_21]: 0,
      [RouletteNetwork.Config.T19_20_21_22_23_24]: 0,
      [RouletteNetwork.Config.T22_23_24_25_26_27]: 0,
      [RouletteNetwork.Config.T25_26_27_28_29_30]: 0,
      [RouletteNetwork.Config.T28_29_30_31_32_33]: 0,
      [RouletteNetwork.Config.T31_32_33_34_35_36]: 0,
    };
  }

  private initMoneyOfMeInDoor() {
    this.listMoneyOfMeInDoor = {
      [RouletteNetwork.Config.T_0]: 0,
      [RouletteNetwork.Config.T_1]: 0,
      [RouletteNetwork.Config.T_2]: 0,
      [RouletteNetwork.Config.T_3]: 0,
      [RouletteNetwork.Config.T_4]: 0,
      [RouletteNetwork.Config.T_5]: 0,
      [RouletteNetwork.Config.T_6]: 0,
      [RouletteNetwork.Config.T_7]: 0,
      [RouletteNetwork.Config.T_8]: 0,
      [RouletteNetwork.Config.T_9]: 0,
      [RouletteNetwork.Config.T_10]: 0,
      [RouletteNetwork.Config.T_11]: 0,
      [RouletteNetwork.Config.T_12]: 0,
      [RouletteNetwork.Config.T_13]: 0,
      [RouletteNetwork.Config.T_14]: 0,
      [RouletteNetwork.Config.T_15]: 0,
      [RouletteNetwork.Config.T_16]: 0,
      [RouletteNetwork.Config.T_17]: 0,
      [RouletteNetwork.Config.T_18]: 0,
      [RouletteNetwork.Config.T_19]: 0,
      [RouletteNetwork.Config.T_20]: 0,
      [RouletteNetwork.Config.T_21]: 0,
      [RouletteNetwork.Config.T_22]: 0,
      [RouletteNetwork.Config.T_23]: 0,
      [RouletteNetwork.Config.T_24]: 0,
      [RouletteNetwork.Config.T_25]: 0,
      [RouletteNetwork.Config.T_26]: 0,
      [RouletteNetwork.Config.T_27]: 0,
      [RouletteNetwork.Config.T_28]: 0,
      [RouletteNetwork.Config.T_29]: 0,
      [RouletteNetwork.Config.T_30]: 0,
      [RouletteNetwork.Config.T_31]: 0,
      [RouletteNetwork.Config.T_32]: 0,
      [RouletteNetwork.Config.T_33]: 0,
      [RouletteNetwork.Config.T_34]: 0,
      [RouletteNetwork.Config.T_35]: 0,
      [RouletteNetwork.Config.T_36]: 0,
      [RouletteNetwork.Config.EVEN]: 0,
      [RouletteNetwork.Config.ODD]: 0,
      [RouletteNetwork.Config.RED]: 0,
      [RouletteNetwork.Config.BLACK]: 0,
      [RouletteNetwork.Config.T_1_TO_18]: 0,
      [RouletteNetwork.Config.T_19_TO_36]: 0,
      [RouletteNetwork.Config.T_1_TO_12]: 0,
      [RouletteNetwork.Config.T_13_TO_24]: 0,
      [RouletteNetwork.Config.T_25_TO_36]: 0,
      [RouletteNetwork.Config.T_ROW_1]: 0,
      [RouletteNetwork.Config.T_ROW_2]: 0,
      [RouletteNetwork.Config.T_ROW_3]: 0,
      [RouletteNetwork.Config.T0_1]: 0,
      [RouletteNetwork.Config.T0_2]: 0,
      [RouletteNetwork.Config.T0_3]: 0,
      [RouletteNetwork.Config.T1_2]: 0,
      [RouletteNetwork.Config.T1_4]: 0,
      [RouletteNetwork.Config.T2_3]: 0,
      [RouletteNetwork.Config.T2_5]: 0,
      [RouletteNetwork.Config.T3_6]: 0,
      [RouletteNetwork.Config.T4_5]: 0,
      [RouletteNetwork.Config.T4_7]: 0,
      [RouletteNetwork.Config.T5_6]: 0,
      [RouletteNetwork.Config.T5_8]: 0,
      [RouletteNetwork.Config.T6_9]: 0,
      [RouletteNetwork.Config.T7_8]: 0,
      [RouletteNetwork.Config.T7_10]: 0,
      [RouletteNetwork.Config.T8_9]: 0,
      [RouletteNetwork.Config.T8_11]: 0,
      [RouletteNetwork.Config.T9_12]: 0,
      [RouletteNetwork.Config.T10_11]: 0,
      [RouletteNetwork.Config.T10_13]: 0,
      [RouletteNetwork.Config.T11_12]: 0,
      [RouletteNetwork.Config.T11_14]: 0,
      [RouletteNetwork.Config.T12_15]: 0,
      [RouletteNetwork.Config.T13_14]: 0,
      [RouletteNetwork.Config.T13_16]: 0,
      [RouletteNetwork.Config.T14_15]: 0,
      [RouletteNetwork.Config.T14_17]: 0,
      [RouletteNetwork.Config.T15_18]: 0,
      [RouletteNetwork.Config.T16_17]: 0,
      [RouletteNetwork.Config.T16_19]: 0,
      [RouletteNetwork.Config.T17_18]: 0,
      [RouletteNetwork.Config.T17_20]: 0,
      [RouletteNetwork.Config.T18_21]: 0,
      [RouletteNetwork.Config.T19_20]: 0,
      [RouletteNetwork.Config.T19_22]: 0,
      [RouletteNetwork.Config.T20_21]: 0,
      [RouletteNetwork.Config.T20_23]: 0,
      [RouletteNetwork.Config.T21_24]: 0,
      [RouletteNetwork.Config.T22_23]: 0,
      [RouletteNetwork.Config.T22_25]: 0,
      [RouletteNetwork.Config.T23_24]: 0,
      [RouletteNetwork.Config.T23_26]: 0,
      [RouletteNetwork.Config.T24_27]: 0,
      [RouletteNetwork.Config.T25_26]: 0,
      [RouletteNetwork.Config.T25_28]: 0,
      [RouletteNetwork.Config.T26_27]: 0,
      [RouletteNetwork.Config.T26_29]: 0,
      [RouletteNetwork.Config.T27_30]: 0,
      [RouletteNetwork.Config.T28_29]: 0,
      [RouletteNetwork.Config.T28_31]: 0,
      [RouletteNetwork.Config.T29_30]: 0,
      [RouletteNetwork.Config.T29_32]: 0,
      [RouletteNetwork.Config.T30_33]: 0,
      [RouletteNetwork.Config.T31_32]: 0,
      [RouletteNetwork.Config.T31_34]: 0,
      [RouletteNetwork.Config.T32_33]: 0,
      [RouletteNetwork.Config.T32_35]: 0,
      [RouletteNetwork.Config.T33_36]: 0,
      [RouletteNetwork.Config.T34_35]: 0,
      [RouletteNetwork.Config.T35_36]: 0,
      [RouletteNetwork.Config.T0_1_2]: 0,
      [RouletteNetwork.Config.T0_2_3]: 0,
      [RouletteNetwork.Config.T1_2_3]: 0,
      [RouletteNetwork.Config.T4_5_6]: 0,
      [RouletteNetwork.Config.T7_8_9]: 0,
      [RouletteNetwork.Config.T10_11_12]: 0,
      [RouletteNetwork.Config.T13_14_15]: 0,
      [RouletteNetwork.Config.T16_17_18]: 0,
      [RouletteNetwork.Config.T19_20_21]: 0,
      [RouletteNetwork.Config.T22_23_24]: 0,
      [RouletteNetwork.Config.T25_26_27]: 0,
      [RouletteNetwork.Config.T28_29_30]: 0,
      [RouletteNetwork.Config.T31_32_33]: 0,
      [RouletteNetwork.Config.T34_35_36]: 0,
      [RouletteNetwork.Config.T0_1_2_3]: 0,
      [RouletteNetwork.Config.T1_2_4_5]: 0,
      [RouletteNetwork.Config.T2_3_5_6]: 0,
      [RouletteNetwork.Config.T4_5_7_8]: 0,
      [RouletteNetwork.Config.T5_6_8_9]: 0,
      [RouletteNetwork.Config.T7_8_10_11]: 0,
      [RouletteNetwork.Config.T8_9_11_12]: 0,
      [RouletteNetwork.Config.T10_11_13_14]: 0,
      [RouletteNetwork.Config.T11_12_14_15]: 0,
      [RouletteNetwork.Config.T13_14_16_17]: 0,
      [RouletteNetwork.Config.T14_15_17_18]: 0,
      [RouletteNetwork.Config.T16_17_19_20]: 0,
      [RouletteNetwork.Config.T17_18_20_21]: 0,
      [RouletteNetwork.Config.T19_20_22_23]: 0,
      [RouletteNetwork.Config.T20_21_23_24]: 0,
      [RouletteNetwork.Config.T22_23_25_26]: 0,
      [RouletteNetwork.Config.T23_24_26_27]: 0,
      [RouletteNetwork.Config.T25_26_28_29]: 0,
      [RouletteNetwork.Config.T26_27_29_30]: 0,
      [RouletteNetwork.Config.T28_29_31_32]: 0,
      [RouletteNetwork.Config.T29_30_32_33]: 0,
      [RouletteNetwork.Config.T31_32_34_35]: 0,
      [RouletteNetwork.Config.T32_33_35_36]: 0,
      [RouletteNetwork.Config.T1_2_3_4_5_6]: 0,
      [RouletteNetwork.Config.T4_5_6_7_8_9]: 0,
      [RouletteNetwork.Config.T7_8_9_10_11_12]: 0,
      [RouletteNetwork.Config.T10_11_12_13_14_15]: 0,
      [RouletteNetwork.Config.T13_14_15_16_17_18]: 0,
      [RouletteNetwork.Config.T16_17_18_19_20_21]: 0,
      [RouletteNetwork.Config.T19_20_21_22_23_24]: 0,
      [RouletteNetwork.Config.T22_23_24_25_26_27]: 0,
      [RouletteNetwork.Config.T25_26_27_28_29_30]: 0,
      [RouletteNetwork.Config.T28_29_30_31_32_33]: 0,
      [RouletteNetwork.Config.T31_32_33_34_35_36]: 0,
    };
  }

  private resetAllDoor() {
    for (let i = 0; i < 157; i++) {
      let nDoor = this.doors[i];
      nDoor.getComponent(RLTDoor).resetNewSession();
      nDoor.getComponent(RLTDoor).removeAllChipInDoor();
    }
  }

  private renderInfoForMe(infoMe: RouletteNetwork.User) {
    this.playerMe.getComponent(RLTPlayer).updateInfo(infoMe);
  }

  private renderUserInSeat(listUser: Array<RouletteNetwork.User>) {
    let guestAccounts = listUser.filter((itemUser) => {
      return !itemUser.isMe;
    });
    for (let i = 0; i < 7; i++) {
      let objPlayer = this.players[i];
      let userItem = guestAccounts[i];
      if (userItem && objPlayer) {
        objPlayer.getComponent(RLTPlayer).resetNewGame();
        objPlayer.getComponent(RLTPlayer).showPlayer();
        objPlayer.getComponent(RLTPlayer).updateInfo(userItem);
      } else {
        objPlayer.getComponent(RLTPlayer).hidePlayer();
      }
    }
  }

  private setTotalUserPlaying(totalUser: number) {
    this.otherPlayer.getComponent(RLTPlayer).renderNumberPlayer(totalUser);
  }

  private calcMoneyOfMeInDoor(infoMe: RouletteNetwork.User) {
    let listBetOfMe = infoMe.listBet;
    if (listBetOfMe) {
      let isBet = false;
      const pairsUser = this.getArrayListBet(listBetOfMe);
      pairsUser.forEach((pair) => {
        const [door, money] = pair.split(":");
        if (money > 0) {
          isBet = true;
        }
        var nDoor = this.getInfoDoorByTypePot(parseInt(door));
        this.listDetailMoneyOfMeInDoor[door].push({
          door: parseInt(door),
          money: parseInt(money),
        });
        this.listMoneyOfMeInDoor[door] += parseInt(money);
        this.listDetailTotalMoneyInDoor[door].push({
          door: parseInt(door),
          money: parseInt(money),
        });
        this.listTotalMoneyInDoor[door] += parseInt(money);
        this.throwPhinhFromMeToDoor(nDoor, parseInt(money));
      });
      if (isBet && this.bettingState) {
        this.activeBtnClearBet(this.canClearBet);
      }
    }
  }

  private calcMoneyOfUserInTableInDoor(
    listUserInTable: Array<RouletteNetwork.User>
  ) {
    for (let user of listUserInTable) {
      let nUser = this.getNodeUserInTable(user.userName);
      let listBet = user.listBet;
      if (listBet) {
        const pairsUser = this.getArrayListBet(listBet);
        pairsUser.forEach((pair) => {
          const [door, money] = pair.split(":");
          var nDoor = this.getInfoDoorByTypePot(parseInt(door));
          this.listDetailTotalMoneyInDoor[door].push({
            door: parseInt(door),
            money: parseInt(money),
          });
          this.listTotalMoneyInDoor[door] += parseInt(money);
          this.throwPhinhFromUserToDoor(nUser, nDoor, parseInt(money));
        });
      }
    }
  }

  private calcMoneyOfUserOutTableInDoor(listBetOfUserOutTable) {
    if (listBetOfUserOutTable) {
      let nUser = this.otherPlayer;
      const pairsUser = this.getArrayListBet(listBetOfUserOutTable);
      pairsUser.forEach((pair) => {
        const [door, money] = pair.split(":");
        var nDoor = this.getInfoDoorByTypePot(parseInt(door));
        this.listDetailTotalMoneyInDoor[door].push({
          door: parseInt(door),
          money: parseInt(money),
        });
        this.listTotalMoneyInDoor[door] += parseInt(money);
        this.throwPhinhFromUserToDoor(nUser, nDoor, parseInt(money));
      });
    }
  }

  public getArrayListBet(temp: string): Array<any> {
    const builder = [];
    const betPerPotArr = temp.split("/");
    betPerPotArr.forEach((betPerPotItem) => {
      const arr1 = betPerPotItem.split("&");
      if (arr1.length > 1) {
        const potId = arr1[0];
        const betChipArr = arr1[1].split(";");
        betChipArr.forEach((item2) => {
          if (item2) {
            const chip = item2.split(":");
            for (let i = 0; i < Number(chip[1]); i++) {
              builder.push(potId, ":", chip[0], ";");
            }
          }
        });
      }
    });
    let stringBet = builder.join("");
    if (stringBet.length > 0) {
      stringBet = stringBet.substring(0, stringBet.length - 1);
    }
    if (stringBet) {
      return stringBet.split(";");
    }
    return [];
  }

  public getArrayListBet2(temp: string): Array<any> {
    const builder = [];
    const betPerPotArr = temp.split("/");
    betPerPotArr.forEach((betPerPotItem) => {
      const arr1 = betPerPotItem.split("&");
      if (arr1.length > 1) {
        const potId = arr1[0];
        const betChipArr = arr1[1].split(";");
        betChipArr.forEach((item2) => {
          if (item2) {
            const chip = item2.split(":");
            builder.push(potId, ":", Number(chip[0]) * Number(chip[1]), ";");
          }
        });
      }
    });
    let stringBet = builder.join("");
    if (stringBet.length > 0) {
      stringBet = stringBet.substring(0, stringBet.length - 1);
    }
    if (stringBet) {
      return stringBet.split(";");
    }
    return [];
  }

  private renderMoneyInDoor(listMoneyInDoor: object, auraOn: boolean) {
    for (let door in listMoneyInDoor) {
      let money = listMoneyInDoor[door];
      let nDoor = this.getInfoDoorByTypePot(Number(door));
      if (nDoor) {
        nDoor.getComponent(RLTDoor).countBetChip(money, auraOn);
      } else {
        console.error("No door found");
      }
    }
  }

  private getInfoDoorByTypePot(typePot: number): cc.Node {
    for (let door of this.doors) {
      if (door.getComponent(RLTDoor).door === typePot) {
        return door;
      }
    }
    return null;
  }

  private initTempPlayer() {
    for (let i = 0; i < 7; i++) {
      let prfPlayer = cc.instantiate(this.prfPlayer);
      prfPlayer.getComponent(RLTPlayer).init(i);
      this.players.push(prfPlayer);
      this.pnPlayer.addChild(prfPlayer);
    }
    this.otherPlayer = this.pnPlayer.getChildByName("otherPlayer");
    this.playerMe = this.pnPlayer.getChildByName("playerMe");
  }

  private startEffectStartBet() {
    this.effectStartBet.node.active = true;
    this.effectStartBet.setAnimation(0, "animation", false);
    this.scheduleOnce(() => {
      this.effectStartBet.node.active = false;
    }, 3);
  }

  private isPlayerMe(nickName: string): boolean {
    return this.playerMe.getComponent(RLTPlayer).nickName === nickName;
  }

  private getNodeUserInTable(nickName: string): cc.Node {
    return this.players.find((nUser) => {
      return nUser.getComponent(RLTPlayer).nickName == nickName;
    });
  }

  private throwPhinhFromMeToDoor(nDoor: cc.Node, money: number) {
    let nUser = this.playerMe;
    this.throwPhinhFromUserToDoor(nUser, nDoor, money);
  }

  private throwPhinhFromUserToDoor(
    nUser: cc.Node,
    nDoor: cc.Node,
    money: number
  ): void {
    this.nSoundControler.playType(RLT_SOUND_TYPE.CHIP_BET);
    if (money > 0) {
      let nChipBet = cc.instantiate(this.prfChip);
      nChipBet.getComponent(RLTPhinh).setFaceMoney(money);
      nUser.getComponent(RLTPlayer).addChip(nChipBet);
      let arPoint = nDoor
        .getChildByName("Chip")
        .convertToWorldSpaceAR(cc.v2(0, 0));
      var posDoor = nUser.convertToNodeSpaceAR(arPoint);
      let posSlip = nDoor.getComponent(RLTDoor).getPosOfChip();
      let moneySet = this.showOnlyMe
        ? this.listMoneyOfMeInDoor[nDoor.getComponent(RLTDoor).door]
        : this.listTotalMoneyInDoor[nDoor.getComponent(RLTDoor).door];
      let status = this.showOnlyMe;
      cc.tween(nChipBet)
        .to(
          this.timePhinh,
          { position: cc.v3(posDoor.x + posSlip.x, posDoor.y + posSlip.y, 0) },
          { easing: "cubicInOut" }
        )
        .call(() => {
          nChipBet.removeFromParent(true);
          let auraOn = this.showOnlyMe ? true : false;
          if (status !== this.showOnlyMe) {
            moneySet = this.showOnlyMe
              ? this.listMoneyOfMeInDoor[nDoor.getComponent(RLTDoor).door]
              : this.listTotalMoneyInDoor[nDoor.getComponent(RLTDoor).door];
          }
          nDoor.getComponent(RLTDoor).countBetChip(moneySet, auraOn);
        })
        .start();
    }
  }

  toggleRltWheel() {
    if (this.rltOn == false) {
      this.spinningWheel.active = true;
      this.spinningWheel.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
      this.rltOn = true;
      this.scheduleOnce(() => RouletteWheel.instance.start_spin(), 1);
    } else {
      this.spinningWheel.runAction(cc.moveTo(0.5, cc.v2(0, 4000)));
      this.rltOn = false;
      this.scheduleOnce(() => {
        RouletteWheel.instance.stop_spin();
        RouletteWheel.instance.reset_roulette();
        RouletteWheel.instance.stop_spin();
        RouletteWheel.instance.hide_spin_results();
        this.spinningWheel.active = false;
      }, 3);
    }
  }

  renderRltHistoryNumber() {
    let length =
      this.winning_history.length < 9 ? this.winning_history.length : 9;
    for (let i = 0; i < length; i++) {
      this.rltHistory.children[i].active = true;
      this.rltHistory.children[i].children[0].getComponent(cc.Label).string =
        this.winning_history[i][0];

      if (this.red_numbers.indexOf(this.winning_history[i][0]) > -1) {
        this.rltHistory.children[i].color = new cc.Color().fromHEX("#DE1C1C");
      } else if (this.winning_history[i] == 0) {
        this.rltHistory.children[i].color = new cc.Color().fromHEX("#3A9828");
      } else {
        this.rltHistory.children[i].color = new cc.Color().fromHEX("#000000");
      }
    }
  }

  scrollBetLeft() {
    this.currentScroll -= this.stepScroll;
    if (this.currentScroll < 0) this.currentScroll = 0;
    this.chipViewContent.scrollToPercentHorizontal(this.currentScroll, 0.3);
  }

  scrollBetRight() {
    this.currentScroll += this.stepScroll;
    if (this.currentScroll > 1) this.currentScroll = 1;
    this.chipViewContent.scrollToPercentHorizontal(this.currentScroll, 0.3);
  }

  private initChat() {
    this.UI_Chat = cc.instantiate(this.prfChat);
    this.UI_Chat.zIndex = 999;
    this.UI_Chat.active = false;
    this.pnGame.addChild(this.UI_Chat);
  }

  private initWheel() {
    this.spinningWheel = cc.instantiate(this.wheelPrefab);
    this.spinningWheel.setPosition(cc.v2(0, 3000));
    this.spinningWheel.zIndex = 9999;
    this.pnGame.addChild(this.spinningWheel);
    this.spinningWheel.active = false;
  }

  private initGuide() {
    this.UI_Guide = cc.instantiate(this.pfGuide);
    this.UI_Guide.setPosition(cc.v2(0, 0));
    this.UI_Guide.zIndex = 999;
    this.pnGame.addChild(this.UI_Guide);
    this.UI_Guide.active = false;
  }

  private initSetting() {
    this.UI_Setting = cc.instantiate(this.pfSetting);
    this.UI_Setting.setPosition(cc.v2(0, 0));
    this.UI_Setting.zIndex = 999;
    this.pnGame.addChild(this.UI_Setting);
    this.UI_Setting.active = false;
  }

  private initListOtherPlayers() {
    this.UI_LOPS = cc.instantiate(this.pfLOPS);
    this.UI_LOPS.zIndex = 999;
    this.pnGame.addChild(this.UI_LOPS);
  }

  private activeBtnClearBet(isActive: boolean) {
    if (isActive) {
      this.btnClearBet.interactable = true;
      this.btnClearBet.node.opacity = 255;
    } else {
      this.btnClearBet.interactable = false;
      this.btnClearBet.node.opacity = 150;
    }
  }

  private updatebtnShowView() {
    if (this.showOnlyMe) {
      this.btnShowMe.interactable = false;
      this.btnShowAll.interactable = true;
      this.btnShowMe.node.opacity = 255;
      this.btnShowAll.node.opacity = 150;
      this.renderMoneyInDoor(this.listMoneyOfMeInDoor, true);
    } else {
      this.btnShowMe.interactable = true;
      this.btnShowAll.interactable = false;
      this.btnShowMe.node.opacity = 150;
      this.btnShowAll.node.opacity = 255;
      this.renderMoneyInDoor(this.listTotalMoneyInDoor, false);
    }
  }

  private receivePhinhFromDoorWinToUser(
    nUser: cc.Node,
    nDoor: cc.Node,
    money: number
  ) {
    if (nUser && nDoor && money > 0) {
      let door = cc.instantiate(this.prfDoor);
      door.getComponent(RLTDoor).countBetChip(money, false);
      nDoor.addChild(door);
      let arPoint = nUser.convertToWorldSpaceAR(cc.v2(0, 0));
      var posUser = nDoor.convertToNodeSpaceAR(arPoint);
      cc.tween(door)
        .to(
          this.timePhinh,
          { position: cc.v3(posUser.x, posUser.y, 0) },
          { easing: "cubicInOut" }
        )
        .call(() => {
          door.removeFromParent(true);
        })
        .start();
    }
  }

  private receivePhinhFromDoorWinToMe(nDoor: cc.Node, money: number) {
    this.receivePhinhFromDoorWinToUser(this.playerMe, nDoor, money);
  }

  private receivePhinhFromDoorWinToOther(nDoor: cc.Node, money: number) {
    this.receivePhinhFromDoorWinToUser(this.otherPlayer, nDoor, money);
  }

  private givePrizeForMe(infoMe: RouletteNetwork.User) {
    let listWinOfMe = infoMe.listWin;
    let totalMoneyWinOfMe = 0;
    if (listWinOfMe) {
      const pairsUser = listWinOfMe.split(";");
      pairsUser.forEach((pair) => {
        const [door, money] = pair.split(":");
        totalMoneyWinOfMe += parseInt(money);
        var nDoor = this.getInfoDoorByTypePot(parseInt(door));
        this.receivePhinhFromDoorWinToMe(nDoor, parseInt(money));
      });
      this.playerMe.getComponent(RLTPlayer).showPrize(totalMoneyWinOfMe);
      if (
        this.getVibrationStatus() &&
        cc.sys.isMobile &&
        cc.sys.os == cc.sys.OS_ANDROID
      ) {
        window.navigator.vibrate(1000);
      }
    }
  }

  private givePrizeForGuest(listUserInTable: Array<RouletteNetwork.User>) {
    for (let itemUser of listUserInTable) {
      var userGuest = this.getNodeUserInTable(itemUser.userName);
      let totalMoneyWinOfGuest = 0;
      if (userGuest) {
        var listWinOfGuest = itemUser.listWin;
        if (listWinOfGuest) {
          const pairsUser = listWinOfGuest.split(";");
          pairsUser.forEach((pair) => {
            const [door, money] = pair.split(":");
            totalMoneyWinOfGuest += parseInt(money);
            var nDoor = this.getInfoDoorByTypePot(parseInt(door));
            this.receivePhinhFromDoorWinToUser(
              userGuest,
              nDoor,
              parseInt(money)
            );
          });
          userGuest.getComponent(RLTPlayer).showPrize(totalMoneyWinOfGuest);
        }
      }
    }
  }

  private givePrizeForOther(listWin: string) {
    let totalMoneyWinOfOther = 0;
    if (listWin) {
      const pairsUser = listWin.split(";");
      pairsUser.forEach((pair) => {
        const [door, money] = pair.split(":");
        totalMoneyWinOfOther += parseInt(money);
        var nDoor = this.getInfoDoorByTypePot(parseInt(door));
        this.receivePhinhFromDoorWinToOther(nDoor, parseInt(money));
      });
      this.otherPlayer.getComponent(RLTPlayer).showPrize(totalMoneyWinOfOther);
    }
  }

  private handleReward(res: any) {
    let listUserInTable = res.listUserInTable;
    let winTypes = res.winTypes;
    let infoMe = res.infoMe;

    RLTDealer.instance.collectChip();
    this.nSoundControler.playType(RLT_SOUND_TYPE.CHIP_MOVE_DEALER);
    let arPointDealer = RLTDealer.instance.nChips.convertToWorldSpaceAR(
      cc.v2(0, 0)
    );
    let isChipLose = false;
    // Thu tiền cửa thua
    for (let i = 0; i < 160; i++) {
      let nDoorLose = this.getInfoDoorByTypePot(i);
      if (!_.includes(winTypes, i) && nDoorLose) {
        isChipLose = true;
        let objDoorLose = nDoorLose.getComponent(RLTDoor);
        let chips = _.clone(objDoorLose.getAllChipInDoor());
        objDoorLose.removeAllChipInDoor();
        objDoorLose.setMoneyInDoor(0);
        for (let j = 0; j < chips.length; j++) {
          let nChipLose = chips[j];
          this.listTotalMoneyInDoor[objDoorLose.door] -=
            RLTCommon.convert2Number(
              nChipLose.getChildByName("LbMoney").getComponent(cc.Label).string
            );
          objDoorLose.addChip(nChipLose, false);
          var posToDealer = nDoorLose.convertToNodeSpaceAR(arPointDealer);
          cc.tween(nChipLose)
            .to(
              this.timePhinh,
              { position: cc.v3(posToDealer.x, posToDealer.y, 0) },
              { easing: "cubicInOut" }
            )
            .call(() => {
              nChipLose.removeFromParent(true);
            })
            .start();
        }
      }
    }

    //Update lại list money
    if (infoMe.moneyWin > 0) {
      for (let i = 0; i < 160; i++) {
        let temp = this.listMoneyOfMeInDoor[i];
        if (!_.includes(winTypes, i) && temp > 0) {
          this.listMoneyOfMeInDoor[i] = 0;
        }
      }
    } else {
      this.initMoneyOfMeInDoor();
    }

    // Trả tiền cửa thắng
    this.scheduleOnce(() => {
      let isChipWin = false;
      this.nSoundControler.playType(RLT_SOUND_TYPE.CHIP_MOVE_TABLE);
      for (let k = 0; k < 160; k++) {
        let nDoorWin = this.getInfoDoorByTypePot(k);
        if (_.includes(winTypes, k) && nDoorWin) {
          isChipWin = true;
          let arPoint = nDoorWin.convertToWorldSpaceAR(cc.v2(0, 0));
          let chips = nDoorWin.getComponent(RLTDoor).getAllChipInDoor();
          for (let h = 0; h < chips.length; h++) {
            var posToDealerT =
              RLTDealer.instance.nChips.convertToNodeSpaceAR(arPoint);
            let money = chips[h].getComponent(RLTPhinh).money;
            if (money > 0) {
              let nChipWin = cc.instantiate(this.prfChip);
              nChipWin.getComponent(RLTPhinh).setFaceMoney(money);
              this.nDealer.getComponent(RLTDealer).addChip(nChipWin);
              cc.tween(nChipWin)
                .to(
                  this.timePhinh,
                  {
                    position: cc.v3(posToDealerT.x, posToDealerT.y, 0),
                  },
                  { easing: "cubicInOut" }
                )
                .call(() => {
                  nChipWin.removeFromParent(true);
                  let doorMoney = RLTCommon.convert2Number(
                    nDoorWin
                      .getComponent(RLTDoor)
                      .moneyInDoor.getComponent(cc.Label).string
                  );
                  let moneyTotal = doorMoney + money;
                  nDoorWin
                    .getComponent(RLTDoor)
                    .countBetChip(moneyTotal, false);
                  nDoorWin.getComponent(RLTDoor).setMoneyInDoor(0);
                  this.initMoneyOfMeInDoor();
                  this.initTotalMoneyInDoor();
                })
                .start();
            }
          }
        }
      }
      if (isChipWin) {
        this.btnTip.interactable = false;
        this.nDealer.getComponent(RLTDealer).win();
      }
    }, 1);

    this.scheduleOnce(() => {
      this.resetAllDoor();
      this.givePrizeForMe(infoMe);
      if (!this.showOnlyMe) {
        this.givePrizeForGuest(listUserInTable);
        this.givePrizeForOther(res.listWinUserOutTable);
      }
    }, 2);
  }

  private closeUIChat() {
    this.UI_Chat.active = false;
  }

  private closeTab() {
    this.tab.active = false;
    this.arrowDown.active = true;
  }

  public setVibrationStatus(status: boolean) {
    this.vibrationStatus = status;
  }

  public getVibrationStatus() {
    return this.vibrationStatus;
  }

  private showToast() {
    if (this.toast.string !== "") {
      this.toast.node.parent.active = true;
      this.scheduleOnce(() => {
        this.toast.node.parent.active = false;
      }, 3);
    }
  }

  public onSubmitBet(id: number) {
    RouletteNetwork.Send.sendRouletteBet(id, this.betChipValue);
    this.delayBet();
  }

  private delayBet() {
    this.offHighlight();
    this.scheduleOnce(() => {
      this.onHighlight();
    }, 0.25);
  }

  private highLight(door: number, status: boolean) {
    let nDoor = this.getInfoDoorByTypePot(door);
    nDoor.getComponent(RLTDoor).highlight(status);
  }

  public highLightEven(status: boolean) {
    for (let index = 1; index <= 36; index++) {
      let mod = index % 2;
      if (mod == 0) {
        let nDoor = this.getInfoDoorByTypePot(index);
        nDoor.getComponent(RLTDoor).highlight(status);
      }
    }
  }

  public highLightOdd(status: boolean) {
    for (let index = 1; index <= 36; index++) {
      let mod = index % 2;
      if (mod != 0) {
        let nDoor = this.getInfoDoorByTypePot(index);
        nDoor.getComponent(RLTDoor).highlight(status);
      }
    }
  }

  public highLightRed(status: boolean) {
    for (let i of this.arrRed) {
      let nDoor = this.getInfoDoorByTypePot(i);
      nDoor.getComponent(RLTDoor).highlight(status);
    }
  }

  public highLightBlack(status: boolean) {
    for (let i of this.arrBlack) {
      let nDoor = this.getInfoDoorByTypePot(i);
      nDoor.getComponent(RLTDoor).highlight(status);
    }
  }

  private onHighlight() {
    if (!this.isMobile) {
      for (let door of this.doors) {
        door.on(cc.Node.EventType.MOUSE_UP, this.onMouseUpDoor, this);
        door.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMoveDoor, this);
      }

      this.pnGame.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDownGame, this);
      this.pnGame.on(cc.Node.EventType.MOUSE_UP, this.onMouseUpGame, this);
      this.pnTable.on(
        cc.Node.EventType.MOUSE_MOVE,
        this.onMouseMoveTable,
        this
      );
    } else {
      for (let door of this.doors) {
        door.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        door.on(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        door.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
      }
    }
  }

  private offHighlight() {
    // this.isMouseDown = false;
    if (this.currentDoor) {
      this.currentDoor.getComponent(RLTDoor).highlight(false);
      this.currentDoor = null;
    }

    if (!this.isMobile) {
      for (let door of this.doors) {
        door.off(cc.Node.EventType.MOUSE_UP, this.onMouseUpDoor, this);
        door.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMoveDoor, this);
      }
      this.pnGame.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDownGame, this);
      this.pnGame.off(cc.Node.EventType.MOUSE_UP, this.onMouseUpGame, this);
      this.pnTable.off(
        cc.Node.EventType.MOUSE_MOVE,
        this.onMouseMoveTable,
        this
      );
    } else {
      for (let door of this.doors) {
        door.off(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        door.off(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        door.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
      }
    }
  }

  private onMouseDownGame(event) {
    // this.isMouseDown = true;
    this.checkClick();
  }

  private onMouseUpGame(event) {
    // this.isMouseDown = false;
    if (this.currentDoor) {
      this.currentDoor.getComponent(RLTDoor).highlight(false);
      this.currentDoor = null;
    }
  }

  private onMouseMoveDoor(event) {
    if (event.currentTarget) {
      if (this.currentDoor) {
        if (this.currentDoor != event.currentTarget) {
          this.currentDoor.getComponent(RLTDoor).highlight(false);
          this.currentDoor = event.currentTarget;
          this.currentDoor.getComponent(RLTDoor).highlight(true);
        }
      } else {
        this.currentDoor = event.currentTarget;
        this.currentDoor.getComponent(RLTDoor).highlight(true);
      }
    }
  }

  private onMouseMoveTable(event) {
    if (this.currentDoor) {
      if (event.currentTarget == this.pnTable) {
        this.currentDoor.getComponent(RLTDoor).highlight(false);
        this.currentDoor = null;
      }
    }
  }

  private onMouseUpDoor(event) {
    event.currentTarget.getComponent(RLTDoor).onClickBet();
  }

  private onTouchDown(event) {
    this.checkClick();
    if (event.currentTarget.getComponent(RLTDoor)) {
      this.currentDoor = event.currentTarget;
      this.currentDoor.getComponent(RLTDoor).highlight(true);
    }
  }

  private onTouchUp(event) {
    if (this.currentDoor) {
      this.currentDoor.getComponent(RLTDoor).onClickBet();
      this.currentDoor.getComponent(RLTDoor).highlight(false);
      this.currentDoor = null;
    }
  }

  private onTouchCancel(event) {
    if (this.currentDoor) {
      this.currentDoor.getComponent(RLTDoor).highlight(false);
      this.currentDoor = null;
    }
  }

  private initUserHistory() {
    this.UI_UserHistory = cc.instantiate(this.prbUserHistory);
    this.UI_UserHistory.setPosition(cc.v3(0, 0, 0));
    this.UI_UserHistory.zIndex = 999;
    this.pnGame.addChild(this.UI_UserHistory);
  }

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
}
