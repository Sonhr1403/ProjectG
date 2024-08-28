import { SlotCmd } from "./Script.Cmd";
import MoneyTrain2Column, { Direction } from "./Script.Column";
import MoneyTrain2Common from "./Script.Common";
import MoneyTrain2Controller from "./Script.Controller";
import MoneyTrain2FootBar from "./Script.FootBar";
import MoneyTrain2HeadBar from "./Script.HeadBar";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";
import MoneyTrain2NumericalHelper from "./Script.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2Machine extends cc.Component {
  public static instance: MoneyTrain2Machine = null;

  @property(sp.SkeletonData)
  public listSymSkeNormal: sp.SkeletonData[] = [];

  @property(sp.SkeletonData)
  public listSymSkeOther: sp.SkeletonData[] = [];

  @property(cc.SpriteFrame)
  public listSymSprNormal: cc.SpriteFrame[] = [];

  @property(cc.SpriteFrame)
  public listSymSprBlur: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  private columnPrefab: cc.Prefab = null;

  @property(cc.Node)
  private columnContainer: cc.Node = null;

  @property(cc.Node)
  private pnWin: cc.Node = null;

  @property(sp.Skeleton)
  private counterDay: sp.Skeleton = null;

  ////////////////////////////////////////////////////
  private numberColumn = 20;

  private columns: Array<cc.Node> = [];
  private columnResult: Array<SlotCmd.ImpItemCell> = [];

  private thisRoundResult: SlotCmd.ImpData = null;

  private winType: number = -1;

  public isTurbo: boolean = false;

  public isFreeGame: boolean = false;

  public wildCount: number = 0;

  private indexHL: number = -1;
  private result: SlotCmd.ImpResult = null;

  // private isMiniGame: boolean = false;
  // private onMiniGame: boolean = false;
  // private endMiniGame: boolean = false;

  private startMiniGame: boolean = false;

  private counterDayTemp: number = 0;

  onLoad() {
    MoneyTrain2Machine.instance = this;
  }

  public forceStop() {}

  public createMachine(data: SlotCmd.ImpData): void {
    MoneyTrain2Common.runLog("data", data);
    this.thisRoundResult = data;
    this.columnContainer.removeAllChildren();
    this.columns = [];

    this.processData();

    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      newColumn.name = i.toString();
      this.columns[i] = newColumn;
      this.columnContainer.addChild(newColumn);

      let objColumn = newColumn.getComponent(MoneyTrain2Column);
      objColumn.index = i;
      objColumn.anticipation.node.active = false;
      objColumn.createColumnCell(this.columnResult[i]);
    }
  }

  public startSpinVirtual() {
    this.wildCount = 0;
    this.isTurbo = MoneyTrain2Controller.instance.getIsTurbo();
    MoneyTrain2FootBar.instance.closeWinLbl();
    this.unschedule(this.highlight);
    this.block(false);

    // MoneyTrain2MusicManager.instance.playLoop(SLOT_SOUND_TYPE.REALSPINNING);

    let delay = 0.05;
    if (this.isTurbo) {
      delay = 0.01;
    }
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(MoneyTrain2Column);
      objColumn.spinDirection = Direction.Down;
      this.scheduleOnce(() => {
        objColumn.spinVirtual();
      }, delay * i);
    }
  }

  public letGo(data: SlotCmd.ImpData): void {
    MoneyTrain2Common.runLog("data", data);
    this.thisRoundResult = data;

    this.processData();

    this.scheduleOnce(() => {
      let delay = 0.5;
      if (this.isTurbo) {
        delay = 0.15;
      }
      for (let i = 0; i < this.numberColumn; i++) {
        this.scheduleOnce(() => {
          this.pushData(i);
        }, i * delay);
      }
    }, 1);
  }

  private processData() {
    this.columnResult = [];
    this.columnResult = this.thisRoundResult.listCell;

    this.thisRoundResult.listResult.forEach((result) => {
      result.listHL.forEach((hl) => {
        this.thisRoundResult.listCell[hl].highlight = true;
      });
    });

    this.checkWinType(
      this.thisRoundResult.betAmount,
      this.thisRoundResult.totalProfit
    );

    if (this.thisRoundResult.type === 3) {
      this.isFreeGame = true;
    } else {
      this.isFreeGame = false;
    }

    if (this.thisRoundResult.type === 4) {
      this.startMiniGame = true;
    } else {
      this.startMiniGame = false;
    }
  }

  public pushData(index) {
    let objColumn = this.columns[index].getComponent(MoneyTrain2Column);
    objColumn.spinDirection = Direction.Down;
    objColumn.pushData(this.columnResult[index]);
  }

  public doneSpin() {
    if (this.thisRoundResult.listResult.length > 0) {
      // MoneyTrain2MusicManager.instance.playType(
      //   SLOT_SOUND_TYPE.WINNINGSOUND_1
      // );
      this.checkBlock();
      this.scheduleOnce(() => {
        this.openWin();
      }, 2);
    } else {
      this.endGame();
    }
  }

  private checkBlock() {
    this.columns.forEach((column) => {
      column.getComponent(MoneyTrain2Column).checkBlock();
    });
  }

  private endGame() {
    if (this.startMiniGame || this.isFreeGame) {
      MoneyTrain2Common.runLog("isFreeGame", this.isFreeGame);
      MoneyTrain2Common.runLog("startMiniGame", this.startMiniGame);
      if (this.isFreeGame) {
        //   this.counterDayTemp = 0;
        //   this.columns.forEach((column) => {
        //     column.getComponent(MoneyTrain2Column).getFreeGame();
        //   });
        // SlotCmd.Send.sendStartFreeGame();
      }
      if (this.startMiniGame) {
        this.checkMiniGame();
      }
    } else {
      if (
        !MoneyTrain2Controller.instance.getIAS() &&
        this.thisRoundResult.listResult.length > 0
      ) {
        this.indexHL = -1;
        this.highlight();
        this.schedule(this.highlight, 2, cc.macro.REPEAT_FOREVER);
        MoneyTrain2Controller.instance.setBtnInteractive(true);
      } else {
        MoneyTrain2Controller.instance.checkAutoSpin();
      }
    }
  }

  private highlight() {
    this.block(true);
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
    this.result.listLineWin.forEach((hL) => {
      if (this.thisRoundResult.listCell[hL].highlight) {
        this.columns[hL].getComponent(MoneyTrain2Column).runCellAnim();
        this.columns[hL].getComponent(MoneyTrain2Column).block(false);
      }
    });
  }

  private unAnim() {
    this.columns.forEach((column) => {
      column.getComponent(MoneyTrain2Column).offCellAnim();
    });
  }

  private block(is: boolean) {
    this.columns.forEach((column) => {
      column.getComponent(MoneyTrain2Column).block(is);
    });
  }

  private checkWinType(betAmount: number, totalProfit: number) {
    let time = totalProfit / betAmount;
    if (time >= 21) {
      // super big win
      this.winType = 3;
    } else if (time >= 11) {
      // mega win
      this.winType = 2;
    } else if (time >= 5) {
      // big win
      this.winType = 1;
    } else if (time > 0) {
      this.winType = 0;
    } else if (time <= 0) {
      this.winType = -1;
    }
    MoneyTrain2Common.runLog(
      "check win type",
      betAmount,
      totalProfit,
      time,
      this.winType
    );
  }

  public checkWild(index: number) {
    if (this.wildCount === 2) {
      for (let i = index; i < this.numberColumn; i++) {
        this.columns[i].getComponent(MoneyTrain2Column).runAnticipation(true);
      }
    }
  }

  private openWin() {
    this.pnWin.children[2].active = true;
    this.pnWin.children[3].active = true;
    this.pnWin.children[4].active = true;

    let time = 0;

    switch (this.winType) {
      case 0:
        time = 5;
        if (this.isTurbo) {
          time = 1;
        }
        // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BW_BIGWIN);
        break;

      case 1:
        time = 10;
        // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BW_MEGABIGWIN);
        break;

      case 2:
        time = 15;
        // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BW_SUPPERBIGWIN);
        break;

      case 3:
        time = 20;
        // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BW_SUPPERBIGWIN);
        break;
    }

    MoneyTrain2NumericalHelper.scheduleForLabel(
      this.pnWin.children[3].getComponent(cc.Label),
      this.thisRoundResult.totalProfit,
      time - 1
    );

    let ske = this.pnWin.children[1].getComponent(sp.Skeleton);
    if (this.winType > 0) {
      this.callbackFunc1 = function () {
        this.pnWin.children[0].active = true;
        this.pnWin.children[2].getComponent(cc.Label).fontSize = 90;
        this.pnWin.children[2].getComponent(cc.Label).string = "BIG WIN";
        cc.tween(this.pnWin.children[2])
          .tag(2) //40->250
          .to(0.5, { position: new cc.Vec3(0, 250, 0) }, { easing: "smooth" })
          .start();
        cc.tween(this.pnWin.children[3])
          .tag(2) //-150->-350
          .to(0.5, { position: new cc.Vec3(0, -350, 0) }, { easing: "smooth" })
          .call(() => {
            ske.node.active = true;
            ske.setAnimation(0, SlotCmd.STATE_OF_WIN.BIG_WIN_START, false);
            ske.setCompleteListener(() => {
              ske.setAnimation(0, SlotCmd.STATE_OF_WIN.BIG_WIN_LOOP, true);
            });
          })
          .start();
      };
      this.scheduleOnce(this.callbackFunc1, 5);
    }

    if (this.winType > 1) {
      this.callbackFunc2 = function () {
        this.pnWin.children[2].getComponent(cc.Label).fontSize = 100;
        this.pnWin.children[2].getComponent(cc.Label).string = "MEGA WIN";
        ske.setAnimation(0, SlotCmd.STATE_OF_WIN.MEGA_WIN_START, false);
        ske.setCompleteListener(() => {
          ske.setAnimation(0, SlotCmd.STATE_OF_WIN.MEGA_WIN_LOOP, true);
        });
      };
      this.scheduleOnce(this.callbackFunc2, 10);
    }

    if (this.winType > 2) {
      this.callbackFunc3 = function () {
        this.pnWin.children[2].getComponent(cc.Label).fontSize = 110;
        this.pnWin.children[2].getComponent(cc.Label).string = "EPIC WIN";
        ske.setAnimation(0, SlotCmd.STATE_OF_WIN.EPIC_WIN_START, false);
        ske.setCompleteListener(() => {
          ske.setAnimation(0, SlotCmd.STATE_OF_WIN.EPIC_WIN_LOOP, true);
        });
      };
      this.scheduleOnce(this.callbackFunc3, 15);
    }

    this.callbackFunc = function () {
      this.closeWin();
      MoneyTrain2FootBar.instance.openWinLbl();
      MoneyTrain2FootBar.instance.scheduleForLbl(
        this.thisRoundResult.totalProfit,
        2 * this.thisRoundResult.listResult.length - 1
      );
      this.scheduleOnce(() => {
        MoneyTrain2HeadBar.instance.setCurrentBalance(
          this.thisRoundResult.currentMoney
        );
        this.endGame();
      }, 2 * this.thisRoundResult.listResult.length);
    };
    this.scheduleOnce(this.callbackFunc, time);
  }

  private closeWin() {
    cc.Tween.stopAllByTag(2);
    this.pnWin.children[4].active = false;
    this.pnWin.children[3].y = -150;
    this.pnWin.children[3].active = false;
    this.pnWin.children[2].getComponent(cc.Label).string = "WIN";
    this.pnWin.children[2].y = 40;
    this.pnWin.children[2].active = false;
    this.pnWin.children[1].active = false;
    this.pnWin.children[0].active = false;
  }

  private callbackFunc: any = undefined;
  private callbackFunc1: any = undefined;
  private callbackFunc2: any = undefined;
  private callbackFunc3: any = undefined;

  private onClickSkip() {
    this.pnWin.children[4].active = false;
    // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    cc.Tween.stopAllByTag(2);
    if (this.callbackFunc !== undefined) {
      this.unschedule(this.callbackFunc);
      this.callbackFunc = undefined;
    }
    if (this.callbackFunc1 !== undefined) {
      this.unschedule(this.callbackFunc1);
      this.callbackFunc1 = undefined;
    }
    if (this.callbackFunc2 !== undefined) {
      this.unschedule(this.callbackFunc2);
      this.callbackFunc2 = undefined;
    }
    if (this.callbackFunc3 !== undefined) {
      this.unschedule(this.callbackFunc3);
      this.callbackFunc3 = undefined;
    }
    this.pnWin.children[2].stopAllActions();
    this.pnWin.children[3].stopAllActions();
    if (this.winType > 0) {
      this.pnWin.children[0].active = true;
      this.pnWin.children[1].active = true;
      this.pnWin.children[2].setPosition(0, 250, 0);
      this.pnWin.children[3].setPosition(0, -350, 0);
    }

    switch (this.winType) {
      case 1:
        this.pnWin.children[2].getComponent(cc.Label).fontSize = 90;
        this.pnWin.children[2].getComponent(cc.Label).string = "BIG WIN";
        this.pnWin.children[1]
          .getComponent(sp.Skeleton)
          .setAnimation(0, SlotCmd.STATE_OF_WIN.BIG_WIN_LOOP, true);
        break;

      case 2:
        this.pnWin.children[2].getComponent(cc.Label).fontSize = 100;
        this.pnWin.children[2].getComponent(cc.Label).string = "MEGA WIN";
        this.pnWin.children[1]
          .getComponent(sp.Skeleton)
          .setAnimation(0, SlotCmd.STATE_OF_WIN.MEGA_WIN_LOOP, true);
        break;

      case 3:
        this.pnWin.children[2].getComponent(cc.Label).fontSize = 110;
        this.pnWin.children[2].getComponent(cc.Label).string = "EPIC WIN";
        this.pnWin.children[1]
          .getComponent(sp.Skeleton)
          .setAnimation(0, SlotCmd.STATE_OF_WIN.EPIC_WIN_LOOP, true);
        break;
    }

    MoneyTrain2NumericalHelper.scheduleForLabel(
      this.pnWin.children[3].getComponent(cc.Label),
      this.thisRoundResult.totalProfit,
      0.01
    );

    this.scheduleOnce(() => {
      this.closeWin();
      MoneyTrain2HeadBar.instance.setCurrentBalance(
        this.thisRoundResult.currentMoney
      );
      this.endGame();
    }, 2);
  }

  private checkMiniGame() {
    if (this.startMiniGame) {
      MoneyTrain2Controller.instance.localMini = {
        betAmount: -1,
        isActionEmpty: false,
        listActionsSize: -1,
        listActions: [],
        totalPot: -1,
        currentMoney: -1,
        totalBooster: -1,
        totalRound: -1,
        currentRound: -1,
        listBoosterSize: 20,
        listBooster: this.turnToBooster(),
      };
      MoneyTrain2Controller.instance.trainAnimGo(true);
    }
  }

  private turnToBooster() {
    let list = [];
    this.thisRoundResult.listCell.forEach((itemCell) => {
      let itemBooster: SlotCmd.ImpBooster = {
        index: itemCell.index,
        id: itemCell.id === 1 ? 1 : -1,
        value: itemCell.value,
      };
      list.push(itemBooster);
    });
    return list;
  }

  public animCounterDay(open: boolean) {
    if (open) {
      this.counterDay.setAnimation(0, "counter_open", false);
    } else {
      this.counterDay.setAnimation(0, "counter_close", false);
    }
  }

  public updateCounterDay(num: number) {
    this.counterDayTemp += num;
    this.counterDay.node.children[0].getComponent(cc.Label).string =
      "x" + this.counterDayTemp;
  }
}
