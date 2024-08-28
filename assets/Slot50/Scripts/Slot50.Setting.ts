const { ccclass, property } = cc._decorator;
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

@ccclass
export default class Slot50Setting extends cc.Component {

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
    private progress: number = 1;
    private statusMusic: boolean = true;
    private statusSound: boolean = true;

    onLoad() {
        // this.slider.progress = Slot50SoundControler.instance.getSystemVolume()
    }

    start() {
        this.spBtnMusic.spriteFrame = (this.statusMusic) ? this.spfBtnOn : this.spfBtnOff;
        this.spBtnSound.spriteFrame = (this.statusSound) ? this.spfBtnOn : this.spfBtnOff;
        this.progress = Slot50SoundControler.instance.getSystemVolume();
        this.slider.progress = this.progress;
    }

    public show() {
        this.node.active = true;
    }

    protected onClickClose() {
        this.node.active = false;
    }

    protected onClickOnOffMucsic() {
        this.statusMusic = !this.statusMusic;
        this.progress = (this.statusMusic) ? (this.progress > 0) ? this.progress : 0.5 : 0;
        this.handleVolumnMusic(this.statusMusic);
    }

    protected onClickOnOfSound() {
        this.statusSound = !this.statusSound;
        Slot50SoundControler.instance.setSoundVolume((this.statusSound) ? 1 : 0);
        this.spBtnSound.spriteFrame = (this.statusSound) ? this.spfBtnOn : this.spfBtnOff;
    }

    protected onSliderEvent(slider) {
        this.progress = slider.progress;
        this.statusMusic = (slider.progress > 0);
        this.handleVolumnMusic(this.statusMusic);
    }
    
    private handleVolumnMusic(statusMusic: boolean) {
        Slot50SoundControler.instance.setSystemVolume(this.progress);
        this.spBtnMusic.spriteFrame = (statusMusic) ? this.spfBtnOn : this.spfBtnOff;
        this.slider.progress = this.progress;
    }

    // update (dt) {}
}
