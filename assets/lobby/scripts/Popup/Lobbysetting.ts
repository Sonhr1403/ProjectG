import LobbyCtrl from "../LobbyCtrl";
import AvatarsCtrl from "../AvatarsCtrl";
import HeaderCtrl from "../HeaderCtrl";
import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Setting extends BGUI.UIPopup {
  public static instance: Setting = null;

  @property(cc.Sprite)
  musicCtrl: cc.Sprite = null;
  @property(cc.Sprite)
  vibrateCtrl: cc.Sprite = null;
  @property(cc.SpriteFrame)
  btnState: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  avatarSetting: cc.Sprite = null;
  @property(cc.Label)
  lbNameSetting: cc.Label = null;
  @property(cc.Label)
  lbIDSetting: cc.Label = null;
  @property(cc.Prefab)
  confirmLogoutPrefab: cc.Prefab = null
  @property(cc.Label)
  lbCurrentLanguage: cc.Label = null;
  @property(cc.Node)
  languageOptionContainer: cc.Node = null
  @property(cc.Node)
  arrowDropDown: cc.Node = null

  statusQDTT: number = 1;
  addHeight1: number = 170;
  musicOn: boolean = true;
  
  onEnable(): void {
    let id: string = BGUI.UserManager.instance.mainUserInfo.identification;
    let avatar: string = BGUI.UserManager.instance.mainUserInfo.avatar;

    this.avatarSetting.spriteFrame = HeaderCtrl.instance.avaDownload
    this.lbNameSetting.string = HeaderCtrl.instance.lbDisplayName.string;
    this.lbIDSetting.string = "ID:" + id;

    const soundState = localStorage.getItem("sound");
    if (soundState === "true" ) {
      this.musicCtrl.spriteFrame = this.btnState[0];
    } 
    if(soundState === "false" ) {
      this.musicCtrl.spriteFrame = this.btnState[1];
    }

    // this.updateAvatar(BGUI.UserManager.instance.mainUserInfo.avatar)
  }

  updateAvatar(avaUrl: string) {
    if (avaUrl !== "0") {
      if (avaUrl !== BGUI.UserManager.instance.mainUserInfo.avatar) {
        cc.assetManager.loadRemote(avaUrl, (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.avatarSetting.spriteFrame = HeaderCtrl.instance.avaDownload;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            HeaderCtrl.instance.avaDownload = new cc.SpriteFrame(texture);
            this.avatarSetting.spriteFrame = HeaderCtrl.instance.avaDownload;
            HeaderCtrl.instance.spAvatar.spriteFrame =
              HeaderCtrl.instance.avaDownload;
            BGUI.UserManager.instance.mainUserInfo.avatar = avaUrl;
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.avatarSetting.spriteFrame = HeaderCtrl.instance.avaDownload;
            return;
          }
        });
      } else {
        this.avatarSetting.spriteFrame = HeaderCtrl.instance.avaDownload;
      }
    } else {
      this.avatarSetting.spriteFrame = HeaderCtrl.instance.avaDownload;
    }
  }


  musicCtrler() {
    if (LobbyCtrl.instance.musicOn == true) {
      this.musicCtrl.spriteFrame = this.btnState[1];
      LobbyCtrl.instance.stopBgMusic();
    //   LobbyCtrl.instance.musicOn = false;
    } else if (LobbyCtrl.instance.musicOn == false) {
      this.musicCtrl.spriteFrame = this.btnState[0];
      LobbyCtrl.instance.playBgMusic();
    //   LobbyCtrl.instance.musicOn = true;
    }
  }

  toggleLanguageOptions(){
        if (this.statusQDTT == 1) {
          this.statusQDTT = 2;
          this.arrowDropDown.setRotation(180)
          this.addHeight(this.languageOptionContainer, this.addHeight1);
          this.spriteGoDown(this.languageOptionContainer);
        } else {
          this.statusQDTT = 1;
          this.arrowDropDown.setRotation(0)
          this.spriteGoUp(this.languageOptionContainer);
          this.reduceHeight(this.languageOptionContainer, this.addHeight1);
        }
  }

  addHeight(node: cc.Node, addHeight: number) {
    this.schedule(
      () => {
        node.height += addHeight / 20;
      },
      0.001,
      25
    );
  }

  reduceHeight(node: cc.Node, addHeight: number) {
    this.schedule(
      () => {
        node.height -= addHeight / 20;
      },
      0.001,
      25
    );
  }

  spriteGoDown(node: cc.Node) {
    this.scheduleOnce(() => {
      let toPos = cc.v2(
        node.children[0].x,
        node.children[0].y - 50
      );
      node.children[0].runAction(
        cc.sequence(cc.fadeIn(0.1), cc.moveTo(0.2, toPos))
      );
    }, 0.2);
  }

  spriteGoUp(node: cc.Node) {
    let toPos = cc.v2(
      node.children[0].x,
      node.children[0].y + 50
    );
    node.children[0].runAction(
      cc.sequence(cc.fadeOut(0.1), cc.moveTo(0.1, toPos))
    );
  }

  updateLanguage(event: Event, idx){
    switch (idx) {
      case "1":
        BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "vn")
        LanguageMgr.updateLang("vn")
        LobbyCtrl.instance.emitLogicChoose("vn")
        break;
      case "2":
        BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en")
        LanguageMgr.updateLang("en")
        LobbyCtrl.instance.emitLogicChoose("en")

        break;
      case "3":
        BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "mm")
        LanguageMgr.updateLang("mm")
        LobbyCtrl.instance.emitLogicChoose("mm")

        break;
      default:
        break;
    }
  }

  logOut() {
    BGUI.UIPopupManager.instance.showPopupFromPrefab(this.confirmLogoutPrefab);
  }

  hide(){
    this.node.active = false;
  }


}
