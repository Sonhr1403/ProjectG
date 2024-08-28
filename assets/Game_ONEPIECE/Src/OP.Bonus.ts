// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import OPJackpotColumn from "./OP.JackpotColumn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPBonus extends cc.Component {
  public static instance: OPBonus = null;
  @property(cc.Node)
  multiplierNode: cc.Node = null;
  @property(cc.Label)
  totalWin: cc.Label = null;
  @property(cc.Node)
  bonusNode: cc.Node = null;
  @property(cc.Prefab)
  cellPrf: cc.Prefab = null;

  private cells = [];
  private arrayPosOfCell: Array<cc.Vec3> = [
    cc.v3(-265.5, 200, 0),
    cc.v3(-88.5, 200, 0),
    cc.v3(88.5, 200, 0),
    cc.v3(265.5, 200, 0),
    cc.v3(-354, 0, 0),
    cc.v3(-177, 0, 0),
    cc.v3(0, 0, 0),
    cc.v3(177, 0, 0),
    cc.v3(354, 0, 0),
    cc.v3(-265.5, -200, 0),
    cc.v3(-88.5, -200, 0),
    cc.v3(88.5, -200, 0),
    cc.v3(265.5, -200, 0),
  ];
  private currentMultiplier: number = 0;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    OPBonus.instance = this;
  }

  protected onEnable(): void {
    this.createBonus();
    this.resetBonus();
  }

  public createBonus() {
    this.bonusNode.removeAllChildren();
    this.totalWin.node.active = false;
    this.cells = [];
    for (let i = 0; i < 13; i++) {
      let newRow: cc.Node = cc.instantiate(this.cellPrf);
      this.cells[i] = newRow;
      this.cells[i].position = this.arrayPosOfCell[i];
      this.bonusNode.addChild(newRow);
    }
  }

  resetBonus() {
    this.currentMultiplier = 0;
    for (let i in this.multiplierNode.children) {
      this.multiplierNode.children[i].active = false;
    }
  }
  // update (dt) {}
}
