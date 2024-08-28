import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import DragonTiger_GameManager from "../DragonTiger.GameManager";

class DragonTigerLoginByUrl extends BGUI.BaseOutPacket {
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

export class DragonTigerLogin extends BGUI.BaseOutPacket {
    public nickName: string;
    public accessToken: string;
    public app_id: number;

    public getCmdId(): number {
        return 1;
    }
    public putData(): void {
        this.putString(this.nickName);
        this.putString(this.accessToken);
        // this.putInt(this.app_id);
    }
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_Connector extends BGUI.Connector {
    public static get instance(): DragonTiger_Connector {
        let ret = cc.Canvas.instance.node.getComponent(DragonTiger_Connector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(DragonTiger_Connector);
            if (CC_DEV || CC_DEBUG) {
                DragonTiger_Connector.instance.HOST = "dragontiger-7kef7e.wiwatech.com";
                DragonTiger_Connector.instance.PORT = 443;
            } else {
                // lấy config từ api lobby
                if (BGUI.GameConfigZ.configFirstGame && BGUI.GameConfigZ.configFirstGame['jsonData']) {
                    DragonTiger_Connector.instance.HOST = BGUI.GameConfigZ.configFirstGame['jsonData'].dragontiger.ip;
                    DragonTiger_Connector.instance.PORT = BGUI.GameConfigZ.configFirstGame['jsonData'].dragontiger.port;
                } else {
                    const url = window.location.href;
                    let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                    if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                        // let domain = (new URL(url));
                        // domain = domain.hostname;
                        // domain = domain.hostname.replace('www.','');
                        BGUI.ZLog.log(window.location.host);
                        DragonTiger_Connector.instance.HOST = window.location.host + "/ws-dragontiger";
                    } else {
                        const url = window.location.href;
                        let urlSearchParams = new URLSearchParams(url.split('?')[1]);
                        if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                            DragonTiger_GameManager.instance.maskClose.active = true
                            DragonTiger_GameManager.instance.lb_noti.string = 'Param error!!!'
                        } else {
                            BGUI.UIPopupManager.instance.showPopupSmall("Param error!!!");
                        }
                    }
                }
            }
        }
        return ret;
    }


    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        BGUI.ZLog.log("DragonTiger_Connector: " + success);
        if (success) {
            this.sendDragonTigerLogin();
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
        DragonTiger_Connector.instance.sendPacket(pk);
    }

    private sendDragonTigerLogin(): void {
        try {
            const url = window.location.href;
            let urlSearchParams = new URLSearchParams(url.split('?')[1]);
            if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("accessToken")) {
                let pk = new DragonTigerLoginByUrl();
                pk.partner = urlSearchParams.get("partner");
                pk.accessToken = urlSearchParams.get("accessToken");
                pk.appId = 11;
                pk.lang = urlSearchParams.get("lang");
                DragonTiger_Connector.instance.sendPacket(pk);
                BGUI.ZLog.log('sendDragonTigerLogin URL--->', pk)
            } else {
                let pk = new DragonTigerLogin();
                pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
                pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
                DragonTiger_Connector.instance.sendPacket(pk);
                BGUI.ZLog.log('sendDragonTigerLogin --->', pk)
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