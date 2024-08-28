const { ccclass, property } = cc._decorator;
import { WukongCmd } from "../Wukong.Cmd";
import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
@ccclass
export class WukongConnector extends BGUI.Connector {
  public static get instance(): WukongConnector {
    let ret = cc.Canvas.instance.node.getComponent(WukongConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(WukongConnector);
      if (CC_DEV || CC_DEBUG) {
        //chạy server 11 nhưng client run local
        // WukongConnector.instance.HOST = "slotwukong-7kef7e.wiwatech.com";
        // WukongConnector.instance.PORT = 443;
        WukongConnector.instance.HOST =
          "slot-wukong.wiwatech.com" + "/ws-slot-wukong";
        WukongConnector.instance.PORT = -1;
      } else {
        // lấy config từ api lobby (chạy sv 11)
        if (
          BGUI.GameConfigZ.configFirstGame &&
          BGUI.GameConfigZ.configFirstGame["jsonData"]
        ) {
          WukongConnector.instance.HOST =
            BGUI.GameConfigZ.configFirstGame["jsonData"].slotwukong.ip;
          WukongConnector.instance.PORT =
            BGUI.GameConfigZ.configFirstGame["jsonData"].slotwukong.port;
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
            WukongConnector.instance.HOST =
              window.location.host + "/ws-slot-wukong";
          } else {
            let msg = LanguageMgr.getString("wukong.connection_error");
            BGUI.UIPopupManager.instance.showPopupSmall(msg);
          }
        }
      }
    }
    return ret;
  }

  // onDisconnected(code) {
  //   super.onDisconnected(code);
  //   WukongConnector.instance.removeCmdListener(this, 1);
  // }


  onDisconnected(code) {
        super.onDisconnected(code);
        if (!WukongConnector.instance.isConnected()) {
            let mess = "Kết nối không ổn định!\nVui lòng kiểm tra lại kết nối wifi/3g"
            var listAction = [
                BGUI.PopupAction.make("OK", () => {
                  WukongConnector.instance.disconnect();
                  WukongConnector.instance.connect();
                }),
                BGUI.PopupAction.make("CLOSE", () => {
                  WukongConnector.instance.removeCmdListener(this, 1);
                })
            ]
            BGUI.UIPopupManager.instance.showPopup(mess, listAction);
        }

    }



  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    BGUI.ZLog.log("WukongConnector: " + success);
    if (success) {
      this.sendSlotLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      BGUI.UIPopupManager.instance.showPopup(
        "Kết nối không ổn định!\nVui lòng kiểm tra lại kết nối wifi/3g"
      );
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
        var partner = urlSearchParams.get("partner");
        var accessToken = urlSearchParams.get("accessToken");
        var lang = urlSearchParams.get("lang");
        if (!lang || lang === "") {
          lang = "vn";
        }
        WukongCmd.Send.sendSlotLoginByUrl(partner, accessToken, lang);
      } else {
        let nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        let accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        WukongCmd.Send.sendSlotLogin(nickName, accessToken);
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
