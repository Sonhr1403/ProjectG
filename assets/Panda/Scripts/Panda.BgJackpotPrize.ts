import { PandaCmd } from "./Panda.Cmd";
import PandaJackpotMoney from "./Panda.JackpotMoney";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PandaBgJackpotPrize extends cc.Component {
    public static instance: PandaBgJackpotPrize = null;

    @property(sp.Skeleton)
    private skeletonMini: sp.Skeleton = null;

    @property(sp.Skeleton)
    private skeletonMinor: sp.Skeleton = null;

    @property(sp.Skeleton)
    private skeletonMajor: sp.Skeleton = null;

    @property(sp.Skeleton)
    private skeletonGrand: sp.Skeleton = null;

    @property(cc.Node)
    private lbMiniMoney: cc.Node = null;

    @property(cc.Node)
    private lbMinorMoney: cc.Node = null;

    @property(cc.Node)
    private lbMajorMoney: cc.Node = null;

    @property(cc.Node)
    private lbGrandMoney: cc.Node = null;
    ////////////////
    private timerOffLb: number = 9;
    onLoad() {
        PandaBgJackpotPrize.instance = this;
        this.hiddenAllSkeleton();
    }

    start() {
        // TODO
    }

    public showJackpot(idJackpot: number, winMoney: number): number {
        this.hiddenAllSkeleton();
        PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_JACKPOT);
        let timer = 9;
        switch (idJackpot) {
            case PandaCmd.JACKPOT.MINI:
                this.activeNode(true);
                this.skeletonMini.node.active = true;
                this.skeletonMini.setAnimation(0, "Mini", false);
                this.displayMiniMoney(winMoney);
                return timer;
                break;

            case PandaCmd.JACKPOT.MINOR:
                this.activeNode(true);
                this.skeletonMinor.node.active = true;
                this.skeletonMinor.setAnimation(0, "Minor", false);
                this.displayMinorMoney(winMoney);
                return timer;
                break;

            case PandaCmd.JACKPOT.MAJOR:
                this.activeNode(true);
                this.skeletonMajor.node.active = true;
                this.skeletonMajor.setAnimation(0, "Major", false);
                this.displayMajorMoney(winMoney);
                return timer;
                break;

            case PandaCmd.JACKPOT.GRAND:
                this.activeNode(true);
                this.skeletonGrand.node.active = true;
                this.skeletonGrand.setAnimation(0, "Grand", false);
                this.displayGrandMoney(winMoney);
                return timer;
                break;
        }

        return 0;
    }

    private displayMiniMoney(winMoney: number) {
        this.lbMiniMoney.active = true;
        this.lbMiniMoney.getComponent(PandaJackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbMiniMoney.active = false;
        }, this.timerOffLb);
    }

    private displayMinorMoney(winMoney: number) {
        this.lbMinorMoney.active = true;
        this.lbMinorMoney.getComponent(PandaJackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbMinorMoney.active = false;
        }, this.timerOffLb);
    }

    private displayMajorMoney(winMoney: number) {
        this.lbMajorMoney.active = true;
        this.lbMajorMoney.getComponent(PandaJackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbMajorMoney.active = false;
        }, this.timerOffLb);
    }

    private displayGrandMoney(winMoney: number) {
        this.lbGrandMoney.active = true;
        this.lbGrandMoney.getComponent(PandaJackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbGrandMoney.active = false;
        }, this.timerOffLb);
    }

    public hiddenAllSkeleton() {
        this.skeletonMini.node.active = false;
        this.skeletonMinor.node.active = false;
        this.skeletonMajor.node.active = false;
        this.skeletonGrand.node.active = false;
    }

    public hidden() {
        this.activeNode(false)
    }

    private activeNode(isActive: boolean) {
        this.node.active = isActive;
    }
}
