import OPSlotMachine from "./OP.SlotMachine";
import { OPCmd } from "./OP.Cmd";
import { OPConnector } from "./Connector/OP.Connector";
import OPCommon from "./OP.Common";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import OPSoundController, { SLOT_SOUND_TYPE } from "./OP.SoundController";
import OPLottery from "./OP.Lottery";
import OPNumericalHelper from "./OP.NumericalHelper";
const { ccclass, property } = cc._decorator;

@ccclass
export default class OPController extends cc.Component {
  public static instance: OPController = null;

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
  private profitLabelBigWin: cc.Label = null;

  @property(cc.Node)
  private winEffect: cc.Node = null;
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
  private OPGuide: cc.Node = null;
  @property(cc.Node)
  private OPInfo: cc.Node = null;
  @property(cc.Node)
  private transitionWindow: cc.Node = null;

  @property(cc.Node)
  public freespinBtn: cc.Node = null;

  @property(cc.Node)
  private skipIdleWinBtn: cc.Node = null;
  @property(cc.Node)
  private closeAutoWindow: cc.Node = null;
  @property(cc.Node)
  private jackpotLbl: cc.Node = null;
  @property(cc.Node)
  private totalWinLbl: cc.Node = null;
  @property(cc.Sprite)
  private meterFill: cc.Sprite = null;
  @property(cc.Node)
  private turboWinContainer: cc.Node = null;
  @property(cc.Prefab)
  private labelWinTurbo: cc.Prefab = null;
  @property(cc.Node)
  private chestContainer: cc.Node = null;
  @property(cc.Label)
  private jackpotFundMinor: cc.Label = null;
  @property(cc.Label)
  private jackpotFundMajor: cc.Label = null;
  @property(cc.Label)
  private jackpotFundGrand: cc.Label = null;

  public languageIndex: number = 0;
  public turboState: boolean = false;
  public isSpinning: boolean = false;
  public freeSpin: boolean = false;
  public isMobile: boolean = false;
  public freeSpinNumber: number = 0;
  public autoState: boolean = false;
  public vibrationEnabled: boolean = false;
  private _isGameActive: boolean = true;
  private hideTime: number = null;
  private profitAmount: number = 0;
  private endFreeSpin: boolean = false;
  private betIndex = 0;
  private betLevels = [10000, 20000, 30000, 50000, 100000];
  private autoSpinNmb: number = 0;
  private currentBetLV = 0;
  private autoEnabled: boolean = false;
  private totalFreeSpinProfit: number = 0;
  private balance: number = 0;
  private autoSettingEnabled: boolean = false;
  private notAuto: boolean = true; //CHECK IF AUTO IS ON BEFORE ENTER FREESPIN
  private isJackpot;
  private currentBonusProgress = 0;
  private currentJackpotProgress = 0;
  private fillLv = [0, 0.19, 0.36, 0.54, 0.72, 1];
  
