import { SlotCmd } from "./SongKran.Cmd";
import SongKranColumn, { Direction } from "./SongKran.Column";
import SongKranCommon from "./SongKran.Common";
import SongKranController from "./SongKran.Controller";
import SongKranFootBar from "./SongKran.FootBar";
import SongKranFreeGame from "./SongKran.FreeGame";
import SongKranHeadBar from "./SongKran.HeadBar";
import SongKranMusicManager, { SLOT_SOUND_TYPE } from "./SongKran.Music";
import SongKranNumericalHelper from "./SongKran.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SongKranMachine extends cc.Component {
  public static instance: SongKranMachine = null;

  @property({ type: sp.SkeletonData })
  public listSyms: sp.SkeletonData[] = [];

  @property(cc.SpriteFrame)
  public listSymsSpr: cc.SpriteFrame[] = [];

  @property(cc.Node)
  public listCellAnim: cc.Node[] = [];

  @property(cc.Prefab)
  private columnPrefab: cc.Prefab = null;

  @property(cc.Node)
  private columnContainer: cc.Node = null;

  @property(sp.Skeleton)
  private line: sp.Skeleton = null;

  @property(cc.Node)
  private mat: cc.Node = null;

  @property(cc.Node)
  private lblWin: cc.Node = null;

  @property(cc.Node)
  private pnWin: cc.Node = null;

  @property(cc.Prefab)
  private labelWinTurbo: cc.Prefab = null;

  ////////////////////////////////////////////////////
  private numberColumn = 5;

  private columns: Array<cc.Node> = [];
  private columnResult: Array<Array<SlotCmd.ImpItemCell>> = [];

  private thisRoundResult: SlotCmd.ImpData = null;

  private winType: number = -1;

  private totalNum: number = 0;

  public isTurbo: boolean = false;

  private indexHL: number = -1;
  private result: SlotCmd.ImpResult = null;

  public wildCount: number = 0;

  public wildStart: number = -1;
  public wildEnd: number = -1;
  private isWildEnd: boolean = false;
  private isWildNudge: boolean = false;
  private wildNudgeColsList: Array<number> = [];

  private isJackPot: boolean = false;
  private isFreeGame: boolean = false;
  private onFreeGame: boolean = false;
  private endFreeGame: boolean = false;

  onLoad() {
    SongKranMachine.instance = this;
  }

  public forceStop() {
    // this.createMachine();
  }

  public createMachine(data: SlotCmd.ImpData): void {
    SongKranCommon.runLog("data", data);
    this.thisRoundResult = data;
    this.columnContainer.removeAllChildren();
    this.columns = [];

    this.processData();

    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      newColumn.name = i.toString();
      this.columns[i] = newColumn;
      this.columnContainer.addChild(newColumn);

      let objColumn = newColumn.getComponent(SongKranColumn);
      objColumn.index = i;
      objColumn.ske.active = false;
      objColumn.createColumnCell(this.columnResult[i]);
    }
  }

  public setAnimCells() {
    for (let i = 0; i < 20; i++) {
      let cell = this.listCellAnim[i];
      cell.active = true;
      let cellSke = cell.getChildByName("ske").getComponent(sp.Skeleton);
      cellSke.skeletonData = this.listSyms[this.thisRoundResult.listCell[i].id];
      cellSke.defaultAnimation = "default";

      if (
        this.thisRoundResult.listCell[i].id !== 0 &&
        this.thisRoundResult.listCell[i].id !== 1
      ) {
        cellSke.defaultAnimation = SlotCmd.STATE_OF_ANIM.IDLE;
        cellSke.node.y = 0;
      } else {
        let animName = "";
        if (this.thisRoundResult.listCell[i].wildLength !== -1) {
          switch (this.thisRoundResult.listCell[i].wildLength) {
            case 2:
              if (this.thisRoundResult.listCell[i].wildUpper) {
                if (this.thisRoundResult.listCell[i].index < 5) {
                  cellSke.node.y = 85;
                } else if (this.thisRoundResult.listCell[i].index < 10) {
                  cellSke.node.y = 255;
                }
              } else {
                if (this.thisRoundResult.listCell[i].index < 15) {
                  cellSke.node.y = -255;
                } else if (this.thisRoundResult.listCell[i].index < 20) {
                  cellSke.node.y = -85;
                }
              }
              animName = SlotCmd.STATE_OF_ANIM.BEGIN;
              break;

            case 3:
              if (this.thisRoundResult.listCell[i].wildUpper) {
                if (this.thisRoundResult.listCell[i].index < 5) {
                  cellSke.node.y = -85;
                } else if (this.thisRoundResult.listCell[i].index < 10) {
                  cellSke.node.y = 85;
                } else if (this.thisRoundResult.listCell[i].index < 15) {
                  cellSke.node.y = 255;
                }
              } else {
                if (this.thisRoundResult.listCell[i].index < 10) {
                  cellSke.node.y = -255;
                } else if (this.thisRoundResult.listCell[i].index < 15) {
                  cellSke.node.y = -85;
                } else if (this.thisRoundResult.listCell[i].index < 20) {
                  cellSke.node.y = 85;
                }
              }
              animName = SlotCmd.STATE_OF_ANIM.BEGIN;
              break;

            case 4:
              if (this.thisRoundResult.listCell[i].index < 5) {
                cellSke.node.y = -255;
              } else if (this.thisRoundResult.listCell[i].index < 10) {
                cellSke.node.y = -85;
              } else if (this.thisRoundResult.listCell[i].index < 15) {
                cellSke.node.y = 85;
              } else if (this.thisRoundResult.listCell[i].index < 20) {
                cellSke.node.y = 255;
              }
              animName = SlotCmd.STATE_OF_ANIM.TRANS;
              break;

            default:
              break;
          }
        } else {
          if (this.thisRoundResult.listCell[i].index < 5) {
            cellSke.node.y = 255;
          } else {
            cellSke.node.y = -255;
          }
          animName = SlotCmd.STATE_OF_ANIM.BEGIN;
        }
        // }
        cellSke.defaultAnimation = animName;
      }
      cell.active = false;
    }
  }

  public startSpinVirtual() {
    this.unschedule(this.highlight);
    this.unAnim();
    this.mat.active = false;
    this.wildCount = 0;
    this.isTurbo = SongKranController.instance.getIsTurbo();
    SongKranFootBar.instance.closeWinLbl();

    SongKranMusicManager.instance.playLoop(SLOT_SOUND_TYPE.REALSPINNING);

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(SongKranColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.spinVirtual(0);
    }
  }

  public letGo(data: SlotCmd.ImpData): void {
    SongKranCommon.runLog("data", data);
    this.thisRoundResult = data;

    this.processData();
    this.setAnimCells();
    this.setAnimWN();

    this.pushData();
  }

  private processData() {
    this.columnResult = [[], [], [], [], []];
    this.isWildNudge = false;
    this.wildNudgeColsList = [];
    for (let i = 0; i < this.thisRoundResult.listCell.length; i++) {
      let r = i % 5;
      this.columnResult[r].push(this.thisRoundResult.listCell[i]);
      if (this.thisRoundResult.listCell[i].wildNudge) {
        this.isWildNudge = true;
        if (!this.wildNudgeColsList.includes(r)) {
          this.wildNudgeColsList.push(r);
        }
      }
    }

    this.checkWild();

    this.checkWinType(
      this.thisRoundResult.betAmount,
      this.thisRoundResult.totalProfit
    );

    if (this.thisRoundResult.type === 2) {
      this.isJackPot = true;
    } else {
      this.isJackPot = false;
    }

    if (this.thisRoundResult.type === 3) {
      this.isFreeGame = true;
    } else {
      this.isFreeGame = false;
    }

    if (this.thisRoundResult.currentRound < this.thisRoundResult.totalRound) {
      this.onFreeGame = true;
    } else {
      this.onFreeGame = false;
    }

    if (
      this.thisRoundResult.currentRound &&
      this.thisRoundResult.currentRound === this.thisRoundResult.totalRound
    ) {
      this.endFreeGame = true;
    } else {
      this.endFreeGame = false;
    }
  }

  private pushData() {
    let delay = 0;
    let inc = 1;
    if (this.isTurbo) {
      inc = 0;
    }

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(SongKranColumn);
      objColumn.spinDirection = Direction.Down;
      this.scheduleOnce(() => {
        objColumn.pushData(this.columnResult[i], i);
      }, delay);
      delay += inc;
    }
  }

  public runAnim(index: number, anim: string) {
    this.listCellAnim[index].active = true;
    this.listCellAnim[index]
      .getChildByName("ske")
      .getComponent(sp.Skeleton)
      .setAnimation(0, anim, false);
  }

  public doneSpin() {
    SongKranCommon.runLog(
      "isFreeGame",
      this.isFreeGame,
      "onFreeGame",
      this.onFreeGame,
      "endFreeGame",
      this.endFreeGame,
      "isJackPot",
      this.isJackPot
    );
    let timeWN = 0;
    if (this.isWildNudge) {
      for (let i = 0; i < this.wildNudgeColsList.length; i++) {
        this.columns[this.wildNudgeColsList[i]]
          .getComponent(SongKranColumn)
          .runWildNugde();
      }
      SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.REALNUDGE);
      timeWN = 2;
    }
    this.scheduleOnce(() => {
      if (this.isTurbo) {
        this.continueWithTurbo();
      } else {
        this.continueWithOutTurbo();
      }
    }, timeWN);
  }

  private continueWithTurbo() {
    if (this.thisRoundResult.totalProfit > 0) {
      SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.WINNINGSOUND_1);
      let money = cc.instantiate(this.labelWinTurbo);
      this.pnWin.addChild(money);
      money.getComponent(cc.Label).string = SongKranCommon.numberWithCommas(
        this.thisRoundResult.totalProfit
      );
      cc.tween(money)
        .tag(3)
        .by(1, { position: cc.v3(0, 600, 0) })
        .call(() => money.removeFromParent(true))
        .start();
      this.scheduleOnce(() => {
        cc.tween(money).to(0.5, { opacity: 0 }).start();
      }, 0.5);
      if (!SongKranController.instance.getIAS()) {
        this.indexHL = -1;
        this.mat.active = true;
        this.highlight();
        this.schedule(this.highlight, 2, cc.macro.REPEAT_FOREVER);
      }
    }
    SongKranFootBar.instance.setWinLblTurbo(this.thisRoundResult.totalProfit);
    SongKranHeadBar.instance.setCurrentBalance(
      this.thisRoundResult.currentMoney
    );
    this.endGame();
  }

  private continueWithOutTurbo() {
    if (this.thisRoundResult.listResult.length > 0) {
      SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.WINNINGSOUND_1);
      this.checkHL();
      this.scheduleOnce(() => {
        this.indexHL = -1;
        this.highlight();
        this.schedule(this.highlight, 2, cc.macro.REPEAT_FOREVER);
        if (this.winType > 0) {
          this.openWin();
        } else {
          SongKranFootBar.instance.openWinLbl();
          SongKranFootBar.instance.scheduleForLbl(
            this.thisRoundResult.totalProfit,
            2 * this.thisRoundResult.listResult.length - 1
          );
          this.scheduleOnce(() => {
            SongKranHeadBar.instance.setCurrentBalance(
              this.thisRoundResult.currentMoney
            );
            this.endGame();
          }, 2 * this.thisRoundResult.listResult.length);
        }
      }, 1);
    } else {
      this.endGame();
    }
  }

  private endGame(){
    if (
      this.isFreeGame ||
      this.onFreeGame ||
      this.endFreeGame ||
      this.isJackPot
    ) {
      this.checkFreeGame();

      if (this.isJackPot) {
        this.runJackPot();
      }
    } else {
      SongKranController.instance.checkAutoSpin();
    }
  }

  private checkHL() {
    this.mat.active = true;
    for (let i = 0; i < 20; i++) {
      if (this.thisRoundResult.listCell[i].highlight) {
        this.listCellAnim[i].active = true;
        if (
          this.thisRoundResult.listCell[i].id !== 0 &&
          this.thisRoundResult.listCell[i].id !== 1 &&
          !this.thisRoundResult.listCell[i].wildNudge
        ) {
          this.listCellAnim[i]
            .getChildByName("ske")
            .getComponent(sp.Skeleton)
            .setAnimation(0, SlotCmd.STATE_OF_ANIM.TWO, true);
        } else {
          if (
            this.thisRoundResult.listCell[i].wildLength === 4 ||
            this.thisRoundResult.listCell[i].wildNudge ||
            ((this.thisRoundResult.listCell[i].id === 0 ||
              this.thisRoundResult.listCell[i].id === 1) &&
              this.thisRoundResult.listCell[i].wildNudge !== undefined &&
              !this.thisRoundResult.listCell[i].wildNudge)
          ) {
            this.listCellAnim[i]
              .getChildByName("ske")
              .getComponent(sp.Skeleton)
              .setAnimation(0, SlotCmd.STATE_OF_ANIM.TRANS, false);
            if (this.thisRoundResult.listCell[i].id === 0) {
              SongKranMusicManager.instance.playType(
                SLOT_SOUND_TYPE.WILDMULTIPLIER_OPENX2
              );
            } else if (this.thisRoundResult.listCell[i].id === 1) {
              SongKranMusicManager.instance.playType(
                SLOT_SOUND_TYPE.WILDMULTIPLIER_OPENX3
              );
            }
          } else {
            this.listCellAnim[i]
              .getChildByName("ske")
              .getComponent(sp.Skeleton)
              .setAnimation(0, SlotCmd.STATE_OF_ANIM.BEGIN, true);
          }
        }
        let r = this.thisRoundResult.listCell[i].index % 5;
        this.columns[r]
          .getComponent(SongKranColumn)
          .turnCellOff(this.thisRoundResult.listCell[i].index);
      }
    }
  }

  private highlight() {
    this.unAnim();
    this.getIndexHL();
    this.showHL();
  }

  private getIndexHL() {
    if (this.indexHL === this.thisRoundResult.listResult.length - 1) {
      this.indexHL = 0;
    } else {
      this.indexHL += 1;
    }
    this.result = this.thisRoundResult.listResult[this.indexHL];
  }

  private showHL() {
    this.result.listRowIndexCols.forEach((hL) => {
      if (this.thisRoundResult.listCell[hL].highlight) {
        this.listCellAnim[hL].active = true;
        if (
          this.thisRoundResult.listCell[hL].id !== 0 &&
          this.thisRoundResult.listCell[hL].id !== 1 &&
          !this.thisRoundResult.listCell[hL].wildNudge
        ) {
          this.listCellAnim[hL]
            .getChildByName("ske")
            .getComponent(sp.Skeleton)
            .setAnimation(0, SlotCmd.STATE_OF_ANIM.TWO, true);
        } else {
          if (
            this.thisRoundResult.listCell[hL].wildLength === 4 ||
            this.thisRoundResult.listCell[hL].wildNudge ||
            ((this.thisRoundResult.listCell[hL].id === 0 ||
              this.thisRoundResult.listCell[hL].id === 1) &&
              this.thisRoundResult.listCell[hL].wildNudge !== undefined &&
              !this.thisRoundResult.listCell[hL].wildNudge)
          ) {
            this.listCellAnim[hL]
              .getChildByName("ske")
              .getComponent(sp.Skeleton)
              .setAnimation(0, SlotCmd.STATE_OF_ANIM.TWO, true);
          } else {
            this.listCellAnim[hL]
              .getChildByName("ske")
              .getComponent(sp.Skeleton)
              .setAnimation(0, SlotCmd.STATE_OF_ANIM.BEGIN, true);
          }
        }
        let r = hL % 5;
        this.columns[r].getComponent(SongKranColumn).turnCellOff(hL);
      }
    });
    let idHL = this.getIdHL();
    if (idHL > -1) {
      this.line.setAnimation(0, "line_" + (idHL + 1), true);
    }
  }

  private listArrIndexHL = [
    [0, 1, 2, 3, 4],
    [0, 6, 12, 8, 4],
    [0, 6, 2, 8, 4],
    [0, 1, 2, 8, 4],
    [0, 1, 7, 8, 4],
    [0, 6, 7, 3, 4],
    [0, 6, 2, 3, 4],
    [0, 1, 12, 8, 4],
    [0, 6, 12, 3, 4],
    [0, 1, 12, 3, 4],
    [0, 1, 7, 3, 4],
    [0, 6, 7, 8, 4],
    [5, 6, 7, 8, 9],
    [5, 6, 7, 3, 9],
    [5, 11, 7, 8, 9],
    [5, 1, 7, 8, 9],
    [5, 11, 2, 13, 9],
    [5, 1, 12, 3, 9],
    [5, 6, 12, 8, 9],
    [5, 6, 2, 8, 9],
    [5, 11, 12, 13, 9],
    [5, 1, 2, 3, 9],
    [5, 11, 7, 13, 9],
    [5, 1, 7, 3, 9],
    [5, 6, 7, 13, 9],
    [10, 11, 12, 13, 14],
    [10, 11, 17, 13, 14],
    [10, 11, 7, 13, 14],
    [10, 16, 17, 18, 14],
    [10, 6, 7, 8, 14],
    [10, 16, 12, 18, 14],
    [10, 6, 12, 8, 14],
    [10, 11, 12, 18, 14],
    [10, 11, 12, 8, 14],
    [10, 16, 12, 13, 14],
    [10, 6, 12, 13, 14],
    [10, 16, 7, 18, 14],
    [10, 6, 17, 8, 14],
    [15, 16, 17, 18, 19],
    [15, 16, 12, 18, 19],
    [15, 11, 12, 13, 19],
    [15, 11, 7, 13, 19],
    [15, 11, 17, 13, 19],
    [15, 16, 17, 13, 19],
    [15, 11, 17, 18, 19],
    [15, 16, 12, 13, 19],
    [15, 11, 12, 18, 19],
    [15, 16, 7, 18, 19],
    [15, 16, 7, 13, 19],
    [15, 11, 7, 18, 19],
  ];

  private getIdHL() {
    let id = -1;
    for (let i = 0; i < this.listArrIndexHL.length; i++) {
      if (
        this.compareArrays(this.result.listRowIndexCols, this.listArrIndexHL[i])
      ) {
        id = i;
        break;
      }
    }
    return id;
  }

  private compareArrays(arr1: Array<number>, arr2: Array<number>) {
    // Check if lengths are equal
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Iterate over each element and compare
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    // If all elements are equal, return true
    return true;
  }

  private unAnim() {
    this.listCellAnim.forEach((cell) => {
      cell.active = false;
    });
    this.line.setAnimation(0, SlotCmd.STATE_OF_ANIM.IDLE, true);
    this.columns.forEach((column) => {
      column.getComponent(SongKranColumn).turnCellOn();
    });
  }

  private checkWinType(betAmount: number, totalProfit: number) {
    let time = Math.floor(totalProfit / betAmount);
    if (time >= 21) {
      // super big win
      this.winType = 3;
    } else if (time >= 11) {
      // mega win
      this.winType = 2;
    } else if (time >= 5) {
      // big win
      this.winType = 1;
    } else if (time < 5) {
      this.winType = -1;
    }
  }

  private openWin() {
    let time = 0;
    this.pnWin.children[0].active = true;
    this.pnWin.children[1].active = true;
    let eff = this.pnWin.children[2].getComponent(dragonBones.ArmatureDisplay);
    eff.node.active = true;
    eff.node.setPosition(0, 0, 0);

    var startAnim;
    var loopAnim;
    var endAnim;
    let board = this.pnWin.children[3].getComponent(
      dragonBones.ArmatureDisplay
    );
    board.node.active = true;
    board.node.setPosition(0, -250, 0);
    board.playAnimation("start", 1);
    board.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        board.playAnimation("loop", 0);
      },
      board
    );
    switch (this.winType) {
      case 1:
        time = 8;
        startAnim = "start_Big";
        loopAnim = "loop_Big";
        endAnim = "exit_Big";
        SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_BIGWIN);
        break;

      case 2:
        time = 12;
        startAnim = "start_Mega";
        loopAnim = "loop_Mega";
        endAnim = "exit_Mega";
        SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_MEGABIGWIN);
        break;

      case 3:
        time = 15;
        startAnim = "start_Super";
        loopAnim = "loop_Super";
        endAnim = "exit_Super";
        SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_SUPPERBIGWIN);
        break;

      default:
        break;
    }

    let title = this.pnWin.children[4].getComponent(
      dragonBones.ArmatureDisplay
    );
    title.playAnimation(startAnim, -1);
    title.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        title.playAnimation(loopAnim, 0);
      },
      title
    );
    title.scheduleOnce(() => {
      title.playAnimation(endAnim, 1);
      title.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          title.playAnimation("idle", 0);
        },
        title
      );
    }, 5);

    this.pnWin.children[5].active = true;

    SongKranNumericalHelper.scheduleForLabel(
      this.lblWin.getComponent(cc.Label),
      this.thisRoundResult.totalProfit,
      time - 1
    );
    SongKranMusicManager.instance.playLoop(SLOT_SOUND_TYPE.BOOKING_LOOG1);
    this.scheduleOnce(() => {
      SongKranMusicManager.instance.stopPlayLoop();
    }, time - 1);

    cc.tween(board.node)
      .tag(2)
      .delay(5)
      .to(1, { position: new cc.Vec3(0, 400, 0) }, { easing: "smooth" })
      .start();
    cc.tween(eff.node)
      .tag(2)
      .delay(5)
      .to(1, { position: new cc.Vec3(0, 510, 0) }, { easing: "smooth" })
      .start();

    this.callbackFunc = function () {
      this.endGame();
      this.closeWinBig();
      SongKranHeadBar.instance.setCurrentBalance(
        this.thisRoundResult.currentMoney
      );
    };
    this.scheduleOnce(this.callbackFunc, time + 5);
  }

  private closeWinBig() {
    cc.Tween.stopAllByTag(2);
    this.pnWin.children[5].active = false;
    this.pnWin.children[3].active = false;
    this.pnWin.children[2].active = false;
    this.pnWin.children[1].active = false;
    this.pnWin.children[0].active = false;
  }

  private callbackFunc: any = undefined;
  private onClickSkip() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    cc.Tween.stopAllByTag(2);
    this.pnWin.children[2].stopAllActions();
    this.pnWin.children[2].setPosition(0, 510, 0);
    this.pnWin.children[3].stopAllActions();
    this.pnWin.children[3].setPosition(0, 400, 0);
    this.pnWin.children[3]
      .getComponent(dragonBones.ArmatureDisplay)
      .playAnimation("loop", 0);
    let title = this.pnWin.children[4].getComponent(
      dragonBones.ArmatureDisplay
    );
    title.unscheduleAllCallbacks();
    title.playAnimation("idle", -1);
    title.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        title.playAnimation("idle", -1);
      },
      title
    );
    this.pnWin.children[5].active = false;

    SongKranNumericalHelper.scheduleForLabel(
      this.lblWin.getComponent(cc.Label),
      this.thisRoundResult.totalProfit,
      0.01
    );

    this.scheduleOnce(() => {
      if (this.callbackFunc !== undefined) {
        this.unschedule(this.callbackFunc);
        this.callbackFunc = undefined;
      }
      this.closeWinBig();
      SongKranHeadBar.instance.setCurrentBalance(
        this.thisRoundResult.currentMoney
      );
      this.endGame();
    }, 2);
  }

  private checkWild() {
    for (let j = 0; j < this.columnResult.length; j++) {
      this.wildStart = -1;
      this.wildEnd = -1;
      this.isWildEnd = false;
      for (let i = 0; i < this.columnResult[j].length; i++) {
        if (
          this.columnResult[j][i].id === 0 ||
          this.columnResult[j][i].id === 1
        ) {
          if (!this.isWildEnd) {
            this.wildStart = i;
            this.isWildEnd = true;
          } else {
            this.wildEnd = i;
          }
        }
      }
      if (this.wildEnd !== -1 && this.wildStart !== -1) {
        let length = this.wildEnd - this.wildStart + 1;
        switch (length) {
          case 2:
            if (this.wildStart === 0) {
              this.columnResult[j][this.wildStart].off = true;
              this.columnResult[j][this.wildStart].wildUpper = true;
              this.columnResult[j][this.wildStart + 1].wildUpper = true;
            }
            if (this.wildStart === 2) {
              this.columnResult[j][this.wildEnd].off = true;
              this.columnResult[j][this.wildStart].wildUpper = false;
              this.columnResult[j][this.wildStart + 1].wildUpper = false;
            }
            this.columnResult[j][this.wildStart].wildLength = length;
            this.columnResult[j][this.wildEnd].wildLength = length;
            break;

          case 3:
            this.columnResult[j][this.wildStart].off = true;
            this.columnResult[j][this.wildEnd].off = true;
            this.columnResult[j][this.wildStart].wildLength = length;
            this.columnResult[j][this.wildStart + 1].wildLength = length;
            this.columnResult[j][this.wildEnd].wildLength = length;
            if (this.wildStart === 0) {
              this.columnResult[j][this.wildStart].wildUpper = true;
              this.columnResult[j][this.wildStart + 1].wildUpper = true;
              this.columnResult[j][this.wildEnd].wildUpper = true;
            } else {
              this.columnResult[j][this.wildStart].wildUpper = false;
              this.columnResult[j][this.wildStart + 1].wildUpper = false;
              this.columnResult[j][this.wildEnd].wildUpper = false;
            }
            break;

          case 4:
            this.columnResult[j][this.wildStart].off = true;
            this.columnResult[j][this.wildEnd].off = true;
            this.columnResult[j][this.wildEnd - 1].off = true;
            this.columnResult[j][this.wildStart].wildLength = length;
            this.columnResult[j][this.wildStart + 1].wildLength = length;
            this.columnResult[j][this.wildStart + 2].wildLength = length;
            this.columnResult[j][this.wildEnd].wildLength = length;
            break;

          default:
            SongKranCommon.runError("Error", this.wildStart, this.wildEnd);
            break;
        }
      } else if (this.wildEnd === -1 && this.wildStart !== -1) {
        let length = this.wildEnd - this.wildStart + 1;
        switch (length) {
          case 0:
            this.columnResult[j][this.wildStart].wildUpper = true;
            break;

          case -3:
            this.columnResult[j][this.wildStart].wildUpper = false;
            break;
        }
      }
    }
  }

  private runFreeGame() {
    SlotCmd.Send.sendStartFreeGame();
  }

  private checkFreeGame() {
    if (this.isFreeGame || this.onFreeGame) {
      let time = 0;
      if (this.isFreeGame) {
        time = 5.5;
        SongKranMusicManager.instance.playType(
          SLOT_SOUND_TYPE.FEATURETRIGGERSOUND
        );
        this.scheduleOnce(() => {
          this.unschedule(this.highlight);
          this.unAnim();
          this.mat.active = true;
          this.listCellAnim.forEach((cell) => {
            let cellSke = cell.getChildByName("ske").getComponent(sp.Skeleton);
            if (cellSke.skeletonData === this.listSyms[2]) {
              cell.active = true;
              cellSke.setAnimation(0, SlotCmd.STATE_OF_ANIM.FOUR, false);
            }
          });
          SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER_4S);
        }, 2.5);
      }
      this.scheduleOnce(() => {
        this.runFreeGame();
      }, time);
    }
    if (this.endFreeGame) {
      SongKranController.instance.pnFreeGame
        .getComponent(SongKranFreeGame)
        .endFreeGame(this.thisRoundResult.totalPot);
      SongKranHeadBar.instance.setCurrentBalance(
        this.thisRoundResult.currentMoney
      );
      SongKranController.instance.setBtnInteractable(true);
    }
  }

  private runJackPot() {
    SlotCmd.Send.sendOpenJackpot();
  }

  private setAnimWN() {
    for (let j = 0; j < this.wildNudgeColsList.length; j++) {
      for (let i = 0; i < 20; i++) {
        if (i % 5 === this.wildNudgeColsList[j]) {
          let cell = this.listCellAnim[i];
          cell.active = true;
          let cellSke = cell.getChildByName("ske").getComponent(sp.Skeleton);
          let id = -1;
          for (
            let k = 0;
            k < this.columnResult[this.wildNudgeColsList[j]].length;
            k++
          ) {
            if (
              this.columnResult[this.wildNudgeColsList[j]][k].id === 0 ||
              this.columnResult[this.wildNudgeColsList[j]][k].id === 1
            ) {
              id = this.columnResult[this.wildNudgeColsList[j]][k].id;
            }
          }
          cellSke.skeletonData = this.listSyms[id];
          cellSke.defaultAnimation = SlotCmd.STATE_OF_ANIM.TRANS;
          if (i < 5) {
            cellSke.node.y = -255;
          } else if (i < 10) {
            cellSke.node.y = -85;
          } else if (i < 15) {
            cellSke.node.y = 85;
          } else if (i < 20) {
            cellSke.node.y = 255;
          }
          cell.active = false;
        }
      }
    }
  }
}
