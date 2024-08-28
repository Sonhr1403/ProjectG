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
export default class WukongGuide extends BGUI.UIPopup {
  public static instance: WukongGuide = null;

 

  onLoad() {
    WukongGuide.instance = this;
  }

  

  // update (dt) {}
}
