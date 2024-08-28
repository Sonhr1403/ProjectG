

const { ccclass, property } = cc._decorator;
@ccclass()
export default class DropDownItem extends BGUI.DropDownItem {

    @property(cc.Label)
    public label: cc.Label = null;

    @property(cc.Sprite)
    public sprite: cc.Sprite = null;

    @property(cc.Toggle)
    public toggle: cc.Toggle = null;
}