// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import OPCommon from "./OP.Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPBonusCell extends cc.Component {
  @property(cc.Sprite)
  icon: cc.Sprite = null;
  @property(cc.Label)
  value: cc.Label = null;
  private bonusValue: number = 1000000; // -1

  onLoad() {
    this.icon.node.active = true;
  }

  private openBonus() {
    this.node.getComponent(cc.Button).interactable = false;
    this.icon.node.active = false;
    this.value.node.active = true;
    this.value.string = OPCommon.convert2Label(this.bonusValue).toString();
  }

  // update (dt) {}
}
