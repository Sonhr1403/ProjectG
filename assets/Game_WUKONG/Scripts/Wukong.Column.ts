// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator;

import WukongCell from "./Wukong.Cell";
import WukongMain from "./Wukong.Controller";
import { WukongCmd } from "./Wukong.Cmd";
import WukongSlotMachine from "./Wukong.SlotMachine";
import WukongMusicManager, { SLOT_SOUND_TYPE } from "./Wukong.MusicManager";

export enum Direction {
  Up,
  Down,
}
@ccclass
export default class WukongColumn extends cc.Component {
  public static instance: WukongColumn = null;
  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property(cc.Prefab)
  public prfCell: cc.Prefab = null;

  @property(cc.Prefab)
  get cellPrefab(): cc.Prefab {
    return this.prfCell;
  }

  @property(sp.SkeletonData)
  public columnLineWins: sp.SkeletonData[] = [];

  @property(sp.Skeleton)
  public lightEffect: sp.Skeleton = null;

  set cellPrefab(prfCell: cc.Prefab) {
    this.prfCell = prfCell;
    this.createColumn();
  }

  ////////////////////////
  public columnNum: number;
  public stopSpinning = false;
  public setResultCount: number = 0;
  private scheduleVar;
  private delayTime: number = 0;
  private isGlowing: boolean = false;
  private _index = 0;
  private _spinDirection: number = Direction.Down;
  private cells: Array<cc.Node> = [];
  private resultOfCol: Array<WukongCmd.ImpItemCell> = [];
  private isFree: boolean = false;
  private turbo: boolean = false;
  private willGlow: boolean = false;
  private scatterState: boolean = false;
  private scatterNum: number = 0;
  private jackpotNum: number = 0;
  private heightCell = 264;
  private listYPosOfCell = [528, 264, 0, -264, -528];
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
    WukongColumn.instance = this;
  }

  resetCells() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      objCell.resetCell()
      objCell.changeAnimToIdle();
    });
  }

  public createColumn(): void {
    this.nContainer.removeAllChildren();
    this.cells = [];
    for (let i = 0; i < 5; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCell[i];
      let objCell = nCell.getComponent(WukongCell);
      objCell.setRandom();
      objCell.setIndex(i);
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
    }
  }
  public createColumnHistory(arr): void {
    this.spinDirection = Direction.Down;
    this.resultOfCol = arr;
    this.nContainer.removeAllChildren();
    this.cells = [];
    for (let i = 0; i < 5; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCell[i];
      let objCell = nCell.getComponent(WukongCell);
      this.calcTheResultsHistory(nCell);
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
    }
  }

  stopFakeSpin() {
    // cc.log("STOP");
    this.isForceStop = true;
  }

  // checkEndCallback(): void {
  //   if (this.stopSpinning) {
  //     this.nContainer.children.forEach((nCell) => {
  //       nCell.stopAllActions();
  //       cc.tween(nCell).stop();
  //     });

  //     this.readyStop();
  //   } else {
  //   }
  // }

  public readyStop(): void {
    cc.error("doStop HHHHH");
    this.stopSpinning = true;
    for (let i = 0; i < 5; i++) {
      this.nContainer.children[i].setPosition(0, this.listYPosOfCell[i]);
    }
    // this.nContainer.children.forEach((nCell) => {
    //   const dirOfColumn = this.getDirection();
    //   var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    //   var numberRepeatFinish = 5;
    //   if (this.willGlow == true) {
    //     numberRepeatFinish = 10 * this.columnNum;
    //   }
    //   var timeDecrease = 0.1;
    //   var timeFinishMove = 0.2;
    //   let t1 = cc
    //     .tween(nCell)
    //     .repeat(
    //       numberRepeatFinish,
    //       cc
    //         .tween()
    //         .by(timeDecrease, { position: posMoved })
    //         .call(() => {
    //           this.reorganizeForCell(nCell);
    //         })
    //     )
    //     .by(timeFinishMove, { position: posMoved })
    //     .call(() => {
    //       this.reorganizeForCell(nCell, true);
    //     })
    //     .by(timeFinishMove, { position: posMoved }, { easing: "bounceOut" })
    //     .call(() => {
    //       this.reorganizeForCell(nCell);
    //       nCell.getComponent(WukongCell).changeAnimToIdle();
    //     })
    //     .start();
    // });
  }
  public startSpinFake(timeDelay) {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      objCell.resetCell();
    });
    this.isForceStop = false;
    this.handleFakeRotation(timeDelay);
  }

  private handleFakeRotation(timeDelay: number): void {
    // cc.log("FAKE");
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
      var timeFirstMove = 0.4;
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

  private loopSpin(nCell: cc.Node) {
    cc.log("LOOPSPIN");
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.03;
    nCell.getComponent(WukongCell).changeAnimToSpin();
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

  private brakeSuddenly(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    const posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
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
      .by(timeFinishMove, { position: posMoved }, { easing: "bounceOut" })
      .call(() => {
        this.reorganizeForCell(nCell, true);
        nCell.getComponent(WukongCell).changeAnimToIdle();
      })
      .start();
  }

  public startSpin(
    timeDelay: number,
    data: Array<WukongCmd.ImpItemCell>,
    isFree: boolean = false,
    hightlight: boolean = false
  ): void {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      objCell.resetCell();
    });
    this.isForceStop = true;
    this.scatterNum = 0;
    this.jackpotNum = 0;
    // cc.log("startSpin", this.columnNum, timeDelay);
    this.scatterState = false;
    this.willGlow = false
    this.willGlow = hightlight;
    this.turbo = WukongMain.instance.turboState;
    this.isFree = isFree;
    this.isGlowing = false
    this.resultOfCol = data;
    for (let i = 0; i < 3; i++) {
      if (data[i].id == 2) {
        this.scatterState = true;
        this.scatterNum += 1;
      } else if (data[i].id == 1) {
        this.scatterState = true;
        this.jackpotNum += 1;
      }
    }
    this.delayTime = timeDelay + 20 + 15;
    if (this.willGlow == true) {
      this.delayTime = 40 * this.columnNum;
    }
    if (this.turbo == true) {
      this.delayTime = 5;
      if (this.willGlow == true) {
        this.delayTime = 25 * this.columnNum;
      }
    }
    if (isFree == true) {
      // cc.log("FREESPINTEST")
      this.handleIncreasingRotation(timeDelay);
    }
  }

  public stayStill(data: Array<WukongCmd.ImpItemCell>) {
    this.resultOfCol = data;
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      objCell.resetCell();
      this.calcTheResultsHistory(nCell);
    });
    WukongSlotMachine.instance.columnFinishSpinning += 1;
    WukongSlotMachine.instance.finishSpin();
  }

  public stayStillFake() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      objCell.resetCell();
      // this.calcTheResultsHistory(nCell);
    });
    WukongSlotMachine.instance.columnFinishSpinning += 1;
    WukongSlotMachine.instance.finishSpin();
  }

  public pushStayStillData(data: Array<WukongCmd.ImpItemCell>) {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      this.calcTheResultsHistory(nCell);
    });
    WukongSlotMachine.instance.columnFinishSpinning += 1;
    WukongSlotMachine.instance.finishSpin();
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  private handleIncreasingRotation(timeDelay: number): void {
    this.stopSpinning = false;
    // const checkEnd = cc.tween().call(() => this.checkEndCallback());
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(WukongCell);
      // objCell.resetCell();
      const dirOfColumn = this.getDirection();
      // objCell.setDirection(this.spinDirection);
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
      let numberRepeatInCrease = timeDelay;
      // let numberRepeatInCrease = 10;
      if (this.turbo == true) {
        numberRepeatInCrease = 1;
        if (this.willGlow == true) {
          numberRepeatInCrease = timeDelay;
        }
      }

      var timeFirstMove = 0.1;
      var timeInCrease = 0.05;
      cc.tween(nCell)
        // .delay(timeDelay)
        .by(timeFirstMove, { position: posMoved }, { easing: "backIn" })
        .call(() => {
          this.reorganizeForCell(nCell);
        })
        .repeat(
          numberRepeatInCrease,
          cc
            .tween()
            .by(timeInCrease, { position: posMoved })
            .call(() => {
              this.reorganizeForCell(nCell);
            })
        )

        .call(() => {
          this.handleStableRotation(nCell);
        })
        // .then(checkEnd)
        .start();
    });
  }

  private handleStableRotation(elCell: cc.Node = null): void {
    elCell.getComponent(WukongCell).changeAnimToSpin();
    // const checkEnd = cc.tween().call(() => this.checkEndCallback());
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.075;
    let numberRepeatStable = 20;
    if (this.willGlow == true) {
      numberRepeatStable = 10 * this.columnNum;
    }
    if (this.turbo == true) {
      numberRepeatStable = 1;
      if (this.willGlow == true) {
        numberRepeatStable = 10 * this.columnNum;
      }
    }

    cc.tween(elCell)
      .repeat(
        numberRepeatStable,
        cc
          .tween()
          .by(timeStable, { position: posMoved })
          .call(() => {
            this.reorganizeForCell(elCell);
          })
      )
      .call(() => {
        this.handleDecreasingRotation(elCell);
      })
      // .then(checkEnd)
      .start();
  }

  private handleDecreasingRotation(nCell: cc.Node): void {
    const dirOfColumn = this.getDirection();
    // const checkEnd = cc.tween().call(() => this.checkEndCallback());
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    var numberRepeatFinish = 15;
    if (this.willGlow == true) {
      numberRepeatFinish = 15 * this.columnNum;
    }
    if (this.turbo == true) {
      numberRepeatFinish = 1;
      if (this.willGlow == true) {
        numberRepeatFinish = 10 * this.columnNum;
      }
    }

    var timeDecrease = 0.1;
    var timeFinishMove = 0.2;
    let t1 = cc
      .tween(nCell)
      .repeat(
        numberRepeatFinish,
        cc
          .tween()
          .by(timeDecrease, { position: posMoved })
          .call(() => {
            this.reorganizeForCell(nCell);
          })
      )
      .by(timeFinishMove, { position: posMoved })
      .call(() => {
        this.reorganizeForCell(nCell, true);
      })
      .by(timeFinishMove, { position: posMoved }, { easing: "bounceOut" })
      .call(() => {
        this.reorganizeForCell(nCell);
        nCell.getComponent(WukongCell).changeAnimToIdle();
      })
      // .then(checkEnd)
      // .call(() => {
      //   if (WukongSlotMachine.instance.scatterCount < 3) {
      //     this.hideLightFx();
      //   }
      // })
      .start();
  }

  private reorganizeForCell(
    nCell: cc.Node,
    isShowResult: boolean = false
  ): void {
    if (
      // WukongSlotMachine.instance.isGlowing == false &&
      // WukongSlotMachine.instance.isSpinning == true &&
      this.columnNum == WukongSlotMachine.instance.columnFinish
    ) {
      this.showLightFx();
    }
    const el = nCell;
    const objCell = el.getComponent(WukongCell);
    const dirOfColumn = this.getDirection();
    if (Math.abs(el.position.y * dirOfColumn) > this.heightCell * 2) {
      this.isFree == true ? objCell.setRandomFreeSpin() : objCell.setRandom();
      if (
        this.columnNum == 2 &&
        this.isFree == true &&
        WukongSlotMachine.instance.stayStill == false
      ) {
        objCell.setResult(
          {
            id: 80,
            oldId: -1,
            highlight: false,
          },
          false
        );
      }
      el.position = cc.v3(0, -(this.heightCell * 2 * dirOfColumn), 0);
    }
    this.setNewIndexForCell(nCell);
    if (isShowResult) {
      this.calcTheResults(nCell);
      this.finishColumnSpin();
    }
  }

  private finishColumnSpin() {
    this.hideLightFx();
    this.setResultCount += 1;
    if (this.setResultCount == 5) {
      WukongSlotMachine.instance.columnFinishSpinning += 1;

      if (this.scatterState == true) {
        WukongSlotMachine.instance.scatterCount += this.scatterNum;
        WukongSlotMachine.instance.jackpotCount += this.jackpotNum;
       
      }
      this.setResultCount = 0;
      if (this.willGlow == true) {
        this.showLightWinFx();
      }

      WukongSlotMachine.instance.finishSpin();
    }
  }

  private setNewIndexForCell(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(WukongCell);
    switch (el.position.y) {
      case this.listYPosOfCell[0]:
        objCell.setIndex(0);
        break;
      case this.listYPosOfCell[1]:
        objCell.setIndex(1);
        break;
      case this.listYPosOfCell[2]:
        objCell.setIndex(2);
        break;
      case this.listYPosOfCell[3]:
        objCell.setIndex(3);
        break;
      case this.listYPosOfCell[4]:
        objCell.setIndex(4);
        break;
    }
  }

  private showLightFx() {
    if (this.isGlowing == false) {
      if (
        WukongSlotMachine.instance.scatterCount >= 2 ||
        WukongSlotMachine.instance.jackpotCount >= 2
      ) {
        WukongMusicManager.instance.playTypeLoop(
          WukongMusicManager.instance.lightEffect
        );
        WukongMain.instance.shakeScreen();
        WukongSlotMachine.instance.isGlowing = true;
        this.isGlowing = true;
        this.lightEffect.skeletonData = this.columnLineWins[0];
        this.lightEffect.animation = "Loop";
      }
    }
  }
  hideLightFx() {
    if (this.isGlowing == true) {
      WukongMusicManager.instance.stopPlayLoop();
      WukongMain.instance.stopShakeScreen();
      this.isGlowing = false;
      this.lightEffect.skeletonData = this.columnLineWins[0];
      this.lightEffect.animation = "End";
      this.scheduleOnce(() => {
        this.lightEffect.animation = "Hide";
      }, 0.3);
      WukongSlotMachine.instance.isGlowing = false;
    }
  }
  private showLightWinFx() {
    if (this.scatterState == true) {
      WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.LIGHT_EFFECT_END);
      this.lightEffect.skeletonData = this.columnLineWins[1];
      this.lightEffect.animation = "Active";
      this.isGlowing = true;
      this.scheduleOnce(() => {
        this.lightEffect.skeletonData = this.columnLineWins[0];
        this.lightEffect.animation = "Hide";
      }, 2);
    }
  }

  changeFinalCellState() {
    this.nContainer.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(WukongCell);
      let result = this.resultOfCol;
      const posY = el.position.y;
      objCell.changeAnimToWin(this.isFree, this.columnNum);
    });
  }

  private calcTheResultsHistory(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(WukongCell);
    let result = this.resultOfCol;
    const posY = el.position.y;
    if (this.spinDirection === Direction.Down) {
      if (posY === this.listYPosOfCell[1]) {
        objCell.setResult(result[0], true); //0
      }
      if (posY === this.listYPosOfCell[2]) {
        objCell.setResult(result[1], true);
      }
      if (posY === this.listYPosOfCell[3]) {
        objCell.setResult(result[2], true); //2
      }
      if (posY === this.listYPosOfCell[4]) {
        objCell.setRandomFreeSpin();
      }
      if (posY === this.listYPosOfCell[0]) {
        objCell.setRandomFreeSpin();
      }
    }
  }

 
  private calcTheResults(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(WukongCell);
    let result = this.resultOfCol;
    const posY = el.position.y;
    if (this.isFree == false) {
      if (posY === this.listYPosOfCell[1]) {
        objCell.setResult(result[0], false);
        if (result[0].id - 1 === 1) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
          // this.scatterState = true;
        }
      }
      if (posY === this.listYPosOfCell[2]) {
        objCell.setResult(result[1], false);
        if (result[1].id - 1 === 1) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
          // this.scatterState = true;
        }
      }
      if (posY === this.listYPosOfCell[3]) {
        objCell.setResult(result[2], false);
        if (result[2].id - 1 === 1) {
          WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
          // this.scatterState = true;
        }
      }
      if (posY === this.listYPosOfCell[4]) {
        objCell.setRandom();
      }
      if (posY === this.listYPosOfCell[0]) {
        objCell.setRandom();
      }
    }
    // else {
    //   if (posY === this.listYPosOfCell[0]) {
    //     this.isFree == true ? objCell.setRandomFreeSpin() : objCell.setRandom();
    //     if (
    //       this.columnNum == 2 &&
    //       this.isFree == true &&
    //       WukongSlotMachine.instance.stayStill == false
    //     ) {
    //       objCell.setResult(
    //         {
    //           id: 80,
    //           oldId: -1,
    //           highlight: false,
    //         },
    //         false
    //       );
    //     }
    //   }
    //   if (posY === this.listYPosOfCell[1]) {
    //     this.isFree == true ? objCell.setRandomFreeSpin() : objCell.setRandom();
    //     if (
    //       this.columnNum == 2 &&
    //       this.isFree == true &&
    //       WukongSlotMachine.instance.stayStill == false
    //     ) {
    //       objCell.setResult(
    //         {
    //           id: 80,
    //           oldId: -1,
    //           highlight: false,
    //         },
    //         false
    //       );
    //     }
    //   }
    //   if (posY === this.listYPosOfCell[2]) {
    //     objCell.setResult(result[2], false);
    //     if (result[2].id - 1 === 1) {
    //       WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
    //       // this.scatterState = true;
    //     }
    //   }
    //   if (posY === this.listYPosOfCell[3]) {
    //     objCell.setResult(result[1], false);
    //     if (result[1].id - 1 === 1) {
    //       WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
    //       // this.scatterState = true;
    //     }
    //   }
    //   if (posY === this.listYPosOfCell[4]) {
    //     objCell.setResult(result[0], false);
    //     if (result[0].id - 1 === 1) {
    //       WukongMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
    //       // this.scatterState = true;
    //     }
    //   }
    // }
    else if (this.isFree == true) {
      cc.log("FREESPINCALCRES")
      if (posY === this.listYPosOfCell[0]) {
        if (
          this.columnNum == 2 &&
          WukongSlotMachine.instance.stayStill == false
        ) {
          objCell.setResult(
            {
              id: 80,
              oldId: -1,
              highlight: false,
            },
            false
          );
        }
        objCell.setResult(
          result[0],
          WukongSlotMachine.instance.almostEndFreeSpin
        );
      }
      if (posY === this.listYPosOfCell[1]) {
        if (
          this.columnNum == 2 &&
          WukongSlotMachine.instance.stayStill == false
        ) {
          objCell.setResult(
            {
              id: 80,
              oldId: -1,
              highlight: false,
            },
            false
          );
        }
        objCell.setResult(
          result[1],
          WukongSlotMachine.instance.almostEndFreeSpin
        );
      }
      if (posY === this.listYPosOfCell[2]) {
        if (
          this.columnNum == 2 &&
          WukongSlotMachine.instance.stayStill == false
        ) {
          objCell.setResult(
            {
              id: 80,
              oldId: -1,
              highlight: false,
            },
            false
          );
        }

        objCell.setResult(
          result[2],
          WukongSlotMachine.instance.almostEndFreeSpin
        );
      }
      if (posY === this.listYPosOfCell[4]) {
        objCell.setRandomFreeSpin();
      }
      if (posY === this.listYPosOfCell[3]) {
        objCell.setRandomFreeSpin();
      }
    }
  }
}
