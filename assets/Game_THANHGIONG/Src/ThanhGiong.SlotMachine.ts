const { ccclass, property } = cc._decorator;
import ThanhGiongMain from "./ThanhGiong.Controller";
import ThanhGiongColumn, { Direction } from "./ThanhGiong.Column";
import ThanhGiongSoundController, {
  SLOT_SOUND_TYPE,
} from "./ThanhGiong.SoundController";
import ThanhGiongCommon from "./ThanhGiong.Common";
import ThanhGiongNumericalHelper from "./ThanhGiong.UINumericLblHelper";

@ccclass
export default class ThanhGiongSlotMachine extends cc.Component {
  public static instance: ThanhGiongSlotMachine = null;
  @property({ type: cc.Node })
  private slotMachineNode = null;
  @property({ type: cc.SpriteFrame })
  public spCharacter: cc.SpriteFrame[] = [];
  @property({ type: cc.SpriteFrame })
  public spCharacterValue: cc.SpriteFrame[] = [];
  @property({ type: cc.Prefab })
  private _columnPrefab = null;
  @property({ type: cc.Prefab })
  get columnPrefab(): cc.Prefab {
    return this._columnPrefab;
  }
  @property({ type: cc.Node })
  private animRespinCountUp = null;
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
  public scatterCount: number = 0;

  public columnFinishSpinning: number = 0;
  public almostEndFreeSpin: boolean = false;
  public columnFinish: number = 0;

