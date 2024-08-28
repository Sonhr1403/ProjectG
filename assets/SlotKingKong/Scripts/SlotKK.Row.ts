import SlotKKCellAnim from "./SlotKK.CellAnim";
import SlotKKCellSpr from "./SlotKK.CellSpr";
import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMachine from "./SlotKK.SlotMachine";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class SlotKKRow extends cc.Component {
  @property(cc.Node)
  public nRotate: cc.Node = null;

  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property({ type: cc.Prefab })
  public prfCellAnim: cc.Prefab = null;

  @property({ type: cc.Prefab })
  public prfCellSpr: cc.Prefab = null;

  ///////////////////////////
  private _index: number = 0;
  private _spinDirection: number = Direction.Down;
  public stopSpinning = false;
  public resultOfRow = null;
  private widthCell = 155.5;
  private listXPosOfCell = [-233.25, -77.75, 77.75, 233.25];
  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(this.listXPosOfCell[0], 0, 0),
    cc.v3(this.listXPosOfCell[1], 0, 0),
    cc.v3(this.listXPosOfCell[2], 0, 0),
    cc.v3(this.listXPosOfCell[3], 0, 0),
  ];

  public set spinDirection(index: number) {
    this._spinDirection = index;
  }

  public get spinDirection() {
    return this._spinDirection;
  }

  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  onLoad() {
    this.nContainer.removeAllChildren();
  }

  start() {}

  public createRowSpr(data): void {
    this.resultOfRow = data;
    this.nContainer.removeAllChildren();
    this.activeNodeRotate(true);
    for (let i = 0; i < 4; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCellSpr);
      nCell.position = this.arrayPosOfCell[i];
      this.calcTheResultsSpr(nCell);
      nCell.name = i.toString() + "-r";
      SlotKKMachine.instance.cellsSpr.push(nCell);
      this.nContainer.addChild(nCell);
    }
  }

  public createRowAnim(data): void {
    this.resultOfRow = data;
    this.nContainer.removeAllChildren();
    this.activeNodeRotate(true);
    for (let i = 0; i < 4; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCellAnim);
      nCell.position = this.arrayPosOfCell[i];
      this.calcTheResultsAnim(nCell);
      nCell.name = i.toString() + "-r";
      SlotKKMachine.instance.cellsAnim.push(nCell);
      nCell.children[0].active = false;
      this.nContainer.addChild(nCell);
    }
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  private numberRotation: number = 20; // Số vòng quay của cột
  private numberRepeatFinish: number = 4;

  public spinVirtual(timeDelay: number) {
    this.numberRotation = 20;
    this.status = SlotCmd.STATE_OF_SPIN.KHOI_DONG;
    this.doSpin(timeDelay);
    this.activeNodeRotate(true);
  }

  private status: number = SlotCmd.STATE_OF_SPIN.KHOI_DONG;

  public pushData(data): void {
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.numberRotation = 12;
    this.resultOfRow = data;
    if (SlotKKController.instance.isTurbo) {
      this.numberRotation += 20;
    } else {
      this.numberRotation += 20;
    }
  }

  //////////////////////////////////////
  private doSpin(timeDelay: number) {
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(this.widthCell * dirOfColumn, 0, 0);
      var timeFirstMove = 0.05;
      cc.tween(nCell)
        .delay(timeDelay)
        .by(timeFirstMove, { position: posMoved }, { easing: "backIn" })
        .then(
          cc.tween(nCell).call(() => {
            this.changeCallBack(nCell);
          })
        )
        .then(
          cc.tween(nCell).call(() => {
            this.checkEndCallback(nCell);
          })
        )
        .start();
    });
  }

  private checkEndCallback(nCell: cc.Node) {
    if (SlotKKController.instance.isForceStop || this.numberRotation <= 0) {
      this.brakeSuddenly(nCell);
    } else {
      this.loopSpin(nCell);
    }
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(this.widthCell * dirOfColumn, 0, 0);
    let timeStable = 0.03;
    if (this.status == SlotCmd.STATE_OF_SPIN.DANG_QUAY) {
      this.numberRotation -= 1;
    }
    cc.tween(nCell)
      .repeat(
        1,
        cc
          .tween()
          .by(timeStable, { position: posMoved })
          .call(() => {
            this.changeCallBack(nCell);
          })
      )
      .call(() => {
        this.checkEndCallback(nCell);
      })
      .start();
  }

  // Phanh dừng
  private brakeSuddenly(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    const posMoved = cc.v3(this.widthCell * dirOfColumn, 0, 0);
    const timeDecrease = 0.03;
    const timeFinishMove = 0.03;
    cc.tween(nCell)
      .repeat(
        this.numberRepeatFinish,
        cc
          .tween()
          .by(timeDecrease, { position: posMoved })
          .call(() => {
            this.changeCallBack(nCell);
          })
      )
      .by(timeFinishMove, { position: posMoved }, { easing: "bounceOut" })
      .call(() => {
        this.changeCallBack(nCell, true);
      })
      .start();
  }

  private changeCallBack(nCell: cc.Node, isFinish: boolean = false): void {
    const objCell = nCell.getComponent(SlotKKCellSpr);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(-(this.widthCell * 1.5 * dirOfColumn), 0, 0);
    if (Math.abs(nCell.position.x * dirOfColumn - 8) > this.widthCell * 1.5) {
      objCell.setSprRandom();
      nCell.position = posReset;
    }
    if (isFinish) {
      this.nContainer.children.sort((a, b) => a.x - b.x);
      for (let i = 0; i < this.nContainer.childrenCount; i++) {
        this.nContainer.children[i].zIndex = i;
        this.nContainer.children[i].setPosition(
          cc.v2(this.listXPosOfCell[i], 0)
        );
        this.calcTheResultsSpr(this.nContainer.children[i]);
      }
    }
  }

  private calcTheResultsSpr(nCell: cc.Node): void {
    const objCell = nCell.getComponent(SlotKKCellSpr);
    const posX = nCell.position.x;
    let list = this.resultOfRow;
    switch (posX) {
      case this.listXPosOfCell[0]:
        objCell.setResultForCell(list[0]);
        nCell.zIndex = 1;
        break;

      case this.listXPosOfCell[1]:
        objCell.setResultForCell(list[1]);
        nCell.zIndex = 2;
        break;

      case this.listXPosOfCell[2]:
        objCell.setResultForCell(list[2]);
        nCell.zIndex = 3;
        break;

      case this.listXPosOfCell[3]:
        objCell.setResultForCell(list[3]);
        nCell.zIndex = 4;
        break;
    }
  }

  private calcTheResultsAnim(nCell: cc.Node): void {
    const objCell = nCell.getComponent(SlotKKCellAnim);
    const posX = nCell.position.x;
    let list = this.resultOfRow;
    switch (posX) {
      case this.listXPosOfCell[0]:
        objCell.setResultForCell(list[0]);
        nCell.zIndex = 1;
        break;

      case this.listXPosOfCell[1]:
        objCell.setResultForCell(list[1]);
        nCell.zIndex = 2;
        break;

      case this.listXPosOfCell[2]:
        objCell.setResultForCell(list[2]);
        nCell.zIndex = 3;
        break;

      case this.listXPosOfCell[3]:
        objCell.setResultForCell(list[3]);
        nCell.zIndex = 4;
        break;
    }
  }

  private setCellResultsSpr(nCell: cc.Node, i: number) {
    const objCell = nCell.getComponent(SlotKKCellSpr);
    let list = this.resultOfRow;
    let itemCell = objCell.getItemCell();

    if (itemCell.isExplode && (!itemCell.highlight || itemCell.id === 0)) {
      list[i].rowTake = 1;
      list[i].isActive = true;
    } else {
      list[i].rowTake = itemCell.rowTake;
      list[i].isActive = itemCell.isActive;
    }
    objCell.setResultForCell(list[i]);
  }

  public rearrangeCell(data) {
    this.nContainer.children.sort((a, b) => a.x - b.x);

    this.resultOfRow = data;

    for (let i = this.nContainer.childrenCount - 1; i >= 0; i--) {
      this.setCellResultsSpr(this.nContainer.children[i], i);
      this.nContainer.children[i].zIndex = i;
      cc.tween(this.nContainer.children[i])
        .to(
          0.4,
          { position: cc.v3(this.listXPosOfCell[i], 0, 0) },
          { easing: "bounceOut" }
        )
        .start();
    }
  }

  public setCellResultAnim(){
    for (let i = 0; i < this.nContainer.childrenCount; i++) {
      this.calcTheResultsAnim(this.nContainer.children[i]);
    }
  }
 
  private activeNodeRotate(isActive: boolean) {
    this.nRotate.active = isActive;
  }
}
