import SlotAstrosBonus from "./SlotAstros.Bonus";
import SlotAstrosCellBonus from "./SlotAstros.CellBonus";
import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMachineBonus from "./SlotAstros.SlotMachineBonus";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class SlotAstrosColumnBonus extends cc.Component {
  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property(cc.Node)
  public ske: cc.Node = null;

  @property(cc.Integer)
  public index: number = 0;

  ///////////////////////////
  private _spinDirection: number = Direction.Down;
  public resultOfCol: number = null;
  private heightCell = 200;
  private listYPosOfCell = [200, 0, -200];

  private count: number = 0;

  public set spinDirection(index: number) {
    this._spinDirection = index;
  }

  public get spinDirection() {
    return this._spinDirection;
  }

  onLoad() {}

  private numberRotation: number = 0; // Số vòng quay của cột

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  public spinVirtual(timeDelay: number) {
    this.numberRotation = 10000;
    this.doSpin(timeDelay);
  }

  public pushData(data, stt: number): void {
    this.ske.active = true;
    this.count = 0;
    this.numberRotation = 30;
    this.resultOfCol = data;
    this.numberRotation += 3 * stt;
  }

  //////////////////////////////////////
  private doSpin(timeDelay: number) {
    this.nContainer.children.forEach((nCell) => {
      nCell.getComponent(SlotAstrosCellBonus).setRandom();
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
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
    if (SlotAstrosController.instance.isForceStop || this.numberRotation <= 0) {
      this.brakeSuddenly(nCell);
    } else {
      this.loopSpin(nCell);
    }
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.08;
    this.numberRotation -= 1;
    cc.tween(nCell)
      .repeat(
        2,
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

  private brakeSuddenly(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    const posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    const timeDecrease = 0.08;
    const timeFinishMove = 0.1;
    cc.tween(nCell)
      .repeat(
        2,
        cc
          .tween()
          .by(timeDecrease, { position: posMoved })
          .call(() => {
            this.changeCallBack(nCell);
          })
      )
      .by(timeFinishMove, { position: posMoved }, { easing: "backIn" })
      .call(() => {
        this.count++;
        if (this.count % 3 === 0) {
          this.count = 0;
          this.changeCallBack(nCell, true);
        }
      })
      .start();
  }

  private changeCallBack(nCell: cc.Node, isFinish: boolean = false): void {
    const objCell = nCell.getComponent(SlotAstrosCellBonus);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(0, -(this.heightCell * 1 * dirOfColumn), 0);
    if (Math.abs(nCell.position.y * dirOfColumn) > this.heightCell * 1) {
      objCell.setRandom();
      nCell.position = posReset;
    }
    if (isFinish) {
      this.nContainer.children.sort((a, b) => b.y - a.y);
      for (let i = 0; i < this.nContainer.childrenCount; i++) {
        this.nContainer.children[i].zIndex = i;
        this.calcTheResults(this.nContainer.children[i]);
      }
    }
  }

  private calcTheResults(nCell: cc.Node) {
    const objCell = nCell.getComponent(SlotAstrosCellBonus);
    nCell.y = this.listYPosOfCell[nCell.zIndex];

    switch (nCell.zIndex) {
      case 0:
        // objCell.setRandom();
        break;

      case 1:
        objCell.setItemCell(this.resultOfCol);
        objCell.setSprite();
        this.ske.active = false;
        objCell.lblAnim();
        this.scheduleOnce(()=>{
          if (this.index === 6) {
            SlotAstrosMachineBonus.instance.scheduleForLbl();
            this.scheduleOnce(() => {
              SlotAstrosBonus.instance.onClose();
            }, 2);
          }
        }, 0.5)
        break;

      case 2:
        // objCell.setRandom();
        break;
    }
  }

  public clearCells() {
    this.nContainer.children.forEach((nCell) => {
      nCell.getComponent(SlotAstrosCellBonus).clearCell();
    });
  }
}
