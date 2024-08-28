import ThanhGiongSlotMachine from "./ThanhGiong.SlotMachine";
import { ThanhGiongCmd } from "./ThanhGiong.Cmd";
import { ThanhGiongConnector } from "./Connector/ThanhGiong.Connector";
import ThanhGiongCommon from "./ThanhGiong.Common";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import ThanhGiongSoundController, {
  SLOT_SOUND_TYPE,
} from "./ThanhGiong.SoundController";
import ThanhGiongNumericalHelper from "./ThanhGiong.UINumericLblHelper";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ThanhGiongController extends cc.Component {
  public static instance: ThanhGiongController = null;
  @property(cc.Label)
  private jackpotFundMajor: cc.Label = null;
  @property(cc.Label)
  private jackpotFundMinor: cc.Label = null;
  @property(cc.Label)
  private jackpotFundMini: cc.Label = null;
  @property(cc.Node)
  private menuSlot: cc.Node = null;
  @property(cc.Node)
  private settings: cc.Node = null;
  @property(cc.Node)
  private autoSpinSetting: cc.Node = null;
  @property(cc.Node)
  private increaseBetBtn: cc.Node = null;
  @property(cc.Node)
  private decreaseBetBtn: cc.Node = null;
  @property(cc.Node)
  private turboBtn: cc.Node[] = [];
  @property(cc.Button)
  private turboToggle: cc.Button = null;
  @property(cc.Node)
  private machineSlot: cc.Node = null;
  @property(cc.Node)
  private autoBtn: cc.Node = null;
  @property(cc.Node)
  private stopAutoBtn: cc.Node = null;
  @property(cc.Node)
  private spinBtn: cc.Node[] = [];
  @property(cc.Node)
  private respinBtn: cc.Node = null;
  @property(cc.Label)
  private autoNumLbl: cc.Label = null;
  @property(cc.Node)
  private betChangeBtn: cc.Node[] = [];
  @property(cc.Button)
  private betMaxBtn: cc.Button = null;
  @property(cc.Label)
  private winValue: cc.Label = null;
  @property(cc.Label)
  private balanceValue: cc.Label = null;
  @property(cc.Node)
  private winningWindow: cc.Node = null;
  @property(cc.Node)
  private winBigBanner: cc.Node = null;
  @property(cc.Node)
  private bigWinNode: cc.Node = null;
  @property(sp.Skeleton)
  private winMajorBanner: sp.Skeleton = null;
  @property(sp.Skeleton)
  private winMegaBanner: sp.Skeleton = null;
  @property(cc.Node)
  private skipWinBigBtn: cc.Node = null;
  @property(cc.Node)
  private closeWinBigBtn: cc.Node = null;
  @property(cc.Node)
  private freeSpinProfit: cc.Node = null;
  @property(cc.Label)
  private freeSpinProfitTotal: cc.Label = null;
  @property(cc.Label)
  private freeSpinRemainingRound: cc.Label = null;
  @property(cc.Label)
  private profitLabel: cc.Label = null;
  @property(cc.Node)
  private freespinEndWindow: cc.Node = null;
  @property(cc.Node)
  private freespinWindow: cc.Node = null;
  @property(cc.Node)
  private bannerFreeSpin: cc.Node = null;
  @property(cc.Node)
  private bannerFreeSpinEnd: cc.Node = null;
  @property(cc.Node)
  private skipEndFreeBtn: cc.Node = null;
  @property(cc.Node)
  private closeEndFreeBtn: cc.Node = null;
  @property(cc.Node)
  public noti: cc.Node = null;
  @property(cc.Label)
  public notiMsg: cc.Label = null;
  @property(cc.Label)
  private betLvLbl: cc.Label = null;
  @property(cc.Node)
  private ThanhGiongGuide: cc.Node = null;
  // @property(cc.Node)
  // private ThanhGiongInstruction: cc.Node = null;
  // @property(cc.Node)
  // private ThanhGiongMainNode: cc.Node = null;
  @property(cc.Node)
  private skipIdleWinBtn: cc.Node = null;
  @property(cc.Node)
  private closeAutoWindow: cc.Node = null;
  @property(cc.Node)
  private jackpotLbl: cc.Node = null;
  @property(cc.Node)
  private totalWinLbl: cc.Node = null;
  @property(cc.Node)
  private turboWinContainer: cc.Node = null;
  @property(cc.Prefab)
  private labelWinTurbo: cc.Prefab = null;
  @property(cc.Node)
  private logo: cc.Node = null;
  @property(cc.Node)
  private freegamePanel: cc.Node = null;
  @property(cc.Node)
  private boosterPanel: cc.Node = null;
  @property(cc.Node)
  private boosterBG: cc.Node = null;
  @property(cc.Node)
  private boosterNode: cc.Node = null;
  @property(cc.Node)
  private boosterWin: cc.Node = null;
  @property(cc.Label)
  private boosterWinLbl: cc.Label = null;
  @property(cc.Node)
  private boosterSlotBG: cc.Node = null;
  @property(cc.Node)
  private boosterInfoBanner: cc.Node = null;
  @property(cc.Label)
  private boosterRemainingRound: cc.Label = null;
  @property(cc.Node)
  private boosterInfoWin: cc.Node = null;
  @property(cc.Label)
  public boosterTotalWinLbl: cc.Label = null;

  public languageIndex: number = 0;
  public isSpinning: boolean = false;
  public isMobile: boolean = false;
  public vibrationEnabled: boolean = false;
  private freeSpin: boolean = false;
  private turboState: boolean = false;
  private profitAmount: number = 0;
  // private autoState: boolean = false;
  private endFreeSpin: boolean = false;
  private endBooster: boolean = false;
  private betIndex = 0;
  private betLevels = [10000, 20000, 30000, 50000, 100000];
  private autoSpinNmb: number = 0;
  private currentBetLV = 10000; // 0
  private autoEnabled: boolean = false;
  private totalFreeSpinProfit: number = 0;
  private balance: number = 0;
  private autoSettingEnabled: boolean = false;
  private notAuto: boolean = true;
  private winType = -1;
  private isJackpot;
  private activeBooster: boolean = false;
  private major: number = 0;
  private minor: number = 0;
  private mini: number = 0;
  private previousMinor: number = 0;
  private previousMini: number = 0;
  private previousMajor: number = 0;

  onLoad() {
    ThanhGiongController.instance = this;
    cc.debug.setDisplayStats(false);

    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_KICK_OUT,
      this.responseUserOut,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveGameInfo,
      this
    );

    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_JACKPOT_RESULT,
      this.responseReceiveJackpotResult,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    ThanhGiongConnector.instance.addCmdListener(
      ThanhGiongCmd.Cmd.CMD_SLOT_OPEN_MINIGAME,
      this.responseReceiveMiniResult,
      this
    );
    ThanhGiongConnector.instance.connect();
    const url = window.location.href;
    let urlSearchParams = new URLSearchParams(url.split("?")[1]);
    if (
      url &&
      url.includes("?") &&
      urlSearchParams &&
      urlSearchParams.get("lang")
    ) {
      let lang = urlSearchParams.get("lang");
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
      LanguageMgr.updateLang(lang);
    }
  }

  protected onDestroy(): void {
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_LOGIN
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_JOIN_ROOM
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_KICK_OUT
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_GAME_INFO
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_BET_FAILED
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );
    ThanhGiongConnector.instance.removeCmdListener(
      this,
      ThanhGiongCmd.Cmd.CMD_SLOT_OPEN_MINIGAME
    );
  }

  protected start(): void {
    cc.audioEngine.stopAll();
    cc.debug.setDisplayStats(false);
    this.isMobile = cc.sys.isMobile;
    ThanhGiongSoundController.instance.playSlotMusic(
      ThanhGiongSoundController.instance.mainBGM
    );
    this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = false;
  }

  protected onDisable(): void {
    ThanhGiongConnector.instance.disconnect();
  }

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT DISCONNECT: ",
    //   cmdId
    // );
  }
  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceivedLogin();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT LOGIN: ",
    //   cmdId,
    //   res
    // );

    let err = res.getError();
    let msg = "";
    switch (err) {
      case 3:
        // cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("thanhgiong.connection_error");
        break;
      case 1:
        // cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("thanhgiong.connection_error");
        break;
      case 2:
        // cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("thanhgiong.connection_error");
        break;
      case 0:
        ThanhGiongCmd.Send.sendSlotJoinGame(this.betLevels[0]);
        break;
      default:
        msg = LanguageMgr.getString("thanhgiong.connection_error");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
      this.notiMsg.string = LanguageMgr.getString(
        "thanhgiong.connection_error"
      );
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "JOIN ROOM",
    //   cmdId
    // );
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5002",
    //   cmdId,
    //   res
    // );
    this.noti.active = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = true;
    this.betLvLbl.string = ThanhGiongCommon.numberWithCommas(
      res.betAmount
    ).toString();
    this.balanceValue.string = ThanhGiongCommon.numberWithCommas(
      res.currentMoney
    );
    this.currentBetLV = res.betAmount;
    this.balance = res.currentMoney;
    if (res.freeGameResult != null) {
      // console.error(
      //   "ThanhGiong",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "START FREE GAME: ",
      //   cmdId,
      //   res
      // );
      let remainRound =
        res.freeGameResult.totalRound - res.freeGameResult.currentRound;
      this.activaFreespinOnReceiveInfo(
        remainRound,
        res.freeGameResult.totalPot
      );
    }
    if (res.miniGameResult != null) {
      // console.error(
      //   "ThanhGiong",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "START MINI GAME: ",
      //   cmdId,
      //   res
      // );
      // let remainRound =
      //   res.freeGameResult.totalRound - res.freeGameResult.currentRound;
      this.activaBoosterOnReceiveInfo();
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveUserOut();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT_RECEIVE_USER_OUT",
    //   cmdId,
    //   res
    // );
    this.backToLobby();
  }
  private backToLobby() {
    ThanhGiongConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }
  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5003",
    //   cmdId,
    //   res
    // );
    this.previousMajor = this.major;
    this.previousMinor = this.minor;
    this.previousMini = this.mini;

    this.major = res.majorFundBonus;
    this.minor = res.minorFundBonus;
    this.mini = res.miniFundBonus;

    let countUpTimer: number = 4;
    if (this.previousMajor !== this.major) {
      if (this.previousMajor !== 0) {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.majorFundBonus,
          countUpTimer
        );
      } else {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.majorFundBonus,
          0.3
        );
      }
    }

    if (this.previousMinor !== this.minor) {
      if (this.previousMinor !== 0) {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.minorFundBonus,
          countUpTimer
        );
      } else {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.minorFundBonus,
          0.3
        );
      }
    }

    if (this.previousMini !== this.mini) {
      if (this.previousMinor !== 0) {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.jackpotFundMini,
          res.miniFundBonus,
          countUpTimer
        );
      } else {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.jackpotFundMini,
          res.miniFundBonus,
          0.3
        );
      }
    }
  }
  // 5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5005",
    //   cmdId,
    //   res
    // );

    this.noti.active = true;
    this.notiMsg.string = LanguageMgr.getString("thanhgiong.bet_error");
  }
  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5008",
    //   cmdId,
    //   res
    // );
    if (res.getError() != 0) {
      return;
    }
    if (!this.turboState) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.profitAmount = res.amountProfit;
    this.balance = res.currentMoney;
    this.totalFreeSpinProfit = res.totalPot;
    this.freeSpinRemainingRound.string = (
      res.totalRound - res.currentRound
    ).toString();
    if (res.totalRound === res.currentRound) {
      this.endFreeSpin = true;
    }
    this.machineSlot.getComponent(ThanhGiongSlotMachine).letGo(res);
  }

  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    // console.error(
    //   "THANHGIONG",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5006",
    //   cmdId,
    //   res
    // );
    if (res.getError() != 0) {
      return;
    }
    ThanhGiongNumericalHelper.scheduleForLabel(this.winValue, res.winMoney, 1);
    this.jackpotLbl.active = true;
    this.totalWinLbl.active = false;
    this.balanceValue.string = ThanhGiongCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.unscheduleAllCallbacks();
    this.scheduleOnce(this.reactivateSpinBtn, 3);
  }

  protected responseReceiveMiniResult(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveMiniGameResult();
    res.unpackData(data);
    // console.error(
    //   "THANHGIONG",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5010",
    //   cmdId,
    //   res
    // );
    if (res.getError() != 0) {
      return;
    }
    this.balance = res.currentMoney;
    this.profitAmount = res.totalPot;
    this.boosterRemainingRound.string = (
      res.totalRound - res.currentRound
    ).toString();
    let emptyChecker: number = 0;
    for (let i = 0; i < res.item.length; i++) {
      if (res.item[i].booster === -1) {
        emptyChecker += 1;
      }
    }

    if (res.totalRound === res.currentRound || emptyChecker == 0) {
      this.endBooster = true;
    }
    if (this.turboState == false) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.machineSlot.getComponent(ThanhGiongSlotMachine).letGoMini(res);
  }
  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new ThanhGiongCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    // console.error(
    //   "ThanhGiong",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "responseReceiveRoundResult",
    //   cmdId,
    //   res
    // );
    this.balance = res.currentMoney;
    this.profitAmount = res.amountProfit;
    if (this.turboState == false) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.machineSlot.getComponent(ThanhGiongSlotMachine).letGo(res);
    if (res.type == 2) {
      this.isJackpot = true;
    }
  }

  //////////////////////////  MENU FUNCTIONS  //////////////////////////

  toggleAutospinSetting() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.autoBtn.getComponent(cc.Button).interactable = false;
    if (this.autoSettingEnabled == false) {
      this.autoSettingEnabled = true;
      cc.tween(this.autoSpinSetting)
        .stop()
        .call(() => {
          this.autoSpinSetting.active = true;
        })
        .to(0.2, { position: cc.v3(0, 140, 0) })
        .call(() => {
          this.closeAutoWindow.active = true;
          this.closeAutoWindow.on(
            cc.Node.EventType.MOUSE_LEAVE,
            this.closeAutospinSetting,
            this
          );
        })
        .call(() => {
          this.autoBtn.getComponent(cc.Button).interactable = true;
        })
        .start();
    } else {
      this.closeAutoWindow.active = false;
      this.autoSettingEnabled = false;
      cc.tween(this.autoSpinSetting)
        .stop()
        .to(0.2, { position: cc.v3(0, -250, 0) })
        .call(() => {
          this.autoSpinSetting.active = false;
          this.closeAutoWindow.off(
            cc.Node.EventType.MOUSE_LEAVE,
            this.closeAutospinSetting,
            this
          );
        })
        .call(() => {
          this.autoBtn.getComponent(cc.Button).interactable = true;
        })
        .start();
    }
  }

  closeAutospinSetting() {
    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.autoSettingEnabled = false;
    this.closeAutoWindow.active = false;
    this.closeAutoWindow.off(
      cc.Node.EventType.MOUSE_LEAVE,
      this.closeAutospinSetting,
      this
    );
    cc.tween(this.autoSpinSetting)
      .stop()
      .to(0.2, { position: cc.v3(0, -250, 0) })
      .call(() => {
        this.autoSpinSetting.active = false;
      })
      .call(() => {
        this.autoBtn.getComponent(cc.Button).interactable = true;
      })
      .start();
    // this.autoSpinSetting.active = false;
  }

  stopAutoSpin() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.autoEnabled = false;
    this.autoSpinNmb = 0;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    this.notAuto = true;
  }

  closeAutoSpinSetting() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.closeAutoWindow.active = false;
    this.closeAutoWindow.off(
      cc.Node.EventType.MOUSE_LEAVE,
      this.closeAutospinSetting,
      this
    );
    this.autoSettingEnabled = false;
    cc.tween(this.autoSpinSetting)
      .stop()
      .to(0.2, { position: cc.v3(0, -250, 0) })
      .call(() => {
        this.autoSpinSetting.active = false;
      })
      .start();
  }

  autoSpinCtrl(eventdata, idx) {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.closeAutoSpinSetting();
    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.stopAutoBtn.active = true;
    this.autoEnabled = true;
    this.autoSpinNmb = Number(idx);
    this.spinBtn[0].active = false;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    // this.autoState = true;
    this.onClickSpin();
    this.notAuto = false;
  }

  turboSpinCtrl() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.turboState == false) {
      this.turboBtn[0].active = true;
      this.turboBtn[1].active = false;
      this.turboState = true;
    } else if (this.turboState == true) {
      this.turboBtn[0].active = false;
      this.turboBtn[1].active = true;
      this.turboState = false;
    }
  }

  stopInteractWhileSpins() {
    this.isSpinning = true;
    this.increaseBetBtn.getComponent(cc.Button).interactable = false;
    this.decreaseBetBtn.getComponent(cc.Button).interactable = false;
    this.betMaxBtn.interactable = false;
    this.turboToggle.interactable = false;
    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = false;
    this.spinBtn[0].active = false;
    this.closeAutoSpinSetting();
  }

  protected onClickSpin() {
    if (this.isSpinning == false) {
      this.stopInteractWhileSpins();
      ThanhGiongSoundController.instance.stopPlayLoop();
      ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      ThanhGiongNumericalHelper.scheduleForLabel(this.winValue, 0, 0);
      // this.scheduleOnce(() => {
      this.winValue.string = "0";
      // }, 0);
      this.balance -= this.currentBetLV;
      if (this.balance >= 0) {
        this.balanceValue.string = ThanhGiongCommon.numberWithCommas(
          this.balance
        );
        if (this.autoEnabled == false) {
          this.spinBtn[1].active = true;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
        } else {
          this.spinBtn[1].active = false;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
          this.stopAutoBtn.active = true;
        }
        ThanhGiongCmd.Send.sendSlotBet(this.currentBetLV);
        // ThanhGiongSlotMachine.instance.stopIdleWin();
        ThanhGiongSlotMachine.instance.letgoFake();
      } else {
        this.spinBtn[0].active = true;
        this.spinBtn[1].active = false;
        this.stopAutoBtn.active = this.notAuto ? false : true;
        this.stopAutoSpin();
        this.noti.active = true;
        this.notiMsg.string = LanguageMgr.getString(
          "thanhgiong.not_enough_money"
        );
      }
    }
  }

  protected onClickFreeSpin() {
    if (this.isSpinning == false) {
      this.stopInteractWhileSpins();
      ThanhGiongSoundController.instance.stopPlayLoop();
      // ThanhGiongSlotMachine.instance.stopIdleWin();
      this.spinBtn[1].getComponent(cc.Button).interactable = false;
      this.stopAutoBtn.active = false;
      ThanhGiongSlotMachine.instance.letgoFake();
      ThanhGiongCmd.Send.sendStartFreeGame();
    }
  }

  protected onClickMiniGame() {
    if (this.isSpinning == false) {
      cc.log(`onClickMiniGame`);
      this.respinBtn.active = false;
      this.respinBtn.getComponent(cc.Button).interactable = false;
      this.boosterNode.active = false;
      this.boosterPanel.active = false;
      this.boosterInfoBanner.active = true;
      this.unschedule(this.onClickMiniGame);
      this.stopInteractWhileSpins();
      ThanhGiongSoundController.instance.stopPlayLoop();
      this.spinBtn[1].active = true;
      this.spinBtn[1].getComponent(cc.Button).interactable = false;
      this.stopAutoBtn.active = false;
      ThanhGiongSlotMachine.instance.letgoFake();
      ThanhGiongCmd.Send.sendOpenMinigame();
    }
  }

  onclickStopSpin() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    ThanhGiongSlotMachine.instance.stopColumnSpin();
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
  }

  disableSkipSpin() {
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
  }

  reactivateSpinBtn() {
    this.unscheduleAllCallbacks();
    this.skipIdleWinBtn.active = false;
    this.skipIdleWinBtn.getComponent(cc.Button).interactable = false;
    if (this.jackpotLbl.active == true) {
      this.jackpotLbl.active = false;
      this.totalWinLbl.active = true;
      this.isJackpot = false;
    }
    ThanhGiongSlotMachine.instance.unscheduleAllCallbacks();
    ThanhGiongSlotMachine.instance.scatterCount = 0;
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
    this.balanceValue.string = ThanhGiongCommon.numberWithCommas(this.balance);
    if (this.isJackpot) {
      ThanhGiongCmd.Send.sendOpenJackpot();
    } else {
      if (this.autoEnabled == true) {
        if (this.autoSpinNmb == 0) {
          this.autoEnabled = false;
          if (this.freeSpin != true) {
            this.spinBtn[0].active = true;
          }
          this.stopAutoBtn.active = true;
          this.autoBtn.getComponent(cc.Button).interactable = true;
          if (this.endFreeSpin == true) {
            if (this.notAuto) {
              this.stopAutoSpin();
            }
            this.activateFreeSpinWindowEnd();
          } else if (this.endBooster == true) {
            // cc.log("Reactivat BoosterEnd AutoEnd");
            if (this.notAuto) {
              this.stopAutoSpin();
            }
            this.activateBoosterEnd();
          } else {
            this.reactivateSpinBtn();
          }
        } else if (this.autoSpinNmb > 0) {
          if (!this.freeSpin && !this.activeBooster) {
            this.autoSpinNmb -= 1;
          }
          this.winningWindow.active = false;
          this.profitLabel.node.active = false;
          this.unschedule(this.toggleWinNode);
          this.autoNumLbl.string = this.autoSpinNmb.toString();
          if (this.endFreeSpin == true) {
            if (this.notAuto) {
              this.stopAutoSpin();
            }
            this.activateFreeSpinWindowEnd();
          } else if (this.endBooster == true) {
            // cc.log("Reactivat BoosterEnd on Auto");
            if (this.notAuto) {
              this.stopAutoSpin();
            }
            this.activateBoosterEnd();
          } else {
            if (this.freeSpin == true) {
              this.onClickFreeSpin();
            } else if (this.activeBooster == true) {
              this.onClickMiniGame();
            } else {
              this.onClickSpin();
            }
          }
        }
      } else if (this.autoEnabled == false) {
        this.spinBtn[0].getComponent(cc.Button).interactable = true;
        this.increaseBetBtn.getComponent(cc.Button).interactable = true;
        this.decreaseBetBtn.getComponent(cc.Button).interactable = true;
        this.betMaxBtn.interactable = true;
        this.autoBtn.getComponent(cc.Button).interactable = true;
        if (this.betIndex <= 0) {
          this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
        } else if (this.betIndex >= 4) {
          this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
          this.betMaxBtn.interactable = false;
        }
        this.turboToggle.interactable = true;
        this.spinBtn[0].active = true;
        this.spinBtn[1].active = false;
      }
    }
  }

  vibrateGame() {
    if (this.vibrationEnabled == true && this.isMobile) {
      window.navigator.vibrate(1000);
    }
  }

  changeBet(eventdata, idx) {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.betIndex += Number(idx);
    if (this.betIndex < 1) {
      this.betIndex = 0;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
    } else if (this.betIndex > 5) {
      this.betIndex = 4;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
    } else {
      this.betChangeBtn[0].getComponent(cc.Button).interactable = true;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.currentBetLV = this.betLevels[this.betIndex];

    ThanhGiongCmd.Send.sendSlotJoinGame(this.currentBetLV);
  }

  changeBetMax() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.currentBetLV != this.betLevels[4]) {
      this.currentBetLV = this.betLevels[4];
      this.betIndex = 4;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = true;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
      ThanhGiongCmd.Send.sendSlotJoinGame(this.currentBetLV);
    }
  }

  toggleMenu() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.menuSlot.active = !this.menuSlot.active;
  }

  toggleSetting() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.settings.active = !this.settings.active;
    this.toggleMenu();
  }

  public getTurbo() {
    return this.turboState;
  }

  public getFreeSpin() {
    return this.freeSpin;
  }

  public getAuto() {
    return this.autoEnabled;
  }

  public getBoosterState() {
    return this.activeBooster;
  }

  public getEndBooster() {
    return this.endBooster;
  }

  //////////////////////////  MAIN GAME FUNCTIONS  //////////////////////////

  toggleWinNode() {
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
    if (this.profitAmount > 0) {
      this.vibrateGame();
      if (ThanhGiongSlotMachine.instance.longWin) {
        ThanhGiongSoundController.instance.playTypeLoop(
          ThanhGiongSoundController.instance.longWin
        );
      }

      if (this.freeSpin) {
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.freeSpinProfitTotal,
          this.totalFreeSpinProfit,
          2
        );
      }

      if (this.turboState == false) {
        if (this.profitAmount < this.currentBetLV * 10) {
          ThanhGiongNumericalHelper.scheduleForLabel(
            this.winValue,
            this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
            1.5
          );
          this.checkSpinType();
        } else {
          this.setCountDownProfit();
        }
      } else {
        this.renderTurboWin();
      }
    }
  }

  renderTurboWin() {
    if (!this.autoEnabled) {
      this.winValue.string = ThanhGiongCommon.numberWithCommas(
        this.freeSpin
          ? this.totalFreeSpinProfit.toString()
          : this.profitAmount.toString()
      );
    }
    let money = cc.instantiate(this.labelWinTurbo);
    this.turboWinContainer.addChild(money);
    money.getComponent(cc.Label).string = ThanhGiongCommon.numberWithCommas(
      this.profitAmount
    ).toString();
    cc.tween(money)
      .tag(3)
      .parallel(
        cc.tween().by(3, { position: cc.v3(0, 500, 0) }),
        cc.tween().to(3, { opacity: 0 })
      )
      .call(() => money.removeFromParent(true))
      .start();
    this.checkSpinType();
  }

  checkSpinType() {
    switch (ThanhGiongSlotMachine.instance.type) {
      case 3:
        this.activateFreeSpinWindow();
        break;
      case 4:
        this.activateBoosterWindow();
        break;
      case 1:
        ThanhGiongSlotMachine.instance.setColumnsIdleWin();
        break;
    }
  }

  activeSkipIdleWin() {
    this.skipIdleWinBtn.active = true;
    this.skipIdleWinBtn.getComponent(cc.Button).interactable = true;
  }

  activateFreeSpinWindow() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.FREEGAME_PANEL);
    this.unschedule(this.activateFreeSpinWindow);
    this.freespinWindow.active = true;
    this.freeSpin = true;
    this.resetSpecialState();
    ThanhGiongNumericalHelper.scheduleForLabel(this.winValue, 0, 0);
    this.winValue.string = "0";
    this.autoEnabled = true;
    // this.autoState = true;
    this.spinBtn[1].active = true;
    this.spinBtn[0].active = false;
    this.logo.active = false;
    this.freegamePanel.active = true;
    ThanhGiongNumericalHelper.scheduleForLabel(this.freeSpinProfitTotal, 0, 0);
    ThanhGiongSlotMachine.instance.stopIdleWin();
    let anim = this.bannerFreeSpin.getComponent(sp.Skeleton);
    anim.animation = "freespin_intro";
    anim.setCompleteListener(() => {
      anim.animation = "freespin_idle";
      setTimeout(() => {
        if (this.notAuto == true) {
          this.autoSpinNmb += 100;
        }
        anim.animation = "freespin_outro";
        this.scheduleOnce(() => {
          ThanhGiongSoundController.instance.stopSlotMusic();
          ThanhGiongSoundController.instance.playSlotMusic(
            ThanhGiongSoundController.instance.freeBGM
          );
          this.freespinWindow.active = false;
        }, 0.5);
        this.scheduleOnce(this.onClickFreeSpin, 1);
      }, 2000);
    });
  }

  activaFreespinOnReceiveInfo(remainRound, totalPot) {
    ThanhGiongSoundController.instance.stopSlotMusic();
    ThanhGiongSoundController.instance.playSlotMusic(
      ThanhGiongSoundController.instance.freeBGM
    );
    this.logo.active = false;
    this.spinBtn[1].active = true;
    this.spinBtn[0].active = false;
    this.freegamePanel.active = true;
    this.freeSpin = true;
    this.autoEnabled = true;
    // this.autoState = true;
    this.freeSpinRemainingRound.string = remainRound.toString();
    this.freeSpinProfitTotal.string =
      ThanhGiongCommon.numberWithCommas(totalPot);
    if (this.notAuto == true) {
      this.autoSpinNmb += 100;
    }
    this.scheduleOnce(this.reactivateSpinBtn, 1);
  }

  activaBoosterOnReceiveInfo() {
    ThanhGiongSoundController.instance.stopSlotMusic();
    ThanhGiongSoundController.instance.playSlotMusic(
      ThanhGiongSoundController.instance.featureBGM
    );
    this.activeBooster = true;
    this.logo.active = false;
    this.boosterBG.active = true;
    this.boosterInfoBanner.active = true;
    this.boosterSlotBG.active = true;
    this.spinBtn[1].active = true;
    this.spinBtn[0].active = false;
    // this.boosterRemainingRound.string = remainRound.toString();
    if (this.notAuto == true) {
      this.autoSpinNmb += 100;
      this.autoEnabled = true;
      cc.log(this.autoSpinNmb);
    }
    this.scheduleOnce(this.reactivateSpinBtn, 1.5);
  }

  activateBoosterWindow() {
    ThanhGiongSoundController.instance.stopSlotMusic();
    ThanhGiongSoundController.instance.playSlotMusic(
      ThanhGiongSoundController.instance.featureBGM
    );
    this.activeBooster = true;
    this.boosterPanel.active = true;
    this.logo.active = false;
    this.boosterBG.active = true;
    this.boosterNode.active = true;
    this.boosterSlotBG.active = true;
    if (this.notAuto == true) {
      this.autoSpinNmb += 100;
      this.autoEnabled = true;
    }
    this.respinBtn.active = true;
    this.respinBtn.getComponent(cc.Button).interactable = true;
    this.scheduleOnce(this.onClickMiniGame, 2);
  }

  activateBoosterEnd() {
    this.boosterInfoBanner.active = false;
    this.boosterInfoWin.active = true;
    this.boosterPanel.active = false;
    this.endBooster = false;
    this.activeBooster = false;
    ThanhGiongSlotMachine.instance.boosterPayout();
  }

  activateBoosterSummary() {
    this.boosterNode.active = true;
    this.boosterWin.active = true;
    this.boosterWin.setScale(0, 0);
    this.boosterBG.active = false;
    ThanhGiongNumericalHelper.scheduleForLabel(this.boosterWinLbl, 0, 0);
    this.boosterWinLbl.string = "0";
    cc.tween(this.boosterWin)
      .tag(3)
      .to(0.3, { scale: 1 }, { easing: "backIn" })
      .call(() => {
        this.scheduleOnce(() => {
          ThanhGiongNumericalHelper.scheduleForLabel(
            this.boosterTotalWinLbl,
            0,
            2
          );

          ThanhGiongNumericalHelper.scheduleForLabel(
            this.boosterWinLbl,
            this.profitAmount,
            2
          );
        }, 0.02);
      })
      .delay(4)
      .call(() => {
        this.boosterWin.active = false;
        this.boosterNode.active = false;
        this.boosterInfoWin.active = false;
        this.logo.active = true;
        this.boosterSlotBG.active = false;
        this.balanceValue.string = ThanhGiongCommon.numberWithCommas(
          this.balance
        );
        this.reactivateSpinBtn();
      })
      .start();
  }

  resetSpecialState() {
    this.endFreeSpin = false;
  }

  activateFreeSpinWindowEnd() {
    if (this.notAuto) {
      this.stopAutoSpin();
    }
    ThanhGiongNumericalHelper.scheduleForLabel(
      this.freeSpinProfit.getComponent(cc.Label),
      0,
      0.01
    );
    this.skipEndFreeBtn.getComponent(cc.Button).interactable = false;
    this.scheduleOnce(() => {
      this.skipEndFreeBtn.getComponent(cc.Button).interactable = true;
    }, 1);
    this.skipEndFreeBtn.active = true;
    this.closeEndFreeBtn.active = false;
    this.freeSpinProfit.getComponent(cc.Label).string = "0";
    this.freeSpin = false;
    this.freespinEndWindow.active = true;
    this.bannerFreeSpinEnd.active = true;
    this.bannerFreeSpinEnd.scale = 0;
    cc.tween(this.bannerFreeSpinEnd)
      .tag(3)
      .to(0.3, { scale: 1 }, { easing: "backIn" })
      .call(() => {
        this.scheduleOnce(() => {
          ThanhGiongNumericalHelper.scheduleForLabel(
            this.freeSpinProfit.getComponent(cc.Label),
            this.totalFreeSpinProfit,
            3
          );
        }, 0.02);
      })
      .delay(2)
      .start();
    this.scheduleOnce(this.closeFreeSpinWindowEnd, 5);
  }

  closeFreeSpinWindowEnd() {
    ThanhGiongSoundController.instance.stopSlotMusic();
    // ThanhGiongSlotMachine.instance.stopIdleWin();
    this.unschedule(this.closeFreeSpinWindowEnd);
    this.resetSpecialState();
    this.totalFreeSpinProfit = 0;
    this.logo.active = true;
    this.freegamePanel.active = false;
    ThanhGiongSoundController.instance.stopAll();
    cc.tween(this.bannerFreeSpinEnd)
      .to(0.3, { scale: 0 })
      .call(() => {
        this.freespinEndWindow.active = false;
        this.bannerFreeSpinEnd.active = false;
      })
      .start();
    this.scheduleOnce(this.reactivateSpinBtn, 1);
    setTimeout(() => {
      let bgm = ThanhGiongSoundController.instance.mainBGM;
      ThanhGiongSoundController.instance.playSlotMusic(bgm);
    }, 500);
  }

  skipFreegameSummaryCount() {
    this.unschedule(this.closeFreeSpinWindowEnd);
    this.skipEndFreeBtn.getComponent(cc.Button).interactable = false;
    this.skipEndFreeBtn.active = false;
    this.closeEndFreeBtn.active = true;
    cc.Tween.stopAllByTag(3);
    ThanhGiongNumericalHelper.scheduleForLabel(
      this.freeSpinProfit.getComponent(cc.Label),
      this.totalFreeSpinProfit,
      0.1
    );
    this.scheduleOnce(this.closeFreeSpinWindowEnd, 5);
  }

  public setCountDownProfit() {
    this.winningWindow.active = true;
    let countUpTimer = 0;

    this.skipWinBigBtn.getComponent(cc.Button).interactable = false;
    this.scheduleOnce(() => {
      this.skipWinBigBtn.getComponent(cc.Button).interactable = true;
    }, 0.5);
    this.profitLabel.node.active = false;
    this.skipWinBigBtn.active = true;
    this.closeWinBigBtn.active = false;
    ThanhGiongNumericalHelper.scheduleForLabel(this.profitLabel, 0, 0);

    if (
      //BIG
      this.profitAmount >= this.currentBetLV * 10 &&
      this.profitAmount < this.currentBetLV * 50
    ) {
      this.profitLabel.node.setPosition(0, -35, 0);
      countUpTimer = 5;
      this.winType = 0;
      this.activateBigWin();
    } else {
      if (
        //MEGA
        this.profitAmount >= this.currentBetLV * 50 &&
        this.profitAmount < this.currentBetLV * 100
      ) {
        this.profitLabel.node.setPosition(0, -75, 0);
        countUpTimer = 6;
        this.winType = 1;
        this.activateMajorWin();
      } else if (this.profitAmount >= this.currentBetLV * 100) {
        //SUPER
        this.profitLabel.node.setPosition(0, -333, 0);
        countUpTimer = 10;
        this.winType = 2;
        this.activateMegaWin();
      }
      this.scheduleOnce(this.activeCloseWinBigBtn, countUpTimer - 2);
    }
    this.scheduleOnce(this.closeWinBig, countUpTimer + 2);
  }

  activateBigWin() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BIG_WIN);
    this.winBigBanner.active = true;
    this.winBigBanner.scale = 0;

    cc.tween(this.winBigBanner)
      .tag(2)
      .to(0.3, { scale: 1 }, { easing: "backIn" })
      .call(() => {
        this.profitLabel.node.active = true;
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.winValue,
          this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
          2.5
        );
        ThanhGiongNumericalHelper.scheduleForLabel(
          this.profitLabel,
          this.profitAmount,
          2.5
        );
      })
      .start();
  }

  activateMajorWin() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.MEGA_WIN);
    this.winMajorBanner.node.active = true;
    this.winMajorBanner.animation = "grand-slam";
    this.winMajorBanner.setCompleteListener(() => {
      if (ThanhGiongSoundController.instance.getSystemVolume() > 0) {
        ThanhGiongSoundController.instance.playTypeLoop(
          ThanhGiongSoundController.instance.coinCountUp
        );
      }
      this.profitLabel.node.active = true;
      ThanhGiongNumericalHelper.scheduleForLabel(
        this.profitLabel,
        this.profitAmount,
        2.5
      );
      ThanhGiongNumericalHelper.scheduleForLabel(
        this.winValue,
        this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
        2.5
      );
      this.winMajorBanner.animation = "grand-idle";
    });
  }

  activateMegaWin() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.SUPER_WIN);
    this.winMegaBanner.node.active = true;
    this.winMegaBanner.animation = "bigwin-intro";
    this.winMegaBanner.setCompleteListener(() => {
      if (ThanhGiongSoundController.instance.getSystemVolume() > 0) {
        ThanhGiongSoundController.instance.playTypeLoop(
          ThanhGiongSoundController.instance.coinCountUp
        );
      }
      this.profitLabel.node.active = true;
      ThanhGiongNumericalHelper.scheduleForLabel(
        this.profitLabel,
        this.profitAmount,
        2
      );
      ThanhGiongNumericalHelper.scheduleForLabel(
        this.winValue,
        this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
        2
      );
      this.winMegaBanner.animation = "bigwin-idle";
    });
  }

  activeCloseWinBigBtn() {
    this.closeWinBigBtn.active = true;
    this.skipWinBigBtn.active = false;
  }

  skipWinBig() {
    this.unschedule(this.closeWinBig);
    this.unschedule(this.activeCloseWinBigBtn);
    this.activeCloseWinBigBtn();
    this.unschedule(ThanhGiongSoundController.instance.stopPlayLoop);
    ThanhGiongSoundController.instance.stopPlayLoop();
    switch (Number(this.winType)) {
      case 0:
        cc.Tween.stopAllByTag(2);
        this.winBigBanner.scale = 1;
        break;
      case 1:
        this.winMajorBanner.animation = "grand-idle";
        break;
      case 2:
        this.winMegaBanner.animation = "bigwin-idle";
        break;
    }
    ThanhGiongNumericalHelper.scheduleForLabel(
      this.profitLabel,
      this.profitAmount,
      0.01
    );

    ThanhGiongNumericalHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );

    this.scheduleOnce(this.closeWinBig, 5);
  }

  closeWinBig() {
    // ThanhGiongSoundController.instance.stopPlayAction();
    this.skipWinBigBtn.active = false;
    this.closeWinBigBtn.active = false;
    cc.Tween.stopAllByTag(2);
    this.unschedule(this.closeWinBig);
    this.unschedule(this.activeCloseWinBigBtn);

    this.winningWindow.active = false;
    this.bigWinNode.children[this.winType].active = false;
    this.profitLabel.node.active = false;
    this.checkSpinType();
  }

  toggleGuide() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.toggleMenu();
    this.ThanhGiongGuide.active = !this.ThanhGiongGuide.active;
  }

  interuptSpin() {
    ThanhGiongSlotMachine.instance.stopSpin();
  }

  //////////////////////////  TEST FUNCTIONS  //////////////////////////

  testSpin() {
    ThanhGiongSlotMachine.instance.letgoFake();
  }

  testWin() {
    this.profitAmount = 1300000;
    this.toggleWinNode();
  }

  protected testSendBet() {
    ThanhGiongCmd.Send.sendSlotBet(10000);
  }

  protected testSendFree() {
    ThanhGiongCmd.Send.sendStartFreeGame();
  }

  protected testSendJackpot() {
    ThanhGiongCmd.Send.sendOpenJackpot();
  }
  protected testSendMG() {
    ThanhGiongCmd.Send.sendOpenMinigame();
    this.activeBooster = true;
    ThanhGiongSlotMachine.instance.letgoFake();
  }

  fakeRn() {
    let res = {
      betAmount: 50000,
      item: [
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
        {
          id: 10,
          booster: 2,
        },
      ],
      result: [],
      type: 4,
      amountProfit: 0,
      currentMoney: 1826483576,
    };
    ThanhGiongSlotMachine.instance.letgoFake();
    this.profitAmount = 0;
    this.activeBooster = true;
    this.scheduleOnce(() => ThanhGiongSlotMachine.instance.letGo(res), 1);
  }
}
