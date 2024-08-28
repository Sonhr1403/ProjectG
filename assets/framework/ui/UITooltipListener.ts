
const {ccclass, property} = cc._decorator;



@ccclass
export default class UITooltipListener extends BGUI.UITooltipListener {
    @property
    message: string = "";

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    target: cc.Node = null;

    @property({
        type: cc.Enum(BGUI.TooltipShowType)
    })
    showType: BGUI.TooltipShowType = BGUI.TooltipShowType.OnLongClick;

    
}
