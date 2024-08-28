import UITooltipManager from "./UITooltipManager";


const { ccclass, property } = cc._decorator;

export enum TooltipHideType {
    OnTouchDownOnScreen,
    OnTouchUpOrMoveFromTarget,
    Invalid
}

@ccclass
export default class UITooltipHandler extends BGUI.UITooltipHandler {

    @property
    followTarget: boolean = true;

    @property
    showAtTarget: boolean = false;

    @property({
        type: cc.Enum(TooltipHideType)
    })
    hideType: TooltipHideType = TooltipHideType.OnTouchDownOnScreen;

    manager: BGUI.UITooltipManager = null;


}
