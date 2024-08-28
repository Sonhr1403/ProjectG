// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import OPTile from "./OP.Tile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPLottery extends cc.Component {
  public static instance: OPLottery = null;
  @property({ type: cc.Node })
  private lotteryNode = null;
  @property({ type: cc.Node })
  private effectNode = null;
  @property({ type: cc.Prefab })
  private columnPrefab = null;
  @property({ type: cc.Prefab })
  private effectPrefab = null;
  private tiles = [];
  private FXTiles = [];
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    OPLottery.instance = this;
    this.effectNode.removeAllChildren();
    if (this.lotteryNode.children.length > 0) {
      this.lotteryNode.removeAllChildren();
    }
  }

  public generateTiles(res): void {
    this.lotteryNode.removeAllChildren();
    this.tiles = [];
    for (let i = 0; i < 25; i++) {
      let newTile: cc.Node = cc.instantiate(this.columnPrefab);
      this.tiles[i] = newTile;
      this.lotteryNode.addChild(newTile);
      const objTile = newTile.getComponent(OPTile);
      objTile.createTile(res[i]);
      objTile.updateTileIndex(i);
      let effectTile: cc.Node = cc.instantiate(this.effectPrefab);
      this.FXTiles[i] = effectTile;
      this.effectNode.addChild(effectTile);
    }
  }

  updateTiles(res) {
    for (let i = 0; i <= this.effectNode.children.length; i++) {
      const el = this.effectNode.children[i];
      const objCell = el.getComponent(OPTile);
      objCell.setResult(res[i]);
    }
  }

  // update (dt) {}
}
