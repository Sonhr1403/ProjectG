const { ccclass, property } = cc._decorator;

import VanessaCell from "./Vanessa.Cell";
import VanessaMain from "./Vanessa.Controller";
import { VanessaCmd } from "./Vanessa.Cmd";
import VanessaSlotMachine from "./Vanessa.SlotMachine";
import VanessaSoundController, {
  SLOT_SOUND_TYPE,
} from "./Vanessa.SoundController";
export enum Direction {
  Up,
  Down,
}
@ccclass
export default class VanessaColumn extends cc.Component {
  public static instance: VanessaColumn = null;
  @property(cc.Node)
  private nContainer: cc.Node = null;
  @property(cc.Prefab)
  private prfCell: cc.Prefab = null;

  @property(cc.Prefab)
  get cellPrefab(): cc.Prefab {
    return this.prfCell;
  }
  @property(dragonBones.ArmatureDisplay)
  private lightEffect: dragonBones.ArmatureDisplay = null;
  set cellPrefab(prfCell: cc.Prefab) {
    this.prfCell = prfCell;
    this.createColumn();
  }
  @property(cc.Node)
  private columnMask: cc.Node = null;
  ////////////////////////
  public columnNum: number;
  public willGlow: boolean = false;
  private setResultCount: number = 0;
  private delayTime: number = 0;
  private isGlowing: boolean = false;
  private _index = 0;
  private _spinDirection: number = Direction.Down;
  private cells: Array<cc.Node> = [];
  private resultOfCol: Array<VanessaCmd.ImpItemCell> = [];
  private isFree: boolean = false;
  private turbo: boolean = false;
  private heightCell = 260;
  private listYPosOfCell = [450, 225, 0, -225, -450];
  private isForceStop: boolean = false;
  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCell[0], 0),
    cc.v3(0, this.listYPosOfCell[1], 0),
    cc.v3(0, this.listYPosOfCell[2], 0),
    cc.v3(0, this.listYPosOfCell[3], 0),
    cc.v3(0, this.listYPosOfCell[4], 0),
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
    VanessaColumn.instance = this;
  }

  resetCells() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(VanessaCell);
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
    }
    for (let i = 0; i < 5; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCell[i];
      let objCell = nCell.getComponent(VanessaCell);
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
      objCell.setRandom();
    }
  }

  public startSpinFake() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(VanessaCell);
      objCell.resetCell();
    });
    if (VanessaSoundController.instance.getSystemVolume() > 0) {
      VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    }
    this.reduceColumnMask()
    this.resultOfCol = [];
    this.isForceStop = false;
    this.setResultCount = 0;
    this.willGlow = false;
    this.handleFakeRotation();
  }

  reduceColumnMask(){
    // cc.log("REDUCE")
    this.columnMask.height = 680;
    this.columnMask.width = 360;
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
  }

  private checkEndCallback(nCell: cc.Node) {
    if (this.isForceStop == true) {
      this.brakeSuddenly(nCell);
    } else if (VanessaMain.instance.noti.active == true) {
      this.stopSpinDisconnect();
    } else {
      this.loopSpin(nCell);
    }
  }

  stopSpin() {
    this.setResultCount = 0;
    VanessaSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.getComponent(VanessaCell).resetCell();
        })
        .call(() => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
        })
        .call(() => {
          this.reorganizeForCell(nCell, true);
          // this.reorganizeForCell(nCell);
        })
        .start();
    });
  }

  stopSpinDisconnect() {
    this.setResultCount = 0;
    VanessaSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.getComponent(VanessaCell).resetCell();
        })
        .call(() => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
        })
        .call(() => {
          // this.reorganizeForCell(nCell, true);
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
    data: Array<VanessaCmd.ImpItemCell>,
    isFree: boolean = false,
    hightlight: boolean = false
  ): void {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(VanessaCell);
      objCell.resetCell();
    });
    this.isForceStop = true;

    this.willGlow = hightlight;
    this.turbo = VanessaMain.instance.getTurbo();
    this.isFree = isFree;
    this.resultOfCol = data;
    this.delayTime = timeDelay + 20; // 35
    if (this.willGlow == true) {
      this.delayTime = 30 * this.columnNum;
    }
    if (this.turbo == true) {
      this.delayTime = 5;
    }
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  private reorganizeForCell(
    nCell: cc.Node,
    isShowResult: boolean = false
  ): void {
    const el = nCell;
    const objCell = el.getComponent(VanessaCell);
    const tempIndex = this.nContainer.children.length - 1;
    if (el.position.y < this.listYPosOfCell.slice(-1)[0] * 1.5) {
      if (VanessaMain.instance.getFreeSpin() == true) {
        if (VanessaMain.instance.featureWillAppear) {
          if (
            VanessaSlotMachine.instance.powerSpinColumn.indexOf(
              this.columnNum
            ) > -1
          ) {
            objCell.setRandomWild();
          }
        } else {
          if (this.columnNum == 2) {
            objCell.setRandomWild();
          }
        }
      } else {
        objCell.setRandom();
      }
      el.position = cc.v3(0, this.listYPosOfCell[0], 0);
    }
    if (isShowResult == true) {
      this.calcTheResults(nCell);
      this.finishColumnSpin();
    }
  }

  private finishColumnSpin() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN);
    this.columnMask.height = 730;
    this.columnMask.width = 360;

    this.setResultCount += 1;
    this.hideLightFx();
    if (this.setResultCount == this.nContainer.children.length - 1) {
      this.setResultCount = 0;
      VanessaSlotMachine.instance.finishSpin();
    }
  }

  private showLightFx() {
    if (this.isGlowing == false && this.willGlow == true) {
      if (
        VanessaMain.instance.vibrationEnabled == true &&
        VanessaMain.instance.isMobile
      ) {
        window.navigator.vibrate(1000);
      }
      VanessaSoundController.instance.playTypeLoop(
        VanessaSoundController.instance.lightEffect
      );
      VanessaSlotMachine.instance.isGlowing = true;
      this.isGlowing = true;
      this.lightEffect.node.active = true;
      let animationLight = "4sym";
      this.lightEffect.playAnimation(animationLight, 0);
    }
  }

  hideLightFx() {
    if (this.isGlowing == true) {
      VanessaSoundController.instance.stopPlayLoop();
      this.isGlowing = false;
      this.lightEffect.node.active = false;
      VanessaSlotMachine.instance.isGlowing = false;
    }
  }

  changeFinalCellState() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(VanessaCell);
      objCell.changeAnimToWin();
    });
  }

  changeCellStateScatter() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(VanessaCell);
      objCell.changeAnimToScatter();
    });
  }

  changeCellAttackState() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(VanessaCell);
      objCell.cellAttack();
    });
  }

  changeCellIdleWin() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(VanessaCell);
      objCell.changeAnimToIdleWin();
    });
  }

  toggleCellWinEffect() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(VanessaCell);
      objCell.toggleWinEffects();
    });
  }

  private calcTheResults(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(VanessaCell);
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
      default:
        objCell.setRandom();
        break;
    }
  }
}
