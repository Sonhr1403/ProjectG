import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { SlotKKConnector } from "./Connector/SlotKK.Connector";
import SlotKKAutoSpin from "./SlotKK.AutoSpin";
import SlotKKBetChoose from "./SlotKK.BetChoose";
import SlotKKBetLvl from "./SlotKK.BetLvl";
import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKCommon from "./SlotKK.Common";
import SlotKKFreeGame from "./SlotKK.FreeGame";
import SlotKKFreeGameLbl from "./SlotKK.FreeGameLbl";
import SlotKKInfo from "./SlotKK.Info";
import SlotKKMusicManager, {
  SLOT_MUSIC_TYPE,
  SLOT_SOUND_TYPE,
} from "./SlotKK.Music";
import SlotKKMachine from "./SlotKK.SlotMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKController extends cc.Component {
  public static instance: SlotKKController = null;

  @property(cc.Node)
  public spinBtn: cc.Node = null;

  @property(cc.Node)
  public spinBtnRing: cc.Node = null;

  @property(cc.Node)
  public pnGame: cc.Node = null;

  @property(cc.Node)
  public pnForBet: cc.Node = null;

  @property(cc.Node)
  public turboBtn: cc.Node[] = [];

  @property(cc.Node)
  public autoSpinBtn: cc.Node[] = [];

  @property(cc.Node)
  public bgTemp: cc.Node = null;

  @property(cc.Node)
  public freeGameLbl: cc.Node = null;

  @property(cc.Node)
  public bigWinCoin: cc.Node = null;

  @property(cc.Node)
  public bigWin: cc.Node = null;

  @property(cc.Node)
  public totalWin: cc.Node = null;

  @property(cc.Node)
  public noti: cc.Node = null;

  @property(cc.Node)
  public slot: cc.Node = null;

  @property(cc.Node)
  public info: cc.Node = null;

  @property(cc.Node)
  public pnForCoin: cc.Node = null;

  @property(cc.Button)
  public btnIncBet: cc.Button = null;

  @property(cc.Button)
  public btnDecBet: cc.Button = null;

  @property(cc.Button)
  public btnInfo: cc.Button = null;

  @property(cc.Button)
  public btnBetLvl: cc.Button = null;

  @property(cc.Button)
  public btnBetChoose: cc.Button = null;

  @property(cc.Label)
  public totalBetNum: cc.Label = null;

  @property(cc.Label)
  public betNum: cc.Label = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Label)
  public bigLbl: cc.Label = null;

  @property(cc.Label)
  public autoSpinLbl: cc.Label = null;

  @property(cc.Label)
  public notiContent: cc.Label = null;

  @property(cc.Slider)
  private betSlider: cc.Slider = null;

  @property(cc.Sprite)
  private progressBar: cc.Sprite = null;

  @property(cc.Prefab)
  public prfInfo: cc.Prefab = null;

  @property(cc.Prefab)
  public prfBetLvl: cc.Prefab = null;

  @property(cc.Prefab)
  public prfBetChoose: cc.Prefab = null;

  @property(cc.Prefab)
  public prfAutoSpin: cc.Prefab = null;

  @property(cc.Prefab)
  public prfFreeSpin: cc.Prefab = null;

  @property(cc.Prefab)
  public prfFreeSpinLbl: cc.Prefab = null;

  @property(cc.Prefab)
  public coin: cc.Prefab = null;

  //////////////////////////////////
  public _scheduler = null;
  public _isGameActive: boolean = true;
  private hideTime: number = null;
  //////////////////////////////////

  private localRes = null;

  private localHaveFreeGameSpin: boolean = false;

  public isMobile: boolean = false;

  public isTurbo: boolean = false;

  // private pnBetLvl: cc.Node = null;
  // private isBetLvlOn: boolean = false;

  // private pnBetChoose: cc.Node = null;
  // public isBetChooseOn: boolean = false;

  private pnAutoSpin: cc.Node = null;
  public isAutoSpinOn: boolean = false;
  public isAutoSpinning: boolean = false;
  public isAutoSpinForever: boolean = false;

  public onWin: boolean = false;
  public onFreeSpinWin: boolean = false;
  public onSingleWinExceeds: boolean = false;
  public exceedsNumber: number = 0;
  public onBalanceIncrease: boolean = false;
  public increaseNumber: number = 0;
  public onBalanceDecrease: boolean = false;
  public decreaseNumber: number = 0;
  public startBalanceCheck: number = 0;

  private pnFreeGame: cc.Node = null;
  public pnFreeGameLbl: cc.Node = null;
  public getFreeGame: boolean = false;
  public onFreeGame: boolean = false;
  private lastFreeGame: boolean = false;

  private profit: number = 0;
  private profitStep: number = 0;
  private totalProfit: number = 0;
  private currentMoney: number = 0;
  private tempBigLbl: number = 0;

  public winType: number = 0;

  public betAmount: number = 2;

  public listBet: Array<number> = [10000, 20000, 30000, 50000, 100000];

  private listPopUp: Array<string> = ["BL", "BC"];

  public isForceStop: boolean = false;

  public scatterCount: number = 0;

  public isCoin: boolean = false;
  public coinPos: Array<cc.Vec2> = [];

  public lang: string = "";

  onLoad() {
    cc.debug.setDisplayStats(false);
    SlotKKController.instance = this;

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
    } else {
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en");
      LanguageMgr.updateLang("en");
    }

    SlotKKConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    SlotKKConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_JOIN_ROOM,
      this.responseJoinRoom,
      this
    );
    // SlotKKConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_EXITGAME, this.responseDisconnect, this);
    // SlotKKConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_DISCONNECTED, this.responseDisconnect, this);
    //     SlotKKConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_KICK_OUT, this.responseUserOut, this);
    SlotKKConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveSubcribeGame,
      this
    );
    SlotKKConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    SlotKKConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    SlotKKConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseReceiveFreeGameResult,
      this
    );
    SlotKKConnector.instance.connect();
  }

  private spinSwitch(isOn: boolean) {
    if (isOn) {
      if (this.isMobile) {
        this.spinBtn.on(
          cc.Node.EventType.TOUCH_START,
          this.onTouchStartSpin,
          this
        );
        this.spinBtn.on(cc.Node.EventType.TOUCH_END, this.onTouchEndSpin, this);
        this.spinBtn.on(
          cc.Node.EventType.TOUCH_CANCEL,
          this.onTouchCancelSpin,
          this
        );
      } else {
        this.spinBtn.on(
          cc.Node.EventType.MOUSE_ENTER,
          this.onMouseEnterSpin,
          this
        );
        this.spinBtn.on(
          cc.Node.EventType.MOUSE_LEAVE,
          this.onMouseLeaveSpin,
          this
        );
        this.spinBtn.on(
          cc.Node.EventType.MOUSE_DOWN,
          this.onTouchStartSpin,
          this
        );
        this.spinBtn.on(cc.Node.EventType.MOUSE_UP, this.onTouchEndSpin, this);
      }
    } else {
      if (this.isMobile) {
        this.spinBtn.off(
          cc.Node.EventType.TOUCH_START,
          this.onTouchStartSpin,
          this
        );
        this.spinBtn.off(
          cc.Node.EventType.TOUCH_END,
          this.onTouchEndSpin,
          this
        );
        this.spinBtn.off(
          cc.Node.EventType.TOUCH_CANCEL,
          this.onTouchCancelSpin,
          this
        );
      } else {
        this.spinBtn.off(
          cc.Node.EventType.MOUSE_ENTER,
          this.onMouseEnterSpin,
          this
        );
        this.spinBtn.off(
          cc.Node.EventType.MOUSE_LEAVE,
          this.onMouseLeaveSpin,
          this
        );
        this.spinBtn.off(
          cc.Node.EventType.MOUSE_DOWN,
          this.onTouchStartSpin,
          this
        );
        this.spinBtn.off(cc.Node.EventType.MOUSE_UP, this.onTouchEndSpin, this);
      }
    }
  }

  private rotateSpinBtn() {
    cc.tween(this.spinBtn).by(1.2, { angle: -360 }).start();
  }

  private initMusic() {
    localStorage.setItem("musicStatus", "true");
    SlotKKMusicManager.instance.setMusicStatus(true);
    SlotKKMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.MAIN_MUSIC);
  }

  private initInfo() {
    // this.pnInfo = cc.instantiate(this.prfInfo);
    // this.pnInfo.setPosition(cc.v2(0, 0));
    // this.pnInfo.zIndex = 999;
    // this.pnInfo.scale = 0;
    // // this.pnInfo.getComponent(cc.Widget).target = this.pnGame;
    // this.pnGame.addChild(this.pnInfo);
    this.info.scale = 0;
    // this.info.setPosition(-1040, -500);
  }

  private initBetLvl() {
    // this.pnBetLvl = cc.instantiate(this.prfBetLvl);
    // this.pnBetLvl.setPosition(
    //   cc.v2(
    //     -575,
    //     this.pnGame.getChildByName("FootBar").y +
    //       this.pnGame.getChildByName("FootBar").height +
    //       this.pnBetLvl.height / 2
    //   )
    // );
    // this.pnBetLvl.zIndex = 999;
    // this.pnBetLvl.active = true;
    // this.pnForBet.addChild(this.pnBetLvl);
  }

  private initBetChoose() {
    // this.pnBetChoose = cc.instantiate(this.prfBetChoose);
    // this.pnBetChoose.setPosition(
    //   cc.v2(
    //     -510,
    //     this.pnGame.getChildByName("FootBar").y +
    //       this.pnGame.getChildByName("FootBar").height +
    //       this.pnBetChoose.height / 2
    //   )
    // );
    // this.pnBetChoose.zIndex = 999;
    // this.pnBetChoose.active = true;
    // this.pnForBet.addChild(this.pnBetChoose);
    // this.onClickBetChoose();
  }

  private initAutoSpin() {
    this.pnAutoSpin = cc.instantiate(this.prfAutoSpin);
    this.pnAutoSpin.zIndex = 999;
    this.pnAutoSpin.active = false;
    this.pnGame.addChild(this.pnAutoSpin);
  }

  private initFreeGame() {
    this.pnFreeGame = cc.instantiate(this.prfFreeSpin);
    this.pnFreeGame.setPosition(0, 3000);
    this.pnFreeGame.zIndex = 999;
    this.pnFreeGame.active = true;
    this.pnForBet.addChild(this.pnFreeGame);
  }

  private initFreeGameLbl() {
    this.pnFreeGameLbl = cc.instantiate(this.prfFreeSpinLbl);
    this.pnFreeGameLbl.setPosition(0, 3000);
    this.pnFreeGameLbl.zIndex = 999;
    this.pnFreeGameLbl.active = true;
    this.freeGameLbl.addChild(this.pnFreeGameLbl);
  }

  private initSlot() {
    cc.tween(this.slot)
      .to(0.3, { position: cc.v3(0, 0, 0) })
      .start();
  }

  //////////////////////////////////////////////////////////////////////////Button Start
  private decreaseMoney() {
    this.currentMoney -= SlotKKCommon.numberWithOutDot(this.totalBetNum.string);
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(
      this.currentMoney
    );
  }
  //   private holdDuration: number = 0;
  // private isButtonPressed: boolean = false;
  private onTouchStartSpin(event: cc.Event.EventTouch) {
    // this.isButtonPressed = true;
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.SPIN_BTN);

    if (!this.isTurbo) {
      this.setBigLbl(true, 2);
    }
    this.reallySpin();
    this.closeOtherPopup("");
  }

  private onTouchEndSpin(event: cc.Event.EventTouch) {
    // this.isButtonPressed = false;
  }

  private onTouchCancelSpin(event: cc.Event.EventTouch) {
    // this.isButtonPressed = false;
  }

  private onMouseEnterSpin() {
    this.schedule(this.spinBtnSpinRing, 0.6, cc.macro.REPEAT_FOREVER);
  }

  private spinBtnSpinRing() {
    this.spinBtnRing.active = true;
    cc.tween(this.spinBtnRing)
      .to(0.5, { scale: 1.5, opacity: 0 }, { easing: "smooth" })
      .call(() => {
        this.spinBtnRing.scale = 0.8;
        this.spinBtnRing.opacity = 255;
      })
      .start();
  }

  private onMouseLeaveSpin() {
    this.unschedule(this.spinBtnSpinRing);
    this.spinBtnRing.stopAllActions();
    this.spinBtnRing.scale = 0.75;
    this.spinBtnRing.opacity = 255;
    this.spinBtnRing.active = false;
  }

  public reallySpin() {
    this.isForceStop = false;
    SlotKKMachine.instance.startSpinVirtual();
    if (this.currentMoney < this.listBet[this.betAmount]) {
      if (!this.noti.active) {
        this.noti.active = true;
      }
      this.notiContent.string = LanguageMgr.getString(
        "slotkingkong.not_enough_money"
      );
    } else {
      this.decreaseMoney();
      this.sendBet();
    }
  }

  private onClickTurbo() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.isTurbo = !this.isTurbo;
    if (this.isTurbo) {
      this.turboBtn[0].active = false;
      this.turboBtn[1].active = true;
    } else {
      this.turboBtn[0].active = true;
      this.turboBtn[1].active = false;
    }
  }

  private onClickInfo() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.info.getComponent(SlotKKInfo).onOpen();
    this.closeOtherPopup("");
  }

  private onClickIncBet() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.betAmount += 1;
    this.updateAllBet();
  }

  private onClickDecBet() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.betAmount -= 1;
    this.updateAllBet();
  }

  public updateAllBet() {
    this.updateBet(true);
    this.getProgress();
    this.setBigLbl(true, 3);
  }

  private updateBet(isSend: boolean) {
    switch (this.betAmount) {
      case 0:
        this.btnDecBet.interactable = false;
        this.btnIncBet.interactable = true;
        break;

      case 4:
        this.btnIncBet.interactable = false;
        this.btnDecBet.interactable = true;
        break;

      default:
        this.btnDecBet.interactable = true;
        this.btnIncBet.interactable = true;
        break;
    }

    this.betNum.string = BGUI.Utils.formatMoneyWithCommaOnly(
      this.listBet[this.betAmount]
    );
    this.totalBetNum.string = BGUI.Utils.formatMoneyWithCommaOnly(
      this.listBet[this.betAmount]
    );

    // if (this.isBetLvlOn) {
    //   this.pnBetLvl.getComponent(SlotKKBetLvl).checkBet();
    // }

    // if (this.isBetChooseOn) {
    //   this.pnBetChoose.getComponent(SlotKKBetChoose).checkCurrentItem();
    // }

    if (isSend) {
      SlotCmd.Send.sendSlotJoinGame(this.listBet[this.betAmount]);
    }
  }

  private onSliderEvent(sender, eventType) {
    let progress = sender.progress.toFixed(3);
    let pro = -1;
    let amo = -1;
    if (progress <= 0.111) {
      pro = 0.111;
      amo = 0;
    } else if (progress <= 0.222) {
      pro = 0.222;
      amo = 1;
    } else if (progress <= 0.333) {
      pro = 0.333;
      amo = 2;
    } else if (progress <= 0.444) {
      pro = 0.444;
      amo = 3;
    } else if (progress <= 0.555) {
      pro = 0.555;
      amo = 4;
    } else if (progress <= 0.666) {
      pro = 0.666;
      amo = 5;
    } else if (progress <= 0.777) {
      pro = 0.777;
      amo = 6;
    } else if (progress <= 0.888) {
      pro = 0.888;
      amo = 7;
    } else if (progress <= 1) {
      pro = 1;
      amo = 8;
    }
    this.updateSlider(pro);
    this.betAmount = amo;
    this.updateBet(true);
  }

  private getProgress() {
    let ratio = 1 / this.listBet.length;
    let pro = (this.betAmount + 1) * ratio;
    this.updateSlider(pro);
  }

  private updateSlider(progress: number) {
    this.betSlider.progress = progress;
    this.progressBar.fillRange = progress;
  }

  private onClickBetLvl() {
    // SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    // this.isBetLvlOn = !this.isBetLvlOn;
    // if (this.isBetLvlOn) {
    //   this.pnBetLvl.getComponent(SlotKKBetLvl).onOpen();
    //   this.bgTemp.on(cc.Node.EventType.TOUCH_END, this.onClickBetLvl, this);
    // } else {
    //   this.pnBetLvl.getComponent(SlotKKBetLvl).onClose();
    //   this.bgTemp.off(cc.Node.EventType.TOUCH_END, this.onClickBetLvl, this);
    // }
    // this.closeOtherPopup("BL");
  }

  public onClickBetChoose() {
    // SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    // this.isBetChooseOn = !this.isBetChooseOn;
    // if (this.isBetChooseOn) {
    //   this.btnBetChoose.node.rotation = 180;
    //   this.pnBetChoose.getComponent(SlotKKBetChoose).onOpen();
    //   this.bgTemp.on(cc.Node.EventType.TOUCH_END, this.onClickBetChoose, this);
    // } else {
    //   this.btnBetChoose.node.rotation = 0;
    //   this.pnBetChoose.getComponent(SlotKKBetChoose).onClose();
    //   this.bgTemp.off(cc.Node.EventType.TOUCH_END, this.onClickBetChoose, this);
    // }
    // this.closeOtherPopup("BC");
  }

  public onClickAutoSpin() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.isAutoSpinOn = !this.isAutoSpinOn;
    if (this.isAutoSpinOn) {
      this.pnAutoSpin.active = true;
    } else {
      this.pnAutoSpin.getComponent(SlotKKAutoSpin).onCancel();
    }
    this.closeOtherPopup("");
  }

  public onClickStopAutoSpin() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.autoSpinBtn[0].active = true;
    this.autoSpinBtn[1].active = false;
    this.isAutoSpinForever = false;
    this.isAutoSpinning = false;
    this.onWin = false;
    this.onFreeSpinWin = false;
    this.onSingleWinExceeds = false;
    this.onBalanceIncrease = false;
    this.onBalanceDecrease = false;
    this.exceedsNumber = 0;
    this.decreaseNumber = 0;
    this.increaseNumber = 0;
    this.autoSpinLbl.string = "-1";
    this.autoSpinLbl.node.active = false;
  }

  private closeOtherPopup(name: string) {
    // for (let item of this.listPopUp) {
    //   if (name !== item) {
    //     switch (item) {
    //       case "BL":
    //         if (this.isBetLvlOn) {
    //           this.isBetLvlOn = false;
    //           this.pnBetLvl.getComponent(SlotKKBetLvl).onClose();
    //           this.bgTemp.off(
    //             cc.Node.EventType.TOUCH_END,
    //             this.onClickBetLvl,
    //             this
    //           );
    //         }
    //         break;
    //       case "BC":
    //         if (this.isBetChooseOn) {
    //           this.btnBetChoose.node.rotation = 0;
    //           this.isBetChooseOn = false;
    //           this.pnBetChoose.getComponent(SlotKKBetChoose).onClose();
    //           this.bgTemp.off(
    //             cc.Node.EventType.TOUCH_END,
    //             this.onClickBetChoose,
    //             this
    //           );
    //         }
    //         break;
    //     }
    //   }
    // }
  }

  public disableBtn(enabled: boolean) {
    if (this.isMobile && enabled) {
      this.onMouseEnterSpin();
    } else {
      this.onMouseLeaveSpin();
    }
    this.spinSwitch(enabled);
    this.btnInfo.interactable = enabled;
    this.btnBetLvl.interactable = enabled;
    this.btnBetChoose.interactable = enabled;
    if (enabled) {
      switch (this.betAmount) {
        case 0:
          this.btnDecBet.interactable = false;
          this.btnIncBet.interactable = true;
          break;

        case 4:
          this.btnIncBet.interactable = false;
          this.btnDecBet.interactable = true;
          break;

        default:
          this.btnDecBet.interactable = true;
          this.btnIncBet.interactable = true;
          break;
      }
    } else {
      this.btnDecBet.interactable = enabled;
      this.btnIncBet.interactable = enabled;
    }
    this.autoSpinBtn[0].getComponent(cc.Button).interactable = enabled;
    // this.autoSpinBtn[1].getComponent(cc.Button).interactable = enabled;
  }

  /////////////////////////////////////////////////////////////////////////////Button End

  onDestroy() {
    // SlotKKConnector.instance.disconnect();
    SlotKKConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_LOGIN
    );
    //     SlotKKConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_EXITGAME);
    //     SlotKKConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_DISCONNECTED);
    //     SlotKKConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_KICK_OUT);
    SlotKKConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO
    );
    SlotKKConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    SlotKKConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED
    );
    SlotKKConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );

    this.spinSwitch(false);

    cc.director.getScheduler().unscheduleUpdate(this);
  }

  protected start(): void {
    const url = window.location.href;
    let urlSearchParams = new URLSearchParams(url.split("?")[1]);
    if (
      url &&
      url.includes("?") &&
      urlSearchParams &&
      urlSearchParams.get("lang")
    ) {
      this.lang = urlSearchParams.get("lang");
    }
    this.isMobile = cc.sys.isMobile;
    this.schedule(this.rotateSpinBtn, 1.2, cc.macro.REPEAT_FOREVER);
    this.initMusic();
    this.initInfo();
    // this.initBetLvl();
    this.initAutoSpin();
    this.initFreeGame();
    this.initFreeGameLbl();
    this.updateAllBet();
    this.spinSwitch(true);

    this.initData();
    this.initSlot();

    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
    //     this.resetJoinGame();
    //     this.hideSomeNode();
    //     // this.scheduleOnce(() => {
    //     //   this.handleReceiveFreeGameResult(null);
    //     // }, 3);
    // this.initBetChoose();
  }

  //   private resetJoinGame() {
  //     this.activeNAutoSpin(false);
  //     this.activeBtnSpin(true);
  //   }

  protected onEnable(): void {
    // SlotKKConnector.instance.connect();
  }

  protected onDisable(): void {
    // SlotKKConnector.instance.disconnect();
  }
  //   // cycle end

  //   //Response Start
  //   private responseDisconnect(cmdId: any, data: Uint8Array) {
  //     console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT DISCONNECT: ", cmdId);
  //   }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotKKReceiveLogin();
    res.unpackData(data);
    SlotKKCommon.runError(
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "SLOTKK LOGIN: ",
      cmdId,
      res
    );
    ////////////////////////////////////////////
    let err = res.getError();
    switch (err) {
      case 0:
        if (
          !this.getFreeGame &&
          !this.onFreeGame &&
          !this.lastFreeGame &&
          !this.autoSpinLbl.node.active
        ) {
          SlotCmd.Send.sendSlotJoinGame(this.listBet[this.betAmount]);
        }
        break;

      default:
        if (!this.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.connection_error3"
        );
        break;
    }
  }

  private responseJoinRoom(cmdId: any, data: Uint8Array) {
    // console.error(
    //   "SLOTKK",
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
    SlotKKCommon.runError(
      "SLOTKK",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "5002",
      cmdId,
      res
    );
    /////////////////////////

    if (res.getError() !== 0) {
      if (!SlotKKController.instance.noti.active) {
        this.noti.active = true;
      }
      this.notiContent.string = LanguageMgr.getString(
        "slotkingkong.connection_error3"
      );
    } else {
      this.currentMoney = res.currentMoney;
      this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(
        res.currentMoney
      );

      for (let i = 0; i < this.listBet.length; i++) {
        if (this.listBet[i] === res.betAmount) {
          this.betAmount = i;
          this.updateBet(false);
          // this.pnBetChoose.getComponent(SlotKKBetChoose).checkCurrentItem();
        }
      }
      /// Free game
      if (res.freeGameResult != null) {
        this.closeOtherPopup("");
        if (res.freeGameResult.option == 0) {
          this.openFreeGameOption();
        } else {
          this.openFreeGameLbl();
          SlotKKFreeGameLbl.instance.updateFWNum(res.freeGameResult.totalPot);
          SlotKKFreeGameLbl.instance.tempFWNum = res.freeGameResult.totalPot;
          SlotKKFreeGameLbl.instance.updateFSNum(
            res.freeGameResult.totalRound - res.freeGameResult.currentRound
          );
          SlotKKFreeGameLbl.instance.updateMultiNum(
            res.freeGameResult.multiple
          );
          this.sendFreeGame();
        }
      }
    }
  }

  public sendFreeGame() {
    this.disableBtn(false);
    SlotKKMachine.instance.startSpinVirtual();
    SlotCmd.Send.sendStartFreeGame();
  }

  //   protected responseUserOut(cmdId: any, data: Uint8Array) {
  //     let res = new SlotCmd.SlotReceiveUserOut();
  //     res.unpackData(data);
  //     ////////////////////////////////////////////
  //     console.error("SLOT_50", new Date().toLocaleString(), new Date().getMilliseconds(), "SLOT_RECEIVE_USER_OUT", cmdId, res);
  //     this.backToLobby();
  //   }

  //   // 5004
  public localData: Array<SlotCmd.Data> = [];
  public localRes5004 = null;
  public initData() {
    let arr: Array<number> = [];
    for (let i = 0; i < 48; i++) {
      arr.push(SlotKKCommon.getRandomNumber(2, 12));
    }
    let data = {
      indexSize: 48,
      indexList: arr,
      moneyWin: 0,
      hlSize: 0,
      hlArray: [],
      hlGoldSize: 0,
      hlGoldArray: [],
    };
    this.localData.push(data);

    SlotKKMachine.instance.createMachine(this.localData[0]);
  }

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    SlotKKCommon.runError(
      "SLOTKK",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "responseReceiveRoundResult",
      cmdId,
      res
    );
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      if (!SlotKKController.instance.noti.active) {
        this.noti.active = true;
      }
      this.notiContent.string = LanguageMgr.getString(
        "slotkingkong.spin_error"
      );
      return;
    }

    this.localRes = res;
    this.localData = res.list;
    SlotKKMachine.instance.letGo(res.list, res.amountProfit, res.currentMoney);
    this.getWinType(res.betAmount, res.amountProfit);

    switch (res.type) {
      case 3:
        this.getFreeGame = true;
        break;

      default:
        break;
    }
  }

  public openFreeGameOption() {
    this.pnFreeGame.getComponent(SlotKKFreeGame).onOpen();
    SlotKKMusicManager.instance.stopAll();
  }

  public openFreeGameLbl() {
    cc.tween(this.pnFreeGameLbl)
      .to(1, { position: cc.v3(0, 0, 0) }, { easing: "bounceOut" })
      .start();
  }

  public closeFreeGameLbl() {
    cc.tween(this.pnFreeGameLbl)
      .to(1, { position: cc.v3(0, 3000, 0) }, { easing: "bounceOut" })
      .start();
  }

  //5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    SlotKKCommon.runError(
      "SLOTKK",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "responseReceiveBetFailed",
      cmdId,
      res
    );
    ////////////////////////////////////////////
    const error = res.getError();
    if (!SlotKKController.instance.noti.active) {
      this.noti.active = true;
    }
    switch (error) {
      case 1:
        BGUI.ZLog.log("Không trừ được tiền");
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;

      case 2:
        BGUI.ZLog.log("Đang có free game");
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;
    }
  }

  // 5008
  protected responseReceiveFreeGameResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveFreeGameResult();
    res.unpackData(data);
    SlotKKCommon.runError(
      "SLOTKK",
      new Date().toLocaleString(),
      new Date().getMilliseconds(),
      "responseReceiveFreeGameResult",
      cmdId,
      res
    );
    ////////////////////////////////////////////
    let err = res.getError();
    switch (err) {
      case 1:
        // BGUI.ZLog.log("Không có free game");
        if (!SlotKKController.instance.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;

      case 2:
        // BGUI.ZLog.log("Chưa chọn option cho free game");
        if (!SlotKKController.instance.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;

      case 3:
        // BGUI.ZLog.log("Lượt quay hiện tại đang >= tổng số lượt quay");
        if (!SlotKKController.instance.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;

      case 4:
        // BGUI.ZLog.log("Không có option đã chọn");
        if (!SlotKKController.instance.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;

      case 5:
        // BGUI.ZLog.log("Chọn option đã trong freegame");
        if (!SlotKKController.instance.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotkingkong.spin_error"
        );
        break;

      default:
        this.localHaveFreeGameSpin = true;
        this.handleReceiveFreeGameResult(res);
        break;
    }
  }

  public handleReceiveFreeGameResult(res: SlotCmd.SlotReceiveFreeGameResult) {
    this.localRes = res;
    this.localData = res.list;
    if (res.error == 0) {
      this.pnFreeGameLbl
        .getComponent(SlotKKFreeGameLbl)
        .updateFSNum(res.totalRound - res.currentRound);
      this.pnFreeGameLbl
        .getComponent(SlotKKFreeGameLbl)
        .updateMultiNum(res.multiple);
      if (res.currentRound == 0) {
        this.pnFreeGameLbl.getComponent(SlotKKFreeGameLbl).tempFWNum = 0;
        this.pnFreeGameLbl.getComponent(SlotKKFreeGameLbl).featureWinNum.string = "0";
        this.pnFreeGameLbl.getComponent(SlotKKFreeGameLbl).updateFWNum(0);
        if (this.pnFreeGame.getComponent(SlotKKFreeGame).idPick === "0") {
          this.pnFreeGame.getComponent(SlotKKFreeGame).changeRandom(res.option);
          this.scheduleOnce(() => {
            this.pnFreeGame.getComponent(SlotKKFreeGame).onClose();
            this.scheduleOnce(() => {
              this.sendFreeGame();
            }, 0.25);
          }, 1);
        } else {
          this.scheduleOnce(() => {
            this.sendFreeGame();
          }, 0.5);
        }
      } else {
        this.getWinType(res.betAmount, res.amountProfit);
        if (res.currentRound < res.totalRound) {
          this.onFreeGame = true;
          SlotKKMachine.instance.letGo(
            res.list,
            res.amountProfit,
            res.currentMoney
          );
        } else if (res.currentRound === res.totalRound) {
          this.lastFreeGame = true;
          SlotKKMachine.instance.letGo(
            res.list,
            res.amountProfit,
            res.currentMoney
          );
        }
      }
    }
  }

  //   private backToLobby() {
  //     SlotKKConnector.instance.disconnect();
  //     BGUI.GameCoreManager.instance.onBackToLobby();
  //   }

  public setBigLbl(isLbl: boolean, num: number) {
    if (isLbl) {
      let msg = "";
      switch (num) {
        case 1:
          msg = LanguageMgr.getString("slotkingkong.good_day");
          break;

        case 2:
          msg = LanguageMgr.getString("slotkingkong.good_luck");
          break;

        case 3:
          msg = LanguageMgr.getString("slotkingkong.spin_to_start");
          break;
      }
      this.bigLbl.string = msg;
    } else {
      this.scheduleForLbl(num, 1, 1);
    }
  }

  public scheduleForLbl(winMoney: number, time: number, key: number) {
    this.profit = 0;
    this.totalProfit = winMoney;
    this.profitStep = winMoney / (time * 100);
    switch (key) {
      case 1:
        this.schedule(this.increaseBigLbl, 0.001);
        break;

      case 2:
        this.schedule(this.increaseTotalWinLbl, 0.001);
        break;

      case 3:
        this.schedule(this.increaseBigWinLbl, 0.001);
        break;
    }
  }

  private increaseBigLbl() {
    this.profit += this.profitStep;
    if (this.profit >= this.totalProfit) {
      this.unschedule(this.increaseBigLbl);
      this.bigLbl.string = BGUI.Utils.formatMoneyWithCommaOnly(
        this.tempBigLbl + this.totalProfit
      );
      if (this.onFreeGame || this.lastFreeGame) {
        this.pnFreeGameLbl.getComponent(
          SlotKKFreeGameLbl
        ).featureWinNum.string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.pnFreeGameLbl.getComponent(SlotKKFreeGameLbl).tempFWNum +
            this.totalProfit
        );
        this.pnFreeGameLbl.getComponent(SlotKKFreeGameLbl).tempFWNum +=
          this.totalProfit;
      } else {
        this.tempBigLbl += this.totalProfit;
        this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.currentMoney + this.totalProfit
        );
      }
      this.currentMoney += this.totalProfit;
    } else {
      this.bigLbl.string = BGUI.Utils.formatMoneyWithCommaOnly(
        this.tempBigLbl + this.profit
      );
      if (this.onFreeGame || this.lastFreeGame) {
        this.pnFreeGameLbl.getComponent(
          SlotKKFreeGameLbl
        ).featureWinNum.string = BGUI.Utils.formatMoneyWithCommaOnly(
          SlotKKCommon.numberWithOutDot(
            this.pnFreeGameLbl.getComponent(SlotKKFreeGameLbl).featureWinNum
              .string
          ) + this.profitStep
        );
      } else {
        this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(
          this.currentMoney + this.profit
        );
      }
    }
  }

  private increaseTotalWinLbl() {
    this.profit += this.profitStep;
    if (this.profit >= this.totalProfit) {
      this.unschedule(this.increaseTotalWinLbl);
      this.totalWin.children[0].getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(this.totalProfit);
    } else {
      this.totalWin.children[0].getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(this.profit);
    }
  }

  private increaseBigWinLbl() {
    this.profit += this.profitStep;
    if (this.profit >= this.totalProfit) {
      this.unschedule(this.increaseTotalWinLbl);
      this.bigWin.children[0].getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(this.totalProfit);
    } else {
      this.bigWin.children[0].getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(this.profit);
    }
  }

  public getWinType(betAmount: number, totalProfit: number) {
    let time = Math.floor(totalProfit / betAmount);
    if (time >= 31) {
      //31
      this.winType = SlotCmd.TYPE_WIN.MEGA_WIN;
    } else if (time >= 21) {
      //21
      this.winType = SlotCmd.TYPE_WIN.SUPER_WIN;
    } else if (time >= 11) {
      //11
      this.winType = SlotCmd.TYPE_WIN.BIG_WIN;
    } else if (time >= 0) {
      this.winType = 0;
    }
  }

  public runAutoSpin(runForever: boolean, num?: number) {
    this.isAutoSpinning = true;
    this.autoSpinLbl.node.active = true;
    if (runForever) {
      this.autoSpinLbl.string = "∞";
      this.isAutoSpinForever = true;
    } else {
      this.autoSpinLbl.string = num.toString();
    }
    this.reallySpin();
  }

  public sendBet() {
    this.disableBtn(false);
    SlotCmd.Send.sendSlotBet(
      SlotKKCommon.numberWithOutDot(this.totalBetNum.string)
    );
  }

  public getBalanceCheck() {
    this.startBalanceCheck = SlotKKCommon.numberWithOutDot(
      this.lbBalance.string
    );
  }

  public checkAutoSpin(profit: number, balance: number) {
    if (
      !this.getFreeGame &&
      !this.onFreeGame &&
      !this.lastFreeGame &&
      this.autoSpinLbl.node.active
    ) {
      if (this.onWin) {
        if (profit > 0) {
          this.onClickStopAutoSpin();
        }
      }

      if (this.onSingleWinExceeds) {
        // BGUI.ZLog.log("profit", profit, "exceedsNumber", this.exceedsNumber);
        if (profit >= this.exceedsNumber) {
          this.onClickStopAutoSpin();
        }
      }
      let dif = balance - this.startBalanceCheck;
      // BGUI.ZLog.log("dif", dif);
      if (this.onBalanceIncrease) {
        // BGUI.ZLog.log("increaseNumber", this.increaseNumber);
        if (dif >= this.increaseNumber) {
          this.onClickStopAutoSpin();
        }
      }
      if (this.onBalanceDecrease) {
        // BGUI.ZLog.log("decreaseNumber", this.decreaseNumber);
        if (dif <= this.decreaseNumber) {
          this.onClickStopAutoSpin();
        }
      }

      if (this.isAutoSpinForever) {
        this.reallySpin();
      } else {
        if (parseInt(this.autoSpinLbl.string) > 0) {
          this.autoSpinLbl.string = (
            parseInt(this.autoSpinLbl.string) - 1
          ).toString();
          this.reallySpin();
        } else if (parseInt(this.autoSpinLbl.string) === 0) {
          this.reallySpin();
          this.onClickStopAutoSpin();
        }
      }
    }
  }

  public reward() {
    let timeDelay = 0;
    switch (this.winType) {
      case 1:
        timeDelay = 5;
        break;

      case 2:
        timeDelay = 10;
        break;

      case 3:
        timeDelay = 15;
        break;
    }

    if (
      // !this.getFreeGame &&
      // !this.onFreeGame &&
      this.winType !== 0
    ) {
      SlotKKMusicManager.instance.playTypeLoop(SLOT_SOUND_TYPE.MEGA_WIN);
      this.bigWinCoin.active = true;
      this.bigWin.active = true;
      switch (this.winType) {
        case 1:
          this.bigWin.getComponent(sp.Skeleton).setAnimation(0, "bigwin", true);
          this.scheduleForLbl(this.localRes.amountProfit, 4.5, 3);
          this.scheduleOnce(() => {
            this.bigWin
              .getComponent(sp.Skeleton)
              .setAnimation(0, "bigwin_take", true);
          }, 4.5);
          this.scheduleOnce(() => {
            SlotKKMusicManager.instance.stopPlayLoop();
          }, 5);
          break;

        case 2:
          this.scheduleForLbl(this.localRes.amountProfit, 9.5, 3);
          this.bigWin.getComponent(sp.Skeleton).setAnimation(0, "bigwin", true);
          this.scheduleOnce(() => {
            SlotKKMusicManager.instance.playType(
              SLOT_SOUND_TYPE.BIG_WIN_CHANGE_LVL
            );
            this.bigWin
              .getComponent(sp.Skeleton)
              .setAnimation(0, "superwin", true);
          }, 4.8);
          this.scheduleOnce(() => {
            this.bigWin
              .getComponent(sp.Skeleton)
              .setAnimation(0, "superwin_take", true);
            SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.TAKE_WIN);
          }, 9.5);
          this.scheduleOnce(() => {
            SlotKKMusicManager.instance.stopPlayLoop();
          }, 10);
          break;

        case 3:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.ULTRA_COUNTING);
          this.scheduleForLbl(this.localRes.amountProfit, 14.5, 3);
          this.bigWin.getComponent(sp.Skeleton).setAnimation(0, "bigwin", true);
          this.scheduleOnce(() => {
            SlotKKMusicManager.instance.playType(
              SLOT_SOUND_TYPE.BIG_WIN_CHANGE_LVL
            );
            this.bigWin
              .getComponent(sp.Skeleton)
              .setAnimation(0, "superwin", true);
          }, 4.8);
          this.scheduleOnce(() => {
            this.bigWin
              .getComponent(sp.Skeleton)
              .setAnimation(0, "megawin", true);
          }, 9.8);
          this.scheduleOnce(() => {
            SlotKKMusicManager.instance.playType(
              SLOT_SOUND_TYPE.BIG_WIN_CHANGE_LVL
            );
            this.bigWin
              .getComponent(sp.Skeleton)
              .setAnimation(0, "megawin_take", true);
            SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.ULTRA_TAKEWIN);
          }, 14.5);
          this.scheduleOnce(() => {
            SlotKKMusicManager.instance.stopPlayLoop();
          }, 15);
          break;
      }

      this.scheduleOnce(() => {
        this.bigWinCoin.active = false;
        this.bigWin.active = false;
      }, timeDelay);
    }

    this.scheduleOnce(() => {
      this.checkAutoSpin(
        SlotKKMachine.instance.totalWinMoney,
        SlotKKMachine.instance.currentBalance
      );

      if (this.getFreeGame) {
        this.openFreeGameOption();
        if (this.onFreeSpinWin) {
          this.onClickStopAutoSpin();
        }
      }
      if (this.onFreeGame) {
        this.sendFreeGame();
        this.onFreeGame = false;
      }

      if (this.lastFreeGame) {
        SlotKKMusicManager.instance.playType(
          SLOT_SOUND_TYPE.FREE_GAME_TOTAL_WIN
        );
        this.bgTemp.opacity = 175;
        this.totalWin.active = true;
        this.totalWin.getComponent(sp.Skeleton).setAnimation(0, "enter", false);
        this.scheduleForLbl(
          SlotKKCommon.numberWithOutDot(
            SlotKKFreeGameLbl.instance.featureWinNum.string
          ),
          4.5,
          2
        );
        this.bgTemp.on(
          cc.Node.EventType.TOUCH_START,
          this.onClickEndTotalWin,
          this
        );
        this.scheduleOnce(() => {
          this.bgTemp.off(
            cc.Node.EventType.TOUCH_START,
            this.onClickEndTotalWin,
            this
          );
          this.bgTemp.on(cc.Node.EventType.TOUCH_START, this.endFreeGame, this);
          this.scheduleOnce(() => {
            this.endFreeGame();
          }, 3);
        }, 5);
      }

      if (
        !this.autoSpinLbl.node.active &&
        !this.localHaveFreeGameSpin &&
        !this.getFreeGame
      ) {
        this.disableBtn(true);
      }
      this.tempBigLbl = 0;
    }, timeDelay);
  }

  private endFreeGame() {
    this.localHaveFreeGameSpin = false;
    this.bgTemp.off(cc.Node.EventType.TOUCH_START, this.endFreeGame, this);
    this.bgTemp.opacity = 0;
    this.lastFreeGame = false;
    this.totalWin.active = false;
    this.closeFreeGameLbl();
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(
      this.currentMoney
    );
    SlotKKMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.MAIN_MUSIC);
    this.disableBtn(true);
    this.checkAutoSpin(
      SlotKKMachine.instance.totalWinMoney,
      SlotKKMachine.instance.currentBalance
    );
  }

  private onClickEndTotalWin() {
    this.totalWin.getComponent(sp.Skeleton).setAnimation(0, "enter", false);
    this.profit = this.totalProfit;
    this.bgTemp.off(
      cc.Node.EventType.TOUCH_START,
      this.onClickEndTotalWin,
      this
    );
    this.bgTemp.on(cc.Node.EventType.TOUCH_START, this.endFreeGame, this);
  }

  public flyCoin(pos1: cc.Vec2) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.FREE_GAME_COIN_FLY);
    let pos2 = this.pnFreeGameLbl.children[1].position;
    let coin = cc.instantiate(this.coin);
    coin.setPosition(pos1);
    this.pnForCoin.addChild(coin);
    cc.tween(coin)
      .to(0.5, { position: cc.v3(pos2.x, pos2.y - 75, 0) }, { easing: "" })
      .call(() => {
        cc.tween(coin)
          .to(0.25, { scale: 0.2 }, { easing: "" })
          .call(() => {
            coin.removeFromParent();
            this.pnFreeGameLbl
              .getComponent(SlotKKFreeGameLbl)
              .increaseMultiNum();
          })
          .start();
      })
      .start();
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
