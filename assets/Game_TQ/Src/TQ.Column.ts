// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator;

import TQCell from "./TQ.Cell";
import TQMain from "./TQ.Controller";
import { TQCmd } from "./TQ.Cmd";
import TQSlotMachine from "./TQ.SlotMachine";
import TQSoundController, { SLOT_SOUND_TYPE } from "./TQ.SoundController";
export enum Direction {
  Up,
  Down,
}
@ccclass
export default class TQColumn extends cc.Component {
  public static instance: TQColumn = null;
  @property(cc.Node)
  public nContainer: cc.Node = null;
  @property(cc.Node)
  public nContainerWild: cc.Node = null;
  @property(dragonBones.ArmatureDisplay)
  private wildFireEffect: dragonBones.ArmatureDisplay = null;
  @property(dragonBones.ArmatureDisplay)
  private wildBombEffect: dragonBones.ArmatureDisplay = null;
  @property(cc.Node)
  public maskContainer: cc.Node = null;
  @property(cc.Prefab)
  public prfCell: cc.Prefab = null;
  @property(cc.Prefab)
  public prfCellWild: cc.Prefab = null;
  @property(cc.Prefab)
  get cellPrefab(): cc.Prefab {
    return this.prfCell;
  }
  @property(dragonBones.ArmatureDisplay)
  public lightEffect: dragonBones.ArmatureDisplay = null;
  set cellPrefab(prfCell: cc.Prefab) {
    this.prfCell = prfCell;
    this.createColumn();
  }
  ////////////////////////
  public columnNum: number;
  public stopSpinning = false;
  public setResultCount: number = 0;
  private delayTime: number = 0;
  private isGlowing: boolean = false;
  private _index = 0;
  private _spinDirection: number = Direction.Down;
  private cells: Array<cc.Node> = [];
  private resultOfCol: Array<TQCmd.ImpItemCell> = [];
  private isFree: boolean = false;
  private turbo: boolean = false;
  private willGlow: boolean = false;
  public isLongColumn: boolean = false;
  private heightCell = 175;
  private listYPosOfCell = [350, 175, 0, -175, -350];
  private listYPosOfCellFree = [437.5, 262.5, 87.5, -87.5, -262.5, -437.5];
  private listYPosOfCellLong = [437.5, 262.5, 87.5, -87.5, -262.5, -437.5];
  private listYPosOfCellLongFree = [525, 350, 175, 0, -175, -350, -525];
  private isForceStop: boolean = false;
  private columnPosArray = [];
  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCell[0], 0),
    cc.v3(0, this.listYPosOfCell[1], 0),
    cc.v3(0, this.listYPosOfCell[2], 0),
    cc.v3(0, this.listYPosOfCell[3], 0),
    cc.v3(0, this.listYPosOfCell[4], 0),
  ];
  private arrayPosOfCellLong: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCellLong[0], 0),
    cc.v3(0, this.listYPosOfCellLong[1], 0),
    cc.v3(0, this.listYPosOfCellLong[2], 0),
    cc.v3(0, this.listYPosOfCellLong[3], 0),
    cc.v3(0, this.listYPosOfCellLong[4], 0),
    cc.v3(0, this.listYPosOfCellLong[5], 0),
    cc.v3(0, this.listYPosOfCellLong[6], 0),
  ];
  private arrayPosOfCellFree: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCellFree[0], 0),
    cc.v3(0, this.listYPosOfCellFree[1], 0),
    cc.v3(0, this.listYPosOfCellFree[2], 0),
    cc.v3(0, this.listYPosOfCellFree[3], 0),
    cc.v3(0, this.listYPosOfCellFree[4], 0),
    cc.v3(0, this.listYPosOfCellFree[5], 0),
  ];
  private arrayPosOfCellLongFree: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCellLongFree[0], 0),
    cc.v3(0, this.listYPosOfCellLongFree[1], 0),
    cc.v3(0, this.listYPosOfCellLongFree[2], 0),
    cc.v3(0, this.listYPosOfCellLongFree[3], 0),
    cc.v3(0, this.listYPosOfCellLongFree[4], 0),
    cc.v3(0, this.listYPosOfCellLongFree[5], 0),
    cc.v3(0, this.listYPosOfCellLongFree[6], 0),
    cc.v3(0, this.listYPosOfCellLongFree[7], 0),
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
    TQColumn.instance = this;
  }

  resetCells() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(TQCell);
      objCell.resetCell();
      objCell.changeAnimToIdle();
    });
  }

  stopFakeSpin() {
    this.isForceStop = true;
  }

  public createColumn(): void {
    this.nContainerWild.removeAllChildren();
    if (this.cells.length >= 0) {
      this.cells = [];
      this.nContainer.removeAllChildren();
    }
    this.columnPosArray = [];
    this.maskContainer.height = this.isLongColumn ? 700 : 525;
    let maxCellNum = this.isLongColumn ? 6 : 5;
    if (TQMain.instance.freeSpin == true) {
      maxCellNum += 1;
      this.maskContainer.height = this.isLongColumn ? 875 : 700;
    }
    for (let i = 0; i < maxCellNum; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      let nCellWild: cc.Node = cc.instantiate(this.prfCellWild);
      if (TQMain.instance.freeSpin == true) {
        nCell.position = this.isLongColumn
          ? this.arrayPosOfCellLongFree[i]
          : this.arrayPosOfCellFree[i];
        nCellWild.position = this.isLongColumn
          ? this.arrayPosOfCellLongFree[i]
          : this.arrayPosOfCellFree[i];
        this.columnPosArray = this.isLongColumn
          ? this.listYPosOfCellLongFree
          : this.listYPosOfCellFree;
      } else {
        nCell.position = this.isLongColumn
          ? this.arrayPosOfCellLong[i]
          : this.arrayPosOfCell[i];
        nCellWild.position = this.isLongColumn
          ? this.arrayPosOfCellLong[i]
          : this.arrayPosOfCell[i];
        this.columnPosArray = this.isLongColumn
          ? this.listYPosOfCellLong
          : this.listYPosOfCell;
      }
      let objCell = nCell.getComponent(TQCell);
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
      this.nContainerWild.addChild(nCellWild);
      nCellWild.active = false;
      objCell.setRandom();
      this.hideWildEffect()
    }
  }

  public startSpinFake() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(TQCell);
      objCell.resetCell();
    });
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    }
    this.resultOfCol = [];
    this.isForceStop = false;
    this.setResultCount = 0;
    this.handleFakeRotation();
  }

  private handleFakeRotation(): void {
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posGoal = cc.v3(0, -130, 0);
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
    } else {
      this.loopSpin(nCell);
    }
  }

  stopSpin() {
    this.setResultCount = 0;
    TQSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      // this.turbo = TQMain.instance.turboState;
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.getComponent(TQCell).resetCell();
        })
        .call(() => {
          nCell.setPosition(0, this.columnPosArray[nCell.getSiblingIndex()]);
        })
        .call(() => {
          this.reorganizeForCell(nCell, true);
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
        nCell.setPosition(0, this.columnPosArray[nCell.getSiblingIndex()]);
        this.reorganizeForCell(nCell, true);
      })
      .by(0.15, { position: posDown })
      .by(0.1, { position: posUp }, { easing: "backIn" })
      .call(() => this.hideWildEffect())
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
    data: Array<TQCmd.ImpItemCell>,
    isFree: boolean = false,
    hightlight: boolean = false
  ): void {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(TQCell);
      objCell.resetCell();
    });
    this.isForceStop = true;
    this.willGlow = false;
    this.willGlow = hightlight;
    this.turbo = TQMain.instance.getTurboState();
    this.isFree = isFree;
    this.isGlowing = false;
    this.resultOfCol = data;
    if (TQSlotMachine.instance.isBombWild == true) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].bomb === 1) {
          if (TQSoundController.instance.getSystemVolume() > 0) {
            TQSoundController.instance.playType(
              SLOT_SOUND_TYPE.SPECIAL_WILD_ACTIVE
            );
          }
          let bomb = this.wildBombEffect;
          bomb.node.setPosition(this.columnPosArray[i + 1], 0, 0);
          bomb.node.active = true;
          bomb.playAnimation("bomb", -1);
          bomb.once(
            dragonBones.EventObject.COMPLETE,
            () => {
              bomb.node.active = false;
              
            },
            bomb
          );
          this.scheduleOnce(() => {
            TQSlotMachine.instance.generateWild();
          }, 0.44);
        }
      }
    }

    this.delayTime = timeDelay + 30; // 35
    if (this.willGlow == true) {
      this.delayTime = 40 * this.columnNum;
    }
    if (this.turbo == true) {
      this.delayTime = TQSlotMachine.instance.bombWillAppear ? 20 : 5;
      // if (this.willGlow == true) {
      //   this.delayTime = 25 * this.columnNum;
      // }
    }
    if (isFree == true) {
    }
  }

  generateWildSpecial() {
    if (TQMain.instance.vibrationEnabled == true && TQMain.instance.isMobile) {
      window.navigator.vibrate(1000);
    }
    for (let i = 0; i < this.resultOfCol.length; i++) {
      if (this.resultOfCol[i].id == 1 || this.resultOfCol[i].id == 3) {
        this.nContainerWild.children[this.isLongColumn ? i + 1 : i].active =
          true;
      }
    }
  }

  testBomb() {
    let bomb = this.wildBombEffect;
    bomb.node.setPosition(0, this.columnPosArray[2], 0);
    bomb.node.active = true;
    bomb.playAnimation("bomb", -1);
    bomb.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        bomb.node.active = false;
        // TQSlotMachine.instance.generateWild();
      },
      bomb
    );
    this.scheduleOnce(() => {
      TQSlotMachine.instance.generateWild();
    }, 0.4);
  }

  toggleFire() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.SPECIAL_WILD_ACTIVE);
    }
    this.wildFireEffect.node.active = true;
    this.wildFireEffect.playAnimation("ani", -1);
    this.wildFireEffect.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        this.generateWildSpecial();
      },
      this.wildFireEffect
    );
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  private reorganizeForCell(
    nCell: cc.Node,
    isShowResult: boolean = false
  ): void {
    if (this.columnNum == TQSlotMachine.instance.columnFinish) {
      this.showLightFx();
    }
    const el = nCell;
    const objCell = el.getComponent(TQCell);

    const tempIndex = this.nContainer.children.length - 1;
    if (el.position.y < this.columnPosArray.slice(-1)[0]) {
      objCell.setRandom();
      el.position = cc.v3(0, this.columnPosArray[0], 0);
    }

    if (isShowResult == true) {
      TQMain.instance.freeSpin
        ? this.calcTheResultsFree(nCell)
        : this.calcTheResults(nCell);
      this.finishColumnSpin();
    }
  }

  private finishColumnSpin() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN);
    }
    this.setResultCount += 1;
    if (this.setResultCount == this.nContainer.children.length - 1) {
      this.hideLightFx();
      this.setResultCount = 0;
      this.hideWildEffect();
      TQSlotMachine.instance.finishSpin();
    }
  }

  hideWildEffect() {
    for (let i = 0; i < this.nContainerWild.children.length; i++) {
      this.nContainerWild.children[i].active = false;
    }
  }

  private showLightFx() {
    if (this.isGlowing == false && this.willGlow == true) {
      if (
        TQMain.instance.vibrationEnabled == true &&
        TQMain.instance.isMobile
      ) {
        window.navigator.vibrate(1000);
      }
      TQSoundController.instance.playTypeLoop(
        TQSoundController.instance.lightEffect
      );
      TQSlotMachine.instance.isGlowing = true;
      this.isGlowing = true;
      this.lightEffect.node.active = true;
      let animationLight = "4sym";
      this.lightEffect.playAnimation(animationLight, 0);
    }
  }

  hideLightFx() {
    if (this.isGlowing == true) {
      TQSoundController.instance.stopPlayLoop();
      this.isGlowing = false;
      this.lightEffect.node.active = false;
      TQSlotMachine.instance.isGlowing = false;
    }
  }

  // private showLightWinFx() {
  //   //TODO: REMAKE ALL
  //   if (this.scatterState == true) {
  //     TQMusicManager.instance.playType(SLOT_SOUND_TYPE.LIGHT_EFFECT_END);
  //     this.isGlowing = true;
  //     // this.scheduleOnce(() => {
  //     // }, 2);
  //   }
  // }

  changeFinalCellState() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(TQCell);
      objCell.changeAnimToWin();
    });
  }

  changeCellIdleWin() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(TQCell);
      objCell.changeAnimToIdleWin();
    });
  }

  private calcTheResults(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(TQCell);
    let result = this.resultOfCol;
    const posY = el.position.y;
    if (this.isLongColumn == false) {
      if (posY === this.columnPosArray[0]) {
        objCell.setResult(result[0]);
      }
      if (posY === this.columnPosArray[1]) {
        objCell.setResult(result[1]);
      }
      if (posY === this.columnPosArray[2]) {
        objCell.setResult(result[2]);
      }
      if (posY === this.columnPosArray[3]) {
        objCell.setResult(result[3]);
      }
      if (posY === this.columnPosArray[4]) {
        objCell.setRandom();
      }
    } else {
      if (posY === this.columnPosArray[1]) {
        objCell.setResult(result[0]);
      }
      if (posY === this.columnPosArray[2]) {
        objCell.setResult(result[1]);
      }
      if (posY === this.columnPosArray[3]) {
        objCell.setResult(result[2]);
      }
      if (posY === this.columnPosArray[4]) {
        objCell.setResult(result[3]);
      }
      if (posY === this.columnPosArray[0]) {
        objCell.setRandom();
      }
      if (posY === this.listYPosOfCellLong[5]) {
        objCell.setRandom();
      }
    }
  }

  private calcTheResultsFree(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(TQCell);
    let result = this.resultOfCol;
    const posY = el.position.y;
    if (this.isLongColumn == false) {
      if (posY === this.listYPosOfCellFree[0]) {
        objCell.setResult(result[0]);
      }
      if (posY === this.listYPosOfCellFree[1]) {
        objCell.setResult(result[1]);
      }
      if (posY === this.listYPosOfCellFree[2]) {
        objCell.setResult(result[2]);
      }
      if (posY === this.listYPosOfCellFree[3]) {
        objCell.setResult(result[3]);
      }
      if (posY === this.listYPosOfCellFree[4]) {
        objCell.setResult(result[4]);
      }
      if (posY === this.listYPosOfCellFree[5]) {
        objCell.setRandom();
      }
    } else {
      if (posY === this.listYPosOfCellLongFree[1]) {
        objCell.setResult(result[0]);
      }
      if (posY === this.listYPosOfCellLongFree[2]) {
        objCell.setResult(result[1]);
      }
      if (posY === this.listYPosOfCellLongFree[3]) {
        objCell.setResult(result[2]);
      }
      if (posY === this.listYPosOfCellLongFree[4]) {
        objCell.setResult(result[3]);
      }
      if (posY === this.listYPosOfCellLongFree[5]) {
        objCell.setResult(result[4]);
      }
      if (posY === this.listYPosOfCellLongFree[0]) {
        objCell.setRandom();
      }
      if (posY === this.listYPosOfCellLongFree[6]) {
        objCell.setRandom();
      }
    }
  }
}
