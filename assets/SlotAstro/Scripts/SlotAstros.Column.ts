import SlotAstrosCell from "./SlotAstros.Cell";
import { SlotCmd } from "./SlotAstros.Cmd";
import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMusicManager, { SLOT_SOUND_TYPE } from "./SlotAstros.Music";
import SlotAstrosMachine from "./SlotAstros.SlotMachine";

const { ccclass, property } = cc._decorator;

export enum Direction {
  Up,
  Down,
}

@ccclass
export default class SlotAstrosColumn extends cc.Component {
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
  private _spinDirection: number = Direction.Down;
  public stopSpinning = false;
  public resultOfCol: SlotCmd.ImpItemCell = null;
  private heightCell = 115;
  private listYPosOfCell = [115, 0, -115];

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

  public createColumnCell(data: SlotCmd.ImpItemCell): void {
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.resultOfCol = data;
    this.nContainer.removeAllChildren();
    for (let i = 0; i < 3; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCell);
      let pos = cc.v2(0, this.listYPosOfCell[i]);
      nCell.setPosition(pos);
      nCell.zIndex = i;
      this.calcTheResults(nCell, true);
      nCell.name = i.toString() + "-" + this.node.name;
      this.nContainer.addChild(nCell);
      if (this.index > 6) {
        nCell.active = false;
      }
    }
    this.status = SlotCmd.STATE_OF_SPIN.KET_THUC;
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  public spinVirtual(timeDelay: number) {
    this.nContainer.children.forEach((nCell) => {
      nCell.y = this.listYPosOfCell[nCell.zIndex];
    });
    this.nRotate.width = 130;
    this.nRotate.height = 115;
    this.numberRotation = 60;
    this.status = SlotCmd.STATE_OF_SPIN.KHOI_DONG;
    this.nContainer.children.forEach((nCell) => {
      nCell.active = true;
    });
    this.doSpin(timeDelay);
    this.unActivateBlock();
  }

  private status: number = SlotCmd.STATE_OF_SPIN.KHOI_DONG;

  public pushData(data, stt: number): void {
    if (this.index > 12 && !SlotAstrosMachine.instance.isTurbo) {
      this.ske.active = true;
      this.nRotate.height = 345;
      SlotAstrosMachine.instance.unAnimWhileSpin(this.index, true);
    }
    this.count = 0;
    this.status = SlotCmd.STATE_OF_SPIN.DANG_QUAY;
    this.numberRotation = 45;
    this.resultOfCol = data;
    if (SlotAstrosMachine.instance.isTurbo) {
      this.numberRotation = 0;
    } else {
      this.numberRotation += 5 * stt;
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
    if (SlotAstrosController.instance.isForceStop || this.numberRotation <= 0) {
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
    const timeDecrease = 0.03;
    const timeFinishMove = 0.03;
    cc.tween(nCell)
      .tag(0)
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
    const objCell = nCell.getComponent(SlotAstrosCell);
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
        this.calcTheResults(this.nContainer.children[i], false);
      }
    }
  }

  private calcTheResults(nCell: cc.Node, isCreated: boolean) {
    const objCell = nCell.getComponent(SlotAstrosCell);

    switch (nCell.zIndex) {
      case 0:
        objCell.node.y = 250;
        // objCell.setRandom();
        break;

      case 1:
        objCell.node.y = 0;
        objCell.setItemCell(this.resultOfCol);
        objCell.setSprite();
        if (!isCreated) {
          cc.tween(nCell)
          .by(0.15, { position: cc.v3(0, -5, 0) })
          .call(() => {
            SlotAstrosMusicManager.instance.playType(
              SLOT_SOUND_TYPE.REELSTOP,
              2
            );
            cc.tween(nCell)
              .by(0.15, { position: cc.v3(0, 5, 0) })
              .call(() => {
                this.scheduleOnce(() => {
                  if (this.index > 6) {
                    this.checkCellHL();
                  }
      
                  const isInWinList =
                    SlotAstrosMachine.instance.listWin.includes(
                      this.resultOfCol.id
                    );
                  const isAppearTime3 = this.resultOfCol.appearTime === 3;
      
                  if (isInWinList) {
                    if (this.index < 7) {
                      if (this.resultOfCol.appearTime >= 3) {
                        SlotAstrosMachine.instance.onAnimActive(
                          this.resultOfCol
                        );
                        SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.HIGHLIGHTSBIG, 2);
                      }
                    } else {
                      SlotAstrosMachine.instance.onAnimActive(
                        this.resultOfCol
                      );
                      if (this.resultOfCol.appearTime >= 3) {
                        SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.HIGHLIGHTSBIG, 2);
                      } else {
                        SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.HIGHLIGHTS, 2);
                      }
                    }
                    if (isAppearTime3) {
                      SlotAstrosMachine.instance.runFrameEffUpgrade(
                        this.index
                      );
                    }
                    if (this.index > 6 && this.resultOfCol.appearTime < 4) {
                      SlotAstrosMachine.instance.updateProgress(
                        this.index,
                        this.resultOfCol.appearTime,
                        true
                      );
                    }
                  } else if (this.resultOfCol.id === 3) {
                    if (this.index > 6 && this.resultOfCol.appearTime < 4) {
                      SlotAstrosMachine.instance.updateProgress(
                        this.index,
                        this.resultOfCol.appearTime,
                        true
                      );
                    }
                  }
                }, 0.1);
              })
              .start();
          })
          .start();
          objCell.lblAnim();
          if (this.index > 12 && !SlotAstrosMachine.instance.isTurbo) {
            this.ske.active = false;
            SlotAstrosMachine.instance.unAnimWhileSpin(this.index, false);
            if (
              this.resultOfCol.id !== 1 &&
              this.resultOfCol.id !== 2 &&
              this.resultOfCol.id !== 3
            ) {
              this.nRotate.height = 115;
            }
          }
          if (this.resultOfCol.id === 1) {
            this.nRotate.width = 250;
            this.nRotate.height = 150;
            this.scheduleOnce(() => {
              SlotAstrosMachine.instance.onAnimJackPot(this.resultOfCol.index);
            }, 0.35);
          }
          if (this.resultOfCol.id === 3) {
            this.nRotate.width = 200;
            this.nRotate.height = 155;
            this.scheduleOnce(() => {
              SlotAstrosMachine.instance.onAnimWild(this.resultOfCol.index);
            }, 0.35);
          }
          if (this.resultOfCol.id === 2) {
            this.nRotate.width = 200;
            this.nRotate.height = 155;
            this.scheduleOnce(() => {
              SlotAstrosMachine.instance.onAnimBonus(this.resultOfCol.index);
            }, 0.35);
          }
          if (
            this.index === 6 ||
            this.index === 12 ||
            this.index === 17 ||
            this.index === 21 ||
            this.index === 24
          ) {
            SlotAstrosMusicManager.instance.stopLoop();
            SlotAstrosMachine.instance.reward();
          }
        }
        break;

      case 2:
        objCell.node.y = -250;
        // objCell.setRandom();
        break;
    }
  }

  public clearCells() {
    this.nContainer.children.forEach((nCell) => {
      nCell.active = false;
    });
  }

  public checkCellHL() {
    this.nContainer.children.forEach((nCell) => {
      if (nCell.y === this.listYPosOfCell[1]) {
        nCell.getComponent(SlotAstrosCell).checkHL();
      }
    });
  }

  public unActivateBlock() {
    this.nContainer.children.forEach((nCell) => {
      if (nCell.y === this.listYPosOfCell[1]) {
        nCell.getComponent(SlotAstrosCell).activateBlock(false);
      }
    });
  }
}
