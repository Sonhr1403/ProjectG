const { ccclass, property } = cc._decorator;
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50JackpotMoney from "./Slot50.JackpotMoney";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, {SLOT_SOUND_TYPE} from "./Slot50.SoundControler";
@ccclass
export default class Slot50BgPrize extends cc.Component {
    public static instance: Slot50BgPrize = null;

    @property(sp.Skeleton)
    private skeletonWin: sp.Skeleton = null;

    @property(cc.Prefab)
    private prfLbMoney: cc.Prefab = null;

    private lbNWin: cc.Node = null;

    private dataAnimation = {
        [Slot50Cmd.TYPE_WIN.BIG_WIN]: { skin: "Big win", animation: "Big win/Big win" },
        [Slot50Cmd.TYPE_WIN.MEGA_WIN]: { skin: "Mega win", animation: "Mega win/Mega win" },
        [Slot50Cmd.TYPE_WIN.ULTRA_WIN]: { skin: "Epic win", animation: "Epic win/Epic win" },
        [Slot50Cmd.TYPE_WIN.EPIC_WIN]: { skin: "Ultra win", animation: "Ultra win/Ultra win" }
    };
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Slot50BgPrize.instance = this;
        this.initLbMoney();
    }

    private initLbMoney() {
        this.lbNWin = cc.instantiate(this.prfLbMoney);
        this.lbNWin.setPosition(cc.v2(0, -180));
        this.lbNWin.zIndex = 9999;
        this.lbNWin.scale = 2;
        this.node.addChild(this.lbNWin);
    }

    start() {
        // this.activeNode(false)
    }

    public getAndShowTypeWin(winMoney: number, betAmount: number): number {
        // return Slot50Cmd.TYPE_WIN.EPIC_WIN;
        const winRate = (winMoney / betAmount);
        if (winRate >= 5) {
            if (winRate >= 5 && winRate <= 10) {
                Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_BIG_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[Slot50Cmd.TYPE_WIN.BIG_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[Slot50Cmd.TYPE_WIN.BIG_WIN].animation, false);
                this.displayMoney(winMoney);
                return Slot50Cmd.TYPE_WIN.BIG_WIN;
            } else if (winRate >= 11 && winRate <= 20) {
                Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_MEGA_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[Slot50Cmd.TYPE_WIN.MEGA_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[Slot50Cmd.TYPE_WIN.MEGA_WIN].animation, false);
                this.displayMoney(winMoney);
                return Slot50Cmd.TYPE_WIN.MEGA_WIN;
            } else if (winRate >= 21 && winRate <= 30) {
                Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_ULTRA_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[Slot50Cmd.TYPE_WIN.ULTRA_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[Slot50Cmd.TYPE_WIN.ULTRA_WIN].animation, false);
                this.displayMoney(winMoney);
                return Slot50Cmd.TYPE_WIN.ULTRA_WIN;
            } else if (winRate >= 31) {
                Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_EPIC_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[Slot50Cmd.TYPE_WIN.EPIC_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[Slot50Cmd.TYPE_WIN.EPIC_WIN].animation, false);
                this.displayMoney(winMoney);
                return Slot50Cmd.TYPE_WIN.EPIC_WIN;
            }
        }
        return 0;
    }

    private displayMoney(winMoney: number) {
        this.lbNWin.active = true;
        this.lbNWin.getComponent(Slot50JackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbNWin.active = false;
        }, 8);
    }

    public hidden() {
        this.activeNode(false)
    }

    private activeNode(isActive: boolean) {
        this.node.active = isActive;
    }
    // update (dt) {}
}
