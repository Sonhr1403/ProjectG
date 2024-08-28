import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIController from "./BOOGYI.Controller";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupConfirmLeave extends cc.Component {
  public static instance: PopupConfirmLeave = null;
  protected onLoad(): void {
    // PopupConfirmLeave.instance = this;
  }
  public confirmLeave() {
    BOOGYIConnector.instance.sendPacket(new BOOGYICmd.SendRequestLeaveGame());
    if (!BOOGYIController.instance.isPlayerInteract) {
      BOOGYIController.instance.isPlayerInteract = true;
    }
    this.hide();
    BOOGYIController.instance.changeBtnQuit();
  }

  public hide() {
    this.node.active = false;
    BOOGYIController.instance.isPopUpOutRoom = false;
  }
}
