
const { ccclass, property } = cc._decorator;

@ccclass
export default class UITableCell extends BGUI.UITableCell {
	@property(cc.Node)
	nSelected: cc.Node = null;

	@property(cc.Node)
	nDeselected: cc.Node = null;

	@property(cc.Node)
	nHighlighted: cc.Node = null;

	@property(cc.Node)
	nUnhighlighted: cc.Node = null;

	
}
