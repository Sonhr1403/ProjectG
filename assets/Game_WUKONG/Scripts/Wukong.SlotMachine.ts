// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator;

import WukongMain from "./Wukong.Controller";
import WukongCell from "./Wukong.Cell";
import WukongColumn, { Direction } from "./Wukong.Column";
import { WukongCmd } from "./Wukong.Cmd";
import WukongCommon from "./Wukong.Common";
import WukongMusicManager, { SLOT_SOUND_TYPE } from "./Wukong.MusicManager";

@ccclass
export default class WukongSlotMachine extends cc.Component {
  public static instance: WukongSlotMachine = null;
  @property({ type: cc.Node })
  public slotMachineNode = null;
  @property({ type: cc.Node })
  public lineWinFxs = null;
  @property({ type: sp.SkeletonData })
  public spAtlasCharacter: sp.SkeletonData[] = [];
  @property({ type: sp.SkeletonData })
  public spAtlasCharacterEffect: sp.SkeletonData[] = [];

  @property({ type: cc.Prefab })
  public _columnPrefab = null;

  @property({ type: cc.Prefab })
  get columnPrefab(): cc.Prefab {
    return this._columnPrefab;
  }

  set columnPrefab(newPrefab: cc.Prefab) {
    this._columnPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberColumn = 3;

  @property({ type: cc.Integer, range: [1, 5], slide: true })
  get numberColumn(): number {
    return this._numberColumn;
  }

  set numberColumn(newNumber: number) {
    this._numberColumn = newNumber;
    if (this.columnPrefab !== null) {
      this.createMachine();
    }
  }

  private columns = [];
  public results = [];
  public isFree: boolean = false;
  private type: number = 0;
  public freeSpinType: number = 0; // 1 = jail | 2 = unlockall
  public jailMoved: number = 0;
  public stayStill: boolean = false;
  public isClicked: boolean = false;
  public scatterCount: number = 0;
  public jackpotCount: number = 0;
  private profitAmount: number = 0;
  public unlockAll: boolean = false;
  public columnFinishSpinning: number = 0;
  public isSpinning: boolean = false;
  public isGlowing: boolean = false;
  public almostEndFreeSpin: boolean = false;
  public columnFinish: number = 0;
  private resultColumn;
  onLoad() {
    WukongSlotMachine.instance = this;
    this.createMachine();
  }

  start() {}

  public createMachine(): void {
    this.slotMachineNode.removeAllChildren();
    this.columns = [];
    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      this.columns[i] = newColumn;
      this.slotMachineNode.addChild(newColumn);
      const objColumn = newColumn.getComponent(WukongColumn);
      objColumn.createColumn();
      objColumn.columnNum = i;
      objColumn.index = i;
    }
  }

  public letGo(res: WukongCmd.SlotReceiveRoundResult): void {
    this.columnFinish = 0;
    WukongMain.instance.idleWinSmall.active = false;
    // this.unschedule(WukongMain.instance.toggleWinNode)
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    }
    let todayTime = new Date().toLocaleTimeString();
    let todayDate = new Date().toLocaleDateString();
    let localRes: any = res;
    localRes.date = todayDate;
    localRes.time = todayTime;
    this.profitAmount = res.amountProfit;
    this.isFree = false;
    this.freeSpinType = 0;
    WukongMain.instance.historySpin.unshift(localRes);
    let result = res.items;
    this.type = res.type;

