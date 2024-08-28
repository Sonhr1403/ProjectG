import SKMConnector from "../../lobby/scripts/network/wss/SKMConnector";
import SKMCmd from "./SKE.Cmd";
import SKEController from "./SKE.Controller";
import SKmItemMoiChoi from "./SKE.ItemMoiChoi"
const { ccclass, property } = cc._decorator;

@ccclass
export default class SKMMoiChoi extends cc.Component {
    public static instance: SKMMoiChoi = null;

    @property(cc.Node)
    public lbMessage: cc.Node = null;

    @property(cc.Node)
    public nContentMoiChoi: cc.Node = null;

    @property(cc.Prefab)
    public prfItemMoiChoi: cc.Prefab = null;

    onLoad() {
        SKMMoiChoi.instance = this;
        SKMConnector.instance.addCmdListener(SKMCmd.Code.REQUEST_INFO_MOI_CHOI, this.responseRequestInfoMoiChoi, this)
    }

    start() {
        // TODO
    }

    onDestroy() {
        SKMConnector.instance.removeCmdListener(this, SKMCmd.Code.REQUEST_INFO_MOI_CHOI)
    }

    private responseRequestInfoMoiChoi(cmdId: any, data: Uint8Array) {
        let res = new SKMCmd.ReceiveInfoMoiChoi();
        res.unpackData(data)
        this.showPopUp();
        this.lbMessage.active = false;
        this.nContentMoiChoi.removeAllChildren();
        if (res.listName && res.listName.length > 0) {
            for (let i = 0; i < res.listName.length; i++) {
                let itemMoiChoi = cc.instantiate(this.prfItemMoiChoi);
                itemMoiChoi.getComponent(SKmItemMoiChoi).setItemInfo(res.listName[i], res.listMoney[i]);
                this.nContentMoiChoi.addChild(itemMoiChoi);
            }
        } else {
            this.lbMessage.active = true;
        }

    }

    public refreshMoiChoi() {
        SKEController.instance.onClickOpenMoiChoi();
    }

    public showPopUp() {
        this.node.active = true;
    }

    public closePopUp() {
        this.node.active = false;
    }
}
