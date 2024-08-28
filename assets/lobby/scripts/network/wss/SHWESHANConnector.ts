
const { ccclass, property } = cc._decorator;

@ccclass
export default class SHWESHANConnector extends BGUI.Connector {

    public static get instance(): SHWESHANConnector {
        let ret = cc.Canvas.instance.node.getComponent(SHWESHANConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(SHWESHANConnector);
        }
        return ret;
    }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        BGUI.ZLog.log("SHWESHANConnector: " + success);
        if (success) {
            SHWESHANConnector.instance.sendLoginShweShan();
            this.schedule(this.rewindDisconnectDetector)
        } else {
            this.unschedule(this.rewindDisconnectDetector)
        }
    }

    public sendLoginShweShan() {
        let pk = new SHWESHANLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        // pk.nickName = "shantestv5";
        // pk.accessToken = "05d384c2ce0e39c05a0e2a5313e1e151";
        SHWESHANConnector.instance.sendPacket(pk);
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
export class SHWESHANLogin extends BGUI.BaseOutPacket {
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