    this.isGlowing = false;
    this.jailMoved = 0;
    this.stayStill = false;
    WukongMain.instance.profitAmount = res.amountProfit;
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }
    for (let i = 0; i < 30; i++) {
      this.lineWinFxs.children[i].active = false;
    }
    for (let i = 0; i < 15; i++) {
      data[i % 5].push(result[i]);
    }
    this.results = res.results;
    this.resultColumn = data;
    var delay = 5;
    // var delay = 0.008;
    var isFree = false;
    let scatterCheck = 0;
    let jackpotCheck = 0;
    for (let i = 0; i < this.numberColumn; i++) {
      let scatterState = 0;
      let jackpotState = 0;
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.spinDirection = Direction.Down;

      objColumn.stopFakeSpin();
      for (let j = 0; j < 3; j++) {
        if (data[i][j].id == 1 || data[i][j].id == 2) {
          scatterState += 1;
        }
      }
      if (scatterCheck < 2) {
        objColumn.startSpin(delay + i * 4, data[i], isFree, false);
        if (scatterState > 0) {
          scatterCheck += scatterState;
        }
      } else if (scatterCheck >= 2) {
        objColumn.startSpin(
          delay + i * 4 + Math.round((delay + (i - 1) * 4) / 2),
          data[i],
          isFree,
          true
        );
      }
    }

    this.isSpinning = true;
  }

  public stopSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.stopFakeSpin();
    }
  }

  stopRotate(): void {
    const rngMod = Math.random() / 2;
    for (let i = 0; i < this.numberColumn; i++) {
      const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
      let objColumn = this.columns[i].getComponent(WukongColumn);
      setTimeout(() => {
        objColumn.readyStop();
      }, spinDelay * 1000);
    }
  }

  public letGoFreeSpin(res: WukongCmd.SlotReceiveFreeGameResult): void {
    this.columnFinish = 0;
    WukongMain.instance.idleWinSmall.active = false;
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    }

    let todayTime = new Date().toLocaleTimeString();
    let todayDate = new Date().toLocaleDateString();
    let localRes: any = res;
    localRes.date = todayDate;
    localRes.time = todayTime;
    this.profitAmount = res.amountProfit;
    this.isFree = true;
    for (let i = 0; i < 30; i++) {
      this.lineWinFxs.children[i].active = false;
    }
    WukongMain.instance.historySpin.unshift(localRes);
    WukongMain.instance.profitAmount = res.amountProfit;
    cc.log(res.amountProfit);
    WukongMain.instance.freespinTotalProfitAmount = res.totalPot;
    // WukongMain.instance.total = res.totalPot;
    this.type = 0;
    this.isSpinning = true;
    this.isGlowing = false;

    let result = res.items;
    this.results = res.results;
    this.freeSpinType = res.type;
    this.unlockAll = res.isUnlockAll;
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }
    if (res.items.length == 15) {
      for (let i = 0; i < 15; i++) {
        data[i % 5].push(result[i]);
      }
    } else if (res.items.length <= 9) {
      for (let i = 0; i < 9; i++) {
        if (i % 3 == 0) {
          data[1].push(result[i]);
        } else if (i % 3 == 1) {
          data[2].push(result[i]);
        } else if (i % 3 == 2) {
          data[3].push(result[i]);
        }
      }
      for (let j = 0; j < 3; j++) {
        data[0].push({
          id: WukongCommon.getRandomNumber(3, 9),
          oldId: -1,
          highlight: false,
        });
        data[4].push({
          id: WukongCommon.getRandomNumber(3, 9),
          oldId: -1,
          highlight: false,
        });
      }
    }
    this.resultColumn = data;
    var delay = 5;
    // var isFree = res.type == WukongCmd.ROUND_RESULT_TYPE.FREE_GAME;
    var isFree = true;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.spinDirection = Direction.Down;
      if (i == 2) {
        // if (currentRound == 1) {
        if (this.jailMoved < 1) {
          objColumn.startSpin(delay, data[i], isFree);
          this.jailMoved += 1;
          // } else if (currentRound > 1) {
        } else {
          this.stayStill = true;
          objColumn.stayStill(data[i]);
        }
      } else {
        objColumn.startSpin(delay + i * 4, data[i], isFree);
      }
    }
  }

  finishSpin() {
    if (WukongMusicManager.instance.getSystemVolume() > 0) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN);
    }
    this.columnFinish += 1;
    // cc.log("column", this.columnFinishSpinning);
    if (this.columnFinishSpinning == 5) {
      this.columnFinishSpinning = 0;
      this.isSpinning = false;
      
      this.scheduleOnce(() => {
        this.finalLetGo();
      }, 0.6);
    }
  }

  public letgoFake(): void {
    this.columnFinish = 0;
    this.scatterCount = 0;
    this.isGlowing = false;
    var delay = 2;
    WukongMain.instance.idleWinSmall.active = false;
    for (let i = 0; i < 30; i++) {
      this.lineWinFxs.children[i].active = false;
    }
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.spinDirection = Direction.Down;

      objColumn.stopFakeSpin();
      objColumn.startSpinFake(delay + i * 4);
    }
  }
  public letgoFreeSpinFake(): void {
    this.columnFinish = 0;
    this.scatterCount = 0;
    this.type = 0;
    this.isSpinning = true;
    var delay = 5;
    WukongMain.instance.idleWinSmall.active = false;
    for (let i = 0; i < 30; i++) {
      this.lineWinFxs.children[i].active = false;
    }
    var isFree = true;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.spinDirection = Direction.Down;
      if (i == 2) {
        // if (currentRound == 1) {
        if (this.jailMoved < 1) {
          objColumn.startSpinFake(delay);
          this.jailMoved += 1;
          // } else if (currentRound > 1) {
        } else {
          this.stayStill = true;
          objColumn.stayStillFake();
        }
      } else {
        objColumn.startSpin(delay + i * 4);
      }
    }
  }

  resetColumns() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.resetCells();
    }
  }

  public finalLetGo(): void {
    cc.log("FFFFFINAL", this.scatterCount, this.jackpotCount);
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(WukongColumn);
      objColumn.changeFinalCellState();
    }
    if (this.profitAmount > 0) {
      WukongMain.instance.toggleWinNode();
      if (this.isFree) {
        WukongMain.instance.bottomBtnsFreeSpinTotalWinLbl.string =
          WukongMain.instance.totalFreeSpinProfit.toString();
      }
      for (let i = 0; i < this.results.length; i++) {
        let idx = this.results[i];
        let lineName = "payline" + idx.id;
        if (idx.id >= 0 && idx.id <= 30) {
          this.lineWinFxs.getChildByName(lineName).active = true;
        }
      }
    }
    this.scheduleOnce(
      () => {
        cc.log(
          "FFFFFINALSCHEDULE",
          this.type,
          this.freeSpinType,
          this.profitAmount
        );
        WukongMain.instance.isSpinning = false
        if (this.type == 3) {
          this.scheduleOnce(() => {
            WukongMain.instance.changeBgFreeSpin();
            this.scheduleOnce(() => {
              WukongMain.instance.activateFreeSpinWindow();
              switch (Number(this.scatterCount)) {
                case 3:
                  WukongMain.instance.freeSpinNumber = 12;
                  break;
                case 4:
                  WukongMain.instance.freeSpinNumber = 15;
                  break;
                case 5:
                  WukongMain.instance.freeSpinNumber = 18;
                  break;
              }
            }, 2);
          }, 2);
        } else if (this.type == 2) {
          this.scheduleOnce(() => {
            WukongCmd.Send.sendOpenJackpot();
            // WukongMain.instance.fakeInfoJackpot();
          }, 2);
        } else if (this.freeSpinType == 1 && this.unlockAll == true) {
          cc.log("destroypillarSlotMachine");
          this.scheduleOnce(() => {
            WukongMain.instance.destroyPilar();
          }, 1);
        } else if (
          this.freeSpinType == 2 &&
          WukongMain.instance.endFreeSpin == true
        ) {
          // this.scheduleOnce(() => {
          cc.log("FREESPIN END LINE 372 SLOTMACHINE");
          // WukongMain.instance.endFreeSpin == true;
          if (
            this.results.length <= 0 ||
            this.profitAmount < WukongMain.instance.currentBetLV * 20
          ) {
            // WukongMain.instance.reactivateSpinBtn()
          }
          // }, 2);
          // } else if(this.profitAmount < WukongMain.instance.currentBetLV*20) {
        } else if (this.profitAmount <= 0) {
          cc.log("REACTIVATION");
          WukongMain.instance.reactivateSpinBtn();
        }
      },
      this.isFree == true ? 2 : 0.3
    );
    // }, 2);
  }
}
