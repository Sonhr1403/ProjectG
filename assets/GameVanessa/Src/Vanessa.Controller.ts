import VanessaSlotMachine from "./Vanessa.SlotMachine";
import { VanessaCmd } from "./Vanessa.Cmd";
import { VanessaConnector } from "./Connector/Vanessa.Connector";
import VanessaCommon from "./Vanessa.Common";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import VanessaSoundController, {
  SLOT_SOUND_TYPE,
} from "./Vanessa.SoundController";
import VanessaNumericalHelper from "./Vanessa.UINumericalHelper";
const { ccclass, property } = cc._decorator;


export const autoHideLogs = (function () {
  // if (env.DATA) {
    // cc.log("TEST")
    // console.error = () => {};
    // console.log = () => {};
    // console.debug = () => {};
    // cc.log = () => {};
    // cc.error = () => {};
  // }
})();

@ccclass
export default class VanessaMain extends cc.Component {
  public static instance: VanessaMain = null;
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
  private spinBtnFree: cc.Node = null;
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
  private skipWinBigBtn: cc.Node = null;
  @property(cc.Node)
  private closeWinBigBtn: cc.Node = null;
  @property(cc.Node)
  private freeSpinProfit: cc.Node = null;
  @property(cc.Label)
  private profitLabel: cc.Label = null;
  @property(dragonBones.ArmatureDisplay)
  private winBoardAnim: dragonBones.ArmatureDisplay = null;
  @property(dragonBones.ArmatureDisplay)
  private winningLetterAnim: dragonBones.ArmatureDisplay = null;
  @property(cc.Node)
  private winEffect: cc.Node = null;
  @property(cc.Label)
  private summaryLbl: cc.Label = null;
  @property(cc.Node)
  private freespinEndWindow: cc.Node = null;
  @property(cc.Node)
  private bannerFreeSpin: cc.Node = null;
  @property(cc.Node)
  private featureSummary: cc.Node = null;
  @property(cc.Label)
  private featureProfitLbl: cc.Label = null;
  @property(cc.Node)
  public freespinMeter: cc.Node[] = [];
  @property(cc.Node)
  private closeFreespinEnd: cc.Node = null;
  @property(cc.Node)
  private powerWheelNoti: cc.Node = null;
  @property(cc.Node)
  private powerWheelBanner: cc.Node = null;
  @property(cc.Node)
  public noti: cc.Node = null;
  @property(cc.Label)
  public notiMsg: cc.Label = null;
  @property(cc.Label)
  private betLvLbl: cc.Label = null;
  @property(cc.Node)
  private vanessaGuide: cc.Node = null;
  @property(cc.Node)
  private transitionWindow: cc.Node = null;
  @property(cc.Node)
  private slotScreen: cc.Node = null;
  @property(cc.Node)
  private slotScreenModel: cc.Node[] = [];
  @property(cc.Node)
  private slotScreenFree: cc.Node = null;
  @property(cc.Node)
  public slotScreenFreeModel: cc.Node = null;
  @property(cc.Node)
  private rouletteScreen: cc.Node = null;
  @property(cc.Node)
  private rouletteScreenModel: cc.Node[] = [];
  @property(cc.Node)
  private powerAnimation: cc.Node[] = [];
  @property(cc.Node)
  private animBG: cc.Node = null;
  @property(dragonBones.ArmatureDisplay)
  private rouletteWheel: dragonBones.ArmatureDisplay = null;
  @property(cc.Node)
  public freespinBtn: cc.Node = null;
  @property(cc.Node)
  private featureBtn: cc.Node = null;
  @property(cc.Node)
  private skipIdleWinBtn: cc.Node = null;
  @property(cc.Node)
  private jackpotQuestion: cc.Node = null;
  @property(cc.Node)
  private JackpotExplanation: cc.Node = null;
  @property(cc.Node)
  private closeAutoWindow: cc.Node = null;
  @property(cc.Node)
  private jackpotLbl: cc.Node = null;
  @property(cc.Node)
  private totalWinLbl: cc.Node = null;
  @property(cc.Font)
  public fontInfo: cc.Font[] = [];
  @property(cc.Font)
  public fontInfoList: cc.Font[] = [];
  @property(cc.Font)
  public fontTitle: cc.Font[] = [];
  @property(cc.Font)
  public fontSymbolTitle: cc.Font[] = [];
  @property(cc.Font)
  public fontTotalBet: cc.Font[] = [];
  @property(cc.Font)
  public fontWaysTable: cc.Font[] = [];
  @property(cc.Font)
  public fontFreespinBanner: cc.Font[] = [];
  @property(cc.Label)
  public textInfo: cc.Label[] = [];
  @property(cc.Label)
  public textInfoList: cc.Label[] = [];
  @property(cc.Label)
  public textTitle: cc.Label[] = [];
  @property(cc.Label)
  public textSymbolTitle: cc.Label[] = [];
  @property(cc.Label)
  public textTotalBet: cc.Label[] = [];
  @property(cc.Label)
  public textWaysTable: cc.Label[] = [];
  @property(cc.Label)
  public textFreespinBanner: cc.Label[] = [];
  @property(cc.Node)
  private turboWinContainer: cc.Node = null;
  @property(cc.Prefab)
  private labelWinTurbo: cc.Prefab = null;
  @property(cc.Node)
  private featurePrizeText: cc.Node[] = [];
  @property(cc.SpriteFrame)
  private powerSpinText: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  private powerPrizePrize: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  private powerClimbPrize: cc.SpriteFrame[] = [];

  public languageIndex: number = 0;
  public isSpinning: boolean = false;
  public isMobile: boolean = false;
  public vibrationEnabled: boolean = false;
  public featureWillAppear: boolean = false;
  public powerFeature: number = -1;
  private freeSpin: boolean = false;
  private profitAmount: number = 0;
  private playerHp: number = 6;
  private enemyHp: number = 6;
  private turboState: boolean = false;
  private endFreeSpin: boolean = false;
  private changeComplete: boolean = false;
  private isChanging: boolean = false;
  private betIndex = 0;
  private betLevels = [50000, 100000, 150000, 200000, 500000];
  private autoSpinNmb: number = 0;
  private currentBetLV = 0;
  private autoEnabled: boolean = false;
  private totalFreeSpinProfit: number = 0;
  private balance: number = 0;
  private freeSpinTotalRound: number = 0;
  private autoSettingEnabled: boolean = false;
  private featurePrizeIndex: number = 0;
  private notAuto: boolean = true; //CHECK IF AUTO IS ON BEFORE ENTER FREESPIN
  private itemFeatureResponse: any;
  private isJackpot;
  private major: number = 0;
  private minor: number = 0;
  private mini: number = 0;
  private previousMinor: number = 0;
  private previousMini: number = 0;
  private previousMajor: number = 0;
  onLoad() {
    VanessaMain.instance = this;
    cc.debug.setDisplayStats(false);

    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_KICK_OUT,
      this.responseUserOut,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveGameInfo,
      this
    );

    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_JACKPOT_RESULT,
      this.responseReceiveJackpotResult,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    VanessaConnector.instance.addCmdListener(
      VanessaCmd.Cmd.CMD_SLOT_OPEN_MINIGAME,
      this.responseReceiveMiniGameResult,
      this
    );
    VanessaConnector.instance.connect();

