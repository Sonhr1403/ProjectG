import SlotKKCellAnim from "./SlotKK.CellAnim";
import SlotKKCellSpr from "./SlotKK.CellSpr";
import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";
import SlotKKMachine from "./SlotKK.SlotMachine";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class SlotKKColumn extends cc.Component {
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
  public resultOfCol = null;
  private heightCell = 100;
  private listYPosOfCell = [300, 200, 100, 0, -100, -200, -300];
  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCell[0], 0),
    cc.v3(0, this.listYPosOfCell[1], 0),
    cc.v3(0, this.listYPosOfCell[2], 0),
    cc.v3(0, this.listYPosOfCell[3], 0),
    cc.v3(0, this.listYPosOfCell[4], 0),
    cc.v3(0, this.listYPosOfCell[5], 0),
    cc.v3(0, this.listYPosOfCell[6], 0),
  ];

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

  private numberRotation: number = 25; // Số vòng quay của cột
  private numberRepeatFinish: number = 11;

  public createColumnSpr(data): void {
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.resultOfCol = data;
    this.nContainer.removeAllChildren();
    for (let i = 0; i < 7; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCellSpr);
      nCell.position = this.arrayPosOfCell[i];
      this.calcTheResultsSpr(nCell);
      nCell.name = i.toString() + "-" + this.node.name;
      SlotKKMachine.instance.cellsSpr.push(nCell);
      this.nContainer.addChild(nCell);
    }
    this.status = SlotCmd.STATE_OF_SPIN.KET_THUC;
  }

  public createColumnAnim(data): void {
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.resultOfCol = data;
    this.nContainer.removeAllChildren();
    for (let i = 0; i < 7; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCellAnim);
      nCell.position = this.arrayPosOfCell[i];
      this.calcTheResultsAnim(nCell);
      nCell.name = i.toString() + "-" + this.node.name;
      SlotKKMachine.instance.cellsAnim.push(nCell);
      nCell.children[0].active = false;
      this.nContainer.addChild(nCell);
    }
    this.status = SlotCmd.STATE_OF_SPIN.KET_THUC;
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  public spinVirtual(timeDelay: number) {
    this.numberRotation = 70;
    this.status = SlotCmd.STATE_OF_SPIN.KHOI_DONG;
    this.doSpin(timeDelay);
    // this.activeNodeRotate(true);
  }

  private status: number = SlotCmd.STATE_OF_SPIN.KHOI_DONG;

  public pushData(data, stt: number): void {
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.numberRotation = 21;
    this.resultOfCol = data;
    if (SlotKKController.instance.isTurbo) {
      this.numberRotation += 1;
    } else {
      this.numberRotation += 28 * stt;
    }
  }

  //////////////////////////////////////
  private doSpin(timeDelay: number) {
    this.nContainer.children.forEach((nCell) => {
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
    if (SlotKKController.instance.isForceStop || this.numberRotation <= 0) {
      this.brakeSuddenly(nCell);
    } else {
      this.loopSpin(nCell);
    }
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
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
    const posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
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
        this.playSoundReelStop();
      })
      .start();
  }

  private changeCallBack(nCell: cc.Node, isFinish: boolean = false): void {
    const objCell = nCell.getComponent(SlotKKCellSpr);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(0, -(this.heightCell * 3 * dirOfColumn), 0);
    if (Math.abs(nCell.position.y * dirOfColumn) > this.heightCell * 3) {
      objCell.setSprRandom();
      nCell.position = posReset;
    }
    if (isFinish) {
      let isFinishFinal = false;
      this.nContainer.children.sort((a, b) => b.y - a.y);
      for (let i = 0; i < this.nContainer.childrenCount; i++) {
        this.nContainer.children[i].zIndex = i;
        this.nContainer.children[i].setPosition(
          cc.v2(0, this.listYPosOfCell[i])
        );
        isFinishFinal = this.calcTheResultsSpr(this.nContainer.children[i]);
      }
      if (this.index === 5 && isFinishFinal) {
        this.count++;
        if (this.count % 7 === 0) {
          // SlotKKController.instance.isRotating = false;

            SlotKKMachine.instance.explode();
            if (SlotKKMachine.instance.totalRound <= 1) {
              SlotKKController.instance.setBigLbl(true, 3);
            }
   
        }
      }
    }
  }

  private calcTheResultsSpr(nCell: cc.Node): boolean {
    let isFinish = false;
    const objCell = nCell.getComponent(SlotKKCellSpr);
    const posY = nCell.position.y;
    let list = this.resultOfCol;

    switch (posY) {
      case this.listYPosOfCell[0]:
        objCell.setResultForCell(list[0]);
        nCell.zIndex = 1;
        break;

      case this.listYPosOfCell[1]:
        objCell.setResultForCell(list[1]);
        nCell.zIndex = 2;
        break;

      case this.listYPosOfCell[2]:
        objCell.setResultForCell(list[2]);
        nCell.zIndex = 3;
        break;

      case this.listYPosOfCell[3]:
        objCell.setResultForCell(list[3]);
        nCell.zIndex = 4;
        break;

      case this.listYPosOfCell[4]:
        objCell.setResultForCell(list[4]);
        nCell.zIndex = 5;
        break;

      case this.listYPosOfCell[5]:
        objCell.setResultForCell(list[5]);
        nCell.zIndex = 6;
        break;

      case this.listYPosOfCell[6]:
        objCell.setResultForCell(list[6]);
        nCell.zIndex = 7;
        isFinish = true;
        break;
    }

    return isFinish;
  }

  private calcTheResultsAnim(nCell: cc.Node) {
    const objCell = nCell.getComponent(SlotKKCellAnim);
    const posY = nCell.position.y;
    let list = this.resultOfCol;

    switch (posY) {
      case this.listYPosOfCell[0]:
        objCell.setResultForCell(list[0]);
        nCell.zIndex = 1;
        break;

      case this.listYPosOfCell[1]:
        objCell.setResultForCell(list[1]);
        nCell.zIndex = 2;
        break;

      case this.listYPosOfCell[2]:
        objCell.setResultForCell(list[2]);
        nCell.zIndex = 3;
        break;

      case this.listYPosOfCell[3]:
        objCell.setResultForCell(list[3]);
        nCell.zIndex = 4;
        break;

      case this.listYPosOfCell[4]:
        objCell.setResultForCell(list[4]);
        nCell.zIndex = 5;
        break;

      case this.listYPosOfCell[5]:
        objCell.setResultForCell(list[5]);
        nCell.zIndex = 6;
        break;

      case this.listYPosOfCell[6]:
        objCell.setResultForCell(list[6]);
        nCell.zIndex = 7;
        break;
    }
  }

  private setCellResultsSpr(nCell: cc.Node, i: number) {
    const objCell = nCell.getComponent(SlotKKCellSpr);
    let list = this.resultOfCol;
    let itemCell = objCell.getItemCell();

    if (itemCell.isExplode && itemCell.id !== 0) {
      list[i].rowTake = 1;
      list[i].isActive = true;
    } else {
      list[i].rowTake = itemCell.rowTake;
      list[i].isActive = itemCell.isActive;
    }
    objCell.setResultForCell(list[i]);
  }

  public rearrangeCell(data) {
    this.nContainer.children.sort((a, b) => b.y - a.y);

    this.resultOfCol = data;

    for (let i = this.nContainer.childrenCount - 1; i >= 0; i--) {
      this.setCellResultsSpr(this.nContainer.children[i], i);
      this.nContainer.children[i].zIndex = i;
      cc.tween(this.nContainer.children[i])
        .to(
          0.4,
          { position: cc.v3(0, this.listYPosOfCell[i], 0) },
          { easing: "bounceOut" }
        )
        .start();
    }
  }

  public setCellResultAnim() {
    for (let i = 0; i < this.nContainer.childrenCount; i++) {
      this.calcTheResultsAnim(this.nContainer.children[i]);
    }
  }

  private playSoundReelStop() {
    if (SlotKKController.instance.isTurbo) {
      SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_FASTSPIN);
    } else {
      switch (this.index) {
        case 1:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP1);
          break;

        case 2:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP2);
          break;

        case 3:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP3);
          break;

        case 4:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP4);
          break;

        case 5:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP5);
          break;

        case 6:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP6);
          break;

        case 7:
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP7);
          break;
      }
    }
  }

  private activeNodeRotate(isActive: boolean) {
    this.nRotate.active = isActive;
  }
}
