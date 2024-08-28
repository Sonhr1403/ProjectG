import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SlotTTCommon from "./SlotTT.Common";
import SlotTTController from "./SlotTT.Controller";

const { ccclass, property } = cc._decorator;

class SlotTTLoginByUrl extends BGUI.BaseOutPacket {
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
export class SlotTTConnector extends BGUI.Connector {
  public static get instance(): SlotTTConnector {
    let ret = cc.Canvas.instance.node.getComponent(SlotTTConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(SlotTTConnector);
      // lấy config từ api lobby (chạy sv live)
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        SlotTTConnector.instance.HOST =
          window.location.host + "/ws-slot-wealth-inn";
      } else {
        if (window.location.host.includes("localhost:")) {
          SlotTTConnector.instance.HOST =
            "slot-wealthinn.wiwatech.com" + "/ws-slot-wealth-inn";
        } else {
          let msg = LanguageMgr.getString("slotthantai.connection_error2");
          if (!SlotTTController.instance.noti.active) {
            SlotTTController.instance.noti.active = true;
          }
          SlotTTController.instance.notiContent.string = msg;
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!SlotTTController.instance.noti.active) {
      SlotTTController.instance.noti.active = true;
    }
    SlotTTController.instance.notiContent.string = LanguageMgr.getString(
      "slotthantai.connection_error"
    );
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    if (success) {
      this.sendSlotTTLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("slotthantai.connection_error");
      if (!SlotTTController.instance.noti.active) {
        SlotTTController.instance.noti.active = true;
      }
      SlotTTController.instance.notiContent.string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendSlotTTLogin(): void {
    try {
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);

      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new SlotTTLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "en";
        }
        SlotTTConnector.instance.sendPacket(pk);
        BGUI.ZLog.error("sendSlotTTLogin URL--->", pk);
      } else {
        let pk = new SlotTTLoginByUrl();
        pk.partner = "global-boss";
        pk.accessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg0MjExNTQsImlhdCI6MTcwOTc4MTE1NCwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDEyIiwibmlja25hbWUiOiJ0ZXN0X2FjY18wMDEyIiwiaWQiOjY1NTczMTMsInBvcnRhbCI6IkI3OSJ9.gcujD6cKKJusWReRRY1M0HOG44MVubWCp12DDYmtYKs";
        pk.appId = 11;
        pk.lang = "en";
        SlotTTConnector.instance.sendPacket(pk);
        BGUI.ZLog.error("sendSlotTTLogin URL--->", pk);
      }
    } catch (error) {
      SlotTTCommon.runError("Error:", error);
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

class SendSlotTTLogin extends BGUI.BaseOutPacket {
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
