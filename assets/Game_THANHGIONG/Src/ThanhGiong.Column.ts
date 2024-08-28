const { ccclass, property } = cc._decorator;

import ThanhGiongCell from "./ThanhGiong.Cell";
import ThanhGiongController from "./ThanhGiong.Controller";
import { ThanhGiongCmd } from "./ThanhGiong.Cmd";
import ThanhGiongSlotMachine from "./ThanhGiong.SlotMachine";
import ThanhGiongSoundController, {
  SLOT_SOUND_TYPE,
} from "./ThanhGiong.SoundController";
export enum Direction {
  Up,
  Down,
}
@ccclass
export default class ThanhGiongColumn extends cc.Component {
  public static instance: ThanhGiongColumn = null;
  @property(cc.Node)
  private nContainer: cc.Node = null;
  @property(cc.Node)
  private nContainerWild: cc.Node = null;
  @property(cc.Prefab)
  private prfCell: cc.Prefab = null;
  @property(cc.Node)
  private columnMask: cc.Node = null;
  @property(cc.Prefab)
  get cellPrefab(): cc.Prefab {
    return this.prfCell;
  }
  @property(sp.Skeleton)
  private lightEffect: sp.Skeleton = null;
  @property(sp.Skeleton)
  private lightEffectBehind: sp.Skeleton = null;
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
  private resultOfCol = [];
  // private resultOfCol: any = [
  //   { id: 10, idBooster: 0 },
  //   { id: 10, idBooster: 0 },
  //   { id: 10, idBooster: 0 },
  //   { id: 10, idBooster: 0 },
  // ];
  private turbo: boolean = false;
  private heightCell = 179;
  private listYPosOfCell = [447.5, 268.5, 89.5, -89.5, -268.5, -447.5];
  private isForceStop: boolean = false;
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
    ThanhGiongColumn.instance = this;
  }

  resetCells() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(ThanhGiongCell);
      objCell.resetCell();
    });
  }

  stopFakeSpin() {
    this.isForceStop = true;
  }

  public createColumn(): void {
    this.cells = [];
    this.nContainer.removeAllChildren();
    this.expandColumnMask();
    for (let i = 0; i < 6; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCell[i];
      let objCell = nCell.getComponent(ThanhGiongCell);
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
      objCell.setRandom();
    }
  }

  public startSpinFake() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.START_SPIN);
    this.reduceColumnMask();
    this.resultOfCol = [];
    this.isForceStop = false;
    this.setResultCount = 0;
    this.willGlow = false;
    this.handleFakeRotation();
    if (!ThanhGiongController.instance.getBoosterState()) {
      this.clearBooster();
    }
  }

  reduceColumnMask() {
    this.columnMask.height = 700;
    this.columnMask.width = 750;
  }

  private handleFakeRotation(): void {
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
      var timeFirstMove = 0.05;
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
    } else if (ThanhGiongController.instance.noti.active == true) {
      this.stopSpinDisconnect();
    } else {
      this.loopSpin(nCell);
    }
  }

  stopSpin() {
    this.setResultCount = 0;
    ThanhGiongSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
        })
        .call(() => {
          this.expandColumnMask();
        })
        .call(() => {
          this.reorganizeForCell(nCell, true);
        })
        .start();
    });
  }

  stopSpinDisconnect() {
    this.setResultCount = 0;
    this.expandColumnMask();
    ThanhGiongSlotMachine.instance.columnFinishSpinning = 0;
    this.nContainer.children.forEach((nCell) => {
      nCell.stopAllActions();
      cc.tween(nCell)
        .call(() => {
          nCell.setPosition(0, this.listYPosOfCell[nCell.getSiblingIndex()]);
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
    const posDown = cc.v3(0, -Math.round(this.heightCell / 50), 0);
    const posUp = cc.v3(0, Math.round(this.heightCell / 50), 0);
    const timeDecrease = 0.04;
    const timeFinishMove = 0.06;
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
      .by(0.12, { position: posDown })
      .by(0.1, { position: posUp }, { easing: "backIn" })
      .delay(0.0045)
      .call(() => {
        this.expandColumnMask();
      })
      .start();
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.05;
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
    data: Array<ThanhGiongCmd.ImpItemCell>,
    hightlight: boolean = false
  ): void {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(ThanhGiongCell);
    });
    this.isForceStop = true;

    this.willGlow = hightlight;
    this.turbo = ThanhGiongController.instance.getTurbo();
    this.resultOfCol = data;
    this.delayTime = timeDelay + 20; // 35
    if (this.willGlow == true) {
      this.delayTime = 40 * this.columnNum;
    }
    if (this.turbo == true) {
      this.delayTime = 5;
    }
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  private expandColumnMask() {
    this.columnMask.height = 780;
    this.columnMask.width = 750;
  }

  private reorganizeForCell(
    nCell: cc.Node,
    isShowResult: boolean = false
  ): void {
    const el = nCell;
    const objCell = el.getComponent(ThanhGiongCell);
    const tempIndex = this.nContainer.children.length - 1;

    if (Math.abs(nCell.position.y) > this.heightCell * 2.5) {
      objCell.setRandom();

      el.position = cc.v3(0, this.listYPosOfCell[0], 0);
    }

    if (isShowResult == true) {
      this.calcTheResults(nCell);
      this.finishColumnSpin();
    }
  }

  private finishColumnSpin() {
    if (ThanhGiongController.instance.getBoosterState) {
      ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN_BOOSTER);
    } else {
      ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN);
    }
    this.setResultCount += 1;
    this.hideLightFx();
    if (this.setResultCount == this.nContainer.children.length - 1) {
      this.setResultCount = 0;

      ThanhGiongSlotMachine.instance.finishSpin();
    }
  }

  private showLightFx() {
    if (this.isGlowing == false && this.willGlow == true) {
      if (
        ThanhGiongController.instance.vibrationEnabled == true &&
        ThanhGiongController.instance.isMobile
      ) {
        window.navigator.vibrate(1000);
      }
      ThanhGiongSoundController.instance.playTypeLoop(
        ThanhGiongSoundController.instance.lightEffect
      );
      this.isGlowing = true;
      this.lightEffect.node.active = true;
      this.lightEffect.animation = "anticreel_intro";
      this.lightEffect.scheduleOnce(() => {
        this.lightEffect.node.active = false;
        this.lightEffectBehind.node.active = true;
        this.lightEffectBehind.animation = "anticreel_idle";
      }, 1);
    }
  }

  hideLightFx() {
    if (this.isGlowing == true) {
      ThanhGiongSoundController.instance.stopPlayLoop();
      this.isGlowing = false;
      this.lightEffectBehind.animation = "anticreel_outro";
      this.lightEffectBehind.setCompleteListener(() => {
        this.lightEffectBehind.node.active = false;
      });
    }
  }

  changeFinalCellState() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(ThanhGiongCell);
      objCell.changeAnimToWin();
    });
  }

  changeCellStateScatter() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(ThanhGiongCell);
      objCell.changeAnimToScatter();
    });
  }

  activeCellRing() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(ThanhGiongCell);
      objCell.activateRing();
    });
  }

  changeCellIdleWin() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(ThanhGiongCell);
      objCell.changeAnimToIdleWin();
    });
  }

  toggleCellWinEffect() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(ThanhGiongCell);
      objCell.changeAnimToWin();
    });
  }

  private calcTheResults(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(ThanhGiongCell);
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
        objCell.setRandom();
        break;
    }
  }

  generateWildSpecial() {
    for (let i = 0; i < this.resultOfCol.length; i++) {
      if (this.resultOfCol[i].id === 10 && this.resultOfCol[i].booster > -1) {
        let tempCell = cc.instantiate(this.nContainer.children[i + 1]);
        this.nContainer.children[i + 1].getComponent(ThanhGiongCell).deactivateSpecial()
        tempCell.position = this.arrayPosOfCell[i + 1];
        let tCell = tempCell.getComponent(ThanhGiongCell);
        tCell.setResult(this.resultOfCol[i]);
        let tempChecker: number = 0;
        for (let j = 0; j < this.nContainerWild.children.length; j++) {
          if (
            tempCell.position.y == this.nContainerWild.children[j].position.y
          ) {
            tempChecker += 1;
          }
        }
        if (tempChecker === 0 && this.nContainerWild.children.length < 4) {
          this.nContainerWild.addChild(tempCell);
          tCell.deactivateSpecial()
          tCell.activateRing();
        }
      }
    }
  }

  clearBooster() {
    this.nContainerWild.removeAllChildren();
  }

  getBoosterContainerLength() {
    return this.nContainerWild.children.length;
  }

  deactivateRings() {
    var limit = this.getBoosterContainerLength() + 1;
    var currentIndex: number = 0;
    cc.tween(this)
      .tag(3)
      .repeat(
        limit,
        cc
          .tween(this)
          .call(() => {
            if (currentIndex == limit - 1) {
              ThanhGiongSlotMachine.instance.countUpBooster();
            } else {
              this.nContainerWild.children[currentIndex]
                .getComponent(ThanhGiongCell)
                .deactivateRing();
              cc.log(this.nContainerWild.children[currentIndex].getComponent(ThanhGiongCell).getBoosterId())

              let indexPos = this.listYPosOfCell.indexOf(this.nContainerWild.children[currentIndex].position.y)
              ThanhGiongSlotMachine.instance.playAnimCountUp(indexPos, this.columnNum, this.nContainerWild.children[currentIndex].getComponent(ThanhGiongCell).getBoosterId())
              currentIndex += 1;
            }
          })
          .delay(0.5)
      )
      .start();
  }
}
