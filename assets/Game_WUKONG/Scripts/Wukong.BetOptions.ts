// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import BetOptions from "./Wukong.BetSelect";
import WukongMain from "./Wukong.Controller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Bet extends cc.Component {
  public static instance: Bet = null;
  @property(cc.Node)
  betOptionsContainer: cc.Node = null;
  @property(cc.Prefab)
  betOptions: cc.Prefab = null;

  // private betChoices = [
  //   200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2400, 2800, 3000,
  //   3200, 3600, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 14000, 16000,
  //   18000, 20000, 24000, 28000, 30000, 32000, 36000, 40000, 50000, 60000, 70000,
  //   80000, 90000, 100000, 120000, 140000, 160000, 180000, 200000,
  // ];
  private betChoices = [30000, 60000, 120000, 240000, 480000];

  // LIFE-CYCLE CALLBACKS:
  protected onLoad(): void {
    Bet.instance = this;
  }

  onEnable() {
    this.createItem();
  }
  createItem() {
    this.betOptionsContainer.removeAllChildren(true);
    for (let i = 0; i < this.betChoices.length; i++) {
      let item = cc.instantiate(this.betOptions);
      if (this.betChoices[i] === WukongMain.instance.currentBetLV) {
        item.getComponent(BetOptions).initItem(this.betChoices[i], true);
      } else {
        item.getComponent(BetOptions).initItem(this.betChoices[i], false);
      }

      this.betOptionsContainer.addChild(item);
    }
  }

  deactivatebetOptions() {
    this.node.active = false;
  }
  // update (dt) {}
}
