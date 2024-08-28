const { ccclass, property } = cc._decorator;

@ccclass
export default class SKMPopUpGuide extends cc.Component {
    public show() {
        this.node.active = true;
    }

    public onClickClose() {
        this.node.active = false;
    }
}
