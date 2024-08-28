const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot50Message extends cc.Component {
    public static instance: Slot50Message = null;

    @property(cc.Label)
    private lbMessage: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Slot50Message.instance = this;
    }

    start() {
        // TODO
    }

    public show(message: string, timerOut: number) {
        this.node.active = true;
        this.lbMessage.string = message;
        if (timerOut > 0) {
            this.scheduleOnce(() => {
                this.hideMessage();
            }, timerOut);
        }
    }

    public hideMessage() {
        this.node.active = false;
    }

    // update (dt) {}
}
