// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RouletteController from "./Roulette.Controller";
import RLTSoundControler from "./Roulette.SoundControler";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RLTSetting extends cc.Component {

    public static instance: RLTSetting = null;

    @property(cc.SpriteFrame)
    private status: cc.SpriteFrame[] = [];

    @property(cc.Node)
    private music: cc.Node = null;

    @property(cc.Node)
    private vibration: cc.Node = null;

    @property(cc.Slider)
    private volumeSlider: cc.Slider = null;

    @property(cc.Sprite)
    private progressBar: cc.Sprite = null;



    // LIFE-CYCLE CALLBACKS:

    protected onLoad(): void {
        RLTSetting.instance = this;
    }

    public getStarted(volumn: number){
        this.setVolume(volumn);
        this.setMusicOnOff(true);
        this.setVibrationOnOff(true);
    }

    private setVolume(progress: number){
        this.volumeSlider.progress = progress;
        this.setProgressBar(progress);
        RLTSoundControler.instance.setSystemVolume(progress);
    }

    private setProgressBar(progress: number){
        this.progressBar.fillRange = progress;
    }

    private setMusicOnOff(isOn: boolean){
        if (isOn) {
            this.music.getComponent(cc.Sprite).spriteFrame = this.status[1];
        } else {
            this.music.getComponent(cc.Sprite).spriteFrame = this.status[0];
        }
    }

    private setVibrationOnOff(isOn: boolean){
        if (isOn) {
            this.vibration.getComponent(cc.Sprite).spriteFrame = this.status[1];
        } else {
            this.vibration.getComponent(cc.Sprite).spriteFrame = this.status[0];
        }
    }

    private onClickMusic(){
        let musicStatus = RLTSoundControler.instance.getMusicStatus();
        musicStatus = !musicStatus;
        this.setMusicOnOff(musicStatus);
        RLTSoundControler.instance.setMusicStatus(musicStatus);
        RouletteController.instance.checkClick();
    }

    private onClickVibation(){
        let vibrationStatus = RouletteController.instance.getVibrationStatus();
        vibrationStatus = !vibrationStatus;
        this.setVibrationOnOff(vibrationStatus);
        RouletteController.instance.setVibrationStatus(vibrationStatus);
        RouletteController.instance.checkClick();
    }

    private hide(){
        this.node.active = false;
        RouletteController.instance.checkClick();
    }

    private onSliderEvent(sender, eventType){
        this.setVolume(sender.progress);
        RouletteController.instance.checkClick();
    }


}
