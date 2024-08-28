import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_Setting extends cc.Component {

    @property(cc.Sprite)
    soundOnOff: cc.Sprite = null;

    @property(cc.Sprite)
    musicOnOff: cc.Sprite = null;

    @property(cc.SpriteFrame)
    onOffFrame: cc.SpriteFrame[] = [];

    public _localVolumeSound = 1;
    public _localVolumeMusic = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._localVolumeMusic = Bacarrat_GameManager.instance.soundManager.isTurnOffMusic
        this._localVolumeSound = Bacarrat_GameManager.instance.soundManager.isTurnOffSound

        this.soundOnOff.spriteFrame = this.onOffFrame[this._localVolumeSound];
        this.musicOnOff.spriteFrame = this.onOffFrame[this._localVolumeMusic];
    }

    public onOffSound() {
        this._localVolumeSound = this._localVolumeSound == 1 ? 0 : 1;
        Bacarrat_GameManager.instance.soundManager.isTurnOffSound = this._localVolumeSound;
        // if (this._localVolumeSound == 1) {
        //     Bacarrat_GameManager.instance.soundManager.isTurnOffSound = 1;
        // } else {
        //     Bacarrat_GameManager.instance.soundManager.isTurnOffSound = 0;
        // }

        this.soundOnOff.spriteFrame = this.onOffFrame[this._localVolumeSound];
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
    }

    public onOffMusic() {
        this._localVolumeMusic = this._localVolumeMusic == 1 ? 0 : 1;
        Bacarrat_GameManager.instance.soundManager.isTurnOffMusic = this._localVolumeMusic;

        if (this._localVolumeMusic == 1) {
            Bacarrat_GameManager.instance.soundManager.playBackground();
        } else {
            Bacarrat_GameManager.instance.soundManager.stopBackground();
        }

        this.musicOnOff.spriteFrame = this.onOffFrame[this._localVolumeMusic];
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
    }

    onClosePopup() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}
