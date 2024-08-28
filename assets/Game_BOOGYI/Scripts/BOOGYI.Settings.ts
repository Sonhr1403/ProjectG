import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import BOOGYIController from "./BOOGYI.Controller";
import SoundController, { SOUNDTYPE } from "./BOOGYI.SoundController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Settings extends cc.Component {
  @property(cc.Node)
  soundVolumnSpr: cc.Node = null;

  @property(cc.Slider)
  sliderSound: cc.Slider = null;

  @property(cc.Node)
  onSoundBtn: cc.Node = null;

  @property(cc.Node)
  onShakeBtn: cc.Node = null;

  _soundVolumn = 0;
  _onSound = false;
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  showSoundVolumn(aVolumn) {
    this.sliderSound.progress = aVolumn;
    this._soundVolumn = aVolumn;
    this.soundVolumnSpr.width = aVolumn * 400;
  }

  showOnSound(event = false, init = undefined) {
    let on = !this._onSound;
    if (init != undefined) {
      on = init == 1 ? true : false;
    }
    this._onSound = on;
    this.onSoundBtn.children[0].x = on ? 35 : -35;
    this.onSoundBtn.children[1].getComponent(cc.Label).string = on
      ? LanguageMgr.getString("boogyi.on_sound")
      : LanguageMgr.getString("boogyi.off_sound");
    if (init == undefined) {
      BOOGYIController.instance.soundControler.setOnVolume(on ? 1 : 0);
    }
  }

  showOnShake(event = false, init = undefined) {
    let on = !this._onSound;
    if (init != undefined) {
      on = init == 1 ? true : false;
    }
    this._onSound = on;
    this.onShakeBtn.children[0].x = on ? 35 : -35;
    this.onShakeBtn.children[1].getComponent(cc.Label).string = on
      ? LanguageMgr.getString("boogyi.on_sound")
      : LanguageMgr.getString("boogyi.off_sound");
  }

  sliderEvent(slider) {
    BOOGYIController.instance.soundControler.setVolume(slider.progress);
    this.showSoundVolumn(slider.progress);
  }
  initData() {
    this.node.active = true;
    this.showSoundVolumn(BOOGYIController.instance.soundControler.getVolume());
    this.showOnSound(
      false,
      BOOGYIController.instance.soundControler.getOnVolume()
    );
  }
}
