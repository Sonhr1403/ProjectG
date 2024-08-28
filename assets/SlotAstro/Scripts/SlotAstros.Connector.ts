import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SlotAstrosCommon from "./SlotAstros.Common";
import SlotAstrosController from "./SlotAstros.Controller";

const { ccclass, property } = cc._decorator;

class SlotAstrosLoginByUrl extends BGUI.BaseOutPacket {
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
export class SlotAstrosConnector extends BGUI.Connector {
  public static get instance(): SlotAstrosConnector {
    let ret = cc.Canvas.instance.node.getComponent(SlotAstrosConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(SlotAstrosConnector);
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        SlotAstrosConnector.instance.HOST =
          window.location.host + "/ws-slot-astro";
      } else {
        if (window.location.host.includes("localhost:")) {
          SlotAstrosConnector.instance.HOST =
            "slot-astro-global-boss.wiwatech.com" + "/ws-slot-astro";
        } else {
          let msg = LanguageMgr.getString("slotastros.connection_error1");
          if (!SlotAstrosController.instance.noti.active) {
            SlotAstrosController.instance.noti.active = true;
          }
          SlotAstrosController.instance.notiContent.string = msg;
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!SlotAstrosController.instance.noti.active) {
      SlotAstrosController.instance.noti.active = true;
    }
    SlotAstrosController.instance.notiContent.string = LanguageMgr.getString(
      "slotastros.connection_end"
    );
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    SlotAstrosCommon.runError({ str: "SlotAstrosConnector", cont: success });
    if (success) {
      this.sendSlotAstrosLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("slotastros.connection_error");
      if (!SlotAstrosController.instance.noti.active) {
        SlotAstrosController.instance.noti.active = true;
      }
      SlotAstrosController.instance.notiContent.string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendSlotAstrosLogin(): void {
    try {
      const url = window.location.href;
      SlotAstrosCommon.runError("URL--->", url );
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new SlotAstrosLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        SlotAstrosConnector.instance.sendPacket(pk);
        SlotAstrosCommon.runError("sendSlotAstrosLogin URL--->", pk);
      } else {
        let pk = new SlotAstrosLoginByUrl();
        pk.partner = "global-boss";
        pk.accessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTk3Mzk3MzcsImlhdCI6MTcxMTA5OTczNywiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDEzIiwibmlja25hbWUiOiJ0ZXN0X2FjY18wMDEzIiwiaWQiOjY1NTczMTQsInBvcnRhbCI6IkI3OSJ9.R2khrA8YQyJbZ13W8pRRZY8VJ70qdGWA4YkQqO1JEEk";
        pk.appId = 11;
        pk.lang = "en";
        SlotAstrosConnector.instance.sendPacket(pk);
        SlotAstrosCommon.runError("sendSlotAstrosLogin--->", pk);
      }
    } catch (error) {
      SlotAstrosCommon.runError("Error:", error);
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

class SendSlotAstrosLogin extends BGUI.BaseOutPacket {
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
