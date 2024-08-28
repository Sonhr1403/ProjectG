import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { SlotCmd } from "./SlotTT.Cmd";
import SlotTTCommon from "./SlotTT.Common";
import { SlotTTConnector } from "./SlotTT.Connector";
import SlotTTInfo from "./SlotTT.Info";
import SlotTTMusicManager, {
  SLOT_MUSIC_TYPE,
  SLOT_SOUND_TYPE,
} from "./SlotTT.Music";
import SlotTTMachine from "./SlotTT.SlotMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotTTController extends cc.Component {
  public static instance: SlotTTController = null;

  @property(cc.Node)
  public pnGame: cc.Node = null;

  @property(cc.Node)
  public turboBtn: cc.Node[] = [];

  @property(cc.Node)
  public autoSpinBtn: cc.Node[] = [];

  @property(cc.Node)
  public jackpot: cc.Node = null;

  @property(cc.Node)
  public noti: cc.Node = null;

  @property(cc.Node)
  public menu: cc.Node = null;

  @property(cc.Node)
  private pnAutoSpin: cc.Node = null;

  @property(cc.Button)
  private btnAutoSpin: cc.Button = null;

  @property(cc.Button)
  public btnIncBet: cc.Button = null;

  @property(cc.Button)
  public btnDecBet: cc.Button = null;

  @property(cc.Button)
  public btnBetLvlMax: cc.Button = null;

  @property(cc.Button)
  public btnMenu: cc.Button = null;

  @property(cc.Label)
  public totalBet: cc.Label = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Label)
  public autoSpinLbl: cc.Label = null;

  @property(cc.Label)
  public jackPotLbl: cc.Label[] = [];

  @property(cc.Label)
  public notiContent: cc.Label = null;

  @property(cc.Prefab)
  public prfInfo: cc.Prefab = null;

  @property(cc.Prefab)
  public prfSetting: cc.Prefab = null;

  @property(cc.SpriteFrame)
  public autoPlaySF: cc.SpriteFrame[] = [];

  //////////////////////////////////
  public _scheduler = null;
  public _isGameActive: boolean = true;
  private hideTime: number = null;
  //////////////////////////////////

  private localBetAmount: number = -1;

  public isMobile: boolean = false;

  public isTurbo: boolean = false;

  private pnInfo: cc.Node = null;

  public isAutoSpinOn: boolean = false;
  public isAutoSpinning: boolean = false;

  private pnSetting: cc.Node = null;

  private currentBalance: number = 0;

  public betOrdi: number = 2;
  public listBet: Array<number> = [10000, 20000, 30000, 50000, 100000];

  public isForceStop: boolean = false;

  public lang: string = "";

  private major: number = 0;
  private minor: number = 0;
  private previousMajor: number = 0;
  private previousMinor: number = 0;

  public isJackPot: boolean = false;

  onLoad() {
    cc.debug.setDisplayStats(false);
    SlotTTController.instance = this;

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

    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_OPEN_JACKPOT,
      this.responseOpenJackPot,
      this
    );
    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveSubcribeGame,
      this
    );
    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    SlotTTConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    SlotTTConnector.instance.connect();
    // SlotTTConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_EXITGAME, this.responseDisconnect, this);
    // SlotTTConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_DISCONNECTED, this.responseDisconnect, this);
    // SlotTTConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_KICK_OUT, this.responseUserOut, this);
  }

  onDestroy() {
    SlotTTConnector.instance.disconnect();
    SlotTTConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_LOGIN
    );
    SlotTTConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO
    );
    SlotTTConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    SlotTTConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED
    );
    SlotTTConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_OPEN_JACKPOT
    );
    cc.director.getScheduler().unscheduleUpdate(this);

    //  SlotTTConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_EXITGAME);
    //  SlotTTConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_DISCONNECTED);
    //  SlotTTConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_KICK_OUT);
  }

  protected start(): void {
    this.initSetting();
    this.initInfo();
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
    localStorage.setItem("musicStatus", "true");
    SlotTTMusicManager.instance.setMusicStatus(true);
    SlotTTMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.MAIN_MUSIC);
  }

  private initInfo() {
    this.pnInfo = cc.instantiate(this.prfInfo);
    this.pnInfo.zIndex = 999;
    this.pnInfo.opacity = 0;
    this.pnInfo.active = false;
    this.pnGame.addChild(this.pnInfo);
  }

  private initSetting() {
    this.pnSetting = cc.instantiate(this.prfSetting);
    this.pnSetting.zIndex = 999;
    this.pnSetting.active = false;
    this.pnGame.addChild(this.pnSetting);
  }

  private initData() {
    this.fakeData();
    SlotTTMachine.instance.createMachine(this.localData);
  }

  public fakeData() {
    let arr: Array<SlotCmd.ImpItemCell> = [];
    for (let i = 0; i < 9; i++) {
      let item: SlotCmd.ImpItemCell = {
        index: i,
        id: SlotTTCommon.getRandomNumber(3, 9),
        highlight: true,
      };
      arr.push(item);
    }

    let arr1: Array<SlotCmd.ImpResult> = [];
    let ran = SlotTTCommon.getRandomNumber(0, 3);
    for (let i = 0; i < ran; i++) {
      let result: SlotCmd.ImpResult = {
        id: SlotTTCommon.getRandomNumber(0, 7),
        moneyWin: this.listBet[this.betOrdi],
      };
      arr1.push(result);
    }

    let data: SlotCmd.ImpData = {
      betAmount: this.listBet[this.betOrdi],
      itemList: arr,
      resultList: arr1,
      amountProfit: this.listBet[this.betOrdi] * ran,
      currentMoney:
        SlotTTCommon.numberWithOutDot(this.lbBalance.string) -
        this.listBet[this.betOrdi] +
        this.listBet[this.betOrdi] * ran,
    };
    this.localData = data;
  }
  /////////////////////////////////////////////////////////////////////////////Init End

  //////////////////////////////////////////////////////////////////////////Button Start

  private onClickSpin() {
    this.reallySpin();
  }

  public reallySpin() {
    if (this.currentBalance < this.listBet[this.betOrdi]) {
      if (!this.noti.active) {
        this.noti.active = true;
      }
      this.notiContent.string = LanguageMgr.getString(
        "slotthantai.not_enough_money"
      );
    } else {
      this.isForceStop = false;
      SlotTTMachine.instance.onClickSpin();
      SlotTTMachine.instance.startSpinVirtual();
      this.decreaseBalance();
      this.sendBet();
      this.disableBtn(false);
    }

    if (this.isAutoSpinOn) {
      this.onClickAutoSpin();
    }
  }

  private decreaseBalance() {
    this.currentBalance -= this.listBet[this.betOrdi];
    this.updateBalance(this.currentBalance);
  }

  public increaseBalance(num: number) {
    this.currentBalance += num;
    this.updateBalance(this.currentBalance);
  }

  private onClickTurbo() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.isTurbo = !this.isTurbo;
    this.updateTurbo();
  }

  public updateTurbo() {
    if (this.isTurbo) {
      this.turboBtn[1].active = true;
      this.turboBtn[0].active = false;
    } else {
      this.turboBtn[0].active = true;
      this.turboBtn[1].active = false;
    }
  }

  private onClickInfo() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.menu.active = false;
    this.pnInfo.getComponent(SlotTTInfo).onOpen();
  }

  private onClickIncBet() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.betOrdi += 1;
    this.updateBet();
  }

  private onClickDecBet() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.betOrdi -= 1;
    this.updateBet();
  }

  private onClickMaxBet() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.betOrdi !== 4) {
      this.betOrdi = 4;
      this.updateBet();
    }
  }

  private updateBet() {
    switch (this.betOrdi) {
      case 0:
        this.btnDecBet.interactable = false;
        this.btnIncBet.interactable = true;
        break;
      case 4:
        this.btnIncBet.interactable = false;
        this.btnDecBet.interactable = true;
        break;
      default:
        this.btnIncBet.interactable = true;
        this.btnDecBet.interactable = true;
        break;
    }
    let num = this.listBet[this.betOrdi];
    this.updateBetNum(num);

    if (num !== this.localBetAmount) {
      SlotCmd.Send.sendSlotJoinGame(num);
    }
  }

  private updateBetNum(num: number) {
    this.totalBet.string = BGUI.Utils.formatMoneyWithCommaOnly(num);
  }

  public onClickAutoSpin() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.isAutoSpinOn = !this.isAutoSpinOn;

    this.pnAutoSpin.active = this.isAutoSpinOn ? true : false;
  }

  public onClickChooseAutoSpin(event, id) {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.runAutoSpin(parseInt(id));
  }

  public onClickStopAutoSpin() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.btnAutoSpin.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.autoPlaySF[0];

    this.autoSpinBtn[1].active = false;
    this.autoSpinBtn[0].active = true;

    this.isAutoSpinning = false;
    this.autoSpinLbl.string = "";
  }

  private onClickSetting() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.menu.active = false;
    this.pnSetting.active = true;
  }

  private onClickMenu() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.menu.active = !this.menu.active;
  }

  public disableBtn(enabled: boolean) {
    if (enabled) {
      switch (this.betOrdi) {
        case 0:
          this.btnDecBet.interactable = false;
          this.btnIncBet.interactable = true;
          break;
        case 4:
          this.btnIncBet.interactable = false;
          this.btnDecBet.interactable = true;
          break;
        default:
          this.btnIncBet.interactable = true;
          this.btnDecBet.interactable = true;
          break;
      }
    } else {
      this.btnDecBet.interactable = false;
      this.btnIncBet.interactable = false;
    }
    this.btnBetLvlMax.interactable = enabled;
    this.btnMenu.interactable = enabled;
    this.btnAutoSpin.interactable = enabled;
    this.autoSpinBtn[0].getComponent(cc.Button).interactable = enabled;
  }

  /////////////////////////////////////////////////////////////////////////////Button End

  //   private resetJoinGame() {
  //     this.activeNAutoSpin(false);
  //     this.activeBtnSpin(true);
  //   }

  protected onEnable(): void {
    // SlotTTConnector.instance.connect();
  }

  protected onDisable(): void {
    // SlotTTConnector.instance.disconnect();
  }

  private showError(res) {
    let err = res.getError();
    if (err !== 0) {
      SlotTTCommon.runError("error", err);
    }
  }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveLogin();
    res.unpackData(data);
    SlotTTCommon.runError(
      "SLOTTT LOGIN: ",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      cmdId,
      res
    );
    let err = res.getError();
    this.showError(res);
    ////////////////////////////////////////////
    switch (err) {
      case 0:
        SlotCmd.Send.sendSlotJoinGame(this.listBet[this.betOrdi]);
        break;

      default:
        if (!this.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotthantai.connection_error3"
        );
        break;
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "SLOTTT",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "JOIN ROOM",
    //   cmdId
    // );
  }

  //   // 5002
  protected responseReceiveSubcribeGame(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    SlotTTCommon.runError(
      "responseReceiveSubcribeGame",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      cmdId,
      res
    );
    this.showError(res);
    /////////////////////////
    this.currentBalance = res.currentMoney;
    this.updateBalance(res.currentMoney);
    if (this.localBetAmount !== res.betAmount) {
      this.localBetAmount = res.betAmount;
      this.updateBet();
    }

    if (res.isJackpot) {
      SlotCmd.Send.sendOpenJackpot();
    }
  }

  private updateBalance(num: number) {
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(num);
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
  public localRes5004 = null;

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    SlotTTCommon.runError(
      "responseReceiveRoundResult",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      cmdId,
      res
    );
    this.showError(res);
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      if (!SlotTTController.instance.noti.active) {
        this.noti.active = true;
      }
      this.notiContent.string = LanguageMgr.getString("slotthantai.spin_error");
      return;
    }

    this.localRes5004 = res;
    this.localData = res.data;
    SlotTTMachine.instance.letGo(res.data);

    if (res.type === 2) {
      // cc.error(
      //   "jackpot",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds()
      // );
      this.isJackPot = true;
    }
  }

  //5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    SlotTTCommon.runError(
      "responseReceiveBetFailed",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "responseReceiveBetFailed",
      cmdId,
      res
    );
    this.showError(res);
    ////////////////////////////////////////////
    const error = res.getError();

    if (!SlotTTController.instance.noti.active) {
      this.noti.active = true;
    }
    this.notiContent.string = LanguageMgr.getString("slotthantai.spin_error");

    switch (error) {
      case 1:
        // BGUI.ZLog.log("Không trừ được tiền");
        break;

      case 2:
        // BGUI.ZLog.log("Đang có free game");
        break;

      case 3:
        // BGUI.ZLog.log("Đang có jackpot");
        break;
    }
  }

  //   private backToLobby() {
  //     SlotTTConnector.instance.disconnect();
  //     BGUI.GameCoreManager.instance.onBackToLobby();
  //   }

  public runAutoSpin(num: number) {
    this.isAutoSpinning = true;
    this.btnAutoSpin.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.autoPlaySF[1];
      
    this.autoSpinBtn[0].active = false;
    this.autoSpinBtn[1].active = true;

    this.autoSpinLbl.string = num.toString();
    this.reallySpin();
  }

  public sendBet() {
    this.disableBtn(false);
    SlotCmd.Send.sendSlotBet(this.listBet[this.betOrdi]);
  }

  public checkAutoSpin() {
    if (this.isAutoSpinning) {
      if (parseInt(this.autoSpinLbl.string) > 0) {
        this.autoSpinLbl.string = (
          parseInt(this.autoSpinLbl.string) - 1
        ).toString();
        this.reallySpin();
      } else {
        this.onClickStopAutoSpin();
        this.disableBtn(true);
      }
    }
  }

  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    SlotTTCommon.runError(
      "responseReceiveJackpotInfo",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      cmdId,
      res
    );
    this.showError(res);
    /////////////////////////////////////////////////////

    this.previousMinor = this.minor;
    this.previousMajor = this.major;
    this.minor = res.listJackpot[0];
    this.major = res.listJackpot[1];

    if (this.previousMajor !== this.major) {
      if (this.previousMajor !== 0) {
        this.jackPotLbl[1].string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.previousMajor
        );
        this.scheduleForLbl(this.previousMajor, this.major, 4, true);
      } else {
        this.jackPotLbl[1].string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.major
        );
      }
    }

    if (this.previousMinor !== this.minor) {
      if (this.previousMinor !== 0) {
        this.jackPotLbl[0].string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.previousMinor
        );
        this.scheduleForLbl(this.previousMinor, this.minor, 4, false);
      } else {
        this.jackPotLbl[0].string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.minor
        );
      }
    }
  }

  public scheduleForLbl(
    startMoney: number,
    totalMoney: number,
    time: number,
    isMajor: boolean
  ) {
    let profit = startMoney;
    let totalProfit = totalMoney;
    let profitStep = (totalMoney - startMoney) / (time * 100);

    function increaseMajorLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseMajorLbl);
        this.jackPotLbl[1].string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
      } else {
        this.jackPotLbl[1].string = BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }

    function decreaseMajorLbl() {
      profit += profitStep;
      if (profit <= totalProfit) {
        this.unschedule(decreaseMajorLbl);
        this.jackPotLbl[1].string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
      } else {
        this.jackPotLbl[1].string = BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }

    function increaseMinorLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseMinorLbl);
        this.jackPotLbl[0].string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
      } else {
        this.jackPotLbl[0].string = BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }

    function decreaseMinorLbl() {
      profit += profitStep;
      if (profit <= totalProfit) {
        this.unschedule(decreaseMinorLbl);
        this.jackPotLbl[0].string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
      } else {
        this.jackPotLbl[0].string = BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }

    if (isMajor) {
      if (startMoney < totalMoney) {
        this.schedule(increaseMajorLbl, 0.001);
      } else if (startMoney > totalMoney) {
        this.schedule(decreaseMajorLbl, 0.001);
      }
    } else {
      if (startMoney < totalMoney) {
        this.schedule(increaseMinorLbl, 0.001);
      } else if (startMoney > totalMoney) {
        this.schedule(decreaseMinorLbl, 0.001);
      }
    }
  }

  private responseOpenJackPot(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    SlotTTCommon.runError(
      "responseOpenJackPot",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      cmdId,
      res
    );
    this.showError(res);
    /////////////////////////////////////////////////////////

    this.jackpot.active = true;
    this.jackpot.getComponent(sp.Skeleton).setAnimation(0, "jackpot", false);
    // this.scheduleOnce(() => {
    //   this.jackpot.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
    // }, 4);
    SlotTTMachine.instance.openJackPot(res.winMoney);
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
