import SKMConnector from "../../lobby/scripts/network/wss/SKMConnector";
import SKMCmd from "./SKE.Cmd";
import SKEController from "./SKE.Controller";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupConfirmLeave extends BGUI.UIPopup {
    public confirmLeave(): void {
        SKEController.instance.sendRequestLeaveGame()
        this.hide()
    }
}
