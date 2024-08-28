import BCSoundControler from "./BC.SoundControler";
import { BC_SOUND_TYPE } from "./BC.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BCClock extends cc.Component {

    @property(cc.Label)
    public lbCountDown: cc.Label = null;

    private _localTimer: number = -1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.hideClock();
    }

    // update (dt) {}
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
                BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.TIME_LIMIT)
            }
            this.lbCountDown.string = this._localTimer.toString()
        } else {
            BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.TIME_END)
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
