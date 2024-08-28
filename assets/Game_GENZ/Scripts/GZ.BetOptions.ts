import BetOptions from "./GZ.BetSelect";
import GenZMain from "./GZ.Controller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Bet extends cc.Component {
  public static instance: Bet = null;
  @property(cc.Node)
  betOptionsContainer: cc.Node = null;
  @property(cc.Prefab)
  betOptions: cc.Prefab = null;

  private betChoices = [
    1000, 5000, 10000, 20000, 30000, 50000, 100000, 200000, 500000,
  ];

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
      if (this.betChoices[i] === GenZMain.instance.currentBetLV) {
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
}
