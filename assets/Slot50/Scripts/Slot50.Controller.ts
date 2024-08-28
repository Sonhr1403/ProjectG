
import { Slot50Connector } from "./Slot50.Connector";
import Slot50Setting from "./Slot50.Setting";
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50Jackpot from "./Slot50.Jackpot";
import Slot50Machine from "./Slot50.Machine";
import Slot50FreeGame from "./Slot50.FreeGame";
import Slot50BgPrize from "./Slot50.BgPrize";
import Slot50BgPumpkin from "./Slot50.BgPumpkin";
import Slot50JackpotMoney from "./Slot50.JackpotMoney";
import Slot50BgScreen from "./Slot50.BgScreen ";
import Slot50BgJackpotPrize from "./Slot50.BgJackpotPrize";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";
import Slot50Guide from "./Slot50.Guide";
import Slot50BgFreePrize from "./Slot50.BgFreePrize";
import Slot50Message from "./Slot50.Message";
import Slot50Common from "./Slot50.Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot50Controller extends cc.Component {
  public static instance: Slot50Controller = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Label)
  public lbBetAmount: cc.Label = null;

  @property(cc.Label)
  public lbNumberAutoSpin: cc.Label = null;

  @property(cc.Node)
  public nGame: cc.Node = null;

  @property(cc.Node)
  public nMenu: cc.Node = null;

  @property(cc.Node)
  public nAutoSpin: cc.Node = null;

  @property(cc.Node)
  public nMachine: cc.Node = null;

  @property(cc.Node)
  public nMessage: cc.Node = null;

  @property(cc.Node)
  public nModal: cc.Node = null;

  @property(cc.Node)
  public nBtnAutoSpin: cc.Node = null;

  @property(cc.Node)
  public nBtnSpin: cc.Node = null;

  @property(cc.Node)
  public nPumpSkin: cc.Node = null;

  @property(cc.Node)
  public nScreen: cc.Node = null;

  @property(cc.Node)
  public nTable: cc.Node = null;

  @property(Slot50SoundControler)
  public nSoundControler: Slot50SoundControler = null;

  @property(sp.Skeleton)
  public skeletonTotalBet: sp.Skeleton = null;

  @property(cc.Node)
  public nMiniJackpot: cc.Node = null;

  @property(cc.Node)
  public nMinorJackpot: cc.Node = null;

  @property(cc.Node)
  public nMajorJackpot: cc.Node = null;

  @property(cc.Node)
  public nGrandJackpot: cc.Node = null;

  @property(cc.Node)
  public nFreeGame: cc.Node = null;

  @property(cc.Node)
  public nInfoRoundFree: cc.Node = null;

  @property(cc.Label)
  public lbCurrentRoundFree: cc.Label = null;

  @property(cc.Label)
  public lbTotalRoundFree: cc.Label = null;

  @property(cc.Label)
  public lbProfitFree: cc.Label = null;

  @property(cc.Node)
  public nPrizeJackpot: cc.Node = null;

  @property(cc.Node)
  public nPrizeWin: cc.Node = null;

  @property(cc.Node)
  public nSetting: cc.Node = null;

  @property(cc.Node)
  public nGuide: cc.Node = null;

  @property(cc.Node)
  public nPrizeFreeGame: cc.Node = null;

  @property(cc.Node)
  public nJackpot: cc.Node = null;

  @property(cc.Prefab)
  public prfLbMoneyJackpot: cc.Prefab = null;

  @property(cc.Prefab)
  public prfTotalWin: cc.Prefab = null;

  @property(cc.Prefab)
  public prfJackpot: cc.Prefab = null;

  @property(cc.Node)
  public nTotalWin: cc.Node = null;

  @property(cc.Node)
  public spFirstLoading: cc.Node = null;

  @property(cc.Node)
  public nBtnMaxbet: cc.Node = null;

  @property(cc.Node)
  public nBtnPrevRoom: cc.Node = null;

  @property(cc.Node)
  public nBtnNextRoom: cc.Node = null;

  //////////////////////////////////
  public _scheduler = null;
  public _isGameActive: boolean = true;
  private hideTime: number = null;
  //////////////////////////////////
  private localRes5008: Slot50Cmd.SlotReceiveFreeGameResult = null;
  private localRes5006: Slot50Cmd.SlotReceiveJackpotResult = null;
  private localRes5004: Slot50Cmd.SlotReceiveRoundResult = null;
  private localIsAutoSpin: boolean = false;
  public localTypeSpin: number = 0; // quay cho linewin/freegame
  private localBalance: number = 0;
  private localBetAmount: number = 25000;
  private localFreeGameBetAmount: number = 25000;
  private localNumberAutoSpins: number = 0;
  private listRooms: Array<number> = [25000, 50000, 100000, 250000, 500000, 1000000];

  public isInRotation: boolean = false;
  public isForceStop: boolean = false;
  public isJackpotFinished: boolean = false;
  public localNumberOfSpins: number = 0;

  onLoad() {
    Slot50Controller.instance = this;
    this.initTempLbJackpot();
    this.activeNodeTable(true);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_LOGIN, this.responseLogin, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_JOIN_ROOM, this.responseJoinRoom, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_KICK_OUT, this.responseUserOut, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_GAME_INFO, this.responseReceiveSubcribeGame, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_JACKPOT_INFO, this.responseReceiveJackpotInfo, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_ROUND_RESULT, this.responseReceiveRotation, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_BET_FAILED, this.responseReceiveBetFailed, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_JACKPOT_RESULT, this.responseReceiveJackpotResult, this);
    Slot50Connector.instance.addCmdListener(Slot50Cmd.Cmd.CMD_SLOT_FREE_GAME_RESULT, this.responseReceiveFreeGame, this);
    Slot50Connector.instance.connect();
    this.nBtnSpin.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.nBtnSpin.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.nBtnSpin.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    this.hideMessage();
  }

  private initTempLbJackpot() {
    this.nMiniJackpot.removeAllChildren();
    let lbMiniJackpot = cc.instantiate(this.prfLbMoneyJackpot);
    lbMiniJackpot.setAnchorPoint(1, 0.5);
    this.nMiniJackpot.addChild(lbMiniJackpot);

    this.nMinorJackpot.removeAllChildren();
    let lbMinorJackpot = cc.instantiate(this.prfLbMoneyJackpot);
    lbMinorJackpot.setAnchorPoint(0, 0.5);
    this.nMinorJackpot.addChild(lbMinorJackpot);

    this.nMajorJackpot.removeAllChildren();
    let lbMajorJackpot = cc.instantiate(this.prfLbMoneyJackpot);
    lbMajorJackpot.setAnchorPoint(1, 0.5);
    this.nMajorJackpot.addChild(lbMajorJackpot);

    this.nGrandJackpot.removeAllChildren();
    let lbGrandJackpot = cc.instantiate(this.prfLbMoneyJackpot);
    lbGrandJackpot.setAnchorPoint(0, 0.5);
    this.nGrandJackpot.addChild(lbGrandJackpot);
  }

  private resetActiveStartGame() {
    this.activePrizeJackpot(false);
    this.activePrizeWin(false);
    this.nJackpot.active = false;
    this.nFreeGame.active = false;
    this.nInfoRoundFree.active = false;
    this.nPrizeWin.active = false;
    this.nSetting.active = false;
    this.nGuide.active = false;
    this.nPrizeFreeGame.active = false;
    this.nModal.active = false;
    this.spFirstLoading.active = true;
  }

  private activePrizeJackpot(isActive: boolean) {
    this.nPrizeJackpot.active = isActive;
  }

  ////////////////////////////////
  private holdDuration: number = 0;
  private isButtonPressed: boolean = false;
  private onTouchStart(event: cc.Event.EventTouch) {
    if (this.isInRotation) {
      this.isForceStop = (this.localTypeSpin == Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN);
    } else {
      Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
      this.isButtonPressed = true;
      this.holdDuration = 0;
      this.schedule(this.updateHoldDuration, 0.5);
    }
  }

  private onTouchEnd(event: cc.Event.EventTouch) {
    this.isButtonPressed = false;
    this.unschedule(this.updateHoldDuration);
    if (this.holdDuration < 2 && !this.isInRotation) {
      if (!this.localIsAutoSpin) {
        this.holdDuration = 0;
        this.localIsAutoSpin = false;
        this.switchTextAutoSpin(false);
        this.realySpin();
      }
    }
  }

  private onTouchCancel(event: cc.Event.EventTouch) {
    this.isButtonPressed = false;
    this.holdDuration = 0;
    this.unschedule(this.updateHoldDuration);
  }

  private updateHoldDuration() {
    if (this.isButtonPressed) {
      this.holdDuration++;
      if (this.holdDuration >= 1) {
        this.holdDuration = 0;
        this.isButtonPressed = false;
        this.showBtnRotationManual(false);
        this.activeNAutoSpin(true);
        this.switchTextAutoSpin(false);
      }
    }
  }

  onDestroy() {
    Slot50Connector.instance.disconnect();
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_LOGIN);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_EXITGAME);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_DISCONNECTED);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_KICK_OUT);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_GAME_INFO);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_JACKPOT_INFO);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_ROUND_RESULT);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_BET_FAILED);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_JACKPOT_RESULT);
    Slot50Connector.instance.removeCmdListener(this, Slot50Cmd.Cmd.CMD_SLOT_FREE_GAME_RESULT);
    cc.director.getScheduler().unscheduleUpdate(this);
  }

  protected start(): void {
    this._scheduler = window.setInterval(this.updateOffline.bind(this), 1000 / 60);
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
    this.resetJoinGame();
    this.resetActiveStartGame();
    this.initDataCells();
  }

  private resetJoinGame() {
    this.activeMenu(false);
    this.activeBtnAutoSpin(false);
    this.activeBtnSpin(true);
    this.switchTextBtnSpin(false);
    this.activeNAutoSpin(false);
  }

  protected onEnable(): void {
    Slot50Connector.instance.connect();
    this.nTable.on(cc.Node.EventType.TOUCH_START, this.onTouchNGame, this);
  }

  protected onDisable(): void {
    Slot50Connector.instance.disconnect();
    this.nTable.off(cc.Node.EventType.TOUCH_START, this.onTouchNGame, this);
  }
  // cycle end
  private onTouchNGame(touchEvent: any) {
    this.activeNAutoSpin(false);
    if (this.localIsAutoSpin) {
      // TODO
    } else {
      this.activeBtnSpin(true);
      this.switchTextBtnSpin(false);
    }
  }

  //Response Start
  private responseDisconnect(cmdId: any, data: Uint8Array) {
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT DISCONNECT: ", cmdId);
  }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveLogin();
    res.unpackData(data);

    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT LOGIN: ", cmdId);
    ////////////////////////////////////////////
    if(res.getError() == 0) {
      Slot50Cmd.Send.sendSlotJoinGame();
    } else {
      console.error("ERROR LOGIN:", res.getError())
      this.showModal("Connect fail.", 0);
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "JOIN ROOM", cmdId);
  }

  // 5002
  protected responseReceiveSubcribeGame(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveGameInfo();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "5002", cmdId, res);
    /////////////////////////
    this.localBetAmount = res.betAmount;
    this.localBalance = res.currentMoney;
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);
    this.lbBetAmount.string = BGUI.Utils.formatMoneyWithCommaOnly(res.betAmount);
    const params = { miniJackpot: res.miniJackpot, minorJackpot: res.minorJackpot, majorJackpot: res.majorJackpot, grandJackpot: res.grandJackpot }
    this.setRealTimeJackpot(params, false);
    this.resetSpinManual();
    this.totalRoundOld = 0;
    ////////////
    var timerStartGame = 0.5;
    this.scheduleOnce(() => {
      this.spFirstLoading.active = false;
    }, timerStartGame);
    ////////////
    this.nBtnMaxbet.active = !(this.localBetAmount == this.listRooms[5]);
    this.nBtnPrevRoom.active = !(this.localBetAmount == this.listRooms[0]);
    this.nBtnNextRoom.active = !(this.localBetAmount == this.listRooms[5]);
    /// Free game
    if (res.freeGameResult != null) {
      this.totalRoundOld = res.freeGameResult.totalRound;
      if (res.freeGameResult.option == Slot50Cmd.FREE_GAME_OPTION.OPTION_0) {
        // Hiện thị bảng chọn free game
        this.handleEffectStartFreeGame(null);
      } else {
        this.scheduleOnce(() => {
          this.sendFreeGame();
        }, timerStartGame)
      }
    }

    /// Jackpot
    if (res.jackpotResult != null) {
      let paramJackpot = {
        miniJackpot: res.jackpotResult.miniJackpot,
        minorJackpot: res.jackpotResult.minorJackpot,
        majorJackpot: res.jackpotResult.majorJackpot,
        grandJackpot: res.jackpotResult.grandJackpot
      }
      const params = { jackpot: paramJackpot, data: res.jackpotResult.slotData };
      this.nJackpot.getComponent(Slot50Jackpot).initJackpot(params);
      this.showJackpot(params);
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveUserOut();
    res.unpackData(data);
    ////////////////////////////////////////////
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT_RECEIVE_USER_OUT", cmdId, res);
    this.backToLobby();
  }

  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "5003", cmdId, res);
    ////////////////////////////////////////////
    const params = { miniJackpot: res.miniJackpot, minorJackpot: res.minorJackpot, majorJackpot: res.majorJackpot, grandJackpot: res.grandJackpot }
    this.setRealTimeJackpot(params, true);
    Slot50BgPumpkin.instance.changeJackpot(params);
  }

  private setRealTimeJackpot(data: Slot50Cmd.ImpItemJackpot, isEffect: boolean = false) {
    if (isEffect) {
      this.nMiniJackpot.children[0].getComponent(Slot50JackpotMoney).effectJackpot(data.miniJackpot);
      this.nMinorJackpot.children[0].getComponent(Slot50JackpotMoney).effectJackpot(data.minorJackpot);
      this.nMajorJackpot.children[0].getComponent(Slot50JackpotMoney).effectJackpot(data.majorJackpot);
      this.nGrandJackpot.children[0].getComponent(Slot50JackpotMoney).effectJackpot(data.grandJackpot);
    } else {
      this.nMiniJackpot.children[0].getComponent(Slot50JackpotMoney).init(data.miniJackpot);
      this.nMinorJackpot.children[0].getComponent(Slot50JackpotMoney).init(data.minorJackpot);
      this.nMajorJackpot.children[0].getComponent(Slot50JackpotMoney).init(data.majorJackpot);
      this.nGrandJackpot.children[0].getComponent(Slot50JackpotMoney).init(data.grandJackpot);
    }
  }

  // 5004
  public localDataCells: Array<Slot50Cmd.ImpItemCell> = [];
  public localDataFreeCells: Array<Slot50Cmd.ImpItemCell> = [];

  private initDataCells() {
    this.localDataCells = [];
    for (let i = 0; i < 15; i++) {
      let idIcon = Slot50Common.getRandomNumber(2, 13);
      let item = { index: i, id: idIcon, oldId: -2, highlight: false, isChange: false };
      this.localDataCells.push(item);
    }
    this.localDataFreeCells = this.localDataCells;
    Slot50Machine.instance.startUp(this.localDataCells, false);
  }

  protected responseReceiveRotation(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveRoundResult();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveRotation", cmdId, res);
    ////////////////////////////////////////////
    if (res.getError() != 0) {
      return;
    }
    this.nInfoRoundFree.active = false;
    Slot50BgPumpkin.instance.resetNewGame();
    this.localTypeSpin = Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN;
    this.localBetAmount = res.betAmount;
    this.localBalance = res.currentMoney;
    this.lbBetAmount.string = BGUI.Utils.formatMoneyWithCommaOnly(res.betAmount);
    this.nTotalWin.getComponent(Slot50JackpotMoney).showMoney(0);

    // res.result = [
    //   { "index": 0, "id": Slot50Cmd.DEFINE_CHARACTOR.SCATTER, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 1, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 2, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 3, "id": Slot50Cmd.DEFINE_CHARACTOR.SCATTER, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 4, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 5, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 6, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 7, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 8, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 9, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 10, "id": Slot50Cmd.DEFINE_CHARACTOR.RED_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 11, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 12, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 13, "id": Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 14, "id": Slot50Cmd.DEFINE_CHARACTOR.WILD, "oldId": Slot50Cmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false }
    // ];
    // res.amountProfit = 1000000;

    this.localRes5004 = res;
    this.localDataCells = res.result;
    Slot50Machine.instance.letGo(res.result, 0);
    // if (res.type == Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN) {
    //   this.realySpin();
    // } else {
    //   this.handleReward5004();
    // }
  }

  public handleEffectStartFreeGame(res: Slot50Cmd.SlotReceiveRoundResult) {
    this.scheduleOnce(() => {
      this.activeNodeTable(false);
      Slot50BgScreen.instance.runWolfStage();
      this.scheduleOnce(() => {
        this.activeNodeTable(false);
        Slot50BgScreen.instance.offFreeGame();
        this.nFreeGame.getComponent(Slot50FreeGame).showFreeGame();
      }, 4.5);
    }, 0);
  }

  public handlePrizeJackpot(res: Slot50Cmd.SlotReceiveRoundResult) {
    const params = {
      jackpot: { miniJackpot: res.miniJackpot, minorJackpot: res.minorJackpot, majorJackpot: res.majorJackpot, grandJackpot: res.grandJackpot },
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.showJackpot(params);
  }

  private showJackpot(params) {
    this.activeNodeTable(false);
    this.activeBtnSpin(true);
    this.scheduleOnce(() => {
      Slot50BgScreen.instance.runWolfStage();
      this.scheduleOnce(() => {
        this.activePrizeJackpot(true);
        this.nJackpot.getComponent(Slot50Jackpot).initJackpot(params);
      }, 4.5);
    }, 0);
  }

  public reward() {
    switch (this.localTypeSpin) {
      case Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN:
        this.handleReward5004();
        break;

      case Slot50Cmd.ROUND_RESULT_TYPE.FREE_GAME:
        this.handlePrizeFree5008();
        break;

      case Slot50Cmd.ROUND_RESULT_TYPE.JACKPOT:
        // TODO
        break;
    }
  }

  public handleReward5004() {
    let timerStartReward5004 = 0;
    let res: Slot50Cmd.SlotReceiveRoundResult = this.localRes5004;
    // Hiển thị tiền thắng
    this.nTotalWin.getComponent(Slot50JackpotMoney).showMoney(res.amountProfit);
    let data = this.showPrizeWin(res.amountProfit, this.localBetAmount);
    // Nếu không có show win
    if (data.typeWin <= 0) {
      // Nếu có tiền thưởng thì thêm giây hiển thị
      timerStartReward5004 += (res.amountProfit > 0) ? 2 : 0;
    } else {
      /// Thêm 9 giây để hiển thị win
      timerStartReward5004 += data.timer;
    }

    this.scheduleOnce(() => {
      // Cập nhật lại số dư
      this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);
      switch (res.type) {
        case Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN:
          this.actionNextSession(Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN);
          break;

        case Slot50Cmd.ROUND_RESULT_TYPE.FREE_GAME:
          this.handleEffectStartFreeGame(res);
          break;

        case Slot50Cmd.ROUND_RESULT_TYPE.JACKPOT:
          this.handlePrizeJackpot(res)
          break;
      }
    }, timerStartReward5004);
  }

  private handlePrizeFree5008() {
    let res: Slot50Cmd.SlotReceiveFreeGameResult = this.localRes5008;
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);
    let timerStartFreeGame = 0;
    if (res.currentRound <= 1) {
      this.totalRoundOld = res.totalRound;
    }

    ////
    if (res.amountProfit > 0) {
      this.scheduleOnce(() => {
        this.lbProfitFree.node.getComponent(Slot50JackpotMoney).showMoney(res.amountProfit);
        this.nTotalWin.getComponent(Slot50JackpotMoney).effectMoney(res.totalPot);
      }, timerStartFreeGame);
      timerStartFreeGame += 3;
    }

    ////
    if (this.totalRoundOld < res.totalRound) {
      this.totalRoundOld = res.totalRound;
      this.scheduleOnce(() => {
        this.nPrizeFreeGame.getComponent(Slot50BgFreePrize).show(res.totalRound, 1);
      }, timerStartFreeGame);
      timerStartFreeGame += 3;
    }

    ////
    if (res.currentRound >= res.totalRound) {
      this.scheduleOnce(() => {
        this.rewardFreeGame(res);
      }, timerStartFreeGame);
    } else {
      this.scheduleOnce(() => {
        this.sendFreeGame();
      }, timerStartFreeGame);
    }
  }

  private sendFreeGame() {
    this.resetStartFreeGame();
    Slot50Machine.instance.startUp(this.localDataFreeCells, true);
    Slot50Cmd.Send.sendStartFreeGame();
  }

  // Hien thị phần số tiền thắng đặc biệt
  private showPrizeWin(profit: number, localBetAmount: number): any {
    if (profit > 0) {
      let typeWin: number = this.nPrizeWin.getComponent(Slot50BgPrize).getAndShowTypeWin(profit, localBetAmount);
      let timer = 9;
      if (typeWin > 0) {
        this.scheduleOnce(() => {
          this.nPrizeWin.getComponent(Slot50BgPrize).hidden();
        }, timer);
      }
      return { typeWin: typeWin, timer: timer };
    }
    return { typeWin: 0, timer: 0 };
  }

  private activePrizeWin(isActive: boolean) {
    this.nPrizeWin.active = isActive;
  }

  private showJackpotWin(idJackpot: number, winMoney: number) {
    let timer = Slot50BgJackpotPrize.instance.showJackpot(idJackpot, winMoney);
    this.scheduleOnce(() => {
      Slot50BgJackpotPrize.instance.hidden();
      this.showWinForJackpot(winMoney);
    }, timer);
  }

  // Tiếp tục quay nếu là quay tự động / hiển thị nút quay cho người chơi
  private actionNextSession(type: number) {
    let timerNewSesion = 0;
    if (this.localNumberAutoSpins > 0 && this.localIsAutoSpin) {
      this.localNumberAutoSpins--;
      this.scheduleOnce(() => {
        this.lbNumberAutoSpin.string = this.localNumberAutoSpins.toString();
        this.realySpin();
      }, timerNewSesion);
    } else {
      this.resetSpinManual();
    }
  }

  private resetSpinManual() {
    this.localIsAutoSpin = false;
    this.localNumberAutoSpins = 0;
    this.localTypeSpin = 0;
    this.isInRotation = false;
    this.showBtnRotationManual(true);
  }

  public showBtnRotationManual(isShow: boolean) {
    if (this.localNumberAutoSpins > 0 && this.localIsAutoSpin) {
      this.activeBtnSpin(false);
    } else {
      if (isShow) {
        this.activeBtnSpin(true);
        this.switchTextBtnSpin(false);
      } else {
        this.activeBtnSpin(false);
        this.activeBtnAutoSpin(true);
      }
    }
  }

  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveBetFailed();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveBetFailed", cmdId, res);
    ////////////////////////////////////////////
    const error = res.getError();
    let message = Slot50LanguageMgr.getString("slot50.slot_error_1");
    switch (error) {
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;

      default:
        break;
    }
    this.handleForceStop(message, 3);
  }

  public handleForceStop(message: string, timerOut: number) {
    Slot50Machine.instance.forceStop(this.localDataCells);
    this.resetSpinManual();
    this.showModal(message, timerOut);
  }

  // 5006
  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveJackpotResult", cmdId, res);
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      return;
    }
    this.handleReceiveJackpotResult(res);
  }

  // 5006
  public handleReceiveJackpotResult(res: Slot50Cmd.SlotReceiveJackpotResult) {
    this.localRes5006 = res;
    this.localBalance = res.currentMoney;
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);

    // Ket thuc Jackpot
    this.isJackpotFinished = res.isFinished;
    const params = {
      jackpot: { miniJackpot: res.miniJackpot, minorJackpot: res.minorJackpot, majorJackpot: res.majorJackpot, grandJackpot: res.grandJackpot },
      data: res.data
    };
    this.nJackpot.getComponent(Slot50Jackpot).initJackpot(params);
    if (res.isFinished) {
      this.scheduleOnce(() => {
        this.activeNodeTable(true);
        this.nTotalWin.getComponent(Slot50JackpotMoney).showMoney(res.winMoney);
        this.nJackpot.getComponent(Slot50Jackpot).hidden();
        this.scheduleOnce(() => {
          if (res.idJackpot > 0) {
            this.showJackpotWin(res.idJackpot, res.winMoney);
          } else {
            this.showWinForJackpot(res.winMoney);
          }
        }, 0);
        this.isJackpotFinished = false;
      }, 3);
    }
  }

  private showWinForJackpot(winMoney: number) {
    let timer = 0;
    let data = this.showPrizeWin(winMoney, this.localBetAmount);
    if (data.typeWin > 0) {
      timer += data.timer;
    }
    this.scheduleOnce(() => {
      this.actionNextSession(Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN);
    }, timer);
  }

  // 5008
  protected responseReceiveFreeGame(cmdId: any, data: Uint8Array) {
    let res = new Slot50Cmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveFreeGame", cmdId, res);
    ////////////////////////////////////////////
    this.localTypeSpin = Slot50Cmd.ROUND_RESULT_TYPE.FREE_GAME;
    this.resetStartFreeGame();
    if (res.getError() == 0) {
      this.localRes5008 = res;
      this.handleReceiveFreeGameResult(res);
    } else {
      this.localDataFreeCells = (this.localDataFreeCells.length > 0) ? this.localDataFreeCells : this.localDataCells;
      Slot50Machine.instance.forceStop(this.localDataFreeCells);
      this.showModal(Slot50LanguageMgr.getString("slot50.slot_error_1"), 3);
    }
  }

  private resetStartFreeGame() {
    this.activeNAutoSpin(false);
    this.activeBtnSpin(false);
    this.activeBtnAutoSpin(false);
    this.localRes5008 = null;
  }

  private totalRoundOld: number = 0;

  public handleReceiveFreeGameResult(res: Slot50Cmd.SlotReceiveFreeGameResult) {
    if (res.error == 0) {
      this.lbProfitFree.string = "";
      this.lbCurrentRoundFree.string = res.currentRound.toString();
      this.lbTotalRoundFree.string = res.totalRound.toString();
      this.nInfoRoundFree.active = true;
      this.localFreeGameBetAmount = res.betAmount;
      this.localBalance = res.currentMoney;
      if (res.currentRound == 0) {
        this.localDataFreeCells = this.localDataCells;
        this.sendFreeGame();
      } else {
        if (res.currentRound <= res.totalRound) {
          this.localDataFreeCells = res.result;
          Slot50Machine.instance.letGo(res.result, res.type);
        }
      }
    }
  }

  public rewardFreeGame(res: Slot50Cmd.SlotReceiveFreeGameResult) {
    this.scheduleOnce(() => {
      this.nInfoRoundFree.active = false;
      this.activeNodeTable(false);
      Slot50BgScreen.instance.runWolfFinish();
      this.scheduleOnce(() => {
        this.activeNodeTable(true);
        Slot50BgScreen.instance.offFreeGame();
        const timer = this.nPrizeFreeGame.getComponent(Slot50BgFreePrize).show(res.totalPot, 2);
        this.scheduleOnce(() => {
          this.totalRoundOld = 0;
          this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);
          this.actionNextSession(Slot50Cmd.ROUND_RESULT_TYPE.LINE_WIN);
        }, timer);
      }, 3.6);
    }, 0);
  }

  private showMessage(message: string) {
    this.nMessage.children[0].getComponent(cc.Label).string = message;
    cc.tween(this.nMessage).to(0.25, { scaleX: 1 }).delay(4).to(0.25, { scaleX: 0 }).start();
  }

  private showModal(message: string, timerOut: number) {
    this.nModal.getComponent(Slot50Message).show(message, timerOut);
  }

  private hideMessage() {
    cc.tween(this.nMessage).to(1, { scaleX: 0 }).start()
  }

  public activeNodeTable(isActive: boolean) {
    this.nTable.active = isActive;
  }

  private backToLobby() {
    Slot50Connector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }

  //// Quay line win
  private realySpin() {
    if (this.localBalance >= this.localBetAmount) {
      this.isForceStop = false;
      if (this.localIsAutoSpin) {
        this.activeBtnSpin(false);
        this.activeBtnAutoSpin(true);
        this.switchTextAutoSpin(true);
      } else {
        this.activeBtnSpin(true);
        this.activeBtnAutoSpin(false);
        this.switchTextBtnSpin(true);
      }
      Slot50Controller.instance.isInRotation = true;
      Slot50Machine.instance.startUp(this.localDataCells, true);
      Slot50Cmd.Send.sendSlotBet(this.localBetAmount);
    }
  }

  protected onClickMenu(event, data) {
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.nMenu.active = !this.nMenu.active;
  }

  protected onClickGuide(event, data) {
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.nGuide.getComponent(Slot50Guide).show(1);
    this.activeMenu(false);
  }

  protected onClickSetting(event, data) {
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.nSetting.getComponent(Slot50Setting).show();
    this.activeMenu(false);
  }

  protected onClickMaxBet(event, data) {
    var objBtn = event.target.getComponent(cc.Button);
    objBtn.interactable = false;
    this.scheduleOnce(() => {
      objBtn.interactable = true;
    }, 1);
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    this.activeBtnAutoSpin(false);
    if (this.localBalance >= this.listRooms[5]) {
      this.skeletonTotalBet.setAnimation(0, "animation", false);
      this.localBetAmount = this.listRooms[5];
      Slot50Cmd.Send.sendSlotJoinGame(this.listRooms[5]);
    } else {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_03"));
    }
  }

  protected onClickStopAutoSpin(event, data) {
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.localIsAutoSpin = false;
    this.activeNAutoSpin(false);
    this.activeBtnAutoSpin(false);
    this.activeBtnSpin(true);
    this.switchTextBtnSpin(false);
    this.switchTextAutoSpin(false);
    this.localNumberAutoSpins = 0;
    this.holdDuration = 0;
    this.isButtonPressed = false;
    var objBtn = event.target.getComponent(cc.Button);
    objBtn.interactable = false;
    this.scheduleOnce(() => {
      objBtn.interactable = true;
    }, 0.15);
  }

  protected onClickAutoSpin(event, data) {
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    this.localNumberAutoSpins = parseInt(data);
    this.localIsAutoSpin = true;
    this.activeBtnAutoSpin(false);
    this.activeNAutoSpin(false);
    this.switchTextAutoSpin(true);
    this.lbNumberAutoSpin.string = this.localNumberAutoSpins.toString();
    this.realySpin();
  }

  protected onClickPrevRoom(event, data) {
    var objBtn = event.target.getComponent(cc.Button);
    objBtn.interactable = false;
    this.scheduleOnce(() => {
      objBtn.interactable = true;
    }, 0.5);
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    let index = this.listRooms.indexOf(this.localBetAmount);
    if (index > 0 && index <= 5) {
      this.skeletonTotalBet.setAnimation(0, "animation", false);
      Slot50Cmd.Send.sendSlotJoinGame(this.listRooms[index - 1]);
    }
  }

  protected onClickNextRoom(event, data) {
    var objBtn = event.target.getComponent(cc.Button);
    objBtn.interactable = false;
    this.scheduleOnce(() => {
      objBtn.interactable = true;
    }, 0.5);
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(Slot50LanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    let index = this.listRooms.indexOf(this.localBetAmount);
    if (index >= 0 && index < 5) {
      this.skeletonTotalBet.setAnimation(0, "animation", false);
      Slot50Cmd.Send.sendSlotJoinGame(this.listRooms[index + 1]);
    }
  }

  protected onClickJackpot(event, data) {
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    Slot50Cmd.Send.sendOpenJackpot(parseInt(data));
  }

  private activeMenu(isActive: boolean) {
    this.nMenu.active = isActive;
  }

  private activeBtnSpin(isActive: boolean) {
    this.nBtnSpin.active = isActive;
  }

  private activeBtnAutoSpin(isActive: boolean) {
    this.nBtnAutoSpin.active = isActive;
  }

  private activeNAutoSpin(isActive: boolean) {
    this.nAutoSpin.active = isActive;
  }

  private switchTextBtnSpin(isStop: boolean) {
    if (isStop) {
      this.nBtnSpin.children[0].active = true;
      this.nBtnSpin.children[1].active = false;
      this.nBtnSpin.children[2].active = false;
    } else {
      this.nBtnSpin.children[0].active = false;
      this.nBtnSpin.children[1].active = true;
      this.nBtnSpin.children[2].active = true;
    }
  }

  private switchTextAutoSpin(isStop: boolean) {
    if (isStop) {
      this.nBtnAutoSpin.children[0].active = true;
      this.nBtnAutoSpin.children[1].active = false;
      this.nBtnAutoSpin.children[2].active = true;
    } else {
      this.nBtnAutoSpin.children[0].active = false;
      this.nBtnAutoSpin.children[1].active = true;
      this.nBtnAutoSpin.children[2].active = false;
    }
  }

  /////////////////// DMZ /////////////////////////
  ///////////////////////////////////////////
  updateOffline() {
    if (!this._isGameActive) {
      if (cc.sys.isBrowser) {
        cc.director.mainLoop();
      }
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
  ////////////////////////////////////////////
  ///////////////////////////////////////////
}
