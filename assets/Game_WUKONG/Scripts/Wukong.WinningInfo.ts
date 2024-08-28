// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import WukongColumn from "./Wukong.Column";
import WukongWinningInfoExtra from "./Wukong.WinningInfoExtra";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WukongWinningInfo extends cc.Component {
  public static instance: WukongWinningInfo = null;

  @property(cc.Label)
  time: cc.Label = null;
  @property(cc.Label)
  betting: cc.Label = null;
  @property(cc.Label)
  balance: cc.Label = null;
  @property(cc.Label)
  totalWin: cc.Label = null;
  @property(cc.Label)
  winningPerSpin: cc.Label = null;
  @property(cc.Label)
  accumPayout: cc.Label = null;
  @property(cc.Label)
  totalPayout: cc.Label = null;

  @property({ type: cc.Node })
  slotMachineNode = null;
  @property(cc.Prefab)
  extraWinInfo: cc.Prefab = null;
  @property(cc.Node)
  extraWinInfoContent: cc.Node = null;
  @property(cc.Prefab)
  columnPrefab: cc.Prefab = null;

  private columns = [];
  private detailedInfo;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    WukongWinningInfo.instance = this;
  }
  onEnable() {}
  initItem(info) {
    this.extraWinInfoContent.removeAllChildren();
    this.detailedInfo = info;
    this.totalWin.string = info.amountProfit.toString();
    let totalProfit = info.amountProfit.toString();
    this.totalWin.string = totalProfit
    this.winningPerSpin.string = totalProfit
    this.totalPayout.string = totalProfit
    cc.log(this.totalWin.string, info.amountProfit);
    this.time.string = info.date + " " + info.time;
    this.betting.string = info.betAmount;
    this.balance.string = info.currentMoney;
    for (let i = 0; i < info.results.length; i++) {
      let item = cc.instantiate(this.extraWinInfo);
      item.getComponent(WukongWinningInfoExtra).initItem(info.results[i]);
      this.extraWinInfoContent.addChild(item);
    }
    this.createMachine();
  }
  createMachine(): void {
    this.slotMachineNode.removeAllChildren();
    this.columns = [];
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < 5; idx++) {
      data[idx] = [];
    }

    for (let i = 0; i < 15; i++) {
      data[i % 5].push(this.detailedInfo.items[i]);
    }

    for (let i = 0; i < 5; i++) {
      let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
      this.columns[i] = newColumn;
      this.slotMachineNode.addChild(newColumn);
      const objColumn = newColumn.getComponent(WukongColumn);
      objColumn.createColumnHistory(data[i]);
      objColumn.columnNum = i;
      objColumn.index = i;
    }
  }
  // update (dt) {}
}
