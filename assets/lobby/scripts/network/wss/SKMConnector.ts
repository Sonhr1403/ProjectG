
const { ccclass, property } = cc._decorator;

@ccclass
export default class SKMConnector extends BGUI.Connector {
    public static get instance(): SKMConnector {
        let ret = cc.Canvas.instance.node.getComponent(SKMConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(SKMConnector);
        }
        return ret;
    }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        if (success) {
            SKMConnector.instance.sendSKMLogin();
            this.schedule(this.rewindDisconnectDetector)
        } else {
            this.unschedule(this.rewindDisconnectDetector)
        }
    }

    public sendSKMLogin(): void {
        let pk = new SKMLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        SKMConnector.instance.sendPacket(pk);
    }

    sendPacket(pk: BGUI.BaseOutPacket): void {
        if (!BGUI.GameCoreManager.instance.isLoginSuccess) {
            console.log('Need Login to send packet' + pk.getCmdId())
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

export class SKMLogin extends BGUI.BaseOutPacket {
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