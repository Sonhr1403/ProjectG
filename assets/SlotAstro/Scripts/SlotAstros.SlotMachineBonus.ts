import { SlotCmd } from "./SlotAstros.Cmd";
import SlotAstrosColumnBonus, { Direction } from "./SlotAstros.ColumnBonus";
import SlotAstrosCommon from "./SlotAstros.Common";
import SlotAstrosMusicManager, { SLOT_SOUND_TYPE } from "./SlotAstros.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotAstrosMachineBonus extends cc.Component {
  public static instance: SlotAstrosMachineBonus = null;

  @property(cc.Node)
  private columns: cc.Node[] = [];

  @property(cc.Node)
  public lblWin: cc.Node = null;

  ////////////////////////////////////////////////////

  public currentMoney: number = 0;

  private columnResult = [];

  private thisRoundResult: SlotCmd.ImpFreeGame = null;

  ///////////////////////////////////////////////////////////

  protected onLoad(): void {
    SlotAstrosMachineBonus.instance = this;
  }

  public forceStop() {}

  public startSpinVirtual() {
    SlotAstrosMusicManager.instance.playLoop(SLOT_SOUND_TYPE.FSPRELOADERLOOP);

    for (let i = 0; i < 7; i++) {
      let objColumn = this.columns[i].getComponent(SlotAstrosColumnBonus);
      objColumn.spinDirection = Direction.Down;
      objColumn.spinVirtual(0);
    }
  }

  public letGo(data: SlotCmd.ImpFreeGame): void {

    this.processData(data);

    let delay = 0;
    for (let i = 0; i < 7; i++) {
      this.scheduleOnce(() => {
        this.pushData(i);
      }, delay);
      delay += 3;
    }
  }

  private processData(data: SlotCmd.ImpFreeGame) {
    this.thisRoundResult = data;
    this.columnResult = data.list;
    cc.log(this.thisRoundResult);
  }

  private pushData(i: number) {
    let objColumn = this.columns[i].getComponent(SlotAstrosColumnBonus);
    objColumn.spinDirection = Direction.Down;
    objColumn.pushData(this.columnResult[i], i);
  }

  public updateWinLbl() {
    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.FSPRELOADERFX, 3);
    this.lblWin.getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(this.currentMoney);
  }

  public scheduleForLbl() {
    let profit = this.currentMoney;
    let totalProfit = this.thisRoundResult.totalProfit;
    let profitStep = (this.thisRoundResult.totalProfit - this.currentMoney) / 100;

    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BONUSWIN, 3);

    if (this.thisRoundResult.totalProfit > this.currentMoney) {
      this.schedule(increaseLbl, 0.001);
    }

    function increaseLbl() {
      profit += profitStep;
      if (profit >= totalProfit) {
        this.unschedule(increaseLbl);
        this.lblWin.getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(totalProfit);
      } else {
        this.lblWin.getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(profit);
      }
    }
  }

  public reset() {
    this.currentMoney = 0;
    this.lblWin.getComponent(cc.Label).string = "";
    this.columns.forEach(element => {
      element.getComponent(SlotAstrosColumnBonus).clearCells();
    });
  }
}
