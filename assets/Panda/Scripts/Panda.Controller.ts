
import { PandaConnector } from "./Panda.Connector";
import PandaSetting from "./Panda.Setting";
import { PandaCmd } from "./Panda.Cmd";
import PandaJackpot from "./Panda.Jackpot";
import PandaMachine from "./Panda.Machine";
import PandaFreeGame from "./Panda.FreeGame";
import PandaBgPrize from "./Panda.BgPrize";
import PandaBgPumpkin from "./Panda.BgPumpkin";
import PandaJackpotMoney from "./Panda.JackpotMoney";
import PandaBgScreen from "./Panda.BgScreen";
import PandaBgJackpotPrize from "./Panda.BgJackpotPrize";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";
import PandaGuide from "./Panda.Guide";
import PandaBgFreePrize from "./Panda.BgFreePrize";
import PandaMessage from "./Panda.Message";
import PandaCommon from "./Panda.Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PandaController extends cc.Component {
  public static instance: PandaController = null;

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
  public pnAutoSpin: cc.Node = null;

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

  @property(PandaSoundControler)
  public nSoundControler: PandaSoundControler = null;

  @property(sp.Skeleton)
  public skeletonTotalBet: sp.Skeleton = null;

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

  @property(cc.Node)
  public lbTotalWin: cc.Node = null;

  @property(cc.Node)
  public lbMiniJackpot: cc.Node = null;

  @property(cc.Node)
  public lbMinorJackpot: cc.Node = null;

  @property(cc.Node)
  public lbMajorJackpot: cc.Node = null;

  @property(cc.Node)
  public lbGrandJackpot: cc.Node = null;

  //////////////////////////////////
  public _scheduler = null;
  public _isGameActive: boolean = true;
  private hideTime: number = null;
  //////////////////////////////////
  private localRes5008: PandaCmd.SlotReceiveFreeGameResult = null;
  private localRes5006: PandaCmd.SlotReceiveJackpotResult = null;
  private localRes5004: PandaCmd.SlotReceiveRoundResult = null;
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
    PandaController.instance = this;
    this.activeNodeTable(true);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_LOGIN, this.responseLogin, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_JOIN_ROOM, this.responseJoinRoom, this);
    // PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_EXITGAME, this.responseDisconnect, this);
    // PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_DISCONNECTED, this.responseDisconnect, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_KICK_OUT, this.responseUserOut, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_GAME_INFO, this.responseReceiveSubcribeGame, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_JACKPOT_INFO, this.responseReceiveJackpotInfo, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_ROUND_RESULT, this.responseReceiveRotation, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_BET_FAILED, this.responseReceiveBetFailed, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_JACKPOT_RESULT, this.responseReceiveJackpotResult, this);
    PandaConnector.instance.addCmdListener(PandaCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT, this.responseReceiveFreeGame, this);
    PandaConnector.instance.connect();
    this.nBtnSpin.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.nBtnSpin.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.nBtnSpin.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    this.hideMessage();
  }

  private activePrizeJackpot(isActive: boolean) {
    this.nPrizeJackpot.active = isActive;
  }

  ////////////////////////////////
  private holdDuration: number = 0;
  private isButtonPressed: boolean = false;
  private onTouchStart(event: cc.Event.EventTouch) {
    if (this.isInRotation) {
      this.isForceStop = (this.localTypeSpin == PandaCmd.ROUND_RESULT_TYPE.LINE_WIN);
    } else {
      PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
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
        this.activePnAutoSpin(true);
        this.switchTextAutoSpin(false);
      }
    }
  }

  onDestroy() {
    PandaConnector.instance.disconnect();
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_LOGIN);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_EXITGAME);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_DISCONNECTED);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_KICK_OUT);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_GAME_INFO);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_JACKPOT_INFO);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_ROUND_RESULT);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_BET_FAILED);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_JACKPOT_RESULT);
    PandaConnector.instance.removeCmdListener(this, PandaCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT);
    cc.director.getScheduler().unscheduleUpdate(this);
  }

  protected start(): void {
    this._scheduler = window.setInterval(this.updateOffline.bind(this), 1000 / 60);
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
    this.resetActiveStartGame();
    this.initDataCells();
  }

  private resetActiveStartGame() {
    this.activeMenu(false);
    this.activeBtnAutoSpin(false);
    this.activeBtnSpin(true);
    this.switchTextBtnSpin(false);
    this.activePnAutoSpin(false);
    this.activePrizeJackpot(false);
    this.activePrizeWin(false);
    this.nJackpot.active = false;
    this.nFreeGame.active = false;
    this.nInfoRoundFree.active = false;
    this.nPrizeWin.active = false;
    this.nPrizeFreeGame.active = false;
    this.nModal.active = false;
    this.nSetting.active = false;
    this.nGuide.active = false;
  }

  protected onEnable(): void {
    PandaConnector.instance.connect();
    this.nTable.on(cc.Node.EventType.TOUCH_START, this.onTouchNGame, this);
  }

  protected onDisable(): void {
    PandaConnector.instance.disconnect();
    this.nTable.off(cc.Node.EventType.TOUCH_START, this.onTouchNGame, this);
  }
  // cycle end
  private onTouchNGame(touchEvent: any) {
    this.activePnAutoSpin(false);
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
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT LOGIN: ", cmdId);
    ////////////////////////////////////////////
    this.localBetAmount = 25000;
    PandaCmd.Send.sendSlotJoinGame(this.localBetAmount);
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "JOIN ROOM", cmdId);
  }

  // 5002
  protected responseReceiveSubcribeGame(cmdId: any, data: Uint8Array) {
    let res = new PandaCmd.SlotReceiveGameInfo();
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
    /// Free game
    if (res.freeGameResult != null) {
      this.totalRoundOld = res.freeGameResult.totalRound;
      if (res.freeGameResult.option == PandaCmd.FREE_GAME_OPTION.OPTION_0) {
        // Hiện thị bảng chọn free game
        this.handleEffectStartFreeGame(null);
      } else {
        this.scheduleOnce(() => {
          this.sendFreeGame();
        }, 0.5)
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
      this.nJackpot.getComponent(PandaJackpot).initJackpot(params);
      this.showJackpot(params);
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new PandaCmd.SlotReceiveUserOut();
    res.unpackData(data);
    ////////////////////////////////////////////
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT_RECEIVE_USER_OUT", cmdId, res);
    this.backToLobby();
  }

  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new PandaCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "5003", cmdId, res);
    ////////////////////////////////////////////
    const params = { miniJackpot: res.miniJackpot, minorJackpot: res.minorJackpot, majorJackpot: res.majorJackpot, grandJackpot: res.grandJackpot }
    this.setRealTimeJackpot(params, true);
    PandaBgPumpkin.instance.changeJackpot(params);
  }

  private setRealTimeJackpot(data: PandaCmd.ImpItemJackpot, isEffect: boolean = false) {
    if (isEffect) {
      this.lbMiniJackpot.getComponent(PandaJackpotMoney).effectJackpot(data.miniJackpot);
      this.lbMinorJackpot.getComponent(PandaJackpotMoney).effectJackpot(data.minorJackpot);
      this.lbMajorJackpot.getComponent(PandaJackpotMoney).effectJackpot(data.majorJackpot);
      this.lbGrandJackpot.getComponent(PandaJackpotMoney).effectJackpot(data.grandJackpot);
    } else {
      this.lbMiniJackpot.getComponent(PandaJackpotMoney).init(data.miniJackpot);
      this.lbMinorJackpot.getComponent(PandaJackpotMoney).init(data.minorJackpot);
      this.lbMajorJackpot.getComponent(PandaJackpotMoney).init(data.majorJackpot);
      this.lbGrandJackpot.getComponent(PandaJackpotMoney).init(data.grandJackpot);
    }
  }

  // 5004
  public localDataCells: Array<PandaCmd.ImpItemCell> = [];
  public localDataFreeCells: Array<PandaCmd.ImpItemCell> = [];

  private initDataCells() {
    this.localDataCells = [];
    for (let i = 0; i < 15; i++) {
      let idIcon = PandaCommon.getRandomNumber(2, 13);
      let item = { index: i, id: idIcon, oldId: -2, highlight: false, isChange: false };
      this.localDataCells.push(item);
    }
    this.localDataFreeCells = this.localDataCells;
    PandaMachine.instance.letGoFake(this.localDataCells, false);
  }

  protected responseReceiveRotation(cmdId: any, data: Uint8Array) {
    let res = new PandaCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveRotation", cmdId, res);
    ////////////////////////////////////////////
    if (res.getError() != 0) {
      return;
    }
    this.nInfoRoundFree.active = false;
    PandaBgPumpkin.instance.resetNewGame();
    this.localTypeSpin = PandaCmd.ROUND_RESULT_TYPE.LINE_WIN;
    this.localBetAmount = res.betAmount;
    this.localBalance = res.currentMoney;
    this.lbBetAmount.string = BGUI.Utils.formatMoneyWithCommaOnly(res.betAmount);
    this.lbTotalWin.getComponent(PandaJackpotMoney).showMoney(0);

    let listForm = [[0, 5, 10], [1, 6, 11], [2, 7, 12], [3, 8, 13], [4, 9, 14]];
    // res.result = [
    //   { "index": 0, "id": PandaCmd.DEFINE_CHARACTOR.SCATTER, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 1, "id": PandaCmd.DEFINE_CHARACTOR.SCATTER, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 2, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 3, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 4, "id": PandaCmd.DEFINE_CHARACTOR.SCATTER, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 5, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 6, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 7, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 8, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 9, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 10, "id": PandaCmd.DEFINE_CHARACTOR.RED_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 11, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 12, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 13, "id": PandaCmd.DEFINE_CHARACTOR.BLUE_SATAN, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false },
    //   { "index": 14, "id": PandaCmd.DEFINE_CHARACTOR.WILD, "oldId": PandaCmd.DEFINE_CHARACTOR.WILD, "highlight": true, "isChange": false }
    // ];
    // res.amountProfit = 1000000;

    this.localRes5004 = res;
    this.localDataCells = res.result;
    PandaMachine.instance.letGo(res.result, 0);
    // if (res.type == PandaCmd.ROUND_RESULT_TYPE.LINE_WIN) {
    //   this.realySpin();
    // } else {
    //   this.handleReward5004();
    // }
  }

  public handleEffectStartFreeGame(res: PandaCmd.SlotReceiveRoundResult) {
    this.scheduleOnce(() => {
      this.activeNodeTable(false);
      PandaBgScreen.instance.runWolfStage();
      this.scheduleOnce(() => {
        this.activeNodeTable(false);
        PandaBgScreen.instance.offFreeGame();
        this.nFreeGame.getComponent(PandaFreeGame).showFreeGame();
      }, 4.5);
    }, 0);
  }

  public handlePrizeJackpot(res: PandaCmd.SlotReceiveRoundResult) {
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
      PandaBgScreen.instance.runWolfStage();
      this.scheduleOnce(() => {
        this.activePrizeJackpot(true);
        this.nJackpot.getComponent(PandaJackpot).initJackpot(params);
      }, 4.5);
    }, 0);
  }

  public reward() {
    switch (this.localTypeSpin) {
      case PandaCmd.ROUND_RESULT_TYPE.LINE_WIN:
        this.handleReward5004();
        break;

      case PandaCmd.ROUND_RESULT_TYPE.FREE_GAME:
        this.handlePrizeFree5008();
        break;

      case PandaCmd.ROUND_RESULT_TYPE.JACKPOT:
        // TODO
        break;
    }
  }

  public handleReward5004() {
    let timerStartReward5004 = 0;
    let res: PandaCmd.SlotReceiveRoundResult = this.localRes5004;
    // Hiển thị tiền thắng
    this.lbTotalWin.getComponent(PandaJackpotMoney).showMoney(res.amountProfit);
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
        case PandaCmd.ROUND_RESULT_TYPE.LINE_WIN:
          this.actionNextSession(PandaCmd.ROUND_RESULT_TYPE.LINE_WIN);
          break;

        case PandaCmd.ROUND_RESULT_TYPE.FREE_GAME:
          this.handleEffectStartFreeGame(res);
          break;

        case PandaCmd.ROUND_RESULT_TYPE.JACKPOT:
          this.handlePrizeJackpot(res)
          break;
      }
    }, timerStartReward5004);
  }

  private handlePrizeFree5008() {
    let res: PandaCmd.SlotReceiveFreeGameResult = this.localRes5008;
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);
    let timerStartFreeGame = 0;
    if (res.currentRound <= 1) {
      this.totalRoundOld = res.totalRound;
    }

    ////
    if (res.amountProfit > 0) {
      this.scheduleOnce(() => {
        this.lbProfitFree.node.getComponent(PandaJackpotMoney).showMoney(res.amountProfit);
        this.lbTotalWin.getComponent(PandaJackpotMoney).effectMoney(res.totalPot);
      }, timerStartFreeGame);
      timerStartFreeGame += 3;
    }

    ////
    if (this.totalRoundOld < res.totalRound) {
      this.totalRoundOld = res.totalRound;
      this.scheduleOnce(() => {
        this.nPrizeFreeGame.getComponent(PandaBgFreePrize).show(res.totalRound, 1);
      }, timerStartFreeGame);
      timerStartFreeGame += 4;
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
    PandaMachine.instance.letGoFake(this.localDataFreeCells, true);
    PandaCmd.Send.sendStartFreeGame();
  }

  // Hien thị phần số tiền thắng đặc biệt
  private showPrizeWin(profit: number, localBetAmount: number): any {
    if (profit > 0) {
      let typeWin: number = this.nPrizeWin.getComponent(PandaBgPrize).getAndShowTypeWin(profit, localBetAmount);
      let timer = 9;
      if (typeWin > 0) {
        this.scheduleOnce(() => {
          this.nPrizeWin.getComponent(PandaBgPrize).hidden();
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
    let timer = PandaBgJackpotPrize.instance.showJackpot(idJackpot, winMoney);
    this.scheduleOnce(() => {
      PandaBgJackpotPrize.instance.hidden();
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
    let res = new PandaCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveBetFailed", cmdId, res);
    ////////////////////////////////////////////
    const error = res.getError();
    let message = PandaLanguageMgr.getString("slot50.slot_error_1");
    // switch (error) {
    //   case 1:

    //     break;
    //   case 2:

    //     break;
    //   case 3:

    //     break;
    //   case 4:

    //     break;

    //   default:
    //     break;
    // }
    this.handleForceStop(message, 3);
  }

  public handleForceStop(message: string, timerOut: number) {
    PandaMachine.instance.forceStop(this.localDataCells);
    this.resetSpinManual();
    this.showModal(message, timerOut);
  }

  // 5006
  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new PandaCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveJackpotResult", cmdId, res);
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      return;
    }
    this.handleReceiveJackpotResult(res);
  }

  // 5006
  public handleReceiveJackpotResult(res: PandaCmd.SlotReceiveJackpotResult) {
    this.localRes5006 = res;
    this.localBalance = res.currentMoney;
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);

    // Ket thuc Jackpot
    this.isJackpotFinished = res.isFinished;
    const params = {
      jackpot: { miniJackpot: res.miniJackpot, minorJackpot: res.minorJackpot, majorJackpot: res.majorJackpot, grandJackpot: res.grandJackpot },
      data: res.data
    };
    this.nJackpot.getComponent(PandaJackpot).initJackpot(params);
    if (res.isFinished) {
      this.nJackpot.getComponent(PandaJackpot).handleJackpotFinish();
      this.scheduleOnce(() => {
        this.activeNodeTable(true);
        this.lbTotalWin.getComponent(PandaJackpotMoney).showMoney(res.winMoney);
        this.nJackpot.getComponent(PandaJackpot).hidden();
        this.scheduleOnce(() => {
          if (res.idJackpot > 0) {
            this.showJackpotWin(res.idJackpot, res.winMoney);
          } else {
            this.showWinForJackpot(res.winMoney);
          }
        }, 0);
        this.isJackpotFinished = false;
      }, 4);
    }
  }

  private showWinForJackpot(winMoney: number) {
    let timer = 0;
    let data = this.showPrizeWin(winMoney, this.localBetAmount);
    if (data.typeWin > 0) {
      timer += data.timer;
    }
    this.scheduleOnce(() => {
      this.actionNextSession(PandaCmd.ROUND_RESULT_TYPE.LINE_WIN);
    }, timer);
  }

  // 5008
  protected responseReceiveFreeGame(cmdId: any, data: Uint8Array) {
    let res = new PandaCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "responseReceiveFreeGame", cmdId, res);
    ////////////////////////////////////////////
    this.localTypeSpin = PandaCmd.ROUND_RESULT_TYPE.FREE_GAME;
    this.resetStartFreeGame();
    if (res.getError() == 0) {
      this.localRes5008 = res;
      this.handleReceiveFreeGameResult(res);
    } else {
      this.localDataFreeCells = (this.localDataFreeCells.length > 0) ? this.localDataFreeCells : this.localDataCells;
      PandaMachine.instance.forceStop(this.localDataFreeCells);
      this.showModal(PandaLanguageMgr.getString("slot50.slot_error_1"), 3);
    }
  }

  private resetStartFreeGame() {
    this.activePnAutoSpin(false);
    this.activeBtnSpin(false);
    this.activeBtnAutoSpin(false);
    this.localRes5008 = null;
  }

  private totalRoundOld: number = 0;

  public handleReceiveFreeGameResult(res: PandaCmd.SlotReceiveFreeGameResult) {
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
          PandaMachine.instance.letGo(res.result, res.type);
        }
      }
    }
  }

  public rewardFreeGame(res: PandaCmd.SlotReceiveFreeGameResult) {
    this.scheduleOnce(() => {
      this.nInfoRoundFree.active = false;
      this.activeNodeTable(false);
      PandaBgScreen.instance.runWolfFinish();
      this.scheduleOnce(() => {
        this.activeNodeTable(true);
        PandaBgScreen.instance.offFreeGame();
        const timer = this.nPrizeFreeGame.getComponent(PandaBgFreePrize).show(res.totalPot, 2);
        this.scheduleOnce(() => {
          this.totalRoundOld = 0;
          this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(res.currentMoney);
          this.actionNextSession(PandaCmd.ROUND_RESULT_TYPE.LINE_WIN);
        }, timer);
      }, 3.6);
    }, 0);
  }

  private showMessage(message: string) {
    this.nMessage.children[0].getComponent(cc.Label).string = message;
    cc.tween(this.nMessage).to(0.25, { scaleX: 1 }).delay(4).to(0.25, { scaleX: 0 }).start();
  }

  private showModal(message: string, timerOut: number) {
    this.nModal.getComponent(PandaMessage).show(message, timerOut);
  }

  private hideMessage() {
    cc.tween(this.nMessage).to(1, { scaleX: 0 }).start()
  }

  public activeNodeTable(isActive: boolean) {
    this.nTable.active = isActive;
  }

  private backToLobby() {
    PandaConnector.instance.disconnect();
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
      PandaController.instance.isInRotation = true;
      PandaMachine.instance.letGoFake(this.localDataCells, true);
      PandaCmd.Send.sendSlotBet(this.localBetAmount);
    }
  }

  protected onClickMenu(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.nMenu.active = !this.nMenu.active;
  }

  protected onClickGuide(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.nGuide.getComponent(PandaGuide).show(1);
    this.activeMenu(false);
  }

  protected onClickSetting(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    this.nSetting.getComponent(PandaSetting).show();
    this.activeMenu(false);
  }

  protected onClickMaxBet(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    this.activeBtnAutoSpin(false);
    if (this.localBalance >= this.listRooms[5]) {
      this.localBetAmount = this.listRooms[5];
      PandaCmd.Send.sendSlotJoinGame(this.listRooms[5]);
    } else {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_03"));
    }
  }

  protected onClickStopAutoSpin(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.localIsAutoSpin = false;
      this.activeBtnAutoSpin(false);
      this.activeBtnSpin(true);
      this.switchTextBtnSpin(false);
      this.switchTextAutoSpin(false);
      this.localNumberAutoSpins = 0;
    }
  }

  protected onClickAutoSpin(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    this.localNumberAutoSpins = parseInt(data);
    this.localIsAutoSpin = true;
    this.activeBtnAutoSpin(false);
    this.activePnAutoSpin(false);
    this.switchTextAutoSpin(true);
    this.lbNumberAutoSpin.string = this.localNumberAutoSpins.toString();
    this.realySpin();
  }

  protected onClickPrevRoom(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    let index = this.listRooms.indexOf(this.localBetAmount);
    if (index > 0 && index <= 5) {
      this.skeletonTotalBet.setAnimation(0, "animation", false);
      PandaCmd.Send.sendSlotJoinGame(this.listRooms[index - 1]);
    }
  }

  protected onClickNextRoom(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    if (this.localIsAutoSpin) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_01"));
      return;
    }
    if (this.isInRotation) {
      this.showMessage(PandaLanguageMgr.getString("slot50.slot_notify_02"));
      return;
    }
    let index = this.listRooms.indexOf(this.localBetAmount);
    if (index >= 0 && index < 5) {
      this.skeletonTotalBet.setAnimation(0, "animation", false);
      PandaCmd.Send.sendSlotJoinGame(this.listRooms[index + 1]);
    }
  }

  protected onClickJackpot(arg, data) {
    PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
    PandaCmd.Send.sendOpenJackpot(parseInt(data));
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

  private activePnAutoSpin(isActive: boolean) {
    this.pnAutoSpin.active = isActive;
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
