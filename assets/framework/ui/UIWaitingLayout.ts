
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIWaitingLayout extends BGUI.UIWaitingLayout {

    @property(cc.Node)
    nFaded: cc.Node = null;

    @property(cc.Node)
    nLoading: cc.Node = null;


    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    }


    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.nLoading && (this.nLoading.active = false);
        this.nFaded && (this.nFaded.active = false);
        let act = cc.sequence(cc.delayTime(0), cc.callFunc(this._showWaitingUI.bind(this)));
        act.setTag(99);
        this.node.stopActionByTag(99);
        this.node.runAction(act);
    }

    _showWaitingUI() {
        // this.nLoading && this.nLoading.runAction(cc.rotateBy(1, 180).repeatForever());
        this.nLoading && (this.nLoading.active = true);
        this.nFaded && (this.nFaded.active = true);
    }

    _onTouchStart(event: cc.Event.EventTouch) {
        // BGUI.ZLog.log("vao day em oi");
        event.stopPropagation();
    }
}
