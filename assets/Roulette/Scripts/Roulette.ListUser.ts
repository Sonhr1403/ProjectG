const { ccclass, property } = cc._decorator;
import { RouletteNetwork } from "./Roulette.Cmd";
import RouletteController from "./Roulette.Controller";
import RLTItemUser from "./Roulette.ItemUser";


@ccclass
export default class RLTListUser extends cc.Component {
    public static instance: RLTListUser = null

    @property(cc.Node)
    public content: cc.Node = null;

    @property(cc.Prefab)
    public prfItemUser: cc.Prefab = null;

    private isShow: boolean = false;

    protected onLoad(): void {
        RLTListUser.instance = this;
    }

    protected onDestroy(): void {
        RLTListUser.instance = null;
    }


    public initData(users: Array<RouletteNetwork.User>) {
        this.content.removeAllChildren();
        for (let i = 0; i < users.length; i++) {
            let itemUser = users[i];
            let prfItemUser = cc.instantiate(this.prfItemUser);
            prfItemUser.getComponent(RLTItemUser).renderInfoUser(itemUser);
            this.content.addChild(prfItemUser);
        }
        this.content.height = 80 * users.length;
    }

    public onClickToggle(event, data) {
        if (this.isShow) {
            this.hide();
        } else {
            RouletteNetwork.Send.sendListExternalUser();
        }
        RouletteController.instance.checkClick();
    }

    public show() {
        if (this.isShow == false) {
            this.isShow = true;
            cc.tween(this.node).by(0.5, { position: cc.v3(-400, 0, 0) }).start();
        }
    }

    private hide() {
        if (this.isShow = true) {
            this.isShow = false;
            cc.tween(this.node).by(0.5, { position: cc.v3(400, 0, 0) }).start();
        }
        RouletteController.instance.checkClick();
    }
}
