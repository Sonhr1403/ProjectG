import DragonTiger_GameManager from "./DragonTiger.GameManager";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_Guide extends cc.Component {

    onClosePopup() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this.node.removeFromParent();
    }
}
