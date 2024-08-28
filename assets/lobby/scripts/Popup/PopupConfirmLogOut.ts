const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupConfirmLogout extends BGUI.UIPopup {
  public static instance: PopupConfirmLogout = null;

  onLoad(): void {
    PopupConfirmLogout.instance = this
  }

  public confirmLogout(): void {

    this.hide();
    cc.sys.localStorage.removeItem("current_user_info_login");
    BGUI.UIPopupManager.instance.removeAllPopups();
    location.reload();
  }
  
  
}