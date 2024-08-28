import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIController from "./BOOGYI.Controller";
import BOOGYIItemMoiChoi from "./BOOGYI.ItemMoiChoi"
const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYIMoiChoi extends cc.Component {
    public static instance: BOOGYIMoiChoi = null;

    @property(cc.Node)
    public lbMessage: cc.Node = null;

    @property(cc.Node)
    public nContentMoiChoi: cc.Node = null;

    @property(cc.Prefab)
    public prfItemMoiChoi: cc.Prefab = null;

    onLoad() {
        BOOGYIMoiChoi.instance = this;
        BOOGYIConnector.instance.addCmdListener(BOOGYICmd.Code.REQUEST_INFO_MOI_CHOI, this.responseRequestInfoMoiChoi, this)
    }

    start() {
        // TODO
        this.lbMessage.active = false;
    }

    onDestroy() {
        BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.REQUEST_INFO_MOI_CHOI)
    }

    private responseRequestInfoMoiChoi(cmdId: any, data: Uint8Array) {
        let res = new BOOGYICmd.ReceiveInfoMoiChoi();
        res.unpackData(data);
        ////////////////////////////////////
        this.showPopUp();
        this.lbMessage.active = false;
        this.nContentMoiChoi.removeAllChildren();
        if(res.listName && res.listName.length > 0) {
            for (let i = 0; i < res.listName.length; i++) {
                let itemMoiChoi = cc.instantiate(this.prfItemMoiChoi);
                itemMoiChoi.getComponent(BOOGYIItemMoiChoi).setItemInfo(res.listName[i], res.listMoney[i]);
                this.nContentMoiChoi.addChild(itemMoiChoi);
            }
        } else {
            this.lbMessage.active = true;
        }

    }

    public refreshMoiChoi() {
        BOOGYIController.instance.onClickInviteFriend();
    }

    public showPopUp() {
        this.node.active = true;
    }

    public closePopUp() {
        this.node.active = false;
    }
}
