import { ConnectData } from "./ConnectData";
import SongKranCommon from "./SongKran.Common";
import SongKranNoti from "./SongKran.Noti";

const { ccclass, property } = cc._decorator;

class SongKranLoginByUrl extends BGUI.BaseOutPacket {
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
export class SongKranConnector extends BGUI.Connector {
  public static get instance(): SongKranConnector {
    let ret = cc.Canvas.instance.node.getComponent(SongKranConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(SongKranConnector);
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        SongKranConnector.instance.HOST =
          window.location.host + "/ws-slot-songkran";
      } else {
        if (window.location.host.includes("localhost:")) {
          SongKranConnector.instance.HOST = ConnectData.CURRENT_DOMAIN;
          SongKranConnector.instance.PORT = ConnectData.CURRENT_PORT;
        } else {
          SongKranNoti.instance.openNoti(1);
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    SongKranNoti.instance.openNoti(2);
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    SongKranCommon.runError("SongKranConnector", success);
    if (success) {
      this.sendSongKranLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      SongKranNoti.instance.openNoti(1);
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendSongKranLogin(): void {
    try {
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new SongKranLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        SongKranConnector.instance.sendPacket(pk);
        SongKranCommon.runError("sendSongKranLogin URL--->", pk);
      } else {
        // let pk = new SendSongKranLogin();
        // pk.nickName = ConnectData.PARTNER;
        // pk.accessToken = ConnectData.TOKEN;
        // SongKranConnector.instance.sendPacket(pk);
        // SongKranCommon.runError({ name: "sendSongKranLogin--->", cont: pk });
        let pk = new SongKranLoginByUrl();
        pk.partner = ConnectData.PARTNER;
        pk.accessToken = ConnectData.TOKEN;
        pk.appId = 11;
        pk.lang = "en";
        SongKranConnector.instance.sendPacket(pk);
        SongKranCommon.runError("sendSongKranLogin test--->", pk);
      }
    } catch (error) {
      SongKranNoti.instance.openNoti(1);
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

class SendSongKranLogin extends BGUI.BaseOutPacket {
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
