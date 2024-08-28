// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import WukongColumn, { Direction } from "./Wukong.Column";
import WukongHistory from "./Wukong.History";
import WukongWinningInfo from "./Wukong.WinningInfo";
@ccclass
export default class WukongHistoryItem extends cc.Component {
  public static instance: WukongHistoryItem = null;

  @property(cc.Label)
  time: cc.Label = null;
  @property(cc.Label)
  betting: cc.Label = null;
  @property(cc.Label)
  result: cc.Label = null;
  @property(cc.Label)
  game: cc.Label = null;

  private detailedInfo;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    WukongHistoryItem.instance = this;
  }

  start() {}

  initItem(info, id) {
    this.time.string = info.date + " " + info.time;
    this.detailedInfo = info;
    this.betting.string = info.betAmount.toString();
    if (info.amountProfit == 0) {
      this.result.string = "-" + info.betAmount.toString();
    } else {
      this.result.string = info.amountProfit.toString();
    }
  }

  toggleDetailedHistory() {
    WukongHistory.instance.detailedInfo.active = false
    WukongHistory.instance.detailedInfo.getComponent(WukongWinningInfo).initItem(this.detailedInfo)
    WukongHistory.instance.detailedInfo.active = true
  }

  // update (dt) {}
}
