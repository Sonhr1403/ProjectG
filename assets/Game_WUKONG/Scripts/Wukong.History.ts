// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import WukongMain from "./Wukong.Controller";
import WukongHistoryItem from "./Wukong.HistoryItems";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WukongHistory extends cc.Component {
  public static instance: WukongHistory = null;

  @property(cc.Prefab)
  prefabHistoryItem: cc.Prefab = null;
  @property(cc.Node)
  contentHistory: cc.Node = null;
  @property(cc.Node)
  detailedInfo: cc.Node = null;
  @property(cc.SpriteFrame)
  public winSprites: cc.SpriteFrame[] = [];

  onLoad() {
    WukongHistory.instance = this;
    this.detailedInfo.active = false
  }

  onEnable() {
    this.contentHistory.removeAllChildren(true);
   
    this.initItems();
  }

  initItems() {

    for (let i = 0; i < WukongMain.instance.historySpin.length; i++) {
      // if (i == 0) {
      // } else {
        let item = cc.instantiate(this.prefabHistoryItem);
        let historyDetails = WukongMain.instance.historySpin[i];
        cc.log(historyDetails)
        item.getComponent(WukongHistoryItem).initItem(historyDetails, i);
        this.contentHistory.addChild(item);
      // }
    }
  }

  closeHistory() {
    this.node.active = false;
  }

  // update (dt) {}
}
