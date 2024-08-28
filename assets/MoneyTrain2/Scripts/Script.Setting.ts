import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MoneyTrain2Setting extends cc.Component {
  public static instance: MoneyTrain2Setting = null;

  @property(cc.Slider)
  private volumeSlider: cc.Slider = null;

  @property(cc.SpriteFrame)
  private toggleState: cc.SpriteFrame[] = [];

  @property(cc.Sprite)
  private sliderFill: cc.Sprite = null;

  @property(cc.Sprite)
  private soundToggle: cc.Sprite = null;

  @property(cc.Sprite)
  private vibrationToggle: cc.Sprite = null;

  @property(cc.Button)
  private languageToggler: cc.Button = null; // 0H -> 112H

  @property(cc.Node)
  private maskLanguageOption: cc.Node = null; // 0H -> 112H

  @property(cc.Node)
  public languageOptions: cc.Node = null;

  @property(cc.Node)
  private arrow: cc.Node = null;
  
  @property(cc.Label)
  private showLbl: cc.Label = null;

  ////////////////////////////////////////////////////////////////////////

  private volumeLv: number = 0;
  private languageOptionEnabled: boolean = false;
  public musicEnabled: boolean = true;
  public vibrationEnabled: boolean = false;

  async onLoad() {
    MoneyTrain2Setting.instance = this;
  }

  protected onEnable(): void {
    this.maskLanguageOption.height = 0;
  }

  private sliderVolumeCallback(slider: cc.Slider, customEventData: string) {
    this.sliderFill.fillRange = this.volumeSlider.progress;
    this.volumeLv = this.volumeSlider.progress;
    MoneyTrain2MusicManager.instance.setSystemVolume(this.volumeSlider.progress);
    if (this.volumeSlider.progress > 0) {
      this.musicEnabled = true;
    } else {
      this.musicEnabled = false;
    }
    this.updateMusic();
  }

  private toggleLanguageOptions() {
    // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.languageToggler.interactable = false;
    this.scheduleOnce(() => (this.languageToggler.interactable = true), 0.3);
    if (this.languageOptionEnabled == false) {
      this.languageOptionEnabled = true;
      cc.tween(this.arrow).to(0.2, { angle: 180 }).start();
      cc.tween(this.maskLanguageOption).to(0.2, { height: 76 }).start();
    } else {
      this.languageOptionEnabled = false;
      cc.tween(this.arrow).to(0.2, { angle: 0 }).start();
      cc.tween(this.maskLanguageOption).to(0.2, { height: 0 }).start();
    }
  }

  private closeSettings() {
    // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.node.active = false;
  }

  private changeLanguage(eventdata, idx) {
    let lang: string;
    let index: number;
    let lbl: string;
    switch (Number(idx)) {
      case 0:
        lang = "en";
        index = 0;
        lbl = "English";
        break;
      case 1:
        lang = "vn";
        index = 1;
        lbl = "Vietnamese";
        break;
      case 2:
        lang = "tl";
        index = 2;
        lbl = "English";
        break;
      case 3:
        lang = "en";
        index = 0;
        lbl = "English";
        break;
      case 4:
        lang = "en";
        index = 0;
        lbl = "English";
        break;
    }

    this.showLbl.string = lbl;

    this.toggleLanguageOptions();

    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
    LanguageMgr.updateLang(lang);

    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_LABEL,
      this
    );
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPRITE,
      this
    );
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPINE,
      this
    );
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
    LanguageMgr.instance.setCurrentLanguage(lang);
    LanguageMgr.updateLocalization(lang);

    for (let b = 0; b < this.languageOptions.childrenCount; b++) {
      this.languageOptions.children[b].getChildByName("Chosen").active = false;
      if (b == idx) {
        this.languageOptions.children[b].getChildByName("Chosen").active = true;
      }
    }
  }

  private toggleMusic() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.musicEnabled = !this.musicEnabled;
    this.updateMusic();
    MoneyTrain2MusicManager.instance.setMusicStatus(this.musicEnabled);
  }

  private updateMusic() {
    if (this.musicEnabled === false) {
      this.sliderFill.fillRange = 0;
      this.volumeSlider.progress = 0;
      this.soundToggle.spriteFrame = this.toggleState[1];
      MoneyTrain2MusicManager.instance.setSystemVolume(0);
      MoneyTrain2MusicManager.instance.pauseSlotMusic();
    } else {
      this.sliderFill.fillRange = this.volumeLv;
      this.volumeSlider.progress = this.volumeLv;
      this.soundToggle.spriteFrame = this.toggleState[0];
      MoneyTrain2MusicManager.instance.setSystemVolume(this.volumeSlider.progress);
      MoneyTrain2MusicManager.instance.resumeSlotMusic();
    }
  }

  private toggleVibration() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    if (this.vibrationEnabled == true) {
      this.vibrationEnabled = false;
      this.vibrationToggle.spriteFrame = this.toggleState[1];
      //   TQMain.instance.vibrationEnabled = false;
    } else {
      this.vibrationEnabled = true;
      this.vibrationToggle.spriteFrame = this.toggleState[0];
      //   TQMain.instance.vibrationEnabled = true;
    }
  }
}
