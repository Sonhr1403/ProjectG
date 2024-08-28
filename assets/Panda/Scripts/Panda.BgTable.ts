const { ccclass, property } = cc._decorator;
import { PandaCmd } from "./Panda.Cmd";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

@ccclass
export default class PandaBgTable extends cc.Component {

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
