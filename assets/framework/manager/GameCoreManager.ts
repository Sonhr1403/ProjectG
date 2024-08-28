// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LanguageMgr } from "../localize/LanguageMgr";



// const language = require('vn');

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCoreManager extends BGUI.GameCoreManager {
    @property(cc.Node)
    nMiniGames: cc.Node = null;

    @property(cc.Node)
    nWidgetShowJackpot: cc.Node = null;

    @property(cc.Node)
    nLayerMiniGame: cc.Node = null;

    @property(cc.String)
    gameName: string = '';

    @property(cc.Font)
    listFontCommon: cc.Font = null;

    @property(cc.Font)
    listFontLanguage: Array<cc.Font> = [];


    onLoad() {
        super.onLoad();
        LanguageMgr.updateLang();
        cc.view.resizeWithBrowserSize(true);
        cc.view.enableAutoFullScreen(true);
        BGUI.Utils.alignView();

        BGUI.ZLog.enable = true;
        BGUI.BundleManager.instance.loadBundleFromLocal("Lobby", (err, bundle) => {
            let bundlez = "Lobby";
            let prfLobby = "LobbySceneReal";
            BGUI.BundleManager.instance.getPrefabFromBundle(prfLobby, bundlez, (prefab: cc.Prefab) => {
                BGUI.UIScreenManager.instance.initWithRootPrefab(prefab, () => {
                    this.scheduleOnce(() => {
                        BGUI.EventDispatch.instance.emit("AUTO_LOGIN_BY_TOKEN");
                        BGUI.ZLog.log('AUTO_LOGIN_BY_TOKEN');
                    }, 1)
                });
            })
        })

        // BGUI.BundleManager.instance.loadBundleFromLocal("MoneyTrain2", (err, bundle) => {
        //     let bundlez = "MoneyTrain2";
        //     let prfLobby = "MoneyTrain2";
        //     BGUI.BundleManager.instance.getPrefabFromBundle(prfLobby, bundlez, (prefab: cc.Prefab) => {
        //         BGUI.UIScreenManager.instance.initWithRootPrefab(prefab, () => {
        //             this.scheduleOnce(() => {
        //                 BGUI.EventDispatch.instance.emit("AUTO_LOGIN_BY_TOKEN");
        //                 BGUI.ZLog.log('AUTO_LOGIN_BY_TOKEN');
        //             }, 1)
        //         });
        //     })
        // })

    }
}
