import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { SlotCmd } from "./SongKran.Cmd";
import SongKranCommon from "./SongKran.Common";
import { SongKranConnector } from "./SongKran.Connector";
import SongKranFootBar from "./SongKran.FootBar";
import SongKranFreeGame from "./SongKran.FreeGame";
import SongKranHeadBar from "./SongKran.HeadBar";
import SongKranMusicManager, { SLOT_SOUND_TYPE } from "./SongKran.Music";
import SongKranNoti from "./SongKran.Noti";
import SongKranMachine from "./SongKran.SlotMachine";
import SongKranNumericalHelper from "./SongKran.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SongKranController extends cc.Component {
  public static instance: SongKranController = null;

  @property(cc.Node)
  private pnGame: cc.Node = null;

  @property(cc.Node)
  private pnBar: cc.Node = null;

  @property(cc.Prefab)
  private prfSetting: cc.Prefab = null;

  @property(cc.Prefab)
  private prfFootBar: cc.Prefab = null;

  @property(cc.Prefab)
  private prfHeadBar: cc.Prefab = null;

  @property(cc.Prefab)
  private prfNoti: cc.Prefab = null;

  @property(cc.Prefab)
  private prfPayTable: cc.Prefab = null;

  @property(cc.Prefab)
  private prfFreeGame: cc.Prefab = null;

  @property(cc.Label)
  private listLblJP: cc.Label[] = [];

  @property(cc.Sprite)
  private backGround: cc.Sprite = null;

  @property(cc.SpriteFrame)
  private bgSF: cc.SpriteFrame[] = [];

  //////////////////////////////////

  private pnNoti: cc.Node = null;
  private pnHeadBar: cc.Node = null;
  private pnFootBar: cc.Node = null;
  public pnSetting: cc.Node = null;
  public pnPayTable: cc.Node = null;
  public pnFreeGame: cc.Node = null;

  public _scheduler = null;
  public _isGameActive: boolean = true;
  private hideTime: number = null;

  private localBetAmount: number = -1;

  public setLocalBetAmount(num: number) {
    this.localBetAmount = num;
  }

  public getLocalBetAmount() {
    return this.localBetAmount;
  }

  public isMobile: boolean = false;

  private isTurbo: boolean = false;

  public setIsTurbo(bool: boolean) {
    this.isTurbo = bool;
  }

  public getIsTurbo() {
    return this.isTurbo;
  }

  private isAutoSpinning: boolean = false;

  public getIAS() {
    return this.isAutoSpinning;
  }

  public setIAS(bool: boolean) {
    this.isAutoSpinning = bool;
  }

  private betOrdi: number = 3;

  public increaseBetOrdi() {
    this.betOrdi += 1;
  }

  public decreaseBetOrdi() {
    this.betOrdi -= 1;
  }

  public getBetOrdi() {
    return this.betOrdi;
  }

  public setBetOrdi(num: number) {
    this.betOrdi = num;
  }

  private listBet: Array<number> = [10000, 20000, 30000, 50000, 100000];

  private listCurJP: Array<number> = [0, 0, 0];
  private listPreJP: Array<number> = [0, 0, 0];

  public isForceStop: boolean = false;

  public lang: string = "";

  onLoad() {
    cc.debug.setDisplayStats(false);
    SongKranController.instance = this;
    this.initNoti();

    const url = window.location.href;
    let urlSearchParams = new URLSearchParams(url.split("?")[1]);
    if (
      url &&
      url.includes("?") &&
      urlSearchParams &&
      urlSearchParams.get("lang")
    ) {
      this.lang = urlSearchParams.get("lang");
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, this.lang);
      LanguageMgr.updateLang(this.lang);
    } else {
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en");
      LanguageMgr.updateLang("en");
    }
    this.isMobile = cc.sys.isMobile;

    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    // SongKranConnector.instance.addCmdListener(
    //   SlotCmd.Cmd.CMD_SLOT_JOIN_ROOM,
    //   this.responseJoinRoom,
    //   this
    // );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_OPEN_JACKPOT,
      this.responseOpenJackPot,
      this
    );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveSubcribeGame,
      this
    );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_OPEN_MINIGAME,
      this.responseFreeGameResult,
      this
    );
    SongKranConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseFreeGameResult,
      this
    );
    SongKranConnector.instance.connect();
    // SongKranConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_EXITGAME, this.responseDisconnect, this);
    // SongKranConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_DISCONNECTED, this.responseDisconnect, this);
    // SongKranConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_KICK_OUT, this.responseUserOut, this);
  }

  onDestroy() {
    SongKranConnector.instance.disconnect();
    SongKranConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_LOGIN
    );
    SongKranConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO
    );
    SongKranConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    SongKranConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED
    );
    cc.director.getScheduler().unscheduleUpdate(this);
    //     SongKranConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_EXITGAME);
    //     SongKranConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_DISCONNECTED);
    //     SongKranConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_KICK_OUT);
  }

  protected start(): void {
    this.initFootBar();
    this.initHeadBar();
    this.initSetting();
    this.initPayTable();
    this.initFreeGame();
    this.initMusic();
    this.initData();

    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
  }

  ////////////////////////////////////////////////////////////////////Init Start
  private initMusic() {
    // localStorage.setItem("musicStatus", "true");
    SongKranMusicManager.instance.playSlotMusic(0);
  }

  private initSetting() {
    this.pnSetting = cc.instantiate(this.prfSetting);
    this.pnSetting.zIndex = 999;
    this.pnSetting.active = false;
    this.pnGame.addChild(this.pnSetting);
  }

  private initHeadBar() {
    this.pnHeadBar = cc.instantiate(this.prfHeadBar);
    this.pnHeadBar.zIndex = 999;
    this.pnHeadBar.active = true;
    this.pnBar.addChild(this.pnHeadBar);
  }

  private initFootBar() {
    this.pnFootBar = cc.instantiate(this.prfFootBar);
    this.pnFootBar.zIndex = 999;
    this.pnFootBar.active = true;
    this.pnBar.addChild(this.pnFootBar);
  }

  private initPayTable() {
    this.pnPayTable = cc.instantiate(this.prfPayTable);
    this.pnPayTable.zIndex = 999;
    this.pnPayTable.active = false;
    this.pnGame.addChild(this.pnPayTable);
  }

  private initFreeGame() {
    this.pnFreeGame = cc.instantiate(this.prfFreeGame);
    this.pnFreeGame.zIndex = 999;
    this.pnFreeGame.active = false;
    this.pnGame.addChild(this.pnFreeGame);
  }

  public initNoti() {
    this.pnNoti = cc.instantiate(this.prfNoti);
    this.pnNoti.zIndex = 999;
    this.pnNoti.active = true;
    this.pnGame.parent.addChild(this.pnNoti);
    this.pnNoti.active = false;
  }

  private initData() {
    this.fakeData();
    SongKranMachine.instance.createMachine(this.localData);
  }

  public fakeData(isFG: boolean = false) {
    if (isFG) {
      let win = SongKranCommon.getRandomNumber(1, 2) === 1;

      let freeGame: SlotCmd.ImpData = {
        totalPot: 80000,
        listCell: [],
        totalProfit: 10000,
        currentMoney: SongKranHeadBar.instance.getCurrentBalance(),
        totalRound: 8,
        type: 0,
        listResult: [],
      };

      for (let j = 0; j < 20; j++) {
        let item: SlotCmd.ImpItemCell = {
          index: j,
          id: SongKranCommon.getRandomNumber(2, 13),
          highlight: true,
          off: false,
          wildLength: -1,
          wildUpper: false,
          wildNudge: false,
        };
        if (j == 13 || j == 18) {
          item.id = 1;
        }
        freeGame.listCell.push(item);
      }

      let ran = win ? SongKranCommon.getRandomNumber(0, 5) : 0;
      for (let i = 0; i < ran; i++) {
        let id = SongKranCommon.getRandomNumber(0, 49);
        freeGame.listResult.push(id);
      }
      this.localData = freeGame;
    } else {
      let win = SongKranCommon.getRandomNumber(1, 2) === 1;
      let data: SlotCmd.ImpData = {
        betAmount: this.getTotalBet(),
        listCell: [],
        type: 3,
        listResult: [],
        totalProfit: win ? this.getTotalBet() : 0,
        currentMoney: win
          ? SongKranHeadBar.instance.getCurrentBalance() + this.getTotalBet()
          : SongKranHeadBar.instance.getCurrentBalance(),
        jackPotAmount: 0,
      };

      for (let j = 0; j < 20; j++) {
        let item: SlotCmd.ImpItemCell = {
          index: j,
          id: SongKranCommon.getRandomNumber(2, 13),
          highlight: win ? true : false,
          off: false,
          wildLength: -1,
          wildUpper: false,
        };
        if (j == 13 || j == 18) {
          item.id = 1;
        }
        data.listCell.push(item);
      }

      let ran = win ? SongKranCommon.getRandomNumber(0, 5) : 0;
      for (let i = 0; i < ran; i++) {
        let id = SongKranCommon.getRandomNumber(0, 49);
        data.listResult.push(id);
      }
      this.localData = data;
    }
  }
  /////////////////////////////////////////////////////////////////////////////Init End

  //////////////////////////////////////////////////////////////////////////Button Start

  public reallySpin() {
    if (SongKranHeadBar.instance.getCurrentBalance() < this.getTotalBet()) {
      SongKranNoti.instance.openNoti(3);
    } else {
      this.isForceStop = false;
      SongKranMachine.instance.startSpinVirtual();
      SongKranHeadBar.instance.decreaseBalance();
      //fake
      // this.pnHeadBar
      //   .getComponent(SongKranHeadBar)
      //   .setCurrentBalance(1000000000);
      // SongKranFootBar.instance.updateBet();
      // this.fakeData();
      // this.scheduleOnce(() => {
      //   SongKranMachine.instance.letGo(this.localData);
      // }, 0.5);
      this.sendBet();
      this.setBtnInteractable(false);
    }
  }

  public setBtnInteractable(bool: boolean) {
    SongKranFootBar.instance.setBtnInteractable(bool);
    SongKranHeadBar.instance.setMenuInteractable(bool);
    SongKranHeadBar.instance.closeMenu();
  }

  /////////////////////////////////////////////////////////////////////////////Button End

  protected onEnable(): void {
    // SongKranConnector.instance.connect();
  }

  protected onDisable(): void {
    // SongKranConnector.instance.disconnect();
  }

  /////////////////////////////////////////////////////////////////////Response Start

  private showError(res) {
    let err = res.getError();
    if (err !== 0) {
      SongKranCommon.runError({
        error: err,
      });
    }
  }

  private checkRes(name: string, cmdId: any, res: any) {
    SongKranCommon.runError(
      name,
      new Date().toLocaleString() + " " + new Date().getMilliseconds(),
      cmdId,
      res
    );
  }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveLogin();
    res.unpackData(data);
    this.checkRes("responseLogin", cmdId, res);
    this.showError(res);
    ////////////////////////////////////////////
    let err = res.getError();
    switch (err) {
      case 0:
        SlotCmd.Send.sendSlotJoinGame(this.getTotalBet());
        break;

      default:
        SongKranNoti.instance.openNoti(1);
        break;
    }
  }

  //   // 5002
  protected responseReceiveSubcribeGame(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    this.checkRes("responseReceiveSubcribeGame", cmdId, res);
    this.showError(res);
    /////////////////////////
    SongKranHeadBar.instance.setCurrentBalance(res.currentMoney);
    if (this.localBetAmount !== res.betAmount) {
      this.localBetAmount = res.betAmount;
      SongKranFootBar.instance.updateBet();
    }

    if (res.isJackpot) {
      SlotCmd.Send.sendOpenJackpot();
    }

    if (res.isFreeGame) {
      SlotCmd.Send.sendStartFreeGame();
    }
  }

  //   protected responseUserOut(cmdId: any, data: Uint8Array) {
  //     let res = new SlotCmd.SlotReceiveUserOut();
  //     res.unpackData(data);
  //     ////////////////////////////////////////////
  //     console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT_RECEIVE_USER_OUT", cmdId, res);
  //     this.backToLobby();
  //   }

  //   // 5004
  public localData: SlotCmd.ImpData = null;
  public localRes5004: SlotCmd.SlotReceiveRoundResult = null;

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    this.checkRes("responseReceiveRoundResult", cmdId, res);
    this.showError(res);
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      SongKranNoti.instance.openNoti(4);
      return;
    }

    this.localRes5004 = res;
    this.localData = res.data;
    SongKranMachine.instance.letGo(res.data);
  }

  //5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    this.checkRes("responseReceiveBetFailed", cmdId, res);
    this.showError(res);

    ////////////////////////////////////////////
    const error = res.getError();
    switch (error) {
      case 1:
        SongKranCommon.runError("Không trừ được tiền");
        break;

      case 2:
        SongKranCommon.runError("Đang có free game");
        break;

      case 3:
        SongKranCommon.runError("Đang có jackpot");
        break;
    }

    SongKranNoti.instance.openNoti(4);
  }

  //   private backToLobby() {
  //     SongKranConnector.instance.disconnect();
  //     BGUI.GameCoreManager.instance.onBackToLobby();
  //   }

  public sendBet() {
    SlotCmd.Send.sendSlotBet(this.getTotalBet());
  }

  public checkAutoSpin() {
    if (this.isAutoSpinning) {
      if (SongKranFootBar.instance.getLblAutoSpin() > 0) {
        SongKranFootBar.instance.decLblAutoSpin();
        this.reallySpin();
      } else {
        SongKranFootBar.instance.onClickStopAutoSpin();
        this.setBtnInteractable(true);
      }
    } else {
      this.setBtnInteractable(true);
    }
  }

  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // this.checkRes("responseReceiveJackpotInfo", cmdId, res);
    this.showError(res);

    //////////////////////////////////////////////////////////////////////
    for (let i = 0; i < 3; i++) {
      this.listPreJP[i] = this.listCurJP[i];
      this.listCurJP[i] = res.listJackpot[i];
      if (
        this.listPreJP[i] < this.listCurJP[i] &&
        this.listPreJP[i] !== 0 &&
        !this.isTurbo
      ) {
        this.scheduleForLbl(
          this.listPreJP[i],
          this.listCurJP[i],
          4.5,
          this.listLblJP[i],
          false
        );
      } else if (
        this.listPreJP[i] > this.listCurJP[i] ||
        this.listPreJP[i] === 0 ||
        this.isTurbo
      ) {
        this.listLblJP[i].string = SongKranCommon.numberWithCommas(
          this.listCurJP[i]
        );
      }
    }
  }

  public scheduleForLbl(
    start: number,
    to: number,
    time: number,
    lbl: cc.Label,
    unsche: boolean
  ) {
    let current = start;
    let totalProfit = to;
    let profitStep = (totalProfit - current) / 100;

    if (unsche) {
      this.unschedule(increaseLbl);
    } else {
      this.schedule(increaseLbl, time * 0.01);
    }
    function increaseLbl() {
      current += profitStep;
      if (current >= totalProfit) {
        this.unschedule(increaseLbl);
        lbl.string = SongKranCommon.numberWithCommas(totalProfit);
      } else {
        lbl.string = SongKranCommon.numberWithCommas(current);
      }
    }
  }

  // private responseOpenJackPot(cmdId: any, data: Uint8Array) {
  //   let res = new SlotCmd.SlotReceiveJackpotResult();
  //   res.unpackData(data);
  //   this.checkRes("responseOpenJackPot", cmdId, res);
  //   this.showError(res);

  //   /////////////////////////////////////////////////////////
  // }

  //5008
  private responseFreeGameResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    this.checkRes("responseFreeGameResult", cmdId, res);
    this.showError(res);

    /////////////////////////////////////////////////////////

    let fG = this.pnFreeGame.getComponent(SongKranFreeGame);
    switch (res.err) {
      case 0:
        if (!fG.getIsStarted()) {
          fG.onOpen(res.freeGame.totalRound, res.freeGame.currentRound);
        }
        if (res.freeGame.currentRound <= res.freeGame.totalRound) {
          this.scheduleOnce(() => {
            fG.updateRound(res.freeGame.currentRound);
            SongKranMachine.instance.startSpinVirtual();
            this.fakeData(true);
            this.scheduleOnce(() => {
              SongKranMachine.instance.letGo(res.freeGame);
            }, 1);
          }, 0.5);
        } else {
          fG.onOpen(res.freeGame.totalRound, res.freeGame.currentRound);
          fG.endFreeGame(res.freeGame.totalPot);
        }
        break;

      case 1:
        SongKranCommon.runError("No Free Game");
        break;

      default:
        SongKranCommon.runError("Free Game Error:", res.err);
        break;
    }
  }

  @property(cc.Node)
  private jackPotNode: cc.Node = null;

  //5006
  private responseOpenJackPot(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    this.checkRes("responseOpenJackPot", cmdId, res);
    this.showError(res);

    /////////////////////////////////////////////////////////

    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.JACKPOT_NOTICE);
    this.scheduleOnce(() => {
      SongKranMusicManager.instance.playLoop(SLOT_SOUND_TYPE.JACKPOT);
      this.jackPotNode.active = true;
      this.jackPotNode.children[1]
        .getComponent(sp.Skeleton)
        .setAnimation(0, "jackpot", false);
      let bone = this.jackPotNode.children[2].getComponent(
        dragonBones.ArmatureDisplay
      );
      bone.playAnimation("start", 1);
      bone.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          bone.playAnimation("idle", 0);
        },
        bone
      );
      let lbl = this.jackPotNode.children[3].getComponent(cc.Label);
      lbl.node.active = true;
      SongKranNumericalHelper.scheduleForLabel(lbl, res.winMoney, 13);
      this.scheduleOnce(() => {
        SongKranHeadBar.instance.setCurrentBalance(res.currentMoney);
        lbl.string = "";
        lbl.node.active = false;
        this.scheduleOnce(() => {
          bone.playAnimation("exit", 1);
          this.jackPotNode.active = false;
          SongKranMusicManager.instance.stopPlayLoop();
          this.checkAutoSpin();
        }, 1);
      }, 14);
    }, 2.5);
  }

  public getTotalBet() {
    return this.listBet[this.betOrdi];
  }

  public changeBG(num: number) {
    this.backGround.spriteFrame = this.bgSF[num];
  }

  /////////////////////////////////////////////////////////////////////Response End

  /////////////////// DMZ /////////////////////////

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

  ///////////////////////////////////////////
}
