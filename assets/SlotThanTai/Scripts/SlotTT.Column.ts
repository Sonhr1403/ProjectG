import SlotTTCell from "./SlotTT.CellAnim";
import { SlotCmd } from "./SlotTT.Cmd";
import SlotTTController from "./SlotTT.Controller";
import SlotTTMusicManager, { SLOT_SOUND_TYPE } from "./SlotTT.Music";
import SlotTTMachine from "./SlotTT.SlotMachine";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class SlotTTColumn extends cc.Component {
  @property(cc.Node)
  public nRotate: cc.Node = null;

  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property(sp.Skeleton)
  public ske: sp.Skeleton = null;

  @property({ type: cc.Prefab })
  public prfCellAnim: cc.Prefab = null;
  ///////////////////////////
  private _index: number = 0;
  private _spinDirection: number = Direction.Down;
  public stopSpinning = false;
  public resultOfCol: Array<SlotCmd.ImpItemCell> = null;
  private heightCell = 200;
  private listXPosOfCell = [10, -10];
  private listYPosOfCell = [200, 0, -200];

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

  private numberRotation: number = 35; // Số vòng quay của cột

  public createColumnAnim(data: Array<SlotCmd.ImpItemCell>): void {
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.resultOfCol = data;
    this.nContainer.removeAllChildren();
    for (let i = 0; i < 3; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCellAnim);
      let pos = cc.v2(0, this.listYPosOfCell[i]);
      if (i !== 1) {
        switch (this.index) {
          case 0:
            pos.x = 18;
            break;

          case 2:
            pos.x = -18;
            break;
        }
      }
      nCell.setPosition(pos);

      this.calcTheResultsAnim(nCell, true);
      nCell.name = i.toString() + "-" + this.node.name;
      SlotTTMachine.instance.cellsAnim.push(nCell);
      this.nContainer.addChild(nCell);
    }
    this.status = SlotCmd.STATE_OF_SPIN.KET_THUC;
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  public spinVirtual(timeDelay: number) {
    this.numberRotation = 60;
    this.status = SlotCmd.STATE_OF_SPIN.KHOI_DONG;
    this.doSpin(timeDelay);
    SlotTTMusicManager.instance.playLoop(SLOT_SOUND_TYPE.REEL_SPIN);
  }

  private status: number = SlotCmd.STATE_OF_SPIN.KHOI_DONG;

  public pushData(data, stt: number): void {
    this.count = 0;
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.numberRotation = 30;
    this.resultOfCol = data;
    if (SlotTTController.instance.isTurbo) {
      this.numberRotation = 3;
    } else {
      this.numberRotation += 30 * stt;
    }
  }

  //////////////////////////////////////
  private doSpin(timeDelay: number) {
    this.ske.node.active = true;
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(this.getX(nCell), this.heightCell * dirOfColumn, 0);
      var timeFirstMove = 0.1;
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
    if (SlotTTController.instance.isForceStop || this.numberRotation <= 0) {
      this.brakeSuddenly(nCell);
    } else {
      this.loopSpin(nCell);
    }
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(this.getX(nCell), this.heightCell * dirOfColumn, 0);
    let timeStable = 0.05;
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
    const posMoved = cc.v3(this.getX(nCell), this.heightCell * dirOfColumn, 0);
    const timeDecrease = 0.05;
    const timeFinishMove = 0.06;
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
        this.changeCallBack(nCell, true);
      })
      .start();
  }

  private changeCallBack(nCell: cc.Node, isFinish: boolean = false): void {
    const objCell = nCell.getComponent(SlotTTCell);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(
      this.getX(nCell),
      -(this.heightCell * 1 * dirOfColumn),
      0
    );
    if (Math.abs(nCell.position.y * dirOfColumn) > this.heightCell * 1) {
      objCell.setRandom(SlotCmd.STATE_OF_ANIM.SPIN);
      nCell.position = posReset;
    }
    if (isFinish) {
      SlotTTMusicManager.instance.stopPlayLoop();
      if (SlotTTController.instance.isTurbo) {
        SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_INTERUPT);
      } else {
        switch (this.index) {
          case 0:
            SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP_1);
            break;

          case 1:
            SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP_2);
            break;

          case 2:
            SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_STOP_3);
            break;
        }
      }
      this.ske.node.active = false;
      let isFinishFinal = false;
      this.nContainer.children.sort((a, b) => b.y - a.y);
      for (let i = 0; i < this.nContainer.childrenCount; i++) {
        this.nContainer.children[i].zIndex = i;
        let pos = cc.v2(0, this.listYPosOfCell[i]);
        if (i !== 1) {
          switch (this.index) {
            case 0:
              pos.x = 18;
              break;

            case 2:
              pos.x = -18;
              break;
          }
        }
        this.nContainer.children[i].setPosition(pos);
        isFinishFinal = this.calcTheResultsAnim(
          this.nContainer.children[i],
          false
        );
      }

      if (this.index === 2 && isFinishFinal) {
        this.count++;
        if (this.count % 3 === 0) {
          SlotTTMusicManager.instance.stopPlayLoop();
          SlotTTMachine.instance.reward();
        }
      }
    }
  }

  private calcTheResultsAnim(nCell: cc.Node, isCreated: boolean): boolean {
    let isFinish: boolean = false;
    const objCell = nCell.getComponent(SlotTTCell);
    const posY = nCell.position.y;
    let list = this.resultOfCol;

    switch (posY) {
      case this.listYPosOfCell[0]:
        objCell.setItemCell(list[0]);
        break;

      case this.listYPosOfCell[1]:
        objCell.setItemCell(list[1]);
        break;

      case this.listYPosOfCell[2]:
        objCell.setItemCell(list[2]);
        isFinish = true;
        break;
    }

    if (!isCreated) {
      objCell.setAnim(SlotCmd.STATE_OF_ANIM.SPIN_STOP);
    }
    this.scheduleOnce(() => {
      objCell.setAnim(SlotCmd.STATE_OF_ANIM.DEFAULT);
    }, 0.4);
    return isFinish;
  }

  private getX(nCell: cc.Node): number {
    let x = 0;
    switch (this.index) {
      case 0:
        switch (nCell.y) {
          case this.listYPosOfCell[0]:
            x = this.listXPosOfCell[1];
            break;

          case this.listYPosOfCell[1]:
            x = this.listXPosOfCell[0];
            break;

          case this.listYPosOfCell[2]:
            x = this.listXPosOfCell[0];
            break;
        }
        break;

      case 2:
        switch (nCell.y) {
          case this.listYPosOfCell[0]:
            x = this.listXPosOfCell[0];
            break;

          case this.listYPosOfCell[1]:
            x = this.listXPosOfCell[1];
            break;

          case this.listYPosOfCell[2]:
            x = this.listXPosOfCell[1];
            break;
        }
        break;
    }
    return x;
  }
}
