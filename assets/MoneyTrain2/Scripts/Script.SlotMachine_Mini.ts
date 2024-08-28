import { SlotCmd } from "./Script.Cmd";
import MoneyTrain2ColumnMiNi, { Direction } from "./Script.Column_Mini";
import MoneyTrain2ColumnMini from "./Script.Column_Mini";
import MoneyTrain2Common from "./Script.Common";
import MoneyTrain2Controller from "./Script.Controller";
import MoneyTrain2FootBar from "./Script.FootBar";
import MoneyTrain2HeadBar from "./Script.HeadBar";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";
import MoneyTrain2NumericalHelper from "./Script.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2MachineMini extends cc.Component {
  public static instance: MoneyTrain2MachineMini = null;

  @property(sp.SkeletonData)
  public listSymSkeOther: sp.SkeletonData[] = [];

  @property(cc.SpriteFrame)
  public listSymSprNormal: cc.SpriteFrame[] = [];

  @property(cc.SpriteFrame)
  public listSymSprBlur: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  private columnPrefab: cc.Prefab = null;

  @property(cc.Node)
  private columnContainerMini: cc.Node = null;

  @property(cc.Node)
  private listDoor: cc.Node[] = [];

  @property(cc.Node)
  private listCounter: cc.Node[] = [];

  @property(sp.Skeleton)
  private listCounterEffect: sp.Skeleton[] = [];

  @property(cc.Node)
  private pnWin: cc.Node = null;

  ////////////////////////////////////////////////////
  private numberColumnMini = 28;

  private isOpen1: boolean = false;
  private isOpen2: boolean = false;

  private list: Array<number> = [];
  private listIndex0: Array<number> = [
    1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26,
  ];
  private listIndex1: Array<number> = [
    1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 22, 23, 24,
    25, 26, 27,
  ];
  private listIndex2: Array<number> = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
  ];

  private columns: Array<cc.Node> = [];
  private columnResult: Array<SlotCmd.ImpBooster> = [];

  private thisRoundResult: SlotCmd.ImpMini = null;

  public isTurbo: boolean = false;

  public wildCount: number = 0;

  private startMiniGame: boolean = false;
  private inMiniGame: boolean = false;
  private endMiniGame: boolean = false;

  onLoad() {
    MoneyTrain2MachineMini.instance = this;
  }

  public forceStop() {}

  public createMachineMini(data: SlotCmd.ImpMini): void {
    MoneyTrain2Common.runLog("data", data);
    this.thisRoundResult = data;
    this.columnContainerMini.removeAllChildren();
    this.columns = [];

    this.processData();

    let j = 0;

    for (let i = 0; i < this.numberColumnMini; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      newColumn.name = i.toString();
      this.columns[i] = newColumn;
      this.columnContainerMini.addChild(newColumn);

      let objColumn = newColumn.getComponent(MoneyTrain2ColumnMiNi);
      objColumn.index = i;
      if (this.list.includes(i)) {
        objColumn.createColumnCellMini(this.columnResult[j]);
        j++;
      } else {
        let itemBooster: SlotCmd.ImpBooster = {
          index: i,
          id: -1,
          value: 0,
        };
        objColumn.createColumnCellMini(itemBooster);
      }
    }
  }

  private checkList() {
    let size = 0;
    if (this.thisRoundResult.listActionsSize > 0) {
      size = this.thisRoundResult.listActions[0].listBoosterSize;
    } else {
      size = this.thisRoundResult.listBoosterSize;
    }

    switch (size) {
      case 20:
        this.isOpen1 = false;
        this.isOpen2 = false;
        return this.listIndex0;

      case 24:
        this.isOpen1 = true;
        this.isOpen2 = false;
        return this.listIndex1;

      case 28:
        this.isOpen1 = false;
        this.isOpen2 = true;
        return this.listIndex2;
    }
  }

  public startSpinVirtual() {
    this.isTurbo = MoneyTrain2Controller.instance.getIsTurbo();
    MoneyTrain2FootBar.instance.closeWinLbl();

    // MoneyTrain2MusicManager.instance.playLoop(SLOT_SOUND_TYPE.REALSPINNING);

    let delay = 0.05;
    if (this.isTurbo) {
      delay = 0.01;
    }
    for (let i = 0; i < this.numberColumnMini; i++) {
      let objColumn = this.columns[i].getComponent(MoneyTrain2ColumnMini);
      objColumn.spinDirection = Direction.Down;
      this.scheduleOnce(() => {
        objColumn.spinVirtual();
      }, delay * i);
    }
  }

  public letGo(data: SlotCmd.ImpMini): void {
    MoneyTrain2Common.runLog("data", data);
    this.thisRoundResult = data;

    this.processData();

    this.scheduleOnce(() => {
      let delay = 0.5;
      if (this.isTurbo) {
        delay = 0.15;
      }

      let j = 0;
      for (let i = 0; i < this.numberColumnMini; i++) {
        if (this.list.includes(i)) {
          this.scheduleOnce(() => {
            this.pushData(i, j);
            j++;
          }, i * delay);
        }
      }
    }, 1);
  }

  private processData() {
    this.columnResult = [];
    if (this.thisRoundResult.listActionsSize > 0) {
      this.columnResult = this.thisRoundResult.listActions[0].listBooster;
    } else {
      this.columnResult = this.thisRoundResult.listBooster;
    }

    this.list = this.checkList();
    for (let i = 0; i < this.thisRoundResult.listBooster.length; i++) {
      this.thisRoundResult.listBooster[i].index = this.list[i];
    }
    cc.log("column result", this.columnResult);
  }

  public pushData(i: number, j: number) {
    let objColumn = this.columns[i].getComponent(MoneyTrain2ColumnMini);
    objColumn.spinDirection = Direction.Down;
    objColumn.pushData(this.columnResult[j]);
    cc.log(j, this.columnResult[j]);
  }

  public doneSpin() {
    MoneyTrain2Common.runLog(
      "isMiniGame",
      this.startMiniGame,
      "onMiniGame",
      this.inMiniGame,
      "endMiniGame",
      this.endMiniGame
    );

    this.runAction();

    this.endGame();
  }

  private runAction() {
    //TODO
  }

  private endGame() {}

  public landColumn() {
    this.columns.forEach((column) => {
      column.getComponent(MoneyTrain2ColumnMini).landCell();
    });
  }

  public runCounterTotal(isOpen: boolean) {
    if (isOpen) {
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setAnimation(0, "open_door", false);
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setCompleteListener(() => {
          this.listCounter[0].children[2].active = true;
          this.listCounter[0].children[3].active = true;
          this.listCounter[0].children[3].getComponent(cc.Label).string =
            "x" + "";
        });
    } else {
      this.listCounter[0].children[3].getComponent(cc.Label).string = "";
      this.listCounter[0].children[3].active = false;
      this.listCounter[0].children[2].active = false;
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setAnimation(0, "close_door", false);
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setCompleteListener(null);
    }
  }

  public runCounterSpins(isOpen: boolean) {
    if (isOpen) {
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setAnimation(0, "open_door", false);
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setCompleteListener(() => {
          this.listCounter[0].children[2].active = true;
          this.listCounter[0].children[3].active = true;
          this.listCounter[0].children[3].getComponent(cc.Label).string =
            this.thisRoundResult.totalRound -
            this.thisRoundResult.currentRound -
            1 +
            "";
        });
    } else {
      this.listCounter[0].children[3].getComponent(cc.Label).string = "0";
      this.listCounter[0].children[3].active = false;
      this.listCounter[0].children[2].active = false;
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setAnimation(0, "close_door", false);
      this.listCounter[0].children[1]
        .getComponent(sp.Skeleton)
        .setCompleteListener(null);
    }
  }

  private callbackFunc: any = undefined;
  private callbackFunc1: any = undefined;
  private callbackFunc2: any = undefined;
  private callbackFunc3: any = undefined;

  private onClickSkip() {}

  private checkMiniGame() {
    if (this.startMiniGame || this.inMiniGame) {
      let time = 0;
      if (this.startMiniGame) {
        time = 4;
        this.scheduleOnce(() => {
          MoneyTrain2Controller.instance.trainAnimGo(true);
        }, 4);
      }
      this.scheduleOnce(() => {
        SlotCmd.Send.sendStartMiniGame();
      }, time);
    }
    if (this.endMiniGame) {
      // MoneyTrain2Controller.instance.pnMiniGame
      //   .getComponent(MoneyTrain2MiniGame)
      //   .endMiniGame(this.thisRoundResult.totalPot);
      MoneyTrain2HeadBar.instance.setCurrentBalance(
        this.thisRoundResult.currentMoney
      );
      MoneyTrain2Controller.instance.setBtnInteractive(true);
    }
  }
}
