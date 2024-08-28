
const { ccclass, property } = cc._decorator;
import { PandaCmd } from "./Panda.Cmd";
import PandaController from "./Panda.Controller";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";

@ccclass
export class PandaConnector extends BGUI.Connector {
  public static get instance(): PandaConnector {
    let ret = cc.Canvas.instance.node.getComponent(PandaConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(PandaConnector);
      if (true) {
        //chạy server 11 nhưng client run local
        PandaConnector.instance.HOST = "slotsatan-7kef7e.wiwatech.com";
        PandaConnector.instance.PORT = 443;
      } else {
        // lấy config từ api lobby (chạy sv 11)
        if (BGUI.GameConfigZ.configFirstGame && BGUI.GameConfigZ.configFirstGame['jsonData']) {
          PandaConnector.instance.HOST = BGUI.GameConfigZ.configFirstGame['jsonData'].slotsatan.ip;
          PandaConnector.instance.PORT = BGUI.GameConfigZ.configFirstGame['jsonData'].slotsatan.port;
        } else {
          // lấy config từ api lobby (chạy sv live)
          const url = window.location.href;
          let urlSearchParams = new URLSearchParams(url.split('?')[1]);
          if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
            PandaConnector.instance.HOST = window.location.host + "/ws-slot-satan";
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
    PandaConnector.instance.removeCmdListener(this, 1);
    PandaController.instance.handleForceStop(PandaLanguageMgr.getString("slot50.slot_disconnect"), 0);
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    BGUI.ZLog.log("PandaConnector: " + success);
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
      // const url = "https://slot-satan.wiwatech.com/?partner=global-boss&lang=en&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk3MTYzMjQsImlhdCI6MTcwMTA3NjMyNCwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDEiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMSIsImlkIjo2NTU3MjQ3LCJwb3J0YWwiOiJCNzkifQ.m-Sb5-eUCjDCzaHJxRAQSfYa5FiME2hn4CvMVeMAXPU";
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (url && url.includes("?") && urlSearchParams && urlSearchParams.get("accessToken")) {
        var partner = urlSearchParams.get("partner");
        var accessToken = urlSearchParams.get("accessToken");
        var lang = urlSearchParams.get("lang");
        if (!lang || lang === "") {
          lang = "vn";
        }
        PandaCmd.Send.sendSlotLoginByUrl(partner, accessToken, lang);
      } else {
        let nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        let accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        PandaCmd.Send.sendSlotLogin(nickName, accessToken);
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

