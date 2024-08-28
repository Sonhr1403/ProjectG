import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import VanessaMain from "../Vanessa.Controller";

const { ccclass, property } = cc._decorator;

class VanessaLoginByUrl extends BGUI.BaseOutPacket {
  public partner: string;
  public accessToken: string;
  public appId: number;
  public lang: string;

  public getCmdId(): number {
    return 1;
  }

  public putData(): void {
    this.putString(this.partner);
    this.putString(this.accessToken);
    this.putInt(this.appId);
    this.putString(this.lang);
  }
}

@ccclass
export class VanessaConnector extends BGUI.Connector {
  public static get instance(): VanessaConnector {
    let ret = cc.Canvas.instance.node.getComponent(VanessaConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(VanessaConnector);
          // lấy config từ api lobby (chạy sv live)
          const url = window.location.href;
          let urlSearchParams = new URLSearchParams(url.split("?")[1]);
          if (
            // url &&
            // url.includes("?") &&
            // urlSearchParams &&
            // urlSearchParams.get("accessToken") 
            true
          ) {
            // BGUI.ZLog.log(window.location.host);
            VanessaConnector.instance.HOST =
            // window.location.host + "/ws-slot-vanessa";
            "slot-vanessa-global-boss.wiwatech.com" + "/ws-slot-vanessa"; //test
            // "172.16.10.6:5555";  // test máy BE:
            // VanessaConnector.instance.PORT = -1; // test máy BE:
          } else {
            let msg = LanguageMgr.getString("vanessa.connection_error");
            if (!VanessaMain.instance.noti.active) {
              VanessaMain.instance.noti.active = true;
            }
            VanessaMain.instance.notiMsg.string = msg;
          }
        }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!VanessaMain.instance.noti.active) {
      VanessaMain.instance.noti.active = true;
    }
    VanessaMain.instance.notiMsg.string = LanguageMgr.getString(
      "vanessa.connection_error"
    );
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("VanessaConnector: " + success);
    if (success) {
      this.sendVanessaLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("vanessa.connection_error");
      if (!VanessaMain.instance.noti.active) {
        VanessaMain.instance.noti.active = true;
      }
      VanessaMain.instance.notiMsg.string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendVanessaLogin(): void {
    try {
      const url = window.location.href;
      // BGUI.ZLog.log(url);
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new VanessaLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        VanessaConnector.instance.sendPacket(pk);
        // BGUI.ZLog.error("sendVanessaLogin URL--->", pk);
      } else {
        let pk = new SendVanessaLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        VanessaConnector.instance.sendPacket(pk);
        // BGUI.ZLog.error("sendVanessaLogin --->", pk);
      }
    } catch (error) {
      // cc.error("Error:", error);
    }
  }

  sendPacket(pk: BGUI.BaseOutPacket): void {
    if (this.isConnected()) {
      super.sendPacket(pk);
    } else {
      this.connect();
    }
  }
}

class SendVanessaLogin extends BGUI.BaseOutPacket {
  public nickName: string;
  public accessToken: string;

  public getCmdId(): number {
    return 1;
  }

  public putData(): void {
    this.putString(this.nickName);
    this.putString(this.accessToken);
  }
}
