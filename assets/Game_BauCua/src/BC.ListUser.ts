const { ccclass, property } = cc._decorator;
import BCItemUser from "./BC.ItemUser";
import cmd from "./BauCua.Cmd";

@ccclass
export default class BCListUser extends cc.Component {
    public static instance: BCListUser = null

    @property(cc.Node)
    public content: cc.Node = null;

    @property(cc.Prefab)
    public prfItemUser: cc.Prefab = null;

    private isShow: boolean = false;
    private isAllowHide: boolean = false;
    protected onLoad(): void {
        BCListUser.instance = this;
    }

    protected onDestroy(): void {
        BCListUser.instance = null;
    }

    start() {
        // TODO
    }

    public initData(users: Array<cmd.User>) {
        this.content.removeAllChildren();
        for (let i = 0; i < users.length; i++) {
            let itemUser = users[i];
            let prfItemUser = cc.instantiate(this.prfItemUser);
            prfItemUser.getComponent(BCItemUser).renderInfoUser(itemUser);
            this.content.addChild(prfItemUser);
        }
        this.content.height = 80 * users.length;
    }

    public onClickToggle(event, data) {
        if (this.isShow) {
            this.hide();
        } else {
            cmd.Send.sendListExternalUser();
        }
    }

    public show() {
        if (!this.isShow && !this.isAllowHide) {
            this.isShow = true;
            cc.tween(this.node).by(0.5, { position: cc.v3(-400, 0, 0) }).call(() => {
                this.isAllowHide = true;
            }).start();
        }
    }

    private hide() {
        if (this.isShow && this.isAllowHide) {
            this.isShow = false;
            cc.tween(this.node).by(0.5, { position: cc.v3(400, 0, 0) }).call(() => {
                this.isAllowHide = false;
            }).start();
        }
    }
}
