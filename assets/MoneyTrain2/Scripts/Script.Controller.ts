import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { SlotCmd } from "./Script.Cmd";
import MoneyTrain2Common from "./Script.Common";
import { MoneyTrain2Connector } from "./Script.Connector";
import MoneyTrain2FootBar from "./Script.FootBar";
import MoneyTrain2HeadBar from "./Script.HeadBar";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";
import MoneyTrain2Noti from "./Script.Noti";
import MoneyTrain2Machine from "./Script.SlotMachine";
import MoneyTrain2MachineMini from "./Script.SlotMachine_Mini";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2Controller extends cc.Component {
  public static instance: MoneyTrain2Controller = null;

  @property(cc.Node)
  private pnGame: cc.Node = null;

  @property(cc.Node)
  private pnBar: cc.Node = null;

  @property(cc.Node)
  private train: cc.Node = null;

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

  @property(cc.Node)
  private listDoor: cc.Node[] = [];

  @property(sp.Skeleton)
  private listWheel: sp.Skeleton[] = [];

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

  private localBetAmount: number = 50000;

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

  public isForceStop: boolean = false;

  public lang: string = "";

  onLoad() {
    cc.debug.setDisplayStats(false);
    MoneyTrain2Controller.instance = this;
    this.initNoti();

    this.isMobile = cc.sys.isMobile;

    MoneyTrain2Connector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_LOGIN,
      this.responseLogin,
      this
    );

    MoneyTrain2Connector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO,
      this.responseReceiveSubscribeGame,
      this
    );

    MoneyTrain2Connector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT,
      this.responseReceiveRoundResult,
      this
    );

    MoneyTrain2Connector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED,
      this.responseReceiveBetFailed,
      this
    );

    MoneyTrain2Connector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT,
      this.responseFreeGame,
      this
    );

    MoneyTrain2Connector.instance.addCmdListener(
      SlotCmd.Cmd.CMD_SLOT_OPEN_MINIGAME,
      this.responseMiniGame,
      this
    );

    // MoneyTrain2Connector.instance.connect();
  }

  onDestroy() {
    MoneyTrain2Connector.instance.disconnect();

    MoneyTrain2Connector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_LOGIN
    );

    MoneyTrain2Connector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_GAME_INFO
    );

    MoneyTrain2Connector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_ROUND_RESULT
    );

    MoneyTrain2Connector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_BET_FAILED
    );

    MoneyTrain2Connector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_FREE_GAME_RESULT
    );

    MoneyTrain2Connector.instance.removeCmdListener(
      this,
      SlotCmd.Cmd.CMD_SLOT_OPEN_MINIGAME
    );

    cc.director.getScheduler().unscheduleUpdate(this);
  }

  protected start(): void {
    this.initHeadBar();
    this.initFootBar();
    this.initSetting();
    // this.initPayTable();
    // this.initFreeGame();
    // this.initMusic();
    this.initData();

    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);

    this.train.x = 2500;
    // this.train.setPosition(cc.v2(2500, 0));
    this.scheduleOnce(() => {
      this.trainAnimStop(true);
    }, 1);
  }

  ////////////////////////////////////////////////////////////////////Init Start
  private initMusic() {
    // localStorage.setItem("musicStatus", "true");
    MoneyTrain2MusicManager.instance.playSlotMusic(0);
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

  public initNoti() {
    this.pnNoti = cc.instantiate(this.prfNoti);
    this.pnNoti.zIndex = 999;
    this.pnNoti.active = true;
    this.pnGame.parent.addChild(this.pnNoti);
    this.pnNoti.active = false;
  }

  private initData() {
    MoneyTrain2FootBar.instance.updateBet();
    this.train.children[1].active = true;
    this.fakeData();
    MoneyTrain2Machine.instance.createMachine(this.localData);
    MoneyTrain2HeadBar.instance.setCurrentBalance(1000000000);
  }

  public fakeData(isFG: boolean = false) {
    if (isFG) {

    } else {
      let win = MoneyTrain2Common.getRandomNumber(1, 2) === 1;
      let data: SlotCmd.ImpData = {
        betAmount: this.getTotalBet(),
        cellSize: 20,
        listCell: [],
        resultSize: 0,
        listResult: [],
        type: 4,
        totalProfit: win ? this.getTotalBet() * 21 : 0,
        currentMoney: win
          ? MoneyTrain2HeadBar.instance.getCurrentBalance() + this.getTotalBet()
          : MoneyTrain2HeadBar.instance.getCurrentBalance(),
      };

      for (let j = 0; j < data.cellSize; j++) {
        let item: SlotCmd.ImpItemCell = {
          index: j,
          id: MoneyTrain2Common.getRandomNumber(0, 9),
          highlight: win ? true : false,
          value: -1,
        };
        if (j == 0 || j == 1 || j == 2) {
          item.id = 1;
          item.value = 2;
        }
        data.listCell.push(item);
      }

      let ran = win ? MoneyTrain2Common.getRandomNumber(0, 5) : 0;
      for (let i = 0; i < ran; i++) {
        let id = MoneyTrain2Common.getRandomNumber(0, 39);
        let result: SlotCmd.ImpResult = {
          hlSize: 0,
          listHL: [],
          lineWinSize: 0,
          listLineWin: [],
        };
        result.listHL = this.listArrIndexHL[id];
        result.listLineWin = this.listArrIndexHL[id];
        data.listResult.push(result);
      }
      this.localData = data;
    }
  }

  private listArrIndexHL = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [0, 6, 12, 8, 4],
    [5, 11, 17, 13, 9],
    [15, 11, 7, 13, 19],
    [10, 6, 2, 8, 14],
    [0, 1, 7, 3, 4],
    [5, 6, 12, 8, 9],
    [10, 11, 17, 13, 14],
    [15, 16, 12, 18, 19],
    [10, 11, 7, 13, 14],
    [5, 6, 2, 8, 9],
    [5, 1, 2, 3, 9],
    [10, 6, 7, 8, 14],
    [15, 11, 12, 13, 19],
    [10, 16, 17, 18, 14],
    [5, 11, 12, 13, 9],
    [0, 6, 7, 8, 4],
    [5, 1, 7, 3, 9],
    [10, 6, 12, 8, 14],
    [15, 11, 17, 13, 19],
    [10, 16, 12, 18, 14],
    [5, 11, 7, 13, 9],
    [0, 6, 2, 8, 4],
    [0, 1, 7, 13, 14],
    [5, 6, 12, 18, 19],
    [15, 16, 12, 8, 9],
    [10, 11, 7, 3, 4],
    [5, 11, 7, 3, 9],
    [10, 16, 12, 8, 14],
    [10, 6, 12, 18, 14],
    [5, 1, 7, 13, 9],
    [0, 11, 12, 13, 4],
    [5, 16, 17, 18, 9],
    [15, 6, 7, 8, 19],
    [10, 1, 2, 3, 14],
    [0, 6, 12, 18, 14],
    [15, 11, 7, 3, 9],
  ];
  /////////////////////////////////////////////////////////////////////////////Init End

  //////////////////////////////////////////////////////////////////////////Button Start

  public reallySpin() {
    if (MoneyTrain2HeadBar.instance.getCurrentBalance() < this.getTotalBet()) {
      MoneyTrain2Noti.instance.openNoti(3);
    } else {
      this.isForceStop = false;
      MoneyTrain2Machine.instance.startSpinVirtual();
      MoneyTrain2HeadBar.instance.decreaseBalance();
      //fake
      this.fakeData();
      this.scheduleOnce(() => {
        MoneyTrain2Machine.instance.letGo(this.localData);
      }, 2);
      // this.sendBet();
      this.setBtnInteractive(false);
    }
  }

  public setBtnInteractive(bool: boolean) {
    MoneyTrain2FootBar.instance.setBtnInteractive(bool);
    MoneyTrain2HeadBar.instance.setMenuInteractive(bool);
  }

  /////////////////////////////////////////////////////////////////////////////Button End

  /////////////////////////////////////////////////////////////////////Response Start

  private showError(res) {
    let err = res.getError();
    if (err !== 0) {
      MoneyTrain2Common.runError({
        error: err,
      });
    }
  }

  private checkRes(name: string, cmdId: any, res: any) {
    MoneyTrain2Common.runError(
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
        MoneyTrain2Noti.instance.openNoti(1);
        break;
    }
  }

  //   // 5002
  protected responseReceiveSubscribeGame(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveGameInfo();
    res.unpackData(data);
    this.checkRes("responseReceiveSubscribeGame", cmdId, res);
    this.showError(res);
    /////////////////////////
    MoneyTrain2HeadBar.instance.setCurrentBalance(res.currentMoney);
    if (this.localBetAmount !== res.betAmount) {
      this.localBetAmount = res.betAmount;
      MoneyTrain2FootBar.instance.updateBet();
    }

    if (res.isFreeGame) {
    }

    if (res.isMiniGame) {
      this.localMini = res.miniGame;
      this.scheduleOnce(()=>{
        this.trainAnimGo(true);
      }, 5)
    }
  }

  //   // 5004
  public localData: SlotCmd.ImpData = null;
  public localMini: SlotCmd.ImpMini = null;
  public localRes5004: SlotCmd.SlotReceiveRoundResult = null;

  protected responseReceiveRoundResult(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveRoundResult();
    res.unpackData(data);
    this.checkRes("responseReceiveRoundResult", cmdId, res);
    this.showError(res);
    ////////////////////////////////////////////

    if (res.getError() != 0) {
      MoneyTrain2Noti.instance.openNoti(4);
      return;
    }

    this.localRes5004 = res;
    this.localData = res.data;
    MoneyTrain2Machine.instance.letGo(res.data);
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
        MoneyTrain2Common.runError("Can't deduct money");
        break;

      case 2:
        MoneyTrain2Common.runError("Free game available");
        break;

      case 3:
        MoneyTrain2Common.runError("Jackpot available");
        break;

      case 4:
        MoneyTrain2Common.runError("Mini game available");
        // this.sendMiniGame();
        break;
    }

    MoneyTrain2Noti.instance.openNoti(4);
  }

  //5008
  private responseFreeGame(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveFreeGame();
    res.unpackData(data);
    this.checkRes("responseFreeGame", cmdId, res);
    this.showError(res);

    /////////////////////////////////////////////////////////

    let err = res.getError();
    switch (err) {
      case 0:
        this.localData = res.data;
        MoneyTrain2Machine.instance.letGo(res.data);
        break;

      case 1:
        MoneyTrain2Common.runError("No Free Game");
        break;

      default:
        MoneyTrain2Common.runError("Free Game Error:", err);
        break;
    }
  }

  //5010
  private responseMiniGame(cmdId: any, data: Uint8Array) {
    let res = new SlotCmd.SlotReceiveMiniGame();
    res.unpackData(data);
    this.checkRes("responseMiniGame", cmdId, res);
    this.showError(res);

    /////////////////////////////////////////////////////////

    switch (res.err) {
      case 0:
        this.localMini = res.miniGame;
        MoneyTrain2MachineMini.instance.letGo(this.localMini);
        break;

      case 1:
        MoneyTrain2Common.runError("No Mini Game");
        break;

      default:
        MoneyTrain2Common.runError("Mini Game Error:", res.err);
        break;
    }
  }

  /////////////////////////////////////////////////////////////////////Response End

  ///////////////////////////////////////////////////////////// other function
  public getTotalBet() {
    return this.listBet[this.betOrdi];
  }

  public sendBet() {
    SlotCmd.Send.sendSlotBet(this.getTotalBet());
  }

  public sendFreeGame() {
    SlotCmd.Send.sendStartFreeGame();
  }

  public sendMiniGame() {
    SlotCmd.Send.sendStartMiniGame();
  }

  public checkAutoSpin() {
    if (this.isAutoSpinning) {
      if (MoneyTrain2FootBar.instance.getLblAutoSpin() > 0) {
        MoneyTrain2FootBar.instance.decLblAutoSpin();
        this.reallySpin();
      } else {
        MoneyTrain2FootBar.instance.onClickStopAutoSpin();
        this.setBtnInteractive(true);
      }
    } else {
      this.setBtnInteractive(true);
    }
  }

  public scheduleForLbl(
    start: number,
    to: number,
    time: number,
    lbl: cc.Label,
    isSchedule: boolean
  ) {
    let current = start;
    let totalProfit = to;
    let profitStep = (totalProfit - current) / 100;

    if (isSchedule) {
      this.unschedule(increaseLbl);
    } else {
      this.schedule(increaseLbl, time * 0.01);
    }
    function increaseLbl() {
      current += profitStep;
      if (current >= totalProfit) {
        this.unschedule(increaseLbl);
        lbl.string = MoneyTrain2Common.numberWithCommas(totalProfit);
      } else {
        lbl.string = MoneyTrain2Common.numberWithCommas(current);
      }
    }
  }

  public trainAnimGo(day: boolean) {
    this.listWheel[0].setAnimation(0, SlotCmd.STATE_OF_WHEEL.ANIMATION, true);
    if (day) {
      cc.tween(this.listDoor[0])
        .to(0.6, { height: 620 }, { easing: "smooth" })
        .start();
      this.listWheel[1].setAnimation(
        0,
        SlotCmd.STATE_OF_WHEEL.BACK_WHEEL_START,
        false
      );
      this.listWheel[1].setCompleteListener(() => {
        this.listWheel[1].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          true
        );
      });
      this.listWheel[2].setAnimation(
        0,
        SlotCmd.STATE_OF_WHEEL.FRONT_WHEEL_START,
        false
      );
      this.listWheel[2].setCompleteListener(() => {
        this.listWheel[2].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          true
        );
      });
    } else {
      cc.tween(this.listDoor[1])
        .to(0.6, { height: 620 }, { easing: "smooth" })
        .start();
      this.listWheel[3].setAnimation(
        0,
        SlotCmd.STATE_OF_WHEEL.BACK_WHEEL_START,
        false
      );
      this.listWheel[3].setCompleteListener(() => {
        this.listWheel[3].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          true
        );
      });
      this.listWheel[4].setAnimation(
        0,
        SlotCmd.STATE_OF_WHEEL.FRONT_WHEEL_START,
        false
      );
      this.listWheel[4].setCompleteListener(() => {
        this.listWheel[4].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          true
        );
      });
    }
    // this.scheduleOnce(()=>{
    cc.tween(this.train)
      .to(1.5, { position: cc.v3(-4500, 0, 0) }, { easing: "smooth" })
      .tag(0)
      .call(() => {
        // cc.Tween.stopAllByTag(0);
        // this.train.x = 2500;
        cc.tween(this.train)
          .to(0.1, { position: cc.v3(-4500, -2000, 0) })
          .call(() => {
            cc.tween(this.train)
              .to(0.1, { position: cc.v3(2500, -2000, 0) })
              .call(() => {
                cc.tween(this.train)
                  .to(0.1, { position: cc.v3(2500, 0, 0) })
                  .call(() => {
                    if (day) {
                      this.trainAnimStop(false);
                    } else {
                      this.trainAnimStop(true);
                    }
                  })
                  .start();
              })
              .start();
          })
          .start();
        this.listWheel[0].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          false
        );
      })
      .start();
    // },1.5)
  }

  private trainAnimStop(day: boolean) {
    this.listWheel[0].setAnimation(0, SlotCmd.STATE_OF_WHEEL.ANIMATION, true);
    if (day) {
      this.train.children[0].children[1].active = false;
      this.train.children[1].active = true;
      this.train.children[2].active = false;

      this.listWheel[1].setAnimation(
        0,
        SlotCmd.STATE_OF_WHEEL.BACK_WHEEL_START,
        false
      );
      this.listWheel[1].setCompleteListener(() => {
        this.listWheel[1].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          true
        );
      });
      this.listWheel[2].setAnimation(
        0,
        SlotCmd.STATE_OF_WHEEL.FRONT_WHEEL_START,
        false
      );
      this.listWheel[2].setCompleteListener(() => {
        this.listWheel[2].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          true
        );
      });
    } else {
      this.train.children[0].children[1].active = true;
      this.train.children[1].active = false;
      this.train.children[2].active = true;
      MoneyTrain2MachineMini.instance.createMachineMini(this.localMini);
      this.listWheel[3].setAnimation(0, SlotCmd.STATE_OF_WHEEL.ANIMATION, true);
      // this.listWheel[3].setCompleteListener(() => {
      //   this.listWheel[3].setAnimation(
      //     0,
      //     SlotCmd.STATE_OF_WHEEL.ANIMATION,
      //     true
      //   );
      // });
      this.listWheel[4].setAnimation(0, SlotCmd.STATE_OF_WHEEL.ANIMATION, true);
      // this.listWheel[4].setCompleteListener(() => {
      //   this.listWheel[4].setAnimation(
      //     0,
      //     SlotCmd.STATE_OF_WHEEL.ANIMATION,
      //     true
      //   );
      // });
    }
    cc.tween(this.train)
      .to(3, { position: cc.v3(-1610, 0, 0) }, { easing: "smooth" })
      .call(() => {
        if (day) {
          cc.tween(this.listDoor[0])
            .to(0.8, { height: 0 }, { easing: "smooth" })
            .start();
        } else {
          cc.tween(this.listDoor[1])
            .to(0.8, { height: 0 }, { easing: "smooth" })
            .call(() => {
              MoneyTrain2MachineMini.instance.runCounterSpins(true);
              MoneyTrain2MachineMini.instance.runCounterTotal(true);
              MoneyTrain2MachineMini.instance.landColumn();
              this.scheduleOnce(() => {
                MoneyTrain2MachineMini.instance.startSpinVirtual();
                this.sendMiniGame();
              }, 2);
            })
            .start();
        }
      })
      .start();
    this.scheduleOnce(() => {
      if (day) {
        this.listWheel[1].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.BACK_WHEEL_STOP,
          false
        );
        this.listWheel[1].setCompleteListener(null);
        this.listWheel[2].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.FRONT_WHEEL_STOP,
          false
        );
        this.listWheel[2].setCompleteListener(null);
      } else {
        this.listWheel[3].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          false
        );
        this.listWheel[4].setAnimation(
          0,
          SlotCmd.STATE_OF_WHEEL.ANIMATION,
          false
        );
      }
    }, 2);
  }

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