    this.closeAutoWindow.on(
      cc.Node.EventType.MOUSE_LEAVE,
      this.closeAutospinSetting,
      this
    );
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
      switch (lang) {
        case "en":
          this.changeLanguageInternal(0);
          break;

        case "vn":
          this.changeLanguageInternal(1);
          break;

        case "tl":
          this.changeLanguageInternal(2);
          break;

        case "mm":
          this.changeLanguageInternal(3);
          break;

        case "cam":
          this.changeLanguageInternal(4);
          break;
      }
    }
  }

  protected onDestroy(): void {
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_LOGIN
    );
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_JOIN_ROOM
    );
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_KICK_OUT
    );
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_GAME_INFO
    );
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_BET_FAILED
    );
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    VanessaConnector.instance.removeCmdListener(
      this,
      VanessaCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );
  }

  protected start(): void {
    cc.audioEngine.stopAll();
    cc.debug.setDisplayStats(false);

    this.isMobile = cc.sys.isMobile;
    VanessaSoundController.instance.playSlotMusic(
      VanessaSoundController.instance.mainBGM
    );
    this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = false;
    if (!this.isMobile) {
      this.jackpotQuestion.on(
        cc.Node.EventType.MOUSE_ENTER,
        this.showJackpotExplanation,
        this
      );
      this.jackpotQuestion.on(
        cc.Node.EventType.MOUSE_LEAVE,
        this.hideJackpotExplanation,
        this
      );
    } else {
      this.jackpotQuestion.on(
        cc.Node.EventType.TOUCH_START,
        this.showJackpotExplanation,
        this
      );
      this.jackpotQuestion.on(
        cc.Node.EventType.TOUCH_END,
        this.hideJackpotExplanation,
        this
      );
      this.jackpotQuestion.on(
        cc.Node.EventType.TOUCH_CANCEL,
        this.hideJackpotExplanation,
        this
      );
    }
  }

  protected onDisable(): void {
    VanessaConnector.instance.disconnect();
    if (!this.isMobile) {
      this.jackpotQuestion.off(
        cc.Node.EventType.MOUSE_ENTER,
        this.showJackpotExplanation,
        this
      );
      this.jackpotQuestion.off(
        cc.Node.EventType.MOUSE_LEAVE,
        this.hideJackpotExplanation,
        this
      );
    } else {
      this.jackpotQuestion.off(
        cc.Node.EventType.TOUCH_START,
        this.showJackpotExplanation,
        this
      );
      this.jackpotQuestion.off(
        cc.Node.EventType.TOUCH_END,
        this.hideJackpotExplanation,
        this
      );
      this.jackpotQuestion.off(
        cc.Node.EventType.TOUCH_CANCEL,
        this.hideJackpotExplanation,
        this
      );
    }
  }

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "Vanessa",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT DISCONNECT: ",
    //   cmdId
    // );
  }
  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceivedLogin();
    res.unpackData(data);
    // console.error(
    //   "Vanessa",
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
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("vanessa.connection_error");
        break;
      case 1:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("vanessa.connection_error");
        break;
      case 2:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("vanessa.connection_error");
        break;
      case 0:
        VanessaCmd.Send.sendSlotJoinGame(this.betLevels[0]);
        break;
      default:
        msg = LanguageMgr.getString("vanessa.connection_error");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
      this.notiMsg.string = LanguageMgr.getString("vanessa.connection_error");
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "Vanessa",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "JOIN ROOM",
    //   cmdId
    // );
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    // console.error(
    //   "Vanessa",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5002",
    //   cmdId,
    //   res
    // );
    this.noti.active = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = true;
    this.currentBetLV = res.betAmount;
    this.betLvLbl.string = VanessaCommon.numberWithCommas(
      res.betAmount
    ).toString();
    this.balanceValue.string = VanessaCommon.numberWithCommas(res.currentMoney);
    this.balance = res.currentMoney;

    if (res.freeGameResult != null) {
      // console.error(
      //   "Vanessa",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "START FREE GAME: ",
      //   cmdId,
      //   res
      // );
      this.autoEnabled = true;
      this.freeSpin = true;
      this.totalFreeSpinProfit = res.freeGameResult.totalPot;
      this.freeSpinTotalRound =
        6 -
        res.freeGameResult.currentSystemHP +
        (6 - res.freeGameResult.currentSystemHP);
      this.winValue.getComponent(cc.Label).string =
        VanessaCommon.numberWithCommas(res.freeGameResult.totalPot).toString();
      if (res.freeGameResult.type == 0) {
        this.activateFreeSpinWindow();
      } else {
        this.featureWillAppear = true;
        this.endFreeSpin = true;
        this.activateFeatureScreen();
      }
    } else if (res.jackpotResult != null) {
      // console.error(
      //   "Vanessa",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "OPEN POPUP JACKPOT: ",
      //   cmdId,
      //   res
      // );
      VanessaCmd.Send.sendOpenJackpot();
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveUserOut();
    res.unpackData(data);
    // console.error(
    //   "Vanessa",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT_RECEIVE_USER_OUT",
    //   cmdId,
    //   res
    // );
    this.backToLobby();
  }
  private backToLobby() {
    VanessaConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }
  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // console.error(
    //   "Vanessa",
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
        VanessaNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.majorFundBonus,
          countUpTimer
        );
      } else {
        VanessaNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.majorFundBonus,
          1
        );
      }
    }

    if (this.previousMinor !== this.minor) {
      if (this.previousMinor !== 0) {
        VanessaNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.minorFundBonus,
          countUpTimer
        );
      } else {
        VanessaNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.minorFundBonus,
          1
        );
      }
    }

    if (this.previousMini !== this.mini) {
      if (this.previousMinor !== 0) {
        VanessaNumericalHelper.scheduleForLabel(
          this.jackpotFundMini,
          res.miniFundBonus,
          countUpTimer
        );
      } else {
        VanessaNumericalHelper.scheduleForLabel(
          this.jackpotFundMini,
          res.miniFundBonus,
          1
        );
      }
    }
  }

  public scheduleForLbl(
    startMoney: number,
    totalMoney: number,
    time: number,
    majorType: number
  ) {
    let profit = startMoney;
    let totalProfit = totalMoney;
    let profitStep = (totalMoney - startMoney) / (time * 100);

    function increaseMajorLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseMajorLbl);
        this.jackpotFundMajor.string =
          VanessaCommon.numberWithCommas(totalProfit);
      } else {
        this.jackpotFundMajor.string = VanessaCommon.numberWithCommas(profit);
      }
    }

    function decreaseMajorLbl() {
      profit += profitStep;
      if (profit <= totalProfit) {
        this.unschedule(decreaseMajorLbl);
        this.jackpotFundMajor.string =
          VanessaCommon.numberWithCommas(totalProfit);
      } else {
        this.jackpotFundMajor.string = VanessaCommon.numberWithCommas(profit);
      }
    }

    function increaseMinorLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseMinorLbl);
        this.jackpotFundMinor.string =
          VanessaCommon.numberWithCommas(totalProfit);
      } else {
        this.jackpotFundMinor.string = VanessaCommon.numberWithCommas(profit);
      }
    }

    function decreaseMinorLbl() {
      profit += profitStep;
      if (profit <= totalProfit) {
        this.unschedule(decreaseMinorLbl);
        this.jackpotFundMinor.string =
          VanessaCommon.numberWithCommas(totalProfit);
      } else {
        this.jackpotFundMinor.string = VanessaCommon.numberWithCommas(profit);
      }
    }

    function increaseMiniLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseMiniLbl);
        this.jackpotFundMini.string =
          VanessaCommon.numberWithCommas(totalProfit);
      } else {
        this.jackpotFundMini.string = VanessaCommon.numberWithCommas(profit);
      }
    }

    function decreaseMiniLbl() {
      profit += profitStep;
      if (profit <= totalProfit) {
        this.unschedule(decreaseMiniLbl);
        this.jackpotFundMini.string =
          VanessaCommon.numberWithCommas(totalProfit);
      } else {
        this.jackpotFundMini.string = VanessaCommon.numberWithCommas(profit);
      }
    }

    if (majorType == 1) {
      if (startMoney < totalMoney) {
        this.schedule(increaseMajorLbl, 0.001);
      } else if (startMoney > totalMoney) {
        this.schedule(decreaseMajorLbl, 0.001);
      }
    } else if (majorType == 2) {
      if (startMoney < totalMoney) {
        this.schedule(increaseMinorLbl, 0.001);
      } else if (startMoney > totalMoney) {
        this.schedule(decreaseMinorLbl, 0.001);
      }
    } else if (majorType == 3) {
      if (startMoney < totalMoney) {
        this.schedule(increaseMiniLbl, 0.001);
      } else if (startMoney > totalMoney) {
        this.schedule(decreaseMiniLbl, 0.001);
      }
    }
  }

  // 5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    // console.error(
    //   "Vanessa",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5005",
    //   cmdId,
    //   res
    // );

    this.noti.active = true;
    this.notiMsg.string = LanguageMgr.getString("vanessa.bet_error");
  }

  // 5006

  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    console.error(
      "Vanessa",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5008",
      cmdId,
      res
    );
    if (res.getError() != 0) {
      return;
    }

    if (this.turboState == false) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.freeSpinTotalRound += 1;
    this.summaryLbl.string = this.freeSpinTotalRound.toString();
    this.profitAmount = res.amountProfit;
    this.balance = res.currentMoney;
    this.totalFreeSpinProfit = res.totalPot;
    this.machineSlot.getComponent(VanessaSlotMachine).letGo(res);
    this.playerHp = res.currentUserHP + 1;
    this.enemyHp = res.currentSystemHP + 1;

    if (res.currentSystemHP == 0) {
      this.featureWillAppear = true;
      // leader.playAnimation("lose", -1);
    } else if (res.currentUserHP == 0) {
      this.endFreeSpin = true;
    }
  }

  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    // console.error(
    //   "SLOT_51",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5006",
    //   cmdId,
    //   res
    // );
    if (res.getError() != 0) {
      return;
    }
    VanessaNumericalHelper.scheduleForLabel(this.winValue, res.winMoney, 1);
    this.jackpotLbl.active = true;
    this.totalWinLbl.active = false;
    this.balanceValue.string = VanessaCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.unscheduleAllCallbacks();
    this.scheduleOnce(this.reactivateSpinBtn, 5);
  }

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    console.error(
      "Vanessa",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "responseReceiveRoundResult",
      cmdId,
      res
    );
    this.balance = res.currentMoney;
    this.profitAmount = res.amountProfit;
    if (this.turboState == false) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.machineSlot.getComponent(VanessaSlotMachine).letGo(res);
    if (res.jackpotAmount > 0) {
      this.isJackpot = true;
    }
  }

  protected responseReceiveMiniGameResult(cmdId: any, data: Uint8Array) {
    let res = new VanessaCmd.SlotReceiveMiniGameResult();
    res.unpackData(data);
    // console.error(
    //   "Vanessa",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "responseReceiveMiniGameResult",
    //   cmdId,
    //   res
    // );
    this.balance = res.currentMoney;
    this.powerFeature = res.type;
    this.totalFreeSpinProfit = res.totalPot;
    // this.featurePrizeIndex = res.powerWheelMultiple;
    this.featureProfitLbl.string = VanessaCommon.numberWithCommas(
      res.amountProfit
    ).toString();

    switch (Number(res.type)) {
      case 1:
        this.itemFeatureResponse = res;
        this.featurePrizeIndex = res.powerWheelMultiple;
        switch (res.powerWheelMultiple) {
          case 0:
            VanessaSlotMachine.instance.powerSpinColumn = [1];
            break;
          case 1:
            VanessaSlotMachine.instance.powerSpinColumn = [3];
            break;
          case 2:
            VanessaSlotMachine.instance.powerSpinColumn = [4];
            break;
          case 3:
            VanessaSlotMachine.instance.powerSpinColumn = [1, 3];
            break;
          case 4:
            VanessaSlotMachine.instance.powerSpinColumn = [1, 4];
            break;
          case 5:
            VanessaSlotMachine.instance.powerSpinColumn = [3, 4];
            break;
        }
        break;
      case 2:
        let indexClimb: number = -1;
        switch (res.powerWheelMultiple) {
          case 2:
            indexClimb = 0;
            break;
          case 3:
            indexClimb = 1;
            break;
          case 4:
            indexClimb = 2;
            break;
          case 5:
            indexClimb = 3;
            break;
          case 6:
            indexClimb = 4;
            break;
        }
        this.featurePrizeIndex = indexClimb;
        break;
      case 3:
        let indexPrize: number = -1;
        switch (res.powerWheelMultiple) {
          case 10:
            indexPrize = 0;
            break;
          case 20:
            indexPrize = 1;
            break;
          case 50:
            indexPrize = 2;
            break;
          case 60:
            indexPrize = 3;
            break;
          case 80:
            indexPrize = 4;
            break;
          case 100:
            indexPrize = 5;
            break;
        }
        this.featurePrizeIndex = indexPrize;
        break;
    }
    this.playAnimFeature(this.powerFeature);
  }

  toggleAutospinSetting() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.scheduleOnce(
      () => (this.autoBtn.getComponent(cc.Button).interactable = true),
      0.4
    );
    // this.spinBtn[0].active = !this.spinBtn[0].active;
    // this.autoBtn[0].active = !this.autoBtn[0].active;
    if (this.autoSettingEnabled == false) {
      this.autoSettingEnabled = true;
      cc.tween(this.autoSpinSetting)
        .stop()
        .call(() => {
          this.autoSpinSetting.active = true;
        })
        .to(0.2, { position: cc.v3(0, 90, 0) })
        .call(() => {
          this.closeAutoWindow.active = true;
          this.closeAutoWindow.on(
            cc.Node.EventType.MOUSE_LEAVE,
            this.closeAutospinSetting,
            this
          );
        })
        .start();
    } else {
      this.closeAutoWindow.active = false;
      this.autoSettingEnabled = false;
      cc.tween(this.autoSpinSetting)
        .stop()
        .to(0.1, { position: cc.v3(0, -250, 0) })
        .call(() => {
          this.autoSpinSetting.active = false;
          this.closeAutoWindow.off(
            cc.Node.EventType.MOUSE_LEAVE,
            this.closeAutospinSetting,
            this
          );
        })
        .start();
    }
  }

  closeAutospinSetting() {
    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.scheduleOnce(
      () => (this.autoBtn.getComponent(cc.Button).interactable = true),
      0.3
    );
    this.autoSettingEnabled = false;
    this.closeAutoWindow.active = false;
    this.closeAutoWindow.off(
      cc.Node.EventType.MOUSE_LEAVE,
      this.closeAutospinSetting,
      this
    );
    cc.tween(this.autoSpinSetting)
      .stop()
      .to(0.1, { position: cc.v3(0, -250, 0) })
      .call(() => {
        this.autoSpinSetting.active = false;
      })

      .start();
    // this.autoSpinSetting.active = false;
  }

  stopAutoSpin() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    // this.autoBtn[1].active = true;
    // this.autoBtn[0].active = true;
    // this.autoSpinSetting.active = false;
    this.autoSpinNmb = 0;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    this.notAuto = true;
  }

  closeAutoSpinSetting() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.closeAutoWindow.active = false;
    this.closeAutoWindow.off(
      cc.Node.EventType.MOUSE_LEAVE,
      this.closeAutospinSetting,
      this
    );
    // this.autoSpinSetting.active = false;
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
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.closeAutoSpinSetting();
    // this.autoBtn[0].active = false;
    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.stopAutoBtn.active = true;
    this.autoEnabled = true;
    this.autoSpinNmb = Number(idx);
    this.spinBtn[0].active = false;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    this.onClickSpin();
    this.notAuto = false;
  }

  turboSpinCtrl() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

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

  modelChange(index) {
    if (index == 0) {
      this.slotScreenModel[0]
        .getComponent(dragonBones.ArmatureDisplay)
        .playAnimation("spin", -1);

      VanessaSoundController.instance.playType(
        SLOT_SOUND_TYPE.LEADER_START_CHANGE
      );

      this.slotScreenModel[0].getComponent(dragonBones.ArmatureDisplay).once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.slotScreenModel[0]
            .getComponent(dragonBones.ArmatureDisplay)
            .playAnimation("change", -1);

          VanessaSoundController.instance.playType(
            SLOT_SOUND_TYPE.LEADER_DONE_CHANGE
          );

          this.slotScreenModel[0]
            .getComponent(dragonBones.ArmatureDisplay)
            .once(
              dragonBones.EventObject.COMPLETE,
              () => {
                this.slotScreenModel[0].active = false;
                this.slotScreenModel[0]
                  .getComponent(dragonBones.ArmatureDisplay)
                  .playAnimation("idle", -1);
              },
              this.slotScreenModel[0]
            );
        },
        this.slotScreenModel[0].getComponent(dragonBones.ArmatureDisplay)
      );
      this.slotScreenModel[0]
        .getComponent(dragonBones.ArmatureDisplay)
        .scheduleOnce(() => {
          this.activateForm(index);
        }, 2);
    } else {
      this.rouletteScreenModel[0]
        .getComponent(dragonBones.ArmatureDisplay)
        .playAnimation("spin", -1);

      VanessaSoundController.instance.playType(
        SLOT_SOUND_TYPE.LEADER_START_CHANGE
      );

      this.rouletteScreenModel[0]
        .getComponent(dragonBones.ArmatureDisplay)
        .once(
          dragonBones.EventObject.COMPLETE,
          () => {
            this.rouletteScreenModel[0]
              .getComponent(dragonBones.ArmatureDisplay)
              .playAnimation("change", -1);

            VanessaSoundController.instance.playType(
              SLOT_SOUND_TYPE.LEADER_DONE_CHANGE
            );

            this.rouletteScreenModel[0]
              .getComponent(dragonBones.ArmatureDisplay)
              .once(
                dragonBones.EventObject.COMPLETE,
                () => {
                  this.rouletteScreenModel[0].active = false;
                  this.rouletteScreenModel[0]
                    .getComponent(dragonBones.ArmatureDisplay)
                    .playAnimation("idle", -1);
                },
                this.rouletteScreenModel[0]
              );
          },
          this.rouletteScreenModel[0].getComponent(dragonBones.ArmatureDisplay)
        );
      this.rouletteScreenModel[0]
        .getComponent(dragonBones.ArmatureDisplay)
        .scheduleOnce(() => {
          this.activateForm(index);
        }, 2);
    }
  }

  activateForm(index) {
    switch (index) {
      case 0:
        this.slotScreenModel[1].active = true;
        this.slotScreenModel[1]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation("idle", -1);
        this.changeComplete = true;
        break;
      case 1:
        this.rouletteScreenModel[1].active = true;
        this.rouletteScreenModel[1]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation("idle", -1);
        break;
      case 2:
        this.rouletteScreenModel[2].active = true;
        this.rouletteScreenModel[2]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation("idle", -1);
        break;
      case 3:
        this.rouletteScreenModel[3].active = true;
        this.rouletteScreenModel[3]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation("idle", -1);
        break;
    }
    if (this.featureWillAppear == true) {
      this.scheduleOnce(() => this.playPowerAnim(), 1);
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
      VanessaSoundController.instance.stopPlayLoop();

      VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

      VanessaNumericalHelper.scheduleForLabel(this.winValue, 0, 0.0001);
      this.scheduleOnce(() => {
        this.winValue.string = "0";
      }, 0);

      if (this.changeComplete == false && this.isChanging == false) {
        this.isChanging = true;
        this.modelChange(0);
      }

      this.balance -= this.currentBetLV;
      if (this.balance >= 0) {
        this.balanceValue.string = VanessaCommon.numberWithCommas(this.balance);
        if (this.autoEnabled == false) {
          this.spinBtn[1].active = true;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
        } else {
          this.spinBtn[1].active = false;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
          this.stopAutoBtn.active = true;
        }
        VanessaCmd.Send.sendSlotBet(this.currentBetLV);
        VanessaSlotMachine.instance.stopIdleWin();
        VanessaSlotMachine.instance.letgoFake();
      } else {
        this.spinBtn[0].active = true;
        this.spinBtn[1].active = false;
        this.stopAutoBtn.active = this.notAuto ? false : true;
        this.stopAutoSpin();
        this.noti.active = true;
        this.notiMsg.string = LanguageMgr.getString("vanessa.not_enough_money");
      }
    }
  }

  protected onClickFreeSpin() {
    if (this.isSpinning == false) {
      this.slotScreenFreeModel
        .getComponent(dragonBones.ArmatureDisplay)
        .playAnimation("spin", -1);
      this.slotScreenFreeModel.getComponent(dragonBones.ArmatureDisplay).once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.slotScreenFreeModel
            .getComponent(dragonBones.ArmatureDisplay)
            .playAnimation("idle", -1);
        },
        this.slotScreenFreeModel.getComponent(dragonBones.ArmatureDisplay)
      );
      this.stopInteractWhileSpins();
      VanessaSoundController.instance.stopPlayLoop();

      VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      VanessaSoundController.instance.playType(
        SLOT_SOUND_TYPE.LEADER_FREE_START_SPIN
      );

      VanessaSlotMachine.instance.stopIdleWin();
      this.spinBtn[1].getComponent(cc.Button).interactable = false;
      this.stopAutoBtn.active = false;
      VanessaSlotMachine.instance.letgoFake();
      VanessaCmd.Send.sendStartFreeGame();
    }
  }

  onclickStopSpin() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    VanessaSlotMachine.instance.stopColumnSpin();
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
  }

  disableSkipSpin() {
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
  }

  reactivateSpinBtn() {
    this.unscheduleAllCallbacks();
    if (this.jackpotLbl.active == true) {
      this.jackpotLbl.active = false;
      this.totalWinLbl.active = true;
      this.isJackpot = false;
    }
    VanessaSlotMachine.instance.unscheduleAllCallbacks();
    VanessaSlotMachine.instance.scatterCount = 0;
    this.spinBtn[1].getComponent(cc.Button).interactable = false;

    if (this.isJackpot) {
      VanessaCmd.Send.sendOpenJackpot();
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
          } else if (this.featureWillAppear == true) {
            this.activateFeatureScreen();
          } else {
            this.reactivateSpinBtn();
          }
        } else if (this.autoSpinNmb > 0) {
          if (this.freeSpin == false) {
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
          } else if (this.featureWillAppear == true) {
            this.activateFeatureNoti();
            this.slotScreenFreeModel
              .getComponent(dragonBones.ArmatureDisplay)
              .playAnimation("loss", -1);
          } else {
            if (this.freeSpin == true) {
              this.onClickFreeSpin();
              // this.fakeRnFree();
            } else {
              this.onClickSpin();
            }
          }
        }
      } else if (this.autoEnabled == false) {
        if (this.freeSpin == false) {
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

  public getTurbo() {
    return this.turboState;
  }
  public getPlayerHP() {
    return this.playerHp;
  }
  public getSystemHP() {
    return this.enemyHp;
  }
  public getFreeSpin() {
    return this.freeSpin;
  }

  changeModelWin() {
    if (this.freeSpin == false) {
      if (this.changeComplete == true) {
        this.slotScreenModel[1].active = true;
        this.slotScreenModel[1]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation("win", -1);
        this.slotScreenModel[1].getComponent(dragonBones.ArmatureDisplay).once(
          dragonBones.EventObject.COMPLETE,
          () => {
            this.slotScreenModel[1]
              .getComponent(dragonBones.ArmatureDisplay)
              .playAnimation("idle", -1);
          },
          this.slotScreenModel[1].getComponent(dragonBones.ArmatureDisplay)
        );
      }
    } else {
      this.slotScreenFreeModel
        .getComponent(dragonBones.ArmatureDisplay)
        .playAnimation("win", -1);
      this.slotScreenFreeModel.getComponent(dragonBones.ArmatureDisplay).once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.slotScreenFreeModel
            .getComponent(dragonBones.ArmatureDisplay)
            .playAnimation("idle", -1);
        },
        this.slotScreenFreeModel.getComponent(dragonBones.ArmatureDisplay)
      );
    }
  }

  toggleWinNode() {
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
    if (this.profitAmount > 0) {
      if (this.freeSpin) {
        VanessaSoundController.instance.playType(
          SLOT_SOUND_TYPE.LEADER_FREE_WIN
        );
      } else {
        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.LEADER_WIN);
      }

      this.vibrateGame();
      if (VanessaSlotMachine.instance.longWin) {
        VanessaSoundController.instance.playTypeLoop(
          VanessaSoundController.instance.longWin
        );
      }

      this.changeModelWin();
      if (!this.freeSpin) {
        this.balanceValue.string = VanessaCommon.numberWithCommas(this.balance);
      }
      if (this.profitAmount < this.currentBetLV * 10) {
        if (this.turboState == false) {
          VanessaSlotMachine.instance.setColumnsIdleWin();
          VanessaNumericalHelper.scheduleForLabel(
            this.winValue,
            this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
            2
          );
          this.scheduleOnce(
            VanessaSlotMachine.instance.type != 3
              ? this.reactivateSpinBtn
              : this.activateFreeSpinWindow,
            2.5
          );
        } else {
          this.winValue.string = VanessaCommon.numberWithCommas(
            this.freeSpin
              ? this.totalFreeSpinProfit.toString()
              : this.profitAmount.toString()
          );
          let money = cc.instantiate(this.labelWinTurbo);
          this.turboWinContainer.addChild(money);
          money.getComponent(cc.Label).string = VanessaCommon.numberWithCommas(
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
          this.scheduleOnce(
            VanessaSlotMachine.instance.type != 3
              ? this.reactivateSpinBtn
              : this.activateFreeSpinWindow,
            1 // 1
          );
        }
      } else {
        this.setCountDownProfit(this.profitAmount);
      }
    }
  }

  skipSmallWin() {
    VanessaNumericalHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );
    this.skipIdleWinBtn.active = false;
    VanessaSlotMachine.instance.type != 3
      ? this.reactivateSpinBtn()
      : this.activateFreeSpinWindow();
  }

  activateFreeSpinWindow() {
    VanessaSoundController.instance.stopSlotMusic();
    VanessaSoundController.instance.playSlotMusic(
      VanessaSoundController.instance.freeBGM
    );
    this.toggleTransitionWindow();
    this.unschedule(this.activateFreeSpinWindow);
    VanessaNumericalHelper.scheduleForLabel(this.winValue, 0, 0.0001);
    this.slotScreenFreeModel
      .getComponent(dragonBones.ArmatureDisplay)
      .playAnimation("idle", -1);
    this.freeSpin = true;
    this.resetSpecialState();
    VanessaNumericalHelper.scheduleForLabel(this.winValue, 0, 0);
    this.winValue.string = "0";
    this.autoEnabled = true;
    this.spinBtn[1].active = true;
    this.spinBtn[0].active = false;
    this.freespinBtn.active = false;

    VanessaSlotMachine.instance.stopIdleWin();
    setTimeout(() => {
      if (this.notAuto == true) {
        this.autoSpinNmb += 100;
      }
      this.slotScreen.active = false;
      this.slotScreenFree.active = true;
      this.freespinMeter[0]
        .getComponent(dragonBones.ArmatureDisplay)
        .playAnimation("p1_init", -1);
      this.freespinMeter[1]
        .getComponent(dragonBones.ArmatureDisplay)
        .playAnimation("p2_init", -1);
      this.scheduleOnce(this.onClickFreeSpin, 1);
    }, 500);
  }

  resetSpecialState() {
    this.featureWillAppear = false;
    this.endFreeSpin = false;
    this.featureSummary.active = false;

    VanessaSlotMachine.instance.powerSpinColumn = [2];
  }

  activateFreeSpinWindowEnd() {
    if (this.notAuto) {
      this.stopAutoSpin();
    }
    VanessaNumericalHelper.scheduleForLabel(
      this.freeSpinProfit.getComponent(cc.Label),
      0,
      0
    );

    this.freeSpinProfit.getComponent(cc.Label).string = "0";
    this.featureBtn.active = false;
    this.freeSpin = false;
    this.freespinEndWindow.active = true;
    if (this.featureWillAppear == true) {
      this.featureSummary.active = true;
    }
    this.bannerFreeSpin.active = true;
    this.bannerFreeSpin.scale = 0;
    cc.tween(this.bannerFreeSpin)
      .to(0.3, { scale: 1 }, { easing: "backIn" })
      .call(() => {
        this.scheduleOnce(() => {
          VanessaNumericalHelper.scheduleForLabel(
            this.freeSpinProfit.getComponent(cc.Label),
            this.totalFreeSpinProfit,
            1.8
          );
        }, 0.01);
      })
      .delay(2.1)
      .call(() => {
        this.closeFreespinEnd.active = true;
      })
      .start();
    this.scheduleOnce(this.closeFreeSpinWindowEnd, 7);
  }

  closeFreeSpinWindowEnd() {
    VanessaSoundController.instance.stopSlotMusic();
    VanessaSlotMachine.instance.stopIdleWin();
    this.unschedule(this.closeFreeSpinWindowEnd);
    this.resetSpecialState();
    this.freeSpinTotalRound = 0;
    this.toggleTransitionWindow();
    this.closeFreespinEnd.active = false;
    this.playerHp = 6;
    this.enemyHp = 6;
    this.totalFreeSpinProfit = 0;
    VanessaSoundController.instance.stopAll();
    cc.tween(this.bannerFreeSpin)
      .to(0.3, { scale: 0 })
      .call(() => {
        this.freespinEndWindow.active = false;
        this.bannerFreeSpin.active = false;
      })
      .start();
    this.scheduleOnce(this.reactivateSpinBtn, 1);
    setTimeout(() => {
      this.balanceValue.string = VanessaCommon.numberWithCommas(this.balance);
      this.rouletteScreen.active = false;
      this.featureSummary.active = false;
      this.slotScreenFree.active = false;
      this.slotScreen.active = true;
      this.slotScreenModel[0].active = true;
      this.slotScreenModel[1].active = false;
      this.isChanging = false;
      this.changeComplete = false;
      let bgm = VanessaSoundController.instance.mainBGM;
      VanessaSoundController.instance.playSlotMusic(bgm);
    }, 500);
  }

  activateFeatureNoti() {
    this.powerWheelNoti.active = true;
    this.powerWheelBanner.active = true;
    this.powerWheelBanner.scale = 0;
    cc.tween(this.powerWheelBanner)
      .to(0.3, { scale: 1 }, { easing: "bounceIn" })
      .delay(2)
      .call(() => this.closeFeatureNoti())
      .start();
  }

  closeFeatureNoti() {
    VanessaSoundController.instance.stopAll();
    cc.tween(this.powerWheelBanner)
      .to(0.3, { scale: 0 })
      .call(() => {
        this.powerWheelBanner.active = false;
        this.powerWheelNoti.active = false;
      })
      .call(() => this.activateFeatureScreen())
      .start();
  }

  activateFeatureScreen() {
    this.toggleTransitionWindow();
    this.featureBtn.active = true;
    this.scheduleOnce(() => {
      this.featureBtn.getComponent(cc.Button).interactable = true;
      this.slotScreenFree.active = true;
      this.rouletteWheel.playAnimation("idle", -1);
      this.rouletteScreen.active = true;
      for (let i = 0; i < 4; i++) {
        if (i == 0) {
          this.rouletteScreenModel[i].active = true;
        } else {
          this.rouletteScreenModel[i].active = false;
        }
      }
      // this.scheduleOnce(() => {this.playAnimFeature(this.powerFeature)}, 1); //TODO: FOR TESTING
      this.scheduleOnce(this.activateFeatureSpin, 3);
    }, 0.5);
  }

  activateFeatureSpin() {
    this.unschedule(this.activateFeatureSpin);
    this.featureBtn.getComponent(cc.Button).interactable = false;
    // this.playAnimFeature(this.powerFeature);
    this.featureWillAppear = true;
    VanessaCmd.Send.sendOpenMinigame();
  }

  playAnimFeature(index) {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.ROULETTE_WIN);

    let animationName = "feature" + index;
    let animationNameLoop = "feature" + index + "_loop";
    this.rouletteWheel.playAnimation(animationName, -1);
    this.rouletteWheel.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        this.rouletteWheel.playAnimation(animationNameLoop, -1);
        this.rouletteWheel.scheduleOnce(() => {
          this.modelChange(index);
        }, 1);
      },
      this.slotScreenModel[0].getComponent(dragonBones.ArmatureDisplay)
    );
  }

  playPowerAnim() {
    // 0 : Default
    // 1 : Camera: SPIN
    // 2 : Police: CLIMB
    // 3 : Sword: PRIZE
    for (let i = 0; i < 3; i++) {
      this.featurePrizeText[i].active = false;
    }
    this.animBG.active = true;
    let featureType = this.powerFeature - 1;
    let anim1 = this.powerAnimation[featureType].children[0].getComponent(
      dragonBones.ArmatureDisplay
    );
    let anim2 = this.powerAnimation[featureType].children[1].getComponent(
      dragonBones.ArmatureDisplay
    );
    let anim3 = this.powerAnimation[featureType].children[2].getComponent(
      dragonBones.ArmatureDisplay
    );

    anim1.node.active = true;

    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.FRAME_ONE);

    anim1.playAnimation("play", -1);
    anim1.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        anim1.node.active = false;
        anim2.node.active = true;
        this.rouletteScreen.active = false;
        anim2.playAnimation("play", -1);

        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.FRAME_TWO);

        anim2.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            anim2.node.active = false;
            anim3.node.active = true;

            VanessaSoundController.instance.playType(
              SLOT_SOUND_TYPE.FRAME_THREE
            );

            anim3.playAnimation("play", -1);

            switch (this.powerFeature) {
              case 1:
                this.featurePrizeText[0].setPosition(-1700, -180);
                this.featurePrizeText[0].getComponent(cc.Sprite).spriteFrame =
                  this.powerSpinText[this.featurePrizeIndex];
                this.featurePrizeText[0].active = true;

                cc.tween(this.featurePrizeText[0])
                  .call(() => (this.featurePrizeText[0].active = true))
                  .to(
                    0.6,
                    { position: cc.v3(-30, -180, 0) },
                    { easing: "backIn" }
                  )
                  .delay(5)
                  .start();

                break;
              case 2:
                this.featurePrizeText[2].getComponent(cc.Sprite).spriteFrame =
                  this.powerClimbPrize[this.featurePrizeIndex];
                this.scheduleOnce(() => {
                  this.featurePrizeText[2].active = true;
                }, 1);
                break;
              case 3:
                this.featurePrizeText[1].getComponent(cc.Sprite).spriteFrame =
                  this.powerPrizePrize[this.featurePrizeIndex];

                this.scheduleOnce(() => {
                  this.featurePrizeText[1].active = true;
                }, 0.6);
                break;
            }
            anim3.once(
              dragonBones.EventObject.COMPLETE,
              () => {
                anim3.node.active = false;
                if (this.powerFeature > 1) {
                  let anim4 = this.powerAnimation[
                    featureType
                  ].children[3].getComponent(dragonBones.ArmatureDisplay);
                  anim4.node.active = true;
                  anim4.playAnimation("play", -1);
                  VanessaSoundController.instance.playType(
                    SLOT_SOUND_TYPE.FRAME_FOUR
                  );

                  anim4.once(
                    dragonBones.EventObject.COMPLETE,
                    () => {
                      anim4.node.active = false;
                      this.animBG.active = false;
                      this.activateFreeSpinWindowEnd();
                    },
                    anim4
                  );
                } else {
                  this.toggleTransitionWindow();
                  this.animBG.active = false;
                  this.endFreeSpin = true;
                  this.slotScreen.active = false;
                  VanessaSlotMachine.instance.letgoFake();
                  this.slotScreenFreeModel
                    .getComponent(dragonBones.ArmatureDisplay)
                    .playAnimation("idle", -1);
                  this.scheduleOnce(
                    () =>
                      VanessaSlotMachine.instance.letGo(
                        this.itemFeatureResponse
                      ),
                    1
                  );
                }
              },
              anim3
            );
          },
          anim2
        );
      },
      anim1
    );
  }

  toggleTransitionWindow() {
    cc.tween(this.transitionWindow)
      .to(0.3, { opacity: 255 })
      .delay(0.2)
      .to(0.3, { opacity: 0 })
      .start();
  }

  public setCountDownProfit(profit) {
    if (this.turboState == false) {
      this.winningWindow.active = true;
      let countUpTimer = 0;
      this.profitLabel.node.active = true;
      this.skipWinBigBtn.getComponent(cc.Button).interactable = false;
      this.scheduleOnce(() => {
        this.skipWinBigBtn.getComponent(cc.Button).interactable = true;
      }, 1.2);
      this.skipWinBigBtn.active = true;
      this.closeWinBigBtn.active = false;
      var startAnim;
      var loopAnim;
      var endAnim;
      this.winningLetterAnim.node.active = true;
      this.winningLetterAnim.node.setPosition(0, 35, 0);
      this.winBoardAnim.node.setPosition(0, -215, 0);
      this.winBoardAnim.playAnimation("start", -1);
      this.winEffect.setPosition(0, 30, 0);
      this.winBoardAnim.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.winBoardAnim.playAnimation("loop", 0);
        },
        this.winBoardAnim
      );
      if (
        //BIG
        this.profitAmount >= this.currentBetLV * 10 &&
        this.profitAmount < this.currentBetLV * 50
      ) {
        countUpTimer = 8;
        startAnim = "start_Big";
        loopAnim = "loop_Big";
        endAnim = "exit_Big";

        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BIG_WIN);
      } else if (
        //MEGA
        this.profitAmount >= this.currentBetLV * 50 &&
        this.profitAmount < this.currentBetLV * 100
      ) {
        countUpTimer = 12;
        startAnim = "start_Mega";
        loopAnim = "loop_Mega";
        endAnim = "exit_Mega";

        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.MEGA_WIN);
      } else if (this.profitAmount >= this.currentBetLV * 100) {
        //SUPER
        countUpTimer = 15;
        startAnim = "start_Super";
        loopAnim = "loop_Super";
        endAnim = "exit_Super";

        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.SUPER_WIN);
      }
      this.winningLetterAnim.playAnimation(startAnim, -1);
      this.winningLetterAnim.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.winningLetterAnim.playAnimation(loopAnim, 0);
        },
        this.winningLetterAnim
      );
      this.winningLetterAnim.scheduleOnce(() => {
        this.winningLetterAnim.playAnimation(endAnim, -1);
        this.winningLetterAnim.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            this.winningLetterAnim.playAnimation("idle", 0);
          },
          this.winningLetterAnim
        );
      }, 5);
      VanessaNumericalHelper.scheduleForLabel(this.profitLabel, 0, 0.001);
      this.scheduleOnce(() => {
        if (VanessaSoundController.instance.getSystemVolume() > 0) {
          VanessaSoundController.instance.playTypeLoop(
            VanessaSoundController.instance.coinCountUp
          );
        }
        VanessaNumericalHelper.scheduleForLabel(
          this.profitLabel,
          this.profitAmount,
          countUpTimer
        );
        VanessaNumericalHelper.scheduleForLabel(
          this.winValue,
          this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
          countUpTimer
        );
      }, 0.03);

      cc.tween(this.winBoardAnim.node)
        .tag(2)
        .delay(5)
        .to(1, { position: new cc.Vec3(0, 400, 0) }, { easing: "smooth" })
        .start();
      cc.tween(this.winEffect)
        .tag(2)
        .delay(5)
        .to(1, { position: new cc.Vec3(0, 510, 0) }, { easing: "smooth" })
        .start();

      this.scheduleOnce(this.activeCloseWinBigBtn, countUpTimer - 2);
      this.scheduleOnce(
        VanessaSoundController.instance.stopPlayLoop,
        countUpTimer
      );
      this.scheduleOnce(this.closeWinBig, countUpTimer + 5);
    } else {
      let money = cc.instantiate(this.labelWinTurbo);
      this.winValue.string = VanessaCommon.numberWithCommas(
        this.freeSpin
          ? this.totalFreeSpinProfit.toString()
          : this.profitAmount.toString()
      );
      this.turboWinContainer.addChild(money);
      money.getComponent(cc.Label).string = VanessaCommon.numberWithCommas(
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
      this.scheduleOnce(
        VanessaSlotMachine.instance.type != 3
          ? this.reactivateSpinBtn
          : this.activateFreeSpinWindow,
        1 // 1
      );
    }
  }

  activeCloseWinBigBtn() {
    this.closeWinBigBtn.active = true;
    this.skipWinBigBtn.active = false;
  }

  skipWinBig() {
    this.closeWinBigBtn.active = true;
    this.skipWinBigBtn.active = false;
    this.unschedule(this.closeWinBig);
    this.unschedule(this.activeCloseWinBigBtn);
    this.unschedule(VanessaSoundController.instance.stopPlayLoop);
    VanessaSoundController.instance.stopPlayLoop();
    cc.Tween.stopAllByTag(2);
    this.winBoardAnim.node.stopAllActions();
    this.winEffect.stopAllActions();
    this.winningLetterAnim.unscheduleAllCallbacks();
    this.winningLetterAnim.playAnimation("idle", -1);
    this.winningLetterAnim.node.active = false;
    this.winBoardAnim.node.setPosition(0, 400, 0);
    this.winEffect.setPosition(0, 510, 0);
    this.winBoardAnim.playAnimation("loop", 0);

    VanessaNumericalHelper.scheduleForLabel(
      this.profitLabel,
      this.profitAmount,
      0.01
    );

    VanessaNumericalHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );

    this.profitLabel.string = VanessaCommon.numberWithCommas(
      this.profitAmount
    ).toString();
  }

  closeWinBig() {
    VanessaSoundController.instance.stopPlayAction();
    VanessaSlotMachine.instance.setColumnsIdleWin();
    this.skipWinBigBtn.active = false;
    this.closeWinBigBtn.active = false;
    cc.Tween.stopAllByTag(2);
    this.unschedule(this.closeWinBig);
    this.unschedule(this.activeCloseWinBigBtn);
    this.winningWindow.active = false;
    this.profitLabel.node.active = false;
    VanessaSlotMachine.instance.type != 3
      ? this.reactivateSpinBtn()
      : this.activateFreeSpinWindow();
  }

  toggleGuide() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.toggleMenu();
    this.vanessaGuide.active = !this.vanessaGuide.active;
  }

  interuptSpin() {
    VanessaSlotMachine.instance.stopSpin();
  }

  changeBet(eventdata, idx) {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

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

    VanessaCmd.Send.sendSlotJoinGame(this.currentBetLV);
  }

  changeBetMax() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.currentBetLV != this.betLevels[4]) {
      this.currentBetLV = this.betLevels[4];
      this.betIndex = 4;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = true;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
      VanessaCmd.Send.sendSlotJoinGame(this.currentBetLV);
    }
  }

  toggleMenu() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.menuSlot.active = !this.menuSlot.active;
  }

  toggleSetting() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.settings.active = !this.settings.active;
    this.toggleMenu();
  }

  showJackpotExplanation() {
    this.JackpotExplanation.active = true;
  }

  hideJackpotExplanation() {
    this.JackpotExplanation.active = false;
  }

  /////////////  TEST FUNCTIONS  /////////////

  testSpin() {
    VanessaSlotMachine.instance.letgoFake();
  }

  testWin() {
    this.profitAmount = 231;
    this.toggleWinNode();
  }

  fakeRn() {
    let res = {
      betAmount: 50000,
      item: [
        {
          id: 3,
          bomb: 0,
        },
        {
          id: 5, //Column 2
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 3, //column 2
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5, //Column 2
          bomb: 0,
        },
        {
          id: 3,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
      ],
      result: [[0, 1, 2, 3, 4]],
      type: 3,
      amountProfit: 1000000,
      currentMoney: 1826483576,
    };
    VanessaSlotMachine.instance.letgoFake();
    this.scheduleOnce(() => VanessaSlotMachine.instance.letGo(res), 1);
  }

  protected testSendBet() {
    VanessaCmd.Send.sendSlotBet(50000);
  }

  protected testSendFree() {
    VanessaCmd.Send.sendStartFreeGame();
  }

  protected stopTestSpin() {
    VanessaSlotMachine.instance.stopTestSpin();
  }

  testFeature() {
    this.powerFeature = 1;
    this.featurePrizeIndex = 0;
    this.featureWillAppear = true;
    this.activateFeatureScreen();
  }

  private changeLanguageInternal(idx) {
    this.languageIndex = idx;
    let lang: string;
    let index: number;
    switch (Number(idx)) {
      case 0:
        lang = "en";
        index = 0;
        break;
      case 1:
        lang = "vn";
        index = 1;
        break;
      case 2:
        lang = "tl";
        index = 2;
        break;
      case 3:
        lang = "en";
        index = 0;
        break;
      case 4:
        lang = "en";
        index = 0;
        break;
      default:
        lang = "en";
        index = 0;
        break;
    }

    for (let a = 0; a <= 1; a++) {
      this.textWaysTable[a].font = this.fontWaysTable[index];
    }
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
    LanguageMgr.updateLang(lang);

    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_LABEL,
      this
    );
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPRITE,
      this
    );
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPINE,
      this
    );
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
    LanguageMgr.instance.setCurrentLanguage(lang);
    LanguageMgr.updateLocalization(lang);
    for (let i = 0; i <= 18; i++) {
      this.textInfo[i].font = this.fontInfo[idx];
    }
    for (let i = 0; i < 7; i++) {
      this.textTitle[i].font = this.fontTitle[idx];
    }
    for (let i = 0; i < 15; i++) {
      this.textInfoList[i].font = this.fontInfoList[idx];
    }
    for (let i = 0; i < 3; i++) {
      this.textFreespinBanner[i].font = this.fontFreespinBanner[idx];
      this.textSymbolTitle[i].font = this.fontSymbolTitle[idx];
      this.textTotalBet[i].font = this.fontTotalBet[idx];
    }
  }
}
