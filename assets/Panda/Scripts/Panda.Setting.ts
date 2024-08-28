const { ccclass, property } = cc._decorator;
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

@ccclass
export default class PandaSetting extends cc.Component {

    @property(cc.Slider)
    private slider: cc.Slider = null;

    @property(cc.Sprite)
    private spBtnMusic: cc.Sprite = null;

    @property(cc.Sprite)
    private spBtnSound: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private spfBtnOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private spfBtnOff: cc.SpriteFrame = null;
    // LIFE-CYCLE CALLBACKS:

    private statusMusic: boolean = true;
    private statusSound: boolean = true;

    onLoad() {
        // this.slider.progress = PandaSoundControler.instance.getSystemVolume()
    }

    start() {
        this.spBtnMusic.spriteFrame = (this.statusMusic) ? this.spfBtnOn : this.spfBtnOff;
        this.spBtnSound.spriteFrame = (this.statusSound) ? this.spfBtnOn : this.spfBtnOff;
        this.slider.progress = PandaSoundControler.instance.getSystemVolume();
    }

    public show() {
        this.node.active = true;
    }

    protected onClickClose() {
        this.node.active = false;
    }

    protected onClickOnOffMucsic() {
        this.statusMusic = !this.statusMusic;
        PandaSoundControler.instance.setSystemVolume((this.statusMusic) ? 1 : 0);
        this.spBtnMusic.spriteFrame = (this.statusMusic) ? this.spfBtnOn : this.spfBtnOff;
        this.slider.progress = (this.statusMusic) ? 1 : 0;
    }

    protected onClickOnOfSound() {
        this.statusSound = !this.statusSound;
        PandaSoundControler.instance.setSoundVolume((this.statusSound) ? 1 : 0);
        this.spBtnSound.spriteFrame = (this.statusSound) ? this.spfBtnOn : this.spfBtnOff;
    }

    protected onSliderEvent(slider) {
        let percentTemp = Math.ceil(slider.progress * 100);
        PandaSoundControler.instance.setSystemVolume(slider.progress);
    }
    // update (dt) {}
}
