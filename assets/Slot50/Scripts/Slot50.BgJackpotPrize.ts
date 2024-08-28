import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50JackpotMoney from "./Slot50.JackpotMoney";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot50BgJackpotPrize extends cc.Component {
    public static instance: Slot50BgJackpotPrize = null;

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
        Slot50BgJackpotPrize.instance = this;
        this.hiddenAllSkeleton();
    }

    start() {
        // TODO
    }

    public showJackpot(idJackpot: number, winMoney: number): number {
        this.hiddenAllSkeleton();
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_JACKPOT);
        let timer = 9;
        switch (idJackpot) {
            case Slot50Cmd.JACKPOT.MINI:
                this.activeNode(true);
                this.skeletonMini.node.active = true;
                this.skeletonMini.setAnimation(0, "Mini", false);
                this.displayMiniMoney(winMoney);
                return timer;
                break;

            case Slot50Cmd.JACKPOT.MINOR:
                this.activeNode(true);
                this.skeletonMinor.node.active = true;
                this.skeletonMinor.setAnimation(0, "Minor", false);
                this.displayMinorMoney(winMoney);
                return timer;
                break;

            case Slot50Cmd.JACKPOT.MAJOR:
                this.activeNode(true);
                this.skeletonMajor.node.active = true;
                this.skeletonMajor.setAnimation(0, "Major", false);
                this.displayMajorMoney(winMoney);
                return timer;
                break;

            case Slot50Cmd.JACKPOT.GRAND:
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
        this.lbMiniMoney.getComponent(Slot50JackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbMiniMoney.active = false;
        }, this.timerOffLb);
    }

    private displayMinorMoney(winMoney: number) {
        this.lbMinorMoney.active = true;
        this.lbMinorMoney.getComponent(Slot50JackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbMinorMoney.active = false;
        }, this.timerOffLb);
    }

    private displayMajorMoney(winMoney: number) {
        this.lbMajorMoney.active = true;
        this.lbMajorMoney.getComponent(Slot50JackpotMoney).showMoney(winMoney);
        this.scheduleOnce(() => {
            this.lbMajorMoney.active = false;
        }, this.timerOffLb);
    }

    private displayGrandMoney(winMoney: number) {
        this.lbGrandMoney.active = true;
        this.lbGrandMoney.getComponent(Slot50JackpotMoney).showMoney(winMoney);
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
