// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SHWESHANController from "./SHWESHAN.Controller";
import  SoundController,{SOUNDTYPE} from "./SHWESHAN.SoundController";
const {ccclass, property} = cc._decorator;


@ccclass
export default class Settings extends cc.Component {

    @property(cc.Node)
    soundVolumnSpr:cc.Node = null;

    @property(cc.Slider)
    sliderSound: cc.Slider = null;

    @property(cc.Node)
    onSoundBtn:cc.Node = null;

    @property(cc.Node)
    onShakeBtn:cc.Node = null;



    _soundVolumn = 0;
    _onSound = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showSoundVolumn(aVolumn){
        this.sliderSound.progress = aVolumn
        this._soundVolumn = aVolumn;
        this.soundVolumnSpr.width = aVolumn*400;
    }

    showOnSound(event = false, init = undefined){
        let on = !this._onSound;
        if(init != undefined){
            on = init == 1 ? true : false
        }
        this._onSound = on;
        this.onSoundBtn.children[0].x = on ? 35 : -35
        this.onSoundBtn.children[1].getComponent(cc.Label).string = on ? LanguageMgr.getString("shweshan.on_sound") : LanguageMgr.getString("shweshan.off_sound")
        if(init == undefined){
            SHWESHANController.instance.soundControler.setOnVolume(on ? 1 : 0)
        }
        if(on && init == undefined){
            // SHWESHANController.instance.soundControler.playBackground()
        }
    }

    showOnShake(event = false, init = undefined){
        let on = !this._onSound;
        if(init != undefined){
            on = init ? true : false
        }
        this._onSound = on;
        this.onShakeBtn.children[0].x = on ? 35 : -35
        this.onShakeBtn.children[1].getComponent(cc.Label).string = on ? LanguageMgr.getString("shweshan.on_sound") : LanguageMgr.getString("shweshan.off_sound")
    }

    sliderEvent(slider){
        SHWESHANController.instance.soundControler.setVolume(slider.progress)
        this.showSoundVolumn(slider.progress)
    }
    initData(){
        this.node.active = true;
        this.showSoundVolumn(SHWESHANController.instance.soundControler.getVolume())
        this.showOnSound(false,SHWESHANController.instance.soundControler.getOnVolume())
    }
    // update (dt) {}
}
