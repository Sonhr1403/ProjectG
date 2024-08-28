import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import RouletteController from "../Roulette.Controller";

const { ccclass, property } = cc._decorator;

class RouletteLoginByUrl extends BGUI.BaseOutPacket {
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
export class RouletteConnector extends BGUI.Connector {
  public static get instance(): RouletteConnector {
    let ret = cc.Canvas.instance.node.getComponent(RouletteConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(RouletteConnector);
      if (CC_DEV || CC_DEBUG) {
        //chạy server 11 nhưng client run local
        RouletteConnector.instance.HOST = "roulette-7kef7e.wiwatech.com";
        RouletteConnector.instance.PORT = 443;
      } else {
        // lấy config từ api lobby (chạy sv 11)
        if (
          BGUI.GameConfigZ.configFirstGame &&
          BGUI.GameConfigZ.configFirstGame["jsonData"]
        ) {
          RouletteConnector.instance.HOST =
            BGUI.GameConfigZ.configFirstGame["jsonData"].roulette.ip;
          RouletteConnector.instance.PORT =
            BGUI.GameConfigZ.configFirstGame["jsonData"].roulette.port;
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
            // BGUI.ZLog.log(window.location.host);
            RouletteConnector.instance.HOST =
              window.location.host + "/ws-roulette";
          } else {
            let msg = LanguageMgr.getString("roulette.connection_error2");
            if (!RouletteController.instance.noti.active) {
              RouletteController.instance.noti.active = true;
              RouletteController.instance.notiContent.string = msg;
            }
          }
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    RouletteConnector.instance.removeCmdListener(this, 1);
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("RouletteConnector: " + success);
    if (success) {
      this.sendRouletteLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("roulette.connection_error");
      if (!RouletteController.instance.noti.active) {
        RouletteController.instance.noti.active = true;
        RouletteController.instance.notiContent.string = msg;
      }
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendRouletteLogin(): void {
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
        let pk = new RouletteLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        // BGUI.ZLog.log(pk.lang);
        if (!pk.lang || pk.lang === "") {
          pk.lang = "vn";
        }
        RouletteConnector.instance.sendPacket(pk);
        // BGUI.ZLog.log("sendRouletteLogin URL--->", pk);
      } else {
        let pk = new SendRouletteLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        RouletteConnector.instance.sendPacket(pk);
        // BGUI.ZLog.log("sendRouletteLogin --->", pk);
      }
    } catch (error) {
      cc.error("Error:", error);
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

class SendRouletteLogin extends BGUI.BaseOutPacket {
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
