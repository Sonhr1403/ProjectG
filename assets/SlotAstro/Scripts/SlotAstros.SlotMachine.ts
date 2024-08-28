import SlotKKCellSpr from "../../SlotKingKong/Scripts/SlotKK.CellSpr";
import SlotAstrosBonus from "./SlotAstros.Bonus";
import { SlotCmd } from "./SlotAstros.Cmd";
import SlotAstrosColumn, { Direction } from "./SlotAstros.Column";
import SlotAstrosCommon from "./SlotAstros.Common";
import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMusicManager, { SLOT_SOUND_TYPE } from "./SlotAstros.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotAstrosMachine extends cc.Component {
  public static instance: SlotAstrosMachine = null;

  @property({ type: sp.SkeletonData })
  private listSyms: sp.SkeletonData[] = [];

  @property(sp.Skeleton)
  private effSlotFrame: sp.Skeleton = null;

  @property(cc.SpriteFrame)
  public listSymsSF: cc.SpriteFrame[] = [];

  @property(cc.SpriteFrame)
  private listProgress: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  private columnPrefab: cc.Prefab = null;

  @property(cc.Node)
  public progress: cc.Node = null;

  @property(cc.Node)
  private listAnimCells: cc.Node[] = [];

  @property(cc.Node)
  private columnContainer: cc.Node[] = [];

  @property(cc.Font)
  public listFont: cc.Font[] = [];

  @property(cc.Label)
  public listX: cc.Label[] = [];

  @property(cc.Node)
  private pnWin: cc.Node[] = [];

  @property(cc.Node)
  private listHLX: cc.Node[] = [];

  @property(cc.Node)
  private lblWin: cc.Node = null;

  @property(cc.Node)
  private lblTotalWin: cc.Node = null;

  @property(cc.Node)
  private pnBonus: cc.Node = null;

  ////////////////////////////////////////////////////
  private numberColumn = 25;

  private columns: Array<cc.Node> = [];
  private columnResult: Array<SlotCmd.ImpItemCell> = [];

  private thisRoundResult: SlotCmd.ImpData = null;

  private winType: number = -1;

  private isBonus: boolean = false;

  private totalRow: number = -1;
  private currentRow: number = -1;

  private idArray: number[] = [];

  public listWin: number[] = [];

  private bonusProfit: number = 0;

  private totalNum: number = 0;

  public isTurbo: boolean = false;

  onLoad() {
    SlotAstrosMachine.instance = this;
  }

  public forceStop() {
    // this.createMachine();
  }

  public createMachine(data: SlotCmd.ImpData): void {
    this.columnContainer[0].removeAllChildren();
    this.columnContainer[1].removeAllChildren();
    this.columnContainer[2].removeAllChildren();
    this.columnContainer[3].removeAllChildren();
    this.columnContainer[4].removeAllChildren();
    this.columns = [];

    this.processData(data, true);

    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      newColumn.name = i.toString();
      this.columns[i] = newColumn;
      if (i >= 0 && i < 7) {
        this.columnContainer[0].addChild(newColumn);
      } else if (i >= 7 && i < 13) {
        this.columnContainer[1].addChild(newColumn);
      } else if (i >= 13 && i < 18) {
        this.columnContainer[2].addChild(newColumn);
      } else if (i >= 18 && i < 22) {
        this.columnContainer[3].addChild(newColumn);
      } else {
        this.columnContainer[4].addChild(newColumn);
      }
      const objColumnAnim = newColumn.getComponent(SlotAstrosColumn);
      objColumnAnim.index = i;
      objColumnAnim.ske.active = false;
      if (this.columnResult[i]) {
        objColumnAnim.createColumnCell(this.columnResult[i]);
      }
    }
  }

  private setAnim(i: number) {
    this.listAnimCells[i].active = true;
    let cellAnim = this.listAnimCells[i]
      .getChildByName("Skeleton")
      .getComponent(sp.Skeleton);
    cellAnim.skeletonData = this.listSyms[this.columnResult[i].id - 1];
    cellAnim.defaultSkin = "default";
    cellAnim.loop = true;
    cellAnim.defaultAnimation = SlotCmd.STATE_OF_ANIM.DEFAULT;
    if (this.columnResult[i].id === 2) {
      this.listAnimCells[i].getChildByName("Skeleton").y = 47;
    } else {
      this.listAnimCells[i].getChildByName("Skeleton").y = 2;
    }
    this.listAnimCells[i].active = false;
  }

  public startSpinVirtual(min: number, max: number) {
    switch (min) {
      case 0:
        SlotAstrosMusicManager.instance.playType(
          SLOT_SOUND_TYPE.REELSPINLOOP0,
          1
        );
        this.totalNum = 0;
        for (let j = 0; j < 4; j++) {
          this.runX(j, false);
          this.listHLX[j].active = false;
        }
        for (let i = 7; i < this.columns.length; i++) {
          this.columns[i].getComponent(SlotAstrosColumn).clearCells();
        }
        cc.tween(this.lblTotalWin).to(0.5, { opacity: 0 }).start();
        this.listAnimCells.forEach((cell) => {
          cell.active = false;
        });
        for (let i = 0; i < 25; i += 3) {
          for (let j = 1; j < 4; j++) {
            this.updateProgress(i, j, false);
          }
        }
        break;

      case 7:
        SlotAstrosMusicManager.instance.playType(
          SLOT_SOUND_TYPE.REELSPINLOOP1,
          1
        );
        this.runX(0, true);
        this.runAnimX(0, 1);
        break;

      case 13:
        SlotAstrosMusicManager.instance.playType(
          SLOT_SOUND_TYPE.REELSPINLOOP2,
          1
        );
        this.runX(1, true);
        this.runAnimX(1, 1);
        break;

      case 18:
        SlotAstrosMusicManager.instance.playType(
          SLOT_SOUND_TYPE.REELSPINLOOP3,
          1
        );
        this.runX(2, true);
        this.runAnimX(2, 1);
        break;

      case 22:
        SlotAstrosMusicManager.instance.playType(
          SLOT_SOUND_TYPE.REELSPINLOOP4,
          1
        );
        this.runX(3, true);
        this.runAnimX(3, 1);
        break;
    }

    this.isTurbo = SlotAstrosController.instance.getTurbo();

    this.runFrameEffSpin(min);

    if (min < 13) {
      SlotAstrosMusicManager.instance.playLoop(
        SLOT_SOUND_TYPE.REELSPINMECHLOOP
      );
    } else {
      SlotAstrosMusicManager.instance.playLoop(SLOT_SOUND_TYPE.ANTICIPATION);
    }

    for (let i = min; i <= max; i++) {
      let objColumn = this.columns[i].getComponent(SlotAstrosColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.spinVirtual(0);
    }
  }

  private runFrameEffSpin(min: number) {
    let eff = this.effSlotFrame;
    eff.node.active = true;
    eff.clearTracks();
    switch (min) {
      case 0:
        eff.setAnimation(0, "spin_row_1", false);
        break;

      case 7:
        eff.setAnimation(0, "spin_row_2", false);
        break;

      case 13:
        eff.setAnimation(0, "spin_row_3", false);
        break;

      case 18:
        eff.setAnimation(0, "spin_row_4", false);
        break;

      case 22:
        eff.setAnimation(0, "spin_row_5", false);
        break;
    }
    eff.setCompleteListener(() => {
      eff.node.active = false;
    });
  }

  public runFrameEffUpgrade(num: number) {
    let rowUpgrade = this.checkRowUpgrade(num);
    let eff = this.effSlotFrame;
    eff.node.active = true;
    eff.clearTracks();
    switch (rowUpgrade) {
      case 2:
        eff.setAnimation(0, "upgrade_row_2", false);
        break;

      case 3:
        eff.setAnimation(0, "upgrade_row_3", false);
        break;

      case 4:
        eff.setAnimation(0, "upgrade_row_4", false);
        break;

      case 5:
        eff.setAnimation(0, "upgrade_row_5", false);
        break;
    }
    eff.setCompleteListener(() => {
      eff.node.active = false;
    });
  }

  private checkRowUpgrade(num: number): number {
    let rowUpgrade = -1;
    switch (num) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        rowUpgrade = 2;
        break;

      case 9:
      case 10:
      case 11:
      case 12:
        rowUpgrade = 3;
        break;

      case 15:
      case 16:
      case 17:
        rowUpgrade = 4;
        break;

      case 20:
      case 21:
        rowUpgrade = 5;
        break;
    }
    return rowUpgrade;
  }

  public letGo(data: SlotCmd.ImpData): void {
    this.totalRow = data.rowList.length - 1;

    this.processData(data, false);

    this.pushData(0, 6);
  }

  private processData(data: SlotCmd.ImpData, isCreated: boolean) {
    SlotAstrosCommon.runError({name: "data", cont: data});
    this.currentRow = -1;
    this.idArray = [];
    this.thisRoundResult = data;
    this.columnResult = [];
    this.listWin = [3];
    this.isBonus = false;
    this.bonusProfit = 0;
    let wildCount = 0;
    let winCount: number = 0;

    for (let i = 0; i < data.rowList.length; i++) {
      let fresh = true;
      if (i === 0) {
        for (let j = 0; j < 7; j++) {
          if (
            data.rowList[0].listItem[j].highlight &&
            !this.listWin.includes(data.rowList[0].listItem[j].id) &&
            data.rowList[0].listItem[j].id !== 1 &&
            data.rowList[0].listItem[j].id !== 2
          ) {
            this.listWin.push(data.rowList[i].listItem[j].id);
          }
        }
      }
      for (let k = 0; k < data.rowList[i].listItem.length; k++) {
        if (fresh) {
          this.idArray = [];
          fresh = false;
          wildCount = 0;
          winCount = 0;
        }
        this.idArray.push(data.rowList[i].listItem[k].id);
        let count = this.countOccurrences(
          this.idArray,
          data.rowList[i].listItem[k].id,
          wildCount
        );
        data.rowList[i].listItem[k].appearTime = count;

        if (
          this.listWin.includes(data.rowList[i].listItem[k].id) &&
          data.rowList[i].listItem[k].id !== 3
        ) {
          if (winCount < count) {
            winCount = this.countOccurrences(
              this.idArray,
              data.rowList[i].listItem[k].id,
              0
            );
          }
        }

        if (data.rowList[i].listItem[k].id === 3) {
          data.rowList[i].listItem[k].appearTime += winCount;
          wildCount++;
        }

        this.columnResult.push(data.rowList[i].listItem[k]);
        if (data.rowList[i].listItem[k].id === 2) {
          this.isBonus = true;
        }
        this.setAnim(data.rowList[i].listItem[k].index);
      }
    }

    // this.columnResult.forEach((element) => {
    //   if (this.listWin.includes(element.id)) {
    //     element.highlight = true;
    //   }
    // });

    if (this.isBonus && !isCreated) {
      this.bonusProfit =
        SlotAstrosController.instance.localRes5004.freeGame.totalProfit;
    }

    this.checkWinType(data.betAmount, data.totalProfit + this.bonusProfit);
  }

  private countOccurrences(
    arr: number[],
    targetNumber: number,
    wildCount: number
  ): number {
    const frequencyMap: Map<number, number> = new Map();

    // Count the occurrences of each number in the array
    for (const num of arr) {
      if (frequencyMap.has(num)) {
        frequencyMap.set(num, frequencyMap.get(num)! + 1);
      } else {
        frequencyMap.set(num, 1);
      }
    }

    // Return the count of occurrences for the target number
    return frequencyMap.has(targetNumber)
      ? targetNumber !== 3
        ? (frequencyMap.get(targetNumber) + wildCount)!
        : frequencyMap.get(targetNumber)!
      : 0;
  }

  public onAnimActive(itemCell: SlotCmd.ImpItemCell) {
    let cell = this.listAnimCells[itemCell.index];
    cell.active = true;
    cell
      .getChildByName("Skeleton")
      .getComponent(sp.Skeleton)
      .setAnimation(0, SlotCmd.STATE_OF_ANIM.ACTIVE, false);

    let num = 0;
    let betAmount = SlotAstrosController.instance.getTotalBet();
    let label = cell.getChildByName("Label").getComponent(cc.Label);
    if (itemCell.id === 1 || itemCell.id === 2 || itemCell.id === 3) {
      label.node.active = false;
    } else {
      label.node.active = true;
    }

    switch (itemCell.id) {
      case 13:
        label.font = this.listFont[0];
        num = 0.1 * betAmount;
        label.fontSize = 55;
        label.lineHeight = 55;
        break;

      case 12:
        label.font = this.listFont[0];
        num = 0.2 * betAmount;
        label.fontSize = 55;
        label.lineHeight = 55;
        break;

      case 11:
        label.font = this.listFont[0];
        num = 0.3 * betAmount;
        label.fontSize = 55;
        label.lineHeight = 55;
        break;

      case 10:
        label.font = this.listFont[0];
        num = 0.5 * betAmount;
        label.fontSize = 55;
        label.lineHeight = 55;
        break;

      case 9:
        label.font = this.listFont[1];
        num = 1 * betAmount;
        label.fontSize = 60;
        label.lineHeight = 60;
        break;

      case 8:
        label.font = this.listFont[1];
        num = 2 * betAmount;
        label.fontSize = 60;
        label.lineHeight = 60;
        break;

      case 7:
        label.font = this.listFont[1];
        num = 5 * betAmount;
        label.fontSize = 60;
        label.lineHeight = 60;
        break;

      case 6:
        label.font = this.listFont[2];
        num = 10 * betAmount;
        label.fontSize = 65;
        label.lineHeight = 65;
        break;

      case 5:
        label.font = this.listFont[2];
        num = 20 * betAmount;
        label.fontSize = 65;
        label.lineHeight = 65;
        break;

      case 4:
        label.font = this.listFont[2];
        num = 100 * betAmount;
        label.fontSize = 65;
        label.lineHeight = 65;
        break;
    }
    label.string = SlotAstrosCommon.convert2Label(num);
  }

  public onAnimJackPot(index: number) {
    let cell = this.listAnimCells[index];
    cell.active = true;
    cell.getChildByName("Label").active = false;
    cell
      .getChildByName("Skeleton")
      .getComponent(sp.Skeleton)
      .setAnimation(0, SlotCmd.STATE_OF_ANIM.DEFAULT, false);
  }

  public onAnimWild(index: number) {
    let cell = this.listAnimCells[index];
    cell.active = true;
    cell.getChildByName("Label").active = false;
    cell
      .getChildByName("Skeleton")
      .getComponent(sp.Skeleton)
      .setAnimation(0, SlotCmd.STATE_OF_ANIM.IDLE, false);
    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.WILDHIT, 2);
  }

  public onAnimBonus(index: number) {
    let cell = this.listAnimCells[index];
    cell.active = true;
    cell.getChildByName("Label").active = false;
    cell
      .getChildByName("Skeleton")
      .getComponent(sp.Skeleton)
      .setAnimation(0, SlotCmd.STATE_OF_ANIM.BONUS, true);
    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.FSHIT, 2);
  }

  private pushData(min: number, max: number) {
    if (max === 6 || max === 12 || max === 17 || max === 21 || max === 24) {
      this.currentRow += 1;
    }

    let delay = 0;
    let inc = 0.5;
    if (this.isTurbo) {
      inc = 0;
    }
    for (let i = min; i <= max; i++) {
      let objColumn = this.columns[i].getComponent(SlotAstrosColumn);
      objColumn.spinDirection = Direction.Down;
      this.scheduleOnce(() => {
        objColumn.pushData(this.columnResult[i], i);
      }, delay);
      delay += inc;
    }
  }

  public reward() {
    if (this.currentRow === 0) {
      this.scheduleOnce(() => {
        this.processRewardCells();
        this.scheduleOnce(() => {
          this.updateWinAndContinue();
        }, 0.5);
      }, 0.5);
    } else {
      this.scheduleOnce(() => {
        this.processRewardCells();
        this.scheduleOnce(() => {
          this.updateWinAndContinue();
        }, 0.5);
      }, 0.5);
    }
  }

  private processRewardCells() {
    const min = this.getMinMax(this.currentRow)[0];
    const max = this.getMinMax(this.currentRow)[1];

    this.checkCellHL(min, max);
    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.WINTILES, 3);

    let eat = false;

    for (let i = min; i <= max; i++) {
      let cell = this.listAnimCells[i];
      let skeleton = cell.getChildByName("Skeleton").getComponent(sp.Skeleton);
      let label = cell.getChildByName("Label");

      if (cell.active && this.isSymbolDif(skeleton.skeletonData)) {
        this.playAnimationAndHideCell(skeleton, cell);
        this.animateLabel(label);
      }
      if (this.isSymbolInList(skeleton.skeletonData, this.listSyms[0])) {
        skeleton.setAnimation(0, SlotCmd.STATE_OF_ANIM.ACTIVE, false);
      }
      if (this.isSymbolInList(skeleton.skeletonData, this.listSyms[2])) {
        skeleton.setAnimation(0, SlotCmd.STATE_OF_ANIM.ACTIVE, false);
      }

      if (cell.active) {
        eat = true;
      }
    }
    if (eat) {
      switch (max) {
        case 12:
          this.runAnimX(4, 2);
          break;

        case 17:
          this.runAnimX(5, 2);
          break;

        case 21:
          this.runAnimX(6, 2);
          break;

        case 24:
          this.runAnimX(7, 2);
          break;
      }
    }
  }

  private isSymbolInList(symbolData, targetSymbol) {
    return symbolData === targetSymbol;
  }

  private isSymbolDif(symbolData) {
    return (
      !this.isSymbolInList(symbolData, this.listSyms[0]) &&
      !this.isSymbolInList(symbolData, this.listSyms[1]) &&
      !this.isSymbolInList(symbolData, this.listSyms[2])
    );
  }

  private isSymbolNoDif(symbolData) {
    return (
      this.isSymbolInList(symbolData, this.listSyms[0]) ||
      this.isSymbolInList(symbolData, this.listSyms[1]) ||
      this.isSymbolInList(symbolData, this.listSyms[2])
    );
  }

  private playAnimationAndHideCell(skeleton, cell) {
    // if (this.isSymbolDif(skeleton.skeletonData)) {
    skeleton.setAnimation(0, SlotCmd.STATE_OF_ANIM.ACTIVE, false);
    skeleton.setCompleteListener(() => {
      // this.scheduleOnce(() => {
        cell.active = false;
      // }, 0.5);
      skeleton.setCompleteListener(null);
    });
    // }
  }

  private animateLabel(label) {
    label.opacity = 255;
    cc.tween(label)
      .to(0.25, { scale: 1.2 })
      .call(() => {
        cc.tween(label).to(0.25, { scale: 1 }).start();
      })
      .start();
  }

  private updateWinAndContinue() {
    let time = 0;
    if (
      this.thisRoundResult.rowList[this.currentRow].amountProfit >=
      5 * SlotAstrosController.instance.getTotalBet()
    ) {
      time = 3;
      this.pnWin[0].active = true;
      this.lblWin.active = true;
      this.lblWin.y = -50;
      this.scheduleForLbl(
        this.thisRoundResult.rowList[this.currentRow].amountProfit,
        time - 1,
        true
      );
    } else if (this.thisRoundResult.rowList[this.currentRow].amountProfit > 0) {
      SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.WINSMALL, 2);
    }

    this.scheduleOnce(() => {
      if (
        this.thisRoundResult.rowList[this.currentRow].amountProfit >=
        5 * SlotAstrosController.instance.getTotalBet()
      ) {
        this.lblWin.getComponent(cc.Label).string = "";
        this.lblWin.active = false;
        this.pnWin[0].active = false;
      }

      if (this.currentRow < this.totalRow) {
        this.totalNum +=
          this.thisRoundResult.rowList[this.currentRow].amountProfit;
        this.updateWinLbl();

        this.scheduleOnce(() => {
          this.startSpinAndPushData();
        }, 0.5);
      } else {
        if (this.isBonus) {
          this.scheduleOnce(() => {
            this.turnOffAnimExBonus();
            this.pnBonus.active = true;
            SlotAstrosBonus.instance.onOpen();
          }, 1);
        } else {
          this.openWin();
        }
      }
    }, time);
  }

  private startSpinAndPushData() {
    let list = this.getMinMax(this.currentRow + 1);
    this.startSpinVirtual(list[0], list[1]);
    let delay = 0;
    let wait = 0;
    if (this.isTurbo) {
      wait = 1;
    }
    this.scheduleOnce(() => {
      for (
        let i = this.getMinMax(this.currentRow + 1)[0];
        i <= this.getMinMax(this.currentRow + 1)[1];
        i++
      ) {
        this.scheduleOnce(() => {
          this.pushData(i, i);
        }, delay);
        delay += this.getDelayByRow();
      }
    }, wait);
  }

  private getMinMax(row: number): Array<number> {
    let min = 0;
    let max = 0;
    switch (row) {
      case 0:
        min = 0;
        max = 6;
        break;

      case 1:
        min = 7;
        max = 12;
        break;

      case 2:
        min = 13;
        max = 17;
        break;

      case 3:
        min = 18;
        max = 21;
        break;

      case 4:
        min = 22;
        max = 24;
        break;
    }
    return [min, max];
  }
  private checkCellHL(min: number, max: number) {
    for (let i = min; i <= max; i++) {
      this.columns[i].getComponent(SlotAstrosColumn).checkCellHL();
    }
  }

  private updateWinLbl() {
    if (this.lblTotalWin.opacity === 255) {
      cc.tween(this.lblTotalWin).to(0.25, { opacity: 0 }).start();
    }
    this.lblTotalWin.getComponent(cc.Label).string =
      BGUI.Utils.formatMoneyWithCommaOnly(this.totalNum);
    cc.tween(this.lblTotalWin).to(0.25, { opacity: 255 }).start();
  }

  private getDelayByRow(): number {
    let delay = 0;
    switch (this.currentRow) {
      case 0:
        delay = 1;
        break;

      case 1:
        delay = 3;
        break;

      case 2:
        delay = 3.5;
        break;

      case 3:
        delay = 4;
        break;
    }
    if (this.isTurbo) {
      return 0;
    } else {
      return delay;
    }
  }

  public checkWinType(betAmount: number, totalProfit: number) {
    let time = Math.floor(totalProfit / betAmount);
    if (time >= 21) {
      // mega win
      this.winType = 3;
    } else if (time >= 11) {
      // supper win
      this.winType = 2;
    } else if (time >= 5) {
      // big win
      this.winType = 1;
    } else if (time < 5) {
      this.winType = -1;
    }
  }

  private runX(i: number, isOn: boolean) {
    if (isOn) {
      this.listX[i].font = this.listFont[4];
    } else {
      this.listX[i].font = this.listFont[3];
    }
  }

  private runAnimX(i: number, phase: number) {
    let anim = "";

    if (phase === 1) {
      anim = "animation";
    } else {
      anim = "active";
    }

    this.listHLX[i].active = true;

    if (phase === 1) {
      this.listHLX[i].getComponent(sp.Skeleton).setAnimation(0, anim, true);
    } else {
      this.listHLX[i].getComponent(sp.Skeleton).setAnimation(0, anim, false);
      this.listHLX[i].getComponent(sp.Skeleton).setCompleteListener(() => {
        this.listHLX[i].active = false;
      });
    }
  }

  public updateProgress(i: number, appearTime: number, isOn: boolean) {
    let index = -1;
    if (i >= 7 && i < 13) {
      index = 0;
    } else if (i >= 13 && i < 18) {
      index = 1;
    } else if (i >= 18 && i < 22) {
      index = 2;
    } else {
      index = 3;
    }
    if (isOn && index > -1) {
      this.progress
        .getChildByName(index.toString())
        .children[appearTime - 1].getComponent(cc.Sprite).spriteFrame =
        this.listProgress[1];
    } else {
      this.progress
        .getChildByName(index.toString())
        .children[appearTime - 1].getComponent(cc.Sprite).spriteFrame =
        this.listProgress[0];
    }
  }

  public openWin() {
    let time = 0;
    let playSound = false;

    if (this.winType > -1) {
      let sound = "";
      this.pnWin[this.winType].active = true;
      this.pnWin[this.winType].children[1]
        .getComponent(sp.Skeleton)
        .setAnimation(0, "animation", false);

      this.lblWin.active = true;
      switch (this.winType) {
        case 1: //big win
          time = 6;
          this.lblWin.y = -180;
          sound = SLOT_SOUND_TYPE.BIGWINSTART;
          this.pnWin[0].active = true;
          break;

        case 2: //super win
          time = 6;
          this.lblWin.y = -260;
          sound = SLOT_SOUND_TYPE.SUPERWINSTART;
          break;

        case 3: //mega win
          time = 9;
          this.lblWin.y = -280;
          sound = SLOT_SOUND_TYPE.MEGAWINSTART;
          break;

      }

      SlotAstrosMusicManager.instance.playType(sound, 2);
      this.scheduleForLbl(
        this.thisRoundResult.totalProfit + this.bonusProfit,
        time - 1,
        playSound
      );
    }

    this.scheduleOnce(() => {
      if (this.winType > -1) {
        this.lblWin.getComponent(cc.Label).string = "";
        this.lblWin.active = false;
        this.pnWin[this.winType].active = false;
        if (this.winType === 1) {
          this.pnWin[0].active = false;
        }
      }
      this.totalNum = this.thisRoundResult.totalProfit + this.bonusProfit;
      this.updateWinLbl();
      SlotAstrosController.instance.currentBalance =
        this.thisRoundResult.currentMoney;
      SlotAstrosController.instance.updateBalance(
        this.thisRoundResult.currentMoney
      );
      this.scheduleOnce(() => {
        // let data: SlotCmd.ImpData = {
        //   betAmount: 10000,
        //   currentMoney: 10171002172,
        //   rowList: [
        //     {
        //       amountProfit: 0,
        //       listItem: [
        //         { index: 0, id: 5, highlight: false, appearTime: 0 },
        //         { index: 1, id: 6, highlight: false, appearTime: 0 },
        //         { index: 2, id: 4, highlight: true, appearTime: 0 },
        //         { index: 3, id: 4, highlight: true, appearTime: 0 },
        //         { index: 4, id: 3, highlight: true, appearTime: 0 },
        //         { index: 5, id: 4, highlight: true, appearTime: 0 },
        //         { index: 6, id: 3, highlight: true, appearTime: 0 },
        //       ],
        //       row: 0,
        //       type: 1,
        //     },
        //     {
        //       amountProfit: 0,
        //       listItem: [
        //         { index: 7, id: 5, highlight: false, appearTime: 0 },
        //         { index: 8, id: 6, highlight: false, appearTime: 0 },
        //         { index: 9, id: 4, highlight: true, appearTime: 0 },
        //         { index: 10, id: 3, highlight: true, appearTime: 0 },
        //         { index: 11, id: 4, highlight: true, appearTime: 0 },
        //         { index: 12, id: 4, highlight: false, appearTime: 0 },
        //       ],
        //       row: 1,
        //       type: 1,
        //     },
        //   ],
        //   totalProfit: 0,
        // };
        // this.processData(data, false);

        SlotAstrosController.instance.checkAutoSpin();
      }, 0.5);
    }, time);
  }

  public scheduleForLbl(winMoney: number, time: number, playSound: boolean) {
    let profit = 0;
    let totalProfit = winMoney;
    let profitStep = winMoney / (time * 10);

    if (playSound) {
      SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BANGUPLOOP, 3);
    }

    this.schedule(increaseWinLbl, 0.075);

    function increaseWinLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        if (playSound) {
          SlotAstrosMusicManager.instance.playType(
            SLOT_SOUND_TYPE.BANGUPEND,
            3
          );
        }
        this.unschedule(increaseWinLbl);
        this.lblWin.getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
        this.updateWinLbl(totalProfit);
      } else {
        this.lblWin.getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }
  }

  public bonusAnim() {
    this.listAnimCells.forEach((element) => {
      if (
        element.getChildByName("Skeleton").getComponent(sp.Skeleton)
          .skeletonData === this.listSyms[1]
      ) {
        let originPos = element.getPosition();
        cc.tween(element)
          .to(0.5, { position: cc.v3(0, 145) })
          .call(() => {
            element.setPosition(originPos);
            element.active = false;
            SlotAstrosBonus.instance.xBonusAnim();
          })
          .start();
      }
    });
  }

  public unAnimWhileSpin(i: number, off: boolean) {
    let j = 0;
    switch (i) {
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        j = 6;
        break;

      case 18:
      case 19:
      case 20:
      case 21:
        j = 5;
        break;

      case 22:
      case 23:
      case 24:
        j = 4;
        break;
    }

    if (
      this.isSymbolNoDif(
        this.listAnimCells[i - j]
          .getChildByName("Skeleton")
          .getComponent(sp.Skeleton).skeletonData
      )
    ) {
      this.listAnimCells[i - j].active = !off;
    }
    if (
      this.isSymbolNoDif(
        this.listAnimCells[i - (j - 1)]
          .getChildByName("Skeleton")
          .getComponent(sp.Skeleton).skeletonData
      )
    ) {
      this.listAnimCells[i - (j - 1)].active = !off;
    }
  }

  private turnOffAnimExBonus() {
    this.listAnimCells.forEach((element) => {
      if (
        !this.isSymbolInList(
          element.getChildByName("Skeleton").getComponent(sp.Skeleton)
            .skeletonData,
          this.listSyms[1]
        )
      ) {
        element.active = false;
      } else {
        element.active = true;
        element
          .getChildByName("Skeleton")
          .getComponent(sp.Skeleton)
          .setAnimation(0, SlotCmd.STATE_OF_ANIM.BONUS, true);
        element
          .getChildByName("Skeleton")
          .getComponent(sp.Skeleton)
          .setCompleteListener(null);
      }
    });
  }
}
