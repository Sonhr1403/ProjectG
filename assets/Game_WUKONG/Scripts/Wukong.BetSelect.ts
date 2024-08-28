// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import WukongMain from "./Wukong.Controller";
import Bet from "./Wukong.BetOptions";
import { WukongCmd } from "./Wukong.Cmd";
import WukongCommon from "./Wukong.Common";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BetOptions extends cc.Component {
  public static instance: BetOptions = null;

  @property(cc.Label)
  balanceValue: cc.Label = null;
  private value: number = 0
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    BetOptions.instance = this;
  }
  initItem(info, chosen = false) {
    this.balanceValue.string = WukongCommon.numberWithCommas(info).toString();
    this.value = info
    if (chosen == false) {
      this.node.children[0].active = false;
    } else {
      this.node.children[1].active = false;
    }
  }

  changeBet() {
    WukongMain.instance.betValue.string = WukongCommon.numberWithCommas(
      this.balanceValue.string
    );
    WukongMain.instance.currentBetLV = WukongCommon.numberWithCommas(
      Number(this.balanceValue.string)
    );
    Bet.instance.deactivatebetOptions();  
    WukongCmd.Send.sendSlotJoinGame(this.value);
  }
  // start () {

  // }

  // update (dt) {}
}
