
const { ccclass, property } = cc._decorator;
import cmd from "./../../../../Game_BauCua/src/BauCua.Cmd";
@ccclass
export default class BauCuaConnector extends BGUI.Connector {

    public static get instance(): BauCuaConnector {
        let ret = cc.Canvas.instance.node.getComponent(BauCuaConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(BauCuaConnector);
        }
        return ret;
    }

    onFinishConnect(success: boolean) {
        super.onFinishConnect(success);
        if (success) {
            this.sendBauCuaLogin();
            this.schedule(this.rewindDisconnectDetector)
        } else {
            this.unschedule(this.rewindDisconnectDetector)
        }
    }

    private sendBauCuaLogin() {
        let pk = new BauCuaLogin();
        pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
        pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
        BauCuaConnector.instance.sendPacket(pk);
    }

    sendPacket(pk: BGUI.BaseOutPacket): void {
        if (BGUI.GameCoreManager.instance.isLoginSuccess) {
            if (this.isConnected()) {
                super.sendPacket(pk);
            } else {
                this.connect();
            }
        }
    }
}

export class BauCuaLogin extends BGUI.BaseOutPacket {
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