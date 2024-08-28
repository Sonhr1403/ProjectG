// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import OPJackpotColumn from "./OP.JackpotColumn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPJackpot extends cc.Component {
  public static instance: OPJackpot = null;
  @property(cc.Node)
  jackpotNode: cc.Node = null;
  @property(cc.Prefab)
  rowPrefab: cc.Prefab = null;
  @property(cc.Node)
  minorNode: cc.Node = null;
  @property(cc.Node)
  majorNode: cc.Node = null;
  @property(cc.Node)
  grandNode: cc.Node = null;
  private rows = [];
  private minorPoints: number = 0;
  private majorPoints: number = 0;
  private grandPoints: number = 0;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    OPJackpot.instance = this;
  }

  protected onEnable(): void {
    this.resetJackpotPoints();
    this.createJackpot();
  }

  public createJackpot() {
    this.jackpotNode.removeAllChildren();
    this.rows = [];
    for (let i = 0; i < 3; i++) {
      let newRow: cc.Node = cc.instantiate(this.rowPrefab);
      this.rows[i] = newRow;
      this.jackpotNode.addChild(newRow);
      const objRow = newRow.getComponent(OPJackpotColumn);
      objRow.createColumn(i);
    }
  }

  resetJackpotPoints() {
    this.minorPoints = 0;
    this.majorPoints = 0;
    this.grandPoints = 0;
    for (let i = 0; i < 3; i++) {
      this.minorNode.children[i].active = false;
      this.majorNode.children[i].active = false;
      this.grandNode.children[i].active = false;
    }
  }

  updateJackpotPoints(index) {
    switch (index) {
      case 1:
        this.minorPoints += 1;
        for (let i = 0; i < this.minorPoints; i++) {
          this.minorNode.children[i].active = true;
        }
        break;
      case 2:
        this.majorPoints += 1;
        for (let i = 0; i < this.majorPoints; i++) {
          this.majorNode.children[i].active = true;
        }
        break;
      case 3:
        this.grandPoints += 1;
        for (let i = 0; i < this.grandPoints; i++) {
          this.grandNode.children[i].active = true;
        }
        break;
      default:
        break;
    }
  }

  // update (dt) {}
}
