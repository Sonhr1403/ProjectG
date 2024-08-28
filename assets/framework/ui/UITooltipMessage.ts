import UITooltipHandler from "./UITooltipHandler";



const {ccclass, property} = cc._decorator;

@ccclass
export default class UITooltipMessage extends UITooltipHandler {

    @property(cc.Sprite)
    spBubble: cc.Sprite = null;

    @property(cc.Label)
    lbMessage: cc.Label = null;

}
