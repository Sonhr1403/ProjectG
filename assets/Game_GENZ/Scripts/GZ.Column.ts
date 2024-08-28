const { ccclass, property } = cc._decorator;

import GenZCell from "./GZ.Cell";
import GenZMain from "./GZ.Controller";
import { GenZCmd } from "./GZ.Cmd";
import GenZSlotMachine from "./GZ.SlotMachine";
import GenZMusicManager, { SLOT_SOUND_TYPE } from "./GZ.MusicCtrller";
import GenZCommon from "./GZ.Common";

export enum Direction {
  Up,
  Down,
}
@ccclass
export default class GenZColumn extends cc.Component {
  public static instance: GenZColumn = null;
  @property(cc.Node)
  public nContainer: cc.Node = null;
  @property(cc.Node)
  public nContainerFree: cc.Node = null;

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
  @property(sp.Skeleton)
  public lightEffectWin: sp.Skeleton = null;

  set cellPrefab(prfCell: cc.Prefab) {
    this.prfCell = prfCell;
    this.createColumn();
  }

  ////////////////////////
  public columnNum: number;
  public stopSpinning = false;
  public setResultCount: number = 0;
  private isGlowing: boolean = false;
  private _index = 0;
  private _spinDirection: number = Direction.Down;
  private cells: Array<cc.Node> = [];
  private resultOfCol: Array<GenZCmd.ImpItemCell> = [];
  private turbo: boolean = false;
  private wildCount: number = -1;
  private wildNum: number = 0;
  private wildArrayPos = [];
  private tempWildArrayPos = [];
  // private heightCell = 130;
  private listYPosOfCell = [
    1755, 1625, 1495, 1365, 1235, 1105, 975, 845, 715, 585, 455, 325, 195, 65,
  ];
  private listYPosOfCellOnload = [65, 195, 325, 455, 585, 715, 845, 975];
  private listYPosOfCellFinal = [845, 715, 585, 455, 325, 195, 65];

  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCell[0], 0),
    cc.v3(0, this.listYPosOfCell[1], 0),
    cc.v3(0, this.listYPosOfCell[2], 0),
    cc.v3(0, this.listYPosOfCell[3], 0),
    cc.v3(0, this.listYPosOfCell[4], 0),
    cc.v3(0, this.listYPosOfCell[5], 0),
    cc.v3(0, this.listYPosOfCell[6], 0),
    cc.v3(0, this.listYPosOfCell[7], 0),
    cc.v3(0, this.listYPosOfCell[8], 0),
    cc.v3(0, this.listYPosOfCell[9], 0),
  ];
  private arrayPosOfCellOnload: Array<cc.Vec3> = [
    cc.v3(0, this.listYPosOfCellOnload[0], 0),
    cc.v3(0, this.listYPosOfCellOnload[1], 0),
    cc.v3(0, this.listYPosOfCellOnload[2], 0),
    cc.v3(0, this.listYPosOfCellOnload[3], 0),
    cc.v3(0, this.listYPosOfCellOnload[4], 0),
    cc.v3(0, this.listYPosOfCellOnload[5], 0),
    cc.v3(0, this.listYPosOfCellOnload[6], 0),
    cc.v3(0, this.listYPosOfCellOnload[7], 0),
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
    GenZColumn.instance = this;
  }

  resetCells() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(GenZCell);
      objCell.resetCell();
      objCell.changeAnimToIdle();
    });
  }

  resetFree() {
    this.wildArrayPos = [];
    this.wildArrayPos.length = 0;
    this.tempWildArrayPos = [];
    this.tempWildArrayPos.length = 0;
    this.wildCount = -1;
  }

  public createColumn(): void {
    this.nContainer.removeAllChildren(true);
    this.nContainerFree.removeAllChildren(true);
    this.cells = [];
    let maxCellNum = Math.floor(GenZCommon.getRandomNumber(3, 8));
    for (let i = 0; i < maxCellNum; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCellOnload[i];
      let objCell = nCell.getComponent(GenZCell);
      objCell.setRandom();
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
    }
  }

  public startSpinFake() {
    this.nContainer.children.forEach((nCell) => {
      const objCell = nCell.getComponent(GenZCell);
      objCell.resetCell();
      //TODO: DROP WILD TEST
      // if (
      //   this.wildCount >= 0 &&
      //   // nCell.getComponent(GenZCell).wildIndex != -1 &&
      //   objCell.instantiated == false &&
      //   this.wildArrayPos.indexOf(nCell.getComponent(GenZCell).wildIndex) > -1
      // ) {
      //   objCell.instantiated = true;
      //   let wildCell = cc.instantiate(nCell);
      //   let objCellWild = wildCell.getComponent(GenZCell);
      //   objCellWild.spCharater.node.scaleX = 0.7;
      //   this.nContainerFree.addChild(wildCell);
      //   let indexTemp = wildCell.getSiblingIndex();
      //   objCell.spCharater.node.opacity = 0;
      //   cc.tween(wildCell).to(0.6, {
      //     position: new cc.Vec3(0, this.listYPosOfCellOnload[indexTemp], 0),
      //   }).start();
      // }
    });

    this.handleFakeRotation();
  }

  public startSpinReal(data: Array<GenZCmd.ImpItemCell>, delayDrop = false) {
    // CREATE CELLS
    this.turbo = GenZMain.instance.turboState;
    if (GenZMain.instance.freeSpin == false) {
      this.nContainer.removeAllChildren(true);
    } else {
      this.nContainer.children.forEach((nCell) => {
        let objCell = nCell.getComponent(GenZCell);
        if (objCell.wildIndex >= 0) {
        } else {
          nCell.removeFromParent();
        }
      });
    }

    this.resultOfCol = data;
    this.setResultCount = 0;
    // cc.log("COLUMN DATA", this.columnNum, "\n", data, delayDrop);
    for (let i = 0; i < data.length; i++) {
      let nCell: cc.Node = cc.instantiate(this.cellPrefab);
      nCell.position = this.arrayPosOfCell[i];
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
      nCell.getComponent(GenZCell).indexInit = i;

      // cc.log("CELL DATA", data[i]);
      // if (
      //   GenZMain.instance.freeSpin == true &&
      //   GenZMain.instance.freeSpinWindowHasActivated == true
      // ) {
      //   let tempIndex2 = this.wildArrayPos.indexOf(i);
      //   // cc.log(
      //   //   "FREESPIN WILD COUNT UPDATE 0",
      //   //   data[i].id,
      //   //   tempIndex,
      //   //   tempIndex2
      //   // );
      //   if (data[i].id == 1 || data[i].id == 2) {
      //     cc.log("FREESPIN WILD COUNT UPDATE");
      //     if (this.wildCount == -1) {
      //       this.wildCount += 1;
      //       nCell.getComponent(GenZCell).wildIndex = this.wildCount;
      //       this.wildArrayPos.push(this.wildCount);
      //       cc.log(
      //         "FREESPIN WILD COUNT UPDATE 2",
      //         this.columnNum,
      //         this.wildArrayPos
      //       );
      //     } else if (this.wildCount >= 0 && tempIndex2 < 0) {
      //       this.wildCount += 1;
      //       nCell.getComponent(GenZCell).wildIndex = this.wildCount;
      //       this.wildArrayPos.push(this.wildCount);
      //       cc.log(
      //         "FREESPIN WILD COUNT UPDATE 3",
      //         this.columnNum,
      //         this.wildArrayPos
      //       );
      //     }
      //   }
      // }
    }

    //START SPIN
    //TODO: DROP WILD TEST
    // if (
    //   GenZMain.instance.freeSpin == false &&
    //   this.nContainerFree.children.length > 0
    // ) {
    //   //CLEAR WILD SYMBOLS
    //   this.nContainerFree.children.forEach((nCell) => {
    //     var normDown = cc.v3(0, -130, 0);
    //     var posDown = normDown;
    //     var timeFirstMove = 0.03;
    //     cc.tween(nCell)
    //       .by(timeFirstMove, { position: posDown }, { easing: "backIn" })
    //       .then(
    //         cc.tween(nCell).call(() => {
    //           this.checkEndCallback(nCell);
    //         })
    //       )
    //       .start();
    //   });
    // }

    this.nContainer.children.forEach((nCell) => {
      var wildDown = cc.v3(0, 0, 0);
      var normDown = cc.v3(0, -130, 0);
      var objCell = nCell.getComponent(GenZCell);
      var posDown = objCell.wildIndex > -1 ? wildDown : normDown;
      var posUp = cc.v3(0, 130, 0);
      var timeFirstMove = 0.03;
      // var timeSecondMove = this.turbo ? 0.02 : 0.06;
      var timeSecondMove =  0.06;
      var timeDelay = 0.05 * this.columnNum;
      if (delayDrop) {
        timeDelay = 1.6;
      }
      cc.tween(nCell)
        .call(() => {
          if (delayDrop) {
            this.showLightFx();
          }
        })
        .delay(this.turbo ? (delayDrop ? timeDelay : 0) : timeDelay)
        .call(() => this.reorganizeForCell(nCell, true))
        //TODO: DROP WILD TEST
        // .call(() => {
        //   if (this.nContainerFree.children.length > 0) {
        //     this.calcTheResultsFree();
        //   }
        // })
        .call(() => {
          if (objCell.jumpLoop > 0) {
            nCell.position =
              this.arrayPosOfCell[objCell.indexInit + objCell.jumpLoop];
          }
          if (objCell.indexPos > 0) {
            nCell.position =
              this.arrayPosOfCell[objCell.indexPos + objCell.jumpLoop];
          }
        })
        .repeat(
          7,
          cc.tween().by(
            timeFirstMove,
            {
              position: posDown,
            },
            { easing: "backIn" }
          )
        )
        .call(() => objCell.animAfterColumnFall())
        .call(() => {
          if (objCell.jumpLoop >= 1) {
            cc.tween(nCell)
              .delay(delayDrop ? 0 : 0.08) //0.2
              .repeat(
                objCell.jumpLoop == 1 ? 1 : objCell.jumpLoop,
                cc
                  .tween()
                  .by(
                    timeSecondMove,
                    { position: posUp },
                    { easing: "backOut" }
                  )
              )
              .start();
          }
        })
        .call(() => {
          if (delayDrop) {
            objCell.unscheduleAllCallbacks();
            objCell.effect.node.active = false;
            objCell.flexMark.node.active = false;
            this.cellErection();
            cc.tween(nCell)
              .delay(0.33)
              .call(() => this.hideLightFx())
              .call(() => objCell.animAfterColumnFall())
              .start();
          }
        })
        .call(() => {
          if (delayDrop == false) {
            this.finishColumnSpin();
          }
        })
        .call(() => {
          if (
            GenZMain.instance.freeSpin == true &&
            GenZMain.instance.freeSpinWindowHasActivated == true
          ) {
            let tempPos = Math.round(nCell.position.y);
            if (
              objCell.spCharater.skeletonData ==
                GenZSlotMachine.instance.spAtlasCharacter[1] ||
              objCell.spCharater.skeletonData ==
                GenZSlotMachine.instance.spAtlasCharacter[2]
            ) {
              if (this.wildCount == -1) {
                // this.wildCount += 1;
                this.wildNum += 1;
                let tempNum = this.wildNum - 1;
                objCell.wildIndex = tempNum;
                this.wildArrayPos.push(tempNum);
                this.tempWildArrayPos.push(this.listYPosOfCellOnload[tempNum]);
              }
              if (
                this.wildCount >= 0 &&
                this.tempWildArrayPos.indexOf(tempPos) < 0 &&
                objCell.wildIndex == -1
              ) {
                this.wildCount += 1;
                objCell.wildIndex = this.wildCount;
                this.wildArrayPos.push(this.wildCount);
                this.tempWildArrayPos.push(
                  this.listYPosOfCellOnload[this.wildCount]
                );
              }
            }
          }
        })
        .start();
    });
  }

  private cellErection() {
    if (GenZMain.instance.freeSpin == true) {
      this.wildCount += this.wildNum;
      this.wildNum = 0;
    }
    this.nContainer.children.forEach((nCell) => {
      var loopNum = nCell.getComponent(GenZCell).columnIndex;
      var highlight = nCell.getComponent(GenZCell).highLight;
      var posUp = cc.v3(0, 130 * loopNum, 0);
      // var timeFirstMove = this.turbo ? 0.003 : 0.3;
      var timeFirstMove =  0.3;

      if (loopNum > 0) {
        cc.tween(nCell)
          .parallel(
            cc
              .tween(nCell)
              .by(timeFirstMove, { position: posUp }, { easing: "smooth" }),
            // cc
            //   .tween(nCell)
            //   .call(() => nCell.getComponent(GenZCell).changeAnimToSprout()),
            cc.tween(nCell).call(() => GenZMain.instance.shakeScreen())
          )

          // .call(() => nCell.getComponent(GenZCell).hideFlexEffect())
          .start();
      }
      if (highlight == true) {
        cc.tween(nCell)
          .delay(this.turbo ? 0.05 : 0.15)
          .call(() => nCell.getComponent(GenZCell).hideFlexEffect())
          .start();
      }
      
    });
  }

  private handleFakeRotation(): void {
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posGoal = cc.v3(0, -130, 0);
      var timeFirstMove = this.turbo ? 0.04 : 0.4;
      var timeFirstMove = 0.4;
      if (nCell.position.y < 975) {
        cc.tween(nCell)
          .by(timeFirstMove, { position: posGoal }, { easing: "backIn" })
          .then(
            cc.tween(nCell).call(() => {
              this.checkEndCallback(nCell);
            })
          )
          .start();
      } else {
      }
    });
  }

  private checkEndCallback(nCell: cc.Node) {
    if (
      GenZMain.instance.freeSpin == true &&
      GenZMain.instance.freeSpinWindowHasActivated == true
    ) {
      if (
        this.wildCount >= 0 &&
        nCell.getComponent(GenZCell).wildIndex >= 0 &&
        nCell.position.y <=
          this.arrayPosOfCellOnload[nCell.getComponent(GenZCell).wildIndex].y
      ) {
        // cc.log("WILD DOWN");
        // nCell.stopAllActions();
        nCell.position =
          this.arrayPosOfCellOnload[nCell.getComponent(GenZCell).wildIndex];
      } else {
        if (nCell.position.y <= -195) {
          this.destroyCell(nCell);
        } else {
          this.loopSpin(nCell);
        }
      }
    } else {
      if (nCell.position.y <= -130) {
        this.destroyCell(nCell);
      } else {
        this.loopSpin(nCell);
      }
    }
  }

  private destroyCell(nCell: cc.Node) {
    nCell.removeFromParent(true);
    // this.dropFinalCells();
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, -130, 0);
    let timeStable = 0.03;
    cc.tween(nCell)
      .repeat(
        1,
        cc.tween().by(timeStable, { position: posMoved })
        // .call(() => {
        //   this.reorganizeForCell(nCell);
        // })
      )
      .call(() => {
        this.checkEndCallback(nCell);
      })
      .start();
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  private reorganizeForCell(
    nCell: cc.Node,
    isShowResult: boolean = false
  ): void {
    const el = nCell;
    const objCell = el.getComponent(GenZCell);
    const dirOfColumn = this.getDirection();
    if (isShowResult) {
      this.calcTheResults(nCell);
    }
  }

  private finishColumnSpin() {
    this.setResultCount += 1;
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.STOP_SPIN);
    }

    if (
      this.columnNum == (GenZSlotMachine.instance.delayDrop == true ? 5 : 6) &&
      this.setResultCount == this.nContainer.children.length
    ) {
      GenZSlotMachine.instance.finishSpin();
    }
  }

  private showLightFx() {
    if (this.isGlowing == false) {
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.LIGHT_EFFECT);
      }
      this.lightEffect.node.active = true;
      GenZSlotMachine.instance.isGlowing = true;
      this.isGlowing = true;
      this.lightEffect.skeletonData = this.columnLineWins[0];
      this.lightEffect.animation = "Start";
      this.scheduleOnce(() => {
        if (GenZMain.instance.freeSpin == true) {
          if (GenZMusicManager.instance.getSystemVolume() > 0) {
            GenZMusicManager.instance.stopPlayLoop();
            GenZMusicManager.instance.playType(
              SLOT_SOUND_TYPE.WIN_LIGHT_EFFECT
            );
          }
          this.lightEffectWin.node.active = true;
          this.lightEffectWin.animation = "Active";
          this.lightEffect.animation = "Active";
          this.isGlowing = true;
        }
        this.lightEffect.animation = "Loop";
      }, 0.3);
    }
  }

  hideLightFx() {
    if (this.isGlowing == true) {
      GenZMusicManager.instance.stopPlayLoop();
      this.isGlowing = false;
      this.lightEffect.skeletonData = this.columnLineWins[0];
      this.lightEffect.animation = "End";
      this.scheduleOnce(() => {
        this.lightEffect.animation = "Hide";
        if (GenZSlotMachine.instance.isFree == true) {
          this.lightEffectWin.animation = "Hide";
        }
        this.scheduleOnce(() => {
          this.lightEffect.node.active = false;
          this.lightEffectWin.node.active = false;
        }, 0.3);
      }, 0.3);
      GenZSlotMachine.instance.isGlowing = false;
    }
  }

  changeFinalCellState() {
    this.cellErection();
  }

  rearrangeCells(){
    this.nContainer.children.forEach((nCell) => {
      // cc.tween(nCell).stop()
      nCell.getComponent(GenZCell).hideFlexEffect()
      nCell.setPosition(0, Math.round(this.listYPosOfCellFinal[nCell.getSiblingIndex()]))
      // cc.log("TEST REARRANGE", this.columnNum , "\n", nCell.getSiblingIndex(), this.listYPosOfCellFinal[nCell.getSiblingIndex()])
    });
  }

  changeCellsWinState() {
    this.nContainer.children.forEach((nCell) => {
      nCell.getComponent(GenZCell).changeAnimToWin();
    });
  }

  private calcTheResults(nCell: cc.Node) {
    const el = nCell;
    const objCell = el.getComponent(GenZCell);
    let result = this.resultOfCol;
    const posY = el.position.y;
    if (posY === this.listYPosOfCell[0]) {
      objCell.setResult(result[0]);
    }
    if (posY === this.listYPosOfCell[1]) {
      objCell.setResult(result[1]);
    }
    if (posY === this.listYPosOfCell[2]) {
      objCell.setResult(result[2]);
    }
    if (posY === this.listYPosOfCell[3]) {
      objCell.setResult(result[3]);
    }
    if (posY === this.listYPosOfCell[4]) {
      objCell.setResult(result[4]);
    }
    if (posY === this.listYPosOfCell[5]) {
      objCell.setResult(result[5]);
    }
    if (posY === this.listYPosOfCell[6]) {
      objCell.setResult(result[6]);
    }
  }

  private calcTheResultsFree() {
    this.nContainerFree.children.forEach((nCell) => {
      const el = nCell;
      const objCell = el.getComponent(GenZCell);
      let result = this.resultOfCol;
      const posY = el.position.y;
      if (posY === this.listYPosOfCellOnload[0]) {
        objCell.setResult(result[6]);
      }
      if (posY === this.listYPosOfCellOnload[1]) {
        objCell.setResult(result[5]);
      }
      if (posY === this.listYPosOfCellOnload[2]) {
        objCell.setResult(result[4]);
      }
      if (posY === this.listYPosOfCellOnload[3]) {
        objCell.setResult(result[3]);
      }
      if (posY === this.listYPosOfCellOnload[4]) {
        objCell.setResult(result[2]);
      }
      if (posY === this.listYPosOfCellOnload[5]) {
        objCell.setResult(result[1]);
      }
      if (posY === this.listYPosOfCellOnload[6]) {
        objCell.setResult(result[0]);
      }
    });
  }
}
