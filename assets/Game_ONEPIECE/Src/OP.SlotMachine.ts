const { ccclass, property } = cc._decorator;
import OPController from "./OP.Controller";
import OPColumn, { Direction } from "./OP.Column";
import OPSoundController, { SLOT_SOUND_TYPE } from "./OP.SoundController";
import OPCommon from "./OP.Common";

@ccclass
export default class OPSlotMachine extends cc.Component {
  public static instance: OPSlotMachine = null;
  @property({ type: cc.Node })
  private slotMachineNode = null;
  @property({ type: sp.SkeletonData })
  public spCharacter: sp.SkeletonData[] = [];
  @property({ type: cc.Prefab })
  private _columnPrefab = null;
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
  private _numberColumn = 5;

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

  public results = [];
  private isFree: boolean = false;
  public scatterCount: number = 0;

  public columnFinishSpinning: number = 0;
  public isGlowing: boolean = false;
  public almostEndFreeSpin: boolean = false;
  public columnFinish: number = 0;

  public currentWinIndex: number = 0;
  public longWin: boolean = false;
  public type: number = 0;
  public powerSpinColumn = [2];
  private resLineWins: Array<number> = [];
  private columns = [];
  private profitAmount: number = 0;
  private resultColumn;
  private tweenWin = cc.tween();
  private lineWins = [
    [0, 1, 2, 3, 4],
    [15, 16, 17, 18, 19],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [0, 6, 12, 8, 4],
    [15, 11, 7, 13, 19],
    [10, 6, 2, 8, 14],
    [5, 11, 17, 13, 9],
    [0, 6, 2, 8, 4],
    [15, 11, 17, 13, 19],
    [5, 1, 7, 3, 9],
    [10, 16, 12, 18, 14],
    [5, 11, 7, 13, 9],
    [10, 6, 12, 8, 14],
    [0, 6, 7, 8, 4],
    [15, 11, 12, 13, 19],
    [5, 1, 2, 3, 9],
    [10, 16, 17, 18, 14],
    [5, 11, 12, 13, 9],
    [10, 6, 7, 8, 14],
    [0, 1, 7, 3, 4],
    [15, 16, 12, 18, 19],
    [5, 6, 2, 8, 9],
    [10, 11, 17, 13, 14],
    [5, 6, 12, 8, 9],
    [10, 11, 7, 13, 14],
    [0, 1, 12, 3, 4],
    [15, 16, 7, 18, 19],
    [10, 11, 2, 13, 14],
    [5, 6, 17, 8, 9],
    [0, 11, 12, 13, 4],
    [15, 6, 7, 8, 19],
    [10, 1, 2, 3, 14],
    [5, 16, 17, 18, 9],
    [5, 1, 12, 3, 9],
    [10, 17, 7, 18, 14],
    [5, 11, 2, 13, 9],
    [10, 6, 17, 8, 14],
    [0, 11, 2, 13, 4],
    [15, 6, 17, 8, 19],
    [10, 1, 12, 3, 14],
    [5, 16, 7, 18, 9],
    [0, 11, 7, 13, 4],
    [15, 6, 12, 8, 19],
    [10, 1, 7, 3, 14],
    [5, 16, 12, 18, 9],
    [0, 16, 2, 18, 4],
    [15, 1, 17, 3, 19],
    [0, 1, 17, 3, 4],
    [15, 16, 2, 18, 19],
  ];

  onLoad() {
    OPSlotMachine.instance = this;
    this.createMachine();
  }

  // protected onEnable(): void {
  //   this.createMachine();
  // }

