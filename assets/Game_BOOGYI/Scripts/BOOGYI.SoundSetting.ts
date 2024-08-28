// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SoundController, { SOUNDTYPE } from "./BOOGYI.SoundController";
import BOOGYIController from "./BOOGYI.Controller";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BOOGYISoundSetting extends cc.Component {
    public static instance: BOOGYISoundSetting = null;

    @property(cc.Sprite)
    soundOnOff: cc.Sprite = null;

    @property(cc.Sprite)
    musicOnOff: cc.Sprite = null;

    @property(cc.SpriteFrame)
    onOffFrame: cc.SpriteFrame[] = [];

    public _localVolumeSound = 1;
    public _localVolumeMusic = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BOOGYISoundSetting.instance = this;
        this.soundOnOff.spriteFrame = this.onOffFrame[this._localVolumeSound];
        this.musicOnOff.spriteFrame = this.onOffFrame[this._localVolumeMusic];
    }

    // start () {

    // }

    // update (dt) {}

    public onOffSound(){
        this._localVolumeSound = this._localVolumeSound == 1 ? 0 : 1;
        SoundController.instance.isTurnOffSound = this._localVolumeSound;
        if(this._localVolumeSound == 1){
            SoundController.instance.playBackground();
        } else{
            SoundController.instance.stopBackground();
        }
        this.soundOnOff.spriteFrame = this.onOffFrame[this._localVolumeSound];
    }
    
    public onOffMusic(){
        this._localVolumeMusic = this._localVolumeMusic == 1 ? 0 : 1;
        if(this._localVolumeMusic == 1){
            SoundController.instance.isTurnOffMusic = 1;
        } else{
            SoundController.instance.isTurnOffMusic = 0;
        }
        this.musicOnOff.spriteFrame = this.onOffFrame[this._localVolumeMusic];
    }

    public onClickClose() {
        this.node.active = false;
        BOOGYIController.instance.isPopUpSetting = false;
    }
}
