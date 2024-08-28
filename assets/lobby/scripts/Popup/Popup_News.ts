// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopUp_News extends cc.Component {
    public static instance: PopUp_News = null;

    @property(cc.Node)
    bGNews: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        PopUp_News.instance = this;
    }

    // start () {}

    // update (dt) {}

    unHide(){
        this.node.active = true;
        this.bGNews.runAction(
            cc.moveTo(0.5,cc.v2(525.5,0))
        );
    }

    hide(){ //525.5,0
        this.bGNews.runAction(
            cc.moveTo(0.5,cc.v2(1400,0))
        );
        this.scheduleOnce(() => {
            this.node.active = false;
        },0.5);
    }
}
