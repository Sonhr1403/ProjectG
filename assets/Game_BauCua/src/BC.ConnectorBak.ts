const { ccclass, property } = cc._decorator;
import cmd from "./BauCua.Cmd"
@ccclass
export default class BCConnector extends BGUI.Connector {
    public static get instance(): BCConnector {
        let ret = cc.Canvas.instance.node.getComponent(BCConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(BCConnector);
            // if (CC_DEV || CC_DEBUG) {
            //     BCConnector.instance.HOST = "baucua-7kef7e.wiwatech.com";
            //     BCConnector.instance.PORT = 443;
            // } else {
            //     if ( BGUI.GameConfigZ.configFirstGame && BGUI.GameConfigZ.configFirstGame["jsonData"]) {
            //         BCConnector.instance.HOST = BGUI.GameConfigZ.configFirstGame['jsonData'].baucua.ip;
            //         BCConnector.instance.PORT = BGUI.GameConfigZ.configFirstGame['jsonData'].baucua.port;
            //     } else {
            //         const url = 'https://baucua-global-boss.wiwatech.com/?partner=global-boss&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDUxMTI4NTUsImlhdCI6MTY5NjQ3Mjg1NSwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDMiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMyIsImlkIjo2NTU3MjQ5fQ.UweMYki-gsoIargYqLTiywEXGawgdKlFmEFYWSwdLzM&lang=vn';
            //         let urlSearchParams = new URLSearchParams(url.split('?')[1]);
            //         if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
            //             BCConnector.instance.HOST = window.location.host + "/ws-baucua";
            //         } else {
            //             BGUI.UIPopupManager.instance.showPopupSmall("Param error!!!");
            //         }
            //     }
            // }
            const url = 'https://baucua-global-boss.wiwatech.com/?partner=global-boss&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDUxMTI4NTUsImlhdCI6MTY5NjQ3Mjg1NSwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDMiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMyIsImlkIjo2NTU3MjQ5fQ.UweMYki-gsoIargYqLTiywEXGawgdKlFmEFYWSwdLzM&lang=vn';
            let urlSearchParams = new URLSearchParams(url.split('?')[1]);
            if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                BCConnector.instance.HOST = 'baucua-global-boss.wiwatech.com/ws-baucua';
                // BCConnector.instance.PORT = 443;
            } else {
                BGUI.UIPopupManager.instance.showPopupSmall("Param error!!!");
            }
        }
        return ret;
    }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        if (success) {
            const url = 'https://baucua-global-boss.wiwatech.com/?partner=global-boss&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDUxMTI4NTUsImlhdCI6MTY5NjQ3Mjg1NSwiaXNzIjoiM3ZpdHc2MzUtbHV5Yi11M2JkLXdkaHBzaWw5dzc5NWg5bTkiLCJzdWIiOiJ0ZXN0X2FjY18wMDMiLCJuaWNrbmFtZSI6InRlc3RfYWNjXzAwMyIsImlkIjo2NTU3MjQ5fQ.UweMYki-gsoIargYqLTiywEXGawgdKlFmEFYWSwdLzM&lang=vn';
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
