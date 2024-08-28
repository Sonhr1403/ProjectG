const { ccclass, property } = cc._decorator;
import { PandaCmd } from "./Panda.Cmd";
import PandaJackpotMoney from "./Panda.JackpotMoney";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, {SLOT_SOUND_TYPE} from "./Panda.SoundControler";
@ccclass
export default class PandaBgPrize extends cc.Component {
    public static instance: PandaBgPrize = null;

    @property(sp.Skeleton)
    private skeletonWin: sp.Skeleton = null;

    @property(cc.Node)
    private LbWinMoney: cc.Node = null;

    private dataAnimation = {
        [PandaCmd.TYPE_WIN.BIG_WIN]: { skin: "Big win", animation: "Big win/Big win" },
        [PandaCmd.TYPE_WIN.MEGA_WIN]: { skin: "Mega win", animation: "Mega win/Mega win" },
        [PandaCmd.TYPE_WIN.ULTRA_WIN]: { skin: "Epic win", animation: "Epic win/Epic win" },
        [PandaCmd.TYPE_WIN.EPIC_WIN]: { skin: "Ultra win", animation: "Ultra win/Ultra win" }
    };
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        PandaBgPrize.instance = this;
    }

    start() {
        // this.activeNode(false)
    }

    public getAndShowTypeWin(winMoney: number, betAmount: number): number {
        // return PandaCmd.TYPE_WIN.EPIC_WIN;
        const winRate = (winMoney / betAmount);
        if (winRate >= 5) {
            if (winRate >= 5 && winRate <= 10) {
                PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_BIG_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[PandaCmd.TYPE_WIN.BIG_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[PandaCmd.TYPE_WIN.BIG_WIN].animation, false);
                this.displayMoney(winMoney);
                return PandaCmd.TYPE_WIN.BIG_WIN;
            } else if (winRate >= 11 && winRate <= 20) {
                PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_MEGA_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[PandaCmd.TYPE_WIN.MEGA_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[PandaCmd.TYPE_WIN.MEGA_WIN].animation, false);
                this.displayMoney(winMoney);
                return PandaCmd.TYPE_WIN.MEGA_WIN;
            } else if (winRate >= 21 && winRate <= 30) {
                PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_ULTRA_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[PandaCmd.TYPE_WIN.ULTRA_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[PandaCmd.TYPE_WIN.ULTRA_WIN].animation, false);
                this.displayMoney(winMoney);
                return PandaCmd.TYPE_WIN.ULTRA_WIN;
            } else if (winRate >= 31) {
                PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_EPIC_WIN);
                this.activeNode(true);
                this.skeletonWin.setSkin(this.dataAnimation[PandaCmd.TYPE_WIN.EPIC_WIN].skin);
                this.skeletonWin.setAnimation(0, this.dataAnimation[PandaCmd.TYPE_WIN.EPIC_WIN].animation, false);
                this.displayMoney(winMoney);
                return PandaCmd.TYPE_WIN.EPIC_WIN;
            }
        }
        return 0;
    }

    private displayMoney(winMoney: number) {
        this.LbWinMoney.active = true;
        this.LbWinMoney.getComponent(PandaJackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.LbWinMoney.active = false;
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
