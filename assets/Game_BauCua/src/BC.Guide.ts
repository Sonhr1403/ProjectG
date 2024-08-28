// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import BCController from "./BC.Controller";
@ccclass
export default class BCGuide extends cc.Component {

    public onClickClose() {
        this.hide()
    }

    public hide() {
        this.node.active = false;
    }

    public show() {
        BCController.instance.countDoNotInteract = 0;
        this.node.active = true;
    }
}
