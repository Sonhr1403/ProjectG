// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopUp_FreeChips extends cc.Component {
    public static instance: PopUp_FreeChips = null;

    @property(cc.Label)
    money: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        PopUp_FreeChips.instance = this;
    }

    // start () {}

    // update (dt) {}

    public updateMoneyGet(money: number){
        this.money.string = BGUI.Utils.formatMoneyWithCommaOnly(money);
    }

    hide(){
        this.node.active = false;
    }
}
