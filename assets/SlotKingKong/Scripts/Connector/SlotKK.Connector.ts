import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import SlotKKCommon from "../SlotKK.Common";
import SlotKKController from "../SlotKK.Controller";

const { ccclass, property } = cc._decorator;

class SlotKKLoginByUrl extends BGUI.BaseOutPacket {
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

class SlotKKLoginByPortal extends BGUI.BaseOutPacket {
  public partner: string;
  public accessToken: string;
  public appId: number;
  public lang: string;
  public game: string;

  public getCmdId(): number {
    return 1;
  }

  public putData(): void {
    this.putString(this.partner);
    this.putString(this.game);
    this.putString(this.lang);
    this.putString(this.accessToken);
    // this.putInt(this.appId);
  }
}

@ccclass
export class SlotKKConnector extends BGUI.Connector {
  public static get instance(): SlotKKConnector {
    let ret = cc.Canvas.instance.node.getComponent(SlotKKConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(SlotKKConnector);
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        SlotKKConnector.instance.HOST =
          window.location.host + "/ws-slot-kingkong";
      } else {
        if (window.location.host.includes("localhost:")) {
          SlotKKConnector.instance.HOST =
            "slot-kingkong.wiwatech.com" + "/ws-slot-kingkong";
        } else {
          let msg = LanguageMgr.getString("slotkingkong.connection_error2");
          if (!SlotKKController.instance.noti.active) {
            SlotKKController.instance.noti.active = true;
          }
          SlotKKController.instance.notiContent.string = msg;
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!SlotKKController.instance.noti.active) {
      SlotKKController.instance.noti.active = true;
    }
    SlotKKController.instance.notiContent.string = LanguageMgr.getString(
      "slotkingkong.connection_error"
    );
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    if (success) {
      this.sendSlotKKLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("slotkingkong.connection_error");
      if (!SlotKKController.instance.noti.active) {
        SlotKKController.instance.noti.active = true;
      }
      SlotKKController.instance.notiContent.string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendSlotKKLogin(): void {
    try {
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new SlotKKLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "vn";
        }
        SlotKKConnector.instance.sendPacket(pk);
      } else {
        let pk = new SlotKKLoginByUrl();
        pk.partner = "global-boss";
        // pk.partner = "wiwa";
        pk.accessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTk3Mzk1NjEsImlhdCI6MTcxMTA5OTU2MSwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDIiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMiIsImlkIjo2NTU3MjQ4LCJwb3J0YWwiOiJCNzkifQ.9t3PUosUhgYVRYr753ZZVohrNECzIys0arXQFl5jGXM";
        // pk.accessToken =
        //   "SrDn6Ls5g5ssS14ISEiQ3Hol0mgU1so4";
        pk.appId = 11;
        pk.lang = "en";
        // pk.game = "KingKong";
        SlotKKConnector.instance.sendPacket(pk);
      }
    } catch (error) {
      SlotKKCommon.runError({ Error: error });
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

class SendSlotKKLogin extends BGUI.BaseOutPacket {
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
