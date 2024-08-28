import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import TQMain from "../TQ.Controller";

const { ccclass, property } = cc._decorator;

class SlotTQLoginByUrl extends BGUI.BaseOutPacket {
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
export class TQConnector extends BGUI.Connector {
  public static get instance(): TQConnector {
    let ret = cc.Canvas.instance.node.getComponent(TQConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(TQConnector);
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        TQConnector.instance.HOST = 
        // "172.16.10.6:1111"
        //  window.location.host + "/ws-slot-shudynasty";
        "slot-shudynasty-global-boss.wiwatech.com/ws-slot-shudynasty"; //test
        // TQConnector.instance.PORT = -1;
      } else {
        // let msg = LanguageMgr.getString("threekingdom.connection_error");
        TQMain.instance.noti.active = true;
        TQMain.instance.notiMsg.string = LanguageMgr.getString("threekingdom.connection_error");
      }
        
    }
    return ret;
  }

  // onDisconnected(code) {
  //   super.onDisconnected(code);
  //   TQConnector.instance.removeCmdListener(this, 1);
  // }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!TQConnector.instance.isConnected()) {
      let msg = LanguageMgr.getString("threekingdom.connection_error");
      TQMain.instance.noti.active = true;
      TQMain.instance.notiMsg.string = LanguageMgr.getString("threekingdom.connection_error");
    }
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("TQConnector: " + success);
    // cc.error("v1.1.0");
    if (success) {
      this.sendSlotLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      // let msg = LanguageMgr.getString("threekingdom.connection_error");
      TQMain.instance.noti.active = true;
      TQMain.instance.notiMsg.string = LanguageMgr.getString("threekingdom.connection_error");

      this.unschedule(this.rewindDisconnectDetector);
    }
  }
  
  private sendSlotLogin(): void {
    try {
      // "https://Slot-global-boss.wiwatech.com/?partner=global-boss&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDUxMTI4NDcsImlhdCI6MTY5NjQ3Mjg0NywiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDIiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMiIsImlkIjo2NTU3MjQ4fQ.pdoYhXxIrJyvVKXZLgvFIL6h62olVnXRHKlb4pmT7i0&lang=vn";
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new SlotTQLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "vn";
        }
        TQConnector.instance.sendPacket(pk);
      } else {
        let pk = new SendSlotTQLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        TQConnector.instance.sendPacket(pk);
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

class SendSlotTQLogin extends BGUI.BaseOutPacket {
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
