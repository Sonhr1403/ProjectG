
import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import BundleDownLoad from "../../../framework/ui/BundleDownLoad";



const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleBacarrat extends BundleDownLoad {

    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node) {
            node.runAction(cc.rotateBy(2, 360).repeatForever());
        }
    }

    _onClicked() {
        if(BGUI.GameCoreManager.instance.isLoginSuccess){
            // if (!Bacarrat_Connector.instance.isConnected()) {
            //     Bacarrat_Connector.instance.connect();
            // }
        }
        super._onClicked();
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        // Bacarrat_Connector.instance.setData(prefab, this.prefabMainNameURL)
        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;

        // if (Bacarrat_Connector.instance.isConnected()) {
        //     BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
        //         BGUI.UIWaitingLayout.hideWaiting();
        //         res.node.name = this.prefabMainNameURL;
        //     });
        // } 

        BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
            BGUI.UIWaitingLayout.hideWaiting();
            res.node.name = this.prefabMainNameURL;
        });
    }

}
