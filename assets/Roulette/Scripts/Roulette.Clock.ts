// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RLTClock extends cc.Component {
    public static instance: RLTClock = null;

    @property(cc.Label)
    public lbCountDown: cc.Label = null;

    private _localTimer: number = -1;

    ///////////////////////////////////////////////////

    onLoad () {
        RLTClock.instance = this;
    }

    start () {
        this.hideClock();
    }

    public setCountDown(time: number) {
        this._localTimer = time;
        if (time > 0) {
            this.showClock();
            this.lbCountDown.string = time.toString();
            this.schedule(this.countDown, 1);
        }
    }

    private countDown(): void {
        this._localTimer--;
        if (this._localTimer > 0) {
            if (this._localTimer == 5) {
            }
            this.lbCountDown.string = this._localTimer.toString();
        } else {
            this.resetCountDown();
        }
    }

    private resetCountDown(): void {
        this.hideClock();
        this.unschedule(this.countDown);
    }

    private showClock() {
        this.node.active = true;
    }

    private hideClock() {
        this.node.active = false;
    }
}
