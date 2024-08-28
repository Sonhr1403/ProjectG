const { ccclass, property } = cc._decorator;
import Slot50Column, { Direction } from "./Slot50.Column";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50Controller from "./Slot50.Controller";
import Slot50BgPumpkin from "./Slot50.BgPumpkin";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";
import Slot50Cell from "./Slot50.Cell";

@ccclass
export default class Slot50Machine extends cc.Component {
  public static instance: Slot50Machine = null;

  @property({ type: cc.SpriteAtlas })
  public spAtlasCharacter: cc.SpriteAtlas = null;

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
  public _numberColumn = 5;

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
  private result = { 0: [], 1: [], 2: [], 3: [], 4: [] };
  public oldResult = { 0: [], 1: [], 2: [], 3: [], 4: [] };

  onLoad() {
    Slot50Machine.instance = this;
    this.createMachine();
  }

  start() {
    // TODO
  }

  public createMachine(): void {
    this.node.removeAllChildren();
    this.columns = [];
    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      this.columns[i] = newColumn;
      this.node.addChild(newColumn);
      const objColumn = newColumn.getComponent(Slot50Column);
      objColumn.enableMask(true);
      objColumn.createColumn(this.oldResult[i])
      objColumn.index = i;
    }
  }

  public theColumn2Scatter: number = 5; // Cột thứ bao nhiêu xuất hiện scatter
  public listColumnScatter: Array<number> = []; // Danh sách cột có chứa scatter
  public listWild: Array<number> = []; // Danh sách ô của cột 5 có chứa wild
  public typeFreeGame: number = 0;
  public listHighLight: Array<Slot50Cmd.ImpItemCell> = []; /// Danh sách các ô là highlight

  public readonly listSortMatrix = [[0, 5, 10], [1, 6, 11], [2, 7, 12], [3, 8, 13], [4, 9, 14]];

  // Khởi động
  public startUp(data: Array<Slot50Cmd.ImpItemCell>, isSpin: boolean = false) {
    console.log("============== 1",  new Date().toLocaleString(), new Date().getMilliseconds());
    for (let i = 0; i < 5; i++) {
      this.oldResult[i] = [];
      for (let j = 0; j < 3; j++) {
        this.oldResult[i][j] = data[this.listSortMatrix[i][j]];
      }
    }
    this.createMachine();
    if(isSpin) {
      let timerDelayColumn = 0.15;
      for (let i = 0; i < this.numberColumn; i++) {
        let objColumn = this.columns[i].getComponent(Slot50Column);
        objColumn.spinDirection = Direction.Down;
        objColumn.spinVirtual(timerDelayColumn * i);
      }
    }
  }

  public forceStop(data: Array<Slot50Cmd.ImpItemCell>) {
    this.createMachine();
  }

  public letGo(data: Array<Slot50Cmd.ImpItemCell>, typeFree: number = 0): void {
    console.log("============== 2",  new Date().toLocaleString(), new Date().getMilliseconds());
    Slot50Controller.instance.localNumberOfSpins++;
    Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_SPIN);
    this.result = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    /// Tính toán Wild
    this.typeFreeGame = typeFree;
    this.theColumn2Scatter = 5;
    this.listWild = [];
    this.listColumnScatter = [];
    this.listHighLight = data.filter((item) => {
      return item.highlight;
    });
    ////////////////////////
    let count = 0;
    for (let inx of this.listSortMatrix[4]) {
      let itemXCell = data[inx];
      if (itemXCell.id === Slot50Cmd.DEFINE_CHARACTOR.WILD) {
        this.listWild.push(count);
      }
      count++;
    }

    let newData = data.map((item) => {
      item.isChange = (this.listWild.length > 0) && (item.id == Slot50Cmd.DEFINE_CHARACTOR.RED_SATAN) && (item.id == Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN) && (item.id == Slot50Cmd.DEFINE_CHARACTOR.GREEN_SATAN);
      return item
    });

    let setScatter: Set<number> = new Set();
    for (let i = 0; i < 15; i++) {
      this.result[i % 5].push(newData[i]);
      if (newData[i].id == Slot50Cmd.DEFINE_CHARACTOR.SCATTER) {
        setScatter.add(i % 5);
      }
    }
    this.listColumnScatter = Array.from(setScatter);
    this.theColumn2Scatter = (this.listColumnScatter[1]) ? this.listColumnScatter.sort((a, b) => a - b)[1] : 5;
    let dataRotate: Array<Slot50Cmd.ImpColumn> = [
      { list: this.result[0], itemFrame: { column: 0, listWild: this.listWild, speedUp: (0 - this.theColumn2Scatter), totalScratter: this.listColumnScatter.length, typeFree: this.typeFreeGame } },
      { list: this.result[1], itemFrame: { column: 1, listWild: this.listWild, speedUp: (1 - this.theColumn2Scatter), totalScratter: this.listColumnScatter.length, typeFree: this.typeFreeGame } },
      { list: this.result[2], itemFrame: { column: 2, listWild: this.listWild, speedUp: (2 - this.theColumn2Scatter), totalScratter: this.listColumnScatter.length, typeFree: this.typeFreeGame } },
      { list: this.result[3], itemFrame: { column: 3, listWild: this.listWild, speedUp: (3 - this.theColumn2Scatter), totalScratter: this.listColumnScatter.length, typeFree: this.typeFreeGame } },
      { list: this.result[4], itemFrame: { column: 4, listWild: this.listWild, speedUp: (4 - this.theColumn2Scatter), totalScratter: this.listColumnScatter.length, typeFree: this.typeFreeGame } }
    ];

    for (let i = 0; i < this.numberColumn; i++) {
      const dataColumn = dataRotate[i];
      let objColumn = this.columns[i].getComponent(Slot50Column);
      objColumn.spinDirection = Direction.Down;
      objColumn.pushData(dataRotate[i], i);
      //// Nếu có scatter thì tạo hiệu ứng lửa cháy
      if (dataColumn.itemFrame.speedUp >= 1) {
        this.scheduleOnce(() => {
          if (Slot50Controller.instance.isInRotation) {
            objColumn.runAnimSpeedUp(true);
          }
        }, 1.35);
      }
    }
    this.oldResult = { ...this.result };
  }

  public handleAfterStopRotate(): void {
    /// Khởi tạo
    let timerStart = 0;
    const timerAddPumpkin = 1;
    const timerRunPumpkin = 3;
    // Ném scatter vào bí ngô sau 1 giây và mất 2 giây
    if (this.listColumnScatter.length > 0) {
      this.scheduleOnce(() => {
        Slot50BgPumpkin.instance.setAnimReward();
        this.scheduleOnce(() => {
          Slot50BgPumpkin.instance.setAnimIdle();
        }, 3);
        if (!Slot50Controller.instance.isInRotation) {
          this.throwToPumpkin();
        }
      }, timerStart + timerAddPumpkin);
      timerStart += timerRunPumpkin;
    }

    const timerAdd3Scatter = 0;
    const timerRun3Scatter = 3;
    // Nếu có 3 Scatter thì hiển thị trong 2 giây
    if (this.listColumnScatter.length >= 3) {
      this.scheduleOnce(() => {
        if (!Slot50Controller.instance.isInRotation) {
          this.effect3Scatter();
        }
      }, timerStart + timerAdd3Scatter);
      timerStart += timerRun3Scatter;
    }

    const timerAddWild = 0;
    const timerRunWild = 3;
    // Sói nhảy lên bắn đạn trong 3 giây
    if (this.listWild.length > 0) {
      this.scheduleOnce(() => {
        if (!Slot50Controller.instance.isInRotation) {
          this.effectShowWildAndChangeSatan();
        }
      }, timerStart + timerAddWild);
      timerStart += timerRunWild;
    }

    // Hight các ô hightlight
    const timerAddHight = 1;
    const timerRunHight = 3;
    if (this.listHighLight.length > 0) {
      this.scheduleOnce(() => {
        if (!Slot50Controller.instance.isInRotation) {
          this.effectHighlightCell();
        }
      }, timerStart + timerAddHight);
      timerStart += timerRunHight;
    }

    // Tính toán trả thưởng
    this.scheduleOnce(() => {
      if (!Slot50Controller.instance.isInRotation) {
        Slot50Controller.instance.reward();
      }
    }, timerStart);
  }

  private effectShowWildAndChangeSatan() {
    let objColumn5 = this.columns[4].getComponent(Slot50Column);
    for (let inx = 0; inx < 5; inx++) {
      let nCell = objColumn5.cells[inx];
      let objCell = nCell.getComponent(Slot50Cell);
      if (objCell.itemCell) {
        objCell.setSkeletonWildJumping();
      }
    }
    this.scheduleOnce(() => {
      for (let i = 0; i < this.numberColumn; i++) {
        let objColumn = this.columns[i].getComponent(Slot50Column);
        for (let j = 0; j < 5; j++) {
          let nCell = objColumn.cells[j];
          let objCell = nCell.getComponent(Slot50Cell);
          if (objCell.itemCell) {
            objCell.shootSata();
          }
        }
      }
    }, 1.5);
  }

  // Ném bí ngô
  private throwToPumpkin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(Slot50Column);
      for (let j = 0; j < 5; j++) {
        let nCell = objColumn.cells[j];
        let objCell = nCell.getComponent(Slot50Cell);
        if (objCell.itemCell) {
          objCell.throwCoinToPumpkin();
        }
      }
    }
  }

  // Highlight 3 scatter
  private effect3Scatter() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(Slot50Column);
      for (let j = 0; j < 5; j++) {
        let nCell = objColumn.cells[j];
        let objCell = nCell.getComponent(Slot50Cell);
        if (objCell.itemCell) {
          objCell.setSkeleton3Scatter();
        }
      }
    }
  }

  // Highlight Cell
  private effectHighlightCell() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(Slot50Column);
      for (let j = 0; j < 5; j++) {
        let nCell = objColumn.cells[j];
        let objCell = nCell.getComponent(Slot50Cell);
        if (objCell.itemCell) {
          objCell.showHighlight();
        }
      }
    }
  }
}
