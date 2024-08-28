import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import BundleDownLoad from "../../../framework/ui/BundleDownLoad";
import SKMConnector from "../network/wss/SKMConnector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleShanKoeMee extends BundleDownLoad {
    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node) {
            node.runAction(cc.rotateBy(2, 360).repeatForever());
        }
    }

    _onClicked() {
        if (BGUI.GameCoreManager.instance.isLoginSuccess) {
            if (!SKMConnector.instance.isConnected()){
                SKMConnector.instance.connect();
            }
        }
        super._onClicked();
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;
        console.error("GGGG", cc.assetManager.bundles);
        if (BGUI.GameCoreManager.instance.isLoginSuccess) {
            if (SKMConnector.instance.isConnected()) {
                BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
                    res.node.name = this.prefabMainNameURL;
                });
            } else {
                BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
                    SKMConnector.instance.connect();
                    res.node.name = this.prefabMainNameURL;
                });
            }
        }
    }
}
