
class BOOGYILogin extends BGUI.BaseOutPacket {
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
export default class BOOGYIConnector extends BGUI.Connector {

    public static get instance(): BOOGYIConnector {
        let ret = cc.Canvas.instance.node.getComponent(BOOGYIConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(BOOGYIConnector);
        }
        return ret;
    }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        BGUI.ZLog.log("BOOGYIConnector: " + success);
        if (success) {
            BOOGYIConnector.instance.sendBoogyiLogin();
            this.schedule(this.rewindDisconnectDetector);
        } else {
            this.unschedule(this.rewindDisconnectDetector);
        }
    }

    public sendBoogyiLogin(): void {
        try {
            let pk = new BOOGYILogin();
            pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
            pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
            // pk.nickName = "shantestv3";
            // pk.accessToken = "2e0bc7e7920eb2d63550303372b4d0eb";
            BOOGYIConnector.instance.sendPacket(pk);
        } catch (error) {
            cc.error("Error:", error);
        }
    }

    sendPacket(pk: BGUI.BaseOutPacket): void {
        if (!BGUI.GameCoreManager.instance.isLoginSuccess) {
            BGUI.ZLog.log('Need Login to send packet' + pk.getCmdId())
            return
        }
        if (this.isConnected()) {
            BGUI.ZLog.log(pk)
            super.sendPacket(pk);
        } else {
            this.connect();
        }
    }
}