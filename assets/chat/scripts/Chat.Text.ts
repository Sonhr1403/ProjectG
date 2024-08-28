// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chat_Text extends cc.Component {

    @property(cc.Label)
    lb_chat: cc.Label = null

    @property(cc.Label)
    lb_chat1: cc.Label = null

    @property(cc.Node)
    sp_left: cc.Node = null

    @property(cc.Node)
    sp_right: cc.Node = null

    setDataChat(msg, index) {
        this.lb_chat.string = msg
        this.lb_chat1.string = msg

        if (index === 0) {
            this.sp_left.active = false;
            this.sp_right.active = !this.sp_left.active;
        }
        else {
            this.sp_left.active = true;
            this.sp_right.active = !this.sp_left.active;
        }
    }
}
