// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPJackpotCell extends cc.Component {
  @property(cc.Sprite)
  icon: cc.Sprite = null;
  @property(cc.SpriteFrame)
  options: cc.SpriteFrame[] = [];
  private type: number = -1;

  onLoad() {
    this.icon.spriteFrame = this.options[0];
  }

  private openJackpot() {
    this.node.getComponent(cc.Button).interactable = false;
    this.icon.spriteFrame = this.options[this.type];
  }

  // update (dt) {}
}
