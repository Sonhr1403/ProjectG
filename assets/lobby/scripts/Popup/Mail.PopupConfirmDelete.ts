import LobbyCtrl from "../LobbyCtrl";
import Mail from "./Mail";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MailPopupConfirmDelete extends BGUI.UIPopup {
  public static instance: MailPopupConfirmDelete = null;

  onLoad(): void {
    MailPopupConfirmDelete.instance = this
  }

  public confirmDelete(): void {
    Mail.instance.deleteMail(LobbyCtrl.instance.deleteMailIds)

    this.hide();
    
  }
  
  
}