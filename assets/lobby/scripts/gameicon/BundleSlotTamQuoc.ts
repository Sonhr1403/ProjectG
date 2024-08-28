

import BundleDownLoad from "../../../framework/ui/BundleDownLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleSlotTamQuoc extends BundleDownLoad {

    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node) {
            node.runAction(cc.rotateBy(2, 360).repeatForever());
        }
    }

    _onClicked() {
        // if (BGUI.GameCoreManager.instance.isLoginSuccess) {
        //     if (!RouletteConnector.instance.isConnected()) {
        //         RouletteConnector.instance.connect();
        //     }
        // }
        super._onClicked();
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        // RouletteConnector.instance.setData(prefab, this.prefabMainNameURL)
        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;
        BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
                BGUI.UIWaitingLayout.hideWaiting();
                res.node.name = this.prefabMainNameURL;

            });
            // BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
            //     BGUI.UIWaitingLayout.hideWaiting();
            //     res.node.name = this.prefabMainNameURL;
            // });
        }

}
