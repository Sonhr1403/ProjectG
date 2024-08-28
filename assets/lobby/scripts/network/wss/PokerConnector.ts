const { ccclass, property } = cc._decorator;

@ccclass
export class PokerConnector extends BGUI.Connector {
    // private _prefabMainNameURL: string;
    // private _prefabGame: cc.Prefab = null;

    public static get instance(): PokerConnector {
        let ret = cc.Canvas.instance.node.getComponent(PokerConnector);
        if (!ret) {
            ret = cc.Canvas.instance.node.addComponent(PokerConnector);
        }
        return ret;
    }

    // public setData(prefab: cc.Prefab, url: string) {
    //     this._prefabGame = prefab;
    //     this._prefabMainNameURL = url;
    // }

    // autoReconnect() {
    //     if (!PokerConnector.instance.isConnected()) return;
    //     PokerConnector.instance.disconnect();
    //     PokerConnector.instance.connect();
    // }

    onDisconnected(code) {
        // super.onDisconnected(code);
        // PokerConnector.instance.removeCmdListener(this, 1)
    }

    onFinishConnect(success: boolean) {
        PokerConnector.instance.addCmdListener(1, this.responsePokerLoginSuccess, this)
        super.onFinishConnect(success);
        BGUI.ZLog.log("PokerConnector: " + success);
        if (success) {
            this.sendPokerLogin();
            this.schedule(this.rewindDisconnectDetector);
        } else {
            BGUI.UIPopupManager.instance.showPopup("Kết nối không ổn định!\nVui lòng kiểm tra lại kết nối wifi/3g");
            this.unschedule(this.rewindDisconnectDetector);
        }
    }

    private responsePokerLoginSuccess() {
       this.sendGetListRooms();
    }

    private sendPokerLogin(): void {
        try {
            let pk = new SendPokerLogin();
            pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
            pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
            PokerConnector.instance.sendPacket(pk);
        } catch (error) {
            cc.error("Error:", error);
        }
    }

    private sendGetListRooms() {
        let pkg = new SendGetListRooms();
        PokerConnector.instance.sendPacket(pkg);
    }

    sendPacket(pk: BGUI.BaseOutPacket): void {
        if (!BGUI.GameCoreManager.instance.isLoginSuccess) {
            return
        }
        if (this.isConnected()) {
            super.sendPacket(pk);
        } else {
            this.connect();
        }
    }
}

class SendGetListRooms extends BGUI.BaseOutPacket {
    public player: number = 0;

    getCmdId(): number {
        return 3020;
    }

    putData(): void {
        this.putInt(0);
    }
}

class SendPokerLogin extends BGUI.BaseOutPacket {
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
