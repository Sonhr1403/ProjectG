
const { ccclass, property } = cc._decorator;

@ccclass
export default class Chat_Emo extends cc.Component {

    @property(sp.Skeleton)
    emo: sp.Skeleton = null

    setDataEmo(msg) {
        BGUI.ZLog.log('setDataEmo = ', msg)
        this.emo.node.active = true;
        this.emo.defaultAnimation = msg
        this.emo.setAnimation(0, msg, true)
    }
}
