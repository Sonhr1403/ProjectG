
const { ccclass, property } = cc._decorator;

@ccclass
export default class GG extends cc.Component {
    onLoad(): void {
        BGUI.BundleManager.instance.loadBundleFromLocal("Lobby", null);
        BGUI.BundleManager.instance.loadBundleFromLocal("Chat", null);
        // BGUI.BundleManager.instance.loadBundleFromLocal("MiniLongHo", null);
        // BGUI.BundleManager.instance.loadBundleFromLocal("MiniBauCua", null);
    }

    onClicked() {
        let bundlez = "Lobby";
        let prfTX = "LobbySceneReal";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfTX, bundlez, (prefab: cc.Prefab) => {
            // BGUI.UIWindowManager.instance.showWindowFromPrefab(prefab)
            BGUI.UIScreenManager.instance.initWithRootPrefab(prefab);
        })
    }
}
