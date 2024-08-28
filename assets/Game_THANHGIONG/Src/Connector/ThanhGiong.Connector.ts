import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import ThanhGiongMain from "../ThanhGiong.Controller";

const { ccclass, property } = cc._decorator;

class ThanhGiongLoginByUrl extends BGUI.BaseOutPacket {
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
export class ThanhGiongConnector extends BGUI.Connector {
  public static get instance(): ThanhGiongConnector {
    let ret = cc.Canvas.instance.node.getComponent(ThanhGiongConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(ThanhGiongConnector);
          // lấy config từ api lobby (chạy sv live)
          const url = window.location.href;
          let urlSearchParams = new URLSearchParams(url.split("?")[1]);
          if (
            url &&
            url.includes("?") &&
            urlSearchParams &&
            urlSearchParams.get("accessToken") 
            // true
          ) {
            ThanhGiongConnector.instance.HOST =
            window.location.host + "/ws-slot-thanhgiong";
            // "slot-thanhgiong-global-boss.wiwatech.com/ws-slot-thanhgiong"; //test

            // "172.16.10.6:9999";  // test máy BE:
            // ThanhGiongConnector.instance.PORT = -1; // test máy BE:
          } else {
            let msg = LanguageMgr.getString("thanhgiong.connection_error");
            if (!ThanhGiongMain.instance.noti.active) {
              ThanhGiongMain.instance.noti.active = true;
            }
            ThanhGiongMain.instance.notiMsg.string = msg;
          }
        }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!ThanhGiongMain.instance.noti.active) {
      ThanhGiongMain.instance.noti.active = true;
    }
    ThanhGiongMain.instance.notiMsg.string = LanguageMgr.getString(
      "thanhgiong.connection_error"
    );
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("ThanhGiongConnector: " + success);
    if (success) {
      this.sendThanhGiongLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("thanhgiong.connection_error");
      if (!ThanhGiongMain.instance.noti.active) {
        ThanhGiongMain.instance.noti.active = true;
      }
      ThanhGiongMain.instance.notiMsg.string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendThanhGiongLogin(): void {
    try {
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new ThanhGiongLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        // pk.partner = "";
        // pk.accessToken = "";
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        ThanhGiongConnector.instance.sendPacket(pk);
        // BGUI.ZLog.error("sendThanhGiongLogin URL--->", pk);
      } else {
        let pk = new SendThanhGiongLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        ThanhGiongConnector.instance.sendPacket(pk);
        // BGUI.ZLog.error("sendThanhGiongLogin --->", pk);
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

class SendThanhGiongLogin extends BGUI.BaseOutPacket {
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
