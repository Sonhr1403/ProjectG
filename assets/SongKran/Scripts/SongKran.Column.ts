import SongKranCell from "./SongKran.Cell";
import { SlotCmd } from "./SongKran.Cmd";
import SongKranCommon from "./SongKran.Common";
import SongKranController from "./SongKran.Controller";
import SongKranMusicManager, { SLOT_SOUND_TYPE } from "./SongKran.Music";
import SongKranMachine from "./SongKran.SlotMachine";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class SongKranColumn extends cc.Component {
  @property(cc.Node)
  public nRotate: cc.Node = null;

  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property(cc.Node)
  public ske: cc.Node = null;

  @property({ type: cc.Prefab })
  public prfCell: cc.Prefab = null;
  ///////////////////////////
  private _index: number = 0;
  private numberOfCells: number = 6;
  private _spinDirection: number = Direction.Down;
  public resultOfCol: Array<SlotCmd.ImpItemCell> = null;
  private heightCell = 170;
  private listYPosOfCell = [425, 255, 85, -85, -255, -425];

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

  public createColumnCell(data: Array<SlotCmd.ImpItemCell>): void {
    this.resultOfCol = data;
    this.nContainer.removeAllChildren();
    for (let i = 0; i < this.numberOfCells; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCell);
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

  public spinVirtual(timeDelay: number) {
    this.nContainer.children.forEach((nCell) => {
      nCell.y = this.listYPosOfCell[nCell.zIndex];
    });
    this.numberRotation = 1000000;
    this.doSpin(timeDelay);
    this.nContainer.y = 0;
  }

  public pushData(data, stt: number): void {
    this.count = 0;
    this.numberRotation = 45;
    this.resultOfCol = data;
    let num = 6;
    if (SongKranMachine.instance.wildCount >= 2) {
      SongKranMusicManager.instance.stopPlayLoop();
      SongKranMusicManager.instance.playLoop(SLOT_SOUND_TYPE.EFTCHARGING);
      this.ske.active = true;
      this.ske.getComponent(sp.Skeleton).setAnimation(0, "start", false);
      this.ske.getComponent(sp.Skeleton).setCompleteListener(() => {
        this.ske.getComponent(sp.Skeleton).setAnimation(0, "loop", true);
      });
      num = 9;
    }
    if (SongKranMachine.instance.isTurbo) {
      this.numberRotation = 6;
    } else {
      this.numberRotation += num * stt;
    }
  }

  //////////////////////////////////////
  private doSpin(timeDelay: number) {
    for (let i = this.nContainer.childrenCount - 1; i >= 0; i--) {
      let nCell = this.nContainer.children[i];
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
    }
  }

  private checkEndCallback(nCell: cc.Node) {
    if (SongKranController.instance.isForceStop || this.numberRotation <= 0) {
      this.brakeSuddenly(nCell);
    } else {
      this.loopSpin(nCell);
    }
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.03;
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
    const timeDecrease = 0.04;
    const timeFinishMove = 0.05;
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
    const objCell = nCell.getComponent(SongKranCell);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(0, -(this.heightCell * 2.5 * dirOfColumn), 0);
    if (Math.abs(nCell.position.y * dirOfColumn) > this.heightCell * 2.5) {
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
      this.nContainer.children.sort((a, b) => b.zIndex - a.zIndex);
      for (let i = 0; i < this.nContainer.childrenCount; i++) {
        this.nContainer.children[i].zIndex = i;
        this.calcTheResults(this.nContainer.children[i], false);
      }
    }
  }

  private calcTheResults(nCell: cc.Node, isCreated: boolean) {
    nCell.stopAllActions();
    const objCell = nCell.getComponent(SongKranCell);

    if (nCell.zIndex > 0 && nCell.zIndex < 5) {
      objCell.node.y = this.listYPosOfCell[nCell.zIndex];
      objCell.setItemCell(this.resultOfCol[nCell.zIndex - 1]);
      objCell.setSprite();
      if (this.resultOfCol[nCell.zIndex - 1].id === 2) {
        SongKranMachine.instance.wildCount += 1;
      }
      if (this.ske.active) {
        this.ske.active = false;
      }
    } else {
      objCell.noSprite();
    }
    if (!isCreated) {
      SongKranMusicManager.instance.playType(
        SLOT_SOUND_TYPE.REALSTOPSOUND
      );
      cc.tween(nCell)
        .by(0.1, { position: cc.v3(0, -20, 0) })
        .call(() => {
          cc.tween(nCell)
            .by(0.3, { position: cc.v3(0, 20, 0) })
            .call(() => {
              if (nCell.zIndex > 0 && nCell.zIndex < 5) {
                if (
                  this.resultOfCol[nCell.zIndex - 1].id === 2 &&
                  !SongKranMachine.instance.isTurbo
                ) {
                  SongKranMachine.instance.runAnim(
                    this.resultOfCol[nCell.zIndex - 1].index,
                    SlotCmd.STATE_OF_ANIM.ONE
                  );
                  SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER_1S);
                  this.turnCellOff(this.resultOfCol[nCell.zIndex - 1].index);
                }
              }
              if (this.index === 4 && nCell.zIndex === 4) {
                SongKranMachine.instance.doneSpin();
                SongKranMusicManager.instance.stopPlayLoop();
              }
            })
            .start();
        })
        .start();
    }
  }

  public turnCellOff(index: number) {
    this.nContainer.children.forEach((cell) => {
      let itemCell = cell.getComponent(SongKranCell).getItemCell();
      if (itemCell.index === index) {
        cell.active = false;
      }
    });
  }

  public turnCellOn() {
    this.nContainer.children.forEach((cell) => {
      if (!cell.active) {
        cell.active = true;
      }
    });
  }

  public runWildNugde() {
    let wildLength = 0;
    let wildUpper = false;
    this.resultOfCol.forEach((item) => {
      if (item.id === 0 || item.id === 1) {
        wildLength = item.wildLength;
        wildUpper = item.wildUpper;
      }
    });
    let pos: cc.Vec3 = this.getPosWN(wildLength, wildUpper);
    cc.tween(this.nContainer).to(1.5, { position: pos }).start();
  }

  public getPosWN(wildLength: number, wildUpper: boolean) {
    let pos: cc.Vec3 = cc.v3(0, 0, 0);
    switch (wildLength) {
      case -1:
        if (wildUpper) {
          pos = cc.v3(0, -510, 0);
        } else {
          pos = cc.v3(0, 510, 0);
        }
        break;

      case 2:
        if (wildUpper) {
          pos = cc.v3(0, -340, 0);
        } else {
          pos = cc.v3(0, 340, 0);
        }
        break;

      case 3:
        if (wildUpper) {
          pos = cc.v3(0, -170, 0);
        } else {
          pos = cc.v3(0, 170, 0);
        }
        break;
    }
    return pos;
  }
}
