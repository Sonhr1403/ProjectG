import DragonTiger_GameManager from "./DragonTiger.GameManager";
import DragonTiger_CMD from "./network/DragonTiger.Cmd";
import DragonTiger_Connector from "./network/DragonTiger.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_Menu extends cc.Component {

    // @property(cc.Node)
    // btnExit: cc.Node = null;

    // onEnable() {
    //     try {
    //         const url = window.location.href;
    //         let urlSearchParams = new URLSearchParams(url.split('?')[1]);

    //         if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
    //             this.btnExit.active = false;
    //         } else {
    //             this.btnExit.active = true;
    //         }
    //     } catch (error) {
    //         cc.error("Error:", error);
    //     }
    // }
    
    onBtnGuide() {
        DragonTiger_GameManager.instance.nPopup.onClickGuide()
        this.onClosePopup()
    }

    onBtnHistory() {
        DragonTiger_GameManager.instance.nPopup.onClickHistory()
        this.onClosePopup();
    }

    onBtnSetting() {
        DragonTiger_GameManager.instance.nPopup.onClickSetting()
        this.onClosePopup();
    }

    onBtnBackGame() {
        let pk = new DragonTiger_CMD.SendBackGame();
        DragonTiger_Connector.instance.sendPacket(pk)
        this.onClosePopup();
    }

    onClosePopup() {
        this.node.removeFromParent()
    }
}
