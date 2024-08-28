const { ccclass, property } = cc._decorator;

@ccclass
export default class PandaMessage extends cc.Component {
    public static instance: PandaMessage = null;

    @property(cc.Label)
    private lbMessage: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        PandaMessage.instance = this;
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
