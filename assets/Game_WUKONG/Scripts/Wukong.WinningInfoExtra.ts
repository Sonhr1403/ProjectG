// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import WukongColumn from "./Wukong.Column";
import WukongHistory from "./Wukong.History";
import WukongWinningInfo from "./Wukong.WinningInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WukongWinningInfoExtra extends cc.Component {
  public static instance: WukongWinningInfoExtra = null;

  @property(cc.Sprite)
  winningImage: cc.Sprite = null;
  @property(cc.Label)
  winningAmount: cc.Label = null;
  @property(cc.Label)
  winningInfo: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    WukongWinningInfoExtra.instance = this;
  }

  initItem(info) {
    let id = info.id - 1;
    this.winningImage.spriteFrame = WukongHistory.instance.winSprites[id];
    this.winningAmount.string = info.moneyWin.toString();
    this.winningInfo.string = info.id;
  }

  // update (dt) {}
}
