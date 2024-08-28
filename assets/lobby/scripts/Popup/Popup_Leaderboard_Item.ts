import AvatarsCtrl from "../AvatarsCtrl";
import HeaderCtrl from "../HeaderCtrl";
import LobbyCtrl from "../LobbyCtrl";
import { cmdReceive } from "../network/LobbyReceive";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderBoardItem extends cc.Component {
  public static instance: LeaderBoardItem = null;

  configFirstGame: any = null;

  @property(cc.Sprite)
  avatar: cc.Sprite = null;

  @property(cc.Label)
  lblName: cc.Label = null;

  @property(cc.Label)
  lblCoin: cc.Label = null;

  @property(cc.Sprite)
  sprVip: cc.Sprite = null;

  @property(cc.Label)
  rankLabel: cc.Label = null;

  @property(cc.Sprite)
  Icon: cc.Sprite = null;

  @property(cc.SpriteFrame)
  iconList: Array<cc.SpriteFrame> = [];

  initItem(idx = 0, data: cmdReceive.playerTemp) {
    if (idx == 0 || idx == 1 || idx == 2) {
      this.Icon.spriteFrame = this.iconList[idx];
    } else {
      this.rankLabel.node.active = true;
      this.Icon.node.active = false;
      let rank = idx + 1;
      this.rankLabel.string = rank.toString();
    }

    this.sprVip.spriteFrame = LobbyCtrl.instance.vipSF[data.viplvl];
    this.lblName.string = data.displayName;
    this.lblCoin.string =
      BGUI.Utils.formatMoneyWithCommaOnly(data.currentMoney) + " Chips";

    let defaultAva = AvatarsCtrl.instance.defaultAvatars;
    if (data.avatar != "0") {
      cc.assetManager.loadRemote(data.avatar, (err, texture) => {
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
}
