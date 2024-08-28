import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import OPController from "../OP.Controller";

const { ccclass, property } = cc._decorator;

class OPLoginByUrl extends BGUI.BaseOutPacket {
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
export class OPConnector extends BGUI.Connector {
  public static get instance(): OPConnector {
    let ret = cc.Canvas.instance.node.getComponent(OPConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(OPConnector);
          // lấy config từ api lobby (chạy sv live)
          const url = window.location.href;
          let urlSearchParams = new URLSearchParams(url.split("?")[1]);
          if (
           true
          ) {
            // BGUI.ZLog.log(window.location.host);
            OPConnector.instance.HOST =
            // window.location.host + "/ws-slot-OP";
            "slot-onepiece-global-boss.wiwatech.com/ws-slot-onepiece"; //test
            // test máy a huế:
            // "172.16.10.6:5555"; 
            // OPConnector.instance.PORT = -1;
          } else {
            let msg = LanguageMgr.getString("onepiece.connection_error");
            if (!OPController.instance.noti.active) {
              OPController.instance.noti.active = true;
            }
            OPController.instance.notiMsg.string = msg;
          }
        }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!OPController.instance.noti.active) {
      OPController.instance.noti.active = true;
    }
    OPController.instance.notiMsg.string = LanguageMgr.getString(
      "onepiece.connection_error"
    );
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("OPConnector: " + success);
    if (success) {
      this.sendOPLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("onepiece.connection_error");
      if (!OPController.instance.noti.active) {
        OPController.instance.noti.active = true;
      }
      OPController.instance.notiMsg.string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendOPLogin(): void {
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
        let pk = new OPLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        OPConnector.instance.sendPacket(pk);
        BGUI.ZLog.error("sendOPLogin URL--->", pk);
      } else {
        let pk = new SendOPLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        OPConnector.instance.sendPacket(pk);
        BGUI.ZLog.error("sendOPLogin --->", pk);
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

class SendOPLogin extends BGUI.BaseOutPacket {
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
