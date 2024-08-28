import { RouletteNetwork } from "./Roulette.Cmd";
import RouletteController from "./Roulette.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RLTItemUser extends cc.Component {
  @property(cc.Label)
  public lbNickName: cc.Label = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Sprite)
  public spAvatar: cc.Label = null;

  private infoUser: RouletteNetwork.User = null;

  ///////////////////////////////////////////////////////////

  public renderInfoUser(user: RouletteNetwork.User): void {
    this.infoUser = user;
    this.lbNickName.string = user.displayName.toString();
    this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(user.balance);

    let defaultAva = RouletteController.instance.defaultAvatar;

    switch (user.avatar) {
      case "":
        this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
        break;

      default:
        cc.assetManager.loadRemote(user.avatar, (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            let spTemp = new cc.SpriteFrame(texture);
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = spTemp;
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
            return;
          }
        });
        break;
    }

  }

}
