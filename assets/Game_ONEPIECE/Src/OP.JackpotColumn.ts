// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import OPJackpotCell from "./OP.JackpotCell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OPJackpotColumn extends cc.Component {
    public static instance: OPJackpotColumn = null;
    @property(cc.Node)
    private nContainer: cc.Node = null;
    @property(cc.Prefab)
    private prfCell: cc.Prefab = null;
    private cells: Array<cc.Node> = [];
    private columnNum: Array<cc.Node> = [];
    onLoad() {
        OPJackpotColumn.instance = this;
    }

    public createColumn(num): void {
        if (this.cells.length >= 0) {
          this.nContainer.removeAllChildren();
        }
        this.columnNum = num;
        for (let i = 0; i < num + 2; i++) {
          let nCell: cc.Node = cc.instantiate(this.prfCell);
          this.cells[i] = nCell;
          this.nContainer.addChild(nCell);
        }
      }

}
