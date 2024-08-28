import SHWESHANController from "./SHWESHAN.Controller";
import SHWESHANConnector from "../../lobby/scripts/network/wss/SHWESHANConnector";
import SHWESHANCmd from "./SHWESHAN.Cmd";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SWSPopupConfirmLeave extends BGUI.UIPopup {
  public static instance: SWSPopupConfirmLeave = null;
  @property(cc.Label)
  public leaveMsg: cc.Label = null;
  leave: boolean = false;
  public confirmLeave(): void {
    SHWESHANConnector.instance.sendPacket(
      new SHWESHANCmd.SendRequestLeaveGame()
    );

    this.hide();
    SHWESHANController.instance.openLeaveNoti = false

    SHWESHANController.instance.btnCancelLeaveRoom.node.active = !SHWESHANController.instance.btnCancelLeaveRoom.node.active
    SHWESHANController.instance.btnLeaveRoom.node.active = !SHWESHANController.instance.btnLeaveRoom.node.active
    SHWESHANController.instance.closeUIMenu()
  }
  public unConfirmLeave(): void{
    SHWESHANController.instance.openLeaveNoti = false
    cc.log("openLeaveNoti", SHWESHANController.instance.openLeaveNoti)
    this.hide();

  }
  
  
}