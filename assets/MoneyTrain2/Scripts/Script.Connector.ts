import { ConnectData } from "./Script.ConnectData";
import MoneyTrain2Common from "./Script.Common";
import MoneyTrain2Noti from "./Script.Noti";

const { ccclass, property } = cc._decorator;

class MoneyTrain2LoginByUrl extends BGUI.BaseOutPacket {
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

class MoneyTrain2LoginByPortal extends BGUI.BaseOutPacket {
  public partner: string;
  // public game: string;
  public lang: string;
  public accessToken: string;
  public appId: number;

  public getCmdId(): number {
    return 1;
  }

  public putData(): void {
    this.putString(this.partner);
    // this.putString(this.game);
    this.putString(this.lang);
    this.putString(this.accessToken);
    this.putInt(this.appId);
  }
}

@ccclass
export class MoneyTrain2Connector extends BGUI.Connector {
  public static get instance(): MoneyTrain2Connector {
    let ret = cc.Canvas.instance.node.getComponent(MoneyTrain2Connector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(MoneyTrain2Connector);
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        if (window.location.host.includes("localhost:")) {
          MoneyTrain2Connector.instance.HOST =
            "slot-money-train-global-boss.wiwatech.com/ws-slot-money-train" +
            "/ws-slot-money-train";
        } else {
          MoneyTrain2Connector.instance.HOST =
            window.location.host + "/ws-slot-money-train";
        }
      } else {
        if (window.location.host.includes("localhost:")) {
          MoneyTrain2Connector.instance.HOST = ConnectData.CURRENT_DOMAIN;
          MoneyTrain2Connector.instance.PORT = ConnectData.CURRENT_PORT;
        } else {
          MoneyTrain2Noti.instance.openNoti(1);
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    MoneyTrain2Noti.instance.openNoti(2);
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    MoneyTrain2Common.runError("MoneyTrain2Connector", success);
    if (success) {
      this.sendMoneyTrain2Login();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      MoneyTrain2Noti.instance.openNoti(1);
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendMoneyTrain2Login(): void {
    try {
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new MoneyTrain2LoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        MoneyTrain2Connector.instance.sendPacket(pk);
        MoneyTrain2Common.runError("sendMoneyTrain2Login URL--->", pk);
      } else {
        let pk = new MoneyTrain2LoginByPortal();
        pk.partner = ConnectData.PARTNER;
        pk.accessToken = ConnectData.TOKEN;
        // pk.game = ConnectData.GAME;
        pk.lang = "en";
        pk.appId = 11;
        MoneyTrain2Connector.instance.sendPacket(pk);
        MoneyTrain2Common.runError("sendMoneyTrain2Login test--->", pk);
      }
    } catch (error) {
      MoneyTrain2Noti.instance.openNoti(1);
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

class SendMoneyTrain2Login extends BGUI.BaseOutPacket {
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
