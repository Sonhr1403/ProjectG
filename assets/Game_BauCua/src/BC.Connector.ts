const { ccclass, property } = cc._decorator;
import cmd from "./BauCua.Cmd"
@ccclass
export default class BCConnector extends BGUI.Connector {
    public static get instance(): BCConnector {
        let ret = cc.Canvas.instance.node.getComponent(BCConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(BCConnector);
            // CC_DEV || CC_DEBUG
            if (false) {
                BCConnector.instance.HOST = "baucua-7kef7e.wiwatech.com";
                BCConnector.instance.PORT = 443;
            } else {
                if ( BGUI.GameConfigZ.configFirstGame && BGUI.GameConfigZ.configFirstGame["jsonData"]) {
                    BCConnector.instance.HOST = BGUI.GameConfigZ.configFirstGame['jsonData'].baucua.ip;
                    BCConnector.instance.PORT = BGUI.GameConfigZ.configFirstGame['jsonData'].baucua.port;
                } else {
                    const url = window.location.href;
                    let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                    if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                        BCConnector.instance.HOST = window.location.host + "/ws-baucua";
                        // BCConnector.instance.PORT = 443;
                        /// wss://baucua-global-boss.wiwatech.com/ws-baucua:443/websocket'
                    } else {
                        BGUI.UIPopupManager.instance.showPopupSmall("Param error!!!");
                    }
                }
            }
        }
        return ret;
    }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        if (success) {
            const url = window.location.href;
            let urlSearchParams = new URLSearchParams(url.split("?")[1]);
            if (url && url.includes("?") && urlSearchParams && urlSearchParams.get("accessToken")) {
                let partner = urlSearchParams.get("partner");
                let accessToken = urlSearchParams.get("accessToken");
                let lang = urlSearchParams.get("lang");
                if (!lang || lang === "") {
                    lang = "vn";
                }
                cmd.Send.sendBauCuaLoginByUrl(partner, accessToken, lang);
            } else {
                let nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
                let accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
                cmd.Send.sendBauCuaLogin(nickName, accessToken);
            }
            this.schedule(this.rewindDisconnectDetector)
        } else {
            this.unschedule(this.rewindDisconnectDetector)
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
