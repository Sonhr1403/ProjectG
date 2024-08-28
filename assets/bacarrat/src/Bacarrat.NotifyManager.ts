// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_NotifyManager extends cc.Component {

    @property(cc.Label)
    lbNoti: cc.Label = null;

    @property(sp.Skeleton)
    skNoti: sp.Skeleton = null;

    onLoad() {
        this.skNoti.node.active = false;
        this.lbNoti.string = "";
    }

    showNotify(text: string) {
        this.lbNoti.string = text;
        this.skNoti.node.active = true;
        this._playSpine(this.skNoti.node, "toast_dai", false, () => {
            this.skNoti.node.active = false;
            this.lbNoti.string = "";
        })
    }

    private _playSpine(nAnim: cc.Node, animName: string, loop: boolean, callback: Function) {
        let spine = nAnim.getComponent(sp.Skeleton);
        let track = spine.setAnimation(0, animName, loop);

        if (track) {
            spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animName && callback) {
                    callback && callback(); // Execute your own logic after the animation ends
                }
            });
        }
    }

}
