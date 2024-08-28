const { ccclass, property } = cc._decorator;

import GenZMain from "./GZ.Controller";
import GenZColumn, { Direction } from "./GZ.Column";
import GenZMusicManager, { SLOT_SOUND_TYPE } from "./GZ.MusicCtrller";

@ccclass
export default class GenZSlotMachine extends cc.Component {
  public static instance: GenZSlotMachine = null;
  @property({ type: cc.Node })
  public slotMachineNode = null;

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

  @property({ type: cc.Integer, range: [1, 7], slide: true })
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
  private spinData = {};
  public isFree: boolean = false;
  public delayDrop: boolean = false;
  public isClicked: boolean = false;
  public scatterCount: number = 0;
  private profitAmount: number = 0; //1000000
  public columnFinishSpinning: number = 0;
  public isGlowing: boolean = false;
  private resultColumn;
  onLoad() {
    GenZSlotMachine.instance = this;
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
      const objColumn = newColumn.getComponent(GenZColumn);
      objColumn.createColumn();
      objColumn.columnNum = i;
      objColumn.index = i;
    }
  }

  // public letGo(res: GenZCmd.SlotReceiveRoundResult): void {
  public letGo(res): void {
    let todayTime = new Date().toLocaleTimeString();
    let todayDate = new Date().toLocaleDateString();
    let localRes: any = res;
    localRes.date = todayDate;
    localRes.time = todayTime;
    this.profitAmount = res.amountProfit;
    let result = res.items;
    this.isGlowing = false;
    GenZMain.instance.profitAmount = res.amountProfit;
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }

    for (let i = 0; i < 49; i++) {
      let temp: any = result[i];
      if (res.mark.indexOf(i) >= 0) {
        temp.win = true;
      }
      data[i % 7].push(result[i]);
    }

    this.spinData = data;
    this.results = res.mark;

    // this.letgoReal();
    this.scheduleOnce(
      () => this.letgoReal(),
      GenZMain.instance.freeSpin ? 1 : 0.2
    );
  }

  public stopSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.stopFakeSpin();
    }
  }

  // stopRotate(): void {
  //   const rngMod = Math.random() / 2;
  //   for (let i = 0; i < this.numberColumn; i++) {
  //     const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
  //     let objColumn = this.columns[i].getComponent(GenZColumn);
  //     setTimeout(() => {
  //       objColumn.readyStop();
  //     }, spinDelay * 1000);
  //   }
  // }

  finishSpin() {
    // this.columnFinish += 1;
    // if (this.columnFinishSpinning === 7) {
    this.columnFinishSpinning = 0;
    setTimeout(
      () => {
        this.finalLetGo();
      },
      GenZMain.instance.turboState ? 100 : 1100
    );
    // }
  }

  public letgoFake(): void {
    this.scatterCount = 0;
    this.isGlowing = false;
    this.spinData = {};
    // var delay = 2;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.startSpinFake();
    }
  }

  public letgoReal(): void {
    let scatterCheck = 0;
    this.delayDrop = false;
    for (let i = 0; i < this.numberColumn; i++) {
      let scatterState = 0;
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.spinDirection = Direction.Down;
      // objColumn.stopFakeSpin();
      for (let j = 0; j < 7; j++) {
        if (this.spinData[i][j].id == 0) {
          scatterState += 1;
        }
        if (this.spinData[i][j].id == 1 || this.spinData[i][j].id == 2) {
          this.spinData[i][j].wild = true;
        }
        if (this.spinData[i][j].highlight == true) {
          let extraCells = [];
          let extraCellNum: number = 0;
          for (let index = j - 1; index > -1; index--) {
            if (
              this.spinData[i][index].highlight == true ||
              this.spinData[i][index].id == -1
            ) {
              this.spinData[i][j].extraCellNum = extraCellNum;
              if (this.spinData[i][index].highlight == true) {
                for (let index2 = index; index2 > -1; index2--) {
                  this.spinData[i][index2].jumpStep = extraCells.length;
                }
              }
              break;
            } else if (
              this.spinData[i][index].highlight == false &&
              this.spinData[i][index].id != -1
            ) {
              if (extraCells.length >= 4) {
                //TODO: ADD JUMPSTEP TO CELLS ABOVE IF EXTRACELL'S LENGTH OVER 4
                this.spinData[i][j].extraCellNum = extraCellNum;
                for (let index3 = index; index3 > -1; index3--) {
                  this.spinData[i][index3].jumpStep = extraCells.length;
                }
                break;
              } else {
                this.spinData[i][index].updatePos = j;
                extraCells.push(this.spinData[i][index]);
                extraCellNum += 1;
                this.spinData[i][index].lightColumnIndex = extraCellNum;
              }
            }
            this.spinData[i][j].extraCellNum = extraCellNum;
          }
        } else if (this.spinData[i][j].highlight == false) {
          this.spinData[i][j].extraCellNum = 0;
        }
      }

      if (
        GenZMain.instance.freeSpinWindowHasActivated == false &&
        scatterCheck >= 2 &&
        i == 6
      ) {
        objColumn.startSpinReal(this.spinData[i], true);
        this.delayDrop = true;
      } else {
        objColumn.startSpinReal(this.spinData[i]);
        if (scatterState > 0) {
          scatterCheck += scatterState;
        }
      }
    }
  }

  resetColumns() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.resetCells();
    }
  }

  resetColumnFree() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.resetFree();
    }
  }

  testRearrange(){
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.rearrangeCells();
    }
  }

  public finalLetGo(): void {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(GenZColumn);
      objColumn.changeFinalCellState();
    }
    this.scheduleOnce(
      () => {
        GenZMain.instance.stopShakeScreen();
        if (GenZMain.instance.turboState) {
          for (let i = 0; i < this.numberColumn; i++) {
            let objColumn = this.columns[i].getComponent(GenZColumn);
            objColumn.rearrangeCells();
          }
        }
        if (this.profitAmount > 0) {
          GenZMain.instance.toggleWinNode();
          for (let i = 0; i < this.numberColumn; i++) {
            let objColumn = this.columns[i].getComponent(GenZColumn);
            objColumn.changeCellsWinState();
          }
          if (this.isFree) {
            GenZMain.instance.bottomBtnsFreeSpinTotalWinLbl.string =
              GenZMain.instance.totalFreeSpinProfit.toString();
          }
        }
        this.scheduleOnce(
          () => {
            GenZMain.instance.isSpinning = false;
            if (
              GenZMain.instance.freeSpin == true &&
              GenZMain.instance.freeSpinWindowHasActivated == false &&
              this.delayDrop == true
            ) {
              // this.scheduleOnce(GenZMain.instance.activateFreeSpinWindow, 2)
              GenZMain.instance.activateFreeSpinWindow();
            } else {
              if (this.profitAmount <= 0) {
                // if (
                //   this.isFree == true &&
                //   GenZMain.instance.freeSpinWindowHasActivated == false
                // ) {
                // } else {
                GenZMain.instance.reactivateSpinBtn();
                // }
              }
            }
          },
          // this.isFree == true ? 7 : 1
          GenZMain.instance.turboState ? 0.4 : 0.8
        );
      },
      this.delayDrop ? 2 : GenZMain.instance.turboState ? 0.3 : 0.8
    );
  }
}
