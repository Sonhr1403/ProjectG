import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import ThanhGiongController from "./ThanhGiong.Controller";
import ThanhGiongSoundController, {
  SLOT_SOUND_TYPE,
} from "./ThanhGiong.SoundController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ThanhGiongMenu extends cc.Component {
  public static instance: ThanhGiongMenu = null;
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
  private maskLanguageOption: cc.Node = null;
  @property(cc.Button)
  private languageToggler: cc.Button = null;
  @property(cc.Node)
  public languageOptions: cc.Node = null;
  private volumeLv: number = 0;
  private languageOptionEnabled: boolean = false;
  private musicEnabled: boolean = true;
  private vibrationEnabled: boolean = false;


  async onLoad() {
    ThanhGiongMenu.instance = this;
  }

  protected onEnable(): void {
    this.maskLanguageOption.height = 0;
  }

  private sliderVolumeCallback(slider: cc.Slider, customEventData: string) {
    let level = Math.round(this.volumeSlider.progress * 100);
    this.sliderFill.fillRange = this.volumeSlider.progress;
    this.volumeLv = this.volumeSlider.progress;
    ThanhGiongSoundController.instance.setSystemVolume(this.volumeSlider.progress);
  }

  private toggleLanguageOptions() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    for (let b = 0; b < this.languageOptions.children.length; b++) {
      this.languageOptions.children[b].getChildByName("Chosen").active = false;
      if (b == ThanhGiongController.instance.languageIndex) {
        this.languageOptions.children[b].getChildByName("Chosen").active = true;
      }
    }
    this.languageToggler.interactable = false;
    this.scheduleOnce(() => (this.languageToggler.interactable = true), 0.3);
    if (this.languageOptionEnabled == false) {
      this.languageOptionEnabled = true;
      cc.tween(this.maskLanguageOption).to(0.2, { height: 80 }).start();
    } else {
      this.languageOptionEnabled = false;
      cc.tween(this.maskLanguageOption).to(0.2, { height: 0 }).start();
    }
  }

  private closeSettings() {
    this.node.active = false;
  }

  private changeLanguage(eventdata, idx) {
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

    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
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

    ThanhGiongController.instance.languageIndex = idx;
  }


  toggleMusic() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.musicEnabled == true) {
      this.sliderFill.fillRange = 0;
      this.volumeSlider.progress = 0;
      this.musicEnabled = false;
      this.soundToggle.spriteFrame = this.toggleState[1];
      ThanhGiongSoundController.instance.setSystemVolume(0);
    } else {
      this.sliderFill.fillRange = this.volumeLv;
      this.volumeSlider.progress = this.volumeLv;
      this.musicEnabled = true;
      this.soundToggle.spriteFrame = this.toggleState[0];
      ThanhGiongSoundController.instance.setSystemVolume(
        this.volumeSlider.progress
      );
    }
  }

  toggleVibration() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.vibrationEnabled == true) {
      this.vibrationEnabled = false;
      this.vibrationToggle.spriteFrame = this.toggleState[1];
      ThanhGiongController.instance.vibrationEnabled = false;
    } else {
      this.vibrationEnabled = true;
      this.vibrationToggle.spriteFrame = this.toggleState[0];
      ThanhGiongController.instance.vibrationEnabled = true;
    }
  }
}
