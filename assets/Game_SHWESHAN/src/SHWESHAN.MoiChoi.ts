import SHWESHANConnector from "../../lobby/scripts/network/wss/SHWESHANConnector";
import SHWESHANCmd from "./SHWESHAN.Cmd";
import SHWESHANController from "./SHWESHAN.Controller";
import SHWESHANItemMoiChoi from "./SHWESHAN.ItemMoiChoi"
const { ccclass, property } = cc._decorator;

@ccclass
export default class SHWESHANMoiChoi extends cc.Component {
    public static instance: SHWESHANMoiChoi = null;

    @property(cc.Node)
    public lbNumberPlayer: cc.Node = null;

    @property(cc.Node)
    public nContentMoiChoi: cc.Node = null;

    @property(cc.Prefab)
    public prfItemMoiChoi: cc.Prefab = null;

    onLoad () {
        SHWESHANMoiChoi.instance = this;
        SHWESHANConnector.instance.addCmdListener(SHWESHANCmd.Code.REQUEST_INFO_MOI_CHOI, this.responseRequestInfoMoiChoi, this)
    }

    start() {
        // TODO
    }

    onDestroy() {
        SHWESHANConnector.instance.removeCmdListener(this, SHWESHANCmd.Code.REQUEST_INFO_MOI_CHOI)
    }

    private responseRequestInfoMoiChoi(cmdId: any, data: Uint8Array) {
        let res = new SHWESHANCmd.ReceiveInfoMoiChoi();
        res.unpackData(data)
        this.node.active = true;
        this.lbNumberPlayer.active = res.listName.length == 0
        this.nContentMoiChoi.removeAllChildren();   
        for (let i = 0; i < res.listName.length; i++) {
            let itemMoiChoi = cc.instantiate(this.prfItemMoiChoi);
            itemMoiChoi.getComponent(SHWESHANItemMoiChoi).setItemInfo(res.listName[i], res.listMoney[i]);
            this.nContentMoiChoi.addChild(itemMoiChoi);
        }
    }

    public refreshMoiChoi() {
        SHWESHANController.instance.actionMoiChoi();
    }

    public closePopUp() {
        this.node.active = false;
    }

}