  public currentWinIndex: number = 0;
  public currentColumnIndex: number = 0;
  public longWin: boolean = false;
  public type: number = 0;
  private totalBooster: number = 0;
  private totalBoosterTemp: number = 0;
  private columns = [];
  private profitAmount: number = 0;
  private tweenWin = cc.tween();
  private resLineWins: Array<number> = [];
  private lineWins = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [0, 6, 12, 8, 4],
    [5, 11, 17, 13, 9],
    [10, 6, 2, 8, 14],
    [15, 11, 7, 13, 19],
    [0, 6, 7, 8, 4],
    [5, 11, 12, 13, 9],
    [10, 16, 17, 18, 14],
    [15, 11, 12, 13, 19],
    [10, 6, 7, 8, 14],
    [5, 1, 2, 3, 9],
    [0, 6, 2, 8, 4],
    [5, 11, 7, 13, 9],
    [10, 16, 12, 18, 14],
    [15, 11, 17, 13, 19],
    [10, 6, 12, 8, 14],
    [5, 1, 7, 3, 9],
    [0, 1, 7, 3, 4],
    [5, 6, 12, 8, 9],
    [5, 6, 2, 8, 9],
    [10, 11, 7, 13, 14],
    [15, 16, 12, 18, 19],
  ];
  private boosterValue = [
    25, 50, 75, 100, 125, 250, 375, 750, 2000, 2500, 3750, 6250, 0, 0, 0
  ];
  onLoad() {
    ThanhGiongSlotMachine.instance = this;
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
      const objColumn = newColumn.getComponent(ThanhGiongColumn);
      objColumn.createColumn();
      objColumn.columnNum = i;
      objColumn.index = i;
    }
  }

  public letGo(res): void {
    this.columnFinish = 0;
    this.longWin = false;
    this.profitAmount = res.amountProfit;
    let result = res.item;
    this.type = res.type;
    this.resLineWins = [];
    if (res.amountProfit > 0) {
      for (let i = 0; i < res.result.length; i++) {
        let tempId = this.getIdHL(res.result[i].listRowIndexCols);
        if (tempId > -1) {
          this.resLineWins.push(tempId);
        }
      }
    }
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }
    for (let i = 0; i < 20; i++) {
      let arrayWin = [];
      for (let j = 0; j < res.result.length; j++) {
        if (res.result[j].listIndex.indexOf(i) > -1) {
          let tempId = this.getIdHL(res.result[j].listRowIndexCols); //TODO: FIX listRowIndexCols
          arrayWin.push(tempId);
        }
        if (res.result[j].listIndex.length == 5) {
          this.longWin = true;
        }
      }
      result[i].arrayWin = arrayWin;
      data[i % 5].push(result[i]);
    }
    // cc.log(data);
    var delay = 5;
    var isFree = false;
    let scatterCheck = 0;
    for (let i = 0; i < this.numberColumn; i++) {
      let scatterState = 0;
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.stopFakeSpin();
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].id === 1) {
          //check scatter
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
        // this.isFree = true;
      }
    }
  }

  public letGoMini(res) {
    this.columnFinish = 0;
    if (ThanhGiongMain.instance.getEndBooster()) {
      this.totalBooster = res.totalBooster;
    }
    this.profitAmount = 0;
    this.longWin = false;
    this.type = 5;
    let result = res.item;
    this.resLineWins = [];

    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let i = 0; i < 20; i++) {
      data[i % 5].push(result[i]);
    }

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.stopFakeSpin();
      objColumn.startSpin(i * 5, data[i], false);
    }
  }

  public stopSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.stopFakeSpin();
    }
  }

  finishSpin() {
    this.columnFinishSpinning += 1;
    if (this.columnFinishSpinning < 5) {
      let objColumn =
        this.columns[this.columnFinishSpinning].getComponent(ThanhGiongColumn);

      if (!ThanhGiongMain.instance.getTurbo()) {
        objColumn.showLightFx();
      }
    }

    if (this.columnFinishSpinning === 5) {
      this.columnFinishSpinning = 0;
      ThanhGiongMain.instance.disableSkipSpin();
      switch (this.type) {
        default:
          setTimeout(() => {
            this.finalLetGo();
          }, 500);
          break;

        case 3:
          setTimeout(() => {
            this.scatterGlow();
          }, 2000);
          break;

        case 4:
          this.renderBoosterCells();
          break;

        case 5:
          this.renderBoosterCells();
          break;
      }
    }
  }

  scatterGlow() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.SCATTER_4_SEC);

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.changeCellStateScatter();
    }
    this.scheduleOnce(this.finalLetGo, 2);
  }

  boosterGlow() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.activeCellRing();
    }
    this.scheduleOnce(this.finalLetGo, 2);
  }

  public letgoFake(): void {
    this.stopIdleWin();
    this.columnFinish = 0;
    this.columnFinishSpinning = 0;
    this.scatterCount = 0;
    this.currentWinIndex = 0;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.startSpinFake();
    }
  }

  public finalLetGo(): void {
    let turbo = ThanhGiongMain.instance.getTurbo();
    let timeNormal = turbo ? 0.2 : 0.5;
    let timeProfit = turbo ? 0.6 : 0.8;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.changeFinalCellState();
    } //TODO: BACKUP
    if (this.profitAmount > 0) {
      if (ThanhGiongSoundController.instance.getSystemVolume() > 0) {
        ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.SMALL_WIN);
      }
    }
    this.scheduleOnce(
      () => {
        ThanhGiongMain.instance.isSpinning = false;
        if (this.type == 3) {
          if (this.profitAmount <= 0) {
            ThanhGiongMain.instance.activateFreeSpinWindow();
          } else {
            ThanhGiongMain.instance.toggleWinNode();
          }
        } else if (this.type == 4) {
          if (this.profitAmount <= 0) {
            ThanhGiongMain.instance.activateBoosterWindow();
          } else {
            ThanhGiongMain.instance.toggleWinNode();
          }
        } else {
          if (this.profitAmount > 0) {
            ThanhGiongMain.instance.toggleWinNode();
          } else {
            ThanhGiongMain.instance.reactivateSpinBtn();
          }
        }
      },
      this.profitAmount > 0 ? timeProfit : timeNormal
    );
  }

  stopColumnSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.stopSpin();
    }
  }

  stopTestSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.stopSpinDisconnect();
    }
  }

  toggleCellWinEffects() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.toggleCellWinEffect();
    }
  }

  stopIdleWin() {
    this.tweenWin.stop();
    cc.Tween.stopAllByTarget(this.tweenWin);
    cc.Tween.stopAllByTag(1);
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.resetCells();
    }
  }

  private renderBoosterCells() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
      objColumn.generateWildSpecial();
    }
    this.scheduleOnce(this.finalLetGo, 2);
  }

  private getIdHL(array) {
    let id = -1;
    for (let i = 0; i < this.lineWins.length; i++) {
      if (ThanhGiongCommon.compareArrays(array, this.lineWins[i])) {
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
    let arrayWin = this.resLineWins;
    var limit = arrayWin.length;
    if (!ThanhGiongMain.instance.getTurbo()) {
      if (!ThanhGiongMain.instance.getAuto()) {
        ThanhGiongMain.instance.reactivateSpinBtn();
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
                  let objColumn =
                    this.columns[i].getComponent(ThanhGiongColumn);
                  objColumn.changeCellIdleWin();
                }
                this.currentWinIndex += 1;
              })
              .delay(1.65)
          )
          .start();
      } else {
        ThanhGiongMain.instance.activeSkipIdleWin();
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
                  let objColumn =
                    this.columns[i].getComponent(ThanhGiongColumn);
                  objColumn.changeCellIdleWin();
                }
                this.currentWinIndex += 1;
              })
              .delay(1.65)
          )
          .then(
            cc.tween(this).call(() => {
              ThanhGiongMain.instance.reactivateSpinBtn();
            })
          )
          .start();
      }
    } else {
      ThanhGiongMain.instance.reactivateSpinBtn();
    }
  }

  boosterPayout() {
    // var limit = this.numberColumn;
    // let temp: number = 0;
    // for (let i = 0; i < limit; i++) {
    //   let objColumn = this.columns[i].getComponent(ThanhGiongColumn);
    //   temp += objColumn.getBoosterContainerLength();
    // }
    // let totalTime = temp * 0.5;
    // ThanhGiongNumericalHelper.scheduleForLabel(
    //   ThanhGiongMain.instance.boosterTotalWinLbl,
    //   this.totalBooster,
    //   totalTime
    // );
    this.currentColumnIndex = 0;
    this.columns[this.currentColumnIndex]
      .getComponent(ThanhGiongColumn)
      .deactivateRings();
  }

  countUpBooster() {
    this.currentColumnIndex += 1;
    if (this.currentColumnIndex == this.numberColumn) {
      this.animRespinCountUp.active = false;
      this.totalBoosterTemp = 0;
      this.scheduleOnce(
        () => ThanhGiongMain.instance.activateBoosterSummary(),
        1.5
      );
    } else {
      let objColumn =
        this.columns[this.currentColumnIndex].getComponent(ThanhGiongColumn);
      objColumn.deactivateRings();
    }
  }

  playAnimCountUp(index, columnNum, boosterId) {
    let animationName = index + 4 * columnNum;
    this.totalBoosterTemp += this.boosterValue[boosterId];
    ThanhGiongNumericalHelper.scheduleForLabel(
      ThanhGiongMain.instance.boosterTotalWinLbl,
      this.totalBoosterTemp,
      0.35
    );
    this.animRespinCountUp.active = true;
    this.animRespinCountUp.getComponent(sp.Skeleton).animation =
      animationName.toString();
  }
}
