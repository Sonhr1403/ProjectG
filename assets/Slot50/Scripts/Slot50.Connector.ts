
const { ccclass, property } = cc._decorator;
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50Controller from "./Slot50.Controller";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";

@ccclass
export class Slot50Connector extends BGUI.Connector {
  public static get instance(): Slot50Connector {
    let ret = cc.Canvas.instance.node.getComponent(Slot50Connector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(Slot50Connector);
      if (true) {
        Slot50Connector.instance.HOST = "slot-satan.wiwatech.com/ws-slot-satan";
        Slot50Connector.instance.PORT = -1;
      } else {
        // lấy config từ api lobby (chạy sv 11)
        if (BGUI.GameConfigZ.configFirstGame && BGUI.GameConfigZ.configFirstGame['jsonData']) {
          Slot50Connector.instance.HOST = BGUI.GameConfigZ.configFirstGame['jsonData'].slotsatan.ip;
          Slot50Connector.instance.PORT = BGUI.GameConfigZ.configFirstGame['jsonData'].slotsatan.port;
        } else {
          // lấy config từ api lobby (chạy sv live)
          const url = window.location.href;
          let urlSearchParams = new URLSearchParams(url.split('?')[1]);
          if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
            Slot50Connector.instance.HOST = window.location.host + "/ws-slot-satan";
          } else {
            BGUI.UIPopupManager.instance.showPopupSmall("Param error!!!");
          }
        }
      }
    }
    return ret;
  }

  onDisconnected(code) {
    super.onDisconnected(code);
    Slot50Connector.instance.removeCmdListener(this, 1);
    Slot50Controller.instance.handleForceStop(Slot50LanguageMgr.getString("slot50.slot_disconnect"), 0);
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    BGUI.ZLog.log("Slot50Connector: " + success);
    if (success) {
      this.sendSlotLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      BGUI.UIPopupManager.instance.showPopup("Kết nối không ổn định!\nVui lòng kiểm tra lại kết nối wifi/3g");
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendSlotLogin(): void {
    try {
      // var partner = "global-boss";
      // var lang = "end";
      // var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTEwOTY5MjYsImlhdCI6MTcwMjQ1NjkyNiwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDE1Iiwibmlja25hbWUiOiJ0ZXN0X2FjY18wMDE1IiwiaWQiOjY1NTczMTYsInBvcnRhbCI6IkI3OSJ9.6KHfzgAhDc2w-iT9lgh7xOJ6a_BL5N0OVjjhoEdi2GU";
      // Slot50Cmd.Send.sendSlotLoginByUrl(partner, accessToken, lang);
      // return;
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (url && url.includes("?") && urlSearchParams && urlSearchParams.get("accessToken")) {
        var partner = urlSearchParams.get("partner");
        var accessToken = urlSearchParams.get("accessToken");
        var lang = urlSearchParams.get("lang");
        if (!lang || lang === "") {
          lang = "vn";
        }
        Slot50Cmd.Send.sendSlotLoginByUrl(partner, accessToken, lang);
      } else {
        let nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        let accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        Slot50Cmd.Send.sendSlotLogin(nickName, accessToken);
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

