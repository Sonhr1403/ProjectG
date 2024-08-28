import SHWESHANConnector from "../../lobby/scripts/network/wss/SHWESHANConnector";
import SHWESHANCmd from "./SHWESHAN.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SKMItemMoiChoi extends cc.Component {
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
        SHWESHANConnector.instance.removeCmdListener(this, SHWESHANCmd.Code.REQUEST_INFO_MOI_CHOI)
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
        let pk = new SHWESHANCmd.SendMoiChoi();
        pk.listName = [this.infoItem.nickName];
        SHWESHANConnector.instance.sendPacket(pk);
    }
}
