import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import Bacarrat_GameManager from "../Bacarrat.GameManager";

class BacarratLoginByUrl extends BGUI.BaseOutPacket {
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

class BacarratLogin extends BGUI.BaseOutPacket {

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

const { ccclass, property } = cc._decorator;

@ccclass
export class Bacarrat_Connector extends BGUI.Connector {

    public static get instance(): Bacarrat_Connector {
        let ret = cc.Canvas.instance.node.getComponent(Bacarrat_Connector);

        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(Bacarrat_Connector);
            BGUI.ZLog.log('CC_DEV & CC_DEBUG  = ', CC_DEV, CC_DEBUG)

            if (CC_DEV || CC_DEBUG) {
                BGUI.ZLog.log(' Bacarrat_Connector vao CC_DEV CC_DEBUG');
                Bacarrat_Connector.instance.HOST = "baccarat-7kef7e.wiwatech.com";
                Bacarrat_Connector.instance.PORT = 443;
            } else {
                BGUI.ZLog.log(' Bacarrat_Connector vao config từ api lobby');
                // lấy config từ api lobby
                if (BGUI.GameConfigZ.configFirstGame && BGUI.GameConfigZ.configFirstGame['jsonData']) {
                    BGUI.ZLog.log('BGUI.GameConfigZ.configFirstGame BCRRRRRRRR = ', BGUI.GameConfigZ.configFirstGame['jsonData'].baccarat)
                    Bacarrat_Connector.instance.HOST = BGUI.GameConfigZ.configFirstGame['jsonData'].baccarat.ip;
                    Bacarrat_Connector.instance.PORT = BGUI.GameConfigZ.configFirstGame['jsonData'].baccarat.port;
                } else {
                    const url = window.location.href;
                    let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                    if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                        // let domain = (new URL(url));
                        // domain = domain.hostname;
                        // domain = domain.hostname.replace('www.','');
                        BGUI.ZLog.log(window.location.host);
                        Bacarrat_Connector.instance.HOST = window.location.host + "/ws-baccarat";
                    } else {
                        const url = window.location.href;
                        let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                        if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                            Bacarrat_GameManager.instance.maskClose.active = true
                            Bacarrat_GameManager.instance.lb_noti.string = 'Param error!!!'
                        } else {
                            BGUI.UIPopupManager.instance.showPopupSmall("Param error!!!");
                        }
                    }
                }
            }
        }

        return ret;
    }

    removeHttps(url) {
        return url.replace(/^https?:\/\//, '');
    }
    autoReconnect() {
        BGUI.ZLog.log("Bacarrat_Connector autoReconnect=======> " + Bacarrat_Connector.instance.isConnected());
        if (!Bacarrat_Connector.instance.isConnected()) return;
        Bacarrat_Connector.instance.disconnect();
        Bacarrat_Connector.instance.connect();
    }

    // onDisconnected(code) {
    //     super.onDisconnected(code);
    //     if (!Bacarrat_Connector.instance.isConnected()) {
    //         let mess = "Kết nối không ổn định!\nVui lòng kiểm tra lại kết nối wifi/3g"
    //         var listAction = [
    //             BGUI.PopupAction.make("OK", () => {
    //                 Bacarrat_Connector.instance.disconnect();
    //                 Bacarrat_Connector.instance.connect();
    //             }),
    //             BGUI.PopupAction.make("CLOSE", () => {
    //                 BGUI.GameCoreManager.instance.onBackToLobby();
    //             })
    //         ]
    //         BGUI.UIPopupManager.instance.showPopup(mess, listAction);
    //     }

    // }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        BGUI.ZLog.log("Bacarrat_Connector: " + success);
        if (success) {
            this.sendBacarratLogin();
            this.schedule(this.rewindDisconnectDetector);
        } else {
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString('lobby.warning.internet_unstable'));
            this.unschedule(this.rewindDisconnectDetector);
        }
    }

    sendJoinRoom() {

        let pk = new SendJoinRoomType();
        pk.id = 1;
        pk.moneyBet = 1;
        pk.minMoney = 1;
        pk.maxMoney = 1;
        pk.maxUserPerRoom = 1;
        Bacarrat_Connector.instance.sendPacket(pk);
    }

    private sendBacarratLogin(): void {
        try {
            const url = window.location.href;
            let urlSearchParams = new URLSearchParams(url.split('?')[1]);

            if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                let pk = new BacarratLoginByUrl();
                pk.partner = urlSearchParams.get("partner");
                pk.accessToken = urlSearchParams.get("accessToken");
                pk.appId = 11;
                pk.lang = urlSearchParams.get("lang");
                Bacarrat_Connector.instance.sendPacket(pk);
                BGUI.ZLog.log('sendBacarratLogin URL--->', pk)
            } else {
                let pk = new BacarratLogin();
                pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
                pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
                Bacarrat_Connector.instance.sendPacket(pk);
                BGUI.ZLog.log('sendBacarratLogin --->', pk)
            }
        } catch (error) {
            cc.error("Error:", error);
        }
    }

    sendPacket(pk: BGUI.BaseOutPacket): void {
        // if (!BGUI.GameCoreManager.instance.isLoginSuccess) {
        //     BGUI.ZLog.log('Need Login to send packet' + pk.getCmdId())
        //     return
        // }
        if (this.isConnected()) {
            BGUI.ZLog.log(pk)
            super.sendPacket(pk);
        } else {
            this.connect();
        }
    }
}

export class SendJoinRoomType extends BGUI.BaseOutPacket {
    public id: number
    public moneyBet: number
    public minMoney: number
    public maxMoney: number
    public maxUserPerRoom: number

    getCmdId(): number {
        return 3021;
    }

    putData(): void {
        this.putInt(this.id);
        this.putInt(this.moneyBet);
        this.putLong(this.minMoney);
        this.putInt(this.maxMoney);
        this.putInt(this.maxUserPerRoom);
    }
}