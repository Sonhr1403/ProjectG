import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import BundleDownLoad from "../../../framework/ui/BundleDownLoad";
import SHWESHANConnector from "../network/wss/SHWESHANConnector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleShweShan extends BundleDownLoad {

    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node) {
            node.runAction(cc.rotateBy(2, 360).repeatForever());
        }
    }

    _onClicked() {
        if (BGUI.GameCoreManager.instance.isLoginSuccess) {
            if (!SHWESHANConnector.instance.isConnected()) {
                SHWESHANConnector.instance.connect();
            }
        }
        super._onClicked();
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;
        if (BGUI.GameCoreManager.instance.isLoginSuccess) {
            if (SHWESHANConnector.instance.isConnected()) {
                BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
                    res.node.name = this.prefabMainNameURL;
                });
            } else {
                BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
                    res.node.name = this.prefabMainNameURL;
                    SHWESHANConnector.instance.connect();
                });
            }
        }
    }
}
