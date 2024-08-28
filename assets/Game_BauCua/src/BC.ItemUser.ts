const {ccclass, property} = cc._decorator;
import BauCuaCmd from "./BauCua.Cmd";
import BCController from "./BC.Controller";

@ccclass
export default class BCItemUser extends cc.Component {

    @property(cc.Node)
    public spAvatar: cc.Node = null;

    @property(cc.Label)
    public lbNickName: cc.Label = null;

    @property(cc.Label)
    public lbBalance: cc.Label = null;

    private infoUser: BauCuaCmd.User = null;

    start () {
        // TODO
    }

    public renderInfoUser(user: BauCuaCmd.User): void{
        this.infoUser = user;
        this.lbNickName.string = user.userName.toString();
        this.lbBalance.string = BGUI.Utils.formatMoneyWithCommaOnly(user.balance);
        this.loadAvatar();
    }

    // update (dt) {}

    private loadAvatar() {
        this.spAvatar.getComponent(cc.Sprite).spriteFrame = BCController.instance.spFrameAvtDefault;
        if (this.infoUser.avatar) {
            cc.loader.load(this.infoUser.avatar, (err, texture) => {
                if (!err) {
                    const spriteFrame = new cc.SpriteFrame(texture);
                    this.spAvatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }
    }
}
