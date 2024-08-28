import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import PlinkoMain from "./Plinko.Controller";
const { ccclass, property } = cc._decorator;

class PlinkoLoginByUrl extends BGUI.BaseOutPacket {
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
export class PlinkoConnector extends BGUI.Connector {
  public static get instance(): PlinkoConnector {
    let ret = cc.Canvas.instance.node.getComponent(PlinkoConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(PlinkoConnector);
      if (CC_DEV || CC_DEBUG) {
        //chạy server 11 nhưng client run local
        // PlinkoConnector.instance.HOST = "plinko-7kef7e.wiwatech.com"; //"plinko-7kef7e.wiwatech.com:80"
        // PlinkoConnector.instance.PORT = 443; //-1
        PlinkoConnector.instance.HOST =
          "plinko-global-boss.wiwatech.com" + "/ws-plinko";
        PlinkoConnector.instance.PORT = 0;
      } else {
        // lấy config từ api lobby (chạy sv 11)
        if (
          BGUI.GameConfigZ.configFirstGame &&
          BGUI.GameConfigZ.configFirstGame["jsonData"]
        ) {
          PlinkoConnector.instance.HOST =
            BGUI.GameConfigZ.configFirstGame["jsonData"].plinko.ip;
          PlinkoConnector.instance.PORT =
            BGUI.GameConfigZ.configFirstGame["jsonData"].plinko.port;
        } else {
          // lấy config từ api lobby (chạy sv live)
          const url = window.location.href;
          let urlSearchParams = new URLSearchParams(url.split("?")[1]);
          if (
            url &&
            url.includes("?") &&
            urlSearchParams &&
            urlSearchParams.get("accessToken")
          ) {
            PlinkoConnector.instance.HOST = window.location.host + "/ws-plinko";
          } else {
            let msg = LanguageMgr.getString("plinko.connection_error");
            PlinkoMain.instance.noti.active = true;
            // BGUI.UIPopupManager.instance.showPopupSmall(msg);
          }
        }
      }
    }
    return ret;
  }

  // public setData(prefab: cc.Prefab, url: string) {
  //     this._prefabGame = prefab;
  //     this._prefabMainNameURL = url;
  // }

  // autoReconnect() {
  //   BGUI.ZLog.log(
  //     "PlinkoConnector autoReconnect=======> " +
  //       PlinkoConnector.instance.isConnected()
  //   );
  //   if (PlinkoConnector.instance.isConnected()) return;
  //   PlinkoConnector.instance.disconnect();
  //   PlinkoConnector.instance.connect();
  // }

  // removeHttps(url) {
  //     return url.replace(/^https?:\/\//, '');
  // }

  onDisconnected(code) {
    super.onDisconnected(code);
    PlinkoConnector.instance.removeCmdListener(this, 1);
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("PlinkoConnector: " + success);
    if (success) {
      this.sendPlinkoLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      // let msg = LanguageMgr.getString("Plinko.connection_error");
      // BGUI.UIPopupManager.instance.showPopup(msg);
      PlinkoMain.instance.noti.active = true;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendPlinkoLogin(): void {
    try {
      //test
      // var url =
      // "https://Plinko-global-boss.wiwatech.com/?partner=global-boss&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDUxMTI4NDcsImlhdCI6MTY5NjQ3Mjg0NywiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDIiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMiIsImlkIjo2NTU3MjQ4fQ.pdoYhXxIrJyvVKXZLgvFIL6h62olVnXRHKlb4pmT7i0&lang=vn";
      const url = window.location.href;
      // BGUI.ZLog.log(url);
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new PlinkoLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        // BGUI.ZLog.log(pk.lang);
        if (!pk.lang || pk.lang === "") {
          pk.lang = "vn";
        }
        PlinkoConnector.instance.sendPacket(pk);
        // BGUI.ZLog.log("sendPlinkoLogin URL--->", pk);
      } else {
        let pk = new SendPlinkoLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        PlinkoConnector.instance.sendPacket(pk);
        // BGUI.ZLog.log("sendPlinkoLogin --->", pk);
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

class SendPlinkoLogin extends BGUI.BaseOutPacket {
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
