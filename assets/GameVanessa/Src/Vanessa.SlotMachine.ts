const { ccclass, property } = cc._decorator;
import VanessaMain from "./Vanessa.Controller";
import VanessaColumn, { Direction } from "./Vanessa.Column";
import VanessaSoundController, {
  SLOT_SOUND_TYPE,
} from "./Vanessa.SoundController";

@ccclass
export default class VanessaSlotMachine extends cc.Component {
  public static instance: VanessaSlotMachine = null;
  @property({ type: cc.Node })
  private slotMachineNode = null;
  @property({ type: dragonBones.DragonBonesAtlasAsset })
  public spAtlasCharacter: dragonBones.DragonBonesAtlasAsset[] = [];
  @property({ type: dragonBones.DragonBonesAsset })
  public spAtlasCharacterAsset: dragonBones.DragonBonesAsset[] = [];
  @property({ type: cc.Prefab })
  private _columnPrefab = null;
  @property({ type: cc.Prefab })
  get columnPrefab(): cc.Prefab {
    return this._columnPrefab;
  }

  set columnPrefab(newPrefab: cc.Prefab) {
    this._columnPrefab = newPrefab;
    // this.node.removeAllChildren();

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

  private columns = [];
  private profitAmount: number = 0;
  private isSpinning: boolean = false;
  private resultColumn;
  private tweenWin = cc.tween();

  onLoad() {
    VanessaSlotMachine.instance = this;
  }

  protected onEnable(): void {
    this.createMachine();
  }

  public createMachine(): void {
    this.slotMachineNode.removeAllChildren();
    this.columns = [];
    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      this.columns[i] = newColumn;
      this.slotMachineNode.addChild(newColumn);
    }

    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = this.columns[i];
      const objColumn = newColumn.getComponent(VanessaColumn);
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
    if (!VanessaMain.instance.featureWillAppear) {
      this.type = res.type;
    }
    this.isGlowing = false;
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }
    for (let i = 0; i < 15; i++) {
      data[i % 5].push(result[i]);
    }

    this.resultColumn = data;
    var delay = 5;
    var isFree = false;
    let scatterCheck = 0;
    this.isSpinning = true;
    for (let i = 0; i < this.numberColumn; i++) {
      let scatterState = 0;
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.stopFakeSpin();

      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].id === 3) {
          //check scatter
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
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.stopFakeSpin();
    }
  }

  finishSpin() {
    this.columnFinishSpinning += 1;
    if (this.columnFinishSpinning < 5) {
      let objColumn =
        this.columns[this.columnFinishSpinning].getComponent(VanessaColumn);
      objColumn.showLightFx();
    }

    if (this.columnFinishSpinning === 5) {
      this.columnFinishSpinning = 0;
      this.isSpinning = false;
      VanessaMain.instance.disableSkipSpin()
      switch (VanessaMain.instance.getFreeSpin()) {
        case false:
          if (this.isFree == false) {
            setTimeout(() => {
              this.finalLetGo();
            }, 100);
          } else {
            this.scatterGlow();
          }
          break;
        case true:
          setTimeout(() => {
            this.attackFreeModel();
          }, 100);
          break;
      }
    }
  }

  attackFreeModel() {
    let objColumn = this.columns[2].getComponent(VanessaColumn);
    objColumn.changeCellAttackState();
    setTimeout(() => {
      this.finalLetGo();
    }, 2200);
  }

  scatterGlow() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.SCATTER_4_SEC);

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
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
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.reduceColumnMask()
      objColumn.spinDirection = Direction.Down;
      objColumn.startSpinFake();
      if (VanessaMain.instance.getFreeSpin()) {
        objColumn.willGlow = true;
        if (VanessaMain.instance.featureWillAppear) {
          if (
            this.powerSpinColumn.indexOf(
              objColumn.columnNum
            ) > -1
          ) {
            objColumn.showLightFx();
          }
        } else {
          if (objColumn.columnNum == 2) {
            objColumn.showLightFx();
          }
        }
      }
    }
  }

  resetColumns() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.resetCells();
    }
  }

  public finalLetGo(): void {
    let turbo = VanessaMain.instance.getTurbo()
    let timeNormal = 0.5;
    let timeProfit = turbo ? 1.0 : 1.5;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.changeFinalCellState();
    }
    if (this.profitAmount > 0) {
      if (VanessaSoundController.instance.getSystemVolume() > 0) {
        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.SMALL_WIN);
      }
    }
    this.scheduleOnce(
      () => {
        VanessaMain.instance.isSpinning = false;
        if (this.type == 3 && this.isFree == true) {
          VanessaMain.instance.toggleWinNode();
          if (this.profitAmount <= 0) {
            VanessaMain.instance.activateFreeSpinWindow();
          }
        } else {
          if (this.profitAmount > 0) {
            VanessaMain.instance.toggleWinNode();
          } else if (this.profitAmount == 0) {
            VanessaMain.instance.reactivateSpinBtn();
          }
        }
      },
      this.profitAmount > 0 ? timeProfit : timeNormal
    );
  }

  stopColumnSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.stopSpin();
    }
  }
  
  stopTestSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.stopSpinDisconnect();
    }
  }

  toggleCellWinEffects() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.toggleCellWinEffect();
    }
  }

  stopIdleWin() {
    this.tweenWin.stop();
    cc.Tween.stopAllByTarget(this.tweenWin);
    cc.Tween.stopAllByTag(1);
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(VanessaColumn);
      objColumn.resetCells();
    }
  }

  setColumnsIdleWin() {
    // TODO: SET IDLE WIN;
    this.toggleCellWinEffects(); //TODO: REMOVE AFTER HAVING IDLE WIN
    // let arrayWin = this.arrayWinIndex;
    // var limit = arrayWin.length;
    // if (VanessaMain.instance.autoState == false) {
    //   VanessaMain.instance.reactivateSpinBtn();
    //   this.tweenWin = cc
    //     .tween(this)
    //     .tag(1)
    //     .repeatForever(
    //       cc
    //         .tween(this)
    //         .call(() => {
    //           if (this.currentWinIndex >= limit) {
    //             this.currentWinIndex = 0;
    //           }
    //           for (let i = 0; i < this.numberColumn; i++) {
    //             let objColumn = this.columns[i].getComponent(VanessaColumn);
    //             objColumn.changeCellIdleWin();
    //           }
    //           this.currentWinIndex += 1;
    //         })
    //         .delay(2.1)
    //     )
    //     .start();
    // } else {
    //   this.tweenWin = cc
    //     .tween(this)
    //     .tag(1)
    //     .repeat(
    //       limit,
    //       cc
    //         .tween(this)
    //         .call(() => {
    //           if (this.currentWinIndex >= limit) {
    //             this.currentWinIndex = 0;
    //           }
    //           for (let i = 0; i < this.numberColumn; i++) {
    //             let objColumn = this.columns[i].getComponent(VanessaColumn);
    //             objColumn.changeCellIdleWin();
    //           }
    //           this.currentWinIndex += 1;
    //         })
    //         .delay(2.1)
    //     )
    //     .then(
    //       cc.tween(this).call(() => {
    //         VanessaMain.instance.reactivateSpinBtn();
    //       })
    //     )
    //     .start();
    // }
  }
}