  private minor: number = 0;
  private major: number = 0;
  private grand: number = 0;
  private previousMinor: number = 0;
  private previousMajor: number = 0;
  private previousGrand: number = 0;
  onLoad() {
    OPController.instance = this;
    cc.debug.setDisplayStats(false);

    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_KICK_OUT,
      this.responseUserOut,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveGameInfo,
      this
    );

    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_JACKPOT_RESULT,
      this.responseReceiveJackpotResult,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    OPConnector.instance.addCmdListener(
      OPCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    OPConnector.instance.connect();

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
    OPConnector.instance.removeCmdListener(this, OPCmd.Cmd.CMD_SLOT_LOGIN);
    OPConnector.instance.removeCmdListener(this, OPCmd.Cmd.CMD_SLOT_JOIN_ROOM);
    OPConnector.instance.removeCmdListener(this, OPCmd.Cmd.CMD_SLOT_KICK_OUT);
    OPConnector.instance.removeCmdListener(this, OPCmd.Cmd.CMD_SLOT_GAME_INFO);
    OPConnector.instance.removeCmdListener(this, OPCmd.Cmd.CMD_SLOT_BET_FAILED);
    OPConnector.instance.removeCmdListener(
      this,
      OPCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    OPConnector.instance.removeCmdListener(
      this,
      OPCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );
  }

  protected start(): void {
    cc.audioEngine.stopAll();
    cc.debug.setDisplayStats(false);
    this.isMobile = cc.sys.isMobile;
    OPSoundController.instance.playSlotMusic(
      OPSoundController.instance.mainBGM
    );
    this.betChangeBtn[0].getComponent(cc.Button).interactable = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = false;
    if (!this.isMobile) {
    } else {
    }
  }

  protected onDisable(): void {
    OPConnector.instance.disconnect();
    if (!this.isMobile) {
    } else {
    }
  }

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOT DISCONNECT: ",
      cmdId
    );
  }
  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceivedLogin();
    res.unpackData(data);
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOT LOGIN: ",
      cmdId,
      res
    );

    let err = res.getError();
    let msg = "";
    switch (err) {
      case 3:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("onepiece.connection_error");
        break;
      case 1:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("onepiece.connection_error");
        break;
      case 2:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("onepiece.connection_error");
        break;
      case 0:
        OPCmd.Send.sendSlotJoinGame(10000);
        break;
      default:
        msg = LanguageMgr.getString("onepiece.connection_error");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
      this.notiMsg.string = LanguageMgr.getString("onepiece.connection_error");
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "JOIN ROOM",
      cmdId
    );
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5002",
      cmdId,
      res
    );
    this.noti.active = false;
    this.spinBtn[0].getComponent(cc.Button).interactable = true;
    this.betLvLbl.string = OPCommon.numberWithCommas(res.betAmount).toString();
    this.balanceValue.string = OPCommon.numberWithCommas(res.currentMoney);
    this.currentBetLV = res.betAmount;
    this.balance = res.currentMoney;
    OPLottery.instance.generateTiles(res.bingoData.bingoItem);
    this.currentBonusProgress = res.bingoData.totalBingo;
    this.currentJackpotProgress = res.bingoData.totalJackpot;
    this.updateBonusProgress();
    this.updateJackpotProgress();
    if (res.activeFreeGame) {
    }
 
    if (res.activeJackpot) {
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveUserOut();
    res.unpackData(data);
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOT_RECEIVE_USER_OUT",
      cmdId,
      res
    );
    this.backToLobby();
  }
  private backToLobby() {
    OPConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }
  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // console.error(
    //   "OP",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5003",
    //   cmdId,
    //   res
    // );
    this.previousMinor = this.minor;
    this.previousMajor = this.major;
    this.previousGrand = this.grand;

    this.minor = res.miniFundBonus;
    this.major = res.minorFundBonus;
    this.grand = res.majorFundBonus;

    let countUpTimer: number = 4;
    if (this.previousMinor !== this.minor) {
      if (this.previousMajor !== 0) {
        OPNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.miniFundBonus,
          countUpTimer
        );
      } else {
        OPNumericalHelper.scheduleForLabel(
          this.jackpotFundMinor,
          res.miniFundBonus,
          0.3
        );
      }
    }

    if (this.previousMajor !== this.major) {
      if (this.previousMajor !== 0) {
        OPNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.minorFundBonus,
          countUpTimer
        );
      } else {
        OPNumericalHelper.scheduleForLabel(
          this.jackpotFundMajor,
          res.minorFundBonus,
          0.3
        );
      }
    }

    if (this.previousGrand !== this.grand) {
      if (this.previousMajor !== 0) {
        OPNumericalHelper.scheduleForLabel(
          this.jackpotFundGrand,
          res.majorFundBonus,
          countUpTimer
        );
      } else {
        OPNumericalHelper.scheduleForLabel(
          this.jackpotFundGrand,
          res.majorFundBonus,
          0.3
        );
      }
    }

  
  }

  // 5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5005",
      cmdId,
      res
    );

    this.noti.active = true;
    this.notiMsg.string = LanguageMgr.getString("onepiece.bet_error");
    cc.error(this.notiMsg.string);
  }

  // 5006

  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    console.error(
      "OP",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5008",
      cmdId,
      res
    );
    if (res.getError() != 0) {
      return;
    }
    // if (this.turboState == false) {
    //   this.spinBtn[1].getComponent(cc.Button).interactable = true;
    // }
    // this.summaryLbl.string = this.freeSpinTotalRound.toString();
    // this.profitAmount = res.amountProfit;
    // this.balance = res.currentMoney;
    // this.totalFreeSpinProfit = res.totalPot;
    // this.machineSlot.getComponent(OPSlotMachine).letGo(res);
    // this.playerHp = res.currentUserHP + 1;
    // this.enemyHp = res.currentSystemHP + 1;

    // if (res.currentSystemHP == 0) {
    //   this.featureWillAppear = true;
    //   // leader.playAnimation("lose", -1);
    // } else if (res.currentUserHP == 0) {
    //   this.endFreeSpin = true;
    // }
  }

  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5006",
      cmdId,
      res
    );
    if (res.getError() != 0) {
      return;
    }
    BGUI.UINumericLabelHelper.scheduleForLabel(this.winValue, res.winMoney, 1);
    this.jackpotLbl.active = true;
    this.totalWinLbl.active = false;
    this.balanceValue.string = OPCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.unscheduleAllCallbacks();
    this.scheduleOnce(this.reactivateSpinBtn, 5);
  }

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new OPCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    console.error(
      "OP",
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
    this.machineSlot.getComponent(OPSlotMachine).letGo(res);
    // if (res.jackpotAmount > 0) {
    //   cc.log("Jackpot!: ", res.jackpotAmount);
    //   this.isJackpot = true;
    // }
  }

  //////////////////////////  MENU FUNCTIONS  //////////////////////////

  toggleAutospinSetting() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.autoBtn.getComponent(cc.Button).interactable = false;
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
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.autoState = false;
    this.autoSpinNmb = 0;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    this.notAuto = true;
  }

  closeAutoSpinSetting() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

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
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.closeAutoSpinSetting();
    this.autoBtn.getComponent(cc.Button).interactable = false;
    this.stopAutoBtn.active = true;
    this.autoEnabled = true;
    this.autoSpinNmb = Number(idx);
    this.spinBtn[0].active = false;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    this.autoState = true;
    this.onClickSpin();
    this.notAuto = false;
  }

  turboSpinCtrl() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

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
      OPSoundController.instance.stopPlayLoop();
      OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      BGUI.UINumericLabelHelper.scheduleForLabel(this.winValue, 0, 0.0001);
      this.scheduleOnce(() => {
        this.winValue.string = "0";
      }, 0);
      this.balance -= this.currentBetLV;
      if (this.balance >= 0) {
        this.balanceValue.string = OPCommon.numberWithCommas(this.balance);
        if (this.autoEnabled == false) {
          this.spinBtn[1].active = true;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
        } else {
          this.spinBtn[1].active = false;
          this.spinBtn[1].getComponent(cc.Button).interactable = false;
          this.stopAutoBtn.active = true;
        }
        OPCmd.Send.sendSlotBet(this.currentBetLV);
        OPSlotMachine.instance.stopIdleWin();
        OPSlotMachine.instance.letgoFake();
      } else {
        this.spinBtn[0].active = true;
        this.spinBtn[1].active = false;
        this.stopAutoBtn.active = this.notAuto ? false : true;
        this.stopAutoSpin();
        this.noti.active = true;
        this.notiMsg.string = LanguageMgr.getString(
          "onepiece.not_enough_money"
        );
      }
    }
  }

  protected onClickFreeSpin() {
    if (this.isSpinning == false) {
      this.stopInteractWhileSpins();
      OPSoundController.instance.stopPlayLoop();

      OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      OPSoundController.instance.playType(
        SLOT_SOUND_TYPE.LEADER_FREE_START_SPIN
      );

      OPSlotMachine.instance.stopIdleWin();
      this.spinBtn[1].getComponent(cc.Button).interactable = false;
      this.stopAutoBtn.active = false;
      OPSlotMachine.instance.letgoFake();
      OPCmd.Send.sendStartFreeGame();
    }
  }

  onclickStopSpin() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    OPSlotMachine.instance.stopColumnSpin();
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
    OPSlotMachine.instance.unscheduleAllCallbacks();
    OPSlotMachine.instance.scatterCount = 0;
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
    this.balanceValue.string = OPCommon.numberWithCommas(this.balance);
    if (this.isJackpot) {
      OPCmd.Send.sendOpenJackpot();
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
          } else {
            this.reactivateSpinBtn();
          }
        } else if (this.autoSpinNmb > 0) {
          if (this.freeSpin == false) {
            this.autoSpinNmb -= 1;
          }
          this.winningWindow.active = false;
          this.profitLabelBigWin.node.active = false;
          this.unschedule(this.toggleWinNode);
          this.autoNumLbl.string = this.autoSpinNmb.toString();
          if (this.endFreeSpin == true) {
            if (this.notAuto) {
              this.stopAutoSpin();
            }
            this.activateFreeSpinWindowEnd();
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

  changeBet(eventdata, idx) {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
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
    OPCmd.Send.sendSlotJoinGame(this.currentBetLV);
  }

  changeBetMax() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.currentBetLV != this.betLevels[4]) {
      this.currentBetLV = this.betLevels[4];
      this.betIndex = 4;
      this.betChangeBtn[0].getComponent(cc.Button).interactable = true;
      this.betChangeBtn[1].getComponent(cc.Button).interactable = false;
      OPCmd.Send.sendSlotJoinGame(this.currentBetLV);
    }
  }

  toggleMenu() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.menuSlot.active = !this.menuSlot.active;
  }

  toggleSetting() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.settings.active = !this.settings.active;
    this.toggleMenu();
  }

  public getTurbo() {
    return this.turboState;
  }

  getFreespinState() {
    return this.freeSpin;
  }

  //////////////////////////  MAIN GAME FUNCTIONS  //////////////////////////

  toggleWinNode() {
    this.spinBtn[1].getComponent(cc.Button).interactable = false;
    if (this.profitAmount > 0) {
      this.vibrateGame();
      if (OPSlotMachine.instance.longWin) {
        OPSoundController.instance.playTypeLoop(
          OPSoundController.instance.longWin
        );
      }

      if (this.profitAmount < this.currentBetLV * 10) {
        if (this.turboState == false) {
          OPSlotMachine.instance.setColumnsIdleWin();
          BGUI.UINumericLabelHelper.scheduleForLabel(
            this.winValue,
            this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
            2
          );
          this.scheduleOnce(
            OPSlotMachine.instance.type != 3
              ? this.reactivateSpinBtn
              : this.activateFreeSpinWindow,
            2.5
          );
        } else {
          this.winValue.string = OPCommon.numberWithCommas(
            this.freeSpin
              ? this.totalFreeSpinProfit.toString()
              : this.profitAmount.toString()
          );
          let money = cc.instantiate(this.labelWinTurbo);
          this.turboWinContainer.addChild(money);
          money.getComponent(cc.Label).string = OPCommon.numberWithCommas(
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
            OPSlotMachine.instance.type != 3
              ? this.reactivateSpinBtn
              : this.activateFreeSpinWindow,
            1
          );
        }
      } else {
        this.setCountDownProfit(this.profitAmount);
      }
    }
  }

  skipSmallWin() {
    BGUI.UINumericLabelHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );
    this.skipIdleWinBtn.active = false;
    OPSlotMachine.instance.type != 3
      ? this.reactivateSpinBtn()
      : this.activateFreeSpinWindow();
  }

  activateFreeSpinWindow() {
    //TODO: CHANGE BGM
    OPSoundController.instance.stopSlotMusic();
    OPSoundController.instance.playSlotMusic(
      OPSoundController.instance.freeBGM
    );
    this.toggleTransitionWindow();
    this.unschedule(this.activateFreeSpinWindow);
    BGUI.UINumericLabelHelper.scheduleForLabel(this.winValue, 0, 0.0001);
    this.freeSpin = true;
    this.resetSpecialState();
    BGUI.UINumericLabelHelper.scheduleForLabel(this.winValue, 0, 0);
    this.winValue.string = "0";
    this.autoEnabled = true;
    this.autoState = true;
    this.spinBtn[1].active = true;
    this.spinBtn[0].active = false;
    this.freespinBtn.active = false;

    OPSlotMachine.instance.stopIdleWin();
    setTimeout(() => {
      if (this.notAuto == true) {
        this.autoSpinNmb += 100;
      }
      // this.slotScreen.active = false;
      // this.slotScreenFree.active = true;
      // this.freespinMeter[0]
      //   .getComponent(dragonBones.ArmatureDisplay)
      //   .playAnimation("p1_init", -1);
      // this.freespinMeter[1]
      //   .getComponent(dragonBones.ArmatureDisplay)
      //   .playAnimation("p2_init", -1);
      this.scheduleOnce(this.onClickFreeSpin, 1);
    }, 500);
  }

  resetSpecialState() {
    this.endFreeSpin = false;
    OPSlotMachine.instance.powerSpinColumn = [2];
  }

  activateFreeSpinWindowEnd() {
    if (this.notAuto) {
      this.stopAutoSpin();
    }
    BGUI.UINumericLabelHelper.scheduleForLabel(
      this.freeSpinProfit.getComponent(cc.Label),
      0,
      0
    );
    this.freeSpinProfit.getComponent(cc.Label).string = "0";
    this.freeSpin = false;
    this.freeSpinNumber = 0;
    this.freespinEndWindow.active = true;
    this.bannerFreeSpin.active = true;
    this.bannerFreeSpin.scale = 0;
    cc.tween(this.bannerFreeSpin)
      .to(0.3, { scale: 1 }, { easing: "backIn" })
      .call(() => {
        this.scheduleOnce(() => {
          BGUI.UINumericLabelHelper.scheduleForLabel(
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
    OPSoundController.instance.stopSlotMusic();
    OPSlotMachine.instance.stopIdleWin();
    this.unschedule(this.closeFreeSpinWindowEnd);
    this.resetSpecialState();
    this.toggleTransitionWindow();
    this.closeFreespinEnd.active = false;
    this.totalFreeSpinProfit = 0;
    OPSoundController.instance.stopAll();
    cc.tween(this.bannerFreeSpin)
      .to(0.3, { scale: 0 })
      .call(() => {
        this.freespinEndWindow.active = false;
        this.bannerFreeSpin.active = false;
      })
      .start();
    this.scheduleOnce(this.reactivateSpinBtn, 1);
    setTimeout(() => {
      // this.slotScreenFree.active = false;
      // this.slotScreen.active = true;
      let bgm = OPSoundController.instance.mainBGM;
      OPSoundController.instance.playSlotMusic(bgm);
    }, 500);
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
      this.profitLabelBigWin.node.active = true;
      this.skipWinBigBtn.getComponent(cc.Button).interactable = false;
      this.scheduleOnce(() => {
        this.skipWinBigBtn.getComponent(cc.Button).interactable = true;
      }, 1.2);
      this.skipWinBigBtn.active = true;
      this.closeWinBigBtn.active = false;
      var startAnim;
      var loopAnim;
      var endAnim;

      if (
        //BIG
        this.profitAmount >= this.currentBetLV * 10 &&
        this.profitAmount < this.currentBetLV * 50
      ) {
        countUpTimer = 8;
        startAnim = "start_Big";
        loopAnim = "loop_Big";
        endAnim = "exit_Big";

        OPSoundController.instance.playType(SLOT_SOUND_TYPE.BIG_WIN);
      } else if (
        //MEGA
        this.profitAmount >= this.currentBetLV * 50 &&
        this.profitAmount < this.currentBetLV * 100
      ) {
        countUpTimer = 12;
        startAnim = "start_Mega";
        loopAnim = "loop_Mega";
        endAnim = "exit_Mega";

        OPSoundController.instance.playType(SLOT_SOUND_TYPE.MEGA_WIN);
      } else if (this.profitAmount >= this.currentBetLV * 100) {
        //SUPER
        countUpTimer = 15;
        startAnim = "start_Super";
        loopAnim = "loop_Super";
        endAnim = "exit_Super";

        OPSoundController.instance.playType(SLOT_SOUND_TYPE.SUPER_WIN);
      }

      BGUI.UINumericLabelHelper.scheduleForLabel(
        this.profitLabelBigWin,
        0,
        0.001
      );
      this.scheduleOnce(() => {
        if (OPSoundController.instance.getSystemVolume() > 0) {
          OPSoundController.instance.playTypeLoop(
            OPSoundController.instance.coinCountUp
          );
        }
        BGUI.UINumericLabelHelper.scheduleForLabel(
          this.profitLabelBigWin,
          this.profitAmount,
          countUpTimer
        );
        BGUI.UINumericLabelHelper.scheduleForLabel(
          this.winValue,
          this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
          countUpTimer
        );
      }, 0.03);

      cc.tween(this.winEffect)
        .tag(2)
        .delay(5)
        .to(1, { position: new cc.Vec3(0, 510, 0) }, { easing: "smooth" })
        .start();

      this.scheduleOnce(this.activeCloseWinBigBtn, countUpTimer - 2);
      this.scheduleOnce(OPSoundController.instance.stopPlayLoop, countUpTimer);
      this.scheduleOnce(this.closeWinBig, countUpTimer + 5);
    } else {
      let money = cc.instantiate(this.labelWinTurbo);
      this.winValue.string = OPCommon.numberWithCommas(
        this.freeSpin
          ? this.totalFreeSpinProfit.toString()
          : this.profitAmount.toString()
      );
      this.turboWinContainer.addChild(money);
      money.getComponent(cc.Label).string = OPCommon.numberWithCommas(
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
      OPSlotMachine.instance.type != 3
        ? this.reactivateSpinBtn()
        : this.activateFreeSpinWindow();
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
    this.unschedule(OPSoundController.instance.stopPlayLoop);
    OPSoundController.instance.stopPlayLoop();
    cc.Tween.stopAllByTag(2);

    BGUI.UINumericLabelHelper.scheduleForLabel(
      this.profitLabelBigWin,
      this.profitAmount,
      0.01
    );

    BGUI.UINumericLabelHelper.scheduleForLabel(
      this.winValue,
      this.freeSpin ? this.totalFreeSpinProfit : this.profitAmount,
      0.01
    );

    this.profitLabelBigWin.string = OPCommon.numberWithCommas(
      this.profitAmount
    ).toString();
  }

  closeWinBig() {
    OPSoundController.instance.stopPlayAction();
    OPSlotMachine.instance.setColumnsIdleWin();
    this.skipWinBigBtn.active = false;
    this.closeWinBigBtn.active = false;
    cc.Tween.stopAllByTag(2);
    this.unschedule(this.closeWinBig);
    this.unschedule(this.activeCloseWinBigBtn);
    this.winningWindow.active = false;
    this.profitLabelBigWin.node.active = false;
    OPSlotMachine.instance.type != 3
      ? this.reactivateSpinBtn()
      : this.activateFreeSpinWindow();
  }

  toggleGuide() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.toggleMenu();
    cc.tween(this.OPGuide)
      .call(() => {
        this.OPGuide.active = true;
      })
      .to(0.4, { opacity: 255 })
      .start();
  }

  toggleInfo() {
    this.OPInfo.active = !this.OPInfo.active;
    // this.machineSlot.active = !this.machineSlot.active;
  }

  interuptSpin() {
    OPSlotMachine.instance.stopSpin();
  }

  updateBonusProgress() {
    if (this.currentBonusProgress < this.fillLv.length) {
      this.meterFill.fillRange = this.fillLv[this.currentBonusProgress];
    }
  }

  resetBonusProgress() {
    this.meterFill.fillRange = this.fillLv[0];
    this.currentBonusProgress = 0;
  }

  updateJackpotProgress() {
    for (let i = 0; i < this.currentJackpotProgress; i++) {
      this.chestContainer.children[i].active = true;
    }
  }

  resetJackpotProgress() {
    for (let i in this.chestContainer.children) {
      this.chestContainer.children[i].active = false;
    }
    this.currentJackpotProgress = 0;
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

  //////////////////////////  TEST FUNCTIONS  //////////////////////////

  testSpin() {
    OPSlotMachine.instance.letgoFake();
  }

  testWin() {
    this.profitAmount = 231;
    this.toggleWinNode();
  }

  fakeRn() {
    let res = {
      betAmount: 10000,
      item: [
        {
          id: 0, //1
          highlight: false,
        },
        {
          id: 0,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 0, //2
          highlight: false,
        },
        {
          id: 0,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 0, //3
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: 0,
          highlight: false,
        },
        {
          id: 0,
          highlight: false,
        },
      ],
      result: [[0, 1, 2, 3, 4]],
      type: 3,
      amountProfit: 10000000,
      currentMoney: 1826483576,
    };
    this.freeSpin = true;
    OPSlotMachine.instance.letgoFake();
    this.scheduleOnce(() => OPSlotMachine.instance.letGo(res), 1);
  }

  protected testSendBet() {
    OPCmd.Send.sendSlotBet(50000);
  }

  protected testSendFree() {
    OPCmd.Send.sendStartFreeGame();
  }

  protected stopTestSpin() {
    OPSlotMachine.instance.stopTestSpin();
  }
}
