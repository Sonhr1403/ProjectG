import Bacarrat_GameManager from "./Bacarrat.GameManager";
import Bacarrat_CMD from "./network/Bacarrat.Cmd";
import { Bacarrat_Connector } from "./network/Bacarrat.Connector";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_Menu extends cc.Component {

    @property(cc.Node)
    btnExit: cc.Node = null;

    onEnable() {
        try {
            const url = window.location.href;
            let urlSearchParams = new URLSearchParams(url.split('?')[1]);

            if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                this.btnExit.active = false;
            } else {
                this.btnExit.active = true;
            }
        } catch (error) {
            cc.error("Error:", error);
        }
    }

    onBtnGuide() {
        Bacarrat_GameManager.instance.nPopup.onClickGuide()
        this.onClosePopup()
    }

    onBtnHistory() {
        Bacarrat_GameManager.instance.nPopup.onClickHistory()
        this.onClosePopup();
    }

    onBtnSetting() {
        Bacarrat_GameManager.instance.nPopup.onClickSetting()
        this.onClosePopup();
    }

    onBtnBackGame() {
        let pk = new Bacarrat_CMD.SendRequestLeaveRoom();
        Bacarrat_Connector.instance.sendPacket(pk)
        this.onClosePopup();
    }

    onClosePopup() {
        this.node.removeFromParent()
    }
}
