// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import WukongSlotMachine from "./Wukong.SlotMachine";
import { WukongCmd } from "./Wukong.Cmd";
import { WukongConnector } from "./connector/Wukong.Connector";
import WukongMusicManager, { SLOT_SOUND_TYPE } from "./Wukong.MusicManager";
import WukongCommon from "./Wukong.Common";
import WukongColumn from "./Wukong.Column";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import test from "node:test";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WukongMain extends cc.Component {
  public static instance: WukongMain = null;
  @property(cc.Node)
  setting: cc.Node = null;
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
  spinBtnsNode: cc.Node = null;
  @property(cc.Node)
  infoBtnNode: cc.Node = null;

  @property(cc.Node)
  changeBetBtn: cc.Node = null;
  @property(cc.Node)
  turboBtn: cc.Node = null;
  @property(sp.Skeleton)
  turboToggle: sp.Skeleton = null;
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
  @property(cc.Label)
  grandJackpotLbl: cc.Label = null;
  @property(sp.SkeletonData)
  spinBtnSkeletons: sp.SkeletonData[] = [];
  @property(cc.Node)
  winningWindow: cc.Node = null;
  @property(cc.Node)
  winningWindowBig: cc.Node = null;
  @property(cc.Node)
  idleWinSmall: cc.Node = null;
  @property(cc.Label)
  idleLabelWinSmall: cc.Label = null;

  @property(cc.Node)
  skipAnimWindow: cc.Node = null;
  @property(cc.Node)
  closeAnimWindow: cc.Node = null;
  @property(cc.Node)
  skipAnimJackpotWindow: cc.Node = null;
  @property(cc.Node)
  closeAnimJackpotWindow: cc.Node = null;
  @property(cc.Node)
  jackpotWinAmountLbl: cc.Node = null;
  @property(cc.Node)
  winningWindowJackpot: cc.Node = null;
  @property(cc.Node)
  freeSpinStartWindow: cc.Node = null;
  @property(cc.Node)
  freeSpinNum: cc.Node = null;
  @property(cc.Node)
  freeSpinProfit: cc.Node = null;
  @property(cc.Node)
  coverPillar: cc.Node = null;
  @property(sp.Skeleton)
  winSkeleton: sp.Skeleton = null;
  @property(sp.Skeleton)
  winSkeletonBig: sp.Skeleton = null;
  @property(sp.Skeleton)
  winSkeletonJackpot: sp.Skeleton = null;
  @property(cc.Label)
  profitLabel: cc.Label = null; //profit earned display on screen
  @property(sp.Skeleton)
  mainBG: sp.Skeleton = null;
  @property(cc.Node)
  gameScreen: cc.Node = null;
  @property(cc.Node)
  mainGameNode: cc.Node = null;
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
  @property(cc.Prefab)
  wukongInfo: cc.Prefab = null;
  @property(cc.Prefab)
  wukongGuide: cc.Prefab = null;
  @property(cc.Node)
  wukongHistory: cc.Node = null;
  @property(cc.Node)
  public noti: cc.Node = null;
  @property(cc.Node)
  public wukongInfoNode: cc.Node = null;
  public historySpin = [];
  public freeSpinReslt = [];
  public balance: number = 0;
  public autoSpinNmb: number = 0;
  public currentBetLV = 200;
  public profitAmount: number = 0;
  public freespinTotalProfitAmount: number = 0;
  public totalFreeSpinProfit: number = 0;
  public turboState: boolean = false;
  private soundState: boolean = false;
  private autoState: boolean = false;
  public autoEnabled: boolean = false;
  public freeSpin: boolean = false;
  public freeSpinType: number = 0;
  public freeSpinNumber: number = 12;
  private freeSpinAmount: number = 0;
  private _localTimer: number = 0;
  private winType: number = 0;
  private jackpotWinAmount: number = 0;
  public jackpotType: number = 0; //0 = mini; 1 = minor  ; 2 = major
  public endFreeSpin: boolean = false;
  public isSpinning: boolean = false;
  //FREESPINTEST
  private testCounter: number = 0;
  private actionMng;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    WukongMain.instance = this;
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_KICK_OUT,
      this.responseUserOut,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveGameInfo,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_JACKPOT_RESULT,
      this.responseReceiveJackpotResult,
      this
    );
    WukongConnector.instance.addCmdListener(
      WukongCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    WukongConnector.instance.connect();

    // this.changeScreenOrientation();
    // cc.view.setResizeCallback(() => {
    //   this.changeScreenOrientation();
    // });
    // cc.view.resizeWithBrowserSize(true)
  }

  protected onDestroy(): void {}

  protected onEnable(): void {
    WukongConnector.instance.connect();
    cc.audioEngine.stopAll();
    WukongMusicManager.instance.playSlotMusic(
      WukongMusicManager.instance.mainBGM
    );
  }

  protected onDisable(): void {
    WukongConnector.instance.disconnect();
  }

  ///////////////////////////////////////test

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOT DISCONNECT: ",
      cmdId
    );
  }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new WukongCmd.WukongReceivedLogin();
    res.unpackData(data);
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOT LOGIN: ",
      cmdId,
      res
    );
    ////////////////////////////////////////////
    let err = res.getError();
    let msg = "";
    switch (err) {
      case 3:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("wukong.connection_error");
        //  PlinkoCmd.Send.sendPlinkoJoinGame();
        break;
      case 1:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("wukong.connection_error");
        break;
      case 2:
        cc.error("LOGIN_ERROR", err);
        msg = LanguageMgr.getString("wukong.connection_error");
        break;
      case 0:
        WukongCmd.Send.sendSlotJoinGame(30000);

        break;

      default:
        msg = LanguageMgr.getString("wukong.connection_error");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
    }
    // WukongCmd.Send.sendSlotJoinGame(25000);
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "JOIN ROOM",
      cmdId
    );
  }

  protected responseReceiveGameInfo(cmdId: any, data: Uint8Array) {
    let res = new WukongCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5002",
      cmdId,
      res
    );
    this.changeBetBtn.active = true;
    this.autoCtrlBtn.active = true;
    this.spinBtn[0].active = true;
    ////////////////
    this.grandJackpotLbl.string = WukongCommon.numberWithCommas(
      res.amountFundBonus
    ).toString();
    this.currentBetLV = res.betAmount;
    this.betValue.string = WukongCommon.numberWithCommas(
      res.betAmount
    ).toString();
    this.balanceValue.string = WukongCommon.numberWithCommas(res.currentMoney);
    if (res.freeGameResult != null) {
      console.error(
        "SLOT_51",
        new Date().toLocaleString(),
        new Date().getMilliseconds(),
        "START FREE GAME: ",
        cmdId,
        res
      );
      this.autoState = true;
      this.freeSpin = true;
      // this.autoSpinNmb =
      //   res.freeGameResult.totalRound - res.freeGameResult.currentRound;
      this.bottomBtnsFreeSpinBalanceLbl.string = res.currentMoney.toString();
      this.bottomBtnsFreeSpinTotalWinLbl.string =
        res.freeGameResult.totalPot.toString();
      this.bottomBtnsFreeSpinBetLv.string = res.betAmount.toString();
      this.bottomBtnsFreeSpinNumber.string = (
        res.freeGameResult.totalRound -
        res.freeGameResult.currentRound -
        1
      ).toString();
      if (res.freeGameResult.type == 1) {
        this.togglePilar();
      } else if (res.freeGameResult.type == 2) {
        this.autoEnabled = true;
        this.changeBgFreeSpin();
        this.hideStats();
        this.scheduleOnce(() => {
          this.onClickFreeSpin();
        }, 3);
      }
      // WukongCmd.Send.sendStartFreeGame();
    } else if (res.jackpotResult != null) {
      console.error(
        "SLOT_51",
        new Date().toLocaleString(),
        new Date().getMilliseconds(),
        "OPEN POPUP JACKPOT: ",
        cmdId,
        res
      );
      WukongCmd.Send.sendOpenJackpot();
    } else {
      // Fake action user
      // WukongCmd.Send.sendSlotBet(res.betAmount);
    }
  }

  protected responseUserOut(cmdId: any, data: Uint8Array) {
    let res = new WukongCmd.SlotReceiveUserOut();
    res.unpackData(data);
    ////////////////////////////////////////////
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOT_RECEIVE_USER_OUT",
      cmdId,
      res
    );
    this.backToLobby();
  }
  private backToLobby() {
    WukongConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }
  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new WukongCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    // console.error(
    //   "SLOT_51",
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "5003",
    //   cmdId,
    //   res
    // );
    let amountFundBonus = res.amountFundBonus;
    this.grandJackpotLbl.string =
      WukongCommon.numberWithCommas(amountFundBonus).toString();
  }

  // 5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new WukongCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5005",
      cmdId,
      res
    );

    let msg = LanguageMgr.getString("wukong.connection_error");
    this.noti.active = true;
  }

  // 5006
  protected responseReceiveJackpotResult(cmdId: any, data: Uint8Array) {
    let res = new WukongCmd.SlotReceiveJackpotResult();
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
    this.jackpotType = res.idJackpot;

    this.showJackpot();
    this.winValue.string = WukongCommon.numberWithCommas(
      res.winMoney
    ).toString();
    this.balanceValue.string = WukongCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.jackpotWinAmount = res.winMoney;
    this.grandJackpotLbl.string = WukongCommon.numberWithCommas(
      res.amountFundBonus
    ).toString();
    // TODO: Implement display result jackpot
  }
  fakeInfoJackpot() {
    this.jackpotType = 1;
    this.jackpotWinAmount = 231000;
    this.showJackpot();
    cc.log("fakeJackpot");
  }
  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    this.interuptSpin();
    let res = new WukongCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5008",
      cmdId,
      res
    );
    if (res.getError() != 0) {
      return;
    }
    this.bottomBtnsFreeSpinNumber.string = (
      res.totalRound - res.currentRound
    ).toString();
    if (res.totalRound == res.currentRound) {
      this.endFreeSpin = true;
    }
    cc.log(res.totalRound - res.currentRound, "FREESPIN TEST MINUS ROUND");
    this.profitAmount = res.amountProfit;
    // if (res.totalRound - res.currentRound == 1){
    //   WukongSlotMachine.instance.almostEndFreeSpin = true
    //   cc.log(res.totalRound - res.currentRound, "FREESPIN TEST MINUS ROUND")
    // }
    this.freeSpinProfit.getComponent(cc.Label).string = res.totalPot.toString();
    // TODO: Implement display result free game and continue run start free game or finish free game
    if (res.type == 1) {
      this.freeSpinType = 1;

      // res.items only have 3x3
      if (res.isUnlockAll) {
        // this.freeSpinType = 2;
        WukongSlotMachine.instance.almostEndFreeSpin = true;
        //TODO: Display unlock 2 column after show result
      }
    } else {
      this.freeSpinType = 2;
      // res.items have 3x5
    }
    this.bottomBtnsFreeSpinBalanceLbl.string = WukongCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.bottomBtnsFreeSpinBetLv.string = WukongCommon.numberWithCommas(
      res.betAmount
    ).toString();
    this.balanceValue.string = WukongCommon.numberWithCommas(
      res.currentMoney
    ).toString();
    this.machineSlot.getComponent(WukongSlotMachine).letGoFreeSpin(res);
  }

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    // this.interuptSpin()
    let res = new WukongCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    this.spinBtn[0].getComponent(cc.Button).interactable = true;
    // this.hideAllControl();
    console.error(
      "SLOT_51",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "responseReceiveRoundResult",
      cmdId,
      res
    );
    ////////////////////////////////////////////

    this.balance = res.currentMoney;

    // if (res.type == WukongCmd.ROUND_RESULT_TYPE.FREE_GAME) {
    //   // this.machineSlot = ;
    // } else if (res.type == WukongCmd.ROUND_RESULT_TYPE.JACKPOT) {
    //   // this.jackpotType =
    // } else if (res.type == WukongCmd.ROUND_RESULT_TYPE.LINE_WIN) {
    this.machineSlot.getComponent(WukongSlotMachine).letGo(res);
    // }
  }

  activateSetting() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.setting.active = true;
  }
  deactivateSetting() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.setting.active = false;
  }
  activateGuide() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    BGUI.UIPopupManager.instance.showPopupFromPrefab(this.wukongGuide);
  }

  activatebetOptions() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.betOptions.active = true;
  }

  volumeCtrl() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    if (this.soundState == false) {
      WukongMusicManager.instance.setSystemVolume(0);
      cc.audioEngine.pauseAll();
      this.soundBtn[0].active = false;
      this.soundBtn[1].active = true;
      this.soundState = true;
    } else if (this.soundState == true) {
      WukongMusicManager.instance.setSystemVolume(1);
      cc.audioEngine.resumeAll();
      this.soundBtn[1].active = false;
      this.soundBtn[0].active = true;
      this.soundState = false;
    }
  }
  onClickAutoSpin() {
    // cc.log(this.autoState);
    if (this.autoState == false) {
      this.autoState = true;
      this.autoSpinSetting.active = true;
    } else if (this.autoState == true) {
      this.autoBtn[1].active = false;
      this.autoBtn[0].active = true;
      this.autoSpinSetting.active = false;
      this.autoState = false;
      this.autoSpinNmb = 0;
      this.autoNumLbl.string = this.autoSpinNmb.toString();
    }
    // cc.log(this.autoState, this.autoSpinNmb);
  }
  closeAutoSpinSetting() {
    this.autoSpinSetting.active = false;
  }

  autoSpinCtrl(eventdata, idx) {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    // cc.log(eventdata, idx);
    // if (this.autoState == false) {
    this.autoBtn[0].active = false;
    this.autoBtn[1].active = true;
    this.autoEnabled = true;
    this.autoSpinNmb = Number(idx);
    // cc.error(this.autoSpinNmb, "auto num");
    if (this.spinBtn[0].active == true) {
      this.onClickSpin();
    }

    this.spinBtn[0].active = false;
    this.spinBtn[1].active = true;
    this.autoNumLbl.string = this.autoSpinNmb.toString();

    this.closeAutoSpinSetting();
    // } else if (this.autoState == true) {
    //   this.autoBtn[1].active = false;
    //   this.autoBtn[0].active = true;
    //   this.autoState = false;
    // }
  }
  turboSpinCtrl() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    if (this.turboState == false) {
      this.turboBtn.getComponent(sp.Skeleton).setAnimation(0, "Down", false);
      this.turboToggle.animation = "Down";
      this.turboState = true;
    } else if (this.turboState == true) {
      this.turboBtn.getComponent(sp.Skeleton).setAnimation(0, "Disable", false);
      this.turboToggle.animation = "Disable";
      this.turboState = false;
    }
  }

  protected onClickSpin() {
    cc.log("ONCLICKSPIN");
    if (this.isSpinning == false) {
      this.unschedule(this.activateIdleWin);
      this.isSpinning = true;
      this.changeBetBtn.getComponent(cc.Button).interactable = false;
      // WukongCmd.Send.sendSlotJoinGame(30000)
      // let array = [25000, 50000, 100000, 250000, 500000, 100000];
      // cc.log("SPINONCLICK");

      this.spinBtn[0].getComponent(cc.Button).interactable = false;
      this.winValue.string = "0";
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

    this.deactivateSetting();
    WukongCmd.Send.sendSlotBet(this.currentBetLV);
    WukongSlotMachine.instance.letgoFake();
  }

  protected onClickFreeSpin() {
    if (this.isSpinning == false) {
      this.isSpinning = true
      this.deactivateSetting();
      cc.log("SPINONCLICKFREE");
      WukongCmd.Send.sendStartFreeGame();
    }
  }

  stopSpinBtn() {
    this.spinBtn[2].getComponent(sp.Skeleton).animation = "Down";
  }

  reactivateSpinBtn() {
    WukongSlotMachine.instance.scatterCount = 0;
    WukongSlotMachine.instance.jackpotCount = 0;
    
    this.balanceValue.string = WukongCommon.numberWithCommas(this.balance);
    if (this.autoEnabled == true) {
      if (this.autoSpinNmb == 0) {
        // cc.log("FREESPINTEST AUTO END");
        this.autoEnabled = false;
        if (this.freeSpin != true) {
          this.spinBtn[1].active = true;
        }
        this.autoBtn[1].active = false;
        this.autoBtn[0].active = true;
        cc.log("FREESPIN CHECK END AUTO = 0", this.endFreeSpin);
        if (this.endFreeSpin == true) {
          this.activateFreeSpinWindowEnd();
        } else {
          this.reactivateSpinBtn();
        }
        // if (this.freeSpin == true) {
        //   this.activateFreeSpinWindowEnd();
        // }
      } else if (this.autoSpinNmb > 0) {
        // cc.log("FREESPINTEST AUTO RESUME");
        this.winSkeleton.animation = "Hide";
        this.winningWindow.active = false;
        this.profitLabel.node.active = false;
        this.idleWinSmall.active = false;
        this.unschedule(this.toggleWinNode);
        this.winType = 0;
        this.autoSpinNmb -= 1;
        this.autoNumLbl.string = this.autoSpinNmb.toString();
        // this.freeSpin == true
        //   ? this.scheduleOnce(() => this.onClickFreeSpin(), 1)
        //   : this.onClickSpin();
        //FREESPINTEST
        cc.log("FREESPIN CHECK END AUTO > 0", this.endFreeSpin);
        if (this.endFreeSpin == true) {
          this.activateFreeSpinWindowEnd();
        } else {
          // cc.log(
          //   "FREESPINTEST COUNTER 0",
          //   new Date().toLocaleString(),
          //   new Date().getMilliseconds()
          // );
          if (this.freeSpin == true) {
            this.onClickFreeSpin();
            // if (this.testCounter == 0) {
            //   this.fakeRunFreeSpin2();
            //   this.testCounter += 1;
            // } else if (this.testCounter >= 1) {
            //   this.testCounter += 1;
            //   // cc.log("FREESPINTEST", this.testCounter);
            //   if (this.testCounter < 2) {
            //     this.fakeRunFreeSpin3();
            //   } else if (this.testCounter == 2) {
            //     this.endFreeSpin = true;
            //     cc.log("FREESPIN FINAL ROUND", this.endFreeSpin);
            //     this.fakeRunFreeSpin4();
            //   }
            // }
          } else {
            this.onClickSpin();
          }
        }
      }
    } else if (this.autoEnabled == false) {
      this.changeBetBtn.getComponent(cc.Button).interactable = true;
      this.spinBtn[2].getComponent(sp.Skeleton).animation = "Up";
      this.spinBtn[0].active = true;
      this.spinBtn[2].active = false;
      this.spinBtn[1].active = false;
    }
  }

  toggleWinNode() {
    // cc.log("FREESPINTEST WIN START", this.profitAmount);
    if (this.profitAmount > 0) {
      // cc.log("FREESPINTEST WIN SMALL");
      if (this.profitAmount < this.currentBetLV * 20) {
        if (WukongMusicManager.instance.getSystemVolume() > 0) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.NORMAL_WIN);
        }
        this.winningWindow.active = true;
        this.winSkeleton.animation = "Active";
        this.profitLabel.node.active = true;

        BGUI.UINumericLabelHelper.scheduleForLabel(
          this.profitLabel,
          this.profitAmount,
          1
        );

        this.winValue.string = WukongCommon.numberWithCommas(
          this.profitAmount
        ).toString();
        this.scheduleOnce(() => {
          this.winSkeleton.animation = "Hide";
          this.winningWindow.active = false;
          this.profitLabel.node.active = false;
          this.reactivateSpinBtn();
        }, 2);
        if (this.autoEnabled == false) {
          this.scheduleOnce(() => this.activateIdleWin(), 2);
        }
      } else {
        // cc.log("FREESPINTEST WIN BIG");
        this.setCountDownProfit(this.profitAmount);
      }
    }
  }

  activateIdleWin() {
    this.idleWinSmall.active = true;
    this.idleLabelWinSmall.string = WukongCommon.numberWithCommas(
      this.profitAmount
    ).toString();
  }

  activateFreeSpinWindow() {
    this.autoEnabled = true;
    this.freeSpinStartWindow.active = true;
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_START);
    }
    this.scheduleOnce(() => {
      this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
        "FreeSpinStart_Loop";
      this.freeSpinNum.active = true;
      this.freeSpinNum.getComponent(cc.Label).string =
        this.freeSpinNumber.toString();
    }, 1.2);
    this.scheduleOnce(() => {
      this.freeSpinStartWindow.children[1].active = true;
    }, 1.5);
    this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
      "FreeSpinStart_Active";

    if (this.autoEnabled == true) {
      // cc.log("freeSpinAutoFix");
      this.scheduleOnce(() => this.closeFreeSpinWindow(), 5);
    }
  }

  activateFreeSpinWindowEnd() {
    cc.log("FreeSpinWindowEnd");

    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_END);
    }
    for (let i = 0; i < 30; i++) {
      WukongSlotMachine.instance.lineWinFxs.children[i].active = false;
    }

    WukongSlotMachine.instance.resetColumns();
    WukongSlotMachine.instance.almostEndFreeSpin = false;
    this.endFreeSpin = false;
    this.freeSpin = false;
    this.freeSpinStartWindow.active = true;
    WukongSlotMachine.instance.unlockAll = false;
    this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
      "FreeSpinEnd_Active";
    this.scheduleOnce(() => {
      this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
        "FreeSpinEnd_Loop";
      this.freeSpinProfit.active = true;
      // this.freeSpinProfit.getComponent(cc.Label).string =
      //   WukongCommon.numberWithCommas(
      //     this.freespinTotalProfitAmount
      //   ).toString();
      BGUI.UINumericLabelHelper.scheduleForLabel(
        this.freeSpinProfit.getComponent(cc.Label),
        this.freespinTotalProfitAmount,
        4
      );
    }, 1);
    this.scheduleOnce(() => {
      this.freeSpinStartWindow.children[2].active = true;
    }, 1.5);
    if (this.autoEnabled == true) {
      // cc.log("freeSpinAutoFix");
      this.scheduleOnce(() => this.closeFreeSpinWindowEnd(), 7);
    }
    this.showStats();
    this.changeBgMain();
  }

  closeFreeSpinWindow() {
    this.unschedule(this.activateFreeSpinWindow);
    this.freeSpinStartWindow.children[1].active = false;

    this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
      "FreeSpinStart_End";
    this.scheduleOnce(() => {
      this.freeSpinStartWindow.active = false;
    }, 0.3);
    this.scheduleOnce(() => {
      this.togglePilar();
    }, 0.6);
  }

  closeFreeSpinWindowEnd() {
    WukongMusicManager.instance.stopAll();
    this.freeSpinStartWindow.children[2].active = false;
    this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
      "FreeSpinEnd_End";
    this.scheduleOnce(() => {
      this.freeSpinStartWindow.active = false;
      this.freeSpinProfit.active = false;
      this.reactivateSpinBtn();
      WukongMusicManager.instance.playSlotMusic(
        WukongMusicManager.instance.mainBGM
      );
    }, 0.3);
  }

  togglePilar() {
    this.autoEnabled = true;
    if (this.coverPillar.active == false) {
      this.hideStats();
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.PILLAR_APPEAR);
      }
      cc.log("TEST JACKPOT AUTO 2");
      this.spinBtn[0].active = false;
      this.spinBtn[1].active = false;
      this.spinBtn[2].active = false;
      this.freeSpinStartWindow.getComponent(sp.Skeleton).animation =
        "FreeSpinStart_End";
      this.freeSpinNum.active = false;
      this.scheduleOnce(() => {
        this.freeSpinStartWindow.active = false;
      }, 0.3);
      this.scheduleOnce(() => {
        this.coverPillar.active = true;
        this.coverPillar.getComponent(sp.Skeleton).animation = "Active";
      }, 0.7);

      this.scheduleOnce(() => {
        this.coverPillar.getComponent(sp.Skeleton).animation = "Idle";
      }, 2.2);

      this.scheduleOnce(() => {
        this.autoSpinNmb += this.freeSpinNumber;
        // cc.log("togglePillar", this.autoSpinNmb);
        this.autoEnabled = true;
        this.freeSpin = true;

        WukongMusicManager.instance.stopAll();
        WukongMusicManager.instance.playSlotMusic(
          WukongMusicManager.instance.bgmFreeSpin
        );

        this.reactivateSpinBtn();
        //FREESPINTEST
        // this.fakeRunFreeSpin();
      }, 2.4);
    }
  }

  destroyPilar() {
    // cc.log("DestroyPillar");
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.PILLAR_BREAK);
    }

    this.coverPillar.getComponent(sp.Skeleton).animation = "Disappear";
    this.scheduleOnce(() => {
      this.coverPillar.active = false;
      // cc.log("FREESPINTEST PILLAR END");
      this.reactivateSpinBtn();
    }, 2);
  }

  public setCountDownProfit(profit) {
    cc.log("HHHH setCountdownProfit");
    this.winningWindowBig.active = true;
    this.skipAnimWindow.active = true;
    this.winSkeletonBig.node.active = true;
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
    // cc.log(this.winType, "winType");
    if (this._localTimer < profit) {
      this.profitLabel.string = this._localTimer.toString();
      this.schedule(this.countDownProfit, 0.001);
    }
  }

  private countDownProfit(): void {
    cc.log(
      "HHHH CountdownProfit",
      this._localTimer,
      this.profitAmount,
      this.winType
    );
    if (this.winType == 1) {
      this._localTimer += this.currentBetLV / 5;
    } else if (this.winType == 2) {
      this._localTimer += (this.currentBetLV * 7) / 10;
    } else if (this.winType == 3) {
      this._localTimer += (this.currentBetLV * 70) / 10;
    }
    // }
    this.skipAnimWindow.active = true;
    if (this._localTimer <= this.profitAmount) {
      this.profitLabel.string = WukongCommon.numberWithCommas(
        this._localTimer
      ).toString();
      if (this._localTimer == this.currentBetLV * 20) {
        // cc.log("HHHH setCountdownProfit1", this._localTimer);
        if (WukongMusicManager.instance.getSystemVolume() > 0) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_BIG);
        }
        this.showWinBig();
      } else if (this._localTimer == this.currentBetLV * 77) {
        // cc.log("HHHH setCountdownProfit2", this._localTimer);
        if (WukongMusicManager.instance.getSystemVolume() > 0) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_MEGA);
        }
        this.showWinMega();
      } else if (this._localTimer == this.currentBetLV * 770) {
        // cc.log("HHHH setCountdownProfit3", this._localTimer);
        if (WukongMusicManager.instance.getSystemVolume() > 0) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_SUPER_MEGA);
        }
        this.showWinSuperMega();
      }
    } else if (this._localTimer > this.profitAmount) {
      cc.error("thisresetCountdown", this._localTimer);

      this.resetCountDown();
    }
  }

  showWinBig() {
    cc.log("SHOW WIN BIG");
    this.winningWindowBig.active = true;
    this.winSkeletonBig.node.active = true;
    this.winSkeletonBig.animation = "WinBigStart";
    this.scheduleOnce(() => this.changeBigLoop(), 0.02);

    // setTimeout(() => this.changeBigLoop, 200);
  }
  showWinMega() {
    cc.log("SHOW WIN MEGA");
    this.winSkeletonBig.animation = "WinMegaStart";

    this.winningWindowBig.active = true;
    this.winSkeletonBig.node.active = true;

    this.unschedule(this.changeBigLoop);
    this.scheduleOnce(this.changeMegaLoop, 1.8);
  }
  showWinSuperMega() {
    cc.log("SHOW WIN SUPER MEGA");
    this.winSkeletonBig.animation = "WinSuperMegaStart";
    // cc.log("WINSUPERMEGA");
    this.winningWindowBig.active = true;
    this.winSkeletonBig.node.active = true;
    this.unschedule(this.changeMegaLoop);
    this.unschedule(this.showWinMega);
    // this.testSchedule3 = this.scheduleOnce(this.changeSuperMegaLoop, 1.8);
    this.scheduleOnce(this.changeSuperMegaLoop, 1.8);
  }

  changeBigLoop() {
    cc.log("SHOW WIN BIG LOOP");
    this.winSkeletonBig.animation = "WinBigLoop";
  }
  changeMegaLoop() {
    this.winSkeletonBig.animation = "WinMegaLoop";
  }
  changeSuperMegaLoop() {
    this.winSkeletonBig.animation = "WinSuperMegaLoop";
  }

  skipWinBig() {
    this.resetCountDown();
    this.unschedule(this.countDownProfit);
    this.unschedule(this.showWinBig);
    this.unschedule(this.showWinMega);
    this.unschedule(this.showWinSuperMega);
    if (this.winType == 1) {
      this.winSkeletonBig.animation = "WinBigLoop";
    } else if (this.winType == 2) {
      this.winSkeletonBig.animation = "WinMegaLoop";
    } else if (this.winType == 3) {
      this.winSkeletonBig.animation = "WinSuperMegaLoop";
    }
    this._localTimer = this.profitAmount;
    this.profitLabel.string = WukongCommon.numberWithCommas(
      this._localTimer
    ).toString();
  }

  closeWinBig() {
    if (this.winType == 1) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_BIG_END);
      }
      this.winSkeletonBig.animation = "WinBigEnd";
    } else if (this.winType == 2) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_MEGA_END);
      }
      this.winSkeletonBig.animation = "WinMegaEnd";
    } else if (this.winType == 3) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(
          SLOT_SOUND_TYPE.WIN_SUPER_MEGA_END
        );
      }
      this.winSkeletonBig.animation = "WinSuperMegaEnd";
    }
    this.scheduleOnce(() => {
      this.winSkeletonBig.animation = "WinBigStart";
      this.winningWindowBig.active = false;
      this.profitLabel.node.active = false;
      this.scheduleOnce(() => {
        if (this.autoEnabled == true) {
          cc.log("FREESPINTEST WIN BIG END");
          this.reactivateSpinBtn();
        }
      }, 2);
    }, 0.3);
    this.closeAnimWindow.active = false;
  }

  private resetCountDown(): void {
    this._localTimer = this.profitAmount;
    this.profitLabel.string = WukongCommon.numberWithCommas(
      this._localTimer
    ).toString();
    this.unschedule(this.countDownProfit);
    this.closeAnimWindow.active = true;
    this.skipAnimWindow.active = false;
    if (this.autoEnabled == true) {
      this.scheduleOnce(() => this.closeWinBig(), 2);
    }
  }

  changeBgFreeSpin() {
    this.mainBG.animation = "TensionWin";
    this.scheduleOnce(() => {
      this.mainBG.animation = "FreeSpin_Idle";
    }, 1);
  }

  changeBgMain() {
    this.mainBG.animation = "FreeSpinEnd_End";
    this.scheduleOnce(() => {
      this.mainBG.animation = "Idle";
    }, 2);
  }

  shakeScreen() {
    cc.log("SJAKE");
    // this.gameScreen.stopAllActions()
    var actMoveLeft = cc.moveBy(0.05, cc.v2(10, 0)).easing(cc.easeBackOut());
    var actMoveBackRight = cc
      .moveBy(0.05, cc.v2(-10, 0))
      .easing(cc.easeBackOut());
    var actMoveUp = cc.moveBy(0.05, cc.v2(0, 10)).easing(cc.easeBackOut());
    var actMoveBackDown = cc
      .moveBy(0.05, cc.v2(0, -10))
      .easing(cc.easeBackOut());
    var actMoveDown = cc.moveBy(0.05, cc.v2(0, -10)).easing(cc.easeBackOut());
    var actMoveBackUp = cc.moveBy(0.05, cc.v2(0, 10)).easing(cc.easeBackOut());
    var actMoveRight = cc.moveBy(0.05, cc.v2(-10, 0)).easing(cc.easeBackOut());
    var actMoveBackLeft = cc
      .moveBy(0.05, cc.v2(10, 0))
      .easing(cc.easeBackOut());
    this.actionMng = cc
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
    this.gameScreen.runAction(this.actionMng);
  }

  stopShakeScreen() {
    this.gameScreen.stopAllActions();
    this.gameScreen.runAction(cc.moveTo(0.01, cc.v2(0, 0)));
  }

  showJackpot() {
    cc.log("SHOWJACKPOT");
    this.unschedule(this.changeAnimJackpotToLoop);
    this.unschedule(this.countDownProfitJackpot);
    this.jackpotWinAmountLbl.active = false;
    this.winningWindowJackpot.active = true;
    this.skipAnimJackpotWindow.active = true;
    if (this.jackpotType == 1) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.JACKPOT_WIN_MINI);
      }
      this.winSkeletonJackpot.animation = "WinCommonMiniStart";
      this.scheduleOnce(() => {
        this.changeAnimJackpotToLoop();
      }, 4);
      // this.scheduleOnce(() => {
      //   if (this.autoEnabled == true) {
      //     this.hideJackpot();
      //   }
      // }, 12);
    } else if (this.jackpotType == 2) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.JACKPOT_WIN_MINOR);
      }
      this.winSkeletonJackpot.animation = "WinCommonMinorStart";
      this.scheduleOnce(() => {
        this.changeAnimJackpotToLoop();
      }, 8.5);
      // this.scheduleOnce(() => {
      //   if (this.autoEnabled == true) {
      //     this.hideJackpot();
      //   }
      // }, 15);
    } else if (this.jackpotType == 3) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.JACKPOT_WIN_MAJOR);
      }
      this.winSkeletonJackpot.animation = "WinCommonMajorStart";
      this.scheduleOnce(() => {
        this.changeAnimJackpotToLoop();
      }, 12.7);
      // this.scheduleOnce(() => {
      //   if (this.autoEnabled == true) {
      //     this.hideJackpot();
      //   }
      // }, 18);
    }
  }

  changeAnimJackpotToLoop() {
    cc.log("SHOWJACKPOTLOOP");
    if (this.jackpotType == 1) {
      this.winSkeletonJackpot.animation = "WinCommonMiniLoop";
    } else if (this.jackpotType == 2) {
      this.winSkeletonJackpot.animation = "WinCommonMinorLoop";
    } else if (this.jackpotType == 3) {
      this.winSkeletonJackpot.animation = "WinCommonMajorLoop";
    }
    // this.jackpotWinAmountLbl.getComponent(cc.Label).string =
    //   this.jackpotWinAmount.toString();
    this.jackpotWinAmountLbl.active = true;
    this.setCountDownProfitJackpot(this.jackpotWinAmount);
    // this.skipAnimJackpotWindow.active = false;
    // this.closeAnimJackpotWindow.active = true;
  }

  skipAnimJackpot() {
    cc.log("SKIPANIMJACKPOT");
    this.unschedule(this.changeAnimJackpotToLoop);
    this.skipAnimJackpotWindow.active = false;
    this.closeAnimJackpotWindow.active = true;
    this.unschedule(this.countDownProfitJackpot);
    this.jackpotWinAmountLbl.getComponent(cc.Label).string =
      WukongCommon.numberWithCommas(this.jackpotWinAmount).toString();

    this.jackpotWinAmountLbl.active = true;
    if (this.jackpotType == 1) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(
          SLOT_SOUND_TYPE.JACKPOT_WIN_MINI_END
        );
      }
      this.winSkeletonJackpot.animation = "WinCommonMiniLoop";
    } else if (this.jackpotType == 2) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(
          SLOT_SOUND_TYPE.JACKPOT_WIN_MINOR_END
        );
      }
      this.winSkeletonJackpot.animation = "WinCommonMinorLoop";
    } else if (this.jackpotType == 3) {
      if (WukongMusicManager.instance.getSystemVolume() > 0) {
        WukongMusicManager.instance.playType(
          SLOT_SOUND_TYPE.JACKPOT_WIN_MAJOR_END
        );
      }
      this.winSkeletonJackpot.animation = "WinCommonMajorLoop";
    }
    if (this.autoEnabled == true) {
      this.scheduleOnce(this.hideJackpot, 5);
    }
  }

  hideJackpot() {
    cc.log("HIDEJACKPOT");
    this.unschedule(this.hideJackpot);
    this.jackpotWinAmountLbl.active = false;
    if (this.jackpotType == 1) {
      this.winSkeletonJackpot.animation = "WinCommonMiniEnd";
    } else if (this.jackpotType == 2) {
      this.winSkeletonJackpot.animation = "WinCommonMinorEnd";
    } else if (this.jackpotType == 3) {
      this.winSkeletonJackpot.animation = "WinCommonMajorEnd";
    }
    this.scheduleOnce(() => {
      this.closeAnimJackpotWindow.active = false;
      this.winningWindowJackpot.active = false;
      if (this.autoEnabled == true) {
        this.scheduleOnce(() => {
          cc.log("FREESPINTEST JACKPOT END");
          this.reactivateSpinBtn();
        }, 0.6);
      }
    }, 0.5);
  }

  public setCountDownProfitJackpot(profit) {
    cc.log("setCountDownProfitJackpot");
    // cc.log("HHHH setCountdownProfitJackpot");
    this._localTimer = 0;
    this.jackpotWinAmountLbl.getComponent(cc.Label).string = "";
    this.jackpotWinAmountLbl.active = true;
    if (this._localTimer < profit) {
      this.jackpotWinAmountLbl.getComponent(cc.Label).string =
        this._localTimer.toString();
      this.schedule(this.countDownProfitJackpot, 0.001);
      // BGUI.UINumericLabelHelper.scheduleForLabel(
      //   this.jackpotWinAmountLbl.getComponent(cc.Label),
      //   this.jackpotWinAmount,
      //   3
      // );
    }
  }

  private countDownProfitJackpot(): void {
    cc.log("countDownProfitJackpot");
    if (this.jackpotType == 1) {
      this._localTimer += this.currentBetLV / 10;
    } else if (this.jackpotType == 2) {
      this._localTimer += (this.currentBetLV * 7) / 10;
    } else if (this.jackpotType == 3) {
      this._localTimer += (this.currentBetLV * 70) / 10;
    }

    // this.skipAnimJackpotWindow.active = false;
    this.jackpotWinAmountLbl.getComponent(cc.Label).string =
      WukongCommon.numberWithCommas(this._localTimer).toString();
    if (this._localTimer > this.jackpotWinAmount) {
      cc.error("thisresetCountdown", this._localTimer);

      this.resetCountDownjackpot();
    }
  }

  private resetCountDownjackpot(): void {
    cc.log("resetCountDownjackpot", this.autoEnabled);
    this.unschedule(this.countDownProfitJackpot);
    this._localTimer = this.jackpotWinAmount;
    this.jackpotWinAmountLbl.getComponent(cc.Label).string =
      WukongCommon.numberWithCommas(this.jackpotWinAmount).toString();
    this.unschedule(this.setCountDownProfitJackpot);
    this.closeAnimJackpotWindow.active = true;
    this.skipAnimJackpotWindow.active = false;
    this.scheduleOnce(() => {
      if (this.autoEnabled == true) {
        this.hideJackpot();
      }
    }, 5);
  }

  hideStats() {
    this.turboBtn.active = false;
    this.changeBetBtn.active = false;
    this.autoCtrlBtn.active = false;
    this.bottomBtnsFreeSpin.stopAllActions();
    this.bottomBtns.runAction(
      cc.sequence(
        // cc.moveBy(0.3, cc.v2(0, -200)),
        cc.callFunc(() => {
          this.bottomBtns.active = false;
        }),
        cc.callFunc(() => {
          this.bottomBtnsFreeSpin.active = true;
          this.bottomBtnsFreeSpinBetLv.string = this.betValue.string;
          this.bottomBtnsFreeSpinBalanceLbl.string = this.balanceValue.string;
          this.bottomBtnsFreeSpinNumber.string = this.freeSpinNumber.toString();
          // this.bottomBtnsFreeSpin.runAction(cc.moveTo(0.2, cc.v2(0, 0)));
          // this.bottomBtnsFreeSpin.setPosition(0,0)
        })
      )
    );
  }

  showStats() {
    this.turboBtn.active = true;
    this.changeBetBtn.active = true;
    this.autoCtrlBtn.active = true;
    this.bottomBtns.stopAllActions();
    this.bottomBtnsFreeSpin.runAction(
      cc.sequence(
        // cc.moveBy(0.3, cc.v2(0, -200)),
        cc.callFunc(() => {
          this.bottomBtnsFreeSpin.active = false;
        }),
        cc.callFunc(() => {
          this.bottomBtns.active = true;
          // this.bottomBtns.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
          // this.bottomBtns.setPosition(0,0)

          if (this.autoEnabled == true && this.autoSpinNmb > 0) {
            this.spinBtn[1].active = true;
          } else {
            this.spinBtn[0].active = true;
          }
        })
      )
    );
  }

  changeScreenOrientation() {
    let widthFrame = cc.view.getFrameSize().width;
    let heightFrame = cc.view.getFrameSize().height;

    if (widthFrame / heightFrame > 1680 / 1080) {
      this.mainGameNode.setPosition(0, 0);
      this.spinBtnsNode.setScale(1);
      this.turboCtrlNode.setScale(1);
      this.soundCtrlNode.setScale(1);
      this.changeBetBtn.setScale(1);
      this.autoCtrlBtn.setScale(1);
      this.infoBtnNode.setScale(1);

      // this.spinBtnsNode.setPosition(1767.329, 145.015)
      // this.turboCtrlNode.setPosition(1835.905, 428.575)
      // this.soundCtrlNode.setPosition(1835.905, 557.358)
      // this.changeBetBtn.setPosition(441.978, -466)
      // this.autoCtrlBtn.setPosition(565.193, -466)
      // this.infoBtnNode.setPosition(-858.143, -466)

      // this.spinBtnsNode.getComponent(cc.Widget).isAlignRight = true
      // this.spinBtnsNode.getComponent(cc.Widget).isAlignBottom = true
      // this.turboCtrlNode.getComponent(cc.Widget).isAlignRight = true
      // this.turboCtrlNode.getComponent(cc.Widget).isAlignBottom = true
      // this.soundCtrlNode.getComponent(cc.Widget).isAlignRight = true
      // this.soundCtrlNode.getComponent(cc.Widget).isAlignBottom = true
      // this.autoCtrlBtn.getComponent(cc.Widget).isAlignRight = true
      // this.autoCtrlBtn.getComponent(cc.Widget).isAlignBottom = true
      // this.changeBetBtn.getComponent(cc.Widget).isAlignRight = true
      // this.changeBetBtn.getComponent(cc.Widget).isAlignBottom = true
      // this.infoBtnNode.getComponent(cc.Widget).isAlignLeft = true
      // this.infoBtnNode.getComponent(cc.Widget).isAlignBottom = true

      // this.spinBtnsNode.getComponent(cc.Widget).right = 149.28
      // this.spinBtnsNode.getComponent(cc.Widget).bottom = 145.84
      // this.turboCtrlNode.getComponent(cc.Widget).right = 24.70
      // this.turboCtrlNode.getComponent(cc.Widget).bottom = 348.73
      // this.soundCtrlNode.getComponent(cc.Widget).right = 20.70
      // this.soundCtrlNode.getComponent(cc.Widget).bottom = 480
      // this.changeBetBtn.getComponent(cc.Widget).right = 469.02
      // this.changeBetBtn.getComponent(cc.Widget).bottom = 25.00
      // this.autoCtrlBtn.getComponent(cc.Widget).right = 344.81
      // this.autoCtrlBtn.getComponent(cc.Widget).bottom = 24.00
      // this.infoBtnNode.getComponent(cc.Widget).left = 45.86
      // this.infoBtnNode.getComponent(cc.Widget).bottom = 18
    } else if (widthFrame / heightFrame <= 1680 / 1080) {
      this.mainGameNode.setPosition(0, 600);
      this.spinBtnsNode.setScale(2);
      this.turboCtrlNode.setScale(1.5);
      this.soundCtrlNode.setScale(1.5);
      this.changeBetBtn.setScale(1.5);
      this.autoCtrlBtn.setScale(1.5);
      this.infoBtnNode.setScale(1.5);

      // this.spinBtnsNode.getComponent(cc.Widget).isAlignRight = false
      // this.spinBtnsNode.getComponent(cc.Widget).isAlignBottom = false
      // this.spinBtnsNode.getComponent(cc.Widget).isAbsoluteHorizontalCenter = true

      // this.turboCtrlNode.getComponent(cc.Widget).isAlignRight = true
      // this.turboCtrlNode.getComponent(cc.Widget).isAlignBottom = false

      // this.soundCtrlNode.getComponent(cc.Widget).isAlignRight = true
      // this.soundCtrlNode.getComponent(cc.Widget).isAlignBottom = false

      // this.autoCtrlBtn.getComponent(cc.Widget).isAlignRight = false
      // this.autoCtrlBtn.getComponent(cc.Widget).isAlignBottom = false
      // this.autoCtrlBtn.getComponent(cc.Widget).isAlignLeft = false

      // this.changeBetBtn.getComponent(cc.Widget).isAlignRight = true
      // this.changeBetBtn.getComponent(cc.Widget).isAlignBottom = false

      // this.infoBtnNode.getComponent(cc.Widget).isAlignLeft = true
      // this.infoBtnNode.getComponent(cc.Widget).isAlignBottom = false

      // this.turboCtrlNode.getComponent(cc.Widget).right = 612.88
      // this.soundCtrlNode.getComponent(cc.Widget).right = 178.68
      // this.changeBetBtn.getComponent(cc.Widget).right = 403.97
      // this.autoCtrlBtn.getComponent(cc.Widget).left = 592.33
      // this.infoBtnNode.getComponent(cc.Widget).left = 376.42

      // this.spinBtnsNode.setPosition(0, -2056.576)
      // this.turboCtrlNode.setPosition(263.12, -1589.216)
      // this.soundCtrlNode.setPosition(691.323, -2136.452)
      // this.changeBetBtn.setPosition(482.527, -2136.452)
      // this.autoCtrlBtn.setPosition(-292.671, -1598.315)
      // this.infoBtnNode.setPosition(-499.584, -2136.452)
    }
  }

  openInfo() {
    this.wukongInfoNode.active = true;
    this.wukongInfoNode.children[0].active = true;
  }

  openHistory() {
    this.wukongHistory.active = true;
  }

  testWin() {
    this.profitAmount = 231000000;
    this.toggleWinNode();
  }

  interuptSpin() {
    WukongSlotMachine.instance.stopSpin();
  }

  fakeRun() {
    this.winValue.string = "0";
    let data = {
      betAmount: 25000,
      items: [
        {
          id: 2,
          oldId: -1,
          highlight: true,
        },
        {
          id: 2,
          oldId: -1,
          highlight: true,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 8,
          oldId: -1,
          highlight: false,
        },
        {
          id: 8,
          oldId: -1,
          highlight: false,
        },
        {
          id: 2,
          oldId: -1,
          highlight: false,
        },
        {
          id: 2,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7, //2
          oldId: -1,
          highlight: true,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
      ],
      results: [],
      type: 1,
      amountProfit: 900000,
      currentMoney: 450066816,
    };

    this.machineSlot.getComponent(WukongSlotMachine).letgoFake();
    this.scheduleOnce(() => {
      this.machineSlot.getComponent(WukongSlotMachine).letGo(data);
    }, 4);
  }
  fakeRun2() {
    this.winValue.string = "0";
    let data = {
      betAmount: 25000,
      items: [
        {
          id: 2,
          oldId: -1,
          highlight: true,
        },
        {
          id: 5,
          oldId: -1,
          highlight: true,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 8,
          oldId: -1,
          highlight: false,
        },
        {
          id: 8,
          oldId: -1,
          highlight: false,
        },
        {
          id: 3,
          oldId: -1,
          highlight: false,
        },
        {
          id: 3,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7, //2
          oldId: -1,
          highlight: true,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
      ],
      results: [],
      type: 1,
      amountProfit: 900000,
      currentMoney: 450066816,
    };

    this.machineSlot.getComponent(WukongSlotMachine).letgoFake();
    this.scheduleOnce(() => {
      this.machineSlot.getComponent(WukongSlotMachine).letGo(data);
    }, 4);
  }
  fakeRunFreeSpin() {
    this.hideStats();

    this.winValue.string = "0";
    let data = {
      betAmount: 25000,
      items: [
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 80,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 80,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 80,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
      ],
      type: 1,
      isUnlockAll: false,
      amountProfit: 13500,
      currentMoney: 450066816,
      currentRound: 1,
      totalRound: 12,
      results: [],
    };
    // cc.log("FREESPINNUMBER: ", this.autoSpinNmb);
    this.machineSlot.getComponent(WukongSlotMachine).letGoFreeSpin(data);
  }
  fakeRunFreeSpin2() {
    this.winValue.string = "0";
    let data = {
      betAmount: 25000,
      items: [
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
      ],
      type: 1,
      isUnlockAll: true,
      amountProfit: 13500,
      currentMoney: 450066816,
      currentRound: 2,
      totalRound: 12,
      results: [],
    };
    // cc.log("FREESPINNUMBER: ", this.autoSpinNmb);
    this.machineSlot.getComponent(WukongSlotMachine).letGoFreeSpin(data);
  }
  fakeRunFreeSpin3() {
    this.winValue.string = "0";
    let data = {
      betAmount: 25000,
      items: [
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
      ],
      type: 2,
      isUnlockAll: true,
      totalPot: 30000000,
      amountProfit: 30000000,
      currentMoney: 450066816,
      currentRound: 2,
      totalRound: 12,
      results: [
        { id: 1, moneyWin: 10000 },
        { id: 2, moneyWin: 10000 },
        { id: 3, moneyWin: 10000 },
      ],
    };
    // cc.log("FREESPINNUMBER: ", this.autoSpinNmb);
    this.machineSlot.getComponent(WukongSlotMachine).letGoFreeSpin(data);
  }
  fakeRunFreeSpin4() {
    this.endFreeSpin = true;
    this.winValue.string = "0";
    let data = {
      betAmount: 25000,
      items: [
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 4,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 5,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 91,
          oldId: -1,
          highlight: false,
        },
        {
          id: 7,
          oldId: -1,
          highlight: false,
        },
        {
          id: 6,
          oldId: -1,
          highlight: false,
        },
      ],
      type: 2,
      isUnlockAll: true,
      totalPot: 90000000,
      amountProfit: 3000,
      currentMoney: 450066816,
      currentRound: 12,
      totalRound: 12,
      results: [
        { id: 1, moneyWin: 10000 },
        { id: 2, moneyWin: 10000 },
        { id: 3, moneyWin: 10000 },
      ],
    };
    // cc.log("FREESPINNUMBER: ", this.autoSpinNmb);
    this.machineSlot.getComponent(WukongSlotMachine).letGoFreeSpin(data);
  }
}
