const { ccclass, property } = cc._decorator;
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler , {SLOT_SOUND_TYPE} from "./Panda.SoundControler";

@ccclass
export default class PandaJackpotMoney extends cc.Component {

    @property(cc.Label)
    public lbMoney: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    private timer = 0.003;
    private unit3Second = 60;
    private oldMoney: any = 0;
    private newMoney: number = 0;
    private stepMoney: number = 0;
    // onLoad () {}

    start() {
        // TODO
    }

    // update (dt) {}
    public init(newMoney: number) {
        this.unschedule(this.countUp);
        this.setStrMoney(newMoney);
    }

    public effectMoney(newMoney: number) {
        this.unschedule(this.countUp);
        if(newMoney > 0) {
            PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_COIN_DOWN_UP);
            this.oldMoney = (this.lbMoney.string) ? parseInt(this.lbMoney.string.replace(/\./g, '')) : 0;
            this.newMoney = newMoney;
            this.stepMoney = Math.ceil(Math.abs(this.newMoney - this.oldMoney) / this.unit3Second);
            this.schedule(this.countUp, this.timer, cc.macro.REPEAT_FOREVER, 0);
        } else {
            this.setStrMoney(0);
            this.unschedule(this.countUp);
        }
    }

    public showMoney(newMoney: number) {
        this.unschedule(this.countUp);
        if(newMoney > 0) {
            PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_COIN_DOWN_UP);
            this.stepMoney = Math.ceil(newMoney / this.unit3Second);
            this.oldMoney = 0;
            this.newMoney = newMoney;
            this.schedule(this.countUp, this.timer, cc.macro.REPEAT_FOREVER, 0);
        } else {
            this.setStrMoney(0);
            this.unschedule(this.countUp);
        }
    }

    public setStrMoney(money: number) {
        this.lbMoney.string = (money > 0) ? BGUI.Utils.formatMoneyWithCommaOnly(money) : "";
    }

    public effectJackpot(newMoney: number) {
        this.unschedule(this.countDown);
        this.unschedule(this.countUp);
        this.oldMoney = (this.lbMoney.string) ? parseInt(this.lbMoney.string.replace(/\./g, '')) : 0;
        this.newMoney = newMoney;
        if (this.newMoney > this.oldMoney) {
            this.stepMoney = Math.ceil((this.newMoney - this.oldMoney) / this.unit3Second);
            this.schedule(this.countUp, this.timer, cc.macro.REPEAT_FOREVER, 0);
        }
        if (this.oldMoney > this.newMoney) {
            this.stepMoney = Math.ceil((this.oldMoney - this.newMoney) / this.unit3Second);
            this.schedule(this.countDown, this.timer, cc.macro.REPEAT_FOREVER, 0);
        }
    }

    private countDown() {
        if (this.oldMoney > this.newMoney) {
            this.oldMoney -= (this.stepMoney > 0) ? this.stepMoney : 1;
            this.setStrMoney(this.oldMoney);
        } else {
            this.unschedule(this.countDown);
            this.setStrMoney(this.newMoney);
        }
    }

    private countUp() {
        if (this.oldMoney < this.newMoney) {
            this.oldMoney += (this.stepMoney > 0) ? this.stepMoney : 1;
            this.setStrMoney(this.oldMoney);
        } else {
            this.unschedule(this.countUp);
            this.setStrMoney(this.newMoney);
        }
    }
}
