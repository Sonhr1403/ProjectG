import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import GenZMain from "../GZ.Controller";

const { ccclass, property } = cc._decorator;

class SlotGZLoginByUrl extends BGUI.BaseOutPacket {
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
export class GenZConnector extends BGUI.Connector {
  public static get instance(): GenZConnector {
    let ret = cc.Canvas.instance.node.getComponent(GenZConnector);
    if (!ret) {
      ret = cc.Canvas.instance.node.addComponent(GenZConnector);
      // if (CC_DEV || CC_DEBUG) {
      //   //chạy server 11 nhưng client run local

      //   // GenZConnector.instance.HOST = "172.16.10.6:2087";
      //   // GenZConnector.instance.PORT = -1;
      //   GenZConnector.instance.HOST =
      //     "slot-genz-global-boss.wiwatech.com" + "/ws-slot-genz";
      //   GenZConnector.instance.PORT = 0;
      // } else {
      //   // lấy config từ api lobby (chạy sv 11)
      //   if (
      //     BGUI.GameConfigZ.configFirstGame &&
      //     BGUI.GameConfigZ.configFirstGame["jsonData"]
      //   ) {
      //     GenZConnector.instance.HOST =
      //       BGUI.GameConfigZ.configFirstGame["jsonData"].slotgenz.ip;
      //     GenZConnector.instance.PORT =
      //       BGUI.GameConfigZ.configFirstGame["jsonData"].slotgenz.port;
      //   } else {
      // lấy config từ api lobby (chạy sv live)
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        GenZConnector.instance.HOST = 
        window.location.host + "/ws-slot-genz";
        // "slot-genz.wiwatech.com" + "/ws-slot-genz";
      } else {
        let msg = LanguageMgr.getString("genz.connection_error");
        GenZMain.instance.noti.active = true;
        GenZMain.instance.notiMsg.getComponent(cc.Label).string = msg;
      }
      // }
      // }
    }
    return ret;
  }

  // onDisconnected(code) {
  //   super.onDisconnected(code);
  //   GenZConnector.instance.removeCmdListener(this, 1);
  // }

  onDisconnected(code) {
    super.onDisconnected(code);
    if (!GenZConnector.instance.isConnected()) {
      let msg = LanguageMgr.getString("genz.connection_error");
      GenZMain.instance.noti.active = true;
      GenZMain.instance.notiMsg.getComponent(cc.Label).string = msg;
    }
  }

  onFinishConnect(success: boolean) {
    super.onFinishConnect(success);
    // BGUI.ZLog.log("GenZConnector: " + success);
    cc.error("V1.1.1");
    if (success) {
      this.sendSlotLogin();
      this.schedule(this.rewindDisconnectDetector);
    } else {
      let msg = LanguageMgr.getString("genz.connection_error");
      GenZMain.instance.noti.active = true;
      GenZMain.instance.notiMsg.getComponent(cc.Label).string = msg;
      this.unschedule(this.rewindDisconnectDetector);
    }
  }

  private sendSlotLogin(): void {
    try {
      const url = window.location.href;
      let urlSearchParams = new URLSearchParams(url.split("?")[1]);
      if (
        url &&
        url.includes("?") &&
        urlSearchParams &&
        urlSearchParams.get("accessToken")
      ) {
        let pk = new SlotGZLoginByUrl();
        pk.partner = urlSearchParams.get("partner");
        pk.accessToken = urlSearchParams.get("accessToken");
        pk.appId = 11;
        pk.lang = urlSearchParams.get("lang");
        if (!pk.lang || pk.lang === "") {
          pk.lang = "vn";
        }
        GenZConnector.instance.sendPacket(pk);
      } else {
        let pk = new SendSlotGZLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        GenZConnector.instance.sendPacket(pk);
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

class SendSlotGZLogin extends BGUI.BaseOutPacket {
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
