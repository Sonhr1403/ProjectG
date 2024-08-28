

const { ccclass, property } = cc._decorator;

const LANGUAGE_SPRITE = cc.Enum({
    VN: 0,
    EN: 1,
    MM: 2,
});
@ccclass("PrefabEDefined")
export default class PrefabEDefined {

    @property(cc.String)
    namePrefab: string = '';

    @property(cc.Prefab)
    prfDefined: cc.Prefab = null;

}
