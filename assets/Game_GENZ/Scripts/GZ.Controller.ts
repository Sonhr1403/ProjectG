import GenZSlotMachine from "./GZ.SlotMachine";
import { GenZCmd } from "./GZ.Cmd";
import { GenZConnector } from "./Connector/GZ.Connector";
import GenZMusicManager, { SLOT_SOUND_TYPE } from "./GZ.MusicCtrller";
import GenZCommon from "./GZ.Common";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GenZMain extends cc.Component {
  public static instance: GenZMain = null;

  @property(cc.Node)
  autoSpinSetting: cc.Node = null;
  @property(cc.Node)
  betOptions: cc.Node = null;
  @property(cc.Node)
  autoCtrlBtn: cc.Node = null;
  @property(cc.Node)
  soundCtrlNode: cc.Node = null;
  @property(cc.Node)
  turboCtrlNode: cc.Node = null;
  @property(cc.Node)
  changeBetBtn: cc.Node = null;
  @property(cc.Node)
  turboBtn: cc.Node = null;
  @property(cc.Node)
  machineSlot: cc.Node = null;
  @property(cc.Node)
  autoBtn: cc.Node[] = [];
  @property(cc.Node)
  spinBtn: cc.Node[] = [];
  @property(cc.Label)
  autoNumLbl: cc.Label = null;
  @property(cc.Node)
  soundBtn: cc.Node[] = [];
  @property(cc.Label)
  betValue: cc.Label = null;
  @property(cc.Label)
  winValue: cc.Label = null;
  @property(cc.Label)
  balanceValue: cc.Label = null;
  @property(cc.Node)
  winningWindow: cc.Node = null;
  @property(cc.Node)
  skipAnimWindow: cc.Node = null;
  @property(cc.Node)
  closeAnimWindow: cc.Node = null;
  @property(cc.Node)
  freeSpinWindow: cc.Node = null;
  @property(cc.Node)
  freeSpinDancingNode: cc.Node = null;
  @property(sp.Skeleton)
  freeSpinSkeleton: sp.Skeleton = null;
  @property(cc.Node)
  freeSpinNum: cc.Node = null;
  @property(cc.Node)
  freeSpinProfit: cc.Node = null;
  @property(sp.Skeleton)
  winSkeleton: sp.Skeleton = null;
  @property(cc.Label)
  profitLabel: cc.Label = null; //profit earned display on screen
  @property(sp.Skeleton)
  mainBG: sp.Skeleton = null;
  @property(cc.Node)
  bottomBtns: cc.Node = null;
  @property(cc.Node)
  bottomBtnsFreeSpin: cc.Node = null;
  @property(cc.Label)
  bottomBtnsFreeSpinNumber: cc.Label = null;
  @property(cc.Label)
  bottomBtnsFreeSpinTotalWinLbl: cc.Label = null;
  @property(cc.Label)
  bottomBtnsFreeSpinBetLv: cc.Label = null;
  @property(cc.Label)
  bottomBtnsFreeSpinBalanceLbl: cc.Label = null;
  @property(cc.Node)
  public noti: cc.Node = null;
  @property(cc.Node)
  public notiMsg: cc.Node = null;
  @property(cc.Node)
  public wukongInfoNode: cc.Node = null;
  @property(cc.Node)
  public gameScreen: cc.Node = null;
  @property(cc.Node)
  public notiNoMoney: cc.Node = null;

  public balance: number = 0;
  public autoSpinNmb: number = 0;
  public currentBetLV = 0;
  public profitAmount: number = 0; //1000000
  public freespinTotalProfitAmount: number = 0;
  public totalFreeSpinProfit: number = 0;
  public turboState: boolean = false;
  private soundState: boolean = false;
  public autoState: boolean = false;
  public autoEnabled: boolean = false;
  public freeSpin: boolean = false;
  public freeSpinWindowHasActivated: boolean = false;
  public freeSpinType: number = 0;
  // private freespinArray = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  private freespinArray = [];
  private freeSpinNumber: number = 0;
  private _localTimer: number = 0;
  private winType: number = 0;
  public endFreeSpin: boolean = false;
  public isSpinning: boolean = false;
  public isMobile: boolean = false;
  private changeBetPermitted: boolean = true;

  onLoad() {
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
      // LobbyCtrl.instance.emitLogicChoose(lang)
    } else {
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en");
      LanguageMgr.updateLang("en");
      // LobbyCtrl.instance.emitLogicChoose("en")
    }
    this.isMobile = cc.sys.isMobile;
    GenZMain.instance = this;
    cc.debug.setDisplayStats(false);
    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_KICK_OUT,
      this.responseUserOut,
      this
    );
    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveGameInfo,
      this
    );

    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );

    GenZConnector.instance.addCmdListener(
      GenZCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    GenZConnector.instance.connect();
  }

  protected onDestroy(): void {
    GenZConnector.instance.removeCmdListener(this, GenZCmd.Cmd.CMD_SLOT_LOGIN);
    GenZConnector.instance.removeCmdListener(
      this,
      GenZCmd.Cmd.CMD_SLOT_JOIN_ROOM
    );
    GenZConnector.instance.removeCmdListener(
      this,
      GenZCmd.Cmd.CMD_SLOT_KICK_OUT
    );
    GenZConnector.instance.removeCmdListener(
      this,
      GenZCmd.Cmd.CMD_SLOT_GAME_INFO
    );

    GenZConnector.instance.removeCmdListener(
      this,
      GenZCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    GenZConnector.instance.removeCmdListener(
      this,
      GenZCmd.Cmd.CMD_SLOT_BET_FAILED
    );

    GenZConnector.instance.removeCmdListener(
      GenZCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );
  }

  protected onEnable(): void {
    cc.audioEngine.stopAll();
    GenZMusicManager.instance.playSlotMusic(GenZMusicManager.instance.mainBGM);
  }

  protected onDisable(): void {
    GenZConnector.instance.disconnect();
  }

  ///////////////////////////////////////test

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT DISCONNECT: ",
    //   cmdId
    // );
  }
  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new GenZCmd.GenZReceivedLogin();
    res.unpackData(data);
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT LOGIN: ",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
    let err = res.getError();
    let msg = "";
    switch (err) {
      case 3:
        // cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("genz.connection_error");
        break;
      case 1:
        // cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("genz.connection_error");
        break;
      case 2:
        // cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("genz.connection_error");
        break;
      case 0:
        GenZCmd.Send.sendSlotJoinGame(1000);

        break;

      default:
        msg = LanguageMgr.getString("genz.connection_error");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
      this.notiMsg.getComponent(cc.Label).string = msg;
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "JOIN ROOM",
    //   cmdId
    // );
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new GenZCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5002",
    //   cmdId,
    //   res
    // );
    this.changeBetBtn.active = true;
    this.autoCtrlBtn.active = true;
    this.spinBtn[0].active = true;
    ////////////////
    this.balance = res.currentMoney;
    this.currentBetLV = res.betAmount;
    this.betValue.string = GenZCommon.numberWithCommas(
      res.betAmount
    ).toString();
    this.balanceValue.string = GenZCommon.numberWithCommas(res.currentMoney);
    if (res.freeGameResult != null) {
      // console.error(
      //   "GENZ",
      //   new Date().toLocaleString(),
      //   new Date().getMilliseconds(),
      //   "START FREE GAME: ",
      //   cmdId,
      //   res
      // );
      this.autoState = true;
      this.freeSpin = true;
      this.autoEnabled = true;
      this.autoSpinNmb =
        res.freeGameResult.totalRound - res.freeGameResult.currentRound - 1;
      this.freeSpinWindowHasActivated = true;
      this.bottomBtnsFreeSpinBalanceLbl.string = res.currentMoney.toString();
      this.bottomBtnsFreeSpinTotalWinLbl.string = GenZCommon.numberWithCommas(
        res.freeGameResult.totalPot.toString()
      );
      this.bottomBtnsFreeSpinBetLv.string = res.betAmount.toString();
      this.bottomBtnsFreeSpinNumber.string = (
        res.freeGameResult.totalRound -
        res.freeGameResult.currentRound -
        1
      ).toString();
      // if (res.freeGameResult.type == 1) {
      //   this.togglePilar();
      // } else if (res.freeGameResult.type == 2) {

      this.hideStats();
      this.scheduleOnce(this.onClickFreeSpin, 2);
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new GenZCmd.SlotReceiveUserOut();
    res.unpackData(data);
    ////////////////////////////////////////////
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "SLOT_RECEIVE_USER_OUT",
    //   cmdId,
    //   res
    // );
    // this.backToLobby();
  }
  // private backToLobby() {
  //   GenZConnector.instance.disconnect();
  //   BGUI.GameCoreManager.instance.onBackToLobby();
  // }

  // 5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new GenZCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5005",
    //   cmdId,
    //   res
    // );
    if (this.notiNoMoney.active == false) {
      let msg = LanguageMgr.getString("genz.connection_error");
      this.noti.active = true;
      this.notiMsg.getComponent(cc.Label).string = msg;
    }
   
  }

  // 5006

  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    let res = new GenZCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5008",
    //   cmdId,
    //   res
    // );

    if (res.getError() != 0) {
      this.noti.active = true;
      return;
    } else {
      // this.freespinArray = [];
      this.bottomBtnsFreeSpinNumber.string = (
        res.totalRound - res.currentRound
      ).toString();
      if (res.totalRound == res.currentRound) {
        this.endFreeSpin = true;
        // this.freeSpin = false;
      }
      // cc.log(res.totalRound - res.currentRound, "FREESPIN TEST MINUS ROUND");
      this.spinBtn[0].getComponent(cc.Button).interactable = true;
      this.profitAmount = res.amountProfit;
      this.totalFreeSpinProfit = GenZCommon.numberWithCommas(res.totalPot);
      this.freeSpinProfit.getComponent(cc.Label).string =
        GenZCommon.numberWithCommas(res.totalPot).toString();
      this.bottomBtnsFreeSpinBalanceLbl.string = GenZCommon.numberWithCommas(
        res.currentMoney
      ).toString();
      this.bottomBtnsFreeSpinBetLv.string = GenZCommon.numberWithCommas(
        res.betAmount
      ).toString();
      this.balanceValue.string = GenZCommon.numberWithCommas(
        res.currentMoney
      ).toString();
      this.machineSlot.getComponent(GenZSlotMachine).letGo(res);
    }
  }

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new GenZCmd.SlotReceiveRoundResult();
    res.unpackData(data);

    // this.hideAllControl();
    // console.error(
    //   "GENZ",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "responseReceiveRoundResult",
    //   cmdId,
    //   res
    // );
    ////////////////////////////////////////////
    if (res.getError() != 0) {
      if (this.notiNoMoney.active == false) {
        this.noti.active = true;
      }
      return;
    } else {
      this.balance = res.currentMoney;
      this.machineSlot.getComponent(GenZSlotMachine).letGo(res);
      this.spinBtn[0].getComponent(cc.Button).interactable = true;
      this.bottomBtnsFreeSpinTotalWinLbl.string = "0";
      if (res.freeGameListOption.length > 0) {
        GenZSlotMachine.instance.isFree = true;
        this.freeSpin = true;
        this.freespinArray = [];
        this.freespinArray = res.freeGameListOption;
        // cc.log("FREESPIN", this.freespinArray);
      }
    }
  }

  activatebetOptions() {
    if (this.changeBetPermitted == true) {
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
      }
      this.betOptions.active = true;
    }
  }

  volumeCtrl() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    if (this.soundState == false) {
      GenZMusicManager.instance.setSystemVolume(0);
      cc.audioEngine.pauseAll();
      this.soundBtn[0].active = false;
      this.soundBtn[1].active = true;
      this.soundState = true;
    } else if (this.soundState == true) {
      GenZMusicManager.instance.setSystemVolume(1);
      cc.audioEngine.resumeAll();
      this.soundBtn[1].active = false;
      this.soundBtn[0].active = true;
      this.soundState = false;
    }
  }
  onClickAutoSpin() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    // if (this.autoState == false) {
    // this.autoState = true;
    this.autoSpinSetting.active = true;
    // }
    // else if (this.autoState == true) {
    //   this.autoBtn[1].active = false;
    //   this.autoBtn[0].active = true;
    //   this.autoSpinSetting.active = false;
    //   this.autoState = false;
    //   this.autoSpinNmb = 0;
    //   this.autoNumLbl.string = this.autoSpinNmb.toString();
    // }
  }

  stopAutoSpin() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    // if (this.autoState == true) {
    this.autoBtn[1].active = false;
    this.autoBtn[0].active = true;
    this.autoSpinSetting.active = false;
    this.autoState = false;
    this.autoSpinNmb = 0;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    // }
  }

  closeAutoSpinSetting() {
    this.autoState = false;
    this.autoSpinSetting.active = false;
  }

  autoSpinCtrl(eventdata, idx) {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    // cc.log(eventdata, idx);
    // if (this.autoState == false) {
    this.autoBtn[0].active = false;
    this.autoBtn[1].active = true;
    this.autoEnabled = true;
    this.autoSpinNmb = Number(idx);
    if (this.spinBtn[0].active == true) {
      this.onClickSpin();
    }

    this.spinBtn[0].active = false;
    this.spinBtn[1].active = true;
    this.autoNumLbl.string = this.autoSpinNmb.toString();
    this.autoSpinSetting.active = false;
    this.autoState = true;
    // this.closeAutoSpinSetting();
  }
  turboSpinCtrl() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    if (this.turboState == false) {
      this.turboBtn.getComponent(sp.Skeleton).setAnimation(0, "Down", false);
      this.turboState = true;
    } else if (this.turboState == true) {
      this.turboBtn.getComponent(sp.Skeleton).setAnimation(0, "Disable", false);
      this.turboState = false;
    }
  }

  protected onClickSpin() {
    // cc.log("ONCLICKSPIN");
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    }
    if (this.isSpinning == false) {
      this.balance -= this.currentBetLV;
      if (this.balance > 0) {
        this.balanceValue.string = GenZCommon.numberWithCommas(this.balance);
        this.isSpinning = true;
        this.changeBetBtn.getComponent(cc.Button).interactable = false;
        this.changeBetPermitted = false;
        this.spinBtn[0].getComponent(cc.Button).interactable = false;
        this.winValue.string = "0";
        GenZCmd.Send.sendSlotBet(this.currentBetLV);
        GenZSlotMachine.instance.letgoFake();
      } else {
        // this.balanceValue.string = GenZCommon.numberWithCommas(this.balance);
        this.isSpinning = true;
        this.changeBetBtn.getComponent(cc.Button).interactable = false;
        this.changeBetPermitted = false;
        this.spinBtn[0].getComponent(cc.Button).interactable = false;
        this.winValue.string = "0";
      }
    }

    this.spinBtn[0].active = false;
    if (this.autoEnabled == false) {
      this.spinBtn[2].active = true;
      this.spinBtn[2].getChildByName("spinEffect").active = true;
      this.spinBtn[2]
        .getChildByName("spinEffect")
        .getComponent(sp.Skeleton).animation = "Active";
      this.scheduleOnce(() => {
        this.spinBtn[2].getChildByName("spinEffect").active = false;
      }, 0.7);
    } else {
      this.spinBtn[1].active = true;
    }
  }

  protected onClickFreeSpin() {
    if (this.isSpinning == false) {
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
      }
      this.isSpinning = true;
      // cc.log("SPINONCLICKFREE");
      GenZCmd.Send.sendStartFreeGame();
      // GenZCmd.Send.sendSlotBet(this.currentBetLV);
      GenZSlotMachine.instance.letgoFake();
    }
  }

  stopSpinBtn() {
    this.spinBtn[2].children[1].getComponent(sp.Skeleton).animation = "Down";
  }

  reactivateSpinBtn() {
    GenZSlotMachine.instance.scatterCount = 0;

    this.balanceValue.string = GenZCommon.numberWithCommas(this.balance);
    // cc.log(this.autoEnabled, this.autoSpinNmb, "AUTO CHECK");
    if (this.autoEnabled == true) {
      if (this.autoSpinNmb == 0) {
        this.autoEnabled = false;

        if (this.freeSpin != true) {
          this.spinBtn[1].active = true;
        }
        this.autoBtn[1].active = false;
        this.autoBtn[0].active = true;
        // cc.log("FREESPIN CHECK END AUTO = 0", this.endFreeSpin);
        if (this.endFreeSpin == true) {
          this.activateFreeSpinWindowEnd();
        } else {
          this.spinBtn[0].getComponent(cc.Button).interactable = true;
          this.changeBetBtn.getComponent(cc.Button).interactable = true;
          this.changeBetPermitted = true;
          this.spinBtn[2].children[1].getComponent(sp.Skeleton).animation =
            "Up";
          this.spinBtn[0].active = true;
          this.spinBtn[2].active = false;
          this.spinBtn[1].active = false;
        }
      } else if (this.autoSpinNmb > 0) {
        this.winSkeleton.animation = "Hide";
        this.winningWindow.active = false;
        this.profitLabel.node.active = false;

        this.unschedule(this.toggleWinNode);
        this.winType = 0;
        this.autoSpinNmb--;
        this.autoNumLbl.string = this.autoSpinNmb.toString();

        // cc.log("FREESPIN CHECK END AUTO > 0", this.endFreeSpin);
        if (this.endFreeSpin == true) {
          this.activateFreeSpinWindowEnd();
        } else {
          if (this.freeSpin == true) {
            this.onClickFreeSpin();
          } else {
            this.onClickSpin();
          }
        }
      }
    } else if (this.autoEnabled == false) {
      this.spinBtn[0].getComponent(cc.Button).interactable = true;
      this.changeBetBtn.getComponent(cc.Button).interactable = true;
      this.changeBetPermitted = true;
      this.spinBtn[2].children[1].getComponent(sp.Skeleton).animation = "Up";
      this.spinBtn[0].active = true;
      this.spinBtn[2].active = false;
      this.spinBtn[1].active = false;
    }
  }

  toggleWinNode() {
    if (this.profitAmount > 0) {
      if (this.freeSpin == true) {
        this.bottomBtnsFreeSpinTotalWinLbl.string =
          this.totalFreeSpinProfit.toString();
      }

      if (this.profitAmount < this.currentBetLV * 20) {
        if (GenZMusicManager.instance.getSystemVolume() > 0) {
          GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.NORMAL_WIN);
        }
        this.winningWindow.active = true;
        this.winSkeleton.animation = "WinDefault";
        this.profitLabel.node.active = true;
        this.profitLabel.node.setPosition(0, 34, 0);
        this.profitLabel.node.setScale(0.8);
        BGUI.UINumericLabelHelper.scheduleForLabel(this.profitLabel, 0, 0.001); //RESET LABEL TO 0
        this.scheduleOnce(
          () =>
            BGUI.UINumericLabelHelper.scheduleForLabel(
              this.profitLabel,
              this.profitAmount,
              GenZMain.instance.turboState ? 0.4 : 0.8
            ),
          0.02
        );

        this.winValue.string = GenZCommon.numberWithCommas(
          this.profitAmount
        ).toString();
        this.scheduleOnce(() => {
          this.winningWindow.active = false;
          this.profitLabel.node.active = false;
          this.reactivateSpinBtn();
        }, 2);
      } else {
        this.setCountDownProfit(this.profitAmount);
      }
    }
  }

  activateFreeSpinWindow() {
    // cc.log("FREESPINWINDOWSTART");
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_START);
    }
    let finalNum = 0;
    this.freeSpinWindow.active = true;
    this.freeSpinNum.active = false;
    this.autoEnabled = true;
    this.freeSpinNum.getComponent(cc.Label).string = "0";
    // this.freeSpinWindow.getComponent(cc.Button).interactable = false;
    this.freeSpinWindow.getChildByName("interactStartClose").active = false;
    this.freeSpinSkeleton.animation = "FreeSpinStart_Active";
    this.hideStats();

    this.scheduleOnce(() => {
      this.freeSpinWindow.getChildByName("interactStartSkip").active = false;
    }, 14);

    this.scheduleOnce(() => {
      this.freeSpinSkeleton.getComponent(sp.Skeleton).animation =
        "FreeSpinStart_Loop";
      GenZCommon.shrinkZoomEffect(this.freeSpinNum, 1);
      this.scheduleOnce(() => {
        this.freeSpinWindow.getChildByName("interactStartClose").active = true;
      }, 1);
      if (this.autoEnabled == true) {
        this.scheduleOnce(this.closeFreeSpinWindow, 8);
      }
    }, 16);
    this.scheduleOnce(() => {
      this.freeSpinWindow.getChildByName("interactStartSkip").active = true;
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(
          SLOT_SOUND_TYPE.FREESPIN_REEL_APPEAR
        );
      }
      for (let i = 0; i < 9; i++) {
        let startDanceAnimation = this.freespinArray[i].toString() + "_Start";
        let loopDanceAnimation = this.freespinArray[i].toString() + "_Loop";
        this.freeSpinDancingNode.children[i].getComponent(
          sp.Skeleton
        ).animation = "Start";
        let finalDanceAnimation =
          this.freespinArray[i].toString() + "_End_" + i.toString();
        this.scheduleOnce(() => {
          this.freeSpinDancingNode.children[i].runAction(cc.fadeTo(0.5, 255));
        }, 0.22 * i);

        this.scheduleOnce(() => {
          this.freeSpinDancingNode.children[i].getComponent(
            sp.Skeleton
          ).animation = startDanceAnimation;
          this.scheduleOnce(() => {
            if (GenZMusicManager.instance.getSystemVolume() > 0) {
              switch (Number(this.freespinArray[i])) {
                case 1:
                  GenZMusicManager.instance.playType(
                    SLOT_SOUND_TYPE.FREESPIN_NUMBER_1_APPEAR
                  );
                  break;
                case 2:
                  GenZMusicManager.instance.playType(
                    SLOT_SOUND_TYPE.FREESPIN_NUMBER_2_APPEAR
                  );
                  break;
                case 3:
                  GenZMusicManager.instance.playType(
                    SLOT_SOUND_TYPE.FREESPIN_NUMBER_3_APPEAR
                  );
                  break;
              }
            }
            this.freeSpinDancingNode.children[i].getComponent(
              sp.Skeleton
            ).animation = loopDanceAnimation;
          }, 1.5);
        }, 0.4 * i + 5);
        this.scheduleOnce(() => {
          this.freeSpinDancingNode.children[i].getComponent(
            sp.Skeleton
          ).animation = finalDanceAnimation;
          this.scheduleOnce(() => {
            this.freeSpinNum.getComponent(cc.Label).string =
              finalNum.toString();
            finalNum += this.freespinArray[i];

            switch (Number(this.freespinArray[i])) {
              case 1:
                if (GenZMusicManager.instance.getSystemVolume() > 0) {
                  GenZMusicManager.instance.playType(
                    SLOT_SOUND_TYPE.FREESPIN_NUMBER_1
                  );
                }
                break;
              case 2:
                this.shakeScreen();
                if (GenZMusicManager.instance.getSystemVolume() > 0) {
                  GenZMusicManager.instance.playType(
                    SLOT_SOUND_TYPE.FREESPIN_NUMBER_2
                  );
                }
                break;
              case 3:
                this.shakeScreen();
                if (GenZMusicManager.instance.getSystemVolume() > 0) {
                  GenZMusicManager.instance.playType(
                    SLOT_SOUND_TYPE.FREESPIN_NUMBER_3
                  );
                }
                break;
            }

            this.freeSpinNum.active = true;
            this.freeSpinNumber = finalNum;
            this.scheduleOnce(() => {
              this.freeSpinNum.getComponent(cc.Label).string =
                finalNum.toString();
              this.stopShakeScreen();
            }, 0.3);
          }, 0.3);
          this.scheduleOnce(() => {
            this.freeSpinDancingNode.children[i].opacity = 0;
          }, 1);
        }, 0.333 * i + 10);
      }
    }, 1.5);
  }

  skipFreeSpinAnimation() {
    GenZMusicManager.instance.stopPlayLoop();
    this.freeSpinWindow.getChildByName("interactStartSkip").active = false;
    this.hideStats();
    this.stopShakeScreen();
    this.unschedule(this.closeFreeSpinWindow);
    this.unscheduleAllCallbacks();
    let finalNum = 0;
    this.autoEnabled = true;

    for (let i = 0; i < 9; i++) {
      this.freeSpinDancingNode.children[i].stopAllActions();
      this.freeSpinDancingNode.children[i].opacity = 0;
      finalNum += this.freespinArray[i];
    }
    this.freeSpinSkeleton.getComponent(sp.Skeleton).animation =
      "FreeSpinStart_Loop";
    this.freeSpinNum.active = true;
    this.freeSpinNum.getComponent(cc.Label).string = finalNum.toString();
    GenZCommon.shrinkZoomEffect(this.freeSpinNum, 1);
    this.scheduleOnce(() => {
      this.freeSpinWindow.getChildByName("interactStartClose").active = true;
    }, 0.5);
    // this.freeSpinWindow.getChildByName("interactStartClose").active = true;
    if (this.autoEnabled == true) {
      this.scheduleOnce(this.closeFreeSpinWindow, 7);
    }
  }

  activateFreeSpinWindowEnd() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_END);
    }
    this.showStats();
    this.endFreeSpin = false;
    this.freeSpin = false;
    this.freeSpinNum.active = false;
    GenZSlotMachine.instance.resetColumns();
    GenZSlotMachine.instance.resetColumnFree();
    GenZCommon.shrinkZoomEffect(this.freeSpinProfit, 0.9);
    this.freeSpinWindow.active = true;
    this.freeSpinNum.active = false;
    this.freeSpinProfit.getComponent(cc.Label).string = "0"
      BGUI.UINumericLabelHelper.scheduleForLabel(
        this.freeSpinProfit.getComponent(cc.Label),
        0,
        0
      );
    this.freeSpinSkeleton.getComponent(sp.Skeleton).animation =
      "FreeSpinEnd_Active";
    this.scheduleOnce(() => {
      this.freeSpinSkeleton.getComponent(sp.Skeleton).animation =
        "FreeSpinEnd_Loop";
      this.freeSpinProfit.active = true;
    }, 1);
    this.scheduleOnce(() => {
      // this.freeSpinProfit.active = true;
      BGUI.UINumericLabelHelper.scheduleForLabel(
        this.freeSpinProfit.getComponent(cc.Label),
        this.freespinTotalProfitAmount,
        2
      );
    }, 1.05);
    this.scheduleOnce(() => {
      this.freeSpinWindow.getChildByName("interactEndClose").active = true;
    }, 2);

    if (this.autoEnabled == true) {
      // cc.log("freeSpinAutoFix");
      this.scheduleOnce(this.closeFreeSpinWindowEnd, 7);
    }
  }

  closeFreeSpinWindow() {
    this.unscheduleAllCallbacks();
    this.unschedule(this.closeFreeSpinWindow);
    this.freeSpinWindow.getChildByName("interactStartClose").active = false;
    this.freeSpinNum.active = false;
    this.autoSpinNmb += this.freeSpinNumber;
    this.autoEnabled = true;
    // this.freeSpinWindow.getComponent(cc.Button).interactable = false;
    for (let i = 0; i < 9; i++) {
      this.freeSpinDancingNode.children[i].opacity = 0;
    }
    this.freeSpinSkeleton.getComponent(sp.Skeleton).animation =
      "FreeSpinStart_End";
    this.scheduleOnce(() => {
      this.freeSpinWindow.active = false;
    }, 0.3);
    this.freeSpinWindowHasActivated = true;
    this.reactivateSpinBtn();
  }

  closeFreeSpinWindowEnd() {
    this.showStats();
    // cc.log("FREESPINWINDOWENDCLOSE");
    this.unschedule(this.closeFreeSpinWindowEnd);
    this.unschedule(this.reactivateSpinBtn);
    this.freeSpinWindow.getChildByName("interactEndClose").active = false;
    GenZMusicManager.instance.stopAll();
    this.freeSpinNum.active = false;
    this.freeSpin = false;
    this.freeSpinWindowHasActivated = false;
    this.freeSpinSkeleton.getComponent(sp.Skeleton).animation =
      "FreeSpinEnd_End";
    this.scheduleOnce(() => {
      this.freeSpinWindow.active = false;
      this.freeSpinProfit.active = false;
      // this.reactivateSpinBtn();
      // GenZMusicManager.instance.playSlotMusic(
      //   GenZMusicManager.instance.mainBGM
      // );
    }, 0.3);
    // if (this.autoEnabled == true) {
    this.scheduleOnce(this.reactivateSpinBtn, 0.3);
    // }
  }

  public setCountDownProfit(profit) {
    this.winningWindow.active = true;
    this.skipAnimWindow.active = true;
    this.winSkeleton.node.active = true;
    this._localTimer = 0;
    this.profitLabel.node.active = true;
    if (
      this.profitAmount >= this.currentBetLV * 20 &&
      this.profitAmount < this.currentBetLV * 77
    ) {
      this.winType = 1;
    } else if (
      this.profitAmount >= this.currentBetLV * 77 &&
      this.profitAmount < this.currentBetLV * 770
    ) {
      this.winType = 2;
    } else if (this.profitAmount >= this.currentBetLV * 770) {
      this.winType = 3;
    }
    if (this._localTimer < profit) {
      this.profitLabel.string = this._localTimer.toString();
      this.schedule(
        this.countDownProfit,
        GenZMain.instance.turboState ? 0.0001 : 0.001
      );
    }
  }

  private countDownProfit(): void {
    if (this.winType == 1) {
      this._localTimer += this.currentBetLV / 5;
    } else if (this.winType == 2) {
      this._localTimer += (this.currentBetLV * 7) / 10;
    } else if (this.winType == 3) {
      this._localTimer += (this.currentBetLV * 70) / 10;
    }

    this.skipAnimWindow.active = true;
    if (this._localTimer <= this.profitAmount) {
      this.profitLabel.string = GenZCommon.numberWithCommas(
        this._localTimer
      ).toString();
      if (this._localTimer == this.currentBetLV * 20) {
        if (GenZMusicManager.instance.getSystemVolume() > 0) {
          GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_BIG);
        }
        this.showWinBig();
      } else if (this._localTimer == this.currentBetLV * 77) {
        if (GenZMusicManager.instance.getSystemVolume() > 0) {
          GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_MEGA);
        }
        this.unschedule(this.changeBigLoop);
        this.showWinMega();
      } else if (this._localTimer == this.currentBetLV * 770) {
        if (GenZMusicManager.instance.getSystemVolume() > 0) {
          GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_SUPER_MEGA);
        }
        this.unschedule(this.changeMegaLoop);
        this.unschedule(this.changeBigLoop);
        this.showWinSuperMega();
      }
    } else if (this._localTimer > this.profitAmount) {
      this.resetCountDown();
    }
  }

  showWinBig() {
    this.profitLabel.node.setPosition(0, 120, 0);
    this.profitLabel.node.setScale(0.8);
    this.winningWindow.active = true;
    this.winSkeleton.node.active = true;
    this.winSkeleton.animation = "WinBigStart";
    this.scheduleOnce(this.changeBigLoop, 0.02);
    // setTimeout(() => this.changeBigLoop, 200);
  }
  showWinMega() {
    this.unschedule(this.changeBigLoop);
    this.profitLabel.node.setPosition(0, 100, 0);
    this.profitLabel.node.setScale(1.3);
    this.winSkeleton.animation = "WinMegaStart";
    this.winningWindow.active = true;
    this.winSkeleton.node.active = true;
    this.scheduleOnce(this.changeMegaLoop, 1.8);
  }
  showWinSuperMega() {
    this.profitLabel.node.setPosition(0, 33, 0);
    this.profitLabel.node.setScale(1.6);
    this.winSkeleton.animation = "WinSuperMegaStart";
    this.winningWindow.active = true;
    this.winSkeleton.node.active = true;
    this.scheduleOnce(this.changeSuperMegaLoop, 1.8);
    this.unschedule(this.changeMegaLoop);
    this.unschedule(this.changeBigLoop);
  }

  changeBigLoop() {
    this.profitLabel.node.setPosition(0, 120, 0);
    this.profitLabel.node.setScale(0.8);
    this.winSkeleton.animation = "WinBigLoop";
  }
  changeMegaLoop() {
    this.unschedule(this.changeBigLoop);

    this.profitLabel.node.setPosition(0, 80, 0);
    this.profitLabel.node.setScale(1);
    this.winSkeleton.animation = "WinMegaLoop";
  }
  changeSuperMegaLoop() {
    // cc.log("changeSuperMegaLoop");
    this.unschedule(this.changeMegaLoop);
    this.unschedule(this.changeBigLoop);

    this.profitLabel.node.setPosition(0, 10, 0);
    this.profitLabel.node.setScale(1.2);
    this.winSkeleton.animation = "WinSuperMegaLoop";
  }

  skipWinBig() {
    this.resetCountDown();
    this.unschedule(this.countDownProfit);
    this.unschedule(this.changeBigLoop);
    this.unschedule(this.changeMegaLoop);
    this.unschedule(this.changeSuperMegaLoop);
    if (this.winType == 1) {
      this.profitLabel.node.setPosition(0, 135, 0);
      this.profitLabel.node.setScale(1);
      this.winSkeleton.animation = "WinBigLoop";
    } else if (this.winType == 2) {
      this.profitLabel.node.setPosition(0, 80, 0);
      this.profitLabel.node.setScale(1);
      this.winSkeleton.animation = "WinMegaLoop";
    } else if (this.winType == 3) {
      this.profitLabel.node.setPosition(0, 10, 0);
      this.profitLabel.node.setScale(1.2);
      this.winSkeleton.animation = "WinSuperMegaLoop";
    }
    this._localTimer = this.profitAmount;
    this.profitLabel.string = GenZCommon.numberWithCommas(
      this._localTimer
    ).toString();
  }

  closeWinBig() {
    this.unschedule(this.closeWinBig);
    if (this.winType == 1) {
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_BIG_END);
      }
      this.winSkeleton.animation = "WinBigEnd";
    } else if (this.winType == 2) {
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_MEGA_END);
      }
      this.winSkeleton.animation = "WinMegaEnd";
    } else if (this.winType == 3) {
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_SUPER_MEGA_END);
      }
      this.winSkeleton.animation = "WinSuperMegaEnd";
    }
    this.scheduleOnce(() => {
      this.profitLabel.node.setPosition(0, 37, 0);
      this.profitLabel.node.setScale(1);
      this.winSkeleton.animation = "WinBigStart";
      this.winningWindow.active = false;
      this.profitLabel.node.active = false;
      this.reactivateSpinBtn();
    }, 0.3);
    this.closeAnimWindow.active = false;
  }

  private resetCountDown(): void {
    this._localTimer = this.profitAmount;
    this.profitLabel.string = GenZCommon.numberWithCommas(
      this._localTimer
    ).toString();
    this.unschedule(this.countDownProfit);
    this.closeAnimWindow.active = true;
    this.skipAnimWindow.active = false;
    if (this.autoEnabled == true) {
      this.scheduleOnce(this.closeWinBig, 4);
    }
  }

  hideStats() {
    //FREESPIN START
    GenZMusicManager.instance.playSlotMusic(
      GenZMusicManager.instance.bgmFreeSpin
    );
    this.mainBG.animation = "TensionWin";
    this.scheduleOnce(() => {
      this.mainBG.animation = "FreeSpin_Idle";
    }, 1);
    this.spinBtn[0].active = false;
    this.spinBtn[1].active = false;
    this.spinBtn[2].active = false;
    this.turboBtn.active = false;
    this.changeBetBtn.active = false;
    this.autoCtrlBtn.active = false;
    this.bottomBtnsFreeSpin.stopAllActions();
    this.bottomBtns.active = false;
    this.bottomBtnsFreeSpin.active = true;
    this.bottomBtnsFreeSpinBetLv.string = this.betValue.string;
    this.bottomBtnsFreeSpinBalanceLbl.string = this.balanceValue.string;
  }

  showStats() {
    //FREESPIN END
    GenZMusicManager.instance.playSlotMusic(GenZMusicManager.instance.mainBGM);
    this.balanceValue.string = this.bottomBtnsFreeSpinBalanceLbl.string;
    this.freeSpinWindowHasActivated = false;
    this.mainBG.animation = "FreeSpinEnd_End";
    this.scheduleOnce(() => {
      this.mainBG.animation = "Idle";
    }, 2);
    this.profitLabel.string = "0";
    this.turboBtn.active = true;
    this.changeBetBtn.active = true;
    this.autoCtrlBtn.active = true;
    this.bottomBtns.stopAllActions();
    this.bottomBtnsFreeSpin.active = false;
    this.bottomBtns.active = true;
    if (this.autoEnabled == true || this.autoSpinNmb > 0) {
      this.spinBtn[1].active = true;
    } else {
      this.spinBtn[0].active = true;
    }
  }

  openInfo() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.wukongInfoNode.active = true;
    this.wukongInfoNode.children[0].active = true;
  }

  testWin() {
    this.profitAmount = 300000;
    this.winningWindow.active = true;
    this.winSkeleton.animation = "WinDefault";
    this.profitLabel.node.active = true;
    BGUI.UINumericLabelHelper.scheduleForLabel(this.profitLabel, 0, 0.01);
    this.scheduleOnce(
      () =>
        BGUI.UINumericLabelHelper.scheduleForLabel(
          this.profitLabel,
          this.profitAmount,
          0.8
        ),
      0.015
    );
  }

  interuptSpin() {
    GenZSlotMachine.instance.stopSpin();
  }

  testFree() {
    GenZCmd.Send.sendStartFreeGame();
  }
  testFreeWindow() {
    this.freespinArray = [1, 1, 1, 1, 1, 2, 3, 2, 1];
    this.activateFreeSpinWindow();
  }

  fakeRn() {
    // this.freeSpin = true

    let res = {
      betAmount: 30000,
      currentRound: 12,
      totalRound: 12,
      totalPot: 152000,
      items: [
        {
          id: 3, //0
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: 1, //1
          highlight: false,
        },
        {
          id: 5,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: 2, //2
          highlight: true,
        },
        {
          id: 4,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: 1, //3
          highlight: false,
        },
        {
          id: 4,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: 4, //0
          highlight: false,
        },
        {
          id: 8,
          highlight: true,
        },
        {
          id: -1,
          highlight: false,
        },
        {
          id: 8,
          highlight: false,
        },
        {
          id: 8,
          highlight: false,
        },
        {
          id: 13,
          highlight: false,
        },
        {
          id: 11,
          highlight: false,
        },
        {
          id: 10, //0
          highlight: false,
        },
        {
          id: 12,
          highlight: false,
        },
        {
          id: 6,
          highlight: false,
        },
        {
          id: 13,
          highlight: false,
        },
        {
          id: 10,
          highlight: true,
        },
        {
          id: 13,
          highlight: true,
        },
        {
          id: 7,
          highlight: true,
        },
        {
          id: 0, //0
          highlight: true,
        },
        {
          id: 8,
          highlight: false,
        },
        {
          id: 4,
          highlight: false,
        },
        {
          id: 7,
          highlight: true,
        },
        {
          id: 13,
          highlight: false,
        },
        {
          id: 4,
          highlight: false,
        },
        {
          id: 10,
          highlight: false,
        },
      ],
      // mark: [21, 28, 15, 22, 42],
      mark: [],
      type: 1,
      freeGameListOption: [],
      amountProfit: 0,
      currentMoney: 1826483576,
      date: "10/1/2024",
      time: "18:21:27",
    };
    GenZSlotMachine.instance.letgoFake();
    this.scheduleOnce(() => GenZSlotMachine.instance.letGo(res), 1);
    // GenZSlotMachine.instance.letGo(res);
  }

  shakeScreen() {
    // this.stopShakeScreen()
    this.gameScreen.stopAllActions();
    this.gameScreen.setPosition(0, 0, 0);
    var actMoveLeft = cc.moveBy(0.05, cc.v2(15, 0)).easing(cc.easeBackOut());
    var actMoveBackRight = cc
      .moveBy(0.05, cc.v2(-15, 0))
      .easing(cc.easeBackOut());
    var actMoveUp = cc.moveBy(0.05, cc.v2(0, 15)).easing(cc.easeBackOut());
    var actMoveBackDown = cc
      .moveBy(0.05, cc.v2(0, -15))
      .easing(cc.easeBackOut());
    var actMoveDown = cc.moveBy(0.05, cc.v2(0, -15)).easing(cc.easeBackOut());
    var actMoveBackUp = cc.moveBy(0.05, cc.v2(0, 15)).easing(cc.easeBackOut());
    var actMoveRight = cc.moveBy(0.05, cc.v2(-15, 0)).easing(cc.easeBackOut());
    var actMoveBackLeft = cc
      .moveBy(0.05, cc.v2(15, 0))
      .easing(cc.easeBackOut());
    var actionMng = cc
      .sequence(
        actMoveLeft,
        actMoveBackRight,
        actMoveUp,
        actMoveBackDown,
        actMoveRight,
        actMoveBackLeft,
        actMoveDown,
        actMoveBackUp
      )
      .repeatForever();
    this.gameScreen.runAction(actionMng);
  }

  stopShakeScreen() {
    this.gameScreen.stopAllActions();
    this.gameScreen.runAction(cc.moveTo(0.05, cc.v2(0, 0)));
  }

  
  testEndFreeSpin(){
    this.freespinTotalProfitAmount = 2500000000;
    this.activateFreeSpinWindowEnd()
  }
}
