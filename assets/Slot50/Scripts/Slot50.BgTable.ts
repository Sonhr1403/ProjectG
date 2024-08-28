const { ccclass, property } = cc._decorator;
import { Slot50Cmd } from "./Slot50.Cmd";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

@ccclass
export default class Slot50BgTable extends cc.Component {

    @property(sp.Skeleton)
    private skeletonTable: sp.Skeleton = null;
    private skin = "Khung";
    private animation = [ "Khung" ];

    onLoad () {
        // TODO
    }

    start() {
        this.skeletonTable.setSkin(this.skin);
        this.skeletonTable.setAnimation(0, this.animation[0], true);
    }

    public setFrame() {
        this.skeletonTable.setAnimation(0, this.animation[0], true);
    }
}
