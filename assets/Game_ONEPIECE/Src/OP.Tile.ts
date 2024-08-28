// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import OPCommon from "./OP.Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPTile extends cc.Component {
  @property(cc.Label)
  private numLbl: cc.Label = null;
  @property(cc.Node)
  private chestIcon: cc.Node = null;
  @property(cc.Node)
  private coinIcon: cc.Node = null;
  @property(cc.Node)
  private fireIcon: cc.Node = null;
  @property(cc.Node)
  private filledIcon: cc.Node = null;
  private isEnabled: boolean = false;
  private tileIndex: number = -1;
  //   start() {
  //     this.setRandom()
  //   }

  public setRandom(): void {
    let tempNum = OPCommon.getRandomNumber(1, 99);
    this.numLbl.string = OPCommon.minTwoDigits(tempNum).toString();
    let tempIndex = OPCommon.getRandomNumber(1, 4);
    if (tempIndex == 1) {
      this.chestIcon.active = true;
    } else if (tempIndex == 2) {
      this.coinIcon.active = true;
    } else if (tempIndex == 3) {
      this.fireIcon.active = true;
    } else {
    }
  }

  public createTile(res): void {
    this.numLbl.string = res.number.toString();
    if (res.enabled) {
      this.filledIcon.active = true;
    }
    switch (Number(res.type)) {
      case 1:
        this.chestIcon.active = true;
        break;
      case 2:
        this.coinIcon.active = true;
        break;
      case 3:
        this.fireIcon.active = true;
        break;
      default:
        this.chestIcon.active = false;
        this.coinIcon.active = false;
        this.fireIcon.active = false;
        break;
    }
  }

  updateTileIndex(index) {
    this.tileIndex = index;
  }

  getTileIndex() {
    return this.tileIndex;
  }

  public setResult(res): void {
    this.isEnabled = res.isEnabled;
  }
  // update (dt) {}
}
