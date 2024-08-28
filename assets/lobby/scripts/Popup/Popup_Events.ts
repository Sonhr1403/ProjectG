// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    svContent: cc.Node = null;

    @property(cc.Prefab)
    itemEvents: cc.Prefab = null;

    @property(cc.Node)
    bgEvent: cc.Node = null;

    @property(cc.SpriteFrame)
    choose: cc.SpriteFrame = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}

    // update (dt) {}

    hide(){
        this.node.active = false;
    }
}
