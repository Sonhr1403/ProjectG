const { ccclass, property } = cc._decorator;
import Friend from "./Friend";
import { LobbySend } from "../network/LobbySend";
import LobbyCtrl from "../LobbyCtrl";
import HeaderCtrl from "../HeaderCtrl";
import AvatarsCtrl from "../AvatarsCtrl";
import { LanguageMgr } from "../../../framework/localize/LanguageMgr";

@ccclass
export default class friendItem extends cc.Component {
  public static instance: friendItem = null;
  configFirstGame: any = null;

  @property(cc.Label)
  playerName: cc.Label = null;
  @property(cc.Sprite)
  vipLv: cc.Sprite = null;
  @property(cc.Label)
  gold: cc.Label = null;
  @property(cc.Sprite)
  avatar: cc.Sprite = null;
  
  userName: string;

  onLoad(): void {
    friendItem.instance = this;
  }

  initItem(info, idx = 0) {
    cc.log("info", info);
    if(info != undefined){
      this.userName = info["userName"];
      this.playerName.string = info["displayName"];
      this.gold.string = BGUI.Utils.formatMoneyWithCommaOnly(info["vinTotal"]);
      this.vipLv.spriteFrame = LobbyCtrl.instance.vipSF[info["viplvl"]];
      let defaultAva = AvatarsCtrl.instance.defaultAvatars;
      if (info["avatar"] != "0") {
        cc.assetManager.loadRemote(info["avatar"], (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.avatar.spriteFrame = defaultAva;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            this.avatar.spriteFrame = new cc.SpriteFrame(texture);
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.avatar.spriteFrame = defaultAva;
            return;
          }
        });
      } else {
        this.avatar.spriteFrame = defaultAva;
      }
    }
    else{}
  }

  popUpConfirmDelete(){
    let message = "Bạn có muốn xóa người bạn này không?";
    let listAction = [
      BGUI.PopupAction.make("Thôi", () => {
        
      }),
      BGUI.PopupAction.make("Đồng ý", () => {
        this.deleteFriend();
      }),
    ];
    BGUI.UIPopupManager.instance.showPopupSmall(message, listAction);
  }

  deleteFriend() {
    try {
      let pk = new LobbySend.DeleteFriend();
      pk.userName = this.userName;
      BGUI.NetworkPortal.instance.sendPacket(pk);
      cc.error("friend_del", pk);
      if (LobbyCtrl.instance.friendList.indexOf(this.userName) > -1) {
        LobbyCtrl.instance.friendList.splice(
          LobbyCtrl.instance.friendList.indexOf(this.userName),
          1
        );
      }
    } catch (error) {
      console.error("Send delete friend Error: ", error);
    }
  }

  onDisable() {}
}
