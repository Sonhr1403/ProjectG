import BundleDownLoad from "../../../framework/ui/BundleDownLoad";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleMiniGame extends BundleDownLoad {

    onEnable() {
        super.onEnable();
        let node = this.prgLoadGame.node.getChildByName('progess');
        if (node)
            node.runAction(cc.rotateBy(2, 360).repeatForever());
    }

    onFuturePrefabLoadDone(prefab: cc.Prefab) {
        // if (!fzgui.GameCoreManager.instance.nLayerMiniGame.getChildByName(this.prefabMainNameURL)) {
        //     let node = cc.instantiate(prefab);
        //     node.name = this.prefabMainNameURL;
        //     fzgui.GameCoreManager.instance.nLayerMiniGame.addChild(node);
        // }

        if (cc.Canvas.instance.node.getChildByName(this.prefabMainNameURL)) return;
        BGUI.UIWindowManager.instance.showWindowFromPrefab(prefab, (res: cc.Component) => {
            res.node.name = this.prefabMainNameURL;
        });

    }
}
