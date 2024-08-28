import PrefabEDefined from "./PrefabEDefined";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonAssetDefined extends BGUI.CommonAssetDefined {

    //require==================
    @property(cc.Prefab)
    WAITING_LAYOUT: cc.Prefab = null;

    @property(cc.Prefab)
    BUTTON_COMMON: cc.Prefab = null;

    @property(cc.Prefab)
    FADED_BACKGROUND: cc.Prefab = null;

    @property(cc.Prefab)
    FADED_BACKGROUND_FADED: cc.Prefab = null;

    @property(cc.Prefab)
    CENTER_NOTIFICATION: cc.Prefab = null;

    @property(cc.Prefab)
    TEXT_FLY: cc.Prefab = null;

    @property(cc.Prefab)
    POPUP_COMMON: cc.Prefab = null;
    
    @property(cc.Prefab)
    TOOLTIP_MESSAGE: cc.Prefab = null;


    //END require==================

    @property(PrefabEDefined)
    listPrefabDefined: Array<PrefabEDefined> = [];

}
