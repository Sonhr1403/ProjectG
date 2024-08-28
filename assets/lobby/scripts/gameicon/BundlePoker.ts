
import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import BundleDownLoad from "../../../framework/ui/BundleDownLoad";
import { PokerConnector } from "../network/wss/PokerConnector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BundlePoker extends BundleDownLoad {

    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node) {
            node.runAction(cc.rotateBy(2, 360).repeatForever());
        }
    }

    _onClicked() {
        // if (BGUI.GameCoreManager.instance.isLoginSuccess) {
        //     if (!PokerConnector.instance.isConnected()) {
        //         PokerConnector.instance.connect();
        //     }
        // }
        super._onClicked();
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        // PokerConnector.instance.setData(prefab, this.prefabMainNameURL)
        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;
        BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
                BGUI.UIWaitingLayout.hideWaiting();
                res.node.name = this.prefabMainNameURL;
                if (!PokerConnector.instance.isConnected()) {
                    PokerConnector.instance.connect();
                }
            });
            // BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
            //     BGUI.UIWaitingLayout.hideWaiting();
            //     res.node.name = this.prefabMainNameURL;
            // });
        }

}
