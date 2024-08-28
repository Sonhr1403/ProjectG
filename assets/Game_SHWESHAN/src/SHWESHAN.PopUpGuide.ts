
const {ccclass, property} = cc._decorator;

@ccclass
export default class SWSPopUpGuide extends cc.Component {



    start() {
    }


    public onClickClose() {
        this.node.active = false;
    }

    // update (dt) {}
}