  public createMachine(): void {
    this.slotMachineNode.removeAllChildren();
    this.columns = [];
    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      this.columns[i] = newColumn;
      this.slotMachineNode.addChild(newColumn);
      const objColumn = newColumn.getComponent(OPColumn);
      objColumn.createColumn();
      objColumn.columnNum = i;
      objColumn.index = i;
    }
  }

  public letGo(res): void {
    this.columnFinish = 0;
    this.longWin = false;
    this.profitAmount = res.amountProfit;
    this.isFree = false;
    let result = res.item;
    this.type = res.type;
    this.isGlowing = false;
    this.resLineWins = [];
    cc.log(res.result, res.result.length)
    if (res.amountProfit > 0) {
      for (let i = 0; i < res.result.length; i++) {
        let tempId = res.result[i].lineWin;
        if (tempId > -1) {
          this.resLineWins.push(tempId);
        }
      }
    }
    // cc.log(this.resLineWins, this.resLineWins.length)
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }
    for (let i = 0; i < 20; i++) {
      let arrayWin = [];
      for (let j = 0; j < this.resLineWins.length; j++) {
        if (this.lineWins[this.resLineWins[j]].indexOf(i) > -1) {
          let tempId = res.result[j].lineWin; //TODO: FIX listRowIndexCols
          arrayWin.push(tempId);
        }
      }
      result[i].arrayWin = arrayWin;
      data[i % 5].push(result[i]);
    }

    this.resultColumn = data;
    var delay = 5;
    let scatterCheck = 0;
    for (let i = 0; i < this.numberColumn; i++) {
      // cc.log(`Column ${i} :`, data[i]);
      let scatterState = 0;
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.stopFakeSpin();
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].id === 1) {
          scatterState += 1;
        }
      }
      if (scatterCheck < 2) {
        objColumn.startSpin(delay + i * 4, data[i], false);
        if (scatterState > 0) {
          scatterCheck += scatterState;
        }
      } else if (scatterCheck >= 2) {
        objColumn.startSpin(
          delay + i * 4 + Math.round((delay + (i - 1) * 4) / 2),
          data[i],
          true
        );
        if (scatterState > 0) {
          scatterCheck += scatterState;
        }
      }
      if (scatterCheck >= 3) {
        this.isFree = true;
      }
    }
  }

  public stopSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.stopFakeSpin();
    }
  }

  finishSpin() {
    this.columnFinishSpinning += 1;
    if (this.columnFinishSpinning < 5) {
      let objColumn =
        this.columns[this.columnFinishSpinning].getComponent(OPColumn);
      objColumn.showLightFx();
    }
    if (this.columnFinishSpinning === 5) {
      // cc.log(`finishSpin, ${this.isFree, OPController.instance.getFreespinState()}`)
      this.columnFinishSpinning = 0;
      OPController.instance.disableSkipSpin();
      switch (this.isFree) {
        case false:
          switch (OPController.instance.getFreespinState()) {
            case false:
              setTimeout(() => {
                this.finalLetGo();
              }, 100);
              break;
            case true:
              setTimeout(() => {
                this.moveWildCell();
              }, 500);
              break;
          }

          break;
        case true:
          this.scatterGlow();
          break;
      }
    }
  }

  scatterGlow() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.SCATTER_4_SEC);
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.changeCellStateScatter();
    }
    this.scheduleOnce(this.finalLetGo, 2);
  }

  public letgoFake(): void {
    this.stopIdleWin();
    this.columnFinish = 0;
    this.columnFinishSpinning = 0;
    this.scatterCount = 0;
    this.isGlowing = false;
    this.currentWinIndex = 0;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.startSpinFake();
      if (OPController.instance.freeSpin) {
        objColumn.willGlow = true;
      }
    }
  }

  resetColumns() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.resetCells();
    }
  }

  public finalLetGo(): void {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.changeFinalCellState();
    }
    if (this.profitAmount > 0) {
      if (OPSoundController.instance.getSystemVolume() > 0) {
        OPSoundController.instance.playType(SLOT_SOUND_TYPE.SMALL_WIN);
      }
    }
    this.scheduleOnce(
      () => {
        OPController.instance.isSpinning = false;
        if (this.type == 3 && this.isFree == true) {
          OPController.instance.toggleWinNode();
          if (this.profitAmount <= 0) {
            OPController.instance.activateFreeSpinWindow();
          }
        } else {
          if (this.profitAmount > 0) {
            OPController.instance.toggleWinNode();
          } else if (this.profitAmount == 0) {
            OPController.instance.reactivateSpinBtn();
          }
        }
      },
      this.profitAmount > 0 ? 1.5 : 0.5
    );
  }

  stopColumnSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.stopSpin();
    }
  }
  
  stopTestSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.stopSpinDisconnect();
    }
  }

  toggleCellWinEffects() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.toggleCellWinEffect();
    }
  }

  // fireScatterCell() {
  //   for (let i = 0; i < this.numberColumn; i++) {
  //     let objColumn = this.columns[i].getComponent(OPColumn);
  //     objColumn.fireCell();
  //   }
  // }

  moveWildCell() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.moveWildColumn();
    }
    this.scheduleOnce(this.finalLetGo, 1);
  }

  getThisNode() {
    return this.node;
  }

  stopIdleWin() {
    this.tweenWin.stop();
    cc.Tween.stopAllByTarget(this.tweenWin);
    cc.Tween.stopAllByTag(1);
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(OPColumn);
      objColumn.resetCells();
    }
  }

  private getIdHL(array) {
    let id = -1;
    for (let i = 0; i < this.lineWins.length; i++) {
      if (OPCommon.compareArrays(array, this.lineWins[i])) {
        id = i;
        break;
      }
    }
    return id;
  }

  getLineWins() {
    return this.resLineWins;
  }

  setColumnsIdleWin() {
    // TODO: SET IDLE WIN;
    this.toggleCellWinEffects(); //TODO: REMOVE AFTER HAVING IDLE WIN

    let arrayWin = this.resLineWins;
    var limit = arrayWin.length;
    if (OPController.instance.autoState == false) {
      OPController.instance.reactivateSpinBtn();
      this.tweenWin = cc
        .tween(this)
        .tag(1)
        .repeatForever(
          cc
            .tween(this)
            .call(() => {
              if (this.currentWinIndex >= limit) {
                this.currentWinIndex = 0;
              }
              for (let i = 0; i < this.numberColumn; i++) {
                let objColumn = this.columns[i].getComponent(OPColumn);
                objColumn.changeCellIdleWin();
              }
              this.currentWinIndex += 1;
            })
            .delay(2.1)
        )
        .start();
    } else {
      this.tweenWin = cc
        .tween(this)
        .tag(1)
        .repeat(
          limit,
          cc
            .tween(this)
            .call(() => {
              if (this.currentWinIndex >= limit) {
                this.currentWinIndex = 0;
              }
              for (let i = 0; i < this.numberColumn; i++) {
                let objColumn = this.columns[i].getComponent(OPColumn);
                objColumn.changeCellIdleWin();
              }
              this.currentWinIndex += 1;
            })
            .delay(2.1)
        )
        .then(
          cc.tween(this).call(() => {
            OPController.instance.reactivateSpinBtn();
          })
        )
        .start();
    }
  }
}
