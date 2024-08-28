import DragonTiger_GameManager from "./DragonTiger.GameManager";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class  DragonTiger_Setting extends cc.Component {

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
        this._localVolumeMusic =  DragonTiger_GameManager.instance.soundManager.isTurnOffMusic
        this._localVolumeSound =  DragonTiger_GameManager.instance.soundManager.isTurnOffSound

        this.soundOnOff.spriteFrame = this.onOffFrame[this._localVolumeSound];
        this.musicOnOff.spriteFrame = this.onOffFrame[this._localVolumeMusic];
    }

    public onOffSound() {
        this._localVolumeSound = this._localVolumeSound == 1 ? 0 : 1;
         DragonTiger_GameManager.instance.soundManager.isTurnOffSound = this._localVolumeSound;
        // if (this._localVolumeSound == 1) {
        //      DragonTiger_GameManager.instance.soundManager.isTurnOffSound = 1;
        // } else {
        //      DragonTiger_GameManager.instance.soundManager.isTurnOffSound = 0;
        // }

        this.soundOnOff.spriteFrame = this.onOffFrame[this._localVolumeSound];
         DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
    }

    public onOffMusic() {
        this._localVolumeMusic = this._localVolumeMusic == 1 ? 0 : 1;
         DragonTiger_GameManager.instance.soundManager.isTurnOffMusic = this._localVolumeMusic;

        if (this._localVolumeMusic == 1) {
             DragonTiger_GameManager.instance.soundManager.playBackground();
        } else {
             DragonTiger_GameManager.instance.soundManager.stopBackground();
        }

        this.musicOnOff.spriteFrame = this.onOffFrame[this._localVolumeMusic];
         DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
    }

    onClosePopup() {
         DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}
