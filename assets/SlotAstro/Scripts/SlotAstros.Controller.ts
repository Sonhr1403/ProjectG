import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { SlotCmd } from "./SlotAstros.Cmd";
import SlotAstrosCommon from "./SlotAstros.Common";
import { SlotAstrosConnector } from "./SlotAstros.Connector";
import SlotAstrosMusicManager, { SLOT_SOUND_TYPE } from "./SlotAstros.Music";
import SlotAstrosPayTable from "./SlotAstros.PayTable";
import SlotAstrosMachine from "./SlotAstros.SlotMachine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotAstrosController extends cc.Component {
  public static instance: SlotAstrosController = null;

  @property(cc.Node)
  public pnGame: cc.Node = null;

  @property(cc.Node)
  public footBar: cc.Node = null;

  @property(cc.Node)
  public headBar: cc.Node = null;

  @property(cc.Node)
  public pnBonus: cc.Node = null;

  @property(cc.Node)
  public cellsBG: cc.Node = null;

  @property(cc.Node)
  public turboBtn: cc.Node[] = [];

  @property(cc.Node)
  public autoSpinBtn: cc.Node[] = [];

  @property(cc.Node)
  public noti: cc.Node = null;

  @property(cc.Node)
  public btnSpin: cc.Node = null;

  @property(cc.Node)
  private pnAutoSpin: cc.Node = null;

  @property(cc.Button)
  public btnAutoSpin: cc.Button = null;

  @property(cc.Node)
  public menu: cc.Node = null;

  @property(cc.Node)
  public pnPayTable: cc.Node = null;

  @property(cc.Button)
  public btnIncBet: cc.Button = null;

  @property(cc.Button)
  public btnDecBet: cc.Button = null;

  @property(cc.Button)
  public btnMaxBet: cc.Button = null;

  @property(cc.Button)
  public btnMenu: cc.Button = null;

  @property(cc.Label)
  public betNum: cc.Label = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Label)
  public autoSpinLbl: cc.Label = null;

  @property(cc.Label)
  public notiContent: cc.Label = null;

  @property(sp.Skeleton)
  private logo: sp.Skeleton = null;

  @property(sp.Skeleton)
  private slotFrame: sp.Skeleton = null;

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

  private isTurbo: boolean = false;

  public isAutoSpinOn: boolean = false;
  public isAutoSpinning: boolean = false;

  private pnSetting: cc.Node = null;

  public currentBalance: number = 0;

  private betOrdi: number = 3;
  private listBet: Array<number> = [10000, 20000, 30000, 50000, 100000];

  public isForceStop: boolean = false;

  public lang: string = "";

  private firstStart: boolean = true;

  onLoad() {
    cc.debug.setDisplayStats(false);
    SlotAstrosController.instance = this;

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

    SlotAstrosConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );
    // SlotAstrosConnector.instance.addCmdListener(
    //   SlotCmd.Cmd.CMD_SLOT_JOIN_ROOM,
    //   this.responseJoinRoom,
    //   this
    // );
    SlotAstrosConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_OPEN_JACKPOT,
      this.responseOpenJackPot,
      this
    );

    SlotAstrosConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveSubcribeGame,
      this
    );
    SlotAstrosConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );
    SlotAstrosConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );
    SlotAstrosConnector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_JACKPOT_INFO,
      this.responseReceiveJackpotInfo,
      this
    );
    SlotAstrosConnector.instance.connect();
    // SlotAstrosConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_EXITGAME, this.responseDisconnect, this);
    // SlotAstrosConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_DISCONNECTED, this.responseDisconnect, this);
    // SlotAstrosConnector.instance.addCmdListener(SlotCmd.Cmd.CMD_SLOT_KICK_OUT, this.responseUserOut, this);
  }

  onDestroy() {
    SlotAstrosConnector.instance.disconnect();
    SlotAstrosConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_LOGIN
    );
    SlotAstrosConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO
    );
    SlotAstrosConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );
    SlotAstrosConnector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED
    );
    cc.director.getScheduler().unscheduleUpdate(this);
    //     SlotAstrosConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_EXITGAME);
    //     SlotAstrosConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_DISCONNECTED);
    //     SlotAstrosConnector.instance.removeCmdListener(this, SlotCmd.Cmd.CMD_SLOT_KICK_OUT);
  }

  protected start(): void {
    this.initSetting();
    this.pnPayTable.active = false;
    this.pnGame.active = true;
    this.resetStart();

    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);

    /////////////////////////////test
    // this.currentBalance = 1000000000;
    // this.updateBalance(1000000000);
    // this.updateBet();
  }

  private resetStart() {
    this.cellsBG.active = false;
    this.slotFrame.node.active = false;
    SlotAstrosMachine.instance.progress.active = false;
    SlotAstrosMachine.instance.listX.forEach((element) => {
      element.node.active = false;
    });
    this.pnGame.active = false;
    this.footBar.active = false;
    this.headBar.active = false;
    this.pnBonus.active = false;
  }

  public startGame() {
    if (this.firstStart) {
      this.initMusic();
      this.firstStart = false;
      this.pnGame.active = true;
      this.logo.node.active = true;
      this.logo.setAnimation(0, "start_game", false);
      this.logo.setCompleteListener(() => {
        this.logo.setAnimation(0, "default", true);
        this.logo.clearTracks();

        this.scheduleOnce(() => {
          this.slotFrame.node.active = true;
          this.slotFrame.setAnimation(0, "open", false);
          this.slotFrame.setCompleteListener(() => {
            this.slotFrame.setAnimation(0, "idle", true);
            this.slotFrame.clearTracks();
            this.footBar.active = true;
            this.headBar.active = true;
            this.cellsBG.active = true;
            SlotAstrosMachine.instance.progress.active = true;
            SlotAstrosMachine.instance.listX.forEach((element) => {
              element.node.active = true;
            });
            this.initData();
          });
          // this.slotFrame.setCompleteListener(null);
        }, 0);
      });
      // this.logo.setCompleteListener(null);
    } else {
      this.pnGame.active = true;
      this.slotFrame.node.active = true;
      this.footBar.active = true;
      this.headBar.active = true;
      this.cellsBG.active = true;
      SlotAstrosMachine.instance.progress.active = true;
      SlotAstrosMachine.instance.listX.forEach((element) => {
        element.node.active = true;
      });
    }
  }

  ////////////////////////////////////////////////////////////////////Init Start
  private initMusic() {
    localStorage.setItem("musicStatus", "true");
    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.INTROENTERGAME, 1);
    this.scheduleOnce(() => {
      SlotAstrosMusicManager.instance.playBgMusic();
    }, 4);
  }

  private initSetting() {
    this.pnSetting = cc.instantiate(this.prfSetting);
    this.pnSetting.zIndex = 999;
    this.pnSetting.active = false;
    this.pnGame.addChild(this.pnSetting);
  }

  private initData() {
    this.fakeData();
    SlotAstrosMachine.instance.createMachine(this.localData);
  }

  public fakeData() {
    let rowSize = 5;
    let rowList: Array<SlotCmd.ImpRowResult> = [];
    let totalProfit = 0;
    let count = 0;
    for (let i = 0; i < rowSize; i++) {
      let arr: Array<SlotCmd.ImpItemCell> = [];
      let row: SlotCmd.ImpRowResult = {
        row: i,
        type: 0,
        listItem: arr,
        amountProfit: 0,
      };
      let num = 7 - i;
      for (let j = 0; j < num; j++) {
        let item: SlotCmd.ImpItemCell = {
          index: count,
          id: SlotAstrosCommon.getRandomNumber(3, 13),
          highlight: true,
          appearTime: 0,
        };
        arr.push(item);
        count++;
      }
      rowList.push(row);
      // totalProfit += row.amountProfit;
    }

    let data: SlotCmd.ImpData = {
      betAmount: this.getTotalBet(),
      rowList: rowList,
      totalProfit: totalProfit,
      currentMoney: this.currentBalance,
    };
    this.localData = data;
  }
  /////////////////////////////////////////////////////////////////////////////Init End

  //////////////////////////////////////////////////////////////////////////Button Start

  private onClickSpin() {
    this.reallySpin();
  }

  public reallySpin() {
    if (this.currentBalance < this.getTotalBet()) {
      if (!this.noti.active) {
        this.noti.active = true;
        this.notiContent.string = LanguageMgr.getString(
          "slotastros.not_enough_money"
        );
      }
    } else {
      this.isForceStop = false;
      SlotAstrosMachine.instance.startSpinVirtual(0, 6);
      this.decreaseBalance();
      //fake
      // this.fakeData();
      // this.scheduleOnce(() => {
      //   SlotAstrosMachine.instance.letGo(this.localData);
      // }, 0.5);
      // this.disableBtn(false);
      this.sendBet();
    }
  }

  private decreaseBalance() {
    this.currentBalance -= this.getTotalBet();
    this.updateBalance(this.currentBalance);
  }

  public increaseBalance(num: number) {
    this.currentBalance += num;
    this.updateBalance(this.currentBalance);
  }

  private onClickTurbo() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.isTurbo = !this.isTurbo;
    this.updateTurbo();
  }

  public updateTurbo() {
    if (this.isTurbo) {
      this.turboBtn[1].active = true;
      this.turboBtn[0].getComponent(cc.Button).interactable = false;
      this.turboBtn[1].getComponent(cc.Button).interactable = false;
      cc.tween(this.turboBtn[0])
        .to(0.25, { opacity: 0 })
        .call(() => {
          cc.tween(this.turboBtn[1])
            .to(0.25, { opacity: 255 })
            .call(() => {
              this.turboBtn[0].getComponent(cc.Button).interactable = true;
              this.turboBtn[1].getComponent(cc.Button).interactable = true;
              this.turboBtn[0].active = false;
            })
            .start();
        })
        .start();
    } else {
      this.turboBtn[0].active = true;
      this.turboBtn[0].getComponent(cc.Button).interactable = false;
      this.turboBtn[1].getComponent(cc.Button).interactable = false;
      cc.tween(this.turboBtn[1])
        .to(0.25, { opacity: 0 })
        .call(() => {
          cc.tween(this.turboBtn[0])
            .to(0.25, { opacity: 255 })
            .call(() => {
              this.turboBtn[0].getComponent(cc.Button).interactable = true;
              this.turboBtn[1].getComponent(cc.Button).interactable = true;
              this.turboBtn[1].active = false;
            })
            .start();
        })
        .start();
    }
  }

  public getTurbo() {
    return this.isTurbo;
  }

  private onClickIncBet() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.betOrdi += 1;
    this.updateBet();
  }

  private onClickDecBet() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.betOrdi -= 1;
    this.updateBet();
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
    let num = this.getTotalBet();
    this.updateBetNum(num);

    if (num !== this.localBetAmount) {
      SlotCmd.Send.sendSlotJoinGame(num);
    }
  }

  private updateBetNum(num: number) {
    this.betNum.string = BGUI.Utils.formatMoneyWithCommaOnly(num);
  }

  private onClickMaxBet() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.betOrdi < 4) {
      this.betOrdi = 4;
      this.updateBet();
    }
  }

  public onClickAutoSpin() {
    // SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.btnAutoSpin.interactable = false;
    this.isAutoSpinOn = !this.isAutoSpinOn;
    if (this.isAutoSpinOn) {
      this.pnAutoSpin.active = true;
      cc.tween(this.pnAutoSpin)
        .to(0.25, { opacity: 255 })
        .call(() => {
          this.btnAutoSpin.interactable = true;
        })
        .start();
    } else {
      cc.tween(this.pnAutoSpin)
        .to(0.25, { opacity: 0 })
        .call(() => {
          this.btnAutoSpin.interactable = true;
          this.pnAutoSpin.active = false;
        })
        .start();
    }
  }

  public onClickChooseAutoSpin(event, id) {
    // SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.runAutoSpin(parseInt(id));
    this.onClickAutoSpin();
  }

  public runAutoSpin(num: number) {
    this.isAutoSpinning = true;
    this.btnAutoSpin.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.autoPlaySF[1];
    cc.tween(this.autoSpinBtn[0])
      .to(0.25, { opacity: 0 })
      .call(() => {
        this.autoSpinBtn[0].active = false;
        this.autoSpinBtn[1].active = true;
        cc.tween(this.autoSpinBtn[1]).to(0.25, { opacity: 255 }).start();
      })
      .start();
    this.autoSpinLbl.string = num.toString();
    this.reallySpin();
  }

  public onClickStopAutoSpin() {
    // SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.btnAutoSpin.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.autoPlaySF[0];
    cc.tween(this.autoSpinBtn[1])
      .to(0.25, { opacity: 0 })
      .call(() => {
        this.autoSpinBtn[1].active = false;
        this.autoSpinBtn[0].active = true;
        cc.tween(this.autoSpinBtn[0]).to(0.25, { opacity: 255 }).start();
      })
      .start();
    this.isAutoSpinning = false;
    this.autoSpinLbl.string = "";
  }

  private onClickMenu() {
    this.menu.active = !this.menu.active;
  }

  private onClickPayTable() {
    this.resetStart();
    this.pnPayTable.getComponent(SlotAstrosPayTable).onOpenPays();
    this.menu.active = false;
  }

  private onClickSetting() {
    this.pnSetting.active = true;
    this.menu.active = false;
  }

  public disableBtn(enabled: boolean) {
    if (enabled) {
      switch (this.betOrdi) {
        case 0:
          this.btnDecBet.interactable = false;
          this.btnIncBet.interactable = true;
          break;
        case 4:
          this.btnDecBet.interactable = true;
          this.btnIncBet.interactable = false;
          break;
        default:
          this.btnDecBet.interactable = true;
          this.btnIncBet.interactable = true;
          break;
      }
    } else {
      this.btnDecBet.interactable = false;
      this.btnIncBet.interactable = false;
    }
    this.btnMaxBet.interactable = enabled;
    this.btnMenu.interactable = enabled;
    this.btnAutoSpin.interactable = enabled;
    this.autoSpinBtn[0].getComponent(cc.Button).interactable = enabled;
    if (this.pnAutoSpin.active) {
      cc.tween(this.pnAutoSpin)
        .to(0.25, { opacity: 0 })
        .call(() => {
          this.pnAutoSpin.active = false;
        })
        .start();
    }
  }

  /////////////////////////////////////////////////////////////////////////////Button End

  protected onEnable(): void {
    // SlotAstrosConnector.instance.connect();
  }

  protected onDisable(): void {
    // SlotAstrosConnector.instance.disconnect();
  }

  /////////////////////////////////////////////////////////////////////Response Start

  private showError(res) {
    let err = res.getError();
    if (err !== 0) {
      SlotAstrosCommon.runError({
        name: "error",
        err: err,
      });
    }
  }

  private checkRes(name: string, cmdId: any, res: any) {
    SlotAstrosCommon.runError({
      name: name,
      time: new Date().toLocaleString() + " " + new Date().getMilliseconds(),
      cmdId: cmdId,
      res: res,
    });
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
        SlotCmd.Send.sendSlotJoinGame(this.listBet[this.betOrdi]);
        break;

      default:
        if (!SlotAstrosController.instance.noti.active) {
          this.noti.active = true;
        }
        this.notiContent.string = LanguageMgr.getString(
          "slotastros.connection_error3"
        );
        break;
    }
  }

  // private responseJoinRoom(cmdId: any, data: Uint8Array) {
  //   this.checkRes("responseJoinRoom", cmdId, data);
  // }

  //   // 5002
  protected responseReceiveSubcribeGame(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    this.checkRes("responseReceiveSubcribeGame", cmdId, data);
    this.showError(res);
    /////////////////////////
    this.currentBalance = res.currentMoney;
    this.updateBalance(res.currentMoney);
    if (this.localBetAmount !== res.betAmount) {
      this.localBetAmount = res.betAmount;
      this.updateBet();
    }
    this.startGame();

    // if (res.isJackpot) {
    //   SlotCmd.Send.sendOpenJackpot();
    // }
  }

  public updateBalance(num: number) {
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
  public localRes5004: SlotCmd.SlotReceiveRoundResult = null;

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    this.checkRes("responseReceiveRoundResult", cmdId, data);
    this.showError(res);
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      if (!SlotAstrosController.instance.noti.active) {
        this.noti.active = true;
      }
      this.notiContent.string = LanguageMgr.getString("slotastros.spin_error");
      return;
    }

    this.localRes5004 = res;
    this.localData = res.data;
    SlotAstrosMachine.instance.letGo(res.data);
  }

  //5005
  protected responseReceiveBetFailed(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveBetFailed();
    res.unpackData(data);
    this.checkRes("responseReceiveBetFailed", cmdId, data);
    this.showError(res);

    ////////////////////////////////////////////
    const error = res.getError();
    switch (error) {
      case 1:
        SlotAstrosCommon.runError("Không trừ được tiền");
        this.notiContent.string = LanguageMgr.getString(
          "slotastros.spin_error"
        );
        break;

      case 2:
        SlotAstrosCommon.runError("Đang có free game");
        this.notiContent.string = LanguageMgr.getString(
          "slotastros.spin_error"
        );
        break;

      case 3:
        SlotAstrosCommon.runError("Đang có jackpot");
        this.notiContent.string = LanguageMgr.getString(
          "slotastros.spin_error"
        );
        break;
    }

    if (!SlotAstrosController.instance.noti.active) {
      this.noti.active = true;
    }
  }

  //   private backToLobby() {
  //     SlotAstrosConnector.instance.disconnect();
  //     BGUI.GameCoreManager.instance.onBackToLobby();
  //   }

  public sendBet() {
    this.disableBtn(false);
    SlotCmd.Send.sendSlotBet(this.getTotalBet());
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
        SlotAstrosController.instance.disableBtn(true);
      }
    } else {
      SlotAstrosController.instance.disableBtn(true);
    }
  }

  // 5003
  protected responseReceiveJackpotInfo(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveJackpotInfo();
    res.unpackData(data);
    this.checkRes("responseReceiveJackpotInfo", cmdId, data);
    this.showError(res);

    //////////////////////////////////////////////////////////////////////
  }

  public scheduleForLbl(winMoney: number, time: number) {
    let profit = 0;
    let totalProfit = winMoney;
    let profitStep = winMoney / (time * 10);

    this.schedule(increaseJackPotLbl, 0.075);

    function increaseJackPotLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseJackPotLbl);
        this.jackPotLbl.getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
      } else {
        this.jackPotLbl.getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }
  }

  private responseOpenJackPot(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveJackpotResult();
    res.unpackData(data);
    this.checkRes("responseOpenJackPot", cmdId, data);
    this.showError(res);

    /////////////////////////////////////////////////////////
  }

  public getTotalBet() {
    return this.listBet[this.betOrdi];
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
