const { ccclass, property } = cc._decorator;

@ccclass
export default class EmosUtils extends cc.Component {

    public static instance: EmosUtils = null;
    onLoad() {
        EmosUtils.instance = this;
    }

    @property(sp.SkeletonData)
    spfEmos: sp.SkeletonData = null;

    getEmos(id: number): sp.SkeletonData {
        return this.spfEmos[id]
    }
}
