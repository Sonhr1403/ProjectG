import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import OPController from "./OP.Controller";
import OPSoundController, {
  SLOT_SOUND_TYPE,
} from "./OP.SoundController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class OPMenu extends cc.Component {
  public static instance: OPMenu = null;
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
    OPMenu.instance = this;
  }

  protected onEnable(): void {
    this.maskLanguageOption.height = 0;
  }

  private sliderVolumeCallback(slider: cc.Slider, customEventData: string) {
    let level = Math.round(this.volumeSlider.progress * 100);
    this.sliderFill.fillRange = this.volumeSlider.progress;
    this.volumeLv = this.volumeSlider.progress;
    OPSoundController.instance.setSystemVolume(this.volumeSlider.progress);
  }

  private toggleLanguageOptions() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    for (let b = 0; b < this.languageOptions.children.length; b++) {
      this.languageOptions.children[b].getChildByName("Chosen").active = false;
      if (b == OPController.instance.languageIndex) {
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

//   private changeLanguage(eventdata, idx) {
//     let lang: string;
//     let index: number;
//     switch (Number(idx)) {
//       case 0:
//         lang = "en";
//         index = 0;
//         break;
//       case 1:
//         lang = "vn";
//         index = 1;
//         break;
//       case 2:
//         lang = "tl";
//         index = 2;
//         break;
//       case 3:
//         lang = "en";
//         index = 0;
//         break;
//       case 4:
//         lang = "en";
//         index = 0;
//         break;
//     }

//     OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
//     this.toggleLanguageOptions();
//     for (let a = 0; a <= 1; a++) {
//       OPMain.instance.textWaysTable[a].font =
//         OPMain.instance.fontWaysTable[index];
//     }
//     BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
//     LanguageMgr.updateLang(lang);

//     cc.Canvas.instance.node.emit(
//       BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_LABEL,
//       this
//     );
//     cc.Canvas.instance.node.emit(
//       BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPRITE,
//       this
//     );
//     cc.Canvas.instance.node.emit(
//       BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPINE,
//       this
//     );
//     BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
//     LanguageMgr.instance.setCurrentLanguage(lang);
//     LanguageMgr.updateLocalization(lang);

//     OPMain.instance.languageIndex = idx;
//     for (let i = 0; i <= 18; i++) {
//       OPMain.instance.textInfo[i].font =
//         OPMain.instance.fontInfo[idx];
//     }
//     for (let i = 0; i < 7; i++) {
//       OPMain.instance.textTitle[i].font =
//         OPMain.instance.fontTitle[idx];
//     }
//     for (let i = 0; i < 15; i++) {
//       OPMain.instance.textInfoList[i].font =
//         OPMain.instance.fontInfoList[idx];
//     }
//     for (let i = 0; i < 3; i++) {
//       OPMain.instance.textFreespinBanner[i].font =
//         OPMain.instance.fontFreespinBanner[idx];
//       OPMain.instance.textSymbolTitle[i].font =
//         OPMain.instance.fontSymbolTitle[idx];
//       OPMain.instance.textTotalBet[i].font =
//         OPMain.instance.fontTotalBet[idx];
//     }
//   }


  toggleMusic() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.musicEnabled == true) {
      this.sliderFill.fillRange = 0;
      this.volumeSlider.progress = 0;
      this.musicEnabled = false;
      this.soundToggle.spriteFrame = this.toggleState[1];
      OPSoundController.instance.setSystemVolume(0);
    } else {
      this.sliderFill.fillRange = this.volumeLv;
      this.volumeSlider.progress = this.volumeLv;
      this.musicEnabled = true;
      this.soundToggle.spriteFrame = this.toggleState[0];
      OPSoundController.instance.setSystemVolume(
        this.volumeSlider.progress
      );
    }
  }

  toggleVibration() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (this.vibrationEnabled == true) {
      this.vibrationEnabled = false;
      this.vibrationToggle.spriteFrame = this.toggleState[1];
      OPController.instance.vibrationEnabled = false;
    } else {
      this.vibrationEnabled = true;
      this.vibrationToggle.spriteFrame = this.toggleState[0];
      OPController.instance.vibrationEnabled = true;
    }
  }
}
