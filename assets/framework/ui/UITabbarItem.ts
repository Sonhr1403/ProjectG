
const { ccclass, property } = cc._decorator;
@ccclass
export default class UITabbarItem extends BGUI.UITabbarItem {

    @property(cc.String)
    title: string = "";

    @property({
        type: cc.Prefab,
        visible: function (this: UITabbarItem) { return !this.isLoadFromUrl }
    })
    prefab: cc.Prefab = null;

    @property
    isLoadFromUrl: boolean = false;

    @property({
      
        visible: function (this: UITabbarItem) { return this.isLoadFromUrl }
    })
    featurePrefabUrl: string = '';

    @property({
      
        visible: function (this: UITabbarItem) { return this.isLoadFromUrl }
    })
    bundleName: string = '';

    @property(cc.Node)
    nodeContent: cc.Node = null;

    @property(cc.Node)
    nodeOn: cc.Node = null;

    @property(cc.Node)
    nodeOff: cc.Node = null;

}
