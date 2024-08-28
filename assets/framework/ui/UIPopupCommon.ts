
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIPopupCommon extends BGUI.UIPopupCommon {

    @property(cc.Label)
    lbTitle: cc.Label = null;

    @property(cc.Label)
    lbContent: cc.Label = null;

    @property(cc.Node)
    nCustomView: cc.Node = null;

    @property(cc.Node)
    nActionContainer: cc.Node = null;

    buttons: Map<string, BGUI.UIButtonCommon> = new Map();

    @property(cc.Node)
    nSmall: cc.Node = null;
 
    @property(cc.Node)
    nBig: cc.Node = null;

    @property(cc.Label)
    lbContent_Small: cc.Label = null;

    @property(cc.Node)
    nActionContainerSmall: cc.Node = null;

 





}
