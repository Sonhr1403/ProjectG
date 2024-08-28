import MoneyTrain2CellMini from "./Script.Cell_Mini";
import { SlotCmd } from "./Script.Cmd";
import MoneyTrain2Controller from "./Script.Controller";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";
import MoneyTrain2MachineMini from "./Script.SlotMachine_Mini";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class MoneyTrain2ColumnMiNi extends cc.Component {
  @property(cc.Node)
  public nRotate: cc.Node = null;

  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property({ type: cc.Prefab })
  public prfCellMini: cc.Prefab = null;
  ///////////////////////////
  private _index: number = 0;
  private numberOfCells: number = 3;
  private _spinDirection: number = Direction.Down;
  public resultOfCol: SlotCmd.ImpBooster = null;
  private heightCell = 145;
  private listYPosOfCell = [145, 0, -145];

  private count: number = 0;

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

  private numberRotation: number = 30; // Số vòng quay của cột

  public createColumnCellMini(data: SlotCmd.ImpBooster): void {
    this.resultOfCol = data;
    this.nContainer.removeAllChildren();
    for (let i = 0; i < this.numberOfCells; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCellMini);
      let pos = cc.v2(0, this.listYPosOfCell[i]);
      nCell.setPosition(pos);
      nCell.zIndex = i;
      this.calcTheResults(nCell, true);
      nCell.name = i.toString() + "-" + this.node.name;
      this.nContainer.addChild(nCell);
    }
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  public spinVirtual() {
    this.nRotate.height = 145;
    this.numberRotation = 1000000;
    if (this.resultOfCol.value === 0) {
      // this.nContainer.children.forEach((nCell) => {
      //   nCell.y = this.listYPosOfCell[nCell.zIndex];
      //   nCell.getComponent(MoneyTrain2CellMini).setMulti(0);
      // });
      this.doSpin();
    }
    // this.nContainer.y = 0;
  }

  public pushData(data): void {
    this.count = 0;
    this.numberRotation = 0;
    this.resultOfCol = data;
  }

  //////////////////////////////////////
  private doSpin() {
    for (let i = 0; i < this.nContainer.childrenCount; i++) {
      let nCell = this.nContainer.children[i];
      cc.tween(nCell).to;
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
      var timeFirstMove = 0.1;
      cc.tween(nCell)
        .by(0.2, { position: cc.v3(0, 30, 0) })
        .call(() => {
          cc.tween(nCell)
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
        })
        .start();
    }
  }

  private checkEndCallback(nCell: cc.Node) {
    if (
      MoneyTrain2Controller.instance.isForceStop ||
      this.numberRotation <= 0
    ) {
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
    const timeDecrease = 0.09;
    const timeFinishMove = 0.1;
    cc.tween(nCell)
      .tag(0)
      .repeat(
        0,
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
    const objCell = nCell.getComponent(MoneyTrain2CellMini);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(0, -(this.heightCell * dirOfColumn), 0);
    if (Math.abs(nCell.position.y * dirOfColumn) > this.heightCell) {
      if (this.numberRotation === 0) {
        // cc.log(nCell.zIndex)
        // if (nCell.zIndex > 0 && nCell.zIndex < 5) {
        //   objCell.setItemCell(this.resultOfCol[nCell.zIndex - 1]);
        //   objCell.setSke();
        // }
      } else {
        objCell.setRandom();
      }
      nCell.position = posReset;
    }
    if (isFinish) {
      this.nRotate.height = 200;
      this.nContainer.children.sort((a, b) => b.zIndex - a.zIndex);
      for (let i = 0; i < this.nContainer.childrenCount; i++) {
        this.nContainer.children[i].zIndex = i;
        this.nContainer.children[i].setPosition(
          cc.v2(0, this.listYPosOfCell[i])
        );
        this.calcTheResults(this.nContainer.children[i], false);
      }
    }
  }

  private calcTheResults(nCell: cc.Node, isCreated: boolean) {
    nCell.stopAllActions();
    const objCell = nCell.getComponent(MoneyTrain2CellMini);
    if (nCell.zIndex === 1) {
      objCell.node.y = this.listYPosOfCell[nCell.zIndex];
      objCell.setItemBooster(this.resultOfCol);
      objCell.setCellMini();
    } else {
      objCell.noSprite();
      objCell.setMulti(0);
    }

    if (!isCreated) {
      cc.tween(nCell)
        .by(0.15, { position: cc.v3(0, -10, 0) }, { easing: "smooth" })
        .call(() => {
          cc.tween(nCell)
            .by(0.15, { position: cc.v3(0, 10, 0) }, { easing: "smooth" })
            .call(() => {
              if (nCell.zIndex === 1) {
                if (this.index === 26) {
                  this.scheduleOnce(()=>{
                    nCell.getComponent(MoneyTrain2CellMini).land();
                    MoneyTrain2MachineMini.instance.doneSpin();
                  }, 1)
                  // MoneyTrain2MusicManager.instance.stopPlayLoop();
                }
              }

            })
            .start();
        })
        .start();
    }
  }

  public landCell(){
    this.nContainer.children[1].getComponent(MoneyTrain2CellMini).land();
  }

  public runCellAnim() {
    this.nContainer.children[1].getComponent(MoneyTrain2CellMini).runAnim();
  }

  public offCellAnim() {
    this.nContainer.children[1].getComponent(MoneyTrain2CellMini).offAnim();
  }
}
