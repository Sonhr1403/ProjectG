import TQSlotMachine from "./TQ.SlotMachine";
import { TQCmd } from "./TQ.Cmd";
import { TQConnector } from "./Connector/TQ.Connector";
import TQCommon from "./TQ.Common";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import TQSoundController, { SLOT_SOUND_TYPE } from "./TQ.SoundController";
import TQNumericalHelper from "../../Game_TQ/Src/TQ.UINumericLblHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TQMain extends cc.Component {
  public static instance: TQMain = null;
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
  private languageMenu: cc.Node = null;
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
  private iconWinContainer: cc.Node = null;
  @property(cc.Node)
  private autoBtn: cc.Node[] = [];
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
  @property(cc.Button)
  private autoSettingToggle: cc.Button = null;

  @property(cc.Sprite)
  private betBarLv: cc.Sprite = null;
  @property(cc.Label)
  private betValue: cc.Label = null;
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
  private freeSpinWindow: cc.Node = null;
  @property(cc.Node)
  private freeSpinMeter: cc.Node = null;
  @property(cc.Node)
  private freeSpinTotal: cc.Node = null;
  @property(cc.Node)
  private freeSpinCurrent: cc.Node = null;
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
  private closeFreespinEnd: cc.Node = null;
  @property(cc.Node)
  public noti: cc.Node = null;
  @property(cc.Label)
  public notiMsg: cc.Label = null;
  @property(cc.Label)
  private betLvLbl: cc.Label = null;
  @property(cc.Node)
  public iconContainer: cc.Node = null;
  @property(cc.Label)
  public msgLbl: cc.Label = null;
  @property(cc.Node)
  private tqInfoNode: cc.Node = null;
  @property(cc.Node)
  private tqGuide: cc.Node = null;
  @property(cc.Node)
  private slotScreens: cc.Node[] = [];
  @property(cc.Node)
  private slotScreensFree: cc.Node[] = [];
  @property(dragonBones.ArmatureDisplay)
  public wildWaveEffect: dragonBones.ArmatureDisplay = null;
  @property(cc.Node)
  private trolley: cc.Node = null;
  @property(cc.Node)
  public freespinBtn: cc.Node = null;
  @property(cc.Node)
  public jackpotBtn: cc.Node = null;

  @property(cc.Node)
  public jackpotLbl: cc.Node = null;
  @property(cc.Node)
  public totalWinLbl: cc.Node = null;

  @property(cc.Node)
  private skipIdleWinBtn: cc.Node = null;
  @property(cc.Node)
  private freegameTransition: cc.Node = null;
  @property(cc.Node)
  private jackpotQuestion: cc.Node = null;
  @property(cc.Node)
  private JackpotExplanation: cc.Node = null;
  @property(cc.Node)
  private soundCtrl: cc.Node = null;
  @property(cc.Label)
  private volumeLevelLbl: cc.Label = null;
  @property(cc.Slider)
  private volumeSlider: cc.Slider = null;
  @property(cc.Label)
  private numWaysLbl: cc.Label = null;
  @property(cc.Node)
  private closeAutoWindow: cc.Node = null;

  @property(cc.Font)
  public fontInfo: cc.Font[] = [];
  @property(cc.Font)
  public fontTitle: cc.Font[] = [];
  @property(cc.Font)
  public fontScene: cc.Font[] = [];
  @property(cc.Font)
  public fontTitleLayout: cc.Font[] = [];
  @property(cc.Font)
  public fontWaysTable: cc.Font[] = [];
  @property(cc.Font)
  public fontFreespinBanner: cc.Font[] = [];

  @property(cc.Label)
  public textInfo: cc.Label[] = [];
  @property(cc.Label)
  public textTitle: cc.Label[] = [];
  @property(cc.Label)
  public textScene: cc.Label[] = [];
  @property(cc.Label)
  public textTitleLayout: cc.Label[] = [];
  @property(cc.Label)
  public textWaysTable: cc.Label[] = [];
  @property(cc.Label)
  public textFreespinBanner: cc.Label[] = [];

  @property(cc.Node)
  private turboWinContainer: cc.Node = null;
  @property(cc.Prefab)
  private labelWinTurbo: cc.Prefab = null;

  @property(cc.Node)
  private jackpotNode: cc.Node = null;
  @property(cc.Node)
  private jackpotAnim: cc.Node = null;
  @property(cc.Node)
  private closeJackpot: cc.Node = null;
  @property(cc.Node)
  private skipJackpot: cc.Node = null;
  @property(cc.Label)
  public jackpotWinLbl: cc.Label = null;

  public slotOrientation = 3; // 3 = Zhang Fei (WAVE) || 2 = Guan Yu (BOMB) || 1 = Zhuge Liang (FIRE) //ScreenUpdate
  public isSpinning: boolean = false;
  public freeSpin: boolean = false;
  public isMobile: boolean = false;
  public freeSpinNumber: number = 0;
  public autoState: boolean = false;
  public vibrationEnabled: boolean = false;
  public languageIndex: number = 0;
  private _isGameActive: boolean = true;
  private hideTime: number = null;
  private turboState: boolean = false;
  private profitAmount: number = 0;
  private freespinTotalProfit: number = 0;
  private currentScene = 2;
  private betIndex = 0;
  private betLevels = [10000, 20000, 30000, 50000, 100000];
  private fillLevel = [0.8, 0.6, 0.4, 0.2, 0];
  private winWays = [576, 432, 324];
  private autoSpinNmb: number = 0;
  private currentBetLV = 0;
  private autoEnabled: boolean = false;
  private totalFreeSpinProfit: number = 0;
  private balance: number = 0;
  private _localTimer: number = 0;
  private endFreeSpin: boolean = false;
  private infiniteSpin: boolean = false;
  private changeSceneCounter: number = 0;
  private autoSettingEnabled: boolean = false;
  private isJackpot: boolean = false;
  private major: number = 0;
  private minor: number = 0;
  private mini: number = 0;
  private previousMinor: number = 0;
  private previousMini: number = 0;
  private previousMajor: number = 0;
  onLoad() {
    TQMain.instance = this;
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_KICK_OUT,
      this.responseUserOut,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveGameInfo,
      this
    );

    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_JACKPOT_RESULT,
      this.responseReceiveJackpotResult,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    TQConnector.instance.addCmdListener(
      TQCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    TQConnector.instance.connect();
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
      let tempIndex: number = 0;
      switch (lang) {
        case "en":
          this.changeLanguageInternal(0);
          tempIndex = 0;
          break;
        case "vn":
          this.changeLanguageInternal(1);
          tempIndex = 1;
          break;
        case "tl":
          this.changeLanguageInternal(2);
          tempIndex = 2;
          break;
        case "mm":
          this.changeLanguageInternal(0);
          tempIndex = 0;
          break;
        case "cam":
          this.changeLanguageInternal(0);
          tempIndex = 0;
          break;
      }
      this.languageIndex = tempIndex;
    } else {
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en");
      LanguageMgr.updateLang("en");
      this.languageMenu.children[0].children[0].getChildByName(
        "selected"
      ).active = true;
      this.changeLanguageInternal(0);
      this.languageIndex = 0;
    }

    for (let i = 0; i < this.slotScreens.length; i++) {
      this.slotScreens[i].active = false;
      if (i == this.slotOrientation - 1) {
        this.slotScreens[i].active = true;
        this.slotScreens[i].setPosition(0, 0);
        this.numWaysLbl.string = this.winWays[i].toString();
      }
    }
  }

  protected onDestroy(): void {
    TQConnector.instance.removeCmdListener(this, TQCmd.Cmd.CMD_SLOT_LOGIN);
    TQConnector.instance.removeCmdListener(this, TQCmd.Cmd.CMD_SLOT_JOIN_ROOM);
    TQConnector.instance.removeCmdListener(this, TQCmd.Cmd.CMD_SLOT_KICK_OUT);
    TQConnector.instance.removeCmdListener(this, TQCmd.Cmd.CMD_SLOT_GAME_INFO);
    TQConnector.instance.removeCmdListener(this, TQCmd.Cmd.CMD_SLOT_BET_FAILED);
    TQConnector.instance.removeCmdListener(
      this,
      TQCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    TQConnector.instance.removeCmdListener(
      this,
      TQCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );
  }

  protected start(): void {
    cc.audioEngine.stopAll();
    this.iconContainer.active = false;
    cc.debug.setDisplayStats(false);
    this.msgLbl.getComponent(cc.Label).string = LanguageMgr.getString(
      "threekingdom.game_msg_start"
    );
    this.isMobile = cc.sys.isMobile;
    TQSoundController.instance.playSlotMusic(
      TQSoundController.instance.zhangBGM
    );
    this.changeSceneCounter = TQCommon.getRandomNumber(5, 30);
    this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
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
    TQConnector.instance.disconnect();
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
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT DISCONNECT: ",
    //   cmdId
    // );
  }
  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceivedLogin();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
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
        msg = LanguageMgr.getString("threekingdom.connection_error");
        break;
      case 1:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("threekingdom.connection_error");
        break;
      case 2:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("threekingdom.connection_error");
        break;
      case 0:
        TQCmd.Send.sendSlotJoinGame(this.betLevels[0]);
        break;
      default:
        msg = LanguageMgr.getString("threekingdom.connection_error");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
      this.notiMsg.string = LanguageMgr.getString(
        "threekingdom.connection_error"
      );
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "JOIN ROOM",
    //   cmdId
    // );
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5002",
    //   cmdId,
    //   res
    // );

    // this.grandJackpotLbl.string = TQCommon.numberWithCommas(
    //   res.amountFundBonus
    // ).toString();

    this.currentBetLV = res.betAmount;
    this.betValue.string = TQCommon.numberWithCommas(res.betAmount).toString();
    this.betLvLbl.string = TQCommon.numberWithCommas(res.betAmount).toString();
    this.balanceValue.string = TQCommon.numberWithCommas(res.currentMoney);
    this.balance = res.currentMoney;
    if (res.freeGameResult != null) {
      // cc.error(
      //   "TQ",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "START FREE GAME: ",
      //   cmdId,
      //   res
      // );
      this.autoState = true;
      this.autoEnabled = true;
      this.freeSpin = true;
      this.freeSpinNumber = Number(
        Number(res.freeGameResult.totalRound) -
          Number(res.freeGameResult.currentRound)
      );
      this.freeSpinTotal.getComponent(cc.Label).string =
        res.freeGameResult.totalRound.toString();
      this.freeSpinCurrent.getComponent(cc.Label).string =
        res.freeGameResult.currentRound.toString();
      this.winValue.getComponent(cc.Label).string = TQCommon.numberWithCommas(
        res.freeGameResult.totalPot
      ).toString();
      this.msgLbl.string =
        LanguageMgr.getString("threekingdom.game_msg_freespin_played") +
        " " +
        res.freeGameResult.currentRound.toString() +
        "/" +
        res.freeGameResult.totalRound.toString();
      if (res.freeGameResult.scene != 3) {
        this.changeSceneSlotOnReceiveGame(res.freeGameResult.scene);
      } else {
        this.activateFreeSpinWindow();
      }
    } else if (res.jackpotResult != null) {
      // cc.error(
      //   "TQ",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "OPEN POPUP JACKPOT: ",
      //   cmdId,
      //   res
      // );
      this.isJackpot = true;
      this.autoSettingToggle.interactable = false;
      this.betMaxBtn.interactable = false;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
      this.onclickJackpot();
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceiveUserOut();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT_RECEIVE_USER_OUT",
    //   cmdId,
    //   res
    // );
    this.backToLobby();
  }
  private backToLobby() {
    // TQConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }
  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
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
        TQNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.majorFundBonus,
          countUpTimer
        );
      } else {
        TQNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.majorFundBonus,
          0.3
        );
      }
    }

    if (this.previousMinor !== this.minor) {
      if (this.previousMinor !== 0) {
        TQNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.minorFundBonus,
          countUpTimer
        );
      } else {
        TQNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.minorFundBonus,
          0.3
        );
      }
    }

    if (this.previousMini !== this.mini) {
      if (this.previousMinor !== 0) {
        TQNumericalHelper.scheduleForLabel(
          this.jackpotFundMini,
          res.miniFundBonus,
          countUpTimer
        );
      } else {
        TQNumericalHelper.scheduleForLabel(
          this.jackpotFundMini,
          res.miniFundBonus,
          0.3
        );
      }
    }
  }

  // 5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5005",
    //   cmdId,
    //   res
    // );
    this.noti.active = true;
    this.notiMsg.string = LanguageMgr.getString("threekingdom.bet_error");
  }

  // 5006

  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    // this.interuptSpin();
    let res = new TQCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5008",
    //   cmdId,
    //   res
    // );
    if (res.getError() != 0) {
      return;
    }

    if (res.totalRound == res.currentRound) {
      this.endFreeSpin = true;
      this.summaryLbl.string = res.totalRound.toString();
    }
    if (this.turboState == false) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.profitAmount = res.amountProfit;
    this.freespinTotalProfit = res.totalPot;
    this.freeSpinTotal.getComponent(cc.Label).string =
      res.totalRound.toString();
    this.freeSpinCurrent.getComponent(cc.Label).string =
      res.currentRound.toString();
    this.balanceValue.string = TQCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.totalFreeSpinProfit = res.totalPot;
    // this.winValue.getComponent(cc.Label).string = res.totalPot.toString(); //TODO: RMV LATER
    this.iconContainer.removeAllChildren();
    this.iconContainer.active = false;
    this.msgLbl.string =
      LanguageMgr.getString("threekingdom.game_msg_freespin_played") +
      " " +
      res.currentRound.toString() +
      "/" +
      res.totalRound.toString();
    this.machineSlot.getComponent(TQSlotMachine).letGo(res);
  }

  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    // cc.error(
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
    // TQNumericalHelper.scheduleForLabel(this.winValue, res.winMoney, 2);
    this.jackpotLbl.active = true;
    this.totalWinLbl.active = false;
    this.balanceValue.string = TQCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.profitAmount = res.winMoney;
    this.toggleAnimJackpot();
  }

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new TQCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    // cc.error(
    //   "TQ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "responseReceiveRoundResult",
    //   cmdId,
    //   res
    // );
    this.profitAmount = res.amountProfit;
    this.balance = res.currentMoney;
    if (this.turboState == false) {
      this.spinBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.machineSlot.getComponent(TQSlotMachine).letGo(res);
    if (res.jackpotAmount > 0) {
      this.isJackpot = true;
    }
  }

  toggleAutospinSetting() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.autoBtn[0].getComponent(cc.Button).interactable = false;
    // cc.log("toggleAutospinSetting", this.autoSettingEnabled);
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
        .call(() => {
          this.autoBtn[0].getComponent(cc.Button).interactable = true;
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
          this.autoBtn[0].getComponent(cc.Button).interactable = true;
        })
        .start();
    }
    // this.autoSpinSetting.active = !this.autoSpinSetting.active;
  }

  closeAutospinSetting() {
    // cc.log("closeAutospinSetting");
    // this.spinBtn[0].active = true;
    // this.autoBtn[0].active = false;
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
      .start();
    // this.autoSpinSetting.active = false;
  }

  stopAutoSpin() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.autoBtn[1].active = true;
    // this.autoBtn[0].active = true;
    // this.autoSpinSetting.active = false;
    this.autoEnabled = false;
    this.autoState = false;
    this.autoSpinNmb = 0;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    // this.autoNumNode.active = false;
  }

  closeAutoSpinSetting() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
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
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.closeAutoSpinSetting();
    // this.autoBtn[0].active = false;
    this.autoBtn[1].active = true;
    this.autoEnabled = true;
    if (idx == 8) {
      this.infiniteSpin = true;
    }
    this.autoSpinNmb = Number(idx);
    this.spinBtn[0].active = false;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    if (this.infiniteSpin == true) {
      this.autoNumLbl.string = "∞";
    }
    this.autoState = true;
    this.onClickSpin();
    // this.autoNumNode.active = true;
  }
  turboSpinCtrl() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
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

  protected onClickSpin() {
    if (this.isSpinning == false) {
      TQSoundController.instance.stopPlayLoop();
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      }
      if (this.freeSpin == false) {
        TQNumericalHelper.scheduleForLabel(this.winValue, 0, 0);
        this.scheduleOnce(() => {
          this.winValue.string = "0";
        }, 0.001);
      }
      this.iconContainer.active = false;
      this.iconContainer.removeAllChildren();
      this.msgLbl.getComponent(cc.Label).string = LanguageMgr.getString(
        "threekingdom.game_msg_spin_start"
      );
      this.isSpinning = true;
      let leader = this.slotScreens[this.currentScene]
        .getChildByName("NLeader")
        .getComponent(dragonBones.ArmatureDisplay);
      leader.playAnimation("spin", -1);
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(SLOT_SOUND_TYPE.LEADER_START_SPIN);
      }
      leader.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          leader.playAnimation("idle", 0);
        },
        leader
      );
      this.closeAutoSpinSetting();
      if (this.jackpotLbl.active == true) {
        this.jackpotLbl.active = false;
        this.totalWinLbl.active = true;
      }
      this.increaseBetBtn.getComponent(cc.Button).interactable = false;
      this.decreaseBetBtn.getComponent(cc.Button).interactable = false;
      this.betMaxBtn.interactable = false;
      this.autoSettingToggle.interactable = false;

      this.spinBtn[0].getComponent(cc.Button).interactable = false;
      this.balance -= this.currentBetLV;
      if (this.balance > 0) {
        this.balanceValue.string = TQCommon.numberWithCommas(this.balance);
        this.spinBtn[0].active = false;
        if (this.autoEnabled == false) {
          this.spinBtn[1].active = true;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
        }
        // else {
        //   this.spinBtn[1].active = true;
        //   this.spinBtn[1].getComponent(cc.Button).interactable = false;
        // }
        switch (this.freeSpin) {
          case true:
            TQCmd.Send.sendStartFreeGame();
            break;

          case false:
            TQCmd.Send.sendSlotBet(this.slotOrientation, this.currentBetLV);
            break;
        }

        TQSlotMachine.instance.stopIdleWin();
        TQSlotMachine.instance.letgoFake();
        this.turboToggle.interactable = false;
      } else {
        let msg = LanguageMgr.getString("threekingdom.not_enough_money");
        this.noti.active = true;
        this.notiMsg.string = LanguageMgr.getString(
          "threekingdom.not_enough_money"
        );
      }
    }
  }

  protected onClickFreeSpin() {
    if (this.isSpinning == false) {
      this.turboToggle.interactable = false;
      TQSoundController.instance.stopPlayLoop();
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      }

      this.closeAutoSpinSetting();
      this.increaseBetBtn.getComponent(cc.Button).interactable = false;
      this.decreaseBetBtn.getComponent(cc.Button).interactable = false;
      this.betMaxBtn.interactable = false;
      TQSlotMachine.instance.stopIdleWin();
      this.autoSettingToggle.interactable = false;
      this.iconContainer.removeAllChildren();
      this.iconContainer.active = false;
      this.isSpinning = true;
      let leader = this.slotScreensFree[this.currentScene]
        .getChildByName("NLeader")
        .getComponent(dragonBones.ArmatureDisplay);
      leader.playAnimation("spin_free", -1);
      leader.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          leader.playAnimation("idle_free", 0);
        },
        leader
      );
      let leaderFree = this.slotScreensFree[this.currentScene]
        .getChildByName("NLeaderWhite")
        .getComponent(dragonBones.ArmatureDisplay);
      leaderFree.playAnimation("spin", -1);
      leaderFree.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          leaderFree.playAnimation("idle", 0);
        },
        leaderFree
      );
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(SLOT_SOUND_TYPE.LEADER_START_SPIN);
        TQSoundController.instance.playType(
          SLOT_SOUND_TYPE.LEADER_FREE_START_SPIN
        );
      }
      TQCmd.Send.sendStartFreeGame();
      TQSlotMachine.instance.letgoFake();
    }
  }

  onclickStopSpin() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    TQSlotMachine.instance.stopColumnSpin();
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
  }

  reactivateSpinBtn() {
    // cc.log("reactivate", this.isJackpot, this.autoEnabled, this.autoSpinNmb);
    this.unscheduleAllCallbacks();
    this.skipIdleWinBtn.active = false;
    TQSlotMachine.instance.unscheduleAllCallbacks();
    TQSlotMachine.instance.scatterCount = 0;
    TQSlotMachine.instance.isBombWild = false;
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
    this.balanceValue.string = TQCommon.numberWithCommas(this.balance);
    if (this.isJackpot == false) {
      if (this.changeSceneCounter > 0) {
        if (this.autoEnabled == true) {
          if (this.autoSpinNmb == 0) {
            this.autoEnabled = false;
            if (this.freeSpin != true) {
              this.spinBtn[0].active = true;
            }
            this.autoBtn[1].active = false;
            if (this.endFreeSpin == true) {
              this.activateFreeSpinWindowEnd();
            } else {
              this.reactivateSpinBtn();
            }
          } else if (this.autoSpinNmb > 0) {
            // if (this.isJackpot == true) {
            //   this.stopAutoSpin();
            //   this.autoSettingToggle.interactable = false;
            //   this.betMaxBtn.interactable = false;
            //   this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
            //   this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
            //   this.onclickJackpot();
            // } else {
            this.autoSpinNmb -= 1;
            this.winningWindow.active = false;
            this.profitLabel.node.active = false;
            this.unschedule(this.toggleWinNode);
            this.autoNumLbl.string = this.autoSpinNmb.toString();
            if (this.endFreeSpin == true) {
              this.activateFreeSpinWindowEnd();
            } else {
              if (this.freeSpin == true) {
                this.onClickFreeSpin();
              } else {
                this.onClickSpin();
                this.changeSceneCounter -= 1;
              }
            }
            // }
          }
        } else if (this.autoEnabled == false) {
          // if (this.isJackpot == true) {
          //   this.stopAutoSpin();
          //   this.autoSettingToggle.interactable = false;
          //   this.betMaxBtn.interactable = false;
          //   this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
          //   this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
          //   this.onclickJackpot();
          // } else {
          if (this.freeSpin == false) {
            this.spinBtn[0].getComponent(cc.Button).interactable = true;
            this.increaseBetBtn.getComponent(cc.Button).interactable = true;
            this.decreaseBetBtn.getComponent(cc.Button).interactable = true;
            this.betMaxBtn.interactable = true;
            this.autoSettingToggle.interactable = true;
            if (this.betIndex <= 0) {
              this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
            } else if (this.betIndex >= 4) {
              this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
            }
          }
          this.turboToggle.interactable = true;
          this.spinBtn[0].active = true;
          this.spinBtn[1].active = false;
          // }
        }
      } else if (this.changeSceneCounter == 0) {
        this.changeSceneCounter = TQCommon.getRandomNumber(5, 50);
        this.changeSceneSlot();
      }
    } else {
      this.autoSettingToggle.interactable = false;
      this.betMaxBtn.interactable = false;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
      this.onclickJackpot();
      // this.fakeJackpot();
    }
  }

  toggleWinNode() {
    if (this.profitAmount > 0) {
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(SLOT_SOUND_TYPE.LEADER_WIN);
        if (this.freeSpin) {
          TQSoundController.instance.playType(SLOT_SOUND_TYPE.LEADER_FREE_WIN);
        }
      }
      if (this.vibrationEnabled == true && this.isMobile) {
        window.navigator.vibrate(1000);
      }
      if (TQSlotMachine.instance.longWin) {
        TQSoundController.instance.playTypeLoop(
          TQSoundController.instance.longWin
        );
      }

      this.msgLbl.getComponent(cc.Label).string =
        LanguageMgr.getString("threekingdom.game_msg_win") +
        TQCommon.numberWithCommas(this.profitAmount).toString();
      if (this.freeSpin == false) {
        let leader = this.slotScreens[this.currentScene]
          .getChildByName("NLeader")
          .getComponent(dragonBones.ArmatureDisplay);
        leader.playAnimation("win", -1);
        leader.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            leader.playAnimation("idle", 0);
          },
          leader
        );
      } else {
        let leader = this.slotScreensFree[this.currentScene]
          .getChildByName("NLeader")
          .getComponent(dragonBones.ArmatureDisplay);
        leader.playAnimation("win_free", -1);
        leader.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            leader.playAnimation("idle_free", 0);
          },
          leader
        );
        let leaderWhite = this.slotScreensFree[this.currentScene]
          .getChildByName("NLeaderWhite")
          .getComponent(dragonBones.ArmatureDisplay);
        leaderWhite.playAnimation("win", -1);
        leaderWhite.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            leaderWhite.playAnimation("idle", 0);
          },
          leaderWhite
        );
      }
      if (this.profitAmount < this.currentBetLV * 10) {
        if (this.turboState == false) {
          this.skipIdleWinBtn.active = true;
          TQSlotMachine.instance.setColumnsIdleWin();
          TQNumericalHelper.scheduleForLabel(
            this.winValue,
            this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
            3
          );
        } else {
          this.winValue.string = TQCommon.numberWithCommas(
            this.freeSpin
              ? this.totalFreeSpinProfit.toString()
              : this.profitAmount.toString()
          );
          let money = cc.instantiate(this.labelWinTurbo);
          this.turboWinContainer.addChild(money);
          money.getComponent(cc.Label).string = TQCommon.numberWithCommas(
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
          if (TQSlotMachine.instance.type != 3) {
            this.scheduleOnce(this.reactivateSpinBtn, 1.2);
          }
        }
      } else {
        this.setCountDownProfit(this.profitAmount);
      }
    }
  }

  skipSmallWin() {
    TQNumericalHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );
  }

  activateFreeSpinWindow() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.LEADER_TRANSITION);
    }
    TQSoundController.instance.stopSlotMusic();
    let bgmFree: any;
    switch (this.slotOrientation) {
      case 1:
        bgmFree = TQSoundController.instance.zhugeFreeBGM;
        break;
      case 2:
        bgmFree = TQSoundController.instance.guanFreeBGM;
        break;
      case 3:
        bgmFree = TQSoundController.instance.zhangFreeBGM;
        break;
    }
    TQSoundController.instance.playSlotMusic(bgmFree);
    TQNumericalHelper.scheduleForLabel(this.winValue, 0, 0.0001);
    this.freespinBtn.active = false;
    this.freeSpin = true;
    this.autoEnabled = true;
    this.autoState = true;
    let transition = this.freegameTransition.children[this.currentScene];
    transition.active = true;
    transition
      .getComponent(dragonBones.ArmatureDisplay)
      .playAnimation("ani", -1);
    transition.getComponent(dragonBones.ArmatureDisplay).once(
      dragonBones.EventObject.COMPLETE,
      () => {
        transition
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation("loop", 0);
        transition.active = false;
      },
      transition
    );
    TQNumericalHelper.scheduleForLabel(this.winValue, 0, 0.0001);
    this.scheduleOnce(() => {
      this.winValue.string = "0";
    }, 0.001);
    this.spinBtn[1].active = true;
    this.spinBtn[0].active = false;
    this.freespinBtn.active = false;
    setTimeout(() => {
      this.autoSpinNmb += this.freeSpinNumber;
      this.machineSlot.active = false;
      this.freeSpinMeter.active = true;
      this.slotScreensFree[this.currentScene].active = true;
      this.slotScreensFree[this.currentScene].setPosition(0, 0, 0);
      this.slotScreens[this.currentScene].active = false;
      this.machineSlot.active = true;
      this.machineSlot.setPosition(-40, -22.493, 0);
      this.scheduleOnce(this.onClickFreeSpin, 1);
    }, 1000);
  }

  activateFreeSpinWindowEnd() {
    this.freeSpin = false;
    this.freeSpinNumber = 0;
    this.endFreeSpin = false;
    this.freeSpinMeter.active = false;
    this.freespinEndWindow.active = true;
    this.bannerFreeSpin.active = true;
    this.bannerFreeSpin.scale = 0;
    this.spinBtn[1].active = false;
    cc.tween(this.bannerFreeSpin)
      .to(0.3, { scale: 1 })
      .call(() => {
        // if (this.totalFreeSpinProfit == 0) {
        //   this.freeSpinProfit.getComponent(cc.Label).string = "0";
        //   TQNumericalHelper.scheduleForLabel(
        //     this.freeSpinProfit.getComponent(cc.Label),
        //     0,
        //     0
        //   );
        // } else {
        this.freeSpinProfit.getComponent(cc.Label).string = "0";
        TQNumericalHelper.scheduleForLabel(
          this.freeSpinProfit.getComponent(cc.Label),
          0,
          0
        );
        this.scheduleOnce(() => {
          TQNumericalHelper.scheduleForLabel(
            this.freeSpinProfit.getComponent(cc.Label),
            this.freespinTotalProfit,
            2
          );
        }, 0.01);
        // }
      })
      .delay(2)
      .call(() => {
        this.closeFreespinEnd.active = true;
      })
      .start();
    this.freeSpinCurrent.getComponent(cc.Label).string = "";
    this.freeSpinTotal.getComponent(cc.Label).string = "";
    this.scheduleOnce(this.closeFreeSpinWindowEnd, 8);
  }

  closeFreeSpinWindowEnd() {
    TQSoundController.instance.stopSlotMusic();
    TQSlotMachine.instance.stopIdleWin();
    this.iconContainer.removeAllChildren();
    this.freeSpin = false;
    this.freeSpinMeter.active = false;
    this.iconContainer.active = false;
    this.unschedule(this.closeFreeSpinWindowEnd);
    this.msgLbl.getComponent(cc.Label).string = LanguageMgr.getString(
      "threekingdom.game_msg_start"
    );
    this.closeFreespinEnd.active = false;

    this.freespinTotalProfit = 0;
    this.totalFreeSpinProfit = 0;

    //TQNumericalHelper.scheduleForLabel(this.winValue, 0, 0.01);
    TQSoundController.instance.stopAll();
    cc.tween(this.bannerFreeSpin)
      .to(0.3, { scale: 0 })
      .call(() => {
        this.freespinEndWindow.active = false;
        this.bannerFreeSpin.active = false;
      })
      .start();
    this.scheduleOnce(() => {
      this.freeSpinProfit.getComponent(cc.Label).string = "0";
      TQNumericalHelper.scheduleForLabel(
        this.freeSpinProfit.getComponent(cc.Label),
        0,
        0
      );
      this.machineSlot.active = false;
      this.slotScreensFree[this.currentScene].active = false;
      this.slotScreensFree[this.currentScene].setPosition(0, 0, 0);
      this.slotScreens[this.currentScene].active = true;
      this.slotScreens[this.currentScene].setPosition(0, 0, 0);
      this.machineSlot.active = true;
      this.machineSlot.setPosition(-274.046, -22.493, 0);
      let bgm: any;
      switch (this.slotOrientation) {
        case 1:
          bgm = TQSoundController.instance.zhugeBGM;
          break;
        case 2:
          bgm = TQSoundController.instance.guanBGM;
          break;
        case 3:
          bgm = TQSoundController.instance.zhangBGM;
          break;
      }
      TQSoundController.instance.playSlotMusic(bgm);
      this.reactivateSpinBtn();
    }, 0.3);
    //something.active = false //tắt màn hình làm freespin
  }

  public setCountDownProfit(profit) {
    if (this.turboState == false) {
      this.winningWindow.active = true;
      this._localTimer = 0;
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
        if (TQSoundController.instance.getSystemVolume() > 0) {
          TQSoundController.instance.playType(
            SLOT_SOUND_TYPE.BIG_WIN //TODO: TEMPORARY BECASE NO BIG WIN SOUND CURRENTLY
          );
        }
      } else if (
        //MEGA
        this.profitAmount >= this.currentBetLV * 50 &&
        this.profitAmount < this.currentBetLV * 100
      ) {
        countUpTimer = 12;
        startAnim = "start_Mega";
        loopAnim = "loop_Mega";
        endAnim = "exit_Mega";
        if (TQSoundController.instance.getSystemVolume() > 0) {
          TQSoundController.instance.playType(SLOT_SOUND_TYPE.MEGA_WIN);
        }
      } else if (this.profitAmount >= this.currentBetLV * 100) {
        //SUPER
        countUpTimer = 15;
        startAnim = "start_Super";
        loopAnim = "loop_Super";
        endAnim = "exit_Super";
        if (TQSoundController.instance.getSystemVolume() > 0) {
          TQSoundController.instance.playType(SLOT_SOUND_TYPE.SUPER_WIN);
        }
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
      TQNumericalHelper.scheduleForLabel(this.profitLabel, 0, 0.001);
      this.scheduleOnce(() => {
        if (TQSoundController.instance.getSystemVolume() > 0) {
          TQSoundController.instance.playTypeLoop(
            TQSoundController.instance.coinCountUp
          );
        }
        TQNumericalHelper.scheduleForLabel(
          this.profitLabel,
          this.profitAmount,
          countUpTimer
        );
        TQNumericalHelper.scheduleForLabel(
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
      this.scheduleOnce(TQSoundController.instance.stopPlayLoop, countUpTimer);
      // if (this.autoEnabled == true) {
      this.scheduleOnce(this.closeWinBig, countUpTimer + 5);
      // }
    } else {
      let money = cc.instantiate(this.labelWinTurbo);
      this.winValue.string = TQCommon.numberWithCommas(
        this.freeSpin
          ? this.totalFreeSpinProfit.toString()
          : this.profitAmount.toString()
      );
      this.turboWinContainer.addChild(money);
      money.getComponent(cc.Label).string = TQCommon.numberWithCommas(
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
      if (TQSlotMachine.instance.type != 3) {
        this.reactivateSpinBtn();
      }
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
    this.unschedule(TQSoundController.instance.stopPlayLoop);
    TQSoundController.instance.stopPlayLoop();
    cc.Tween.stopAllByTag(2);
    this.winBoardAnim.node.stopAllActions();
    this.winEffect.stopAllActions();
    this.winningLetterAnim.unscheduleAllCallbacks();
    this.winningLetterAnim.playAnimation("idle", -1);
    this.winningLetterAnim.node.active = false;
    this.winBoardAnim.node.setPosition(0, 400, 0);
    this.winEffect.setPosition(0, 510, 0);
    this.winBoardAnim.playAnimation("loop", 0);
    this._localTimer = this.profitAmount;
    TQNumericalHelper.scheduleForLabel(
      this.profitLabel,
      this.profitAmount,
      0.01
    );
    TQNumericalHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );
    // this.winValue.string = TQCommon.numberWithCommas(
    //   this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount
    // ).toString();
    this.profitLabel.string = TQCommon.numberWithCommas(
      this._localTimer
    ).toString();
    this.scheduleOnce(this.closeWinBig, 4);
  }

  closeWinBig() {
    this.unschedule(this.closeWinBig);
    TQSoundController.instance.stopPlayAction();
    this.skipIdleWinBtn.active = true;
    TQSlotMachine.instance.setColumnsIdleWin();
    this.skipWinBigBtn.active = false;
    this.closeWinBigBtn.active = false;
    cc.Tween.stopAllByTag(2);
    this.unschedule(this.activeCloseWinBigBtn);
    this.winningWindow.active = false;
    this.profitLabel.node.active = false;
    this.profitLabel.string = "0"
  }

  // private resetCountDown(): void {
  //   this._localTimer = this.profitAmount;
  //  TQNumericalHelper.scheduleForLabel(
  //     this.profitLabel,
  //     this.profitAmount,
  //     0.01
  //   );
  //   this.unschedule(this.countDownProfit);
  //   if (this.autoEnabled == true) {
  //     this.scheduleOnce(() => this.closeWinBig(), 4);
  //   }
  // }

  toggleInfo() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.toggleMenu();
    this.tqInfoNode.active = !this.tqInfoNode.active;
  }

  toggleGuide() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.toggleMenu();
    this.tqGuide.active = !this.tqGuide.active;
  }

  testWin() {
    this.profitAmount = 23100000000;
    this.toggleWinNode();
  }

  interuptSpin() {
    TQSlotMachine.instance.stopSpin();
  }

  changeBet(eventdata, idx) {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.betIndex += Number(idx);
    if (this.betIndex <= 0) {
      this.betIndex = 0;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
    } else if (this.betIndex >= 4) {
      this.betIndex = 4;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
    } else {
      this.betChangeBtn[0].getComponent(cc.Button).interactable = true;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = true;
    }
    this.currentBetLV = this.betLevels[this.betIndex];
    this.betBarLv.fillStart = this.fillLevel[this.betIndex];
    TQCmd.Send.sendSlotJoinGame(this.currentBetLV);
  }

  changeBetMax() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    if (this.currentBetLV != this.betLevels[4]) {
      this.currentBetLV = this.betLevels[4];
      this.betIndex = 4;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = true;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
      this.betBarLv.fillStart = this.fillLevel[this.betIndex];
      TQCmd.Send.sendSlotJoinGame(this.currentBetLV);
    }
  }

  toggleChangeLanguage() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.languageMenu.active = !this.languageMenu.active;
  }

  toggleMenu() {
    this.menuSlot.active = !this.menuSlot.active;
  }

  toggleSetting() {
    this.settings.active = !this.settings.active;
    this.toggleMenu();
  }

  showChangeLanguage() {
    this.languageMenu.active = true;
  }
  hideChangeLanguage() {
    this.languageMenu.active = false;
  }

  showJackpotExplanation() {
    this.JackpotExplanation.active = true;
  }

  hideJackpotExplanation() {
    this.JackpotExplanation.active = false;
  }

  toggleSoundSetting() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.soundCtrl.active = !this.soundCtrl.active;
  }

  sliderVolumeCallback(slider: cc.Slider, customEventData: string) {
    let level = Math.round(this.volumeSlider.progress * 100);
    this.volumeLevelLbl.string = level.toString();
    TQSoundController.instance.setSystemVolume(this.volumeSlider.progress);
  }

  changeLanguage(eventdata, idx) {
    let lang: string;
    switch (Number(idx)) {
      case 0:
        lang = "en";
        break;
      case 1:
        lang = "vn";
        break;
      case 2:
        lang = "tl";
        break;
    }

    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }

    for (let i = 0; i < this.languageMenu.children.length; i++) {
      this.languageMenu.children[i].children[0].getChildByName(
        "selected"
      ).active = false;
      if (i == Number(idx)) {
        this.languageMenu.children[i].children[0].getChildByName(
          "selected"
        ).active = true;
      }
    }
    for (let a = 0; a <= 11; a++) {
      this.textWaysTable[a].font = this.fontWaysTable[idx];
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
    this.hideChangeLanguage();

    for (let i = 0; i <= 7; i++) {
      this.textInfo[i].font = this.fontInfo[idx];
      this.textTitle[i].font = this.fontTitle[idx];
      this.textScene[i].font = this.fontScene[idx];
    }
    for (let x = 0; x < 2; x++) {
      this.textFreespinBanner[x].font = this.fontFreespinBanner[idx];
    }
    for (let j = 0; j <= 6; j++) {
      this.textTitleLayout[j].font = this.fontTitleLayout[idx];
    }
  }

  newSlotOrientation() {
    let randomScene: number = TQCommon.randomDifferentConsecutiveNumber(
      this.slotOrientation
    );
    if (randomScene == undefined) {
      this.newSlotOrientation();
    } else {
      return Number(randomScene);
    }
  }

  changeSceneSlot() {
    var posGoal = cc.v3(-2100, 0, 0);
    var posTrolley = cc.v3(-3000, 0, 0);
    var sceneMoveTime = 2;
    var trolleyMoveTime = 2.2;
    this.machineSlot.active = false;
    this.trolley.active = true;
    this.trolley.setPosition(1640, -665);
    let temp: number;
    temp = this.newSlotOrientation();
    this.skipIdleWinBtn.active = false;
    TQSlotMachine.instance.stopIdleWin();
    if (temp == undefined || temp == this.slotOrientation) {
      this.changeSceneSlot();
    } else {
      TQSoundController.instance.stopSlotMusic();
      this.msgLbl.getComponent(cc.Label).string =
        LanguageMgr.getString("threekingdom.game_msg_scene_switch") + temp;
      this.slotOrientation = temp;
      var newScene;
      switch (this.slotOrientation) {
        case 3: //Switch to Quan Vu
          newScene = 2;
          break;
        case 2: //Switch to Truong Phi
          newScene = 1;
          break;
        case 1: //Switch to Gia Cat Luong
          newScene = 0;
      }
      this.slotScreens[newScene].active = true;
      this.slotScreens[newScene].setPosition(2100, 0);
      //new screen tween
      let tween1 = cc
        .tween(this.slotScreens[newScene])
        .by(sceneMoveTime, { position: posGoal })
        .call(() => {
          let bgm: any;
          switch (this.slotOrientation) {
            case 1:
              bgm = TQSoundController.instance.zhugeBGM;
              break;
            case 2:
              bgm = TQSoundController.instance.guanBGM;
              break;
            case 3:
              bgm = TQSoundController.instance.zhangBGM;
              break;
          }
          TQSoundController.instance.playSlotMusic(bgm);
        })
        .start();
      //old screen tween
      let tween2 = cc
        .tween(this.slotScreens[this.currentScene])
        .by(sceneMoveTime, { position: posGoal })
        .call(() => {
          this.machineSlot.active = true;
          this.slotScreens[this.currentScene].active = false;
          this.currentScene = this.slotOrientation - 1;
          this.numWaysLbl.string = this.winWays[newScene].toString();
          this.reactivateSpinBtn();
          if (this.turboWinContainer.children.length > 0) {
            this.turboWinContainer.removeAllChildren();
          }
        })
        .start();
      //trolley tween
      let tween3 = cc
        .tween(this.trolley)
        .call(() => {
          if (TQSoundController.instance.getSystemVolume() > 0) {
            TQSoundController.instance.playType(
              SLOT_SOUND_TYPE.TRANSITION_TROLLEY
            );
          }
        })
        .by(trolleyMoveTime, { position: posTrolley })
        .call(() => {
          this.trolley.active = false;
        })
        .start();
    }
  }
  changeSceneSlotOnReceiveGame(sceneNum) {
    var posGoal = cc.v3(-2100, 0, 0);
    var posTrolley = cc.v3(-3000, 0, 0);
    var sceneMoveTime = 2;
    var trolleyMoveTime = 2.2;
    this.machineSlot.active = false;
    this.trolley.active = true;
    this.trolley.setPosition(1640, -665);
    TQSoundController.instance.stopSlotMusic();
    this.msgLbl.getComponent(cc.Label).string =
      LanguageMgr.getString("threekingdom.game_msg_scene_switch") + sceneNum;
    this.slotOrientation = sceneNum;
    var newScene;
    switch (this.slotOrientation) {
      case 3: //Switch to Quan Vu
        newScene = 2;
        break;
      case 2: //Switch to Truong Phi
        newScene = 1;
        break;
      case 1: //Switch to Gia Cat Luong
        newScene = 0;
    }
    this.slotScreens[newScene].active = true;
    this.slotScreens[newScene].setPosition(2100, 0);
    //new screen tween
    let tween1 = cc
      .tween(this.slotScreens[newScene])
      .by(sceneMoveTime, { position: posGoal })
      .start();
    //old screen tween
    let tween2 = cc
      .tween(this.slotScreens[this.currentScene])
      .by(sceneMoveTime, { position: posGoal })
      .call(() => {
        this.machineSlot.active = true;
        this.slotScreens[this.currentScene].active = false;
        this.currentScene = this.slotOrientation - 1;
        this.numWaysLbl.string = this.winWays[newScene].toString();
        this.activateFreeSpinWindow();
      })
      .start();
    //trolley tween
    let tween3 = cc
      .tween(this.trolley)
      .call(() => {
        if (TQSoundController.instance.getSystemVolume() > 0) {
          TQSoundController.instance.playType(
            SLOT_SOUND_TYPE.TRANSITION_TROLLEY
          );
        }
      })
      .by(trolleyMoveTime, { position: posTrolley })
      .call(() => {
        this.trolley.active = false;
      })
      .start();
  }

  getTurboState() {
    return this.turboState;
  }

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

  changeLanguageInternal(idx) {
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

    for (let a = 0; a <= 11; a++) {
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

    for (let i = 0; i <= 7; i++) {
      this.textInfo[i].font = this.fontInfo[index];
      this.textTitle[i].font = this.fontTitle[index];
      this.textScene[i].font = this.fontScene[index];
    }

    for (let x = 0; x < 2; x++) {
      this.textFreespinBanner[x].font = this.fontFreespinBanner[index];
    }

    for (let j = 0; j < 6; j++) {
      this.textTitleLayout[j].font = this.fontTitleLayout[index];
    }
  }

  addChangeSceneCounter() {
    this.changeSceneCounter += 5;
  }

  toggleAnimJackpot() {
    // cc.log("toggleAnimJackpot",this.profitAmount)
    this.jackpotNode.active = true;
    this.skipJackpot.active = true;
    this.closeJackpot.active = false;
    let anim = this.jackpotAnim.getComponent(sp.Skeleton);
    anim.animation = "animation";
    anim.unscheduleAllCallbacks();
    this.scheduleOnce(this.countUpJackpotWin, 4);
    this.scheduleOnce(this.closeAnimJackpot, 15.25);
  }

  skipAnimJackpot() {
    let anim = this.jackpotAnim.getComponent(sp.Skeleton);
    anim.animation = "coin";
    anim.unscheduleAllCallbacks();
    this.unschedule(this.closeAnimJackpot);
    this.unschedule(this.countUpJackpotWin);
    this.skipJackpot.active = false;
    this.closeJackpot.active = true;
    this.jackpotWinLbl.node.active = true;
    TQNumericalHelper.scheduleForLabel(
      this.jackpotWinLbl,
      this.profitAmount,
      0
    );
    this.scheduleOnce(this.closeAnimJackpot, 3);
  }

  closeAnimJackpot() {
    let anim = this.jackpotAnim.getComponent(sp.Skeleton);
    anim.unscheduleAllCallbacks();
    this.unschedule(this.countUpJackpotWin);
    this.unschedule(this.closeAnimJackpot);
    this.skipJackpot.active = false;
    this.closeJackpot.active = false;
    this.jackpotWinLbl.node.active = false;
    this.jackpotWinLbl.string = "0";
    this.jackpotNode.active = false;
    this.isJackpot = false;
    TQNumericalHelper.scheduleForLabel(this.jackpotWinLbl, 0, 0);
    this.winValue.string = TQCommon.numberWithCommas(this.profitAmount);
    this.reactivateSpinBtn();
  }

  countUpJackpotWin() {
    this.jackpotWinLbl.node.active = true;
    TQNumericalHelper.scheduleForLabel(
      this.jackpotWinLbl,
      this.profitAmount,
      6
    );
  }

  testFireFunc() {
    // TQSlotMachine.instance.letgoFake();
    // this.totalFreeSpinProfit += 1000000;
    // this.freespinTotalProfit += 1000000;
    // this.activateFreeSpinWindowEnd();
    this.balance = 10000;
    this.profitAmount = 500000000000;
    this.toggleWinNode()
  }

  testOpenJackpot() {
    this.profitAmount = 50000000;
    this.isJackpot = true;
    this.reactivateSpinBtn();
  }

  fakeJackpot(){
    this.jackpotLbl.active = true;
    this.totalWinLbl.active = false;
    this.balanceValue.string = TQCommon.numberWithCommas(
      50000000
    ).toString();
    this.profitAmount = 50000000;
    this.toggleAnimJackpot();
  }

  onclickJackpot() {
    this.jackpotBtn.active = false;
    this.isJackpot = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = false;
    TQCmd.Send.sendOpenJackpot();
  }

  fakeRn() {
    let res = {
      betAmount: 50000,
      item: [
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 0,
          bomb: 0,
        },
        {
          id: 0, //Column 3
          bomb: 0,
        },
        {
          id: 0,
          bomb: 0,
        },
        {
          id: 5,
          bomb: 0,
        },
        {
          id: 6,
          bomb: 0,
        },
        {
          id: 3,
          bomb: 0,
        },
        {
          id: 3, //column 2
          bomb: 0,
        },
        {
          id: 6,
          bomb: 0,
        },
        {
          id: 6,
          bomb: 0,
        },
        {
          id: 6,
          bomb: 0,
        },
        {
          id: 3,
          bomb: 1,
        },
        {
          id: 3, //Column 2
          bomb: 0,
        },
        {
          id: 6,
          bomb: 0,
        },
        {
          id: 6,
          bomb: 0,
        },
        {
          id: 7,
          bomb: 0,
        },
        {
          id: 3,
          bomb: 0,
        },
        {
          id: 3, //Column 2
          bomb: 0,
        },
        {
          id: 7,
          bomb: 0,
        },
        {
          id: 7,
          bomb: 0,
        },
      ],
      result: [],
      type: 1,
      amountProfit: 0,
      currentMoney: 1826483576,
    };
    TQSlotMachine.instance.letgoFake();
    this.scheduleOnce(() => TQSlotMachine.instance.letGo(res), 1);
  }
}
