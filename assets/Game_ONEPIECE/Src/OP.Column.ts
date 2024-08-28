const { ccclass, property } = cc._decorator;

import OPCell from "./OP.Cell";
import OPController from "./OP.Controller";
import { OPCmd } from "./OP.Cmd";
import OPSlotMachine from "./OP.SlotMachine";
import OPSoundController, { SLOT_SOUND_TYPE } from "./OP.SoundController";
export enum Direction {
  Up,
  Down,
}
@ccclass
export default class OPColumn extends cc.Component {
  public static instance: OPColumn = null;
  @property(cc.Node)
  private nContainer: cc.Node = null;
  @property(cc.Node)
  private nContainerSpecial: cc.Node = null;
  @property(cc.Prefab)
  private prfCell: cc.Prefab = null;
  @property(cc.Node)
  private columnMask: cc.Node = null;
  @property(cc.Node)
  private longWild: cc.Node = null;
  @property(cc.Prefab)
  get cellPrefab(): cc.Prefab {
    return this.prfCell;
  }
  @property(sp.Skeleton)
  private lightEffect: sp.Skeleton = null;
  set cellPrefab(prfCell: cc.Prefab) {
    this.prfCell = prfCell;
    this.createColumn();
  }
  ////////////////////////
  public columnNum: number;
  public willGlow: boolean = false;
  private setResultCount: number = 0;
  private delayTime: number = 0;
  private isGlowing: boolean = false;
  private _index = 0;
  private _spinDirection: number = Direction.Down;
  private cells: Array<cc.Node> = [];
  private resultOfCol: Array<any> = [];
  private turbo: boolean = false;
  private heightCell = 154;
  private listYPosOfCell = [385, 231, 77, -77, -231, -385];
  private isForceStop: boolean = false;
  private wildDirection: number = 0; // -1 = Up ; 1 = Down
  private loopTime: number = 0; //
  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCell[0], 0),
    cc.v3(0, this.listYPosOfCell[1], 0),
    cc.v3(0, this.listYPosOfCell[2], 0),
    cc.v3(0, this.listYPosOfCell[3], 0),
    cc.v3(0, this.listYPosOfCell[4], 0),
    cc.v3(0, this.listYPosOfCell[5], 0),
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
    OPColumn.instance = this;
  }

  resetCells() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(OPCell);
      objCell.resetCell();
      objCell.changeAnimToIdle();
    });
  }

  stopFakeSpin() {
    this.isForceStop = true;
  }

  public createColumn(): void {
    if (this.cells.length >= 0) {
      this.cells = [];
      this.nContainer.removeAllChildren();
      this.nContainerSpecial.removeAllChildren();
    }
    for (let i = 0; i < 6; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCell[i];
      let objCell = nCell.getComponent(OPCell);
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
      OPController.instance.getFreespinState()
        ? objCell.setRandomWild()
        : objCell.setRandom();
    }
    // this.longWild.active = false;
    this.changeColumnMask(false);
  }

  public startSpinFake() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(OPCell);
      objCell.resetCell();
    });
    if (OPSoundController.instance.getSystemVolume() > 0) {
      OPSoundController.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    }
    this.resultOfCol = [];
    this.isForceStop = false;
    this.setResultCount = 0;
    this.willGlow = false;
    this.changeColumnMask(true);
    this.handleFakeRotation();
  }

  private handleFakeRotation(): void {
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
      var timeFirstMove = 0.07;
      cc.tween(nCell)
        .by(timeFirstMove, { position: posMoved }, { easing: "backIn" })
        .then(
          cc.tween(nCell).call(() => {
            this.reorganizeForCell(nCell);
          })
        )
        .then(
          cc.tween(nCell).call(() => {
            this.checkEndCallback(nCell);
          })
        )
        .start();
    });
    if (this.longWild.active == true) {
      const dirOfColumn = this.getDirection();
      var timeFirstMove = 0.08;
      cc.tween(this.longWild)
        .repeat(
          4,
          cc
            .tween()
            .by(
              timeFirstMove,
              { position: cc.v3(0, this.heightCell * dirOfColumn, 0) },
              { easing: "smooth" }
            )
        )
        .then(
          cc.tween(this.longWild).call(() => {
            this.longWild.active = false;
          })
        )
        .start();
    }
  }

  private changeColumnMask(reduce: boolean = false) {
    if (reduce) {
      this.columnMask.height = 610;
      this.columnMask.width = 750;
    } else {
      this.columnMask.height = 700;
      this.columnMask.width = 750;
    }
  }

  private checkEndCallback(nCell: cc.Node) {
    if (this.isForceStop == true) {
      this.brakeSuddenly(nCell);
    } else if (OPController.instance.noti.active == true) {
      this.stopSpinDisconnect();
    } else {
      this.loopSpin(nCell);
    }
  }

  stopSpin() {
    this.setResultCount = 0;
    OPSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.getComponent(OPCell).resetCell();
        })
        .call(() => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
        })
        .call(() => {
          this.changeColumnMask(false);
        })
        .call(() => {
          this.reorganizeForCell(nCell, true);
        })
        .start();
    });
  }

  stopSpinDisconnect() {
    this.setResultCount = 0;
    OPSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.getComponent(OPCell).resetCell();
        })
        .call(() => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
        })
        .call(() => {
          this.changeColumnMask(false);
        })
        .call(() => {
          this.reorganizeForCell(nCell);
        })
        .start();
    });
  }

  private brakeSuddenly(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    const posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    const posDown = cc.v3(0, -Math.round(this.heightCell / 20), 0);
    const posUp = cc.v3(0, Math.round(this.heightCell / 20), 0);
    const timeDecrease = 0.06;
    const timeFinishMove = 0.08;
    cc.tween(nCell)
      .repeat(
        this.delayTime,
        cc
          .tween()
          .by(timeDecrease, { position: posMoved })
          .call(() => {
            this.reorganizeForCell(nCell);
          })
      )
      .by(timeFinishMove, { position: posMoved }, { easing: "backIn" })
      .call(() => {
        nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
        this.reorganizeForCell(nCell, true);
      })
      .by(0.15, { position: posDown })
      .by(0.1, { position: posUp }, { easing: "backIn" })
      .delay(0.0045)
      .call(() => {
        this.changeColumnMask(false);
      })
      .start();
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.07;
    cc.tween(nCell)
      .repeat(
        1,
        cc
          .tween()
          .by(timeStable, { position: posMoved })
          .call(() => {
            this.reorganizeForCell(nCell);
          })
      )
      .call(() => {
        this.checkEndCallback(nCell);
      })
      .start();
  }

  public startSpin(
    timeDelay: number,
    data: Array<any>,
    hightlight: boolean = false
  ): void {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(OPCell);
      objCell.resetCell();
    });
    this.isForceStop = true;
    this.willGlow = hightlight;
    this.turbo = OPController.instance.turboState;
    this.resultOfCol = data;
    this.delayTime = timeDelay + 20; // 35
    if (this.willGlow == true) {
      this.delayTime = 30 * this.columnNum;
    }
    if (this.turbo == true) {
      this.delayTime = 5;
    }
    if (OPController.instance.getFreespinState()) {
      cc.log(`startSpin ${this.columnNum}`);
      this.getDirectionForWild(data);
    }
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  getDirectionForWild(data) {
    let firstValue = data[0].id;
    let secondValue = data[1].id;
    let thirdValue = data[2].id;
    let fourthValue = data[3].id;
    if (firstValue == 0 && fourthValue != 0) {
      this.wildDirection = -1;
      this.loopTime = 18;
      if (secondValue == 0) {
        this.loopTime = 12;
        if (thirdValue == 0) {
          this.loopTime = 6;
        }
      }
    } else if (firstValue != 0 && fourthValue == 0) {
      this.wildDirection = 1;
      this.loopTime = 18;
      if (thirdValue == 0) {
        this.loopTime = 12;
        if (secondValue == 0) {
          this.loopTime = 6;
        }
      }
    } else {
      this.wildDirection = 0;
      this.loopTime = 0;
    }
  }

  moveWildColumn() {
    if (this.loopTime > 0 && this.wildDirection != 0) {
      this.changeColumnMask(true);
      this.longWild.setPosition(0, 4, 0);
      this.longWild.active = true;
      this.longWild.getComponent(sp.Skeleton).setAnimation(0, "merge", false);

      this.nContainer.children.forEach((nCell) => {
        var posMoved = cc.v3(0, this.heightCell * this.wildDirection, 0);
        var timeFirstMove = 0.1; //timeMove
        cc.tween(nCell)
          .delay(0.11)
          .by(timeFirstMove, { position: posMoved }, { easing: "backIn" })
          .call(() => {
            this.reorganizeForCellWild(nCell);
          })
          .call(() => {
            this.checkEndCallbackWild(nCell);
          })
          .start();
      });
    }
  }

  private reorganizeForCell(
    nCell: cc.Node,
    isShowResult: boolean = false
  ): void {
    const el = nCell;
    const objCell = el.getComponent(OPCell);
    // if (Math.abs(nCell.position.y) > this.heightCell * 2.5) {
    if (Math.abs(nCell.position.y) > 420) {
      objCell.setRandom();
      el.position = cc.v3(0, this.listYPosOfCell[0], 0);
    }
    if (isShowResult == true) {
      this.calcTheResults(nCell);
      this.finishColumnSpin();
    }
  }

  private checkEndCallbackWild(nCell: cc.Node) {
    if (this.loopTime == 0) {
      // this.longWild.getComponent(sp.Skeleton).setAnimation(0, "wild_long_default", false);
      cc.tween(nCell)
        .delay(1.1)
        .call(() => {
          // this.nContainer.children.forEach((nCell) => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
          if (nCell.position.y < 385 && nCell.position.y > -385) {
            nCell.getComponent(OPCell).hideTexture();
          }
          // });
        })
        .call(() => {
          this.changeColumnMask();
        })
        .start();
    } else {
      this.loopTime -= 1;
      this.loopSpinWild(nCell);
    }
  }

  private loopSpinWild(nCell: cc.Node) {
    var posMoved = cc.v3(0, this.heightCell * this.wildDirection, 0);
    let timeStable = 0.1; //timeMove
    cc.tween(nCell)
      .by(timeStable, { position: posMoved })
      .call(() => {
        this.reorganizeForCellWild(nCell);
      })
      .call(() => {
        this.checkEndCallbackWild(nCell);
      })
      .start();
  }

  private reorganizeForCellWild(nCell: cc.Node): void {
    const el = nCell;
    const objCell = el.getComponent(OPCell);
    if (Math.abs(nCell.position.y) > this.heightCell * 2.5) {
      objCell.setRandomWild();
      if (this.wildDirection === -1) {
        el.position = cc.v3(0, this.listYPosOfCell[0], 0);
      } else if (this.wildDirection === 1) {
        el.position = cc.v3(0, this.listYPosOfCell[5], 0);
      }
    }
  }

  private finishColumnSpin() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN);

    this.setResultCount += 1;
    this.hideLightFx();
    if (this.setResultCount == this.nContainer.children.length - 1) {
      this.setResultCount = 0;
      OPSlotMachine.instance.finishSpin();
      this.nContainerSpecial.removeAllChildren();
    }
  }

  private showLightFx() {
    if (this.isGlowing == false && this.willGlow == true) {
      if (
        OPController.instance.vibrationEnabled == true &&
        OPController.instance.isMobile
      ) {
        window.navigator.vibrate(1000);
      }
      OPSoundController.instance.playTypeLoop(
        OPSoundController.instance.lightEffect
      );
      OPSlotMachine.instance.isGlowing = true;
      this.isGlowing = true;
      this.lightEffect.node.active = true;
      this.lightEffect.animation = "animation";
    }
  }

  hideLightFx() {
    if (this.isGlowing == true) {
      OPSoundController.instance.stopPlayLoop();
      this.isGlowing = false;
      this.lightEffect.node.active = false;
      OPSlotMachine.instance.isGlowing = false;
    }
  }

  changeFinalCellState() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(OPCell);
      objCell.changeAnimToWin();
    });
  }

  changeCellStateScatter() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(OPCell);
      objCell.changeAnimToScatter();
    });
  }

  changeCellIdleWin() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(OPCell);
      objCell.changeAnimToIdleWin();
    });
  }

  toggleCellWinEffect() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(OPCell);
      objCell.toggleWinEffects();
    });
  }

  fireCell() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(OPCell);
      objCell.punchCell();
    });
  }

  getLongWildActive() {
    return this.longWild.active;
  }

  changeAnimWildToWin() {
    let anim = this.longWild.getComponent(sp.Skeleton);
    anim.animation = "wild_long_active";
    anim.setCompleteListener(() => {
      if (anim.animation != "wild_long_default") {
        anim.animation = "wild_long_default";
        anim.unscheduleAllCallbacks();
      }
    });
  }

  private calcTheResults(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(OPCell);
    let result = this.resultOfCol;
    const posY = el.position.y;
    switch (posY) {
      case this.listYPosOfCell[1]:
        objCell.setResult(result[0]);
        break;
      case this.listYPosOfCell[2]:
        objCell.setResult(result[1]);
        break;
      case this.listYPosOfCell[3]:
        objCell.setResult(result[2]);
        break;
      case this.listYPosOfCell[4]:
        objCell.setResult(result[3]);
        break;
      default:
        OPController.instance.getFreespinState()
          ? objCell.setRandomWild()
          : objCell.setRandom();
        break;
    }
  }
}
