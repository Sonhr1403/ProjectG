import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BOOGYICmd from "./BOOGYI.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYIItemMoiChoi extends cc.Component {
    @property(cc.SpriteFrame)
    public spfDeActive: cc.SpriteFrame = null;

    @property(cc.Label)
    public lbNickname: cc.Label = null;

    @property(cc.Label)
    public lbGold: cc.Label = null;

    @property(cc.Button)
    public btnSendMoiChoi: cc.Button = null;

    private infoItem = {
        nickName: null,
        money: 0
    };

    onDestroy() {
        BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.REQUEST_INFO_MOI_CHOI)
    }

    public setItemInfo(nickName, money) {
        this.infoItem = {
            nickName: nickName,
            money: money
        };
        this.lbNickname.string = this.infoItem.nickName;
        this.lbGold.string = BGUI.StringUtils.formatNumber(this.infoItem.money);
    }

    public sendMoiChoi() {
        this.btnSendMoiChoi.enabled = false;
        this.btnSendMoiChoi.node.children[0].getComponent(cc.Sprite).spriteFrame = this.spfDeActive;
        let pk = new BOOGYICmd.SendMoiChoi();
        pk.listName = [this.infoItem.nickName];
        BOOGYIConnector.instance.sendPacket(pk);
    }
}
