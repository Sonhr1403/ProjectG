const { ccclass, property } = cc._decorator;
import { PandaCmd } from "./Panda.Cmd";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

@ccclass
export default class PandaBgScreen extends cc.Component {
    public static instance: PandaBgScreen = null;

    @property(cc.Node)
    private skeletonBackground: cc.Node = null;

    @property(cc.Node)
    private skeletonWolf: cc.Node = null;

    @property(cc.Node)
    private skeletonDeco: cc.Node = null;

    @property(cc.Node)
    private skeletonGhostFont: cc.Node = null;

    @property(cc.Node)
    private skeletonGrass: cc.Node = null;

    @property(cc.Node)
    private skeletonLight: cc.Node = null;

    private skinBackground = "default";
    private animationBackground = ["background", "ghost_font", "grass", "light",];

    private skinWolf = "Wolf";
    private animationWolf = ["wolf_stage", "wolf_finish",];
    private animationDeco = ["wolf_stage", "wolf_finish",];
    onLoad() {
        PandaBgScreen.instance = this;
        this.init();
    }

    start() {
        // TODO
    }

    private init() {
        this.skeletonBackground.active = true;
        this.skeletonGhostFont.active = true;
        this.skeletonGrass.active = true;
        this.offFreeGame();
    }

    public offFreeGame() {
        this.skeletonLight.active = false;
        this.skeletonWolf.active = false;
        this.skeletonDeco.active = false;
    }

    public runWolfStage() {
        this.skeletonWolf.active = true;
        this.skeletonLight.active = false;
        this.animationWolfStage();
    }

    public runWolfFinish() {
        this.skeletonWolf.active = true;
        this.skeletonLight.active = true;
        this.animationWolfFinish();
    }

    private animationWolfStage() {
        this.skeletonWolf.getComponent(sp.Skeleton).setSkin(this.skinWolf);
        this.skeletonWolf.getComponent(sp.Skeleton).setAnimation(0, this.animationWolf[0], false);
        this.skeletonDeco.getComponent(sp.Skeleton).setAnimation(0, this.animationDeco[0], true);
    }

    private animationWolfFinish() {
        this.skeletonWolf.getComponent(sp.Skeleton).setSkin(this.skinWolf);
        this.skeletonWolf.getComponent(sp.Skeleton).setAnimation(0, this.animationWolf[1], false);
        this.skeletonDeco.getComponent(sp.Skeleton).setAnimation(0, this.animationDeco[1], true);
    }
}
