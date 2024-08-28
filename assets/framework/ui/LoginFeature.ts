
const { ccclass, property } = cc._decorator;
@ccclass
export default class LoginFeature extends BGUI.LoginFeature {
    @property
    tabIndex: number = 0;
    @property({ type: cc.Enum(BGUI.GUI_TYPE) })
    guiType: number = BGUI.GUI_TYPE.POPUP;

    @property({
        type: cc.Prefab,
        visible: function (this: LoginFeature) { return !this.isLoadFromUrl }
    })
    featurePrefab: cc.Prefab = null;

    @property
    isLoadFromUrl: boolean = true;

    @property({
      
        visible: function (this: LoginFeature) { return this.isLoadFromUrl }
    })
    featurePrefabUrl: string = '';

    @property({
      
        visible: function (this: LoginFeature) { return this.isLoadFromUrl }
    })
    bundleName: string = '';

    @property
    isNotLogin: boolean = false;


}
