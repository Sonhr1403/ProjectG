import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import TQMain from "./TQ.Controller";
import TQSoundController, { SLOT_SOUND_TYPE } from "./TQ.SoundController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TQMenu extends cc.Component {
  public static instance: TQMenu = null;
  @property(cc.Slider)
  private volumeSlider: cc.Slider = null;
  @property(cc.Sprite)
  private sliderFill: cc.Sprite = null;
  @property(cc.SpriteFrame)
  private toggleState: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  private soundToggle: cc.Sprite = null;
  @property(cc.Sprite)
  private vibrationToggle: cc.Sprite = null;
  @property(cc.Node)
  private maskLanguageOption: cc.Node = null; // 0H -> 222H
  @property(cc.Button)
  private languageToggler: cc.Button = null; // 0H -> 222H
  @property(cc.Node)
  private languageOptions: cc.Node = null;
  private volumeLv: number = 0;
  private languageOptionEnabled: boolean = false;
  private musicEnabled: boolean = true;
  private vibrationEnabled: boolean = false;

  async onLoad() {
    TQMenu.instance = this;
  }

  protected onEnable(): void {
    this.maskLanguageOption.height = 0;
  }

  private sliderVolumeCallback(slider: cc.Slider, customEventData: string) {
    let level = Math.round(this.volumeSlider.progress * 100);
    this.sliderFill.fillRange = this.volumeSlider.progress;
    this.volumeLv = this.volumeSlider.progress;
    TQSoundController.instance.setSystemVolume(this.volumeSlider.progress);
  }

  private toggleLanguageOptions() {
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }

    for (let b = 0; b < this.languageOptions.children.length; b++) {
      this.languageOptions.children[b].getChildByName("Chosen").active = false;
      if (b == TQMain.instance.languageIndex) {
        this.languageOptions.children[b].getChildByName("Chosen").active = true;
      }
    }

    this.languageToggler.interactable = false;
    this.scheduleOnce(() => (this.languageToggler.interactable = true), 0.3);
    if (this.languageOptionEnabled == false) {
      this.languageOptionEnabled = true;
      cc.tween(this.maskLanguageOption).to(0.2, { height: 150 }).start();
    } else {
      this.languageOptionEnabled = false;
      cc.tween(this.maskLanguageOption).to(0.2, { height: 0 }).start();
    }
  }

  private closeSettings() {
    this.node.active = false;
  }

  private changeLanguage(eventdata, idx) {
    // cc.log(eventdata, idx);
    let lang: string;
    let index: number;
    switch (Number(idx)) {
      case 0:
        lang = "en";
        index = 0;
        break;
      case 1:
        lang = "vn";
        index = 1;
        break;
      case 2:
        lang = "tl";
        index = 2;
        break;
      case 3:
        lang = "en";
        index = 0;
        break;
      case 4:
        lang = "en";
        index = 0;
        break;
    }

    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }

    // for (let i = 0; i < this.languageOptions.children.length; i++) {
    //   this.languageOptions.children[i].children[0].getChildByName(
    //     "selected"
    //   ).active = false;
    //   if (i == Number(index)) {
    //     this.languageOptions.children[i].children[0].getChildByName(
    //       "selected"
    //     ).active = true;
    //   }
    // }
    this.toggleLanguageOptions();
    for (let a = 0; a <= 11; a++) {
      TQMain.instance.textWaysTable[a].font =
        TQMain.instance.fontWaysTable[index];
    }
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

    TQMain.instance.languageIndex = idx;

    for (let i = 0; i <= 7; i++) {
      TQMain.instance.textInfo[i].font = TQMain.instance.fontInfo[index];
      TQMain.instance.textTitle[i].font = TQMain.instance.fontTitle[index];
      TQMain.instance.textScene[i].font = TQMain.instance.fontScene[index];
    }

    for (let b = 0; b < this.languageOptions.children.length; b++) {
      // cc.log(this.languageOptions.children[b]);
      this.languageOptions.children[b].getChildByName("Chosen").active = false;
      if (b == idx) {
        this.languageOptions.children[b].getChildByName("Chosen").active = true;
      }
    }
    for (let x = 0; x < 2; x++) {
      TQMain.instance.textFreespinBanner[x].font =
        TQMain.instance.fontFreespinBanner[index];
    }
    for (let j = 0; j < 6; j++) {
      TQMain.instance.textTitleLayout[j].font =
        TQMain.instance.fontTitleLayout[index];
    }
  }

  toggleMusic() {
    if (this.musicEnabled == true) {
      this.sliderFill.fillRange = 0;
      this.volumeSlider.progress = 0;
      this.musicEnabled = false;
      this.soundToggle.spriteFrame = this.toggleState[1];
      TQSoundController.instance.setSystemVolume(0);
    } else {
      this.sliderFill.fillRange = this.volumeLv;
      this.volumeSlider.progress = this.volumeLv;
      this.musicEnabled = true;
      this.soundToggle.spriteFrame = this.toggleState[0];
      TQSoundController.instance.setSystemVolume(this.volumeSlider.progress);
    }
  }

  toggleVibration() {
    if (this.vibrationEnabled == true) {
      this.vibrationEnabled = false;
      this.vibrationToggle.spriteFrame = this.toggleState[1];
      TQMain.instance.vibrationEnabled = false;
    } else {
      this.vibrationEnabled = true;
      this.vibrationToggle.spriteFrame = this.toggleState[0];
      TQMain.instance.vibrationEnabled = true;
    }
  }
}
