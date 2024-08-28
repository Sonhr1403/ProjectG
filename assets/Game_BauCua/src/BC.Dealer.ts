import BCSoundControler from "./BC.SoundControler";
import { BC_SOUND_TYPE } from "./BC.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BCDealer extends cc.Component {
    public static instance: BCDealer = null;

    @property(sp.Skeleton)
    public skeletonDealer: sp.Skeleton = null;

    @property(cc.Node)
    public nChips: cc.Node = null;

    @property(cc.Node)
    public nClock: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BCDealer.instance = this;
    }

    start() {
        // TODO
    }

    public getAllChips() {
        return this.nChips.children;
    }

    public addChip(nChip: cc.Node) {
        nChip.setPosition(cc.v3(0, 0, 0));
        this.nChips.addChild(nChip);
    }

    // update (dt) {}

    public dealerStartNewGame() {
        BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.START_NEW_GAME);
        this.skeletonDealer.setAnimation(0, "start", false);
        this.scheduleOnce(() => {
            this.dealerNormal();
        }, 3);
    }

    public dealerNormal() {
        this.skeletonDealer.setAnimation(0, "idle", true);
    }

    public collectMoney() {
        this.skeletonDealer.setAnimation(0, "thu_tien", false);
        this.scheduleOnce(() => {
            this.dealerNormal();
        }, 3);
    }

    public payMoney(){
        this.skeletonDealer.setAnimation(0, "win", false);
        this.scheduleOnce(() => {
            this.dealerNormal();
        }, 3);
    }

    public notiLoser(){
        this.skeletonDealer.setAnimation(0, "lose", false);
        this.scheduleOnce(() => {
            this.dealerNormal();
        }, 1);
    }

    public dealerTip(){
        this.skeletonDealer.setAnimation(0, "tips", false);
        this.scheduleOnce(() => {
            this.dealerNormal();
        }, 2);
    }
}
