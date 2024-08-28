import BundleDownLoad from "../../../framework/ui/BundleDownLoad";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleBauCau extends BundleDownLoad {

    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node) {
            node.runAction(cc.rotateBy(2, 360).repeatForever());
        }
    }

    _onClicked() {
        super._onClicked();
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;
        BGUI.UIScreenManager.instance.pushScreen(prefab, (res: cc.Component) => {
            res.node.name = this.prefabMainNameURL;
        });
    }

}
